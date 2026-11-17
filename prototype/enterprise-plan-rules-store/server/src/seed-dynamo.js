import 'dotenv/config';
import { createDynamoRepository } from './repository-dynamo.js';

const repository = createDynamoRepository();

// Realistic Canadian telecom plans (no trademark names)
const canadianPlans = [
  // Wireless Carriers - Wireless Plans
  {
    provider: 'Major Carrier East (Illustrative)',
    name: 'Essential Wireless 15 GB',
    serviceType: 'Wireless',
    monthlyPrice: 50,
    dataAllowance: '15 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'Voicemail included']
  },
  {
    provider: 'Major Carrier East (Illustrative)',
    name: 'Standard Wireless 50 GB',
    serviceType: 'Wireless',
    monthlyPrice: 70,
    dataAllowance: '50 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'International texting', 'Voicemail included']
  },
  {
    provider: 'Major Carrier East (Illustrative)',
    name: 'Premium Wireless Unlimited',
    serviceType: 'Wireless',
    monthlyPrice: 95,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '5G priority', 'International roaming included', 'Hotspot 20 GB']
  },
  {
    provider: 'Major Carrier West (Illustrative)',
    name: 'Value Wireless 20 GB',
    serviceType: 'Wireless',
    monthlyPrice: 55,
    dataAllowance: '20 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'SMS included']
  },
  {
    provider: 'Major Carrier West (Illustrative)',
    name: 'Plus Wireless 75 GB',
    serviceType: 'Wireless',
    monthlyPrice: 80,
    dataAllowance: '75 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '5G access', 'International texting', 'Hotspot 10 GB']
  },
  {
    provider: 'Regional Carrier (Illustrative)',
    name: 'Basic Wireless 10 GB',
    serviceType: 'Wireless',
    monthlyPrice: 45,
    dataAllowance: '10 GB',
    contractTerm: 'Month-to-month',
    features: ['Regional calling', '4G access']
  },
  {
    provider: 'Regional Carrier (Illustrative)',
    name: 'Enhanced Wireless 40 GB',
    serviceType: 'Wireless',
    monthlyPrice: 65,
    dataAllowance: '40 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'SMS included']
  },

  // Internet Services
  {
    provider: 'Major Carrier East (Illustrative)',
    name: 'Home Internet 100 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 65,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['100 Mbps download', 'Wi-Fi 6 router included', '24/7 support']
  },
  {
    provider: 'Major Carrier East (Illustrative)',
    name: 'Home Internet 500 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 85,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['500 Mbps download', 'Wi-Fi 6 router included', '24/7 support']
  },
  {
    provider: 'Major Carrier East (Illustrative)',
    name: 'Home Internet 1 Gbps',
    serviceType: 'Internet',
    monthlyPrice: 120,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['1 Gbps download', 'Wi-Fi 6E router included', 'Priority support']
  },
  {
    provider: 'Major Carrier West (Illustrative)',
    name: 'Residential Internet 150 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 70,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['150 Mbps download', 'Router included', 'Basic support']
  },
  {
    provider: 'Major Carrier West (Illustrative)',
    name: 'Residential Internet 600 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 95,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['600 Mbps download', 'Wi-Fi 6 router included', 'Technical support']
  },
  {
    provider: 'Regional Carrier (Illustrative)',
    name: 'Basic Internet 50 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 55,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['50 Mbps download', 'Router included']
  },
  {
    provider: 'Regional Carrier (Illustrative)',
    name: 'Standard Internet 250 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 75,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['250 Mbps download', 'Wi-Fi 5 router included', 'Support included']
  }
];

async function seedPlans() {
  console.log('Seeding DynamoDB with Canadian telecom plans...');
  const createdPlans = [];

  for (const plan of canadianPlans) {
    try {
      const created = await repository.createPlan(plan);
      createdPlans.push(created);
      console.log(`✓ Created plan: ${plan.provider} - ${plan.name}`);
    } catch (error) {
      console.error(`✗ Failed to create plan: ${plan.provider} - ${plan.name}: ${error.message}`);
    }
  }

  console.log(`\nSeeded ${createdPlans.length} plans total.`);
  return createdPlans;
}

async function seedRules(plans) {
  console.log('\nSeeding DynamoDB with plan transition rules...');
  const rulesMap = new Map();
  
  // Index plans by provider and name for easy reference
  for (const plan of plans) {
    const key = `${plan.provider}|${plan.name}`;
    rulesMap.set(key, plan.planId);
  }

  const rulesToCreate = [
    // Major Carrier East: Wireless upgrades allowed
    {
      from: 'Major Carrier East (Illustrative)|Essential Wireless 15 GB',
      to: 'Major Carrier East (Illustrative)|Standard Wireless 50 GB',
      allowed: true,
      edufMsg: 'Your upgrade to Standard Wireless 50 GB is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Major Carrier East (Illustrative)|Standard Wireless 50 GB',
      to: 'Major Carrier East (Illustrative)|Premium Wireless Unlimited',
      allowed: true,
      edufMsg: 'Your upgrade to Premium Wireless is available.',
      discount: 'No discount loss on this premium upgrade.'
    },
    {
      from: 'Major Carrier East (Illustrative)|Premium Wireless Unlimited',
      to: 'Major Carrier East (Illustrative)|Standard Wireless 50 GB',
      allowed: false,
      edufMsg: 'Downgrades from Premium plans require account review.',
      discount: 'You may lose premium discounts if you downgrade.'
    },
    {
      from: 'Major Carrier East (Illustrative)|Essential Wireless 15 GB',
      to: 'Major Carrier East (Illustrative)|Premium Wireless Unlimited',
      allowed: true,
      edufMsg: 'Your upgrade to Premium Wireless is available.',
      discount: 'No discount loss on this upgrade.'
    },

    // Major Carrier East: Internet upgrades allowed
    {
      from: 'Major Carrier East (Illustrative)|Home Internet 100 Mbps',
      to: 'Major Carrier East (Illustrative)|Home Internet 500 Mbps',
      allowed: true,
      edufMsg: 'Your speed upgrade is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Major Carrier East (Illustrative)|Home Internet 500 Mbps',
      to: 'Major Carrier East (Illustrative)|Home Internet 1 Gbps',
      allowed: true,
      edufMsg: 'Your upgrade to Gigabit service is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Major Carrier East (Illustrative)|Home Internet 1 Gbps',
      to: 'Major Carrier East (Illustrative)|Home Internet 500 Mbps',
      allowed: false,
      edufMsg: 'Downgrades may require account modification.',
      discount: 'You may lose priority support benefits if you downgrade.'
    },

    // Major Carrier West: Wireless rules
    {
      from: 'Major Carrier West (Illustrative)|Value Wireless 20 GB',
      to: 'Major Carrier West (Illustrative)|Plus Wireless 75 GB',
      allowed: true,
      edufMsg: 'Your upgrade to Plus Wireless is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Major Carrier West (Illustrative)|Plus Wireless 75 GB',
      to: 'Major Carrier West (Illustrative)|Value Wireless 20 GB',
      allowed: false,
      edufMsg: 'Downgrades are restricted on Plus plans.',
      discount: 'You will lose premium features and pricing on downgrade.'
    },

    // Major Carrier West: Internet rules
    {
      from: 'Major Carrier West (Illustrative)|Residential Internet 150 Mbps',
      to: 'Major Carrier West (Illustrative)|Residential Internet 600 Mbps',
      allowed: true,
      edufMsg: 'Your speed upgrade is available.',
      discount: 'No discount loss on this upgrade.'
    },

    // Regional Carrier: Wireless upgrade
    {
      from: 'Regional Carrier (Illustrative)|Basic Wireless 10 GB',
      to: 'Regional Carrier (Illustrative)|Enhanced Wireless 40 GB',
      allowed: true,
      edufMsg: 'Your upgrade to Enhanced service is available.',
      discount: 'No discount loss on this upgrade.'
    },

    // Regional Carrier: Internet upgrade
    {
      from: 'Regional Carrier (Illustrative)|Basic Internet 50 Mbps',
      to: 'Regional Carrier (Illustrative)|Standard Internet 250 Mbps',
      allowed: true,
      edufMsg: 'Your speed upgrade is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Regional Carrier (Illustrative)|Standard Internet 250 Mbps',
      to: 'Regional Carrier (Illustrative)|Basic Internet 50 Mbps',
      allowed: false,
      edufMsg: 'Downgrades may require service changes.',
      discount: 'You may lose technical support benefits if you downgrade.'
    }
  ];

  let createdCount = 0;
  for (const ruleSpec of rulesToCreate) {
    const fromId = rulesMap.get(ruleSpec.from);
    const toId = rulesMap.get(ruleSpec.to);

    if (!fromId || !toId) {
      console.warn(`⚠ Skipped rule: ${ruleSpec.from} → ${ruleSpec.to} (plan not found)`);
      continue;
    }

    try {
      const pairRules = await repository.listPairRules(fromId, toId);
      const version = pairRules.length > 0 ? Math.max(...pairRules.map(r => r.version)) + 1 : 1;

      const rule = await repository.createRule({
        fromPlan: fromId,
        toPlan: toId,
        allowed: ruleSpec.allowed,
        EDUFMessage: ruleSpec.edufMsg,
        discountLossWarning: ruleSpec.discount,
        status: 'ACTIVE',
        effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
        version
      });

      console.log(`✓ Created rule: ${version === 1 ? ruleSpec.from + ' → ' + ruleSpec.to : '(revision)'}`);
      createdCount++;
    } catch (error) {
      console.error(`✗ Failed to create rule: ${ruleSpec.from} → ${ruleSpec.to}: ${error.message}`);
    }
  }

  console.log(`\nSeeded ${createdCount} plan transition rules.`);
}

async function main() {
  try {
    const plans = await seedPlans();
    await seedRules(plans);
    console.log('\n✓ DynamoDB seeding complete!');
  } catch (error) {
    console.error(`✗ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

main();
