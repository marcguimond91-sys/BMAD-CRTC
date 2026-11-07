import 'dotenv/config';
import mongoose from 'mongoose';
import Plan from './models/plan.js';
import PlanRule from './models/plan-rule.js';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI must be set before seeding.');
  process.exit(1);
}

await mongoose.connect(mongoUri);

const samples = [
  {
    provider: 'Northstar Wireless (Illustrative)',
    name: 'Everyday 20 GB',
    serviceType: 'Wireless',
    monthlyPrice: 55,
    dataAllowance: '20 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '5G access']
  },
  {
    provider: 'Northstar Wireless (Illustrative)',
    name: 'Plus 60 GB',
    serviceType: 'Wireless',
    monthlyPrice: 75,
    dataAllowance: '60 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '5G access', 'International texting']
  },
  {
    provider: 'Northstar Internet (Illustrative)',
    name: 'Home Internet 100',
    serviceType: 'Internet',
    monthlyPrice: 60,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['100 Mbps download', 'Wi-Fi gateway included']
  },
  {
    provider: 'Northstar Internet (Illustrative)',
    name: 'Home Internet 500',
    serviceType: 'Internet',
    monthlyPrice: 85,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['500 Mbps download', 'Wi-Fi gateway included']
  }
];

const insertedPlans = [];
for (const sample of samples) {
  const existing = await Plan.findOne({ provider: sample.provider, name: sample.name });
  insertedPlans.push(existing ?? await Plan.create(sample));
}

if (await PlanRule.countDocuments() === 0) {
  const [wirelessBasic, wirelessPlus, internet100, internet500] = insertedPlans;
  await PlanRule.create([
    {
      fromPlan: wirelessBasic._id,
      toPlan: wirelessPlus._id,
      allowed: true,
      EDUFMessage: 'Illustrative: Your plan change is available.',
      discountLossWarning: 'No discount-loss warning for this example.',
      status: 'ACTIVE',
      effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
      version: 1
    },
    {
      fromPlan: wirelessPlus._id,
      toPlan: wirelessBasic._id,
      allowed: false,
      EDUFMessage: 'Illustrative: This plan change is not available.',
      discountLossWarning: 'A promotional discount may end if you change plans.',
      status: 'ACTIVE',
      effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
      version: 1
    },
    {
      fromPlan: internet100._id,
      toPlan: internet500._id,
      allowed: true,
      EDUFMessage: 'Illustrative: Your plan change is available.',
      discountLossWarning: 'No discount-loss warning for this example.',
      status: 'ACTIVE',
      effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
      version: 1
    }
  ]);
}

console.log(`Seeded ${insertedPlans.length} illustrative service plans.`);
await mongoose.disconnect();
