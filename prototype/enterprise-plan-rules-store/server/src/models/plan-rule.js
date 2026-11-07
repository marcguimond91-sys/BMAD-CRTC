import mongoose from 'mongoose';

const planRuleSchema = new mongoose.Schema(
  {
    fromPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    toPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    allowed: { type: Boolean, required: true },
    EDUFMessage: { type: String, required: true, trim: true },
    discountLossWarning: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['DRAFT', 'ACTIVE', 'RETIRED'],
      default: 'DRAFT'
    },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date, default: null },
    version: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

planRuleSchema.index(
  { fromPlan: 1, toPlan: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'ACTIVE' },
    name: 'one_active_revision_per_directional_pair'
  }
);
planRuleSchema.index({ fromPlan: 1, toPlan: 1, version: 1 }, { unique: true });

export default mongoose.models.PlanRule || mongoose.model('PlanRule', planRuleSchema);
