import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api.js';
import SearchableSelect from './SearchableSelect.jsx';

const serviceOptions = ['Wireless', 'Internet'].map((value) => ({ value, label: value }));
const allowedOptions = [{ value: 'true', label: 'Allowed' }, { value: 'false', label: 'Not Allowed' }];
const statusOptions = [
  { value: 'ALL', label: 'All Revisions' }, { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' }, { value: 'RETIRED', label: 'Retired' }
];

function planOptions(plans) {
  return plans.map((plan) => ({
    value: plan._id,
    label: `${plan.name} · ${plan.provider}`,
    searchText: plan.serviceType
  }));
}

const emptyPlan = {
  provider: '',
  name: '',
  serviceType: 'Wireless',
  monthlyPrice: '',
  dataAllowance: '',
  contractTerm: 'Month-to-month',
  features: ''
};

function formatPrice(value) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
}

function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : 'Open-ended';
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PlanForm({ initial = emptyPlan, onSave, onCancel, readOnly = false }) {
  const [values, setValues] = useState({
    ...initial,
    features: Array.isArray(initial.features) ? initial.features.join(', ') : initial.features ?? ''
  });
  const [error, setError] = useState('');
  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await onSave({
        ...values,
        monthlyPrice: Number(values.monthlyPrice),
        features: values.features.split(',').map((feature) => feature.trim()).filter(Boolean)
      });
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <form className="record-form" onSubmit={submit}>
      <label>Provider<input required value={values.provider} onChange={update('provider')} readOnly={readOnly} /></label>
      <label>Plan Name<input required value={values.name} onChange={update('name')} readOnly={readOnly} /></label>
      <div className="form-grid">
        <label>Service Type
          <SearchableSelect options={serviceOptions} value={values.serviceType}
            onChange={(value) => setValues((current) => ({ ...current, serviceType: value }))} required disabled={readOnly} />
        </label>
        <label>Monthly Price (CAD)<input required type="number" min="0" step="0.01" value={values.monthlyPrice} onChange={update('monthlyPrice')} readOnly={readOnly} /></label>
      </div>
      <div className="form-grid">
        <label>Data Allowance<input required value={values.dataAllowance} onChange={update('dataAllowance')} readOnly={readOnly} /></label>
        <label>Contract Term<input required value={values.contractTerm} onChange={update('contractTerm')} readOnly={readOnly} /></label>
      </div>
      <label>Features <span className="field-hint">Separate features with commas</span>
        <textarea rows="3" value={values.features} onChange={update('features')} readOnly={readOnly} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button-muted" onClick={onCancel}>{readOnly ? 'Close' : 'Cancel'}</button>
        {!readOnly && <button className="button button-primary" type="submit">Save Plan</button>}
      </div>
    </form>
  );
}

function RuleForm({ plans, initial, prefill, onSave, onCancel }) {
  const [values, setValues] = useState({
    fromPlan: initial?.fromPlan?._id ?? initial?.fromPlan ?? prefill?.fromPlan ?? '',
    toPlan: initial?.toPlan?._id ?? initial?.toPlan ?? prefill?.toPlan ?? '',
    allowed: initial?.allowed ?? true,
    EDUFMessage: initial?.EDUFMessage ?? '',
    discountLossWarning: initial?.discountLossWarning ?? '',
    effectiveFrom: initial?.effectiveFrom ? formatDate(initial.effectiveFrom) : new Date().toISOString().slice(0, 10),
    effectiveTo: initial?.status !== 'RETIRED' && initial?.effectiveTo ? formatDate(initial.effectiveTo) : ''
  });
  const [error, setError] = useState('');
  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  const options = useMemo(() => planOptions(plans), [plans]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await onSave({
        ...values,
        effectiveFrom: new Date(`${values.effectiveFrom}T00:00:00.000Z`).toISOString(),
        effectiveTo: values.effectiveTo ? new Date(`${values.effectiveTo}T00:00:00.000Z`).toISOString() : null
      });
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <form className="record-form" onSubmit={submit}>
      <div className="form-grid">
        <label>From Plan
          <SearchableSelect options={options} value={values.fromPlan} onChange={(value) => setValues((current) => ({ ...current, fromPlan: value }))} required disabled={Boolean(initial)} placeholder="Select a plan" />
        </label>
        <label>To Plan
          <SearchableSelect options={options} value={values.toPlan} onChange={(value) => setValues((current) => ({ ...current, toPlan: value }))} required disabled={Boolean(initial)} placeholder="Select a plan" />
        </label>
      </div>
      <div className="form-grid">
        <label>Allowed
          <SearchableSelect options={allowedOptions} value={String(values.allowed)} onChange={(value) => setValues((current) => ({ ...current, allowed: value === 'true' }))} required />
        </label>
        <label>Effective From<input required type="date" value={values.effectiveFrom} onChange={update('effectiveFrom')} /></label>
      </div>
      <label>Effective To <span className="field-hint">Optional; leave blank for no scheduled end date</span>
        <input type="date" min={values.effectiveFrom} value={values.effectiveTo} onChange={update('effectiveTo')} />
      </label>
      <label>EDUF Message<textarea required rows="3" value={values.EDUFMessage} onChange={update('EDUFMessage')} /></label>
      <label>Discount Loss Warning<textarea required rows="3" value={values.discountLossWarning} onChange={update('discountLossWarning')} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button-muted" onClick={onCancel}>Cancel</button>
        <button className="button button-primary" type="submit">{initial ? 'Save New Revision' : 'Create Draft Rule'}</button>
      </div>
    </form>
  );
}

function PlanPage({ plans, onRefresh }) {
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');

  async function savePlan(data) {
    if (dialog.mode === 'edit') await api.updatePlan(dialog.record._id, data);
    else await api.createPlan(data);
    setDialog(null);
    setNotice(dialog.mode === 'edit' ? 'Service plan updated.' : 'Service plan created.');
    await onRefresh();
  }

  async function removePlan(plan) {
    if (!window.confirm(`Delete "${plan.name}"? Plans referenced by any rule revision cannot be deleted.`)) return;
    try {
      await api.deletePlan(plan._id);
      setNotice('Service plan deleted.');
      await onRefresh();
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">Catalogue</p><h2>Service Plans</h2><p className="page-description">Manage illustrative wireless and Internet plans used by plan eligibility rules.</p></div>
        <button className="button button-primary" onClick={() => setDialog({ mode: 'create' })}>＋ Add Plan</button>
      </div>
      {notice && <p className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></p>}
      <section className="table-card">
        <div className="table-scroll"><table>
          <thead><tr><th>Plan</th><th>Provider</th><th>Service Type</th><th>Monthly Price</th><th>Data</th><th>Contract</th><th>Actions</th></tr></thead>
          <tbody>{plans.map((plan) => <tr key={plan._id}>
            <td><strong>{plan.name}</strong></td><td>{plan.provider}</td><td><span className="type-pill">{plan.serviceType}</span></td>
            <td>{formatPrice(plan.monthlyPrice)}</td><td>{plan.dataAllowance}</td><td>{plan.contractTerm}</td>
            <td className="row-actions">
              <button className="text-button" onClick={() => setDialog({ mode: 'view', record: plan })}>View</button>
              <button className="text-button" onClick={() => setDialog({ mode: 'edit', record: plan })}>Edit</button>
              <button className="text-button text-danger" onClick={() => removePlan(plan)}>Delete</button>
            </td>
          </tr>)}</tbody>
        </table>{plans.length === 0 && <p className="empty-state">No service plans yet. Add a plan to get started.</p>}</div>
      </section>
      {dialog && <Modal title={dialog.mode === 'view' ? 'Service Plan Details' : dialog.mode === 'edit' ? 'Edit Service Plan' : 'Add Service Plan'} onClose={() => setDialog(null)}>
        <PlanForm initial={dialog.record ?? emptyPlan} readOnly={dialog.mode === 'view'} onSave={savePlan} onCancel={() => setDialog(null)} />
      </Modal>}
    </main>
  );
}

function RuleDetails({ rule, onClose }) {
  return <Modal title="Plan Rule Details" onClose={onClose} wide>
    <div className="detail-grid">
      <div><span className="detail-label">Relationship</span><strong>{rule.fromPlan?.name} <span aria-hidden="true">→</span> {rule.toPlan?.name}</strong></div>
      <div><span className="detail-label">Decision</span><strong>{rule.allowed ? 'Allowed' : 'Not Allowed'}</strong></div>
      <div><span className="detail-label">Status / Version</span><strong>{formatStatus(rule.status)} · v{rule.version}</strong></div>
      <div><span className="detail-label">Effective From</span><strong>{formatDate(rule.effectiveFrom)}</strong></div>
      <div><span className="detail-label">Effective To</span><strong>{formatDate(rule.effectiveTo)}</strong></div>
      <div className="detail-full"><span className="detail-label">EDUF Message</span><p>{rule.EDUFMessage}</p></div>
      <div className="detail-full"><span className="detail-label">Discount Loss Warning</span><p>{rule.discountLossWarning}</p></div>
      <div className="detail-full plan-comparison">
        {[['From Plan', rule.fromPlan], ['To Plan', rule.toPlan]].map(([heading, plan]) => <article key={heading}>
          <h3>{heading}</h3><p>{plan?.provider} · {plan?.serviceType}</p><p>{plan?.dataAllowance} · {formatPrice(plan?.monthlyPrice ?? 0)}/month</p>
        </article>)}
      </div>
    </div>
  </Modal>;
}

function RulePage({ plans, rules, onRefresh }) {
  const [dialog, setDialog] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [notice, setNotice] = useState('');
  const [lookupIds, setLookupIds] = useState({ fromPlan: '', toPlan: '' });
  const [lookup, setLookup] = useState(null);
  const lookupRequest = useRef(0);
  const options = useMemo(() => planOptions(plans), [plans]);
  const visibleRules = rules.filter((rule) => filter === 'ALL' || rule.status === filter);

  function changeLookup(field, value) {
    lookupRequest.current += 1;
    setLookupIds((current) => ({ ...current, [field]: value }));
    setLookup(null);
  }

  async function saveRule(data) {
    if (dialog.mode === 'edit') await api.createRevision(dialog.record._id, data);
    else await api.createRule(data);
    setDialog(null);
    setNotice(dialog.mode === 'edit' ? 'A new draft revision was created; the previous revision is retained.' : 'Draft plan rule created.');
    await onRefresh();
  }

  async function activate(rule) {
    try {
      await api.activateRule(rule._id);
      setNotice(`Version ${rule.version} is now active. Any prior active version was retained as retired.`);
      await onRefresh();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function removeRule(rule) {
    const action = rule.status === 'ACTIVE' ? 'Retire' : 'Delete';
    if (!window.confirm(`${action} rule version ${rule.version}?`)) return;
    try {
      await api.deleteRule(rule._id);
      setNotice(rule.status === 'ACTIVE' ? 'Active rule retired and retained in history.' : 'Rule revision deleted.');
      await onRefresh();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function inspectRelationship(event) {
    event.preventDefault();
    const requestId = ++lookupRequest.current;
    const checkedIds = { ...lookupIds };
    try {
      setLookup({ state: 'loading' });
      const relationship = await api.getRelationship(checkedIds.fromPlan, checkedIds.toPlan);
      if (requestId === lookupRequest.current) setLookup({ state: 'found', relationship });
    } catch (error) {
      if (requestId === lookupRequest.current) {
        setLookup(error.code === 'RULE_NOT_FOUND'
          ? { state: 'missing', message: error.message, ids: checkedIds }
          : { state: 'error', message: error.message });
      }
    }
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">Policy Configuration</p><h2>Plan Rules</h2><p className="page-description">Manage directional plan relationships, messages, and version history.</p></div>
        <button className="button button-primary" onClick={() => setDialog({ mode: 'create', prefill: lookup?.state === 'missing' ? lookup.ids : undefined })}>＋ Add Plan Rule</button>
      </div>
      {notice && <p className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></p>}

      <section className="lookup-card">
        <div><p className="eyebrow">Exact Directional Lookup</p><h3>Inspect Eligibility</h3><p>Reverse relationships are never inferred.</p></div>
        <form className="lookup-form" onSubmit={inspectRelationship}>
          <label>From Plan<SearchableSelect options={options} value={lookupIds.fromPlan} onChange={(value) => changeLookup('fromPlan', value)} required placeholder="Select plan" /></label>
          <span className="lookup-arrow" aria-hidden="true">→</span>
          <label>To Plan<SearchableSelect options={options} value={lookupIds.toPlan} onChange={(value) => changeLookup('toPlan', value)} required placeholder="Select plan" /></label>
          <button className="button button-dark" type="submit">Check Rule</button>
        </form>
        {lookup?.state === 'loading' && <p className="lookup-result" role="status">Checking exact relationship…</p>}
        {lookup?.state === 'missing' && <p className="lookup-result lookup-missing" role="alert">No active rule for this direction. {lookup.message}</p>}
        {lookup?.state === 'error' && <p className="lookup-result lookup-missing" role="alert">Unable to check the rule. {lookup.message}</p>}
        {lookup?.state === 'found' && <div className={`lookup-result ${lookup.relationship.allowed ? 'lookup-allowed' : 'lookup-denied'}`} role="status">
          <strong>{lookup.relationship.eligible ? 'Eligible' : 'Not Eligible'}</strong>
          <span>Rule v{lookup.relationship.version} · {lookup.relationship.fromPlan?.name} → {lookup.relationship.toPlan?.name}</span>
          <span>{lookup.relationship.EDUFMessage}</span>
          <span>{lookup.relationship.discountLossWarning}</span>
        </div>}
      </section>

      <section className="table-card">
        <div className="table-toolbar">
          <div><h3>Rule Revisions</h3><p>Every revision remains traceable by status and version.</p></div>
          <label className="filter-label">Status
            <SearchableSelect options={statusOptions} value={filter} onChange={setFilter} required />
          </label>
        </div>
        <div className="table-scroll"><table>
          <thead><tr><th>From Plan</th><th>To Plan</th><th>Decision</th><th>Status</th><th>Version</th><th>Effective From</th><th>Effective To</th><th>Actions</th></tr></thead>
          <tbody>{visibleRules.map((rule) => <tr key={rule._id}>
            <td>{rule.fromPlan?.name ?? 'Unknown Plan'}</td><td>{rule.toPlan?.name ?? 'Unknown Plan'}</td>
            <td><span className={`decision-pill ${rule.allowed ? 'decision-yes' : 'decision-no'}`}>{rule.allowed ? 'Allowed' : 'Not Allowed'}</span></td>
            <td><span className={`status-pill status-${rule.status.toLowerCase()}`}>{formatStatus(rule.status)}</span></td>
            <td>v{rule.version}</td><td>{formatDate(rule.effectiveFrom)}</td><td>{formatDate(rule.effectiveTo)}</td>
            <td className="row-actions">
              <button className="text-button" onClick={() => setSelectedRule(rule)}>View</button>
              <button className="text-button" onClick={() => setDialog({ mode: 'edit', record: rule })}>New Revision</button>
              {rule.status === 'DRAFT' && <button className="text-button" onClick={() => activate(rule)}>Activate</button>}
              <button className="text-button text-danger" onClick={() => removeRule(rule)}>{rule.status === 'ACTIVE' ? 'Retire' : 'Delete'}</button>
            </td>
          </tr>)}</tbody>
        </table>{visibleRules.length === 0 && <p className="empty-state">No rule revisions match this filter.</p>}</div>
      </section>
      {dialog && <Modal title={dialog.mode === 'edit' ? 'Create Rule Revision' : 'Add Plan Rule'} onClose={() => setDialog(null)} wide>
        <RuleForm plans={plans} initial={dialog.record} prefill={dialog.prefill} onSave={saveRule} onCancel={() => setDialog(null)} />
      </Modal>}
      {selectedRule && <RuleDetails rule={selectedRule} onClose={() => setSelectedRule(null)} />}
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState('plans');
  const [darkMode, setDarkMode] = useState(false);
  const [plans, setPlans] = useState([]);
  const [rules, setRules] = useState([]);
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const [nextPlans, nextRules] = await Promise.all([api.listPlans(), api.listRules()]);
      setPlans(nextPlans);
      setRules(nextRules);
      setLoadError('');
    } catch (error) {
      setLoadError(error.message);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="app-shell" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">ER</div>
        <div className="brand-copy"><h1>Enterprise Plan Rules Store</h1><p>Illustrative eligibility policy prototype</p></div>
        <span className="environment-badge">Synthetic Data</span>
        <button className="theme-toggle" type="button" aria-label="Dark mode" aria-pressed={darkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDarkMode((current) => !current)}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill={darkMode ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
          </svg>
        </button>
      </header>
      <nav className="main-nav" aria-label="Main navigation">
        <button className={page === 'plans' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('plans')}>Service Plans <span>{plans.length}</span></button>
        <button className={page === 'rules' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('rules')}>Plan Rules <span>{rules.length}</span></button>
      </nav>
      {loadError && <div className="global-error" role="alert">{loadError} Make sure the API server and MongoDB are running, then refresh.</div>}
      {page === 'plans' ? <PlanPage plans={plans} onRefresh={refresh} /> : <RulePage plans={plans} rules={rules} onRefresh={refresh} />}
      <footer className="app-footer">Prototype only · Synthetic data · Not production policy or legal guidance</footer>
    </div>
  );
}
