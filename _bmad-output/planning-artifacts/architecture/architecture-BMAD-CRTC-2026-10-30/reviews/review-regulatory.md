# Regulatory Review: ARCHITECTURE-SPINE.md against CRTC Regulatory Policy 2026-78

## Verdict
Conditionally aligned, but not yet regulatory-ready as written.

The architecture spine shows the correct high-level intent for self-service plan management: centralized rules, consent evidence, written confirmation, and separation of decision from execution. It also correctly reflects the policy scope: all providers, direct CRTC administration, and the 26 April 2027 enforcement date.

However, the design still under-specifies several mandatory obligations and risks overstating compliance. It is a strong conceptual architecture, but not yet a complete implementation standard for CRTC 2026-78.

## Top findings

1. Clarification boundaries are not defined.
The policy allows a live representative only when clarification is reasonably needed. The architecture explains the orchestrator and consent flow, but it does not define an explicit decision rule for when a customer intent is ambiguous enough to require assistance. Without that rule, a provider can drift into unnecessary live-service routing while claiming a self-service design.

2. Immediate effect is treated as a vague design goal, not a control.
The policy expects plan actions to take effect immediately to the greatest extent possible. The architecture allows asynchronous accepted or pending states without stating that near-real-time execution is the default and that deferral is an exception requiring a documented reason. That invites queue-based delay under the banner of eventual completion.

3. Consent and contract-change disclosures are too generic.
The architecture captures informed consent and contract-change awareness in principle, but it does not require a standard disclosure checklist for each action type. The exact final terms, pricing, and return-to-existing-terms conditions are not specified in a way that makes compliance enforceable in production.

4. Written confirmations need a stricter evidence model.
The design mentions written confirmation and status updates, but does not require a single auditable confirmation record for every self-service action, with the chosen terms version, action result, and expected confirmation timeframe. Without that, one generic email or portal status may not meet the policy requirement.

5. Fee governance is too abstract.
The architecture states that customer-service access must not incur a fee, but it does not define channel-level logic to ensure access fees are never charged through support, billing, or portal flows. The distinction between access fees and action-related fees is stated, but the enforcement design is not yet built into the service boundary.

6. Accessibility and privacy obligations are treated as principles, not acceptance criteria.
The policy continues to require existing accessibility and privacy protections. The architecture names them, but leaves them as broad design principles rather than concrete tests, accommodation flows, consent-notice rules, or retention controls. That is insufficient for a defensible compliance model.

7. Compliance readiness is underdeveloped for direct CRTC oversight.
The architecture names regulatory compliance and complaint readiness, but it does not define the evidence pack, regulator-facing records, or complaint-response process needed for direct CRTC administration. The enforcement date is noted correctly, but the operational readiness model is incomplete.

8. The design is directionally correct but not yet a universal compliance standard.
The policy applies to all providers. The architecture is provider-neutral at a logical level, but it does not translate that into a universal implementation rule set. Provider-specific constraints remain a real risk unless each implementation maps the architecture to local obligations and evidence controls.

## Assessment against the listed obligations

- Easy self-service for changes and cancellation without live rep unless clarification is reasonably needed: conceptually aligned, but under-specified in service rules.
- Immediate effect to the greatest extent possible: partially addressed, but not controlled as an operational default.
- Informed and express consent, plus resulting contract changes and return to existing terms: conceptually present, but too generic to enforce.
- Written confirmation for every action and timeframe: partially aligned, but lacking a strict evidence model.
- No customer-service access fees: aligned in principle, but not yet expressed as a channel-level control.
- Accessibility and privacy qualifications: aligned in intent, but not yet validated as requirements.
- All providers: structurally acknowledged, but not converted into implementation-level rules.
- CRTC direct administration and enforcement date: correctly listed, but operational readiness remains incomplete.

## Conclusion
The architecture spine is directionally aligned with CRTC 2026-78, but it is not yet a complete or defensible compliance artifact. The main gaps are the absence of operational clarification rules, a stronger near-immediate execution default, stricter consent and contract-disclosure controls, explicit fee enforcement at the customer-service boundary, and concrete accessibility, privacy, and regulator-evidence requirements.

This should be treated as a policy-aligned foundation, not as full compliance sign-off. It needs provider-specific workflow rules, journey acceptance criteria, evidence retention controls, and legal review before being used as a compliance standard.
