- source_spec: `_bmad-output/implementation-artifacts/spec-corporate-rules-store-plan-eligibility.md`
  summary: Verify MongoDB-backed persistence, indexes, and effective-date lookups with an integration test.
  evidence: The current API suite uses an in-memory repository and MongoDB is unavailable in this environment, so MongoDB-specific index and query behavior remains unverified. Run integration checks against MongoDB 6+ for the active-pair and pair/version unique indexes, CRUD persistence, and effective relationship lookups.
