# Business Capabilities for Compliance

## Telecom Regulatory Policy CRTC 2026-78 — “Enhancing self-service mechanisms”

**Basis:** This capability view translates the requirements in [Telecom Regulatory Policy CRTC 2026-78](../../source/telecom%20regulatory%20policy%20CRTC%202026-78.pdf) and the [Regulatory Impact Assessment](./Regulatory-Impact-Assessment-CRTC-2026-78.md) into business capabilities. Capabilities describe what the organization needs to be able to do; they do not prescribe a particular product or architecture.

**Systems note:** Expected systems are likely enablers inferred from the business need, not named or mandated technologies in the policy. Providers may implement capabilities through existing platforms, new platforms, or manual processes where appropriate.

## Capability Catalogue

### 1. Customer Self-Service for Plan Management

- **Description:** Provide an easy-to-use mechanism through which individual and small-business customers can independently modify or cancel telecommunications service plans without interacting with a live customer service representative. Support plan upgrades, downgrades, adding or removing services, and cancellation.
- **Business Value:** Meets the central self-service obligation; gives customers greater control and reduces barriers to changing or leaving a service. Supports competition and customer trust.
- **Consumers:** Individual customers; small-business customers; customer experience and digital teams; regulatory compliance teams.
- **Expected Systems:** Customer web portal; mobile app; self-service workflow or experience platform; customer identity and account management; product catalogue and eligibility services; customer relationship management (CRM) platform.
- **Regulatory basis:** Paras. 13, 16–17, 38–39, 42–43 (pp. 4–5, 8–9). Applies to all service providers and enforcement starts 26 April 2027.

### 2. Plan Change and Cancellation Fulfilment

- **Description:** Translate an accepted self-service request into the corresponding account, service, and billing changes; track it through completion; and handle exceptions. Make changes effective immediately to the greatest extent possible. Route a request for clarification when additional information is reasonably required to establish the customer’s intent.
- **Business Value:** Ensures the digital request results in the intended real-world outcome, avoiding mismatches between what the customer selected and the service delivered or billed. Reduces avoidable contacts, errors, and disputes.
- **Consumers:** Customers; service operations and provisioning teams; billing teams; customer support; product and compliance owners.
- **Expected Systems:** Order management; service provisioning and network/service inventory; billing and rating; product and offer catalogue; customer/account master; workflow or orchestration; exception and work-queue management.
- **Regulatory basis:** Paras. 13, 27, 34, 39 (pp. 4, 6, 8). Integration and exception-management systems are inferred implementation enablers; the policy does not mandate specific platforms or a fixed processing-time metric.

### 3. Informed Consent and Contract-Change Transparency

- **Description:** Present clear information about the proposed action and resulting contract or plan changes, including whether the customer can return to existing terms if dissatisfied. Capture the customer’s informed and express consent before applying the change.
- **Business Value:** Helps customers make informed choices; reduces unintended changes, complaints, and disputes; creates evidence of customer authorization.
- **Consumers:** Customers; legal and regulatory teams; product and pricing owners; customer support; dispute-handling teams.
- **Expected Systems:** Digital journey/content management; product and pricing catalogue; contract and terms repository; consent capture and audit logging; customer/account platform; customer communication services.
- **Regulatory basis:** Paras. 14–16 (pp. 4–5), including the CRTC’s requirement for transparency and informed, express consent.

### 4. Written Confirmation and Interaction Evidence

- **Description:** Deliver written confirmation for every action taken through self-service, communicate the expected confirmation timeframe within the mechanism, and retain sufficient evidence of the request, consent, action outcome, and confirmation status to support customer follow-up and dispute handling.
- **Business Value:** Provides customers with a reliable record; supports transparency and accountability; helps resolve disputes and detect failed or delayed transactions.
- **Consumers:** Customers; customer support; complaints and dispute-resolution teams; compliance and audit; service operations.
- **Expected Systems:** Notification and communications platform (for example, email or SMS); document/template management; transaction and consent event logs; customer contact-preference management; case management; monitoring and delivery-status reporting.
- **Regulatory basis:** Paras. 28–29, 35 (pp. 6–8), and para. 44 (p. 9). Written confirmation and disclosure of the expected timeframe are express obligations. Specific retention periods and evidence formats are not set by this policy.

### 5. Customer-Service Fee Governance

- **Description:** Ensure customers are not charged fees to access any type of customer service. Distinguish such access fees from charges for actions taken through self-service, and apply other relevant CRTC requirements to action-related fees.
- **Business Value:** Prevents prohibited customer-service access charges, supports affordability, and reduces billing disputes and regulatory exposure.
- **Consumers:** Customers; billing and finance; customer-service operations; pricing and product owners; regulatory compliance.
- **Expected Systems:** Product and fee catalogue; billing and rating; customer-service channel and contact management; fee-rule configuration; billing audit and exception reporting.
- **Regulatory basis:** Paras. 25–27 (p. 6) and para. 44 (p. 9). The policy prohibits fees for accessing customer service; it states that fees for actions may still be charged, subject to other applicable determinations.

### 6. Accessible and Privacy-Respecting Service Delivery

- **Description:** Apply existing accessibility and privacy protections to self-service experiences and ensure customers requiring accommodations are not left with live customer service as their only practical route. This is a supporting capability for compliance with existing obligations, not a new detailed technical standard created by this policy.
- **Business Value:** Extends usable service to more customers, supports inclusion and privacy, and reduces the risk of inaccessible or inappropriate handling of customer information.
- **Consumers:** Customers, including customers requiring accommodations; accessibility and privacy teams; digital product owners; customer support; legal and compliance.
- **Expected Systems:** Digital experience and content platforms; accessibility testing and remediation tools; identity and access management; consent and preference management; privacy controls and audit logs; alternative communication or accommodation channels.
- **Regulatory basis:** Paras. 22–23, 30–31 (pp. 6–7) and para. 45 (p. 9). The CRTC states existing accessibility and privacy protections apply, does not impose additional requirements in this proceeding, and encourages accessible mechanisms.

### 7. Regulatory Compliance and Complaint Readiness

- **Description:** Establish ownership, controls, testing, monitoring, and evidence to demonstrate that self-service is available and that its key outcomes—request completion, consent, confirmation, and fee treatment—are working. Prepare to receive, investigate, and respond to customer complaints and CRTC inquiries.
- **Business Value:** Enables early detection and remediation of control gaps; supports consistent customer outcomes and defensible responses to the Commission; reduces enforcement and reputational risk.
- **Consumers:** Executive and business capability owners; regulatory affairs; internal audit; customer complaints and support; service operations; the CRTC as regulator.
- **Expected Systems:** Governance, risk, and compliance (GRC) or control register; service analytics and operational dashboards; test and release management; case/complaint management; evidence repository; reporting and audit tools.
- **Regulatory basis:** Paras. 35–39 (p. 8): the Commission will administer the requirement directly, including receiving complaints and ensuring providers make mechanisms available; the requirement applies to all service providers.
- **Qualification:** Monitoring, formal control registers, and reporting systems are prudent business enablers inferred from the policy. This policy does not specify a particular reporting format or routine reporting cadence.

## Cross-Capability Dependencies

- The self-service journey depends on accurate product, account, and eligibility information.
- Fulfilment depends on integration with order, provisioning, service inventory, and billing processes.
- Consent, fulfilment outcomes, and written confirmations should be linked by a traceable transaction or case reference.
- Customer-service fee controls depend on consistent fee definitions across pricing, billing, and customer-support operations.
- Accessibility and privacy considerations should be addressed in the design and operation of all customer-facing capabilities, not treated solely as a separate review at launch.
- Compliance testing should exercise the end-to-end customer journey, including failed fulfilment, clarification, confirmation-delivery failure, and complaint scenarios.

## Scope and Interpretation

The policy requires outcomes and leaves providers flexibility in mechanism and channel. The systems listed above are therefore illustrative business-system categories, not mandated solutions. Existing privacy and accessibility obligations continue to apply, and other CRTC decisions may affect fees for specific actions. Applicability and final implementation should be confirmed against the current regulatory position.
