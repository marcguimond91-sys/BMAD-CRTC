import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoRepository } from './repository-dynamo.js';

const repository = createDynamoRepository();

// Initialize DynamoDB client for cleanup
const dynamoClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION || 'ca-central-1' }),
  { marshallOptions: { removeUndefinedValues: true } }
);

const plansTableName = process.env.DYNAMODB_PLANS_TABLE || 'BMAD-CRTC-PLANS';
const rulesTableName = process.env.DYNAMODB_RULES_TABLE || 'BMAD-CRTC-RULES';

async function clearTables() {
  console.log('Clearing existing DynamoDB tables...');
  
  // Clear plans table
  try {
    const plansScan = await dynamoClient.send(new ScanCommand({
      TableName: plansTableName
    }));
    
    if (plansScan.Items && plansScan.Items.length > 0) {
      for (const item of plansScan.Items) {
        await dynamoClient.send(new DeleteCommand({
          TableName: plansTableName,
          Key: { planId: item.planId }
        }));
      }
      console.log(`✓ Cleared ${plansScan.Items.length} plans`);
    }
  } catch (error) {
    console.warn(`⚠ Could not clear plans table: ${error.message}`);
  }
  
  // Clear rules table
  try {
    const rulesScan = await dynamoClient.send(new ScanCommand({
      TableName: rulesTableName
    }));
    
    if (rulesScan.Items && rulesScan.Items.length > 0) {
      for (const item of rulesScan.Items) {
        await dynamoClient.send(new DeleteCommand({
          TableName: rulesTableName,
          Key: { ruleId: item.ruleId, version: item.version }
        }));
      }
      console.log(`✓ Cleared ${rulesScan.Items.length} rules`);
    }
  } catch (error) {
    console.warn(`⚠ Could not clear rules table: ${error.message}`);
  }
}

// Realistic Canadian telecom plans (no trademark names)
const canadianPlans = [
  // Wireless Carriers - Wireless Plans
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Essential Wireless 15 GB',
    serviceType: 'Wireless',
    monthlyPrice: 50,
    dataAllowance: '15 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'Voicemail included']
  },
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Standard Wireless 50 GB',
    serviceType: 'Wireless',
    monthlyPrice: 70,
    dataAllowance: '50 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'International texting', 'Voicemail included']
  },
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Premium Wireless Unlimited',
    serviceType: 'Wireless',
    monthlyPrice: 95,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '5G priority', 'International roaming included', 'Hotspot 20 GB']
  },
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Value Wireless 20 GB',
    serviceType: 'Wireless',
    monthlyPrice: 55,
    dataAllowance: '20 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'SMS included']
  },
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Plus Wireless 75 GB',
    serviceType: 'Wireless',
    monthlyPrice: 80,
    dataAllowance: '75 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '5G access', 'International texting', 'Hotspot 10 GB']
  },
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Basic Wireless 10 GB',
    serviceType: 'Wireless',
    monthlyPrice: 45,
    dataAllowance: '10 GB',
    contractTerm: 'Month-to-month',
    features: ['Regional calling', '4G access']
  },
  {
    marketingProductLine: 'Northstar Wireless',
    name: 'Enhanced Wireless 40 GB',
    serviceType: 'Wireless',
    monthlyPrice: 65,
    dataAllowance: '40 GB',
    contractTerm: 'Month-to-month',
    features: ['Canada-wide calling', '4G/5G access', 'SMS included']
  },

  // Internet Services
  {
    marketingProductLine: 'Northstar Internet',
    name: 'Home Internet 100 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 65,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['100 Mbps download', 'Wi-Fi 6 router included', '24/7 support']
  },
  {
    marketingProductLine: 'Northstar Internet',
    name: 'Home Internet 500 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 85,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['500 Mbps download', 'Wi-Fi 6 router included', '24/7 support']
  },
  {
    marketingProductLine: 'Northstar Internet',
    name: 'Home Internet 1 Gbps',
    serviceType: 'Internet',
    monthlyPrice: 120,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['1 Gbps download', 'Wi-Fi 6E router included', 'Priority support']
  },
  {
    marketingProductLine: 'Northstar Internet',
    name: 'Residential Internet 150 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 70,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['150 Mbps download', 'Router included', 'Basic support']
  },
  {
    marketingProductLine: 'Northstar Internet',
    name: 'Residential Internet 600 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 95,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['600 Mbps download', 'Wi-Fi 6 router included', 'Technical support']
  },
  {
    marketingProductLine: 'Northstar Internet',
    name: 'Basic Internet 50 Mbps',
    serviceType: 'Internet',
    monthlyPrice: 55,
    dataAllowance: 'Unlimited',
    contractTerm: 'Month-to-month',
    features: ['50 Mbps download', 'Router included']
  },
  {
    marketingProductLine: 'Northstar Internet',
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
      console.log(`✓ Created plan: ${plan.marketingProductLine} - ${plan.name}`);
    } catch (error) {
      console.error(`✗ Failed to create plan: ${plan.marketingProductLine} - ${plan.name}: ${error.message}`);
    }
  }

  console.log(`\nSeeded ${createdPlans.length} plans total.`);
  return createdPlans;
}

async function seedRules(plans) {
  console.log('\nSeeding DynamoDB with plan transition rules...');
  const rulesMap = new Map();
  
  // Index plans by marketingProductLine and name for easy reference
  for (const plan of plans) {
    const key = `${plan.marketingProductLine}|${plan.name}`;
    rulesMap.set(key, plan.planId);
  }

  const rulesToCreate = [
    // Northstar Wireless: Wireless upgrades allowed
    {
      from: 'Northstar Wireless|Essential Wireless 15 GB',
      to: 'Northstar Wireless|Standard Wireless 50 GB',
      allowed: true,
      edufMsg: 'Your upgrade to Standard Wireless 50 GB is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Wireless|Standard Wireless 50 GB',
      to: 'Northstar Wireless|Premium Wireless Unlimited',
      allowed: true,
      edufMsg: 'Your upgrade to Premium Wireless is available.',
      discount: 'No discount loss on this premium upgrade.'
    },
    {
      from: 'Northstar Wireless|Premium Wireless Unlimited',
      to: 'Northstar Wireless|Standard Wireless 50 GB',
      allowed: false,
      edufMsg: 'Downgrades from Premium plans require account review.',
      discount: 'You may lose premium discounts if you downgrade.'
    },
    {
      from: 'Northstar Wireless|Essential Wireless 15 GB',
      to: 'Northstar Wireless|Premium Wireless Unlimited',
      allowed: true,
      edufMsg: 'Your upgrade to Premium Wireless is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Wireless|Value Wireless 20 GB',
      to: 'Northstar Wireless|Plus Wireless 75 GB',
      allowed: true,
      edufMsg: 'Your upgrade to Plus Wireless is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Wireless|Plus Wireless 75 GB',
      to: 'Northstar Wireless|Value Wireless 20 GB',
      allowed: false,
      edufMsg: 'Downgrades are restricted on Plus plans.',
      discount: 'You will lose premium features and pricing on downgrade.'
    },
    {
      from: 'Northstar Wireless|Basic Wireless 10 GB',
      to: 'Northstar Wireless|Enhanced Wireless 40 GB',
      allowed: true,
      edufMsg: 'Your upgrade to Enhanced service is available.',
      discount: 'No discount loss on this upgrade.'
    },

    // Northstar Internet: Internet upgrades allowed
    {
      from: 'Northstar Internet|Home Internet 100 Mbps',
      to: 'Northstar Internet|Home Internet 500 Mbps',
      allowed: true,
      edufMsg: 'Your speed upgrade is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Internet|Home Internet 500 Mbps',
      to: 'Northstar Internet|Home Internet 1 Gbps',
      allowed: true,
      edufMsg: 'Your upgrade to Gigabit service is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Internet|Home Internet 1 Gbps',
      to: 'Northstar Internet|Home Internet 500 Mbps',
      allowed: false,
      edufMsg: 'Downgrades may require account modification.',
      discount: 'You may lose priority support benefits if you downgrade.'
    },
    {
      from: 'Northstar Internet|Residential Internet 150 Mbps',
      to: 'Northstar Internet|Residential Internet 600 Mbps',
      allowed: true,
      edufMsg: 'Your speed upgrade is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Internet|Basic Internet 50 Mbps',
      to: 'Northstar Internet|Standard Internet 250 Mbps',
      allowed: true,
      edufMsg: 'Your speed upgrade is available.',
      discount: 'No discount loss on this upgrade.'
    },
    {
      from: 'Northstar Internet|Standard Internet 250 Mbps',
      to: 'Northstar Internet|Basic Internet 50 Mbps',
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
    await clearTables();
    const plans = await seedPlans();
    await seedRules(plans);
    console.log('\n✓ DynamoDB seeding complete!');
  } catch (error) {
    console.error(`✗ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

main();
