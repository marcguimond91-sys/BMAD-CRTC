import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import Plan from './models/plan.js';
import PlanRule from './models/plan-rule.js';

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '127.0.0.1';
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI must be set before starting the server.');
  process.exit(1);
}

try {
  await mongoose.connect(mongoUri);
  await Promise.all([Plan.init(), PlanRule.init()]);
  const app = createApp();
  app.listen(port, host, () => {
    console.log(`Enterprise Plan Rules Store API listening on http://${host}:${port}`);
  });
} catch (error) {
  console.error(`Unable to connect to MongoDB: ${error.message}`);
  process.exit(1);
}
