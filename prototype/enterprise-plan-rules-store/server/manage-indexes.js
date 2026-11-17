const { DynamoDBClient, DescribeTableCommand, UpdateTableCommand, DescribeGlobalSecondaryIndexesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1'
});

const checkIndexes = async () => {
  try {
    console.log('Checking indexes on BMAD-CRTC-RULES table...');
    const result = await client.send(new DescribeTableCommand({
      TableName: 'BMAD-CRTC-RULES'
    }));
    
    console.log('\nTable Status:', result.Table.TableStatus);
    console.log('Table ARN:', result.Table.TableArn);
    
    console.log('\n--- Primary Key ---');
    console.log('Partition Key:', result.Table.KeySchema.map(k => `${k.AttributeName} (${k.KeyType})`).join(', '));
    
    if (result.Table.GlobalSecondaryIndexes && result.Table.GlobalSecondaryIndexes.length > 0) {
      console.log('\n--- Global Secondary Indexes ---');
      result.Table.GlobalSecondaryIndexes.forEach((gsi, i) => {
        console.log(`\nIndex ${i + 1}: ${gsi.IndexName}`);
        console.log(`  Status: ${gsi.IndexStatus}`);
        console.log(`  Keys: ${gsi.KeySchema.map(k => `${k.AttributeName} (${k.KeyType})`).join(', ')}`);
        console.log(`  Projection Type: ${gsi.Projection.ProjectionType}`);
      });
    } else {
      console.log('\n--- Global Secondary Indexes ---');
      console.log('NO GLOBAL SECONDARY INDEXES FOUND!');
    }
    
    console.log('\n--- Attributes ---');
    result.Table.AttributeDefinitions.forEach(attr => {
      console.log(`  ${attr.AttributeName}: ${attr.AttributeType}`);
    });
    
  } catch (error) {
    console.error('Error checking indexes:', error.message);
  }
};

checkIndexes();
