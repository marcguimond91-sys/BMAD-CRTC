---
title: 'Corporate Rules Store for Plan Eligibility'
type: 'feature'
created: '2026-11-06'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'b1f0478e31a04918b3e5047e5b04f778a6762839'
context:
  - _bmad-output/planning-artifacts/architecture/architecture-BMAD-CRTC-2026-10-30/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/CRTC-2026-78-Compliance-Implementation-Roadmap.md
  - _bmad-output/planning-artifacts/CRTC-2026-78-MoSCoW-Release-Roadmap.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The CRTC 2026-78 architecture calls for one governed decision point for shared self-service plan rules, but this repository has no implementation or approved plan-eligibility criteria. Independent channel logic risks inconsistent upgrade and downgrade decisions.

**Approach:** Build an interactive MERN prototype titled “Enterprise Plan Rules Store” with separate service-plan and plan-rule pages. Store realistic synthetic plans and directional from-plan/to-plan rules, provide CRUD for both, and expose an API that returns the complete selected relationship and its plan details. Use title case for UI labels and uppercase acronyms.

**Decisions:** Use synthetic wireless and Internet plans only. Name the rule message field `EDUFMessage` in the API and label it “EDUF Message” in the UI. Use `discountLossWarning` in the API and “Discount Loss Warning” in the UI.

## Boundaries & Constraints

**Always:** Use MongoDB, Express, React, and Node.js; use synthetic, clearly illustrative plan data with provider, plan name, service type, monthly price, data allowance, contract term, and features; represent each from-plan/to-plan relationship as directional; include an `Allowed` flag, an `EDUFMessage` string, and a `discountLossWarning` string; retain rule revisions with `DRAFT`, `ACTIVE`, or `RETIRED` status and effective dates; keep eligibility policy separate from workflow and service execution; make decisions traceable to their rule version and explanation.

**Never:** Implement order, provisioning, billing, identity, consent, or real customer-record mutation; silently infer a reverse relationship or treat a missing rule as allowed; expand to cancellation, add/remove services, or enterprise-wide rule migration; present the synthetic prototype as production-ready or as a legal interpretation.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Manage service plans | Plan fields submitted through the Plans page | Create, list, view, edit, and delete synthetic plan records | Validate required fields; prevent deleting a plan referenced by a rule |
| Manage a directional rule | From Plan, To Plan, Allowed flag, EDUF Message, Discount Loss Warning | Create, list, view, edit, and delete the exact directional relationship; retain rule version and status | Reject missing plans, invalid fields, and duplicate active pairs |
| Inspect a plan relationship | From-plan and to-plan identifiers | API returns the active rule and both plan records, including all rule/version fields and messages | Return a clear not-found response; do not infer the reverse relationship |
| Evaluate eligibility | Existing active from-plan/to-plan rule | Return its allowed decision and associated messages, identified by rule version | Missing relationship is not eligible; surface an explicit result |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/architecture/architecture-BMAD-CRTC-2026-10-30/ARCHITECTURE-SPINE.md` — Central Rules Service recommendation, AD-1 decision boundary, rule governance, API outputs, no state mutation, and explicit unknowns. Follow its logical architecture; do not treat unselected vendors or systems as facts.
- `_bmad-output/planning-artifacts/CRTC-2026-78-Compliance-Implementation-Roadmap.md` — Business-rule inventory, ownership, rule migration, assumptions, and limited compliance-MVP scope. Centralize only the in-scope decisions.
- `_bmad-output/planning-artifacts/CRTC-2026-78-MoSCoW-Release-Roadmap.md` — Clarifies the rules service is a design choice, not a CRTC-mandated technology; the criteria themselves require discovery and approval.
- `_bmad-output/planning-artifacts/Business-Capabilities-CRTC-2026-78.md` and `Regulatory-Discovery-Questionnaire-CRTC-2026-78.md` — Upgrade/downgrade capability and discovery questions for eligibility, account, contract, device, bundle, and outstanding-order rules.
- `_bmad-output/planning-artifacts/architecture/architecture-BMAD-CRTC-2026-10-30/reviews/review-adversarial.md` — Flags canonical request/rule boundaries and divergence risks; preserve one authoritative policy decision and explicit reason/version evidence.
- User decisions — Build an interactive MERN admin prototype titled “Enterprise Plan Rules Store,” with separate service-plan and plan-rule pages, CRUD for both, synthetic wireless/Internet data, and an API returning all details for an exact from-plan/to-plan relationship. Eligibility is represented by that relationship's allowed flag and messages; do not invent extra criteria. Use `EDUFMessage` and `discountLossWarning` API properties, with “EDUF Message” and “Discount Loss Warning” UI labels.
- Repository inventory — No customer-facing app, backend service, or application framework is present; only planning artifacts and BMAD tooling exist. Create a self-contained prototype rather than adapting a nonexistent application.

## Tasks & Acceptance

**Execution:**
- [x] Create `prototype/enterprise-plan-rules-store/client/` and `prototype/enterprise-plan-rules-store/server/` as a self-contained MERN prototype with the requested title and separate Plans and Plan Rules pages, each with CRUD workflows.
- [x] Persist synthetic wireless/Internet plans and directional plan-rule revisions in MongoDB; retain prior revisions, with no more than one active version per pair, and store the Allowed flag, message fields, status, and effective dates.
- [x] Expose CRUD APIs for plans and rules plus `GET /api/plan-rules/:fromPlanId/:toPlanId`, returning the active exact relationship with both plan records; validate inputs and handle absent/inactive relationships explicitly.
- [x] Add focused backend and UI verification for CRUD, duplicate pairs, invalid references, deletion constraints, version activation, and relationship lookup.

**Acceptance Criteria:**
- Given the application is open, when viewing its header and navigation, then it displays “Enterprise Plan Rules Store” and separate pages for service plans and plan rules.
- Given a valid plan or directional relationship, when a user creates, views, edits, or deletes it, then the change is persisted and reflected on its corresponding page.
- Given a relationship from plan A to plan B, when the API is queried for A-to-B, then it returns all relationship fields and both plan records; querying B-to-A does not reuse A-to-B.
- Given a draft revision is activated, when it replaces an active revision for the same pair, then the previous revision is retained and marked inactive.
- Given a missing relationship, duplicate pair, invalid plan reference, or plan still referenced by a rule, when the corresponding operation is attempted, then the API/UI reports a clear error and preserves valid stored data.
- Given an in-scope rule is updated, when a new revision is saved, then the prior revision remains retrievable and the API identifies the active revision only.
- Given any eligibility decision, when inspecting its effects, then no account, contract, order, provisioning, or billing state is mutated.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence and disposition |
|---------|---------|--------------------------|
| Blind Hunter B1 — The UI could not set or display a rule end date. | medium | The rule form now accepts optional `effectiveTo`, and the rules table/details display it. Routed to `patch`; the API already validates and stores the field. |
| Blind Hunter B2 — UTC effective dates could display as the prior local calendar day. | medium | Rule dates now render from their UTC ISO date, matching the date-only form/API value. Routed to `patch`. |
| Blind Hunter B3 — An expired draft could be activated. | medium | Both active-rule creation and draft activation now reject expired end dates with `RULE_EXPIRED`; an API regression test covers both. Routed to `patch` (group G1). |
| Blind Hunter B4 — Activation uses separate retire/activate writes and could leave no active rule if the second write fails. | low | The two writes are separate, but the harmful sequence requires a database failure between them and the eligibility API fails closed. A transaction would require broader database deployment support; rejected as a low-frequency failure beyond a direct correction (group G2). |
| Blind Hunter B5 — Concurrent revision creation could reuse a version number. | low | Concurrent requests can calculate the same next version, but the unique index preserves integrity and returns an explicit `409 RULE_VERSION_CONFLICT`; the caller may retry. The race requires concurrent administrative writes and automatic retry is beyond a direct correction, so it was rejected as unlikely in everyday prototype use. |
| Blind Hunter B6 — Concurrent plan deletion and rule creation could leave a dangling plan reference. | low | The check and delete are separate operations, so the race is possible; it requires concurrent administrative writes and a transactional/reference-integrity fix. Rejected as unlikely in everyday prototype use (group G3). |
| Blind Hunter B7 — Boolean monthly prices were coerced to numbers. | medium | Plan validation now requires a finite non-negative JSON number; a test confirms `true` is rejected. Routed to `patch` (group G4). |
| Blind Hunter B8 — Any existing rule caused the seeder to skip all remaining sample rules. | low | Seeding now checks each illustrative directional pair and creates any missing sample rule. Routed to `patch`. |
| Blind Hunter B9 — MongoDB-backed behavior has no integration test. | maybe-false (medium severity unverified) | The available API tests use the in-memory repository and `mongod` is unavailable, so Mongo-specific index/query behavior is unsettled. Routed to `defer`; the required evidence is recorded in `deferred-work.md`. |
| Blind Hunter B10 — Historical rule details do not snapshot prior plan fields. | low | Rule revisions retain their plan references and show the current catalog details; an immutable plan snapshot is not in the approved intent and would add a separate versioning model. Rejected as a low-frequency historical-display concern for this illustrative prototype. |
| Blind Hunter B11 — The modal lacks a keyboard focus trap/Escape handling. | low | This is a genuine administrative-modal accessibility limitation, but a complete focus-management change is more than a direct correction and no such behavior was requested. Rejected at low severity. |
| Blind Hunter B12 — Verification results should be added to this spec. | low | The required commands and actual results are reported in the completion summary; the proposed fix would edit this build's spec, which this review step explicitly rejects. |
| Edge Case Hunter E1 — An expired draft could be activated. | medium | Same verified outcome and fix as B3; expired creation/activation now return `RULE_EXPIRED`. Routed with group G1 to `patch`. |
| Edge Case Hunter E2 — Concurrent plan deletion and rule creation could leave a dangling reference. | low | Same concurrency window as B6; no second root cause was identified. Rejected with group G3 because it requires concurrent administrative writes and broader transactional protection. |
| Edge Case Hunter E3 — Activation could retire the old rule before activation of the replacement fails. | low | Same two-write failure window as B4; no second root cause was identified. Rejected with group G2 as a rare fail-closed database failure requiring broader transaction support. |
| Edge Case Hunter E4 — Boolean monthly prices were accepted as numeric values. | medium | Same type-coercion defect as B7; strict numeric validation now rejects booleans. Routed with group G4 to `patch`. |
| Verification Gap Reviewer V1 — Active denied rules lacked a regression test. | low | The API returns `eligible: false` from the denied rule's `allowed` flag, but this path lacked coverage. Added API and UI tests for denied outcomes; routed to `patch`. |
| Verification Gap Reviewer V2 — Successful writes lacked a UI list-refresh assertion. | low | Save handlers already refresh their corresponding lists; tests now assert the refresh after successful plan and rule creation. Routed to `patch`. |

## Verification

**Commands:**
- Run the repository's focused client/server tests and build; expected: they pass and the app can start against MongoDB using documented local configuration.
