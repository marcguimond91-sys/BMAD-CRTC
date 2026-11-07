import express from 'express';
import mongoose from 'mongoose';
import { createMongoRepository } from './repository.js';

const planFields = ['provider', 'name', 'serviceType', 'monthlyPrice', 'dataAllowance', 'contractTerm'];
const ruleFields = ['fromPlan', 'toPlan', 'allowed', 'EDUFMessage', 'discountLossWarning', 'effectiveFrom'];
const validStatuses = new Set(['DRAFT', 'ACTIVE', 'RETIRED']);

class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function isId(value) {
  return typeof value === 'string' && mongoose.isObjectIdOrHexString(value);
}

function requiredText(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `${field} is required.`, 'VALIDATION_ERROR');
  }
  return value.trim();
}

function validatePlan(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'A service plan object is required.', 'VALIDATION_ERROR');
  }
  for (const field of planFields) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new HttpError(400, `${field} is required.`, 'VALIDATION_ERROR');
    }
  }
  const serviceType = requiredText(input.serviceType, 'serviceType');
  if (!['Wireless', 'Internet'].includes(serviceType)) {
    throw new HttpError(400, 'serviceType must be Wireless or Internet.', 'VALIDATION_ERROR');
  }
  const monthlyPrice = input.monthlyPrice;
  if (typeof monthlyPrice !== 'number' || !Number.isFinite(monthlyPrice) || monthlyPrice < 0) {
    throw new HttpError(400, 'monthlyPrice must be a non-negative number.', 'VALIDATION_ERROR');
  }
  const features = input.features ?? [];
  if (!Array.isArray(features) || features.some((feature) => typeof feature !== 'string')) {
    throw new HttpError(400, 'features must be an array of strings.', 'VALIDATION_ERROR');
  }
  return {
    provider: requiredText(input.provider, 'provider'),
    name: requiredText(input.name, 'name'),
    serviceType,
    monthlyPrice,
    dataAllowance: requiredText(input.dataAllowance, 'dataAllowance'),
    contractTerm: requiredText(input.contractTerm, 'contractTerm'),
    features: features.map((feature) => feature.trim()).filter(Boolean)
  };
}

function validateRule(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'A plan rule object is required.', 'VALIDATION_ERROR');
  }
  for (const field of ruleFields) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      throw new HttpError(400, `${field} is required.`, 'VALIDATION_ERROR');
    }
  }
  if (!isId(input.fromPlan) || !isId(input.toPlan)) {
    throw new HttpError(400, 'fromPlan and toPlan must be valid plan identifiers.', 'VALIDATION_ERROR');
  }
  if (input.fromPlan.toLowerCase() === input.toPlan.toLowerCase()) {
    throw new HttpError(400, 'A plan relationship must connect two different plans.', 'VALIDATION_ERROR');
  }
  if (typeof input.allowed !== 'boolean') {
    throw new HttpError(400, 'allowed must be a boolean.', 'VALIDATION_ERROR');
  }
  const effectiveFrom = new Date(input.effectiveFrom);
  if (Number.isNaN(effectiveFrom.getTime())) {
    throw new HttpError(400, 'effectiveFrom must be a valid date.', 'VALIDATION_ERROR');
  }
  const effectiveTo = input.effectiveTo ? new Date(input.effectiveTo) : null;
  if (effectiveTo && (Number.isNaN(effectiveTo.getTime()) || effectiveTo <= effectiveFrom)) {
    throw new HttpError(400, 'effectiveTo must be a valid date later than effectiveFrom.', 'VALIDATION_ERROR');
  }
  const status = input.status ?? 'DRAFT';
  if (!validStatuses.has(status)) {
    throw new HttpError(400, 'status must be DRAFT, ACTIVE, or RETIRED.', 'VALIDATION_ERROR');
  }
  return {
    fromPlan: input.fromPlan,
    toPlan: input.toPlan,
    allowed: input.allowed,
    EDUFMessage: requiredText(input.EDUFMessage, 'EDUFMessage'),
    discountLossWarning: requiredText(input.discountLossWarning, 'discountLossWarning'),
    status,
    effectiveFrom,
    effectiveTo
  };
}

async function requirePlans(repository, fromPlan, toPlan) {
  const [from, to] = await Promise.all([repository.getPlan(fromPlan), repository.getPlan(toPlan)]);
  if (!from || !to) {
    throw new HttpError(400, 'Both fromPlan and toPlan must reference existing service plans.', 'INVALID_PLAN_REFERENCE');
  }
}

function normalizeError(error) {
  if (error instanceof HttpError) return error;
  if (error?.code === 11000) {
    if (error.keyPattern?.version || error.message?.includes('fromPlan_1_toPlan_1_version_1')) {
      return new HttpError(409, 'A rule revision with this pair and version already exists. Retry the revision request.', 'RULE_VERSION_CONFLICT');
    }
    return new HttpError(409, 'An active rule already exists for this exact from-plan/to-plan pair.', 'DUPLICATE_ACTIVE_PAIR');
  }
  if (error?.name === 'ValidationError' || error?.name === 'CastError') {
    return new HttpError(400, error.message, 'VALIDATION_ERROR');
  }
  if (error?.type === 'entity.parse.failed') {
    return new HttpError(400, 'Request body must contain valid JSON.', 'INVALID_JSON');
  }
  if (error?.type === 'entity.too.large') {
    return new HttpError(413, 'Request body exceeds the allowed size.', 'PAYLOAD_TOO_LARGE');
  }
  return new HttpError(500, 'An unexpected server error occurred.', 'INTERNAL_ERROR');
}

export function createApp({ repository = createMongoRepository(), clock = () => new Date() } = {}) {
  const app = express();
  app.use(express.json({ limit: '100kb', strict: false }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.get('/api/plans', async (_request, response, next) => {
    try {
      response.json(await repository.listPlans());
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/plans', async (request, response, next) => {
    try {
      response.status(201).json(await repository.createPlan(validatePlan(request.body)));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/plans/:id', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Plan identifier is invalid.', 'INVALID_ID');
      const plan = await repository.getPlan(request.params.id);
      if (!plan) throw new HttpError(404, 'Service plan was not found.', 'PLAN_NOT_FOUND');
      response.json(plan);
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/plans/:id', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Plan identifier is invalid.', 'INVALID_ID');
      const plan = await repository.updatePlan(request.params.id, validatePlan(request.body));
      if (!plan) throw new HttpError(404, 'Service plan was not found.', 'PLAN_NOT_FOUND');
      response.json(plan);
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/plans/:id', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Plan identifier is invalid.', 'INVALID_ID');
      const plan = await repository.getPlan(request.params.id);
      if (!plan) throw new HttpError(404, 'Service plan was not found.', 'PLAN_NOT_FOUND');
      if (await repository.isPlanReferenced(request.params.id)) {
        throw new HttpError(409, 'This service plan is referenced by a rule revision and cannot be deleted.', 'PLAN_IN_USE');
      }
      await repository.deletePlan(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/plan-rules', async (_request, response, next) => {
    try {
      response.json(await repository.listRules());
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/plan-rules', async (request, response, next) => {
    try {
      const data = validateRule(request.body);
      await requirePlans(repository, data.fromPlan, data.toPlan);
      if (data.status === 'ACTIVE' && data.effectiveTo && data.effectiveTo <= clock()) {
        throw new HttpError(409, 'An expired rule cannot be activated.', 'RULE_EXPIRED');
      }
      const pairRules = await repository.listPairRules(data.fromPlan, data.toPlan);
      const version = pairRules.reduce((highest, rule) => Math.max(highest, rule.version), 0) + 1;
      const created = await repository.createRule({ ...data, version });
      if (data.status === 'ACTIVE') {
        await repository.retireOtherActiveRules(data.fromPlan, data.toPlan, created._id, clock());
      }
      response.status(201).json(await repository.getRule(created._id));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/plan-rules/:fromPlanId/:toPlanId', async (request, response, next) => {
    try {
      const { fromPlanId, toPlanId } = request.params;
      if (!isId(fromPlanId) || !isId(toPlanId)) {
        throw new HttpError(400, 'Both plan identifiers must be valid.', 'INVALID_ID');
      }
      const rule = await repository.findActiveRule(fromPlanId, toPlanId, clock());
      if (!rule) {
        throw new HttpError(404, 'No effective active rule exists for this exact plan direction.', 'RULE_NOT_FOUND');
      }
      response.json({
        ...rule,
        eligible: rule.allowed,
        fromPlan: rule.fromPlan,
        toPlan: rule.toPlan
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/eligibility/:fromPlanId/:toPlanId', async (request, response, next) => {
    try {
      const { fromPlanId, toPlanId } = request.params;
      if (!isId(fromPlanId) || !isId(toPlanId)) {
        throw new HttpError(400, 'Both plan identifiers must be valid.', 'INVALID_ID');
      }
      const rule = await repository.findActiveRule(fromPlanId, toPlanId, clock());
      if (!rule) {
        response.json({
          eligible: false,
          reason: 'NO_ACTIVE_RULE',
          explanation: 'No effective active rule exists for this exact plan direction.'
        });
        return;
      }
      response.json({
        eligible: rule.allowed,
        ruleId: rule._id,
        version: rule.version,
        status: rule.status,
        effectiveFrom: rule.effectiveFrom,
        effectiveTo: rule.effectiveTo,
        allowed: rule.allowed,
        EDUFMessage: rule.EDUFMessage,
        discountLossWarning: rule.discountLossWarning,
        fromPlan: rule.fromPlan,
        toPlan: rule.toPlan
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/plan-rules/:id', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Rule identifier is invalid.', 'INVALID_ID');
      const rule = await repository.getRule(request.params.id);
      if (!rule) throw new HttpError(404, 'Plan rule revision was not found.', 'RULE_NOT_FOUND');
      response.json(rule);
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/plan-rules/:id', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Rule identifier is invalid.', 'INVALID_ID');
      const existing = await repository.getRawRule(request.params.id);
      if (!existing) {
        throw new HttpError(404, 'Plan rule revision was not found.', 'RULE_NOT_FOUND');
      }
      const data = validateRule({ ...request.body, status: 'DRAFT' });
      if (
        String(existing.fromPlan).toLowerCase() !== data.fromPlan.toLowerCase()
        || String(existing.toPlan).toLowerCase() !== data.toPlan.toLowerCase()
      ) {
        throw new HttpError(400, 'A rule revision cannot change its from-plan/to-plan direction.', 'RULE_DIRECTION_IMMUTABLE');
      }
      await requirePlans(repository, data.fromPlan, data.toPlan);
      const pairRules = await repository.listPairRules(data.fromPlan, data.toPlan);
      const version = pairRules.reduce((highest, rule) => Math.max(highest, rule.version), 0) + 1;
      const revision = await repository.createRule({ ...data, status: 'DRAFT', version });
      response.status(201).json(await repository.getRule(revision._id));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/plan-rules/:id/activate', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Rule identifier is invalid.', 'INVALID_ID');
      const rule = await repository.getRawRule(request.params.id);
      if (!rule) throw new HttpError(404, 'Plan rule revision was not found.', 'RULE_NOT_FOUND');
      if (rule.status === 'RETIRED') {
        throw new HttpError(409, 'A retired rule revision cannot be activated.', 'RULE_RETIRED');
      }
      const now = clock();
      if (new Date(rule.effectiveFrom) > now) {
        throw new HttpError(409, 'A rule cannot be activated before its effective date.', 'RULE_NOT_YET_EFFECTIVE');
      }
      if (rule.effectiveTo && new Date(rule.effectiveTo) <= now) {
        throw new HttpError(409, 'An expired rule cannot be activated.', 'RULE_EXPIRED');
      }
      await repository.retireOtherActiveRules(rule.fromPlan, rule.toPlan, rule._id, now);
      const activated = await repository.updateRule(rule._id, { status: 'ACTIVE', effectiveTo: null });
      response.json(await repository.getRule(activated._id));
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/plan-rules/:id', async (request, response, next) => {
    try {
      if (!isId(request.params.id)) throw new HttpError(400, 'Rule identifier is invalid.', 'INVALID_ID');
      const rule = await repository.getRawRule(request.params.id);
      if (!rule) throw new HttpError(404, 'Plan rule revision was not found.', 'RULE_NOT_FOUND');
      if (rule.status === 'ACTIVE') {
        await repository.updateRule(rule._id, { status: 'RETIRED', effectiveTo: clock() });
        response.json({ retired: true, message: 'Active revision retired and retained in the revision history.' });
        return;
      }
      await repository.deleteRule(rule._id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _request, response, _next) => {
    const normalized = normalizeError(error);
    response.status(normalized.status).json({
      error: normalized.message,
      code: normalized.code
    });
  });

  return app;
}

export default createApp;
