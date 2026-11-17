import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

export function createDynamoRepository({
  region = process.env.AWS_REGION || 'ca-central-1',
  plansTableName = process.env.DYNAMODB_PLANS_TABLE || 'BMAD-CRTC-PLANS',
  rulesTableName = process.env.DYNAMODB_RULES_TABLE || 'BMAD-CRTC-RULES',
  docClient = null
} = {}) {
  const client = docClient || DynamoDBDocumentClient.from(
    new DynamoDBClient({ region }),
    { marshallOptions: { removeUndefinedValues: true } }
  );

  const repo = {
    // Plans
    listPlans: async () => {
      try {
        const result = await client.send(new ScanCommand({
          TableName: plansTableName
        }));
        return (result.Items || []).sort((a, b) => {
          const providerCmp = a.provider.localeCompare(b.provider);
          return providerCmp !== 0 ? providerCmp : a.name.localeCompare(b.name);
        });
      } catch (error) {
        throw new Error(`Failed to list plans: ${error.message}`);
      }
    },

    getPlan: async (id) => {
      try {
        const result = await client.send(new GetCommand({
          TableName: plansTableName,
          Key: { planId: id }
        }));
        return result.Item || null;
      } catch (error) {
        throw new Error(`Failed to get plan: ${error.message}`);
      }
    },

    createPlan: async (data) => {
      const planId = uuid();
      const now = Date.now();
      const plan = {
        planId,
        ...data,
        features: Array.isArray(data.features) ? new Set(data.features) : new Set(),
        createdAt: now,
        updatedAt: now
      };

      try {
        await client.send(new PutCommand({
          TableName: plansTableName,
          Item: plan
        }));
        return { ...plan, features: Array.from(plan.features) };
      } catch (error) {
        throw new Error(`Failed to create plan: ${error.message}`);
      }
    },

    updatePlan: async (id, data) => {
      try {
        const existing = await repo.getPlan(id);
        if (!existing) return null;

        const updateData = {
          ...existing,
          ...data,
          features: Array.isArray(data.features) ? new Set(data.features) : new Set(existing.features || []),
          updatedAt: Date.now()
        };

        await client.send(new PutCommand({
          TableName: plansTableName,
          Item: updateData
        }));

        return { ...updateData, features: Array.from(updateData.features) };
      } catch (error) {
        throw new Error(`Failed to update plan: ${error.message}`);
      }
    },

    deletePlan: async (id) => {
      try {
        const existing = await repo.getPlan(id);
        if (!existing) return null;

        await client.send(new DeleteCommand({
          TableName: plansTableName,
          Key: { planId: id }
        }));

        return existing;
      } catch (error) {
        throw new Error(`Failed to delete plan: ${error.message}`);
      }
    },

    isPlanReferenced: async (id) => {
      try {
        const result = await client.send(new QueryCommand({
          TableName: rulesTableName,
          IndexName: 'PlanPairIndex',
          KeyConditionExpression: 'begins_with(pairKey, :prefix)',
          ExpressionAttributeValues: {
            ':prefix': `${id}#`
          },
          Limit: 1
        }));

        if ((result.Items || []).length > 0) return true;

        // Also check if this plan is a toPlan
        const result2 = await client.send(new ScanCommand({
          TableName: rulesTableName,
          FilterExpression: 'toPlanId = :toPlanId',
          ExpressionAttributeValues: {
            ':toPlanId': id
          },
          Limit: 1
        }));

        return (result2.Items || []).length > 0;
      } catch (error) {
        throw new Error(`Failed to check plan reference: ${error.message}`);
      }
    },

    // Rules
    listRules: async () => {
      try {
        const result = await client.send(new ScanCommand({
          TableName: rulesTableName
        }));

        const rules = result.Items || [];
        // Populate plan references (fetch plans in parallel)
        const planIds = new Set();
        rules.forEach(rule => {
          planIds.add(rule.fromPlanId);
          planIds.add(rule.toPlanId);
        });

        const plansMap = new Map();
        for (const planId of planIds) {
          const plan = await repo.getPlan(planId);
          if (plan) plansMap.set(planId, plan);
        }

        return rules
          .map(rule => ({
            ...rule,
            fromPlan: plansMap.get(rule.fromPlanId),
            toPlan: plansMap.get(rule.toPlanId)
          }))
          .sort((a, b) => {
            const aCmp = (a.fromPlanId || '').localeCompare(b.fromPlanId || '');
            if (aCmp !== 0) return aCmp;
            const bCmp = (a.toPlanId || '').localeCompare(b.toPlanId || '');
            if (bCmp !== 0) return bCmp;
            return (b.version || 0) - (a.version || 0);
          });
      } catch (error) {
        throw new Error(`Failed to list rules: ${error.message}`);
      }
    },

    getRule: async (id) => {
      try {
        const result = await client.send(new QueryCommand({
          TableName: rulesTableName,
          KeyConditionExpression: 'ruleId = :ruleId',
          ExpressionAttributeValues: { ':ruleId': id }
        }));

        if (!result.Items || result.Items.length === 0) return null;

        const rule = result.Items[0];
        const [fromPlan, toPlan] = await Promise.all([
          repo.getPlan(rule.fromPlanId),
          repo.getPlan(rule.toPlanId)
        ]);

        return { ...rule, fromPlan, toPlan };
      } catch (error) {
        throw new Error(`Failed to get rule: ${error.message}`);
      }
    },

    getRawRule: async (id) => {
      try {
        const result = await client.send(new QueryCommand({
          TableName: rulesTableName,
          KeyConditionExpression: 'ruleId = :ruleId',
          ExpressionAttributeValues: { ':ruleId': id }
        }));

        return (result.Items || [])[0] || null;
      } catch (error) {
        throw new Error(`Failed to get raw rule: ${error.message}`);
      }
    },

    listPairRules: async (fromPlanId, toPlanId) => {
      try {
        const pairKey = `${fromPlanId}#${toPlanId}`;
        const result = await client.send(new QueryCommand({
          TableName: rulesTableName,
          IndexName: 'PlanPairIndex',
          KeyConditionExpression: 'pairKey = :pairKey',
          ExpressionAttributeValues: { ':pairKey': pairKey }
        }));

        return (result.Items || []).sort((a, b) => (b.version || 0) - (a.version || 0));
      } catch (error) {
        throw new Error(`Failed to list pair rules: ${error.message}`);
      }
    },

    findActiveRule: async (fromPlanId, toPlanId, now) => {
      try {
        const pairKey = `${fromPlanId}#${toPlanId}`;
        const result = await client.send(new QueryCommand({
          TableName: rulesTableName,
          IndexName: 'PlanPairIndex',
          KeyConditionExpression: 'pairKey = :pairKey',
          FilterExpression: '#status = :status AND effectiveFrom <= :now AND (#effectiveTo IS NULL OR #effectiveTo > :now)',
          ExpressionAttributeNames: {
            '#status': 'status',
            '#effectiveTo': 'effectiveTo'
          },
          ExpressionAttributeValues: {
            ':pairKey': pairKey,
            ':status': 'ACTIVE',
            ':now': now.getTime()
          }
        }));

        if (!result.Items || result.Items.length === 0) return null;

        const rule = result.Items[0];
        const [fromPlan, toPlan] = await Promise.all([
          repo.getPlan(rule.fromPlanId),
          repo.getPlan(rule.toPlanId)
        ]);

        return { ...rule, fromPlan, toPlan };
      } catch (error) {
        throw new Error(`Failed to find active rule: ${error.message}`);
      }
    },

    createRule: async (data) => {
      const ruleId = uuid();
      const pairKey = `${data.fromPlan}#${data.toPlan}`;
      const now = Date.now();

      const rule = {
        ruleId,
        pairKey,
        version: data.version,
        fromPlanId: data.fromPlan,
        toPlanId: data.toPlan,
        allowed: data.allowed,
        EDUFMessage: data.EDUFMessage,
        discountLossWarning: data.discountLossWarning,
        status: data.status,
        effectiveFrom: data.effectiveFrom.getTime(),
        effectiveTo: data.effectiveTo ? data.effectiveTo.getTime() : null,
        createdAt: now,
        updatedAt: now
      };

      try {
        // Check for existing active rule with same pair
        if (data.status === 'ACTIVE') {
          const existing = await repo.listPairRules(data.fromPlan, data.toPlan);
          if (existing.some(r => r.status === 'ACTIVE')) {
            const error = new Error('An active rule already exists for this exact from-plan/to-plan pair.');
            error.code = 11000;
            error.keyPattern = { fromPlan: 1, toPlan: 1 };
            throw error;
          }
        }

        // Check for version conflict
        const existing = await repo.listPairRules(data.fromPlan, data.toPlan);
        if (existing.some(r => r.version === data.version)) {
          const error = new Error('A rule revision with this pair and version already exists.');
          error.code = 11000;
          error.message = 'A rule revision with this pair and version already exists. Retry the revision request.';
          throw error;
        }

        await client.send(new PutCommand({
          TableName: rulesTableName,
          Item: rule
        }));

        return rule;
      } catch (error) {
        throw error;
      }
    },

    updateRule: async (id, data) => {
      try {
        const existing = await repo.getRawRule(id);
        if (!existing) return null;

        const updated = {
          ...existing,
          ...data,
          updatedAt: Date.now()
        };

        await client.send(new PutCommand({
          TableName: rulesTableName,
          Item: updated
        }));

        return updated;
      } catch (error) {
        throw new Error(`Failed to update rule: ${error.message}`);
      }
    },

    retireOtherActiveRules: async (fromPlanId, toPlanId, exceptId, effectiveTo) => {
      try {
        const pairRules = await repo.listPairRules(fromPlanId, toPlanId);
        const rulesToRetire = pairRules.filter(r => r.status === 'ACTIVE' && r.ruleId !== exceptId);

        for (const rule of rulesToRetire) {
          await client.send(new PutCommand({
            TableName: rulesTableName,
            Item: {
              ...rule,
              status: 'RETIRED',
              effectiveTo: effectiveTo.getTime(),
              updatedAt: Date.now()
            }
          }));
        }
      } catch (error) {
        throw new Error(`Failed to retire other active rules: ${error.message}`);
      }
    },

    deleteRule: async (id) => {
      try {
        const existing = await repo.getRawRule(id);
        if (!existing) return null;

        await client.send(new DeleteCommand({
          TableName: rulesTableName,
          Key: { ruleId: id, version: existing.version }
        }));

        return existing;
      } catch (error) {
        throw new Error(`Failed to delete rule: ${error.message}`);
      }
    }
  };

  return repo;
}

export default createDynamoRepository;
