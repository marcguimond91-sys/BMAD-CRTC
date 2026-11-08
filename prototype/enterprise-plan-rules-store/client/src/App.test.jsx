import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App.jsx';
import { api } from './api.js';

vi.mock('./api.js', () => ({
  api: {
    listPlans: vi.fn(),
    createPlan: vi.fn(),
    updatePlan: vi.fn(),
    deletePlan: vi.fn(),
    listRules: vi.fn(),
    createRule: vi.fn(),
    createRevision: vi.fn(),
    activateRule: vi.fn(),
    deleteRule: vi.fn(),
    getRelationship: vi.fn()
  }
}));

const plans = [
  { _id: 'plan-a', provider: 'Illustrative Wireless', name: 'Everyday 20 GB', serviceType: 'Wireless', monthlyPrice: 55, dataAllowance: '20 GB', contractTerm: 'Month-to-month', features: ['5G'] },
  { _id: 'plan-b', provider: 'Illustrative Wireless', name: 'Plus 60 GB', serviceType: 'Wireless', monthlyPrice: 75, dataAllowance: '60 GB', contractTerm: 'Month-to-month', features: ['5G', 'Texting'] }
];
const rule = {
  _id: 'rule-a',
  fromPlan: plans[0],
  toPlan: plans[1],
  allowed: true,
  EDUFMessage: 'Illustrative change available.',
  discountLossWarning: 'No discount loss in this example.',
  status: 'ACTIVE',
  version: 1,
  effectiveFrom: '2026-01-01T00:00:00.000Z'
};

function setup(initialPlans = plans, initialRules = []) {
  api.listPlans.mockResolvedValue(initialPlans);
  api.listRules.mockResolvedValue(initialRules);
  return render(<App />);
}

function selectOption(input, optionName) {
  fireEvent.focus(input);
  fireEvent.click(screen.getByRole('option', { name: optionName }));
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('Enterprise Plan Rules Store UI', () => {
  it('shows the product title and navigates between separate plan and rule pages', async () => {
    setup();
    expect(await screen.findByRole('heading', { name: 'Enterprise Plan Rules Store' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Service Plans' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Plan Rules/ }));
    expect(screen.getByRole('heading', { name: 'Plan Rules' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Inspect Eligibility' })).toBeInTheDocument();
  });

  it('creates a service plan through the plan form and refreshes the listing', async () => {
    setup([]);
    fireEvent.click(await screen.findByRole('button', { name: /Add Plan/ }));
    fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'Demo Internet' } });
    fireEvent.change(screen.getByLabelText('Plan Name'), { target: { value: 'Home 300' } });
    fireEvent.change(screen.getByLabelText('Monthly Price (CAD)'), { target: { value: '65' } });
    fireEvent.change(screen.getByLabelText('Data Allowance'), { target: { value: 'Unlimited' } });
    fireEvent.change(screen.getByLabelText('Contract Term'), { target: { value: 'Month-to-month' } });
    fireEvent.change(screen.getByLabelText(/Features/), { target: { value: '300 Mbps, Wi-Fi' } });
    api.createPlan.mockResolvedValue({ _id: 'new-plan' });
    api.listPlans.mockResolvedValueOnce([]);
    fireEvent.click(screen.getByRole('button', { name: 'Save Plan' }));
    await waitFor(() => expect(api.createPlan).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Home 300',
      monthlyPrice: 65,
      features: ['300 Mbps', 'Wi-Fi']
    })));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(api.listPlans).toHaveBeenCalledTimes(2));
  });

  it('edits an existing service plan from its row', async () => {
    setup();
    fireEvent.click((await screen.findAllByRole('button', { name: 'Edit' }))[0]);
    fireEvent.change(screen.getByLabelText('Plan Name'), { target: { value: 'Everyday 25 GB' } });
    api.updatePlan.mockResolvedValue({ ...plans[0], name: 'Everyday 25 GB' });
    fireEvent.click(screen.getByRole('button', { name: 'Save Plan' }));
    await waitFor(() => expect(api.updatePlan).toHaveBeenCalledWith(
      'plan-a',
      expect.objectContaining({ name: 'Everyday 25 GB' })
    ));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows the API deletion constraint without silently removing the plan', async () => {
    setup();
    api.deletePlan.mockRejectedValue(new Error('This service plan is referenced by a rule revision and cannot be deleted.'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click((await screen.findAllByRole('button', { name: 'Delete' }))[0]);
    expect(await screen.findByRole('status')).toHaveTextContent('cannot be deleted');
    expect(screen.getByText('Everyday 20 GB')).toBeInTheDocument();
  });

  it('creates a draft plan rule and supports exact relationship lookup', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    const formDialog = within(screen.getByRole('dialog'));
    selectOption(formDialog.getByLabelText('From Plan'), /Everyday 20 GB/);
    selectOption(formDialog.getByLabelText('To Plan'), /Plus 60 GB/);
    fireEvent.change(formDialog.getByLabelText('Effective From'), { target: { value: '2026-12-01' } });
    fireEvent.change(formDialog.getByLabelText(/Effective To/), { target: { value: '2027-01-01' } });
    fireEvent.change(formDialog.getByLabelText('EDUF Message'), { target: { value: 'Illustrative update.' } });
    fireEvent.change(formDialog.getByLabelText('Discount Loss Warning'), { target: { value: 'No warning.' } });
    api.createRule.mockResolvedValue({ _id: 'new-rule' });
    fireEvent.click(screen.getByRole('button', { name: 'Create Draft Rule' }));
    await waitFor(() => expect(api.createRule).toHaveBeenCalledWith(expect.objectContaining({
      fromPlan: 'plan-a',
      toPlan: 'plan-b',
      allowed: true,
      EDUFMessage: 'Illustrative update.',
      effectiveFrom: '2026-12-01T00:00:00.000Z',
      effectiveTo: '2027-01-01T00:00:00.000Z'
    })));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(api.listRules).toHaveBeenCalledTimes(2));

    api.getRelationship.mockResolvedValue({ ...rule, eligible: true });
    selectOption(screen.getByLabelText('From Plan'), /Everyday 20 GB/);
    selectOption(screen.getByLabelText('To Plan'), /Plus 60 GB/);
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByText('Eligible')).toBeInTheDocument();
    expect(api.getRelationship).toHaveBeenCalledWith('plan-a', 'plan-b');
    expect(screen.getByText('Illustrative change available.')).toBeInTheDocument();
  });

  it('presents missing directional relationships as not found', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    api.getRelationship.mockRejectedValue(Object.assign(new Error('No active rule for this exact plan direction.'), { code: 'RULE_NOT_FOUND' }));
    selectOption(screen.getByLabelText('From Plan'), /Plus 60 GB/);
    selectOption(screen.getByLabelText('To Plan'), /Everyday 20 GB/);
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No active rule for this exact plan direction.');
  });

  it('presents an active denied relationship as not eligible', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    api.getRelationship.mockResolvedValue({
      ...rule,
      allowed: false,
      eligible: false,
      EDUFMessage: 'Illustrative denial.'
    });
    selectOption(screen.getByLabelText('From Plan'), /Everyday 20 GB/);
    selectOption(screen.getByLabelText('To Plan'), /Plus 60 GB/);
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByText('Not Eligible')).toBeInTheDocument();
    expect(screen.getByText('Illustrative denial.')).toBeInTheDocument();
  });

  it('shows rule revision actions and activates drafts', async () => {
    setup(plans, [{ ...rule, status: 'DRAFT' }]);
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Activate' }));
    await waitFor(() => expect(api.activateRule).toHaveBeenCalledWith('rule-a'));
  });

  it('saves rule edits as a new revision and retires an active revision through the UI', async () => {
    setup(plans, [rule]);
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    expect(screen.getByText('Active', { selector: 'span.status-pill' })).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: 'New Revision' }));
    const formDialog = within(screen.getByRole('dialog'));
    expect(formDialog.getByLabelText('From Plan')).toBeDisabled();
    expect(formDialog.getByLabelText('To Plan')).toBeDisabled();
    fireEvent.change(formDialog.getByLabelText('EDUF Message'), { target: { value: 'Updated illustrative explanation.' } });
    api.createRevision.mockResolvedValue({ ...rule, _id: 'rule-v2', version: 2, status: 'DRAFT' });
    fireEvent.click(formDialog.getByRole('button', { name: 'Save New Revision' }));
    await waitFor(() => expect(api.createRevision).toHaveBeenCalledWith('rule-a', expect.objectContaining({
      EDUFMessage: 'Updated illustrative explanation.'
    })));

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    api.deleteRule.mockResolvedValue({ retired: true });
    fireEvent.click(await screen.findByRole('button', { name: 'Retire' }));
    await waitFor(() => expect(api.deleteRule).toHaveBeenCalledWith('rule-a'));
  });

  it('prefills a missing checked pair in a new editable rule, and submits the edited pair', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    selectOption(screen.getByLabelText('From Plan'), /Everyday 20 GB/);
    selectOption(screen.getByLabelText('To Plan'), /Plus 60 GB/);
    api.getRelationship.mockRejectedValue(Object.assign(new Error('No effective active rule.'), { code: 'RULE_NOT_FOUND' }));
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No active rule');
    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByLabelText('From Plan')).toHaveValue('Everyday 20 GB · Illustrative Wireless');
    expect(dialog.getByLabelText('To Plan')).toHaveValue('Plus 60 GB · Illustrative Wireless');
    expect(dialog.getByLabelText('From Plan')).toBeEnabled();
    expect(dialog.getByLabelText('To Plan')).toBeEnabled();
    selectOption(dialog.getByLabelText('From Plan'), /Plus 60 GB/);
    selectOption(dialog.getByLabelText('To Plan'), /Everyday 20 GB/);
    fireEvent.change(dialog.getByLabelText('EDUF Message'), { target: { value: 'Example.' } });
    fireEvent.change(dialog.getByLabelText('Discount Loss Warning'), { target: { value: 'Example warning.' } });
    api.createRule.mockResolvedValue({});
    fireEvent.click(dialog.getByRole('button', { name: 'Create Draft Rule' }));
    await waitFor(() => expect(api.createRule).toHaveBeenCalledWith(expect.objectContaining({ fromPlan: 'plan-b', toPlan: 'plan-a' })));
  });

  it('does not prefill after a connection error or a changed lookup selection', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    selectOption(screen.getByLabelText('From Plan'), /Everyday 20 GB/);
    selectOption(screen.getByLabelText('To Plan'), /Plus 60 GB/);
    api.getRelationship.mockRejectedValue(new Error('Network failed'));
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to check the rule. Network failed');
    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    expect(within(screen.getByRole('dialog')).getByLabelText('From Plan')).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    api.getRelationship.mockRejectedValue(Object.assign(new Error('Missing.'), { code: 'RULE_NOT_FOUND' }));
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    await screen.findByText(/No active rule for this direction/);
    selectOption(screen.getByLabelText('From Plan'), /Plus 60 GB/);
    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    expect(within(screen.getByRole('dialog')).getByLabelText('From Plan')).toHaveValue('');
  });

  it('ignores a lookup result after its selected plans change', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    selectOption(screen.getByLabelText('From Plan'), /Everyday 20 GB/);
    selectOption(screen.getByLabelText('To Plan'), /Plus 60 GB/);
    let rejectLookup;
    api.getRelationship.mockReturnValue(new Promise((_, reject) => { rejectLookup = reject; }));
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    selectOption(screen.getByLabelText('From Plan'), /Plus 60 GB/);
    rejectLookup(Object.assign(new Error('Missing.'), { code: 'RULE_NOT_FOUND' }));
    await waitFor(() => expect(screen.queryByText(/No active rule for this direction/)).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    expect(within(screen.getByRole('dialog')).getByLabelText('From Plan')).toHaveValue('');
  });

  it('searches and selects dropdown options by keyboard, including service type, status and decision', async () => {
    setup(plans, [rule]);
    fireEvent.click(await screen.findByRole('button', { name: /Add Plan/ }));
    const service = screen.getByLabelText('Service Type');
    fireEvent.focus(service);
    fireEvent.change(service, { target: { value: 'inter' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    fireEvent.keyDown(service, { key: 'Enter' });
    expect(service).toHaveValue('Internet');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    fireEvent.click(screen.getByRole('button', { name: /Plan Rules/ }));
    const from = screen.getByLabelText('From Plan');
    fireEvent.focus(from);
    fireEvent.change(from, { target: { value: 'plus' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    fireEvent.keyDown(from, { key: 'Enter' });
    expect(from).toHaveValue('Plus 60 GB · Illustrative Wireless');
    const status = screen.getByLabelText('Status');
    fireEvent.focus(status);
    fireEvent.change(status, { target: { value: 'draft' } });
    fireEvent.keyDown(status, { key: 'Enter' });
    expect(screen.getByText('No rule revisions match this filter.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    const decision = within(screen.getByRole('dialog')).getByLabelText('Allowed');
    fireEvent.focus(decision);
    fireEvent.change(decision, { target: { value: 'not' } });
    fireEvent.keyDown(decision, { key: 'Enter' });
    expect(decision).toHaveValue('Not Allowed');
  });

  it('requires an actual option rather than arbitrary search text', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    const from = screen.getByLabelText('From Plan');
    fireEvent.focus(from);
    fireEvent.change(from, { target: { value: 'no matching plan' } });
    expect(screen.getByText('No matching options.')).toBeInTheDocument();
    expect(from.checkValidity()).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(api.getRelationship).not.toHaveBeenCalled();
  });

  it('toggles dark mode across navigation and dialogs', async () => {
    const { container } = setup();
    const toggle = await screen.findByRole('button', { name: 'Dark mode' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelector('.app-shell')).toHaveAttribute('data-theme', 'dark');
    fireEvent.click(screen.getByRole('button', { name: /Plan Rules/ }));
    fireEvent.click(screen.getByRole('button', { name: /Add Plan Rule/ }));
    expect(screen.getByRole('dialog').closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    fireEvent.click(toggle);
    expect(container.querySelector('.app-shell')).toHaveAttribute('data-theme', 'light');
  });
});
