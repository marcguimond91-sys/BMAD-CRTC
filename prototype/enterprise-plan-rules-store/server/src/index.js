import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import Plan from './models/plan.js';
import PlanRule from './models/plan-rule.js';
import { createDynamoRepository } from './repository-dynamo.js';

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '127.0.0.1';

async function startServer() {
  try {
    let repository;
    
    if (process.env.USE_DYNAMODB === 'true') {
      // Use DynamoDB
      repository = createDynamoRepository();
      console.log('Initialized DynamoDB repository');
    } else {
      // Use MongoDB (original behavior)
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        console.error('MONGODB_URI must be set before starting the server.');
        process.exit(1);
      }
      
      await mongoose.connect(mongoUri);
      await Promise.all([Plan.init(), PlanRule.init()]);
      console.log('Initialized MongoDB repository');
    }

    const app = createApp({ repository });
    app.listen(port, host, () => {
      console.log(`Enterprise Plan Rules Store API listening on http://${host}:${port}`);
    });
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();

