import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { createApp } from '../src/app.js';
import { createDynamoRepository } from '../src/repository-dynamo.js';

const planA = '11111111-1111-4111-8111-111111111111';
const planB = '22222222-2222-4222-8222-222222222222';
const planC = '33333333-3333-4333-8333-333333333333';
const plan = (planId, name) => ({
  planId, name, marketingProductLine: 'Northstar Wireless', serviceType: 'Wireless',
  monthlyPrice: 40, dataAllowance: '10 GB', contractTerm: 'Month-to-month', features: new Set(['5G'])
});
const ruleInput = {
  fromPlan: planA, toPlan: planB, allowed: true, EDUFMessage: 'Example.',
  discountLossWarning: 'No warning.', effectiveFrom: '2026-01-01T00:00:00.000Z'
};

function setup() {
  const tables = {
    plans: [plan(planA, 'A'), plan(planB, 'B'), plan(planC, 'C')],
    rules: []
  };
  const client = {
    async send(command) {
      const { TableName, Key, Item, ExpressionAttributeValues = {}, ExclusiveStartKey } = command.input;
      const table = tables[TableName];
      if (command instanceof GetCommand) return { Item: table.find((item) => item.planId === Key.planId) };
      if (command instanceof PutCommand) {
        const key = TableName === 'plans' ? 'planId' : 'ruleId';
        const index = table.findIndex((item) => item[key] === Item[key]);
        if (index >= 0) table.splice(index, 1);
        table.push(Item);
        return {};
      }
      if (command instanceof DeleteCommand) {
        const key = TableName === 'plans' ? 'planId' : 'ruleId';
        const index = table.findIndex((item) => item[key] === Key[key] && (key === 'planId' || item.version === Key.version));
        if (index >= 0) table.splice(index, 1);
        return {};
      }
      if (command instanceof QueryCommand) {
        if (ExpressionAttributeValues[':ruleId'] === undefined && ExpressionAttributeValues[':pairKey'] === undefined) {
          throw new Error('Invalid key condition');
        }
        return { Items: table.filter((item) => item.ruleId === ExpressionAttributeValues[':ruleId'] || item.pairKey === ExpressionAttributeValues[':pairKey']) };
      }
      if (command instanceof ScanCommand) {
        const start = ExclusiveStartKey?.offset ?? 0;
        const page = table.slice(start, start + 1);
        const items = page.filter((item) => {
          if (ExpressionAttributeValues[':id']) return item.fromPlanId === ExpressionAttributeValues[':id'] || item.toPlanId === ExpressionAttributeValues[':id'];
          if (ExpressionAttributeValues[':fromPlanId']) return item.fromPlanId === ExpressionAttributeValues[':fromPlanId'] && item.toPlanId === ExpressionAttributeValues[':toPlanId'];
          return true;
        });
        return { Items: items, LastEvaluatedKey: start + 1 < table.length ? { offset: start + 1 } : undefined };
      }
      throw new Error(`Unexpected command: ${command.constructor.name}`);
    }
  };
  const repository = createDynamoRepository({ docClient: client, plansTableName: 'plans', rulesTableName: 'rules' });
  return { app: createApp({ repository, clock: () => new Date('2026-11-17T12:00:00Z') }), tables };
}

describe('DynamoDB CRUD', () => {
  it('creates, revises, activates, retires and deletes a rule using its persisted identifier', async () => {
    const { app, tables } = setup();
    const created = await request(app).post('/api/plan-rules').send(ruleInput).expect(201);
    assert.ok(created.body._id);
    assert.equal(created.body.fromPlan._id, planA);
    assert.equal(tables.rules.length, 1);
    const revision = await request(app).put(`/api/plan-rules/${created.body._id}`)
      .send({ ...ruleInput, effectiveTo: '2026-12-01T00:00:00Z' }).expect(201);
    assert.equal(revision.body.version, 2);
    const activated = await request(app).post(`/api/plan-rules/${revision.body._id}/activate`).expect(200);
    assert.equal(activated.body.effectiveTo, Date.parse('2026-12-01T00:00:00Z'));
    await request(app).get(`/api/plan-rules/${planA}/${planB}`).expect(200);
    await request(app).delete(`/api/plan-rules/${revision.body._id}`).expect(200);
    assert.equal(tables.rules.find((item) => item.ruleId === revision.body._id).status, 'RETIRED');
    await request(app).delete(`/api/plan-rules/${created.body._id}`).expect(204);
    assert.equal(tables.rules.length, 1);
  });

  it('checks both directions across scan pages and deletes only unreferenced plans', async () => {
    const { app } = setup();
    await request(app).post('/api/plan-rules').send({ ...ruleInput, fromPlan: planB, toPlan: planC }).expect(201);
    await request(app).post('/api/plan-rules').send(ruleInput).expect(201);
    const listed = await request(app).get('/api/plans').expect(200);
    assert.equal(listed.body.length, 3);
    assert.deepEqual(listed.body[0].features, ['5G']);
    const updated = await request(app).put(`/api/plans/${planA}`)
      .send({ ...listed.body[0], name: 'Updated', features: [] }).expect(200);
    assert.deepEqual(updated.body.features, []);
    assert.deepEqual((await request(app).get(`/api/plans/${planA}`).expect(200)).body.features, []);
    assert.equal((await request(app).get('/api/plan-rules').expect(200)).body.length, 2);
    await request(app).delete(`/api/plans/${planA}`).expect(409);
    await request(app).delete(`/api/plans/${planC}`).expect(409);
    const rules = await request(app).get('/api/plan-rules').expect(200);
    for (const rule of rules.body) await request(app).delete(`/api/plan-rules/${rule._id}`).expect(204);
    await request(app).delete(`/api/plans/${planA}`).expect(204);
    assert.equal((await request(app).get('/api/plans').expect(200)).body.length, 2);
  });
});
