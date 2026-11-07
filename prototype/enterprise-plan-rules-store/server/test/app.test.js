import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const planA = '64b000000000000000000001';
const planB = '64b000000000000000000002';
const planC = '64b000000000000000000003';
const ruleId = (number) => `64c0000000000000000000${String(number).padStart(2, '0')}`;

function createMemoryRepository() {
  const plans = new Map([
    [planA, { _id: planA, provider: 'Example Wireless', name: 'Starter', serviceType: 'Wireless', monthlyPrice: 40, dataAllowance: '10 GB', contractTerm: 'Month-to-month', features: ['Calling'] }],
    [planB, { _id: planB, provider: 'Example Wireless', name: 'Plus', serviceType: 'Wireless', monthlyPrice: 70, dataAllowance: '50 GB', contractTerm: 'Month-to-month', features: ['Calling', '5G'] }],
    [planC, { _id: planC, provider: 'Example Internet', name: 'Home 500', serviceType: 'Internet', monthlyPrice: 80, dataAllowance: 'Unlimited', contractTerm: 'Month-to-month', features: ['Wi-Fi'] }]
  ]);
  const rules = new Map();
  let nextId = 1;
  const populate = (rule) => rule && ({
    ...rule,
    fromPlan: plans.get(rule.fromPlan),
    toPlan: plans.get(rule.toPlan)
  });
  return {
    plans,
    rules,
    repository: {
      listPlans: async () => [...plans.values()],
      getPlan: async (id) => plans.get(String(id)) ?? null,
      createPlan: async (data) => {
        const record = { ...data, _id: `64d00000000000000000${String(nextId++).padStart(4, '0')}` };
        plans.set(record._id, record);
        return record;
      },
      updatePlan: async (id, data) => {
        const existing = plans.get(String(id));
        if (!existing) return null;
        const updated = { ...existing, ...data };
        plans.set(String(id), updated);
        return updated;
      },
      deletePlan: async (id) => plans.delete(String(id)),
      isPlanReferenced: async (id) => [...rules.values()].some((rule) => rule.fromPlan === String(id) || rule.toPlan === String(id)),
      listRules: async () => [...rules.values()].map(populate),
      getRule: async (id) => populate(rules.get(String(id))),
      getRawRule: async (id) => rules.get(String(id)) ?? null,
      listPairRules: async (fromPlan, toPlan) =>
        [...rules.values()].filter((rule) => rule.fromPlan === String(fromPlan) && rule.toPlan === String(toPlan)).sort((a, b) => b.version - a.version),
      findActiveRule: async (fromPlan, toPlan, now) => {
        const match = [...rules.values()].find((rule) =>
          rule.fromPlan === String(fromPlan)
          && rule.toPlan === String(toPlan)
          && rule.status === 'ACTIVE'
          && new Date(rule.effectiveFrom) <= now
          && (!rule.effectiveTo || new Date(rule.effectiveTo) > now)
        );
        return populate(match);
      },
      createRule: async (data) => {
        if (data.status === 'ACTIVE' && [...rules.values()].some((rule) =>
          rule.fromPlan === String(data.fromPlan) && rule.toPlan === String(data.toPlan) && rule.status === 'ACTIVE'
        )) {
          const error = new Error('duplicate key');
          error.code = 11000;
          throw error;
        }
        const record = { ...data, fromPlan: String(data.fromPlan), toPlan: String(data.toPlan), _id: ruleId(nextId++) };
        rules.set(record._id, record);
        return record;
      },
      updateRule: async (id, data) => {
        const existing = rules.get(String(id));
        if (!existing) return null;
        const updated = { ...existing, ...data };
        rules.set(String(id), updated);
        return updated;
      },
      retireOtherActiveRules: async (fromPlan, toPlan, exceptId, effectiveTo) => {
        for (const [id, rule] of rules) {
          if (id !== String(exceptId) && rule.fromPlan === String(fromPlan) && rule.toPlan === String(toPlan) && rule.status === 'ACTIVE') {
            rules.set(id, { ...rule, status: 'RETIRED', effectiveTo });
          }
        }
      },
      deleteRule: async (id) => rules.delete(String(id))
    }
  };
}

const ruleInput = (overrides = {}) => ({
  fromPlan: planA,
  toPlan: planB,
  allowed: true,
  EDUFMessage: 'Illustrative: change available.',
  discountLossWarning: 'No discount-loss warning.',
  effectiveFrom: '2026-01-01T00:00:00.000Z',
  ...overrides
});

describe('plan and directional rule API', () => {
  let memory;
  let app;
  const now = new Date('2026-11-06T12:00:00.000Z');

  beforeEach(() => {
    memory = createMemoryRepository();
    app = createApp({ repository: memory.repository, clock: () => now });
  });

  it('creates, lists, edits, views, and deletes service plans', async () => {
    const plan = {
      provider: 'Sample ISP',
      name: 'Fiber 300',
      serviceType: 'Internet',
      monthlyPrice: 65,
      dataAllowance: 'Unlimited',
      contractTerm: 'Month-to-month',
      features: ['300 Mbps download']
    };
    const created = await request(app).post('/api/plans').send(plan).expect(201);
    assert.equal(created.body.name, plan.name);
    assert.equal((await request(app).get('/api/plans').expect(200)).body.length, 4);
    assert.equal((await request(app).get(`/api/plans/${created.body._id}`).expect(200)).body.name, plan.name);
    const updated = await request(app).put(`/api/plans/${created.body._id}`).send({ ...plan, name: 'Fiber 500' }).expect(200);
    assert.equal(updated.body.name, 'Fiber 500');
    await request(app).delete(`/api/plans/${created.body._id}`).expect(204);
    await request(app).get(`/api/plans/${created.body._id}`).expect(404);
  });

  it('rejects invalid plan data and prevents deleting plans referenced by a rule', async () => {
    await request(app).post('/api/plans').send({ name: 'Incomplete' }).expect(400);
    await request(app).post('/api/plan-rules').send(ruleInput()).expect(201);
    const response = await request(app).delete(`/api/plans/${planA}`).expect(409);
    assert.equal(response.body.code, 'PLAN_IN_USE');
    assert.equal(memory.plans.has(planA), true);
  });

  it('creates, lists, views, and deletes an exact directional rule draft', async () => {
    const created = await request(app).post('/api/plan-rules').send(ruleInput()).expect(201);
    assert.equal(created.body.version, 1);
    assert.equal(created.body.status, 'DRAFT');
    assert.equal((await request(app).get('/api/plan-rules').expect(200)).body.length, 1);
    assert.equal((await request(app).get(`/api/plan-rules/${created.body._id}`).expect(200)).body.fromPlan.name, 'Starter');
    await request(app).delete(`/api/plan-rules/${created.body._id}`).expect(204);
    assert.equal(memory.rules.size, 0);
  });

  it('rejects malformed rules, missing plan references, and a duplicate active pair', async () => {
    await request(app).post('/api/plan-rules').send(ruleInput({ fromPlan: 'not-an-id' })).expect(400);
    await request(app).post('/api/plan-rules').send(ruleInput({ fromPlan: planA.toUpperCase(), toPlan: planA })).expect(400);
    await request(app).post('/api/plan-rules').send(ruleInput({ allowed: 'yes' })).expect(400);
    await request(app).post('/api/plan-rules').send(ruleInput({ effectiveTo: 'not-a-date' })).expect(400);
    const missing = await request(app).post('/api/plan-rules').send(ruleInput({ fromPlan: '64b000000000000000000099' })).expect(400);
    assert.equal(missing.body.code, 'INVALID_PLAN_REFERENCE');
    await request(app).post('/api/plan-rules').send(ruleInput({ status: 'ACTIVE' })).expect(201);
    const duplicate = await request(app).post('/api/plan-rules').send(ruleInput({ status: 'ACTIVE' })).expect(409);
    assert.equal(duplicate.body.code, 'DUPLICATE_ACTIVE_PAIR');
  });

  it('returns the active relationship and plans only for the exact direction', async () => {
    await request(app).post('/api/plan-rules').send(ruleInput({ status: 'ACTIVE' })).expect(201);
    const found = await request(app).get(`/api/plan-rules/${planA}/${planB}`).expect(200);
    assert.equal(found.body.eligible, true);
    assert.equal(found.body.fromPlan.name, 'Starter');
    assert.equal(found.body.toPlan.name, 'Plus');
    assert.equal(found.body.status, 'ACTIVE');
    assert.equal(found.body.version, 1);
    assert.equal(found.body.effectiveFrom, '2026-01-01T00:00:00.000Z');
    assert.equal(found.body.discountLossWarning, 'No discount-loss warning.');
    assert.equal(found.body.EDUFMessage, 'Illustrative: change available.');
    await request(app).get(`/api/plan-rules/${planB}/${planA}`).expect(404);
    const missingEligibility = await request(app).get(`/api/eligibility/${planB}/${planA}`).expect(200);
    assert.equal(missingEligibility.body.eligible, false);
    assert.equal(missingEligibility.body.reason, 'NO_ACTIVE_RULE');
  });

  it('activates a draft as a new version while retaining the former active version', async () => {
    const active = await request(app).post('/api/plan-rules').send(ruleInput({ status: 'ACTIVE' })).expect(201);
    const draft = await request(app).post('/api/plan-rules').send(ruleInput({
      allowed: false,
      EDUFMessage: 'Updated illustrative decision.'
    })).expect(201);
    assert.equal(draft.body.version, 2);
    const activated = await request(app).post(`/api/plan-rules/${draft.body._id}/activate`).expect(200);
    assert.equal(activated.body.status, 'ACTIVE');
    assert.equal((await request(app).get(`/api/plan-rules/${planA}/${planB}`).expect(200)).body.version, 2);
    assert.equal(memory.rules.get(active.body._id).status, 'RETIRED');
    assert.ok(memory.rules.get(active.body._id).effectiveTo instanceof Date);
    assert.equal(memory.rules.size, 2);
  });

  it('saves edits as a new draft revision without overwriting the active version', async () => {
    const active = await request(app).post('/api/plan-rules').send(ruleInput({ status: 'ACTIVE' })).expect(201);
    const revision = await request(app).put(`/api/plan-rules/${active.body._id}`).send(ruleInput({
      allowed: false,
      EDUFMessage: 'New policy explanation.'
    })).expect(201);
    assert.equal(revision.body.version, 2);
    assert.equal(revision.body.status, 'DRAFT');
    assert.equal(memory.rules.get(active.body._id).status, 'ACTIVE');
    assert.equal((await request(app).get(`/api/plan-rules/${planA}/${planB}`).expect(200)).body.version, 1);
  });

  it('retires active rules when deleted, preserving their revision history', async () => {
    const active = await request(app).post('/api/plan-rules').send(ruleInput({ status: 'ACTIVE' })).expect(201);
    const result = await request(app).delete(`/api/plan-rules/${active.body._id}`).expect(200);
    assert.equal(result.body.retired, true);
    assert.equal(memory.rules.get(active.body._id).status, 'RETIRED');
    await request(app).get(`/api/plan-rules/${planA}/${planB}`).expect(404);
  });

  it('does not expose a rule before its effective date', async () => {
    await request(app).post('/api/plan-rules').send(ruleInput({
      status: 'ACTIVE',
      effectiveFrom: '2027-01-01T00:00:00.000Z'
    })).expect(201);
    await request(app).get(`/api/plan-rules/${planA}/${planB}`).expect(404);
  });
});
