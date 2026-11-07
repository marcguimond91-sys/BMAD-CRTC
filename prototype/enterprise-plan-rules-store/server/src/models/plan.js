import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, enum: ['Wireless', 'Internet'] },
    monthlyPrice: { type: Number, required: true, min: 0 },
    dataAllowance: { type: String, required: true, trim: true },
    contractTerm: { type: String, required: true, trim: true },
    features: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model('Plan', planSchema);
