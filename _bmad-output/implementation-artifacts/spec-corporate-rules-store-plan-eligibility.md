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

## Verification

**Commands:**
- Run the repository's focused client/server tests and build; expected: they pass and the app can start against MongoDB using documented local configuration.
