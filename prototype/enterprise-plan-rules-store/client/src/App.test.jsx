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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
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
    fireEvent.change(formDialog.getByLabelText('From Plan'), { target: { value: 'plan-a' } });
    fireEvent.change(formDialog.getByLabelText('To Plan'), { target: { value: 'plan-b' } });
    fireEvent.change(formDialog.getByLabelText('EDUF Message'), { target: { value: 'Illustrative update.' } });
    fireEvent.change(formDialog.getByLabelText('Discount Loss Warning'), { target: { value: 'No warning.' } });
    api.createRule.mockResolvedValue({ _id: 'new-rule' });
    fireEvent.click(screen.getByRole('button', { name: 'Create Draft Rule' }));
    await waitFor(() => expect(api.createRule).toHaveBeenCalledWith(expect.objectContaining({
      fromPlan: 'plan-a',
      toPlan: 'plan-b',
      allowed: true,
      EDUFMessage: 'Illustrative update.'
    })));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    api.getRelationship.mockResolvedValue({ ...rule, eligible: true });
    fireEvent.change(screen.getByLabelText('From Plan'), { target: { value: 'plan-a' } });
    fireEvent.change(screen.getByLabelText('To Plan'), { target: { value: 'plan-b' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByText('Eligible')).toBeInTheDocument();
    expect(api.getRelationship).toHaveBeenCalledWith('plan-a', 'plan-b');
    expect(screen.getByText('Illustrative change available.')).toBeInTheDocument();
  });

  it('presents missing directional relationships as not found', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: /Plan Rules/ }));
    api.getRelationship.mockRejectedValue(new Error('No active rule for this exact plan direction.'));
    fireEvent.change(screen.getByLabelText('From Plan'), { target: { value: 'plan-b' } });
    fireEvent.change(screen.getByLabelText('To Plan'), { target: { value: 'plan-a' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check Rule' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No active rule for this exact plan direction.');
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
    fireEvent.click(await screen.findByRole('button', { name: 'New Revision' }));
    const formDialog = within(screen.getByRole('dialog'));
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
});
