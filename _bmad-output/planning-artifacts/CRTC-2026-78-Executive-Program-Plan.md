# Executive Program Plan

## CRTC 2026-78 Self-Service Compliance

**Planning baseline:** 30 October 2026  
**Regulatory enforcement begins:** 26 April 2027  
**Target production readiness:** 31 March 2027  
**Plan type:** Executive-level, indicative, overlapping phases  
**Source roadmap:** [CRTC 2026-78 Compliance Implementation Roadmap](./CRTC-2026-78-Compliance-Implementation-Roadmap.md)

## Executive Summary

This plan organizes the compliance program into seven phases: Discovery, Analysis, Architecture, Delivery, Testing, Regulatory Validation, and Deployment. The phases deliberately overlap to fit the calendar and start risk-reducing analysis and technical proof before design is fully complete.

The recommended control point is production readiness by **31 March 2027**, leaving **1–23 April** for stabilization and final readiness confirmation before CRTC enforcement begins on **26 April 2027**. The CRTC date is the regulatory date; 31 March is an internal planning target, not a regulatory deadline.

The critical path runs through confirmation of applicability and rules, approval of customer disclosures and fee treatment, proof of end-to-end plan-change and cancellation fulfilment, integrated testing, regulatory/legal validation, and production readiness. Discovery should begin immediately, especially rule inventory, release-calendar confirmation, and backend feasibility.

## Planning Assumptions

- Dates and durations are indicative estimates for a mid-sized Canadian provider with existing web, mobile, CRM, billing, order-management, customer-support, retail, and partner channels.
- Actual platforms, interface capabilities, vendor release constraints, staffing, and test environment availability are unknown and must be validated in Discovery.
- Delivery targets a focused compliance MVP; replacement of core platforms or broad enterprise rules modernization is outside this plan unless discovery proves it is essential.
- Regulatory, legal, accessibility, privacy, security, and business approvals are required at the appropriate gates.
- Workstreams overlap where possible; phase durations are elapsed calendar weeks, not a statement of staffing or effort.
- The program must support eligible plan upgrades, downgrades, service additions/removals, and cancellations; informed and express consent; written confirmation and timeframe disclosure; no customer-service access fees; and prompt/immediate effect to the greatest extent possible.

## Executive Phase Plan

| Phase | Estimated duration and window | Primary deliverables | Key stakeholders | Key dependencies | Exit criteria |
|---|---|---|---|---|---|
| **1. Discovery** | **3 weeks** — 2–20 Nov 2026 | Regulatory obligation register and scope; current-state customer journey maps; distributed business-rule inventory; system and interface catalogue; fee/channel inventory; device financing and contract-impact map; vendor/release constraints; initial risk and issue log | Executive sponsor; program manager; Regulatory Affairs and Legal; product/pricing; digital channel owners; enterprise/solution architects; CRM, billing, order, support, retail, partner, and operations owners; privacy, security, accessibility; vendors | Stakeholder availability; access to systems/process documentation; vendor response; identified service/customer population | Regulatory/legal confirms in-scope services and obligation interpretations; every key journey and rule has an owner or recorded gap; critical systems/interfaces and release windows are identified; technical spikes and environments are scheduled; no critical unknown is left without owner and due date |
| **2. Analysis** | **4 weeks** — 9 Nov–4 Dec 2026 (overlaps Discovery) | Gap assessment against each obligation; target operating and customer-service impacts; action-by-action eligibility/disclosure/consent matrix; confirmation and exception requirements; fee classification recommendation; prioritized compliance MVP; estimates and resource plan; dependency and risk baseline | Business analyst; Regulatory Affairs/Legal; product owners; Customer Care; Finance/Billing; Digital/UX; architecture; compliance, accessibility, privacy, security; retail/partner operations | Preliminary Discovery findings; policy and related regulatory decisions; product/contract/device-financing facts; named business rule owners | Compliance gaps are rated and evidenced; decisions on scope, action types, fees, and customer populations are approved or escalated; MVP and acceptance criteria are baselined; critical path, budget/capacity, and owners are approved |
| **3. Architecture** | **3 weeks** — 23 Nov–11 Dec 2026 (overlaps Analysis) | Approved logical business/application/integration design; Central Rules Service scope and rule ownership; request orchestration and lifecycle model; source-of-truth map; API/event and confirmation contracts; security/privacy/accessibility design; migration and rollback approach; solution estimates | Enterprise architect; solution/integration architects; business rule owners; product, digital, CRM, billing, order, provisioning and notification owners; security/privacy/accessibility; operations; vendors | Initial system inventory; rule ownership; business/contract interpretation; early technical spikes; integration standards | Architecture and system owners approve feasible design and interfaces; legal/regulatory approves disclosures, consent, and fee decisions; operational approach and exceptions are defined; delivery estimates and release path support 31 March readiness |
| **4. Delivery** | **8 weeks** — 14 Dec 2026–5 Feb 2027 | Configured or built portal/app journeys; scoped Central Rules Service or equivalent governed decision capability; orchestration; order/provisioning/billing and CRM integration; written-confirmation capability; fee corrections; audit/status visibility; customer-care, retail, and partner procedure updates; component test evidence | Technology delivery lead; digital engineering; rules/product team; integration; CRM; order/provisioning; billing; notification; customer support; retail/partner; QA; security/privacy/accessibility | Approved scope/design and interfaces; development capacity; stable environments; vendor support and release windows; approved disclosure content | All mandatory in-scope journeys are feature-complete in test; upgrade, downgrade, add/remove, and cancellation are demonstrable; written confirmation and timeframe disclosure are implemented; no-fee controls are configured; code/configuration and component tests are ready for integration |
| **5. Testing** | **6 weeks** — 18 Jan–26 Feb 2027 (overlaps late Delivery) | System/integration and end-to-end test results; regression; customer journey and exception tests; fee tests; device financing/promotion scenarios; security/privacy/accessibility findings; performance/failover and reconciliation evidence; defect disposition | QA/test lead; business SMEs; Digital; CRM, order, provisioning, billing, notification teams; Customer Care; retail/partner; security, privacy, accessibility; vendors | Feature increments available; integrated environments/test data; stable interfaces; approved business scenarios and expected outcomes; vendor/test support | Critical and high-priority compliance tests pass; no unresolved critical defect; failures/retries/duplicate requests/confirmation delivery and asynchronous outcomes are handled; billing/service results reconcile; accessibility/privacy/security findings have approved disposition |
| **6. Regulatory Validation** | **5 weeks** — 22 Feb–26 Mar 2027 (overlaps Testing and readiness) | Obligation-to-control-to-test traceability; regulatory/legal review of outcomes and customer content; evidence pack; fee/accessibility/privacy control validation; complaint and CRTC response procedures; management compliance attestation; readiness recommendation | Regulatory Affairs; Legal; Chief Compliance/Executive sponsor; Internal Audit; product owners; Customer Care; Finance/Billing; privacy/security/accessibility; QA; Operations | Test evidence; final rule/disclosure content; operational telemetry; complaint process; unresolved defect and risk decisions | Regulatory/legal confirms each policy obligation is addressed or records an explicit approved exception/risk; evidence is retrievable; no customer-service access fee is found in tested paths; customer confirmation, consent, timing, and fulfilment evidence is demonstrable; executive readiness recommendation is signed |
| **7. Deployment** | **5 weeks** — 22 Mar–23 Apr 2027; production readiness target **31 Mar**, stabilization **1–23 Apr** | Controlled production rollout/pilot; runbooks and monitoring; support/retail/partner readiness; rollback and customer-remediation plans; production verification; incident/defect closure; final executive go/no-go | Executive sponsor; program manager; release/change authority; Operations/SRE; Digital and platform owners; Customer Care; Regulatory Affairs/Legal; retail/partner leads; QA; vendors | Regulatory Validation gate; production change windows; trained support teams; production telemetry; rollback and support coverage | Production rollout and operational readiness achieved by 31 Mar; critical journey and fee controls verified in production; service desk and escalation are active; remaining defects have approved owners and dates; stabilization exit and final go/no-go completed by 23 Apr, ahead of enforcement |

## Phase Dependencies and Overlap

```text
Discovery             02 Nov ───────── 20 Nov
Analysis                    09 Nov ───────────── 04 Dec
Architecture                              23 Nov ─────── 11 Dec
Delivery                                             14 Dec ───────────────── 05 Feb
Testing                                                            18 Jan ─────────────── 26 Feb
Regulatory Validation                                                      22 Feb ─────────────── 26 Mar
Deployment                                                                  22 Mar ───────────────────── 23 Apr
                                                                                  31 Mar: readiness target
                                                                                  26 Apr: enforcement
```

### Hard dependencies

1. Regulatory scope and interpretation must be sufficiently clear to baseline customer actions, fee treatment, and product/service coverage.
2. Rule inventory and rule owners must precede the Central Rules Service design and migration.
3. Legal-approved disclosures and consent criteria must precede final channel acceptance and UAT.
4. Product/contract/device-financing data and order/provisioning/billing interfaces must support a real plan-change outcome, not only request capture.
5. Confirmation trigger, expected delivery timeframe, delivery service, and outcome states must be agreed before end-to-end testing.
6. Integrated environments, realistic test accounts, product fixtures, and vendor availability must be secured before Testing.
7. Regulatory Validation depends on test evidence, operating controls, complaint handling, and actual fee/customer experience review.
8. Deployment depends on regulatory/legal, business, operational, security/privacy/accessibility, and QA exit approvals.

## Critical Path

**Scope/legal interpretation → rule/action inventory and source-of-truth decisions → approved disclosure/consent/fee design → architecture and interface approval → self-service/orchestration/rules build → order/provisioning/billing/confirmation integration → end-to-end testing and remediation → regulatory validation and executive approval → production deployment by 31 March.**

Schedule protection actions:

- Prove wireless and Internet downgrade/cancellation flows through to billing and confirmation by **11 December 2026**.
- Obtain mobile, portal, and vendor release commitments by **13 November 2026**.
- If app release timing threatens readiness, assess a compliant web-first mechanism early; do not assume web alone is sufficient without usability, accessibility, and legal/business approval.
- Do not defer accessibility, privacy, security, or fee testing until final UAT.
- Keep core platform replacement and enterprise-wide rules modernization out of the compliance critical path.
- Escalate any forecast that misses 31 March readiness immediately to the executive sponsor, with scope, recovery, and risk decisions documented.

## Executive Milestone Gates

| Gate | Target | Executive decision |
|---|---|---|
| Mobilization and owners confirmed | 6 Nov 2026 | Confirm sponsor, accountable leads, capacity, and program governance |
| Scope and obligation baseline | 13 Nov 2026 | Approve applicable services, customer scope, obligation interpretation, and fee review approach |
| Discovery and rule inventory complete | 20 Nov 2026 | Accept current-state baseline; resolve or assign critical unknowns |
| Analysis and MVP baseline | 4 Dec 2026 | Approve compliance scope, priorities, funding/capacity, and acceptance criteria |
| Architecture and interface approval | 11 Dec 2026 | Authorize build; confirm Central Rules Service scope and system owner commitments |
| Feature complete | 5 Feb 2027 | Confirm all mandatory journeys and controls are implemented in test |
| End-to-end test exit | 26 Feb 2027 | Accept test evidence and residual defect/risk disposition |
| Regulatory validation recommendation | 26 Mar 2027 | Confirm obligation evidence and recommend readiness or remediation |
| Production readiness | 31 Mar 2027 | Approve controlled production rollout and stabilization |
| Stabilization exit / final go-no-go | 23 Apr 2027 | Confirm operational controls and compliance readiness before 26 Apr enforcement |

## Immediate Executive Actions

Within the first 10 business days:

1. Appoint the executive sponsor, full-time program manager, Regulatory Affairs lead, business product owner, and architecture/technology lead.
2. Fund and reserve named delivery capacity across digital, rules, integration, order, provisioning, billing, CRM, QA, operations, legal, accessibility, privacy, and security.
3. Direct every platform/vendor owner to provide current interface capabilities, change lead times, release freezes, environments, test-data approach, and delivery estimates.
4. Start rule and fee discovery across portal, apps, CRM, billing, support, retail, and partner processes; appoint one owner for each in-scope rule family.
5. Schedule technical spikes for wireless and Internet plan changes and cancellations end to end, including financing/promotion consequences where relevant.
6. Reserve regulatory/legal decision time to approve customer disclosures, consent evidence, action-fee interpretation, and customer scope by the architecture gate.
7. Establish the integrated dependency tracker, decision log, risk register, obligation-to-test matrix, and twice-weekly critical-path reporting.
8. Set a scope-control rule: mandatory compliance first; optional modernization requires separate funding and cannot consume critical-path capacity without sponsor approval.

## Governance and Reporting

- **Executive steering:** Weekly; decide scope, funding, risk acceptance, and critical-path recovery.
- **Program control:** Twice-weekly review of dependencies, milestones, vendor commitments, and unresolved decisions.
- **Compliance evidence review:** At each phase gate; do not mark an obligation complete on a status assertion alone.
- **Escalation threshold:** Any critical-path dependency forecast to miss its committed date, any unresolved high-impact policy interpretation, any critical/high compliance defect, or any inability to demonstrate production readiness by 31 March requires immediate sponsor escalation.
- **Readiness decision:** Joint recommendation from Regulatory Affairs/Legal, Business, Technology, Operations, QA, Privacy/Security, and Accessibility owners; executive sponsor records go/no-go.

## Regulatory Note

The CRTC policy requires enforcement from **26 April 2027**. This plan’s production readiness target of **31 March 2027** and stabilization through **23 April 2027** are management recommendations to provide contingency, not additional regulatory dates. The provider should validate applicability and interpretations with its regulatory and legal advisors.

**Source:** Telecom Regulatory Policy CRTC 2026-78, “Enhancing self-service mechanisms,” issued 24 April 2026; especially paragraphs 13–17, 25–31, and 35–45.
