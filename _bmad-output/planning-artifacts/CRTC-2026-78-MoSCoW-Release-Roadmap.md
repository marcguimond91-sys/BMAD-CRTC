# CRTC 2026-78 Release Roadmap — MoSCoW Prioritization

**Planning baseline:** 30 October 2026  
**Regulatory enforcement begins:** 26 April 2027  
**Recommended production-ready target:** 31 March 2027  
**Basis:** CRTC Telecom Regulatory Policy 2026-78 and the [Compliance Implementation Roadmap](./CRTC-2026-78-Compliance-Implementation-Roadmap.md)

## Executive Summary

The compliance release must deliver a usable self-service mechanism that lets applicable customers modify or cancel service plans—including upgrades, downgrades, and adding or removing services—without routine interaction with a live representative. It must support informed, express consent and transparency about resulting contract changes and whether the customer can return to prior terms; changes should take effect immediately to the greatest extent possible; every self-service action must receive written confirmation with the expected confirmation timeframe disclosed in the mechanism; and there must be no fee to access any type of customer service.

The Must Have scope is defined by the regulation, not by the assumed solution design. A Central Rules Service, a specific technology, app parity, real-time monitoring dashboards, and an enterprise-wide platform replacement are not prescribed by CRTC 2026-78. They may be prudent delivery choices, but should not displace mandatory customer outcomes or become dependencies unless discovery proves they are necessary.

Plan for a focused Must Have release to be tested and production-ready by **31 March 2027**, with April reserved for stabilization before enforcement on **26 April 2027**. The March target is a management buffer, not the regulatory deadline.

## MoSCoW Definitions

- **Must Have for April 2027 compliance:** Absence would leave a known CRTC 2026-78 obligation unmet, or would fail an applicable existing legal obligation that the policy says continues to apply. These are release blockers.
- **Should Have:** Strongly recommended for credible compliance, customer protection, or operational control, but not specified as a separate prescriptive requirement by CRTC 2026-78. A Must Have obligation must not be reclassified as Should merely because it is difficult.
- **Could Have:** Useful enhancement if capacity remains after Must Have scope is implemented, tested, and ready.
- **Future Enhancement:** Deliberately deferred modernization or broader scope that is not needed to meet the April 2027 mandate.

## Requirement Prioritization

### Must Have for April 2027 compliance

| ID | Requirement / acceptance outcome | Basis and interpretation |
|---|---|---|
| M1 | **Provider applicability and coverage:** The provider makes the required mechanism available; do not assume an exemption under this policy. Confirm applicable plans and customer/account scope with Regulatory Affairs/Legal. | The CRTC determined that the requirement applies to all service providers. The policy describes the definition as applying to individual and small-business customers and notes it may be less relevant to some larger businesses with account representatives. Do not silently exclude customer classes; obtain a documented legal scope decision. Paras. 17, 36–38, 43. |
| M2 | **Easy-to-use self-service mechanism:** At least one mechanism enables applicable customers to act on their service plans without interacting with a live customer service representative. The policy gives an app, website, or email as examples and does not mandate a channel. | CRTC definition and direction. Paras. 13, 16, 42–43. |
| M3 | **Plan modification and cancellation:** Customers can upgrade, downgrade, add or remove services, and cancel applicable telecommunications service plans through self-service. | The Act and policy cover modifying or cancelling plans; paragraph 13 explicitly includes adding/removing services. Paras. 4, 13, 16, 42–43. |
| M4 | **No routine live-agent gate:** The customer can complete the action independently; request additional information only where reasonably required to clarify the customer’s intent. | The representative interaction exception is limited to reasonable clarification. Para. 13. |
| M5 | **Prompt effectiveness:** Actions take effect immediately to the greatest extent possible. The implementation must not deliberately defer changes where the systems can apply them promptly. | Express CRTC expectation. The policy sets no numerical processing-time SLA. Para. 13. |
| M6 | **Transparent, informed, express consent:** Before a plan change, explain resulting contract/plan changes and whether the customer can return to existing terms if dissatisfied; capture the customer’s informed and express consent. | Paras. 14–16. |
| M7 | **Written confirmation:** Deliver written confirmation for each action the customer takes through self-service. | Express direction. The policy gives system-generated email as an example, not a required medium. Paras. 28–29, 44. |
| M8 | **Expected confirmation timeframe:** State within the self-service mechanism how long the customer can expect to wait for the written confirmation. | Express direction. The policy gives 24 hours as an example only; it does not prescribe a universal deadline. Para. 29. |
| M9 | **No fee to access customer service:** Do not charge a fee to access any type of customer service, including access to self-service. Separately assess any charge for the requested service action against other applicable rules. | Express prohibition and distinction between access charges and action charges. Paras. 25–27, 44. |
| M10 | **Existing privacy and accessibility obligations:** Continue to meet applicable privacy and accessibility requirements in the self-service mechanism. Identify the specific existing obligations applicable to the provider and test them. | The policy states existing privacy and accessibility protections apply; it does not create detailed new technical standards in this proceeding. Para. 30 and cited instruments. |
| M11 | **Accuracy of customer-facing information:** The options, contract consequences, consent, confirmation, and effective status shown must correspond to the customer’s actual selected action and applicable terms. | Necessary to satisfy the express informed-consent and written-confirmation outcomes (paras. 14–15, 28–29); implementation acceptance control, not a separately enumerated technology mandate. |

### Should Have

| ID | Requirement / control | Why it is Should, not a new prescriptive mandate |
|---|---|---|
| S1 | Provide an accessible self-service journey and a workable accommodation route that does not rely exclusively on live customer service; validate it with customers who use accessibility accommodations. | Strongly encouraged by the Commission (paras. 31, 45). Applicable existing accessibility law remains Must Have under M10; this item adds a practical design and validation target beyond the specific directions in this policy. |
| S2 | Give customers a view of request status and notify them when asynchronous fulfilment completes or fails. | Supports transparency and reduces uncertainty, especially when immediate completion is not technically possible. The policy requires written confirmation and timeframe disclosure, but does not prescribe a status portal or separate completion notice. |
| S3 | Maintain a correlated evidence record of the action, displayed terms/disclosures, consent, outcome, and confirmation delivery. Set retention with privacy/legal owners. | Strongly supports complaint investigation and direct CRTC administration (paras. 35–38); the policy does not specify evidence fields or a retention period. |
| S4 | Establish named owners and controlled versions for self-service rules; centralize the in-scope decision logic where rules are currently distributed. | Reduces inconsistent channel decisions. A Central Rules Service or rules-engine product is an architecture recommendation, not a named regulatory requirement. |
| S5 | Define an end-to-end operational control set: request/confirmation monitoring, failure alerts, retry/reconciliation, complaint triage, and customer remediation. | Prudent assurance for sustainable compliance; the policy does not prescribe particular tools, thresholds, or reporting cadence. |
| S6 | Apply the same customer-service access-fee controls across digital, support, retail, and partner processes, and audit fee codes and practices. | The no-fee prohibition itself is Must Have (M9); the enterprise audit and partner attestation mechanisms are recommended controls to prove it. |
| S7 | Use end-to-end acceptance tests for every in-scope action, key customer population, applicable device-financing/discount scenario, and material failure path. | The regulatory outcomes are Must Have; this broader test method and scenario coverage are implementation assurance. |
| S8 | Target production readiness by 31 March 2027 and reserve 1–23 April for stabilization and evidence review. | Provides schedule contingency. Only the 26 April 2027 enforcement start is in the policy; the March date is a program recommendation. |

### Could Have

| ID | Enhancement | Guardrail |
|---|---|---|
| C1 | Self-service request-status page with history and downloadable receipts. | Do not delay written confirmation or core actions to build a richer status experience. |
| C2 | Additional notification channels (for example, both email and in-app notification) or configurable customer preferences. | At least one written-confirmation delivery path must already meet M7–M8. |
| C3 | Customer research, usability analytics, and journey experiments to improve ease of use. | The mechanism must already be easy to use; research is a method to validate/improve, not a substitute for meeting M2. |
| C4 | Operational dashboards and trend analytics for abandonment, action completion, timing, exceptions, and confirmation delivery. | Minimum operational monitoring is advisable under S5; advanced analytics are optional. |
| C5 | Reusable disclosure and consent components shared across web and mobile applications. | A common component is optional; the required disclosures and consent must be accurate in whichever mechanism is used. |
| C6 | Proactive prompts or guidance to help customers understand plan options before changing or cancelling. | Must not create friction, obscure cancellation, or impair informed choice. |

### Future Enhancement

| ID | Deferred scope | Reason to defer |
|---|---|---|
| F1 | Enterprise-wide consolidation of all business rules beyond rules needed for regulated self-service actions. | Not required for this policy; keep rule migration limited to compliance-critical scope. |
| F2 | Replacement of CRM, billing, order management, customer support, mobile apps, or other core platforms. | No platform replacement is prescribed; pursue only if discovery proves an existing platform cannot support a Must Have outcome. |
| F3 | Procurement of a new commercial rules-engine product solely to satisfy this policy. | A logical centralized decision capability may use existing approved technology or a small service; product procurement is optional. |
| F4 | Full redesign of retail and partner sales as self-service channels. | The policy requires a self-service mechanism and prohibits customer-service access fees; it does not prescribe retail/partner channel redesign. |
| F5 | Enterprise event-mesh, API-platform, cloud, or data-platform transformation. | Broader modernization is not required if existing integrations can safely support the compliance journey. |
| F6 | Fixed universal transaction completion or confirmation SLA (for example, a regulatory 24-hour limit). | CRTC 2026-78 establishes no universal numeric deadline. The provider must disclose its expected confirmation timeframe and meet the immediate-effect expectation to the greatest extent possible. |
| F7 | New accessibility features such as sign-language instruction videos, video relay integration, or a specific screen-reader implementation adopted solely as a new CRTC 2026-78 mandate. | These were advocated during the proceeding but not imposed as additional requirements by this decision. Applicable existing accessibility duties remain Must Have under M10; specific enhancements should be assessed against those duties and user needs. |
| F8 | New regulator reporting platform or fixed reporting cadence. | The Commission will administer the requirement directly and may receive customer complaints; the policy does not prescribe a reporting format or routine cadence. Maintain practical evidence under S3/S5 and respond to applicable requests. |
| F9 | Restructuring device-financing agreements or building a separate device-finance self-service program. | Do not infer this policy creates a standalone financing obligation. Where a telecommunications plan action changes contract terms, applicable consequences must still be accurately disclosed under M6. |

## Release Roadmap

The plan is compliance-first. A requirement cannot move from Must Have to a later release because of capacity pressure; if a Must Have is at risk, the sponsor must add capacity, reduce optional scope, or escalate a compliant contingency.

| Release | Target window | Scope | Gate |
|---|---|---|---|
| **R0 — Scope and rules baseline** | **30 Oct–20 Nov 2026** | Confirm applicable services/customer classes; legal interpretation; map all required actions; inventory distributed rules, fee codes, current journeys, systems, interfaces, vendor dates; assign business owners | Regulatory/legal-approved obligation register; each rule and system has an owner or a tracked gap; release constraints and end-to-end technical spikes identified |
| **R1 — Compliance design** | **23 Nov–11 Dec 2026** | Approve exact eligibility and disclosure rules, informed/express consent, prior-term return information, no-fee interpretation, confirmation trigger/timeframe, Central Rules Service scope, orchestration/interface contracts, accessibility/privacy/security approach | Legal, regulatory, business, architecture, and system owners approve scope and design; wireless and Internet change/cancellation technical feasibility demonstrated or risk has an approved recovery plan |
| **R2 — Must Have MVP build** | **14 Dec 2026–5 Feb 2027** | Deliver M1–M11 using existing channels and platforms where feasible; self-service upgrades, downgrades, service additions/removals, cancellation; decisioning; consent; fulfilment; confirmation; timeframe display; no-fee changes | All mandatory journeys are demonstrable in test; component tests pass; no optional modernization blocks completion |
| **R3 — Integration, assurance, and regulatory validation** | **18 Jan–26 Mar 2027** | End-to-end tests, failure handling, billing/provisioning reconciliation, accessibility/privacy/security validation, customer-care readiness, evidence package, regulatory/legal verification | Critical compliance tests pass; no unresolved critical defect; evidence and operational ownership confirmed; formal readiness recommendation |
| **R4 — Production readiness and stabilization** | **22–31 Mar 2027; stabilization 1–23 Apr** | Controlled rollout, operational monitoring, defect correction, fee audit, complaint support, evidence review, final go/no-go | Production ready by 31 Mar target; stabilization exit by 23 Apr; compliant mechanism operating before 26 Apr enforcement |
| **R5 — Optional customer and platform improvements** | **After readiness; schedule separately** | Should/Could items not needed to establish minimum compliance; Future Enhancements subject to business case | Separate approval and funding; no erosion of compliance controls or service quality |

### Suggested feature order within R2

1. Establish accurate plan/action eligibility and contract consequences.
2. Implement one complete end-to-end action path through the existing portal, decisioning/orchestration, order, provisioning, billing, and customer support.
3. Extend the pattern to remaining mandatory actions: upgrade, downgrade, add/remove services, and cancellation.
4. Add and verify informed/express consent, including the exact terms version and relevant ability to return to existing terms.
5. Add written confirmations for every action and the expected timeframe disclosure in the mechanism.
6. Remove customer-service access fees and validate the fee distinction for any action charge.
7. Complete accessibility/privacy/security requirements and test exceptions, assisted clarification, duplicate submissions, and failed fulfilment.

## Requirements That Exceed the Minimum Regulatory Mandate

The following are **not standalone requirements imposed by CRTC 2026-78**, although some may be required by other laws, other CRTC decisions, contracts, or the provider’s own risk standards:

1. **Central Rules Service / commercial rules engine:** Recommended because rules are distributed; not explicitly required. A shared, consistent outcome is necessary, but architecture and product choice are not prescribed.
2. **Web and mobile feature parity:** The policy requires a self-service mechanism, not the same mechanism in every channel. At least one applicable mechanism must meet the requirements. Channel parity is a customer-experience recommendation.
3. **Request-status portal and separate lifecycle notifications:** Useful, but the decision explicitly requires written confirmation and disclosure of expected delivery timeframe—not a status dashboard or specified sequence of messages.
4. **Fixed completion or confirmation SLA:** No universal numeric limit is specified. Actions should take effect immediately to the greatest extent possible; providers must state the expected timeframe for written confirmation.
5. **New detailed accessibility features imposed specifically by this decision:** The Commission encouraged accessible mechanisms and noted existing protections apply, but did not impose the additional feature list sought during consultation. Applicable existing accessibility requirements remain binding and must be assessed.
6. **New reporting platform, audit system, or periodic reporting cadence:** Not specified. The CRTC administers the requirement directly and receives complaints; a practical evidence trail and complaint readiness are prudent.
7. **Self-service redesign of every retail and partner sales process:** Not required by the self-service mechanism direction. However, the separate no-fee-for-customer-service-access prohibition must be addressed wherever it applies, and partner arrangements should be reviewed for provider obligations.
8. **Standalone device-financing changes:** Not created by this policy. If a plan change affects a customer’s contract or plan terms, resulting changes relevant to informed consent still need to be explained.
9. **Enterprise-wide core-system replacement or all-rule migration:** Not required; use existing systems unless they cannot meet a Must Have outcome.
10. **31 March readiness date:** Recommended program buffer, not a CRTC date. The stated enforcement start is 26 April 2027.

## Traceability and Acceptance Principles

- Maintain one traceability row for each Must Have, linking obligation → business rule → customer journey → system/control → test case → evidence owner.
- Test upgrades, downgrades, adding/removing services, and cancellation independently; do not infer coverage from a single successful plan change.
- Include customers requiring authorized-user access and relevant small-business cases; document any larger-business applicability decision with Regulatory Affairs/Legal.
- Test both immediate completion and unavoidable asynchronous cases. Do not state that an action is complete until the authoritative domain outcome supports it.
- Test that confirmation is sent for each self-service action, the mechanism discloses the expected timeframe, and delivery failure is visible to an operational owner.
- Audit service-access fees separately from any action-related charges.
- Treat regulatory/legal approval of interpretations and customer disclosures as a release gate, not a substitute for technical and customer-journey evidence.

## Source References

Primary source: Telecom Regulatory Policy CRTC 2026-78, “Enhancing self-service mechanisms,” issued 24 April 2026. Key provisions: self-service definition and customer scope (paras. 13–17, 42–43); customer-service access fees and written confirmations (paras. 25–29, 44); existing accessibility/privacy protections and encouragement (paras. 30–31, 45); direct Commission administration, provider applicability, and enforcement start (paras. 35–39).

**Interpretive caution:** This prioritization is a program-planning aid, not legal advice. The policy uses both mandatory directions and encouragement, and it does not set detailed technical standards for usability, evidence retention, confirmation service levels, or system architecture. Validate service/account scope, existing accessibility/privacy obligations, fee treatment, and any device-financing implications with Regulatory Affairs and Legal.
