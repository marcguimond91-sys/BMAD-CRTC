async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.error ?? `Request failed with status ${response.status}.`);
    error.code = body.code;
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  listPlans: () => request('/api/plans'),
  createPlan: (data) => request('/api/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => request(`/api/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id) => request(`/api/plans/${id}`, { method: 'DELETE' }),
  listRules: () => request('/api/plan-rules'),
  createRule: (data) => request('/api/plan-rules', { method: 'POST', body: JSON.stringify(data) }),
  createRevision: (id, data) => request(`/api/plan-rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  activateRule: (id) => request(`/api/plan-rules/${id}/activate`, { method: 'POST' }),
  deleteRule: (id) => request(`/api/plan-rules/${id}`, { method: 'DELETE' }),
  getRelationship: (fromPlanId, toPlanId) =>
    request(`/api/plan-rules/${fromPlanId}/${toPlanId}`)
};
