# Reality Check Review: Architecture Spine — CRTC 2026-78 Self-Service Plan Management

Date: 2026-10-30
Scope reviewed: ARCHITECTURE-SPINE.md

## Verdict
The architecture spine is directionally strong and internally consistent, but it is not yet a reality-checked implementation blueprint. It reads as a defensible target-state logical pattern for a Canadian telecom provider operating under CRTC 2026-78, yet several design commitments are still assumptions rather than verified facts. The document is unusually candid about this: it states the target is logical, no cloud/vendor/platform is selected, and critical application inventories and rule ownership are still unknown. That honesty is positive; however, the architecture should be treated as a policy-first design scaffold, not as a validated enterprise architecture.

Overall assessment: conditionally acceptable as an early architecture direction, but not ready to be treated as a committed implementation baseline without current verification of actual provider systems, rule ownership, hosting standards, legal interpretation, and platform choices.

## Supplied facts versus unsupported assumptions

### Supplied facts in the document
The following are either directly stated or grounded in the provided source context and should be treated as evidence-backed inputs:
- The architecture concerns a Canadian telecom provider.
- The problem domain is self-service plan upgrades, downgrades, additions/removals, and cancellations.
- The regulatory context is CRTC 2026-78 and the policy applies to individual and small-business customers.
- The business rules are described as distributed across applications today.
- Regulatory enforcement begins 26 April 2027.
- The design emphasizes informed consent, written confirmation, and evidence retention for complaints and compliance.
- The architecture explicitly says the target is logical and no vendor/cloud/platform is selected.

### Unsupported assumptions or unverified design premises
The following are not yet proven by the architecture artifact itself and require confirmation against current enterprise reality:
- That the provider already has the necessary customer, contract, order, provisioning, billing, support, and audit systems and that they can be integrated or adapted.
- That the rule duplication problem is real and can be centralized without major legacy constraints.
- That domain systems are cleanly separated by ownership boundaries and do not already share data or write paths.
- That a single central rules decision service will be accepted operationally across all channel and domain teams without resistance or migration complexity.
- That access-fee and action-charge interpretations under CRTC rules are known and settled for this provider.
- That the provider’s hosting environment, security model, retention schedule, identity platform, and operating model are already approved and compatible with the recommended architecture.
- That customer journey and channel scope, including accessible alternatives, are fully defined for launch.

## Decision-by-decision reality check

### AD-1 — Centralize shared self-service business decisions
Reality check: materially sound as a design principle, but still needs proof of current rule dispersion and ownership.
Why it is credible: The document identifies a real architectural anti-pattern: rules duplicated across applications. Centralizing shared decision logic is a standard remedy when multiple channels and business units enforce different policies.
What is missing: There is no actual inventory of duplicated rules, no owner map, and no evidence of which rules are truly shared versus local. A decision service is not “safe by default”; it must be built from a verified inventory and governance model.
Verdict: partially supported and directionally correct; requires current rule inventory and business-owner signoff.

### AD-2 — Domain systems own authoritative business records
Reality check: broadly valid for enterprise architecture, but not yet validated against the provider’s actual application topology.
Why it is credible: The separation of ownership between orchestration and authoritative domain records is a strong design control to prevent conflicting writes.
What is missing: The document does not enumerate actual systems, schemas, or data ownership lines. There may be shared customer master data, contract tables, or legacy integration patterns that violate the clean ownership model.
Verdict: plausible but unverified until the application inventory and transactional boundaries are mapped.

### AD-3 — Orchestrate stateful journeys; separate decision from execution
Reality check: sound architecture pattern and consistent with regulated customer journeys.
Why it is credible: The distinction between decisioning and execution prevents duplicate or premature state changes; idempotency and correlation are standard for transaction-safe customer operations.
What is missing: The document does not confirm the provider’s existing orchestration or workflow tooling, failure-handling model, or integration latency characteristics. The architectural approach is valid, but the selected runtime pattern remains unverified.
Verdict: supported at the conceptual level; implementation details still need platform and integration evidence.

### AD-4 — Preserve customer choice, consent, and outcome evidence
Reality check: strongly aligned to the regulatory problem and the stated objective of compliance and complaint readiness.
Why it is credible: The requirement for express consent, contract transparency, and evidence retention is a direct policy concern and is central to a telecom self-service change capability.
What is missing: The document does not supply the actual confirmation content that the provider will present, the expected timeframe for notification, nor the exact evidence retention schedule. These are regulatory and operational decisions, not just architecture choices.
Verdict: well supported by policy intent, but not fully specified.

### AD-5 — Apply customer-service fee and accommodation controls consistently
Reality check: important but highly dependent on legal interpretation and billing rules.
Why it is credible: The document correctly distinguishes a no-fee access rule from service-change charges and makes a policy-based design decision that the fee logic must be separate from the transaction itself.
What is missing: The architecture does not identify which specific charges are still allowed or forbidden under the relevant CRTC determinations, nor does it validate the provider’s billing logic and cross-channel fee configuration model.
Verdict: directionally correct but legally and operationally contingent; not a validated design decision yet.

### AD-6 — Integrate through governed APIs and business events
Reality check: credible as a general integration architecture. However, it is still a generic pattern rather than an evidence-backed provider design.
Why it is credible: Event-driven status, idempotent commands, correlation IDs, and safe retries are standard controls for order and billing processes.
What is missing: The document does not identify actual message brokers, integration middleware, APIs, schemas, event contracts, or governance mechanisms. It also does not confirm whether the provider’s enterprise standards support this style across systems.
Verdict: realistic and common, but not yet reality-checked against the real integration estate.

### AD-7 — Operate the service as a regulated, recoverable capability
Reality check: well-motivated, but operational targets and controls are still placeholders.
Why it is credible: Any regulated telecom process requires retry, alerting, evidence, and recoverability. The architecture correctly treats compliance and operations as first-class concerns.
What is missing: The document leaves recovery objectives, hosting topology, retention schedules, and security controls to “approved standards.” This is acceptable at the spine level, but it means the design is not yet anchored to current provider operational policy or delivery standards.
Verdict: policy-compatible and reasonable, but not yet operationally validated.

## Application architecture reality check
The application map is logical and useful. It contains a clear separation between experience channels, orchestrator, rules service, domain systems, and compliance/audit functions. This is a healthy target-state pattern. However:
- The architecture does not prove that the provider’s real channel portfolio and domain applications align to this model.
- The document does not show whether channels already exist, whether they are accessible, or whether a central API gateway is even feasible in the provider’s current platform standards.
- The listed interaction with notification and compliance functions is plausible, but the real integration dependencies remain unverified.

## Integration architecture reality check
The “start -> evaluate -> present and consent -> revalidate and submit -> fulfil and reconcile -> confirm and support” flow is coherent and arguably best-practice. It demonstrates disciplined state handling and a customer-centred flow.
But it is still a generic transactional pattern. It does not yet prove:
- which systems are authoritative for price, catalog, contract, and billing facts,
- how the provider handles asynchronous order backends and provisioning delays,
- whether an event broker or messaging platform already exists and is approved,
- how the provider handles duplicate events and dead-letter workflows in its current integration stack.

## Deployment and operations reality check
The deployment section correctly refrains from choosing a vendor or cloud. That is a good sign, but it also means the stated design cannot be validated against actual hosting or failover constraints. The design is intentionally abstract, which is appropriate for a spine, but it leaves several critical operational questions unresolved:
- Where are production and disaster-recovery environments hosted?
- Which standards govern backup, retention, identity, and security?
- What are the actual recovery time and recovery point objectives?
- Which teams own operations, support, and compliance reporting?

## Named libraries, frameworks, vendors, and platform versions requiring verification
This architecture spine explicitly avoids naming any concrete frameworks, libraries, vendors, or platform versions. That is consistent with the stated “logical architecture” scope, but it also means there are no hard verification anchors yet. Current verification is required for any eventual platform choices in the following categories:

| Category | Example items that would require verification | Why it matters |
|---|---|---|
| Cloud / hosting | Azure, AWS, GCP, private cloud, on-prem, hybrid | Affects failover, security, DR, network topology |
| API management | API gateway, identity gateway, service mesh | Affects policy enforcement and channel integration |
| Integration / messaging | Kafka, MQ, event bus, stream platform | Affects event delivery, retries, dead-letter handling |
| Rules engine / decision platform | DROOLS, IBM Operational Decision Manager, custom rules service, decision engine | Affects policy governance and performance |
| Data / persistence | Oracle, SQL Server, PostgreSQL, NoSQL, mainframe, CRM database | Affects contract and billing state ownership |
| Identity / access | Okta, Ping, Entra ID, legacy IAM | Affects customer authorization and admin controls |
| CRM / support | Salesforce, ServiceNow, legacy telecom CRM | Affects complaints and case evidence |
| Billing / order | SAP, Oracle BRM, custom billing platform | Affects service-change execution and charge logic |
| Notification / document | email platform, SMS gateway, document generation stack | Affects written confirmation requirements |
| Monitoring / observability | Splunk, Dynatrace, AppDynamics, ELK, OpenTelemetry | Affects decision latency, backlog, and audit evidence |
| CI/CD / release | GitHub Actions, Azure DevOps, Jenkins, GitLab | Affects rule and API promotion governance |

Important note: the report is not saying these products are required. It is saying that, if selected or already present, their current versions, support status, and operational fit must be verified before the architecture can be treated as implementation-ready.

## Distinction between supplied facts and assumptions
The architecture document does a good job of separating fact from design choice in a few places. The strongest supplied facts are:
- The regulatory and customer context.
- The existence of a rule-duplication problem across applications.
- The need for decision centralization and evidence retention.
- The logical, not physical, nature of the design.

The strongest assumptions are:
- The provider can integrate to system-of-record applications without rework.
- Domain ownership is clean and stable.
- Rule governance can be centralized without wider operating-model disruption.
- The provider’s hosting environment and standards are already compatible.
- The actual action-fee interpretation and confirmation policy are settled.

The architecture is honest that these are open questions, but the honest admission of unknowns does not eliminate the need for current validation. It merely makes the architecture valid as a transition artifact, not as a final source of truth.

## Top findings
1. The architecture is conceptually sound for a regulated telecom self-service capability, but it remains a logical target-state design rather than a validated enterprise architecture.
2. The central rules service recommendation is strong, but it is not yet evidence-backed unless the provider documents the current duplication, ownership, and risk of conflicting rules across applications.
3. Consent, confirmation, and evidence requirements are clearly policy-aligned, but the exact customer-facing messaging and retention model are still undefined and need legal/compliance confirmation.
4. No actual vendor, platform, cloud, or framework choices are named; that is acceptable at this stage, but it means the architecture cannot be reality-checked against the real technology estate until those decisions are verified.
5. The architecture’s biggest gaps are not in logic—they are in enterprise verification: application inventory, rule ownership, hosting standards, legacy integration boundaries, and billing/legal interpretation.

## Conclusion
This document should be accepted as a disciplined architecture spine for planning and governance, but not as a committed implementation baseline. It is a good policy-driven architecture artifact for the problem statement, yet it still depends on unresolved enterprise facts. The practical next step is to validate the actual application inventory, authoritative data ownership, legacy integration patterns, rule catalog, and provider-approved hosting/security standards before turning this architecture into a build-ready solution.
