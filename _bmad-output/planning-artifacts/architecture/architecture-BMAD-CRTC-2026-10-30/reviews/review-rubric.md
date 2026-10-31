# Architecture Spine Review Rubric

## Verdict
Needs revision before approval.

## Summary
This architecture spine is directionally strong and is close to a usable target-state model for regulated self-service plan changes. It clearly sets a policy-centric, decision-separate-from-execution pattern and covers the principal business, application, integration, and operational themes. However, it does not yet meet the good-spine standard because the document is not sufficiently grounded in source clauses, lacks explicit ownership and decision rights, and leaves the operational envelope and divergence-elimination plan under-specified. As written, it reads more like a persuasive design brief than a durable, enforceable architecture decision set capable of governing a regulated program.

## Findings

### 1) Source grounding is too weak for a regulated architecture spine

The document includes a source list but does not tie each governing decision, capability, or requirement back to precise regulatory text. The only explicit clause-level grounding is a brief note in the business capability section citing CRTC 2026-78 paragraphs 17 and 35–39, 43–45. That is not enough for a spine intended to govern customer-facing self-service decisions, fee treatment, consent, confirmation, and compliance evidence.

Why this matters:
- A regulated architecture spine must demonstrate that the design is anchored to the actual legal obligations rather than to a policy summary.
- Without clause-level traceability, reviewers cannot tell which provisions drive AD-1 through AD-7, or which interpretations are policy decisions versus legal conclusions.
- The current document risks treating business interpretation as if it were source truth.

Recommended fix:
- Add a "Source Traceability" table mapping every AD and each major section to the exact regulatory reference, the specific obligation, and the interpretation used in the design.
- Example structure:
  - AD-1: source clause(s), obligation, design interpretation, owning reviewer, open legal question.
  - AD-4: consent and written confirmation requirements.
  - AD-5: fee treatment and accessibility obligations.
  - AD-7: evidence retention, operational monitoring, and auditability.
- Include a short section that states which items are direct legal requirements, which are design decisions to satisfy them, and which are still pending legal/regulatory confirmation.

### 2) Ownership and decision rights are underspecified; the spine does not yet define accountable actors

The architecture identifies roles such as the Central Rules Service, the Self-Service Plan Orchestrator, and domain applications, but it does not assign clear accountable owners or decision-right boundaries. The document references "business owner approval" in the Rules service section, but there is no operating model showing who owns the rules, who owns the data, who is accountable for consent evidence, and who resolves conflicting decisions.

Why this matters:
- A durable spine requires consistent ownership at the policy, process, and platform layers.
- Without explicit ownership, the architecture is vulnerable to rule drift, duplicate decisions, and unresolved authority when service or compliance issues arise.
- The current recommendation is directionally correct but not yet enforceable: it lacks an accountable control model for who can approve, change, and retire policy rules.

Recommended fix:
- Add an ownership matrix or RACI covering every major capability and invariant, for example:
  - Policy owner: approves eligibility and fee rules.
  - Domain owner: owns customer/account, product/contract, order, provisioning, billing records.
  - Orchestrator owner: owns request lifecycle, consent correlation, idempotency, status, and remediation path.
  - Compliance owner: defines evidence retention, auditability, and complaint support.
  - Channel owner: owns customer experience and accessibility obligations.
- Add decision rights for rule conflicts: who decides if a domain system disagrees with a rules decision; what escalation path applies; and how policy exceptions are recorded, expired, and reviewed.
- State explicitly which decisions are central and which are local, and enforce the separation via AD-1 and AD-2 as a control discipline rather than a design preference.

### 3) The operational envelope is not explicit enough to be enforceable as an architecture decision set

The deployment and operations section is useful but generic. It lists categories of monitoring and operational ownership, but it does not define measurable service boundaries, required response targets, or the governing non-functional envelope. The document omits concrete mission-critical requirements such as rule-decision latency, queue backlog thresholds, retry/failure handling thresholds, x-hours for confirmation delivery, and evidence retention windows.

Why this matters:
- Operational regressions are one of the main reasons regulated services fail in practice.
- The current document says to monitor "decision latency/errors" and "fulfilment failures," but does not say what acceptable thresholds are, who owns them, or what triggers a control action.
- It is therefore difficult to test or enforce the architecture in implementation or governance.

Recommended fix:
- Add an "Operational Envelope" subsection with concrete service-level guardrails, such as:
  - decision latency p95/p99 thresholds,
  - maximum request age before exception handling,
  - event backlog alert thresholds,
  - confirmation delivery SLA and retry policy,
  - evidence retention and tamper-evidence requirement,
  - disaster recovery and replay/reconciliation objectives,
  - remediation owner and escalation path.
- Add explicit operational controls for duplicate command handling, dead-letter processing, unavailability of rules decisions, and known failure modes.
- Tie these controls back to the ADs so every operational requirement has a governing architectural reason.

### 4) The spine does not explicitly document the durable divergences it is intended to remove

The document presents a strong target state, but it does not state clearly the current-state divergences the architecture is designed to eliminate. It names the problem broadly but not concretely: channel-specific policy logic, divergent rule implementations, inconsistent consent evidence, and inconsistent contract disclosure. These are exactly the classes of divergence a good spine should call out explicitly and then manage through a defined migration path.

Why this matters:
- Durable divergences are the architectural "problem statement" the spine is meant to resolve.
- Without a concrete divergence inventory, the design can move in directions that preserve existing inconsistencies under a different label.
- The result is an architecture that describes intent without providing a disciplined path away from current-state behavior.

Recommended fix:
- Add a "Durable Divergences to Eliminate" table with columns: current issue, target-state pattern, owning system, policy owner, migration step, and removal date/trigger.
- Examples to include:
  - channel-specific eligibility and fee rules,
  - non-standard consent capture and evidence records,
  - direct rule logic duplicated across channel/order/billing systems,
  - inconsistent confirmation content and timing,
  - non-common handling of asynchronous completion/failure states.
- Pair this with the existing migration guidance so the architecture makes a clear distinction between temporary parallel operation and permanent divergence.

## Assessment against the checklist

- Durable divergences: Partial. The document identifies broad issues but not the explicit divergence inventory needed to govern change.
- Enforceable ADs: Partial. The ADs are strong in principle but not yet fully measurable or tied to ownership and operational thresholds.
- Consistent ownership: Weak. The spine names responsibilities but not accountable roles, decision rights, or escalation paths.
- Coverage of business/application/integration/operational envelope: Good at a high level; operations are under-specified for the final architecture spine stage.
- Source grounding: Weak. Source list is present, but there is no clause-level traceability.
- Scope and deferred items: Good. Scope and deferred items are stated, but the deferred items should be explicitly linked to the architecture review gate that unblocks them.

## Conclusion
The spine should be treated as a strong draft, not yet a release-quality architecture decision set. It is sufficiently advanced to guide the next design phase, but it requires source-level traceability, explicit ownership/accountability, operational guardrails, and a concrete divergence inventory before it can reliably govern implementation decisions under CRTC 2026-78.
