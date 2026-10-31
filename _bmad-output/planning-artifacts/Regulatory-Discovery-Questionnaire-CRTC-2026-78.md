# Regulatory Discovery Questionnaire

## Telecom Regulatory Policy CRTC 2026-78 — “Enhancing self-service mechanisms”

**Purpose:** Help telecom business stakeholders and architects discover where current business rules are implemented, identify affected systems and integrations, and assess potential compliance gaps against CRTC 2026-78.

**Source material:** [Telecom Regulatory Policy CRTC 2026-78](../../source/telecom%20regulatory%20policy%20CRTC%202026-78.pdf) and the [Regulatory Impact Assessment](./Regulatory-Impact-Assessment-CRTC-2026-78.md). The [Business Capabilities catalogue](./Business-Capabilities-CRTC-2026-78.md) can be used as a capability reference.

> This is a discovery aid, not a legal interpretation or a compliance certification. Validate conclusions with regulatory and legal stakeholders against the policy, applicable legislation, existing accessibility and privacy obligations, and any relevant CRTC decisions.

## 1. Workshop Setup

### Suggested participants

- Regulatory affairs / compliance and legal
- Consumer product, pricing, and contract owners
- Digital channels and customer experience
- Customer care and complaints
- Enterprise, solution, and integration architecture
- Order management, provisioning, service operations, and network operations
- Billing, rating, and finance
- Identity, fraud, security, privacy, and accessibility
- Data, analytics, testing, and release management
- Small-business product or account-management representatives

### How to use

1. Hold a joint business/architecture discovery session, then follow up with system owners where answers need evidence.
2. For each answer, record the respondent, source or artifact, and confidence. Prefer demonstrations, process maps, rule tables, configuration extracts, interface contracts, and test evidence over recollection alone.
3. Distinguish current-state facts from proposed future-state decisions and assumptions.
4. Record gaps as confirmed, potential, or unknown. Do not mark an obligation compliant solely because a capability is planned.
5. Link each finding to one or more obligation IDs below and the supporting evidence.

### Policy obligation reference

| ID | Discovery obligation | Policy reference |
|---|---|---|
| O1 | Provide an easy-to-use mechanism enabling customers to modify or cancel service plans without a live representative; includes modifying by upgrading, downgrading, and adding or removing services. | Paras. 13, 16–17, 42–43; pp. 4–5, 9 |
| O2 | Make self-service transparent and support informed, express consent; communicate resulting contract changes and whether the customer can return to prior terms if dissatisfied. | Paras. 14–15; p. 4 |
| O3 | Actions should take effect immediately to the greatest extent possible; additional information may be requested when reasonably needed to clarify customer intent. | Para. 13; p. 4 |
| O4 | Send written confirmation for any action taken through self-service and state the expected confirmation timeframe within the mechanism. | Paras. 28–29, 44; pp. 6–7, 9 |
| O5 | Do not charge a fee to access any type of customer service. Distinguish access fees from fees for actions, which may remain subject to other CRTC determinations. | Paras. 25–27, 44; pp. 6, 9 |
| O6 | Existing privacy and accessibility protections apply; the CRTC encourages accessible mechanisms and not relying exclusively on live support for customers requiring accommodations. | Paras. 30–31, 45; pp. 7, 9 |
| O7 | The requirement applies to all service providers and is administered by the Commission, not incorporated into the Codes or administered by the CCTS. Enforcement starts 26 April 2027. | Paras. 35–39, 43; pp. 8–9 |

## 2. Respondent and Scope

1. What business unit, brand, or legal entity is in scope? Who owns the answers provided?
2. Which telecommunications services and plan types does the organization provide (for example, Internet, cellphone, home phone, or other relevant services)?
3. Which customer populations, account types, and channels are in scope today? How are individual, small-business, and larger-business accounts distinguished?
4. Which provider, reseller, brand, or partner arrangements affect who controls the customer relationship, plan, billing, and service fulfilment?
5. What existing regulatory determinations, contract terms, or internal interpretations affect these services? Who has validated their applicability to this policy?
6. Are any services or customer segments currently excluded from self-service by policy or technical design? What is the basis, owner, and evidence for each exclusion?
7. What is the target date and release approach for compliance readiness before enforcement begins on 26 April 2027?

## 3. Current Business Rules and Processes

### Rule inventory and ownership

1. Where are the authoritative rules for modifying and cancelling plans documented (policy, procedure, product rules, contract terms, scripts, or system configuration)?
2. Who owns, approves, interprets, and changes each rule? How are rule changes communicated to channel, care, billing, and fulfilment teams?
3. Which rules are implemented in code or configuration, and which depend on manual review, staff discretion, or offline procedures?
4. For each rule, what is the source of truth? Do customer-facing channels, CRM, order management, provisioning, and billing use the same rule/version?
5. Can the team demonstrate the rules in the live or test environment and provide a recent change record or test case?

### Change and cancellation scenarios

For each applicable scenario—upgrade, downgrade, adding a service, removing a service, and cancellation—ask:

1. What does the customer request, and what account roles are authorized to submit it?
2. What eligibility, identity-verification, contract, device, bundle, outstanding-order, or account-status rules apply?
3. What choices or consequences are shown before the customer confirms? Are resulting contract changes, charges, effective dates, and any ability to return to prior terms explained?
4. What event is treated as the customer's express consent? How is it captured and associated with the requested action?
5. What conditions trigger clarification, rejection, deferral, or handoff? Is the handoff limited to obtaining information reasonably needed to clarify intent?
6. What business event marks the change or cancellation as effective? How do effective date, provisioning date, billing date, and customer confirmation relate?
7. What exceptions exist (for example, partial fulfilment, failed processing, pending order, or a request that cannot be completed)? What does the customer see and what happens next?
8. Can the customer see the status, amend or withdraw a pending request, or return to prior plan terms? Which rules govern this?
9. Are the current process and rules the same across all brands, service types, and digital channels? Where do they differ and why?

### Fees and customer service

1. What fees are currently associated with contacting customer service through each channel?
2. How are fees for access to customer service distinguished from charges for the requested service action?
3. Where are these distinctions represented in product, channel, billing, and agent processes? Can an access fee be triggered indirectly by selecting a support channel?
4. Which action-related fees are in effect, and which separate CRTC decisions or rules govern them?
5. How are fee changes approved, deployed, tested, and audited?

## 4. Customer Experience and Control Discovery

1. Which customer journeys currently allow self-service for each in-scope change and cancellation scenario? Which journeys require a representative, and at what step?
2. Can a customer complete the action independently from start to finish, or does the digital channel only initiate a request?
3. How does the organization assess whether the mechanism is easy to use? What usability research, completion rates, abandonment data, or complaint themes exist?
4. What information is displayed before consent, and how does the organization verify that it is current, clear, and consistent with contract terms?
5. How are accessibility needs accommodated in the self-service journey? Which existing accessibility standards and privacy controls are applied, and what evidence demonstrates this?
6. How are identity, authorization, privacy, and fraud risks managed without making the journey impracticable for legitimate customers?
7. What happens when the customer lacks digital access, needs an accommodation, or cannot complete the mechanism? Are there other support channels, and are they free to access?
8. What customer feedback, complaints, disputes, or CCTS trends point to existing friction or unintended outcomes?
9. What customer-visible status, receipt, or written confirmation is available today? Does it cover every action taken through self-service?

## 5. Affected Systems and Business Rules

Complete one row per system, major component, or manual process.

| System / process | Business owner / technical owner | Business rules implemented | Customer actions / services supported | Data mastered or processed | Channel / upstream / downstream role | Evidence or system owner to confirm |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

### System discovery questions

1. Which systems implement or influence eligibility, product availability, pricing, contract terms, consent, identity, authorization, order capture, provisioning, billing, notifications, customer support, and complaint handling?
2. Which of these systems are authoritative, and which cache or replicate the rules or customer data?
3. Which components are shared across brands, services, and channels? Are there legacy platforms, vendor services, batch processes, or manual workarounds in the path?
4. Which system is responsible for the customer-visible confirmation and the expected timeframe shown in the journey?
5. Where are request, consent, effective-date, processing-outcome, and confirmation-delivery records stored? Can they be correlated end to end?
6. Which systems can prevent access charges from being applied to customer-service interactions? Where could a fee be misclassified?
7. Which components enforce privacy, security, and accessibility controls? What known constraints or exceptions exist?
8. For each affected system, what changes are configurable versus requiring development, vendor changes, or replacement?
9. What are the operational owner, support model, availability, recovery, release calendar, and delivery lead time for each system?

## 6. Required and Changed Integrations

Complete one row per existing or anticipated interface, event, file exchange, or manual handoff.

| Producer | Consumer | Business event / data exchanged | Current or new | Pattern / frequency | Expected timing | Failure handling / reconciliation | Owner |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

### Integration questions

1. What must flow from the customer channel to account, eligibility, order, provisioning, and billing systems to fulfil each action?
2. Which systems return available plan options, contract consequences, charges, estimated effective dates, and reversibility information to the customer journey?
3. How is consent bound to the exact plan, terms, and action submitted? How are stale offers or terms detected?
4. What acknowledgements and status events flow back to the channel so it can distinguish accepted, pending, completed, failed, and partially completed actions?
5. How are retries, duplicate submissions, timeouts, out-of-order events, and partial failures handled without producing duplicate or contradictory changes?
6. What triggers the written confirmation? Is it sent on receipt, acceptance, completion, or another event? How is the correct outcome reflected?
7. How is the expected confirmation timeframe determined, displayed, and kept aligned with actual delivery performance?
8. Which notification providers and customer contact preferences are used? What happens on delivery failure, invalid contact details, or customer preference conflicts?
9. What identifiers correlate the request, consent, order, service change, billing adjustment, confirmation, and any complaint?
10. Which interfaces carry personal, authentication, payment, or other sensitive information? What authentication, authorization, encryption, and audit controls apply?
11. Are integrations synchronous, event-driven, batch, vendor-managed, or manual? What latency, availability, and volume constraints are material to prompt fulfilment?
12. What monitoring, reconciliation, alerting, and operational ownership exist for each interface?

## 7. Compliance Gap Assessment

Assess each obligation using evidence, not intent. Select one status per row: **Met**, **Partially met**, **Not met**, **Unknown**, or **Not applicable (with approved rationale)**.

| Obligation | Current capability / process | Evidence reviewed | Status | Gap / customer or compliance impact | Required change / decision | Owner | Target date |
|---|---|---|---|---|---|---|---|
| O1 Self-service for all applicable plan changes and cancellations |  |  |  |  |  |  |  |
| O2 Transparent contract consequences and informed, express consent |  |  |  |  |  |  |  |
| O3 Prompt/immediate-effective fulfilment and reasonable clarification |  |  |  |  |  |  |  |
| O4 Written confirmation for every action and timeframe disclosure |  |  |  |  |  |  |  |
| O5 No fee to access customer service |  |  |  |  |  |  |  |
| O6 Existing accessibility and privacy protections applied |  |  |  |  |  |  |  |
| O7 Applicability, direct CRTC administration, and readiness by enforcement date |  |  |  |  |  |  |  |

### Gap probing questions

1. Which customer actions or service types cannot currently be completed through self-service? Are any customer groups systematically routed to a representative?
2. Where does the actual behaviour differ from documented policy, or vary by channel, brand, platform, or product?
3. Can the end-to-end journey be demonstrated with evidence of customer choice, consent, fulfilment, billing outcome, and written confirmation?
4. Are confirmations missing, late, inaccurate, or disconnected from the action’s actual status? How are these cases detected and resolved?
5. Could a customer-service access fee still be triggered in any channel or billing path? Have representative-assisted journeys and fee rules been tested?
6. Are any accessibility or privacy controls absent, unverified, or dependent on informal workarounds?
7. What fraud, security, unintended-change, and account-authorization scenarios have been tested? What residual risks require business acceptance?
8. Which gaps depend on another system, vendor, policy decision, or CRTC clarification? What is the critical path and fallback?
9. What evidence would persuade compliance and legal owners that each obligation is met before the enforcement date?

## 8. Operational Readiness and Validation

1. Who owns each end-to-end capability and each identified gap? Who can approve policy and customer-experience decisions?
2. What training, support procedures, knowledge content, and escalation paths must change?
3. What operational measures will detect problems (for example, completion rate, time to effective change, confirmation delivery, failure, abandonment, and complaints)?
4. How will thresholds and escalation be set, given the policy does not prescribe a universal confirmation deadline or detailed service-level metric?
5. What end-to-end tests will cover upgrades, downgrades, adding/removing services, cancellation, consent, exceptions, fees, accessibility, privacy, and communication failures?
6. How will changes be tested across systems and channels, including reconciliation of order, provisioning, billing, and confirmation outcomes?
7. How will customer complaints relating to self-service be identified, investigated, and answered? What evidence can be supplied to the CRTC, which administers this requirement directly?
8. What release, rollback, incident-management, and customer-remediation plans are needed?
9. What decisions or risks remain unresolved, who owns them, and by when must they be resolved?

## 9. Workshop Outputs

At the end of discovery, compile:

- Confirmed applicability and in-scope services, brands, account types, and customer journeys.
- A rule inventory showing the rule, owner, source of truth, implementation location, and evidence.
- An affected-system catalogue with business and technical owners.
- An integration inventory, including new or changed flows, timing, failure handling, and security considerations.
- An obligation-by-obligation gap register with evidence, customer impact, remediation, owner, dependencies, and target date.
- Explicit assumptions, decisions, risks, and open questions for legal, regulatory, business, and architecture follow-up.
- A readiness plan leading to 26 April 2027 enforcement, validated against actual delivery and release constraints.
