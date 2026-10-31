# CRTC 2026-78 Compliance Implementation Roadmap

**Regulation:** Telecom Regulatory Policy CRTC 2026-78, “Enhancing self-service mechanisms”  
**Assessment date:** 30 October 2026  
**Compliance date:** The CRTC states it will enforce the self-service requirement starting **26 April 2027**.  
**Planning target:** Production readiness by **31 March 2027**, with a stabilization buffer before enforcement.  
**Audience:** Executive sponsor, program leadership, business owners, enterprise and solution architects, delivery teams, regulatory/legal, operations.

## Executive Summary

CRTC 2026-78 requires telecommunications service providers to make an easy-to-use self-service mechanism available so customers can modify or cancel service plans without interacting with a live customer service representative. The policy covers changes including upgrading, downgrading, and adding or removing services. It also requires transparent, informed and express consent; actions should take effect immediately to the greatest extent possible; providers must send written confirmation of every self-service action and disclose the expected confirmation timeframe in the mechanism; and providers may not charge fees to access any type of customer service. Existing privacy and accessibility protections continue to apply. The Commission encourages accessible self-service and not relying exclusively on live support for customers requiring accommodations.

For the assumed provider, the fastest credible route is to extend the existing web portal and mobile applications, connect them to a controlled plan-change/cancellation workflow, and reuse existing customer, product, order, provisioning, billing, CRM, and notification platforms. Because business rules are currently distributed across applications, establish a **logically authoritative Central Rules Service for the in-scope self-service decisions**. It may be an existing enterprise capability or a small API-backed service; selecting and deploying a new commercial rules platform is not a prerequisite unless discovery proves it is necessary. Migrate only the relevant policy rules for this compliance release, not every rule in the enterprise.

Run the work as a time-critical, cross-functional compliance program. Start rule/system discovery, regulatory interpretation, ownership decisions, and vendor/release-calendar checks immediately. Target design approval by **11 December 2026**, core build completion by **5 February 2027**, integrated testing completion by **26 February**, UAT and readiness approval by **19 March**, and production readiness by **31 March**. Use **1–23 April** for controlled stabilization, defect resolution, evidence review, and final go/no-go. Do not schedule first production deployment for the week of enforcement.

The critical path is: applicability and policy interpretation → rule/action inventory and source-of-truth decisions → approved customer disclosures/consent and fee classification → portal/app and orchestration changes → reliable order/provisioning/billing/confirmation integrations → end-to-end testing and accessibility/privacy/security approval → production launch and evidence-backed readiness approval.

### Regulatory baseline

| Requirement | Planning implication | Policy reference |
|---|---|---|
| Easy-to-use self-service to modify or cancel plans, including upgrades, downgrades, adding/removing services; no live representative except where additional information is reasonably required to clarify intent | Support complete customer journeys in the provider’s chosen digital mechanism; avoid a routine handoff as a prerequisite | Paras. 13, 16–17, 42–43; pp. 4–5, 9 |
| Transparent mechanism and informed, express consent; disclose resulting contract changes and whether the customer can return to prior terms if dissatisfied | Legal/product-approved disclosure and consent by action type, bound to the exact terms shown | Paras. 14–15; p. 4 |
| Actions take effect immediately to the greatest extent possible | Synchronous fulfilment is the target; document and monitor unavoidable asynchronous exceptions | Para. 13; p. 4 |
| Written confirmation for every action and timeframe disclosed in the mechanism | Confirmation generation, delivery, expected timeframe, and auditable status are in scope | Paras. 28–29, 44; pp. 6–7, 9 |
| No fee for access to any type of customer service | Review and test fee treatment across channels; distinguish access fees from separately governed action charges | Paras. 25–27, 44; pp. 6, 9 |
| Existing privacy/accessibility protections apply; accessibility encouraged | Validate existing controls and provide a usable path for customers requiring accommodations | Paras. 30–31, 45; pp. 7, 9 |
| Applies to all service providers; Commission administers requirement directly; enforcement starts 26 April 2027 | Do not assume an exemption or rely on CCTS/Code administration; prepare complaint and regulator evidence | Paras. 35–39, 43–45; pp. 8–9 |

## Assumptions

1. The provider is a mid-sized Canadian telecommunications provider with wireless and Internet customer plans, device financing, a self-service web portal and mobile applications, CRM, billing, order management, customer support, retail sales, and partner sales.
2. No client system inventory, architecture standards, current process maps, source code, interface specifications, vendor contract dates, or business-rule catalogue has been provided. Application names below refer to logical domains, not confirmed products or capabilities.
3. The provider has individual and small-business customers. The policy definition applies to those populations. Regulatory/legal owners will confirm any complex business-account arrangements and exact service applicability.
4. The provider can make changes to its existing web and mobile channels and backend platforms in the available period. Vendor release windows and development capacity are unknown and must be confirmed immediately.
5. Existing platforms contain some usable customer, product/offer, contract, order, service, billing, notification, identity, CRM, and fee data, but completeness and consistency are not yet verified.
6. There is no assumption that a new rules-engine product, cloud platform, or wholesale system replacement will be procured. The proposed Central Rules Service is a logical decision capability that may be delivered using an approved existing platform or a small service.
7. Device financing is adjacent to, but not automatically identical with, a telecommunications service plan. Where a plan change or cancellation affects financing, device balances, promotional credits, or agreement terms, those consequences must be assessed and accurately disclosed with legal approval. Do not infer this policy alone creates new standalone device-financing obligations.
8. The policy prohibits fees to access customer service; it does not, by itself, prohibit every charge for a service action. Any action-related fee must be reviewed against other applicable CRTC decisions, contracts, and law.
9. The plan targets readiness by 31 March 2027 to create contingency time before the 26 April enforcement date. This is a recommended program buffer, not a CRTC deadline.
10. Accessibility/privacy controls referenced by the policy already apply under other requirements; the specific applicable standards and evidence will be determined by the provider’s accessibility, privacy, security, and legal owners.

## Business Capabilities

| Capability | Required business outcome | Primary accountable owner | Compliance status |
|---|---|---|---|
| Customer self-service plan management | Individual and small-business customers can independently upgrade, downgrade, add/remove services, or cancel applicable plans through an easy-to-use mechanism | Consumer product / digital channel owner | **Mandatory** |
| Plan eligibility and offer decisioning | Consistent eligibility, available-plan, action, and exception rules across portal and app | Product / pricing owner; regulatory-approved rule owner | **Mandatory enabler** |
| Informed choice and express consent | Customer sees resulting contract/plan changes and relevant ability to return to prior terms, then expressly consents before the action | Product, legal, regulatory, UX | **Mandatory** |
| Request lifecycle and fulfilment | Accepted changes are executed accurately and immediately to the greatest extent possible; clarification is limited to resolving intent | Operations / order-management owner | **Mandatory** |
| Written confirmation and status | Every self-service action generates written confirmation; expected delivery timeframe is disclosed; delayed/failed fulfilment is visible and handled | Customer operations / communications owner | **Mandatory** |
| Customer-service fee governance | No fee is charged for accessing any customer service; action fees are distinguished and separately validated | Finance / billing and regulatory owner | **Mandatory** |
| Accessibility and privacy | Existing accessibility and privacy protections apply in the journey; customers requiring accommodations have a workable path | Accessibility and privacy owners | **Existing obligations apply; accessibility also encouraged by this policy** |
| Identity, authorization, and fraud controls | Authorized users can make changes securely without controls creating unjustified barriers to legitimate self-service | Identity/security and customer operations | **Necessary control; implementation design** |
| Rule ownership and governance | One accountable business owner and controlled production version for each in-scope decision rule | Regulatory program / product governance | **Mandatory program control to make rules consistent; specific governance mechanism is recommended** |
| Complaint, evidence, and compliance oversight | Provider can investigate complaints and demonstrate availability, consent, outcomes, and confirmations to the Commission | Regulatory affairs / customer care | **Necessary readiness capability; Commission administers directly** |

### Minimum compliant customer journeys

For each applicable wireless and Internet plan type, test at least:

- Upgrade to an eligible plan.
- Downgrade to an eligible plan.
- Add and remove an included/optional service where plan rules permit.
- Cancel the plan.
- A request requiring clarification of customer intent.
- A change with device financing, promotional credit, bundle, or contract implications.
- Ineligible plan, unavailable product, pending order, failed fulfilment, and retry/duplicate-submission scenarios.
- Confirmation delivery failure and customer follow-up.

The user must not be forced into a live-representative interaction for routine completion. Any clarification handoff should be limited to information reasonably needed to clarify intent.

## Impacted Application Domains

All entries are **likely impacts to validate**, not claims about the client’s actual implementation.

| Domain / assumed platform | Likely impact | Discovery focus |
|---|---|---|
| Web portal | Add or complete plan-change and cancellation journeys, required disclosures, express consent, accessible experience, status and expected confirmation timeframe | Existing supported actions, channel rules, authentication, web release dependencies |
| Mobile applications | Provide equivalent in-scope actions or a clear route to the compliant self-service mechanism; avoid inconsistent rules or dead-end web handoffs | App versions, parity, release cadence, supported customer populations |
| CRM / customer and account data | Supply account, authorized-user, service, contact, and support context; provide customer-care visibility of self-service request and evidence | Source of truth, identity linkage, account roles, case/history integration |
| Product catalogue / offer management (assumed) | Provide available plans, prices, eligibility, effective dates, and terms/disclosure data | Whether this is embedded in CRM, order management, billing, or a separate catalogue |
| Contract / device financing / promotion management (assumed) | Return plan and agreement consequences, device balances, credits, and any relevant return-to-prior-terms information | Financing system ownership, contract/terms versioning, legal-approved disclosure |
| Central Rules Service (target logical capability) | Consolidate self-service policy decisions currently distributed among applications; version, approve, test, and audit rule changes | Existing rules engines/configuration; duplicated/conflicting rules; owner/custodian |
| Self-service orchestration / workflow (new or existing) | Manage request ID, consent reference, state, idempotency, orchestration, exceptions, and status | Whether portal backend, CRM, order management, or a workflow platform can own this lifecycle |
| Order management | Accept idempotent plan-change/cancellation commands and return accepted/completed/failed status | Current APIs, cancellation semantics, effective dates, partial failure, duplicate handling |
| Provisioning / service inventory (assumed) | Activate, modify, suspend, or disconnect the service in accordance with the accepted order | Synchronous capability, network constraints, order state, reconciliation |
| Billing / rating / fee configuration | Apply plan and effective-date changes; ensure no customer-service access charge; distinguish action charges | Fee codes, billing cycles, proration, device financing charges, batch timing |
| Notification / document delivery (assumed) | Generate written confirmation for every action, show expected timeframe in journey, track delivery, and issue appropriate outcome updates | Email/SMS capabilities, templates, contact preferences, delivery status |
| Customer support / case management | Give agents request status, confirmation, consent evidence, and escalation paths; handle complaints without access fees | CRM integration, agent scripts, complaint ownership, CRTC escalation |
| Retail sales channels | Align assisted plan-change rules and fee treatment; ensure staff do not charge customer-service access fees | Retail policies, transaction systems, agent training, fee handling |
| Partner sales channels | Validate partner-facing rules and customer-support fee practices; ensure consistent plan/contract information and handoffs | Partner agreements, APIs, fee flows, support responsibilities, audit rights |
| Identity, access management, fraud/security (assumed) | Authenticate account holder/authorized users and control sensitive actions without making representative contact routine | Step-up authentication, delegation, account recovery, fraud monitoring |
| Analytics, audit, and regulatory evidence (assumed) | Monitor completion, latency, failures, confirmations, fee exceptions, complaints, and rule versions; retrieve evidence | Correlation IDs, retention standards, dashboards, audit access |

### Retail and partner scope note

The policy does not require retail or partner channels to become self-service channels. They are in the impact assessment because distributed rules, customer-service fee practices, customer disclosures, and support handoffs can create inconsistent outcomes or customer charges. Confirm the application of each obligation to specific channel arrangements with legal/regulatory owners.

## Program Workstreams

| Workstream | Scope and key deliverables | Accountable lead |
|---|---|---|
| 1. Program governance and regulatory interpretation | Confirm applicability, obligation register, scope, decision log, budget/capacity, integrated plan, executive steering, regulator/complaint escalation | Executive sponsor + Regulatory program director |
| 2. Business-rule inventory and target decisioning | Inventory existing rules in applications/processes; resolve conflicts; nominate owners; define single approved self-service rule set; Central Rules Service design and migration | Product/pricing owner + Enterprise architect |
| 3. Customer journeys and disclosures | Define upgrade/downgrade/add/remove/cancel journeys; disclosures by action; informed and express consent; return-to-prior-terms language; accessibility design and usability validation | Digital product / UX lead + Legal |
| 4. Application and integration delivery | Portal/app, orchestration, CRM, catalogue, order, provisioning, billing, notification and case integrations; request status and failure handling | Technology delivery lead / solution architect |
| 5. Fees, billing, and device-financing impacts | Identify and remove customer-service access fees; validate action charges under other determinations; align billing and plan/device financing consequences | Finance/billing owner + Regulatory/legal |
| 6. Privacy, security, fraud, accessibility | Threat/risk assessment, identity and authorization design, privacy review, accessibility assessment and test evidence | CISO delegate + Privacy officer + Accessibility lead |
| 7. Test, release, and operational readiness | SIT, UAT, regression, end-to-end, accessibility, security, failover, pilot, deployment, service desk readiness, monitoring/runbooks | QA/release lead + Operations |
| 8. Customer care, retail, and partner readiness | Agent/retail/partner procedures, no-fee controls, knowledge articles, complaint workflows, training and partner communications | Customer operations lead + Channel/partner lead |
| 9. Compliance assurance and evidence | Control matrix, requirements traceability, evidence repository, test results, management attestation, complaint response and readiness sign-off | Chief compliance / Regulatory affairs |

## Dependency Analysis

### Key dependencies

| Dependency | Needed by | Why it matters | Immediate action |
|---|---|---|---|
| Regulatory/legal interpretation and service/customer scope | Rule inventory, disclosures, fee review, test scope | Prevents building the wrong actions or misclassifying device financing and action fees | Regulatory/legal to sign the obligation register and decision log by 13 November |
| Inventory of rules and current journeys across portal, app, CRM, retail, partners | Central Rules Service and channel design | Rules are distributed; duplicates and hidden manual decisions can create inconsistent outcomes | Conduct workshops and demonstrations by 20 November |
| Named business owner for each policy rule and decision | Rules build and governance | Avoids unresolved conflicts and uncontrolled rule changes | Assign owners/custodians in discovery |
| Current product, price, contract, customer, financing, and service data sources | Journey and decision service design | Required to show accurate eligible options and contract consequences | Identify authoritative source and interface owner for each field |
| Legal-approved disclosures and consent evidence | UX build and UAT | Must communicate resulting contract changes and prior-term reversibility accurately | Approve content/action matrix by 11 December |
| Portal/app and vendor release calendar | Build and deployment plan | App-store and vendor freezes can consume the schedule buffer | Obtain committed release windows in first two weeks |
| Order/provisioning/billing interface capability | End-to-end fulfilment | Cannot demonstrate compliant change if the request only records intent but does not execute | Prove top journeys and timings with technical spikes by 11 December |
| Notification platform and reliable contact data | Written confirmation | Every action requires written confirmation with expected delivery timeframe shown | Confirm trigger, delivery, status, failure handling by 11 December |
| Fee code and service-support channel inventory | No-fee compliance | Fee may be applied in systems beyond the portal/app | Finance/billing audit across support, retail, partner, and digital routes |
| Accessibility/privacy/security review capacity | Release approval | Existing protections continue to apply and review findings may force design changes | Reserve review/test capacity at mobilization |
| QA environments, test accounts, product fixtures, and vendor support | SIT/UAT | Integration tests are on critical path and cannot be deferred to late March | Book environments, data, and vendor resources immediately |

### Architecture and delivery dependencies

- The Central Rules Service depends on a completed rule inventory, authoritative inputs, named rule owners, and an agreed decision response contract.
- Customer channels depend on a stable orchestration API and reliable catalogue/contract data to render choices and disclosures.
- Consent capture depends on approved content and a stable version reference for the exact offer/terms presented.
- Order-to-provisioning and order-to-billing dependencies determine whether actions can take effect synchronously or require visible asynchronous status.
- Written confirmation depends on event triggers that reflect the real transaction state, contact preferences, delivery service health, and a disclosed timeframe.
- No-fee validation depends on classifying fees correctly and tracing them across billing codes, retail, partner, and customer-support processes.
- Pilot exit depends on end-to-end evidence, accessible journeys, complaint handling, operational monitoring, and rollback/customer-remediation procedures.

## Risk Assessment

| Risk | Likelihood / impact | Early warning | Mitigation / contingency |
|---|---|---|---|
| Distributed rules prove more numerous or contradictory than expected | High / High | Conflicting eligibility or fee logic across channels; no rule owners | Limit initial scope to in-scope self-service decisions; create signed rule catalogue; centralize only those rules first; escalate unresolved policy choices |
| Order/provisioning/billing systems cannot fulfil changes promptly | Medium-High / High | Actions require overnight batch or manual work queues | Spike critical flows in November; synchronous path where feasible; make exceptions explicit, disclose timeframe, show status, and prioritize remediation |
| Mobile app or vendor release cycle misses the date | Medium / High | Vendor cannot commit release before March | Use existing compliant web portal as a mechanism if independently easy-to-use and accessible; establish web/app parity plan, deep links, and approved alternate channel without assuming app release |
| Contract/device-financing consequences are inaccurate or incomplete | Medium / High | Data split across finance, billing, offer, and contract systems | Legal-approved action/disclosure matrix; test financed-device and promotion scenarios; separate plan action from financing contract where legally appropriate |
| Customer-facing disclosure/consent is insufficient | Medium / High | UX copy not approved or terms version not captured | Legal/regulatory sign-off by December; evidence exact content, version, action, and customer consent; test comprehension and edge cases |
| Confirmation is triggered before actual outcome or fails silently | Medium / High | Dispute between confirmation and service/bill state; delivery failures | Distinguish receipt from completion; delivery monitoring/retry; disclose expected timeframe; send outcome update for asynchronous completion/failure |
| No-fee rule is missed in assisted, retail, or partner routes | Medium / High | Access fee codes or staff/partner fee practices discovered late | Enterprise fee inventory; disable prohibited access fees; partner attestation/contract review; targeted billing tests and post-release audit |
| Security/fraud controls block legitimate self-service or permit unauthorized changes | Medium / High | Excessive handoffs, account takeover events, weak authorization | Risk-based authentication; authorized-user rules; fraud testing; monitor rejection/handoff rates |
| Accessibility/privacy review discovers late defects | Medium / High | Review begins only at UAT | Engage accessibility/privacy at discovery and design; test representative assistive technologies and data flows early; reserve remediation window |
| Testing environment or test data is unavailable | Medium / High | No test customer/device/plan fixtures by January | Reserve environments and vendor support in November; create masked/synthetic test cases and agreed test data |
| Scope expands into broad legacy modernization | Medium / High | Teams propose replacing CRM, billing, app, or all enterprise rules | Enforce compliance MVP boundary; park modernization in separately funded backlog with no dependency on April readiness |
| Program confuses CRTC policy with other fee/financing requirements | Medium / Medium-High | Blanket removal or retention of fees without legal basis | Separate customer-service access charges from action charges; legal review all fee decisions and related CRTC instruments |
| Insufficient buffer for production defects before enforcement | Medium / High | First deployment planned for April | Production readiness by 31 March; pilot in March; no first release during enforcement week; executive readiness gate |

## Compliance Roadmap

Dates below are recommended planning windows from 30 October 2026. Work may overlap where dependencies allow. A plan that cannot achieve production readiness by 31 March requires immediate executive escalation, scope reduction, and contingency planning.

| Phase | Dates | Focus | Exit criteria |
|---|---|---|---|
| 0. Mobilize and protect the date | 30 Oct–6 Nov 2026 | Sponsor, program manager, workstream leads, capacity, scope, decision governance, vendor/release-calendar requests, risk log | Named accountable sponsor and owners; integrated plan; discovery sessions booked; vendor/platform constraints raised |
| 1. Discover and baseline | 2–20 Nov 2026 | Current journeys, business rules, fee inventory, system/interface inventory, data authority, affected customer/service segments, device financing, complaint evidence | Obligation-to-capability map; rule inventory with owners; system/integration map; confirmed in-scope actions; top technical spikes completed or booked |
| 2. Decide and design | 23 Nov–11 Dec 2026 | Target journey, Central Rules Service scope, source-of-truth, orchestration, decision contract, consent/disclosure, confirmation semantics, fee controls, accessibility/privacy/security designs | Signed solution/design decisions; approved action/disclosure matrix; interface contracts; operational target assumptions; delivery estimates and scope baseline |
| 3. Build/configure compliance MVP | 14 Dec 2026–5 Feb 2027 | Web/app changes, rules centralization for self-service, orchestration, CRM visibility, order/provisioning/billing integration, notification, fee configuration | Feature complete in test; all in-scope action types demonstrable; unit/component tests pass; no unresolved design-critical issue |
| 4. Integrate and verify | 18 Jan–26 Feb 2027 | SIT, system/API/event testing, order-to-service-to-bill reconciliation, confirmation, retry/idempotency, no-fee tests, security/privacy checks | End-to-end test pass for core and exception journeys; critical/high defects resolved or formally accepted with safe remediation; evidence traceable |
| 5. UAT and operational readiness | 1–19 Mar 2027 | Business/customer-care UAT, usability/accessibility validation, agent/retail/partner procedures, training, runbooks, monitoring, complaint handling, rollback/recovery | Business, operations, regulatory/legal, security/privacy/accessibility sign-offs; service desk and support trained; go-live checklist complete |
| 6. Controlled production pilot and rollout | 22–31 Mar 2027 | Limited exposure then progressive rollout across web/app/service types as safe; monitor outcomes and remediate | Production readiness target met by 31 March; validated change, cancellation, consent, written confirmation, fee, and support evidence; no unresolved critical compliance defect |
| 7. Stabilization and enforcement readiness | 1–23 Apr 2027 | Resolve defects, expand coverage, audit fee and confirmation telemetry, evidence pack, executive attestation, final regulatory/legal review | Management readiness attestation; evidence pack complete; operational owners accept ongoing controls; contingency path rehearsed |
| 8. Enforcement commencement | 26 Apr 2027 | Requirement is enforced from this date | In-scope customers can use the compliant mechanism; controls are operational and evidence is retrievable |

### Phase gates

- **Gate 1 — Scope and rules baseline (20 Nov):** No unresolved disagreement about customer/service/action scope or rule ownership remains unowned.
- **Gate 2 — Design approval (11 Dec):** Legal/regulatory has approved disclosures, consent approach, and fee classification; architecture and system owners have accepted interface and fulfilment approach.
- **Gate 3 — Feature complete (5 Feb):** All mandatory in-scope paths are implemented in a test environment, including accessible alternatives and confirmation.
- **Gate 4 — End-to-end proof (26 Feb):** Critical flows and negative/exception cases have passed across channel, decisioning, order, provisioning, billing, notifications, and support.
- **Gate 5 — Business readiness (19 Mar):** Formal sign-offs, staff preparation, runbooks, monitoring, rollback, and customer remediation are ready.
- **Gate 6 — Compliance readiness (31 Mar):** Production implementation is available and the provider can demonstrate compliance with traceable evidence.

## Milestones

| Milestone | Target date | Evidence of completion |
|---|---|---|
| Sponsor, program manager, and workstream leads appointed | 6 Nov 2026 | Signed governance and integrated delivery plan |
| Regulatory obligation register and customer/service scope approved | 13 Nov 2026 | Regulatory/legal-approved obligation and scope record |
| Distributed rule and fee inventory complete | 20 Nov 2026 | Rule catalogue, owner, implementation location, conflict list; fee/channel matrix |
| System/interface and vendor constraint baseline complete | 20 Nov 2026 | Affected-system catalogue, interface owners, committed release windows |
| Target journey and decisioning design approved | 11 Dec 2026 | Solution design, process maps, decision API, state model, evidence requirements |
| Customer disclosures/consent and fee treatment signed off | 11 Dec 2026 | Legal-approved action-by-action disclosure and fee matrix |
| Core self-service MVP feature complete | 5 Feb 2027 | Demonstrable end-to-end build in test for all in-scope actions |
| System integration testing complete | 26 Feb 2027 | Signed test report, defect dispositions, reconciled transaction evidence |
| UAT and operating model approved | 19 Mar 2027 | Business/operations/compliance/accessibility/security/privacy sign-offs |
| Production readiness and compliance evidence pack complete | 31 Mar 2027 | Readiness attestation, runbooks, dashboards, customer-care training, test and audit evidence |
| Stabilization exit / final readiness confirmation | 23 Apr 2027 | Executive go/no-go record and verified open-issue disposition |
| CRTC enforcement begins | 26 Apr 2027 | Compliant mechanism operational and monitored |

## Critical Path

1. **Confirm scope and legal interpretation** for wireless and Internet service plans, customer populations, channels, device financing and other contract interactions, no-fee treatment, and applicable related decisions.
2. **Inventory current rules and assign owners** across portal, mobile app, CRM, catalogue, order management, billing, support, retail, and partners; identify contradictions and select the authoritative rule for each in-scope decision.
3. **Approve decisioning and customer evidence design:** allowed actions, eligibility, resulting contract disclosures, informed/express consent, prior-term return information, request state, and confirmation content/timeframe.
4. **Prove critical backend feasibility early:** read eligibility/terms; submit plan change/cancellation; propagate to provisioning and billing; return status; issue confirmation. Resolve synchronous limitations and agree safe asynchronous exceptions.
5. **Build and integrate the compliance MVP** across the existing channel(s), Central Rules Service, orchestrator, domain systems, notification, CRM/support, and fee controls.
6. **Complete end-to-end tests, accessibility/privacy/security validation, and operational UAT** with defects resolved before production rollout.
7. **Deploy with operational controls and build the evidence pack** by 31 March; use April as stabilization, not initial development.

**Critical-path threats:** delayed legal approval of contract/disclosure language; undiscovered rule conflicts; mobile/vendor release windows; legacy order/provisioning/billing interfaces; confirmation triggers not tied to actual outcome; and late accessibility/security findings.

## Mandatory vs. Optional Initiatives

### Mandatory for this compliance program

- Provide an easy-to-use self-service mechanism to upgrade, downgrade, add/remove services, and cancel applicable plans without routine live-representative interaction.
- Apply consistent eligibility, plan, disclosure, consent, and decision rules for the mechanism.
- Present resulting plan/contract changes and relevant ability to return to prior terms; obtain informed, express consent.
- Make changes effective immediately to the greatest extent possible and handle only reasonable clarification needs through representative handoff.
- Send written confirmation for every action and disclose expected delivery timeframe in the mechanism.
- Remove fees charged to access any type of customer service; validate separately any action-related fees against applicable instruments.
- Apply existing privacy/accessibility obligations and ensure accessibility review; provide customer support and complaint processes.
- Maintain enough operational evidence to investigate customer complaints and respond to direct CRTC administration.
- Achieve operational readiness before 26 April 2027.

### Optional / separately governed modernization

These can be valuable but must not be placed on the compliance critical path unless discovery establishes they are essential:

- Replacing CRM, billing, order management, mobile apps, or the customer-support platform.
- Enterprise-wide centralization of every business rule beyond the self-service policy scope.
- New commercial rules-engine procurement when an approved existing platform or small logical service can meet the need.
- Broad redesign of retail/partner sales journeys or migration of partner channels to self-service.
- Full legacy integration replacement, enterprise event-mesh transformation, or cloud migration.
- New analytics/data platform; a minimum viable compliance dashboard and audit evidence can use existing reporting tooling.
- Unrelated customer experience, pricing, product, or channel modernization.

## Recommendations

1. **Launch the program immediately.** Appoint an executive sponsor, accountable program manager, Regulatory Affairs lead, business product owner, and technical delivery lead. Establish weekly steering and twice-weekly critical-path reviews.
2. **Treat 31 March 2027 as the internal compliance-ready target.** Protect April for stabilization and evidence, not major feature construction.
3. **Keep the MVP narrow but complete.** Deliver all mandatory self-service actions across in-scope plan families; avoid platform replacement and unrelated modernization.
4. **Create a single policy rule source for this scope.** Centralize the self-service decision rules through a logical Central Rules Service, with one business owner and a controlled production version per rule family. Do not attempt to centralize unrelated enterprise rules before enforcement.
5. **Use existing channels and platforms first.** Prioritize the web portal and mobile applications already assumed in place; reuse CRM, order, billing, support, notification, and integration capabilities after proving they work for these journeys.
6. **Run technical spikes before committing to schedule.** Demonstrate one wireless downgrade, one Internet downgrade, and one cancellation end to end, including any device-financing/promotion disclosure, fulfilment, billing outcome, and written confirmation.
7. **Make confirmation and fee controls first-class acceptance criteria.** Test every self-service action and every customer-service access path, including retail and partner-related support flows.
8. **Bring accessibility, privacy, security, fraud, legal, and operations into discovery.** Late involvement creates high-impact rework and can consume the remaining contingency.
9. **Track compliance with evidence, not status reports.** Maintain obligation-to-control-to-test traceability; require demonstration and test evidence before declaring a requirement met.
10. **Escalate immediately if dependencies threaten the critical path.** Secure vendor commitments, environments, business owners, and legal content decisions in November; define an approved web-first contingency if mobile release timing is at risk.

### Activities to begin immediately (next 10 business days)

- Name sponsor, program manager, workstream leads, business rule owners, and regulatory/legal decision-makers.
- Schedule policy applicability and fee interpretation workshops; create an obligation register with accountable owners.
- Inventory every plan-change/cancellation journey and identify where its rules live across portal, apps, CRM, order management, billing, support, retail, and partner processes.
- Request API/interface documentation, vendor release calendars, environment access, test data, and development estimates from platform owners.
- Audit fee codes and customer-support charges by contact channel and identify any access-fee exposure.
- Start the device-financing, discount, bundle, and contract-consequence mapping for each affected wireless journey.
- Agree the required written-confirmation event, expected timeframe disclosure, delivery channel, failure handling, and evidence retention owner.
- Reserve accessibility, privacy, security/fraud, legal review, QA, and UAT capacity through March.
- Run end-to-end feasibility spikes for wireless and Internet downgrade/cancellation through order, provisioning, billing, CRM visibility, and notification.
- Create the integrated roadmap, dependency tracker, risk register, decision log, and weekly executive reporting.

## Source References

Primary source: Telecom Regulatory Policy CRTC 2026-78, “Enhancing self-service mechanisms,” issued 24 April 2026. Key determinations: self-service definition and customer scope (paras. 13–17, pp. 4–5); customer-service fees and written confirmations (paras. 25–31, pp. 6–7); direct administration, universal provider applicability, and implementation date (paras. 35–45, pp. 8–9). The policy states enforcement begins 26 April 2027.

Related project artifacts: [Regulatory Impact Assessment](./Regulatory-Impact-Assessment-CRTC-2026-78.md), [Business Capabilities](./Business-Capabilities-CRTC-2026-78.md), [Regulatory Discovery Questionnaire](./Regulatory-Discovery-Questionnaire-CRTC-2026-78.md), and [Architecture Spine](./architecture/architecture-BMAD-CRTC-2026-10-30/ARCHITECTURE-SPINE.md).

This roadmap is a planning recommendation based on the stated assumptions, not legal advice or a statement about the client’s actual architecture. Regulatory/legal owners should validate applicability and interpretations before implementation.
