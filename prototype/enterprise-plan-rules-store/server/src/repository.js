import Plan from './models/plan.js';
import PlanRule from './models/plan-rule.js';

export function createMongoRepository({ plans = Plan, rules = PlanRule } = {}) {
  return {
    listPlans: () => plans.find().sort({ provider: 1, name: 1 }).lean(),
    getPlan: (id) => plans.findById(id).lean(),
    createPlan: (data) => plans.create(data),
    updatePlan: (id, data) => plans.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),
    deletePlan: (id) => plans.findByIdAndDelete(id).lean(),
    isPlanReferenced: (id) => rules.exists({ $or: [{ fromPlan: id }, { toPlan: id }] }),
    listRules: () => rules.find().populate('fromPlan').populate('toPlan').sort({ fromPlan: 1, toPlan: 1, version: -1 }).lean(),
    getRule: (id) => rules.findById(id).populate('fromPlan').populate('toPlan').lean(),
    getRawRule: (id) => rules.findById(id).lean(),
    listPairRules: (fromPlan, toPlan) =>
      rules.find({ fromPlan, toPlan }).sort({ version: -1 }).lean(),
    findActiveRule: (fromPlan, toPlan, now) =>
      rules.findOne({
        fromPlan,
        toPlan,
        status: 'ACTIVE',
        effectiveFrom: { $lte: now },
        $or: [{ effectiveTo: null }, { effectiveTo: { $gt: now } }]
      }).populate('fromPlan').populate('toPlan').lean(),
    createRule: (data) => rules.create(data),
    updateRule: (id, data) => rules.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),
    retireOtherActiveRules: (fromPlan, toPlan, exceptId, effectiveTo) =>
      rules.updateMany(
        { fromPlan, toPlan, status: 'ACTIVE', _id: { $ne: exceptId } },
        { $set: { status: 'RETIRED', effectiveTo } }
      ),
    deleteRule: (id) => rules.findByIdAndDelete(id).lean()
  };
}
