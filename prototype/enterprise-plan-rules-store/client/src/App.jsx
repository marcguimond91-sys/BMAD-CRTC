import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api.js';
import SearchableSelect from './SearchableSelect.jsx';

const serviceOptions = ['Wireless', 'Internet'].map((value) => ({ value, label: value }));
const allowedOptions = [{ value: 'true', label: 'Allowed' }, { value: 'false', label: 'Not Allowed' }];
const statusOptions = [
  { value: 'ALL', label: 'All Revisions' }, { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' }, { value: 'RETIRED', label: 'Retired' }
];
const contractTermOptions = [
  { value: 'Month-to-month', label: 'Month-to-month' },
  { value: '12-month', label: '12-month' },
  { value: '24-month', label: '24-month' }
];
const marketingProductLineOptions = [
  { value: 'Northstar Wireless', label: 'Northstar Wireless' },
  { value: 'Northstar Internet', label: 'Northstar Internet' }
];

function planOptions(plans) {
  return plans.map((plan) => ({
    value: plan._id,
    label: `${plan.name} · ${plan.marketingProductLine}`,
    searchText: plan.serviceType
  }));
}

const emptyPlan = {
  marketingProductLine: '',
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

function Modal({ title, children, onClose, wide = false, busy = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (!busy && event.target === event.currentTarget) onClose();
    }}>
      <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} disabled={busy} aria-label="Close dialog">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PlanForm({ initial = emptyPlan, onSave, onCancel, readOnly = false, busy = false }) {
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
      <label>Marketing Product Line
        <SearchableSelect 
          options={marketingProductLineOptions}
          value={values.marketingProductLine}
          onChange={(value) => setValues((current) => ({ ...current, marketingProductLine: value }))}
          required 
          disabled={readOnly}
        />
      </label>
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
        <label>Contract Term
          <SearchableSelect 
            options={contractTermOptions}
            value={values.contractTerm}
            onChange={(value) => setValues((current) => ({ ...current, contractTerm: value }))}
            required 
            disabled={readOnly}
          />
        </label>
      </div>
      <label>Features <span className="field-hint">Separate features with commas</span>
        <textarea rows="3" value={values.features} onChange={update('features')} readOnly={readOnly} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button-muted" onClick={onCancel} disabled={busy}>{readOnly ? 'Close' : 'Cancel'}</button>
        {!readOnly && <button className="button button-primary" type="submit" disabled={busy}>Save Plan</button>}
      </div>
    </form>
  );
}

function RuleForm({ plans, initial, prefill, onSave, onCancel, busy = false }) {
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
        <button type="button" className="button button-muted" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="button button-primary" type="submit" disabled={busy}>{initial ? 'Save New Revision' : 'Create Draft Rule'}</button>
      </div>
    </form>
  );
}

function PlanPage({ plans, onRefresh }) {
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);

  async function savePlan(data) {
    setSaving(true);
    try {
      if (dialog.mode === 'edit') await api.updatePlan(dialog.record._id, data);
      else await api.createPlan(data);
      setDialog(null);
      setNotice(dialog.mode === 'edit' ? 'Service plan updated.' : 'Service plan created.');
      setCurrentPage(1);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  }

  async function removePlan(plan) {
    if (!window.confirm(`Delete "${plan.name}"? Plans referenced by any rule revision cannot be deleted.`)) return;
    try {
      await api.deletePlan(plan._id);
      setNotice('Service plan deleted.');
      await onRefresh();
      setCurrentPage(1);
    } catch (error) {
      setNotice(error.message);
    }
  }

  function sortPlans(plans) {
    return plans.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const sortedPlans = sortPlans([...plans]);
  const totalPages = Math.ceil(sortedPlans.length / rowsPerPage);
  const pageNumber = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (pageNumber - 1) * rowsPerPage;
  const paginatedPlans = sortedPlans.slice(startIndex, startIndex + rowsPerPage);

  return (
    <main className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">Catalogue</p><h2>Service Plans</h2><p className="page-description">Manage illustrative wireless and Internet plans used by plan eligibility rules.</p></div>
        <button className="button button-primary" onClick={() => setDialog({ mode: 'create' })}>＋ Add Plan</button>
      </div>
      {notice && <p className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></p>}
      <section className="table-card">
        <div className="table-toolbar">
          <div>
            <label>Sort by
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                <option value="name">Plan Name</option>
                <option value="marketingProductLine">Marketing Product Line</option>
                <option value="serviceType">Service Type</option>
                <option value="monthlyPrice">Monthly Price</option>
              </select>
            </label>
            <label>Order
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <label>Rows per page
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>
        <div className="table-scroll"><table>
          <thead><tr><th>Plan</th><th>Marketing Product Line</th><th>Service Type</th><th>Monthly Price</th><th>Data</th><th>Contract</th><th>Actions</th></tr></thead>
          <tbody>{paginatedPlans.map((plan) => <tr key={plan._id}>
            <td><strong>{plan.name}</strong></td><td>{plan.marketingProductLine}</td><td><span className="type-pill">{plan.serviceType}</span></td>
            <td>{formatPrice(plan.monthlyPrice)}</td><td>{plan.dataAllowance}</td><td>{plan.contractTerm}</td>
            <td className="row-actions">
              <button className="text-button" onClick={() => setDialog({ mode: 'view', record: plan })}>View</button>
              <button className="text-button" onClick={() => setDialog({ mode: 'edit', record: plan })}>Edit</button>
              <button className="text-button text-danger" onClick={() => removePlan(plan)}>Delete</button>
            </td>
          </tr>)}</tbody>
        </table>{sortedPlans.length === 0 && <p className="empty-state">No service plans yet. Add a plan to get started.</p>}</div>
        {sortedPlans.length > 0 && <div className="table-pagination">
          <span>Page {pageNumber} of {totalPages} | Total: {sortedPlans.length} plans</span>
          <div>
            <button disabled={pageNumber === 1} onClick={() => setCurrentPage(1)}>First</button>
            <button disabled={pageNumber === 1} onClick={() => setCurrentPage(pageNumber - 1)}>Previous</button>
            <button disabled={pageNumber === totalPages} onClick={() => setCurrentPage(pageNumber + 1)}>Next</button>
            <button disabled={pageNumber === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</button>
          </div>
        </div>}
      </section>
      {dialog && <Modal title={dialog.mode === 'view' ? 'Service Plan Details' : dialog.mode === 'edit' ? 'Edit Service Plan' : 'Add Service Plan'} onClose={() => setDialog(null)} busy={saving}>
        <PlanForm initial={dialog.record ?? emptyPlan} readOnly={dialog.mode === 'view'} onSave={savePlan} onCancel={() => setDialog(null)} busy={saving} />
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
          <h3>{heading}</h3><p>{plan?.marketingProductLine} · {plan?.serviceType}</p><p>{plan?.dataAllowance} · {formatPrice(plan?.monthlyPrice ?? 0)}/month</p>
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
  const [sortBy, setSortBy] = useState('fromPlan');
  const [sortOrder, setSortOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const lookupRequest = useRef(0);
  const options = useMemo(() => planOptions(plans), [plans]);
  const visibleRules = rules.filter((rule) => filter === 'ALL' || rule.status === filter);

  function changeLookup(field, value) {
    lookupRequest.current += 1;
    setLookupIds((current) => ({ ...current, [field]: value }));
    setLookup(null);
  }

  async function saveRule(data) {
    setSaving(true);
    try {
      if (dialog.mode === 'edit') await api.createRevision(dialog.record._id, data);
      else await api.createRule(data);
      setDialog(null);
      setNotice(dialog.mode === 'edit' ? 'A new draft revision was created; the previous revision is retained.' : 'Draft plan rule created.');
      setFilter('ALL');
      setCurrentPage(1);
      lookupRequest.current += 1;
      setLookup(null);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  }

  async function activate(rule) {
    try {
      await api.activateRule(rule._id);
      setNotice(`Version ${rule.version} is now active. Any prior active version was retained as retired.`);
      lookupRequest.current += 1;
      setLookup(null);
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
      lookupRequest.current += 1;
      setLookup(null);
      await onRefresh();
      setCurrentPage(1);
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

  function sortRules(rules) {
    return rules.sort((a, b) => {
      let aVal = sortBy === 'fromPlan' ? a.fromPlan?.name : sortBy === 'toPlan' ? a.toPlan?.name : a[sortBy];
      let bVal = sortBy === 'fromPlan' ? b.fromPlan?.name : sortBy === 'toPlan' ? b.toPlan?.name : b[sortBy];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const sortedRules = sortRules([...visibleRules]);
  const totalPages = Math.ceil(sortedRules.length / rowsPerPage);
  const pageNumber = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (pageNumber - 1) * rowsPerPage;
  const paginatedRules = sortedRules.slice(startIndex, startIndex + rowsPerPage);

  return (
    <main className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">Policy Configuration</p><h2>Plan Rules</h2><p className="page-description">Manage directional plan relationships, messages, and version history.</p></div>
        <button className="button button-primary" onClick={() => setDialog({ mode: 'create', prefill: lookupIds.fromPlan && lookupIds.toPlan && lookup?.state === 'missing' ? lookupIds : undefined })}>＋ Add Plan Rule</button>
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
          <div>
            <label>Status
              <SearchableSelect options={statusOptions} value={filter} onChange={(v) => { setFilter(v); setCurrentPage(1); }} required />
            </label>
            <label>Sort by
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                <option value="fromPlan">From Plan</option>
                <option value="toPlan">To Plan</option>
                <option value="allowed">Decision</option>
                <option value="status">Status</option>
                <option value="version">Version</option>
              </select>
            </label>
            <label>Order
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <label>Rows per page
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>
        <div className="table-scroll"><table>
          <thead><tr><th>From Plan</th><th>To Plan</th><th>Decision</th><th>Status</th><th>Version</th><th>Effective From</th><th>Effective To</th><th>Actions</th></tr></thead>
          <tbody>{paginatedRules.map((rule) => <tr key={rule._id}>
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
        </table>{sortedRules.length === 0 && <p className="empty-state">No rule revisions match this filter.</p>}</div>
        {sortedRules.length > 0 && <div className="table-pagination">
          <span>Page {pageNumber} of {totalPages} | Total: {sortedRules.length} rules</span>
          <div>
            <button disabled={pageNumber === 1} onClick={() => setCurrentPage(1)}>First</button>
            <button disabled={pageNumber === 1} onClick={() => setCurrentPage(pageNumber - 1)}>Previous</button>
            <button disabled={pageNumber === totalPages} onClick={() => setCurrentPage(pageNumber + 1)}>Next</button>
            <button disabled={pageNumber === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</button>
          </div>
        </div>}
      </section>
      {dialog && <Modal title={dialog.mode === 'edit' ? 'Create Rule Revision' : 'Add Plan Rule'} onClose={() => setDialog(null)} wide busy={saving}>
        <RuleForm plans={plans} initial={dialog.record} prefill={dialog.prefill} onSave={saveRule} onCancel={() => setDialog(null)} busy={saving} />
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
  const refreshRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++refreshRequest.current;
    const [nextPlans, nextRules] = await Promise.allSettled([api.listPlans(), api.listRules()]);
    if (requestId !== refreshRequest.current) return;
    if (nextPlans.status === 'fulfilled') setPlans(nextPlans.value);
    if (nextRules.status === 'fulfilled') setRules(nextRules.value);
    const errors = [nextPlans, nextRules].filter((result) => result.status === 'rejected');
    setLoadError(errors.map((result) => result.reason.message).join(' '));
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
      {loadError && <div className="global-error" role="alert">Unable to refresh all tables: {loadError} Check the API and database, then refresh the page.</div>}
      {page === 'plans' ? <PlanPage plans={plans} onRefresh={refresh} /> : <RulePage plans={plans} rules={rules} onRefresh={refresh} />}
      <footer className="app-footer">Prototype only · Synthetic data · Not production policy or legal guidance</footer>
    </div>
  );
}
