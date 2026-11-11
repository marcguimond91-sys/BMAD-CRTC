# Ecommerce Test Strategy: Telecom Regulatory Policy CRTC 2026-78

**Audience:** QA, ecommerce, product, engineering, billing, operations, accessibility, privacy, security, and regulatory/legal teams  
**Planning baseline:** 10 November 2026  
**Primary source:** [Telecom Regulatory Policy CRTC 2026-78, “Enhancing self-service mechanisms”](../../source/telecom%20regulatory%20policy%20CRTC%202026-78.pdf), issued 24 April 2026  
**Status:** Proposed strategy for an assumed provider; applicability, requirements, data, system boundaries, and acceptance thresholds require owner approval. This is not legal advice.

## 1. Purpose and outcome

Determine whether an industry-typical Canadian provider's ecommerce platform allows customers to shop and manage their services reliably while meeting the self-service requirements of CRTC 2026-78. Test the customer experience **and** the resulting records, fulfilment, billing and confirmation—not merely whether a button or order confirmation page appears.

The provider sells Internet, television, home phone, wireless plans and promotions, smartphones, watches, tablets, and security/IoT products. Its assumed ecommerce estate includes public storefronts, signed-in web and mobile experiences, shopping carts, checkout, and online account-management journeys, with integrations to identity, catalogue, eligibility, orders, provisioning, billing, payments, shipping, contracts and notifications. Actual features and integrations must be inventoried; this document does not assert that any particular system exists.

The release decision must answer:

1. Can an individual or small-business customer independently modify or cancel an applicable telecommunications service, using an easy-to-use mechanism, with the disclosures and informed, express consent needed for the action?
2. Is the requested action effected immediately to the greatest extent possible, accurately reflected downstream, and confirmed in writing, with the expected confirmation timeframe disclosed?
3. Are customer-service access fees absent from the ecommerce experience and its related bills? Are other charges assessed under their own applicable rules?
4. Do existing shopping, account, product, pricing and fulfilment journeys still work, including in complex bundles and failures?
5. Are results supported by reproducible evidence, approved interpretations and traceable test coverage?

## 2. Scope and regulatory boundaries

### In scope

- Ecommerce web and, **if provided**, mobile web/app customer journeys: discoverability, authentication, account selection, plan and service management, cancellation, shopping, cart, checkout, order history and communications.
- Individual and small-business account holders and authorized users, subject to verified authorization and account permissions. Include legacy and current plans, promotions and bundles.
- Internet, wireless and home phone telecommunications plans and add/remove services; all advertised modification and cancellation paths. Include TV, devices, accessories, financing, security and IoT wherever offered or affected by a transaction.
- Ecommerce-facing integrations and the resulting customer, order, provisioning, invoice, payment, contract and notification states. Integrations are observed for ecommerce transactions, not comprehensively tested as standalone enterprise platforms.
- Ecommerce access to customer service, including fees surfaced or triggered by the digital journey. The policy's prohibition covers **any type** of customer service; a separate enterprise-wide channel/billing audit is needed for full coverage.
- Accessibility, privacy and security checks relevant to these journeys under existing applicable requirements; functional, regression, integration, reliability, usability and selected performance tests.

### Not asserted by this strategy

- CRTC 2026-78 does **not** prescribe a particular website, app, every digital channel, technical architecture, delivery medium, fixed processing SLA, numerical usability target, or fixed confirmation deadline. Test the provider's chosen mechanism and approved commitments; channel parity below is a recommended product control, not a policy mandate.
- The Act describes self-service within the terms of the telecommunications contract. Legal/product must classify service and account applicability, including TV-only products, standalone hardware, device financing and non-telecom security/IoT. Do not automatically treat a TV subscription, device sale or financing agreement as a telecommunications plan covered by this policy. Test their **commercial correctness and any impact on covered service** regardless. A bundle does not automatically make every component subject to identical obligations.
- The policy distinguishes fees to **access customer service**, which it prohibits, from fees for actions. It explicitly references Telecom Regulatory Policy 2026-43 concerning activation and modification fees. Do **not** assume an action fee is permitted simply because it is not an access fee. Legal must approve an actionable rule inventory under 2026-43 and all other applicable law, Codes and contracts before fee tests can pass.
- The provider must deliver written confirmation for any action taken through self-service and disclose its expected timeframe. Legal must determine the boundary between an “action” and an abandoned, failed or merely attempted operation. A generic storefront purchase acknowledgement is not automatically a 2026-78 obligation.
- Physical retail, call-centre operations, non-ecommerce channels, network certification, third-party sellers' independent systems and enterprise-wide audits are outside execution scope. Their dependency risks and handoffs are tracked separately.

### Critical assumptions to resolve before execution

| ID | Decision / information required | Accountable owner | Impact if unresolved |
|---|---|---|---|
| A1 | Map each product and contract, including home phone, TV-only, watch/tablet plans, IoT, prepaid and small-business variants, to applicable obligations and permitted actions. | Regulatory/legal | Cannot claim complete regulatory coverage. |
| A2 | Identify the designated compliant self-service mechanism(s), customer populations and alternate accessible path; inventory all ecommerce entry points. | Digital product + regulatory | Cannot assess availability, reachability or channel scope. |
| A3 | Approve exact disclosures, consent language, return-to-prior-terms treatment, effective-time rules and written confirmation expectations, including failure states. | Legal + product + operations | Expected results and evidence remain provisional. |
| A4 | Approve fee inventory and expected outcomes under 2026-78, 2026-43, other applicable rules and contracts; include taxes and credits. | Regulatory/legal + billing | Fee test results cannot be certified. |
| A5 | Define account roles, proof of authorization, order state model, downstream truth sources, asynchronous exceptions and notification delivery evidence. | Identity + order management + operations | Cannot distinguish success from acceptance or unauthorized execution. |
| A6 | Confirm test environments, representative catalogues, anonymized data, test doubles, observability and safe reconciliation across dependencies. | QA + engineering + vendors | End-to-end evidence will be incomplete. |

Any unapproved assumption is an **open compliance risk**, not a passing result.

## 3. Source-to-test traceability

**Labels:** **P** = explicit policy requirement/direction; **I** = policy interpretation requiring legal validation; **C** = recommended provider control; **O** = obligations potentially arising elsewhere. IDs below link to the scenario catalogue in sections 6–9.

| ID | Baseline and classification | Source | Test coverage / acceptance evidence |
|---|---|---|---|
| R1 | **P:** Easy-to-use self-service permits modification, including upgrades/downgrades and add/remove services, and cancellation without a live representative; clarification exception only when additional information is reasonably required to establish intent. | Paras. 13, 16, 42–43 | C01–C09, E01–E04, E12; complete journey and actual effective state; record any clarification and justification. |
| R2 | **P:** Definition applies to individual and small-business customers; policy says all service providers and provides 26 April 2027 for implementation/enforcement. “Customer” includes account holder or authorized user. | Paras. 15–17, 38–39, 43 and footnote 5 | C01–C04, C08–C09, F01–F02, E05; role/account mapping, inventory and execution evidence. |
| R3 | **P:** Mechanism must be transparent and enable informed, express consent. For a telecom contract change, customer is made aware of resulting contract changes and whether prior contract terms can be restored. | Paras. 14–15 | C10–C15, E06–E07; rendered disclosure, consent and corresponding effective terms. |
| R4 | **P:** Self-service actions must take effect immediately **to the greatest extent possible**. | Para. 13 | C16–C18, E08–E10; request, effective and downstream timestamps; documented, approved reasons for exceptions. |
| R5 | **P:** Written confirmation for any action taken through self-service; specify expected confirmation timeframe in the mechanism. | Paras. 28–29, 44 | C19–C23, E11; actual delivery evidence, customer-visible copy, disclosed interval and action reconciliation. |
| R6 | **P:** No fees for accessing any type of customer service. **O:** Other determinations govern particular action fees. | Paras. 26–27, 44; 2026-43 referenced by para. 27 | C24–C26, F19, E13; fee-rule inventory, cart/invoice and posted bill. Enterprise-wide channels require separate coverage. |
| R7 | **P/O:** Existing accessibility and privacy protections apply. **C:** The Commission encourages accessible self-service and not relying exclusively on live support for accommodations. | Paras. 30–31, 45 | N01–N05; accessibility findings, assistive-technology execution and privacy controls against approved standards. The policy does not set a new technical standard. |
| R8 | **C:** Consent, action and delivery evidence supports dispute investigation; the Commission directly administers this self-service requirement. No retention period is specified here. | Paras. 28–29, 35 | C14, C20–C23, N06; correlation, approved retention and retrieval evidence; no unsupported CCTS-routing assertion. |
| R9 | **C:** Product/commerce correctness and transactional integrity across in-scope experiences. | Provider requirements; not asserted as a new obligation under this policy | F01–F25, G01–G10, E01–E16; independently calculated results and downstream reconciliation. |

Policy paragraph references are the primary regulatory baseline; example tests, measurements and controls below are QA design choices. Regulatory/legal must revalidate the source and other applicable decisions before sign-off. The policy does not identify a single compliance SLA for immediate effect or confirmation.

## 4. Coverage model and priorities

**P0:** A failure can block compliant change/cancellation, create unauthorized changes, prevent required confirmation, charge for customer-service access, or cause material harm across a customer cohort. **P1:** Important customer journey, integration, accessibility or financial correctness; **P2:** lower-frequency, recoverable edge case. Severity is assigned to the actual defect based on impact, not only scenario priority.

Build an inventory row for every offered product/plan family, customer segment and authorized role, including legacy offers, in-scope action and chosen mechanism. Map each applicable row to at least one executed result and each exception to an owner. Unavailable or unsupported combinations must be justified by approved product and regulatory rules, not silently excluded.

| Dimension | Minimum representative values |
|---|---|
| Customer | Individual; small business; new/existing; account holder; authorized user; unauthorized user; multi-account household/business. |
| Service/product | Internet; wireless voice/data; home phone; TV; smartphone; watch; tablet; security/IoT. Identify service-linked vs standalone device and telecom vs non-telecom classification. |
| Lifecycle/action | Purchase/add; upgrade; downgrade; add/remove service or add-on; full and partial cancellation; change before/after checkout; pending/completed/failed action; renewal/promotion expiry. |
| Commercial arrangement | Prepaid/postpaid if offered; term/month-to-month; grandfathered/current plan; financed/paid device; promotional/bundle credits; tax jurisdiction; mixed cart. |
| Channel / interface | Every designated self-service mechanism; supported web/mobile browser and app versions, if applicable; English/French where offered or required; accessibility modes. |
| Time / state | Immediate and approved deferred fulfilment; billing boundary; promotion expiry; time zones/daylight saving; concurrent or pending requests; outages and recovery. |

Execute all P0 action types for each applicable telecommunications plan family and both customer populations on the designated mechanism. Run targeted combinations for roles, promotions, bundles, finance and failures. Use pairwise/risk-based combinations for the rest, supplemented by explicit high-risk combinations below; pairwise is not a substitute for complete mandatory action coverage.

## 5. Test approach and environments

1. **Discovery and oracle creation:** Obtain product catalogue, contracts, pricing and fee schedules, legal applicability decisions, approved screen content, account role model, order state machine, effective-time rules, confirmation delivery design and integrations. Freeze approved expected results and version them. If a capability differs from assumptions, update the inventory and tests before execution.
2. **Layered testing:** Unit/component tests for rule calculations, UI state and consent; API/contract tests for eligibility, ordering, billing, provisioning and notifications; integrated system tests against representative dependencies; end-to-end customer journeys and bill reconciliation; manual accessibility, usability and exploratory testing. Automation supports but does not replace evidence of actual integrated behaviour.
3. **Independent checks:** Compare the UI to approved contract and fee rules, not to the same API that rendered it. Compare order, service inventory/provisioning and billing records to the accepted request. Inspect a received written confirmation and delivery records where available. A queued notification or an on-screen success alone is not proof of delivery or fulfilment.
4. **Fault injection:** Use controlled timeouts, duplicate responses, stale data and downstream failure only in approved non-production environments. Assert recovery, no false success, no duplicate charges/actions and correct customer communication. Validate provider-controlled notification delivery to a monitored test inbox; whether a downstream email mailbox displays a message may depend on external providers.
5. **Customer validation:** Observe representative participants, including assistive-technology users and small-business users, completing key tasks without coaching. A failed or unnecessarily obstructed journey triggers investigation; a provider-defined usability target does not by itself establish regulatory compliance.
6. **Production readiness:** Exercise approved synthetic, non-billable accounts and controlled low-risk journeys after deployment, with explicit rollback/cleanup, notification destinations and monitoring. Never cancel or modify an actual customer's service for a test.

### Test data and controls

- Use synthetic or approved anonymized data; no real payment credentials, personal information or live network actions in test environments. Restrict access to evidence and mask sensitive fields.
- Create stable personas per segment/role, with current and grandfathered offers; active, suspended, overdue and pending orders; linked lines; multiple accounts; device instalments; mixed bundles; credits and different jurisdictions. Label legal eligibility and expected restrictions.
- Use deterministic catalogues and a controlled clock for promotion, billing, effective-date and expiry testing. Include current, stale and future versions; preserve independent expected prices/taxes/credits.
- Supply notification inboxes, sandbox payments, provider simulators and test numbers. Tag every request with a unique correlation ID. Capture pre/post snapshots, consent text/version, timestamps, order and service IDs, received message and invoice lines.
- Reset fixtures between scenarios; reconcile pending orders, payments, inventory and sent messages. Mocks are useful for failure injection but do not replace at least one integrated test of each critical production dependency. Record unavailable integrations as evidence gaps.

## 6. Compliance scenario catalogue

Each row is a test family, not a single UI click. Instantiate it against the applicability inventory and record specific prerequisites, input values, approved oracle, expected result and evidence. **P0** is the default unless stated otherwise.

| ID | Scenario and expected result |
|---|---|
| C01 | From an existing Internet account, independently upgrade and downgrade an eligible plan. The chosen plan and terms are visible, consent is obtained, action is actually applied and written confirmation is delivered; no live representative is required. |
| C02 | Repeat C01 for wireless, home phone and any other legally classified telecommunications plan families, including a representative small-business account. Verify a downgrade is not blocked solely by a retention offer or representative handoff. |
| C03 | Independently add and remove an eligible telecommunications service/add-on. Verify only the selected account/line changes, disclosure and confirmation match, and downstream entitlement and billing agree. |
| C04 | Cancel a complete eligible Internet, wireless and home-phone plan, and a single selected line/service within a multi-service account where contractually supported. Verify correct target and that unrelated services remain intact; no mandatory representative or retention intervention. |
| C05 | Locate the modification and cancellation paths from ordinary account navigation on the designated mechanism; compare with purchase paths. Verify wording, number of steps and obstacles in a moderated usability test; do not treat a hard-coded click limit as policy. |
| C06 | Decline each optional retention offer, survey or help interaction. The requested eligible action remains available and is not delayed or redirected to a live agent. |
| C07 | Where intent is genuinely ambiguous, present a proportionate clarification and record the reason. Verify routine or clear requests do not require a representative. Regulatory owner reviews any representative interaction invoked for clarification. |
| C08 | Execute applicable actions as an individual and a small-business account holder, on current and legacy plans. Comparable customers can complete the applicable action independently; any exclusion is backed by an approved rule. |
| C09 | Execute permitted actions as a properly authorized user and try the same action as an unauthorized user. Enforce the approved role scope without granting access to another account or unnecessarily blocking an authorized customer. |
| C10 | Before final consent, compare the proposed change against existing and resulting contract terms: service, recurring/one-time prices, promotional end dates, material features, term and affected linked benefits. Display correct differences under approved content rules. |
| C11 | Explain, before consent, whether the customer can return to the existing contract terms if dissatisfied. Test both a restorable current offer and an approved non-restorable grandfathered offer; no promise of restoration where it cannot be honoured. |
| C12 | Show applicable consequences of cancellation or change, including approved device balance, promotion loss, bundle repricing, equipment return and effective date when relevant. Reconcile amounts with approved sources; do not present non-applicable charges. |
| C13 | Try proceeding without an affirmative consent action, with a preselected option, by navigating back, or with a stale consent state. No change is applied without valid informed, express consent to the actual terms. |
| C14 | Capture action-specific affirmative consent with the account/role, displayed terms and version, timestamp and transaction correlation. Retrieved evidence matches the exact committed action, without exposing unnecessary personal information. |
| C15 | Change a plan, price, selected line or term after a disclosure was shown, or receive updated eligibility before submission. Present revised terms and obtain renewed consent before applying the materially changed transaction. |
| C16 | For a change supported synchronously, compare request, acceptance and effective timestamps with service and billing state. It takes effect immediately where possible; an acknowledgement must not be mislabeled as completion. |
| C17 | For an unavoidable asynchronous dependency, verify the approved reason, transparent pending status and expected timing; monitor progress to actual effective state and reconcile billing. Investigate avoidable delay rather than automatically treating an SLA as a policy safe harbour. |
| C18 | Submit cancellation and confirm that the selected service ceases at the approved effective time, not merely when an order is opened. Verify no post-effective recurring charge beyond approved rules and no unintended loss of other service. |
| C19 | For every legally scoped self-service action, including add, remove, upgrade, downgrade and cancel, display the expected written-confirmation timeframe within the mechanism and deliver a written record to the approved customer destination. |
| C20 | Inspect the actual received confirmation against the accepted action: correct account/line, selection, applicable terms, status and effective date. It must not claim completion where the action is pending or failed. |
| C21 | Measure delivery against the timeframe disclosed to the customer, including a change made near the deadline boundary. Alert and investigate any miss; the timeframe is a provider commitment, not a universal CRTC deadline. |
| C22 | Inject notification queue failure, bounce or delayed delivery. Ensure monitoring, controlled retry/escalation and customer/operations follow-up according to approved procedures; preserve delivery status and avoid claiming a message was delivered when only queued. An undelivered required confirmation remains a failure requiring remediation. |
| C23 | Test a change/cancellation where the service being cancelled is the customer's only registered messaging route. Confirm the customer has a usable approved destination and actually receives the written record, without requiring the cancelled service to receive it. |
| C24 | Access the platform's help, self-service and available customer-service entry points. No customer-service access fee appears in the UI, cart, payment, order, invoice or posted bill. Test each ecommerce-supported channel and associated fee path. |
| C25 | Exercise action charges, including activation or modification fees, against the separately approved legal fee matrix. Block prohibited charges and show any legally permitted and applicable charge accurately before consent; do not infer permissibility from its label. |
| C26 | Verify fees cannot be hidden as a support surcharge, mandatory assisted-service charge, negative credit or bundled access fee. Reconcile from fee catalogue through checkout and the posted bill. |

## 7. Functional ecommerce coverage

These are product correctness tests; they are not all requirements newly imposed by 2026-78. P1 unless indicated.

| ID | Scenario and expected result |
|---|---|
| F01 | Register/sign in, sign out, recover access and select account. Correct account is shown; authentication failures and lockouts follow approved security requirements without altering services. |
| F02 | Switch between personal and eligible small-business accounts and between authorized lines. Roles and visible/available actions match the selected account; no cross-account leakage. |
| F03 | Search, filter and compare Internet, TV, phone and wireless plans. Product details, eligibility, geographic availability, prices and promotional terms match approved catalogue versions. |
| F04 | Verify Internet serviceability at valid, invalid, multi-unit, rural and recently changed addresses. An unsupported address is not sold service and any alternative is accurately described. |
| F05 | Select wireless plan and add-ons; validate coverage disclosures, data/voice features, roaming options, line eligibility and mutually exclusive add-ons against the catalogue. |
| F06 | Configure TV packages, add/remove channels and equipment where offered. Validate package prerequisites and existing bundle effects; do not assume TV-only service is subject to R1 without legal approval. |
| F07 | Configure home phone, number options and applicable calling features. Eligibility, number selection/porting and service-specific conditions agree with approved rules. |
| F08 | Select smartphones, watches and tablets by model, colour, storage, availability and connectivity. Compatible devices, accessories, SIM/eSIM and service dependencies are accurately represented. |
| F09 | Purchase eligible security/IoT products and subscriptions. Device connectivity, compatible plan, installation and monitoring dependencies are accurately disclosed; classify any underlying telecom plan separately. |
| F10 | Build a mixed Internet/TV/phone/wireless/device/IoT cart. Quantities, per-item selections, eligibility, one-time and recurring totals are correct, and unrelated items remain unchanged. |
| F11 | Add, edit and remove cart items, vary quantity and navigate back or refresh. Totals and prerequisites recalculate; removed items do not reappear or remain billable. |
| F12 | Apply a valid promotion, an expired promotion and an ineligible or conflicting promotion. Show correct eligibility, stacking, expiry, credits and resulting total; never silently apply an invalid benefit. |
| F13 | Compare bundled versus standalone pricing, discounts and lost discounts when adding or removing a qualifying item. Verify all affected services and future price changes against independently calculated expectations. |
| F14 | Compare full purchase price and device financing, including instalments, down payment, term, taxes, remaining balance and available promotional credits. Verify approved financing disclosures and transaction records. |
| F15 | Calculate jurisdiction-specific taxes, shipping, one-time charges, recurring charges, credits and prorations with approved rounding. Compare display, order summary, payment authorization and posted invoice. |
| F16 | Validate credit/eligibility and deposits where offered, using approved sandbox outcomes: approved, declined, pending and insufficient information. Explain the outcome without revealing sensitive information or creating an unauthorized order. |
| F17 | Select delivery/pickup and installation where offered; validate address, inventory, delivery fee, appointment slot and relevant service prerequisites. Fulfil only the intended order. |
| F18 | Process supported payment methods in a sandbox: authorize, decline, cancel, retry and refund. Reconcile order and payment states; no double charge or paid-but-untracked order. |
| F19 | Review complete checkout, including recurring and future prices, term, applicable fees and tax, before placing an order. Accepted terms and posted bill match the approved commercial rules. |
| F20 | Test guest purchase and conversion to account, if supported. Link the order to the correct customer only after approved verification; never expose or modify another customer's account. |
| F21 | Test new number, number transfer and port failure where supported. Show correct order state and next steps; coordinate cancellation/activation under approved porting rules to avoid premature loss of service. |
| F22 | Verify order history and tracking for purchase, service change and cancellation. Correct line items and state are visible and agree with order/provisioning systems. |
| F23 | Change or cancel an unfulfilled ecommerce order when allowed. Enforce time and product rules; reverse or adjust inventory, payment and promotional effects without duplicate charges. |
| F24 | Check new service and device activation, SIM/eSIM assignment and entitlement after fulfilment. Selected plan, hardware and account associations match the order. |
| F25 | Verify English and French journeys where offered or required: content, currency, dates, terms and confirmation match the selected language and approved translations. |

## 8. Regression suite and execution triggers

Baseline expected results against the last approved production behaviour **except** where policy or approved business changes intentionally change that behaviour. For intentional changes, record the old outcome, new approved outcome, rationale and impacted customers. Re-run all affected layers for feature flags on/off and migration cohorts as relevant.

| ID | Regression pack / minimum coverage | Trigger |
|---|---|---|
| G01 | **P0:** Login, role/account selection and all applicable change/cancel happy paths; C01–C04, C09, C13, C19. | Any identity, navigation, self-service or release configuration change. |
| G02 | **P0:** Catalogue/eligibility: representative eligible/ineligible current and legacy plans, add-ons and regions; C01–C03, F03–F05. | Catalogue, pricing, rules, geography or integration change. |
| G03 | **P0:** Contract disclosure, restoration and action-specific consent/version; C10–C15. | Terms, UI content, consent, product or contract changes. |
| G04 | **P0:** Order, provision, effective state, cancellation and pending/failure paths; C16–C18, E08–E10. | Order orchestration, network/provisioning or billing change. |
| G05 | **P0:** Delivery and displayed timeframe, with received confirmation for each action type; C19–C23. | Templates, contact preferences, notification provider, queue or retry change. |
| G06 | **P0:** Access-fee prohibition and legal fee matrix, including invoice reconciliation; C24–C26. | Fee catalogue, billing, customer-service entry, promotion or tax change. |
| G07 | Cart, checkout, payment, taxes, shipping and order history; F10–F20, F22–F23. | Ecommerce frontend/backend, payment, fulfilment or tax change. |
| G08 | Bundles, discounts, promotions, device financing and impacted services; F12–F15, E01–E03. | Pricing, promotion, financing or bundling change. |
| G09 | Device compatibility, SIM/eSIM, stock, delivery, installation and activation; F08–F09, F17, F24. | Hardware catalogue, inventory, device activation or logistics change. |
| G10 | Accessibility, localization, browser/mobile and security critical paths; F25, N01–N05. | UI framework, content, identity, accessibility or supported-platform change. |

Run the critical P0 pack on every release candidate; run relevant P1/P2 packs for changed areas and a complete risk-based suite before compliance release. Run targeted retests plus impacted regression after every fix. If a change's impact is unknown, expand rather than shrink coverage.

## 9. Fringe, failure and abuse cases

| ID | Case and expected outcome | Priority |
|---|---|---|
| E01 | Cancel Internet in a TV/home-phone bundle with a wireless discount: show approved loss of discounts and remaining-service prices before consent; only selected service ends; bill reconciles. | P0 |
| E02 | Cancel one wireless line with a financed smartphone, linked watch and promotional credit: show approved device balance, credit impact and watch dependency; do not cancel another line or charge twice. | P0 |
| E03 | Downgrade a grandfathered plan with a limited-time promotion immediately before expiry: disclose exact changed terms and whether restoration is possible; enforce actual catalogue time and approved pricing. | P0 |
| E04 | Account has a suspended service, debt, pending dispute or unpaid device balance. Apply approved contractual/legal rules; do not automatically force a live representative or deny otherwise permitted self-service. Escalate unsupported restrictions to regulatory owner. | P0 |
| E05 | Small-business account has many lines and multiple roles. Authorized user modifies permitted line only; concurrent admin permissions or role revocation are checked at submission. | P0 |
| E06 | Two tabs or channels show different plan versions; one changes eligibility or price before the other submits. Reject/requote stale intent, present current terms and obtain renewed consent; do not commit outdated terms. | P0 |
| E07 | Browser back, refresh, session timeout or consent replay after a term change: no phantom action and no reuse of prior consent for materially different terms. | P0 |
| E08 | Double click, network retry or duplicate API request after a timeout: a single intended transaction and charge; return the authoritative status, not a duplicate. | P0 |
| E09 | Request accepted but provisioning times out or partially completes. Show a truthful pending/failure state, avoid unsupported completion/confirmation claims, reconcile and recover under approved procedures without duplicate actions. | P0 |
| E10 | Billing succeeds but provisioning fails, or vice versa. Detect mismatched state, prevent or correct improper billing, alert operations and communicate recovery; do not report full completion until verified. | P0 |
| E11 | Notification destination is invalid, changed mid-transaction, mailbox bounces or provider retries duplicate messages. Use approved verified destination, track actual delivery/failure and remediate missed written confirmation without exposing another person's details. | P0 |
| E12 | Cancellation path encounters forced login loop, inaccessible control, mandatory survey or chat handoff. Identify and remove unjustified barrier; test alternative accessible path if approved, without presenting live support as the only practical option. | P0 |
| E13 | An access fee is introduced by an upstream billing rule, tax mapping, support link or migration even when UI shows zero. Detect through order and posted-bill reconciliation; correct and escalate. | P0 |
| E14 | Out-of-stock device, expired reservation or unavailable installation slot during checkout. Explain changed availability and reprice/reconfirm where needed; no charge for an unfulfillable selection. | P1 |
| E15 | Action crosses midnight, billing cutover, promotion expiry or daylight-saving change. Verify timezone, eligible terms, proration and stated effective date against the controlled clock. | P1 |
| E16 | Interrupt connectivity on mobile, revoke authorization during checkout, or resume a cart on another device. Preserve only authorized state; display accurate status and require fresh consent if terms changed. | P1 |

## 10. Non-functional and operational assurance

| ID | Coverage and method | Acceptance basis |
|---|---|---|
| N01 | Keyboard-only navigation, focus order, visible focus, screen-reader names/status/errors, zoom/reflow, contrast and form validation on critical change/cancel flows. Test actual supported assistive technologies and devices. | Applicable standards and accommodation requirements approved by accessibility/legal; no unremediated critical barrier on a designated path. |
| N02 | Moderate representative usability sessions for discover, modify and cancel tasks; include individual, small-business and people requiring accommodations. Record task completion, missteps, confusion and time without coaching. | Provider-approved targets plus qualitative review; escalate substantial obstacles regardless of target achievement. |
| N03 | Privacy/security: verify account ownership/authorization, session expiry, CSRF and input protections as applicable, notification destination verification, sensitive-data minimization and masked logs. | Approved security/privacy requirements; no critical unauthorized access, disclosure or transaction. |
| N04 | Load and concurrency around promotion expiry, plan migration and billing cutover. Measure page/API response, submission throughput, errors, queues, effective time and notification delivery. | Product/operations-approved limits and realistic capacity model, not an invented regulatory SLA. |
| N05 | Outage/recovery of identity, catalogue, order, provisioning, billing and notification dependencies. Check truthful status, alerting, retry, reconciliation and recovery. | Approved recovery objectives; no silent failure, unauthorized transaction or duplicate billing; required confirmation failures remediated. |
| N06 | Trace one action from request through consent, order, provisioning, billing, message delivery and complaint investigation. Verify access controls, timestamps, correlation and retention against approved policy. | Evidence retrievable and consistent; retention period is an organizational/legal decision, not a 2026-78 number. |

## 11. Execution, metrics and release governance

### Sequence and ownership

1. **Prepare:** Regulatory/legal approve A1–A4 and traceability; product signs off journeys and content; engineering/billing identify system-of-record oracles; QA prepares data and evidence. Record exceptions and dependencies.
2. **Verify components and integrations:** Engineering and QA run rule, API and contract tests; vendors confirm dependency readiness. Establish known-good baseline and run controlled fault injection.
3. **Run end-to-end:** QA executes C, F and E scenarios, with provisioning/billing/notification owners inspecting real downstream outcomes; accessibility specialists run N01–N02; security/privacy owners run N03.
4. **UAT and defect remediation:** Product, customer operations and representative users validate customer tasks and communications. QA retests fixes and impacted regressions; regulatory/legal resolve applicability and fee questions.
5. **Go/no-go and monitoring:** QA compiles evidence and coverage gaps; regulatory/legal, digital product, operations, accessibility/privacy/security and executive release owner decide readiness. Validate release and alerting with synthetic accounts. Track production outcomes and customer complaints, failed confirmations, delay and billing exceptions; investigate and correct recurring problems.

Plan backwards from **26 April 2027**, with enough time for integrated tests, fixes, retesting and stabilization. That date is the policy's stated implementation/enforcement date for self-service, not an implied fixed deadline for every internal test milestone.

### Proposed measurements

| Metric | Measurement and proposed release criterion |
|---|---|
| Mandatory action coverage | **100%** of applicable product-family × action × individual/small-business inventory rows executed on the chosen mechanism, with named justification and legal approval for non-applicable combinations. Roles and high-risk variants are separately mapped. |
| Traceability | **100%** of R1–R7 mapped to approved tests, executions and evidence; missing interpretation or integration is explicitly marked blocked, not passed. |
| P0 outcomes | **100%** of applicable P0 scenarios passed, including actual effective state and received confirmation where required; zero open P0 defects. |
| Other defects | Zero open critical/high defects affecting compliance, unauthorized changes, material billing, privacy or a critical accessible journey. Other defects require documented business impact, workaround, owner, due date and sign-off; a waiver does not establish legal compliance. |
| Confirmation | For tested completed actions, **100%** have a disclosed expected timeframe and received written confirmation; compare actual delivery with that disclosed timeframe. Failed delivery is a defect and must be remediated; do not count queue acceptance as delivery. |
| Effective action | For each tested action, record request and effective timestamps and downstream reconciliation. Investigate non-immediate outcomes and obtain owner-approved evidence of why immediate effect was not possible. No blanket “X hours is compliant” assumption. |
| Financial correctness | **100%** of tested prohibited access fees are absent from UI/order/bill; all tested action fees, taxes and credits reconcile to the approved rule matrix. |
| Regression | Applicable P0 packs pass on the release candidate; all impacted P1/P2 packs executed or explicitly risk-accepted with owners and rationale. |
| Accessibility, privacy and security | Owners approve applicable standards, execution and remaining risks; zero unresolved critical blockers for the designated journey. |

These are **proposed QA release criteria**, not numeric requirements stated by the Commission. A test pass does not prove that the entire enterprise or every customer is compliant.

### Defect and evidence standards

For each defect, record affected cohort and action, actual vs expected result, source/approved rule, customer and regulatory risk, screenshots or accessible capture, correlation ID, timestamps, environment and reproducible steps. Link it to scenario, requirement, build and retest. Distinguish product failure, missing test dependency, unapproved oracle and insufficient delivery evidence.

Retain an execution record with: baseline/build and feature flags; test-data IDs and segment/role; catalogue, contract and fee versions; exact disclosure and affirmative consent; request and effective timestamps; order/provisioning/billing reconciliation; displayed confirmation timeframe; received written message and delivery status; outcome, defect link and reviewer. Store evidence securely under approved retention and privacy rules.

**Blocking conditions:** unidentified applicable plan/action, missing legal fee interpretation, unavailable critical integration, unexplained non-immediate effect, undelivered required confirmation, blocked authorized customer or unverified billing outcome prevents a clean compliance sign-off for the affected scope. If release is nevertheless considered, decision-makers must explicitly document exposure and remediation; QA must not mark the unresolved area as passed.

## 12. Deliverables

1. Approved product/action/role applicability inventory and regulatory interpretation/fee matrix.
2. Detailed test cases and reproducible synthetic data mapped to R1–R9 and C/F/G/E/N identifiers.
3. Automated component, integration and critical journey regression packs, plus manual accessibility, usability and exploratory results.
4. Execution dashboard, defect register, actual delivery and downstream reconciliation evidence.
5. Release recommendation, named approvals, open risks and production monitoring/incident handoff.
