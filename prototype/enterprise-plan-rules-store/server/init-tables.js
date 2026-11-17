#!/usr/bin/env node

/**
 * DynamoDB Table Initialization Script
 * 
 * This script creates the required DynamoDB tables for the Enterprise Plan Rules Store.
 * Run this once to set up tables in AWS DynamoDB.
 * 
 * Prerequisites:
 *   - AWS credentials configured (via IAM role, environment variables, or AWS CLI)
 *   - AWS_REGION environment variable or --region flag
 * 
 * Usage:
 *   node init-tables.js --region ca-central-1
 */

import 'dotenv/config';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const region = process.env.AWS_REGION || 'ca-central-1';
const client = new DynamoDBClient({ region });

const PLANS_TABLE = process.env.DYNAMODB_PLANS_TABLE || 'BMAD-CRTC-PLANS';
const RULES_TABLE = process.env.DYNAMODB_RULES_TABLE || 'BMAD-CRTC-RULES';

async function tableExists(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') return false;
    throw error;
  }
}

async function createPlansTable() {
  const tableName = PLANS_TABLE;
  
  if (await tableExists(tableName)) {
    console.log(`✓ Table '${tableName}' already exists.`);
    return;
  }

  console.log(`Creating table '${tableName}'...`);

  await client.send(new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'planId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'planId', AttributeType: 'S' },
      { AttributeName: 'provider', AttributeType: 'S' },
      { AttributeName: 'name', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'ProviderNameIndex',
        KeySchema: [
          { AttributeName: 'provider', KeyType: 'HASH' },
          { AttributeName: 'name', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  }));

  console.log(`✓ Created table '${tableName}' with schema:`);
  console.log(`  - Partition Key: planId (String)`);
  console.log(`  - GSI: ProviderNameIndex (provider, name)`);
}

async function createRulesTable() {
  const tableName = RULES_TABLE;
  
  if (await tableExists(tableName)) {
    console.log(`✓ Table '${tableName}' already exists.`);
    return;
  }

  console.log(`Creating table '${tableName}'...`);

  await client.send(new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'ruleId', KeyType: 'HASH' },
      { AttributeName: 'version', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'ruleId', AttributeType: 'S' },
      { AttributeName: 'version', AttributeType: 'N' },
      { AttributeName: 'pairKey', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'PlanPairIndex',
        KeySchema: [
          { AttributeName: 'pairKey', KeyType: 'HASH' },
          { AttributeName: 'version', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  }));

  console.log(`✓ Created table '${tableName}' with schema:`);
  console.log(`  - Partition Key: ruleId (String), Sort Key: version (Number)`);
  console.log(`  - GSI: PlanPairIndex (pairKey, version)`);
}

async function main() {
  console.log(`\nInitializing DynamoDB tables in region: ${region}\n`);

  try {
    await createPlansTable();
    await createRulesTable();
    
    console.log('\n✓ DynamoDB tables initialized successfully!');
    console.log(`\nNext steps:`);
    console.log(`  1. Set USE_DYNAMODB=true in .env`);
    console.log(`  2. Configure AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)`);
    console.log(`  3. Run: npm run seed:dynamo`);
    
  } catch (error) {
    console.error(`✗ Failed to initialize tables: ${error.message}`);
    process.exit(1);
  }
}

main();
