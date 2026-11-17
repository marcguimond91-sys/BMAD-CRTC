import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION || 'ca-central-1' }),
  { marshallOptions: { removeUndefinedValues: true } }
);

const plansTableName = process.env.DYNAMODB_PLANS_TABLE || 'BMAD-CRTC-PLANS';
const rulesTableName = process.env.DYNAMODB_RULES_TABLE || 'BMAD-CRTC-RULES';

async function checkDB() {
  console.log('=== CHECKING DYNAMODB ===\n');
  
  // List plans
  console.log('PLANS:');
  const plansScan = await dynamoClient.send(new ScanCommand({
    TableName: plansTableName
  }));
  
  if (plansScan.Items) {
    console.log(`Found ${plansScan.Items.length} plans:`);
    for (const plan of plansScan.Items) {
      console.log(`  - ${plan.planId}: ${plan.name}`);
    }
  }
  
  console.log('\nRULES:');
  const rulesScan = await dynamoClient.send(new ScanCommand({
    TableName: rulesTableName
  }));
  
  if (rulesScan.Items) {
    console.log(`Found ${rulesScan.Items.length} rules:`);
    // Group by pairKey
    const byPairKey = new Map();
    for (const rule of rulesScan.Items) {
      if (!byPairKey.has(rule.pairKey)) {
        byPairKey.set(rule.pairKey, []);
      }
      byPairKey.get(rule.pairKey).push(rule);
    }
    
    for (const [pairKey, rules] of byPairKey) {
      console.log(`  pairKey: ${pairKey}`);
      for (const rule of rules) {
        console.log(`    - v${rule.version} (${rule.status}): ${rule.allowed ? 'ALLOWED' : 'NOT ALLOWED'}`);
      }
    }
  }
}

checkDB().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
