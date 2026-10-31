# Adversarial Review of Architecture Spine

## Verdict

Rejected as implementation-safe architecture. The document is directionally sound, but it does not define enough enforceable semantics to prevent independent teams from implementing components that all satisfy the stated ADs while still diverging on the same customer request, state outcome, notification, or fallback path. In other words, the ADs say what each component must not do, but not enough about what the shared contracts, authoritative ownership, outcome state machine, and failure semantics are.

## Executive summary

This spine is a useful governance statement, but it is not a sufficient integration contract. The architecture says:

- decisions are centralized,
- domain systems own records,
- orchestrator owns request lifecycle,
- rules are separate from execution,
- events drive async fulfilment,
- confirmation and audit evidence are required.

Yet it never resolves the exact contract boundaries between those responsibilities. Two independent implementations can obey the prose while disagreeing on whether a customer is "accepted," "completed," or "failed"; whether a plan change is a single command or a set of delegated operations; whether a prior decision may be reused during an outage; and whether a service can infer the same business meaning from different IDs, timestamps, or event payloads.

This is particularly dangerous for regulated, customer-impacting changes because the system will look compliant on paper while still producing incompatible state, contradictory audit traces, and different communication outcomes across channels.

## Top findings

1. The spine lacks a canonical shared-data contract for plan-change intent, consent, and lifecycle state. Different implementations can use different IDs, versions, and payload shapes while remaining "compliant" with AD-2 and AD-6.
2. The rule boundary is under-specified: the document says domain systems may enforce local technical invariants, but does not define an enforceable rule taxonomy or authoritative ownership boundary to prevent local business policy leakage.
3. Idempotency, command semantics, and event-state semantics are not sufficiently strong. The system can still produce duplicate actions, contradictory final states, or repeated confirmation messages despite the ADs.
4. Confirmation semantics are under-defined. The document requires written confirmation but does not require a state machine for receipt, acceptance, completion, and failure, so different components can each claim compliance while communicating different meanings.
5. Failure fallback semantics are not operationally safe. "Temporary unavailable" and "last known good" are not defined as forbidden or permitted states, leaving room for stale decisions or silent permissive fallbacks.

## Detailed adversarial pairs that can both satisfy every AD and still diverge

### Pair 1: Shared-data shapes and canonical identity

- Component A (Product Domain): the authoritative product catalogue stores a plan as `planId`, `productCode`, `priceTier`, `contractVersion`, and `effectiveDate`.
- Component B (Billing/Order System): the authoritative order domain identifies the same plan as `offerId`, `bundleId`, `ratePlanId`, `termVersion`, and `serviceClass`.

Both can obey AD-2 because each domain remains authoritative for the records it owns. Both can obey AD-6 because they exchange versioned APIs and event schema versions. But they can still diverge on the meaning of the same request:

- One system interprets the change as a simple plan replacement.
- The other interprets it as a service bundle mutation with package-level consequences.
- The orchestrator may store the same `requestId` but different `offerId`s, `termId`s, or effective dates for the same customer intent.

This creates an invariant gap: there is no canonical shared data model for the plan-change intent, contract terms, and consent references. The document says to carry `requestId`, `correlationId`, customer/account reference, schema version, and timestamp, but not the authoritative canonical identifiers for the same business object across domains.

Required fix:

- Define one canonical shared object for all plan-change intents, such as `PlanChangeRequest`, with immutable IDs: `requestId`, `customerAccountId`, `fromPlanVersionId`, `toPlanVersionId`, `contractTermVersionId`, `consentRecordId`, `decisionRef`, and `effectiveDate`.
- Require each domain API to map to that canonical object via an explicit translation layer, not by ad hoc matching on business names.
- Prohibit divergent interpretation of a customer's requested action unless the request is re-validated against the current authoritative product/contract version.

### Pair 2: Decision ownership and rule boundary

- Component A (Rules Service): evaluates the policy decision and returns `eligible`, `reasonCodes`, `requiredDisclosures`, and `ruleSetVersion`; it owns the shared business decision.
- Component B (Domain Order Service): includes local business logic such as "downgrade allowed only if an order is not pending" or "special plan-change exclusions are permitted by local team policy," and treats these as internal validation rather than shared policy.

Both can technically satisfy AD-1 and AD-2 because the domain service is not mutating customer/account state but is enforcing local technical or operational constraints. However, the document never defines a hard boundary between:

- authoritative shared rules,
- local domain validation,
- operational guidance,
- customer-specific exception handling.

This means one implementation can reject a request because of a local legacy rule, while another allows it because the central Rules Service passed it. Both are still "correct" under the current prose.

This is an enforceable invariant gap: the architecture allows business policy to leak into domain systems as long as it is framed as "system-specific validation." It must not.

Required fix:

- Add a rule taxonomy and ownership matrix:
  - Shared policy: owned by Rules Service only; no domain override.
  - Local technical validation: owned by the domain service; cannot affect eligibility, fee classification, consent requirements, or disclosure content.
  - Operational exceptions: owned by Orchestrator or support workflows; not silently embedded into entitlement logic.
- Require every domain service to publish and enforce a "non-policy validation" list and forbid any rule that changes eligibility, fee classification, consent obligations, or required disclosures without a rules-service decision update.

### Pair 3: Command mutation semantics and idempotency ownership

- Component A: the Order service treats `submitPlanChange(requestId, idempotencyKey)` as "create order if not exists; if exists, return prior order record."
- Component B: the Order service treats the same command as "upsert the current pending order for this account/service and overwrite any previous request for the same account when the request is still in-flight."

Both can claim compliance with AD-3 because each attaches a unique request/correlation ID and idempotency key and each is still an idempotent command from a local perspective.

The divergence is real:

- A prevents duplicate business actions by creating one order object per request ID.
- B treats the request as a mutable state update to a single in-flight order, which can overwrite the history of earlier distinct requests.

This creates a potential contradiction with AD-2 and AD-6: if the orchestrator treats request history as authoritative while the domain service reuses a single mutable order, the same customer action may appear as one order in one system and multiple orders in another.

Required fix:

- Define a strict command contract: each `requestId` maps to exactly one lifecycle record, and each business action has a unique `businessActionId` distinct from the request ID.
- Require a single authoritative domain mutation rule: the system must either create a new order object or mutate an existing one, but it must not do both for the same `requestId` under different implementations.
- Define the command semantics as: "create exactly once if not exists; subsequent duplicate delivery returns the same result; any later state mutation must be tied to a distinct action ID and versioned contract details."

### Pair 4: Event semantics and lifecycle state interpretation

- Component A: `PlanChangeAccepted` is a terminal state that means the change has been accepted by the system and will complete without additional domain events.
- Component B: `PlanChangeAccepted` is merely a transitional state indicating "queued for fulfilment," with the real final state issued later via `BillingApplied` or `ProvisioningComplete`.

Both can satisfy AD-3 and AD-6 because both use asynchronous status events and a status distinction between received, pending, completed, and failed. The divergence is operationally significant:

- One channel shows the customer a completed action as soon as the order is accepted.
- Another channel keeps the customer in pending state until billing and provisioning finish.
- Support and compliance teams may see the same event as final evidence in one system and as provisional evidence in another.

This is a direct conflict between the architecture's stated desire for consistent customer-visible state and the absence of a mandatory event-state model.

Required fix:

- Define an authoritative state machine with enumerated states and event semantics, for example:
  - `received`
  - `accepted`
  - `in_flight`
  - `completed`
  - `failed`
  - `compensated`
  - `requires_customer_action`
- Event payloads must carry a state transition and a `previousState`, `nextState`, `effectiveAt`, and `sourceSystem`.
- Require that terminal states be explicit and mutually exclusive; no event may claim `completed` when the domain is still in `in_flight` or `requires_customer_action`.
- State transitions must be deduplicated and ordered by `(requestId, eventTime, sequenceNumber)`.

### Pair 5: Confirmation semantics and evidence ownership

- Component A (Notification Service): sends one email or message at submission time and calls it the confirmation. It includes text that says "Your request was accepted and is being processed."
- Component B (Notification Service): sends a confirmation only after the domain system has changed the contract, and labels it as completion. The orchestrator later sends a separate status update only if the change is asynchronous.

Both can claim compliance with AD-4 because the document requires written confirmation, expected timeframe disclosure, and eventual completion/failure communication when known. However, they are not semantically equivalent:

- Customer A receives a receipt, not a completion notification.
- Customer B receives no evidence until the action is complete.
- Support/compliance cannot reconstruct whether the initial action was accepted, rejected, or still pending.

This creates an enforceable invariant gap: the architecture says to retain the "decision, displayed disclosures, consent, command, outcome, and confirmation status" but does not specify a required confirmation state machine or message semantics.

Required fix:

- Define two distinct confirmation classes and require both when actions are async:
  - `receipt_confirmation`: confirms request was received and consent was captured; may be sent immediately.
  - `outcome_confirmation`: confirms the contract or service status reached `completed` or `failed`; must be sent after the final known outcome.
- Require the confirmation record to include `requestId`, `consentRef`, `decisionRef`, `stateAtConfirmation`, `expectedUpdateTime`, and `channel`.
- Prohibit reusing the same confirmation record for both receipt and outcome unless the status clearly identifies the state and the event payload is versioned.

### Pair 6: Failure fallback semantics and stale decision reuse

- Component A: on Rules Service timeout, the orchestrator reuses the last successful decision within the previous 30 minutes for the same account and action and marks the request as "pending revalidation."
- Component B: on timeout, the orchestrator fails closed and returns a temporary unavailable status, refusing to proceed with a plan change or cancellation.

Both can claim they are respecting AD-1, AD-6, and AD-7 because both:

- route the decision through the Rules Service when available,
- preserve request lifecycle status,
- provide an operational queue for retry and reconciliation,
- avoid silent mutation of customer state.

Yet they produce different business outcomes. One is permissive and stale; the other is conservative and blocking. The architecture documents "do not silently fall back to stale or permissive local policy when the service is unavailable" but never prohibits a stale decision from the Rules Service itself, nor defines whether a stale decision is a permitted operational state for write-generating actions.

This is an explicit invariant gap and likely contradiction: the document says fail safely without stale policy, but there is no rule that a stale rule decision is invalid. The result is likely implementation divergence across teams.

Required fix:

- Define the failure contract:
  - `decisionUnavailable`: no write may proceed; status is returned to customer; retries continue.
  - `decisionStale`: only read-only or non-customer-impacting decisions may use a stale result if the TTL, source version, and explicit risk statement are persisted; no plan-change or cancellation may proceed based on a stale decision.
  - `decisionDenied`: rules service returned a final immutably declined outcome.
- Require a persisted `decisionValidity` field and an `allowWrite=false` rule for any action that changes contract or charges.
- Prohibit any silent fallback path; the orchestrator must expose the reason and the state in the customer-visible status record.

## Enforceable invariant gaps and contradictions

### Gap 1: Shared data shape and domain identity are not canonical

Contradiction: AD-2 says each domain system remains authoritative, yet AD-6 says all messages should include request and correlation identifiers, but it never defines the canonical business object identity across systems. The same customer change can be represented by different IDs and still be treated as the same action by each team.

Fix: define a canonical contract model and an explicit translation layer. Require all domains to validate against the same `requestId`, `decisionRef`, and `planChangeIntentId` semantics.

### Gap 2: Rule ownership is not enforced

Contradiction: AD-1 says all shared decisions must be centralized in the Rules Service, while AD-2 says domain systems own the authoritative records they manage. The document does not prevent a domain system from codifying a local policy that changes eligibility, contract disclosures or fee treatment under the banner of validation.

Fix: make rule ownership explicit and testable: shared-policy rules are only in Rules Service; domain validations may not change eligibility or disclosures.

### Gap 3: State lifecycle is not a machine

Contradiction: AD-3 says the orchestrator must distinguish received, pending, completed, and failed states, while AD-4 mandates confirmation and eventual outcome communication. But the same event may be treated as "accepted" by one system and "completed" by another, because the state model is prose, not a machine-checkable finite state machine.

Fix: adopt a formal state machine with explicit transitions, event names, terminal states, and contractually required `previousState` and `nextState` fields.

### Gap 4: Event semantics allow replay and duplicate ambiguity

Contradiction: AD-6 says retries are safe and duplicate commands must not create duplicate business actions, while also requiring asynchronous event-based fulfilment and operational queues. It does not say whether events are authoritative, derived, or replayable, nor whether duplicates are idempotent events or duplicate business actions.

Fix: require each event to carry a unique `eventId`, `requestId`, and `sourceSequenceNumber`; define exactly-once processing and deduplication semantics for brokers, replay queues, and domain actions.

### Gap 5: Confirmation semantics are not typed

Contradiction: AD-4 says written confirmation is required for every action and completion/failure must be communicated when known. It does not define whether the initial confirmation is receipt, acceptance, completion, or outcome evidence. Different teams can therefore call different messages compliant.

Fix: require typed confirmation semantics and a compliance evidence record with the exact status at the time of each confirmation.

### Gap 6: Failure fallback is under-specified and therefore unsafe

Contradiction: AD-7 says do not silently fall back to stale or permissive local policy, but the document does not define the permitted safe fallback states and does not prohibit stale rule decisions inside the Rules Service or orchestrator under a timeout path. Different teams can implement different fail-safe semantics while all saying they are complying with the ADs.

Fix: require explicit failure-state and fallback contracts; prohibit stale or local fallback for write actions; permit only explicit, logged, customer-visible `decisionUnavailable` or `revalidationPending` states.

## Required precise fixes to the spine

1. Add a canonical shared contract specification for the request lifecycle, consent reference, decision reference, and plan/version identifiers.
2. Add a rule ownership matrix that prohibits local policy overrides for eligibility, fee classification, disclosure, or contract consequences.
3. Replace prose state descriptions with a formal state machine and event taxonomy for request lifecycle and fulfilment.
4. Mandate idempotent command semantics and exact-once event handling with unique request and event identifiers.
5. Require typed confirmation records and message semantics for receipt vs outcome evidence.
6. Define explicit failure behaviors for rules outage, stale decisions, and delayed fulfilment, including customer-visible statuses and no silent fallback for state-changing actions.
7. Add explicit compliance evidence requirements: what evidence is retained per request, who owns it, and how it is reconstructed during complaint handling.

## Conclusion

The architecture spine is not yet rigorous enough to serve as a cross-team implementation contract. It correctly names the responsibilities of decisioning, orchestration, and domain ownership, but it leaves the actual semantics of shared data, state transitions, event meaning, confirmation types, and failure fallback open to interpretation. Until these are fixed as enforceable invariants, different components can all satisfy the ADs and still diverge in ways that materially affect customer outcomes, auditability, and regulatory defensibility.
