# DynamoDB Migration Guide: Enterprise Plan Rules Store

## Executive Summary

This document outlines the technical approach to migrate the Enterprise Plan Rules Store from MongoDB to AWS DynamoDB. The migration preserves all external API contracts and behavioral semantics while replacing the underlying persistence layer.

**Key Design Principles:**
- Zero external API changes
- Identical business logic and validation
- Transparent to consumers
- AWS access via IAM credentials
- Table-scoped operations (no cross-table transactions)

## Current State: MongoDB Architecture

### Collections & Schemas

#### Plans Collection
```
{
  _id: ObjectId (MongoDB ID),
  provider: String,
  name: String,
  serviceType: String (enum: Wireless, Internet),
  monthlyPrice: Number (≥ 0),
  dataAllowance: String,
  contractTerm: String,
  features: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### PlanRules Collection
```
{
  _id: ObjectId,
  fromPlan: ObjectId (ref to Plans),
  toPlan: ObjectId (ref to Plans),
  allowed: Boolean,
  EDUFMessage: String,
  discountLossWarning: String,
  status: String (enum: DRAFT, ACTIVE, RETIRED),
  effectiveFrom: Date,
  effectiveTo: Date (nullable),
  version: Number (≥ 1),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- **Plans**: None explicitly defined (default _id index)
- **PlanRules**:
  - Unique: `{ fromPlan, toPlan }` with partial filter `status = ACTIVE`
  - Unique: `{ fromPlan, toPlan, version }`

## Target State: DynamoDB Architecture

### Table 1: BMAD-CRTC-PLANS

**Partition Key:** `planId` (String)

**Schema:**
```
{
  planId: String (UUID, primary key),
  provider: String,
  name: String,
  serviceType: String (Wireless | Internet),
  monthlyPrice: Number,
  dataAllowance: String,
  contractTerm: String,
  features: Set<String>,
  createdAt: Number (epoch milliseconds),
  updatedAt: Number (epoch milliseconds)
}
```

**Global Secondary Indexes (GSI):**
1. **Index Name:** `ProviderNameIndex`
   - Partition Key: `provider`
   - Sort Key: `name`
   - Projection: ALL
   - **Purpose:** Support listing/querying plans by provider and name

**TTL:** None (plans are not auto-expired)

**Billing Mode:** On-demand (simplifies scaling for reference implementation)

### Table 2: BMAD-CRTC-RULES

**Partition Key:** `ruleId` (String, UUID)
**Sort Key:** `version` (Number)

**Schema:**
```
{
  ruleId: String (UUID, primary key),
  version: Number (sort key, ≥ 1),
  fromPlanId: String (reference to planId in BMAD-CRTC-PLANS),
  toPlanId: String (reference to planId in BMAD-CRTC-PLANS),
  allowed: Boolean,
  EDUFMessage: String,
  discountLossWarning: String,
  status: String (DRAFT | ACTIVE | RETIRED),
  effectiveFrom: Number (epoch milliseconds),
  effectiveTo: Number (epoch milliseconds, optional/nullable),
  createdAt: Number (epoch milliseconds),
  updatedAt: Number (epoch milliseconds),
  pairKey: String (computed: "fromPlanId#toPlanId", for uniqueness queries)
}
```

**Global Secondary Indexes (GSI):**

1. **Index Name:** `PlanPairIndex`
   - Partition Key: `pairKey` (fromPlanId#toPlanId)
   - Sort Key: `version`
   - Projection: ALL
   - **Purpose:** Query all rule versions for a specific plan pair; enforce uniqueness constraint on active rules per pair

2. **Index Name:** `ActiveRulesByPairIndex`
   - Partition Key: `pairKey`
   - Sort Key: `status` (with version as additional sort during app logic)
   - Projection: ALL
   - **Purpose:** Quickly find the active rule for a plan pair (requires app-side filtering on effectiveFrom/effectiveTo dates)

**TTL:** Optional TTL on `effectiveTo` field for auto-cleanup of expired rules (requires additional configuration)

**Billing Mode:** On-demand

## Migration Strategy

### Phase 1: Repository Abstraction

**Goal:** Create a data-access abstraction layer that decouples the Express API from MongoDB.

**Current State:** `repository.js` already implements an abstraction pattern using dependency injection.

**Changes:**
1. Keep the existing `createMongoRepository()` export for backward compatibility and testing
2. Create new `createDynamoRepository(dynamoClient)` export
3. Both must implement identical interfaces
4. Switch `app.js` to accept repository via dependency injection (already does)

### Phase 2: DynamoDB Repository Implementation

**New File:** `src/repository-dynamo.js`

**Key Implementation Details:**

#### ID Generation
- Replace MongoDB ObjectId with UUID v4
- Use `crypto.randomUUID()` (Node.js 15.7+) or `uuid` package
- Store as plain strings in DynamoDB

#### Computed Fields
- `pairKey` for plan-rule relationships: computed as `${fromPlanId}#${toPlanId}`
- Computed at write time, indexed for GSI queries

#### Query Patterns

**List Plans (sorted by provider, name):**
```
Query PlanProvider GSI with provider, sort by name
OR full table scan (on-demand pricing acceptable for reference impl)
```

**Get Plan by ID:**
```
GetItem with planId
```

**Find Active Rule:**
```
Query PlanPairIndex with pairKey
Filter results where:
  - status === 'ACTIVE'
  - effectiveFrom <= now
  - (effectiveTo === null OR effectiveTo > now)
```

**Enforce Uniqueness: One Active Rule Per Pair:**
```
Before creating/activating a rule:
  Query PlanPairIndex with pairKey
  Scan results for existing ACTIVE rules
  If found: throw DUPLICATE_ACTIVE_PAIR error
```

**List Rules by Plan Pair:**
```
Query PlanPairIndex with pairKey
Sort by version DESC
```

#### Date Handling
- MongoDB: Native Date objects
- DynamoDB: Epoch milliseconds (Number type)
- Conversion: `date.getTime()` (write) / `new Date(epochMs)` (read)

#### Atomicity & Constraints

**MongoDB Atomic Operations:**
- Unique index on `{fromPlan, toPlan}` with status=ACTIVE partial filter
- Unique index on `{fromPlan, toPlan, version}`

**DynamoDB Constraints (DynamoDB has no transactions across items in different partitions):**
- **Uniqueness on ACTIVE rule per pair**: Enforce in application logic with conditional writes
  - Use `ConditionExpression` with `attribute_not_exists()` before creating/updating ACTIVE rules
  - If condition fails, return 409 Conflict with appropriate error code
- **Version uniqueness per pair**: Similar conditional write
  - Query existing versions for the pair before inserting

**Transactions for Retiring Other Rules:**
- MongoDB: `updateMany()` on multiple documents
- DynamoDB: Use `TransactWriteItems` to atomically retire old rules and activate new rule
  - Max 25 items per transaction (acceptable: typically retire ≤1 rule)
  - Improves consistency when switching active rules

### Phase 3: Environment & Credentials

**New `.env` variables:**
```
# Keep for backward compatibility
MONGODB_URI=                  # Optional; set to empty or remove

# DynamoDB Configuration
AWS_REGION=ca-central-1
AWS_ACCESS_KEY_ID=<provided>
AWS_SECRET_ACCESS_KEY=<provided>

# DynamoDB Table Names
DYNAMODB_PLANS_TABLE=BMAD-CRTC-PLANS
DYNAMODB_RULES_TABLE=BMAD-CRTC-RULES

# Application
PORT=4000
HOST=127.0.0.1
```

**Credential Handling:**
- Use `@aws-sdk/client-dynamodb` v3 (modular, no bloat)
- AWS SDK auto-detects credentials from environment variables
- For production: use IAM roles instead of static keys
- For local dev: `.env` file is acceptable for reference implementation

### Phase 4: Dependency Updates

**New Package:**
```json
{
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "@aws-sdk/client-dynamodb": "^3.400.0",
    "@aws-sdk/lib-dynamodb": "^3.400.0",
    "uuid": "^9.0.0"
  }
}
```

**Why these AWS packages:**
- `@aws-sdk/client-dynamodb`: Low-level client
- `@aws-sdk/lib-dynamodb`: Document client wrapper (better TypeScript DX, supports native JS types)
- `uuid`: UUID v4 generation

**Remove:** `mongoose` (once migration complete)

### Phase 5: Gradual Cutover

**Option A: Feature Flag (Recommended for reference impl)**
```javascript
const repositoryFactory = process.env.USE_DYNAMODB === 'true'
  ? createDynamoRepository
  : createMongoRepository;
const repository = repositoryFactory();
```

**Option B: Environment Detection**
- If `DYNAMODB_PLANS_TABLE` is set, use DynamoDB
- Else if `MONGODB_URI` is set, use MongoDB
- Else error

## API Behavior Preservation

### Request/Response Contract
All existing API endpoints remain unchanged:
- POST /api/plans → 201 Created with plan object
- GET /api/plans → 200 OK with array
- PUT /api/plans/:id → 200 OK with updated plan
- DELETE /api/plans/:id → 204 No Content
- POST /api/plan-rules → 201 Created with rule object
- GET /api/plan-rules/:fromPlanId/:toPlanId → 200 or 404
- POST /api/plan-rules/:id/activate → 200 OK

### Error Codes & Messages
All error codes remain identical:
- VALIDATION_ERROR (400)
- PLAN_NOT_FOUND (404)
- RULE_NOT_FOUND (404)
- DUPLICATE_ACTIVE_PAIR (409)
- RULE_VERSION_CONFLICT (409)
- RULE_EXPIRED (409)
- etc.

**No external consumer should be able to tell the difference.**

## Implementation Checklist

- [ ] Create `src/repository-dynamo.js` with all CRUD methods
- [ ] Add `@aws-sdk/*` dependencies
- [ ] Update `src/index.js` to detect and initialize DynamoDB repository
- [ ] Add `.env` variables for AWS credentials
- [ ] Implement DynamoDB table creation script (or manual AWS console setup)
- [ ] Migrate `seed.js` to work with both repositories
- [ ] Update all test fixtures to work with both repositories
- [ ] Run integration tests against DynamoDB in isolated test environment
- [ ] Update README with DynamoDB setup instructions
- [ ] Remove MongoDB dependencies once cutover is complete
- [ ] Update docker-compose (if used) to remove MongoDB service

## Testing Strategy

### Unit Tests
- Repository methods with mock DynamoDB client
- Validate computed fields (pairKey, timestamps)
- Error handling and validation

### Integration Tests
- Against real DynamoDB Local (Docker) for development
- Against AWS DynamoDB in test account for staging
- Full CRUD cycles for Plans and Rules
- Constraint enforcement (uniqueness, version ordering)
- Eligibility logic (date-based filtering)

### Backward Compatibility
- Run same test suite against both `createMongoRepository` and `createDynamoRepository`
- Ensure identical behavior for all query patterns

## Known Limitations & Mitigations

| Issue | MongoDB Capability | DynamoDB Limitation | Mitigation |
|-------|-------------------|-------------------|-----------|
| Partial Index | Unique {fromPlan, toPlan} only where status=ACTIVE | No partial indexes | App-side filtering in conditional writes |
| Atomic Multi-Item Updates | `updateMany()` for retiring rules | Max 25 items per TransactWriteItems | Query, then transact retire + activate in one call |
| Complex Filtering | Full query language | Only equality on keys, rest in app | Pre-filter with GSI, post-filter in app |
| Schema Flexibility | Schema-less | Fixed attribute types | Pre-define all fields; use NULL for empty dates |
| Auto-increment IDs | ObjectId generation | Manual ID generation | Use UUID v4 |

## Performance Considerations

### Read Patterns
- **Most Common:** Find active rule by plan pair
  - GSI query: O(log n) on pair
  - App-side date filtering: O(1) or O(few) results
  - **Cost:** One GSI read per query

- **List All Rules:**
  - Full table scan (on-demand billing)
  - Acceptable for reference implementation
  - For production: add timestamps to GSI for range queries

### Write Patterns
- **Create Rule:**
  - Query existing rules for pair (1 read)
  - TransactWrite: retire old + create new (2 writes, 1 transaction)
  - **Cost:** 1 read + 2 write units per transaction

- **Create Plan:**
  - PutItem (1 write)
  - **Cost:** 1 write unit

## Security Notes

- **Credentials:** Use `.env` for development (acceptable for reference impl)
  - For production: use IAM roles, Secrets Manager, or SSM Parameter Store
- **Encryption:** DynamoDB supports encryption at rest (AWS managed or KMS)
  - Recommend AWS managed keys for reference implementation
- **Audit:** Enable CloudTrail and CloudWatch logs for DynamoDB access
- **Access Control:** Restrict AWS credentials to only DynamoDB table actions
  - Example IAM policy provided in appendix

## Appendix: Example IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:ca-central-1:*:table/BMAD-CRTC-PLANS",
        "arn:aws:dynamodb:ca-central-1:*:table/BMAD-CRTC-PLANS/index/*",
        "arn:aws:dynamodb:ca-central-1:*:table/BMAD-CRTC-RULES",
        "arn:aws:dynamodb:ca-central-1:*:table/BMAD-CRTC-RULES/index/*"
      ]
    }
  ]
}
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-16  
**Author:** Technical Architecture  
**Status:** Complete Migration Specification
