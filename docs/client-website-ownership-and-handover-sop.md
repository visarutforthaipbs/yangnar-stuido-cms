# Client Website Accounts, Ownership, and Handover SOP

**Document owner:** Website consultant

**Applies to:** New client websites, redesigns, migrations, and ongoing website management

**Review cycle:** Annually and whenever the service stack changes

**Yangnar example domain:** `yangnarstudio.com`

## 1. Purpose

This SOP establishes a professional and repeatable way to create, secure, operate, and hand over the accounts required for a client website. Its goals are to:

- keep business assets under the client's ownership;
- avoid tying production services to the consultant's personal accounts;
- prevent one person's departure from locking the client out;
- make renewals, maintenance, and future handovers straightforward;
- separate public contact, system administration, and individual user access;
- maintain a clear record without storing passwords in project documents or source code.

## 2. Core ownership policy

The client must be the legal owner and billing owner of production assets whenever the provider supports it. This includes:

- domain registration;
- DNS and CDN;
- production hosting;
- CMS and backend services;
- source-code organization or repository;
- business email service;
- analytics, search, maps, and form services;
- payment or commerce services, if applicable.

The consultant should receive an individual administrator or collaborator account. The consultant should not be the sole owner, recovery contact, or holder of a shared password.

Use the following priority when assigning ownership:

1. Client-owned organization or workspace
2. Client owner/director's named account
3. Client-controlled role mailbox
4. Consultant-owned account only as a temporary exception documented in writing

## 3. Email and account model

### 3.1 Independent recovery address

Before the domain exists, use an email address the client already controls, such as an existing business address or a dedicated Gmail/Outlook account. This address is used to purchase the domain and recover critical accounts if the domain or its DNS stops working.

For Yangnar, the sequence is:

1. Use an existing client-controlled email to register `yangnarstudio.com`.
2. Configure DNS after the domain is active.
3. Create the domain mailboxes and aliases.
4. Add the new domain mailbox to services as an administrative or notification address.
5. Keep the independent address as a secondary recovery contact.

Do not make `admin@yangnarstudio.com` the only recovery route for the domain that makes that mailbox work. A DNS or billing failure could otherwise lock the client out of both the domain and its email.

### 3.2 Recommended domain addresses

| Address | Purpose | Visibility |
| --- | --- | --- |
| `hello@yangnarstudio.com` | General public contact | Public |
| `projects@yangnarstudio.com` | Project inquiries, if needed | Public |
| `admin@yangnarstudio.com` | Service notices, renewals, and administration | Private |
| `website@yangnarstudio.com` | Website notifications and form routing, if useful | Private |
| Individual named addresses | Personal work and provider logins | Private |

Start with aliases or groups when full mailboxes are unnecessary. Route them to at least two responsible people for continuity. Do not publish `admin@...` on the website.

### 3.3 Individual access rule

Every person should sign in using their own account when the service supports team members. This applies to GitHub, hosting, CMS, analytics, DNS, and other administrative systems.

Role addresses may receive notices, but they should not replace individual accounts. Shared logins are allowed only when a provider does not support team access; they must be stored in the approved password manager and protected with multi-factor authentication.

## 4. Roles and responsibilities

| Role | Responsibility | Typical access |
| --- | --- | --- |
| Client owner | Legal ownership, billing approval, recovery, and final authority | Owner |
| Client website lead | Content approval and day-to-day coordination | Admin or editor |
| Website consultant | Setup, deployment, maintenance, documentation, and support | Admin or developer |
| Content editor | CMS content updates only | Editor |
| Finance contact | Invoices, payment methods, and renewal approval | Billing |

At least two client-controlled people or recovery methods should be available for critical assets. The consultant must never be the only administrator of a production service.

## 5. Standard project procedure

### Phase A: Project initiation

1. Identify the client owner, website lead, finance contact, and technical contact.
2. Agree which services are included and which recurring fees the client will pay directly.
3. Confirm the final legal/business name, preferred domain, and public contact addresses.
4. Create a client entry in the approved password manager.
5. Create an account register using the template in Section 8.
6. Record ownership and recurring third-party costs in the proposal or contract.

**Exit criteria:** Named owners are confirmed, the domain choice is approved, and responsibility for recurring costs is documented.

### Phase B: Domain acquisition

1. The client creates the registrar account using an existing independent email.
2. The client purchases the domain using a client-controlled payment method.
3. Verify the registrant organization and contact details.
4. Enable domain auto-renewal, registrar lock, and multi-factor authentication.
5. Save recovery codes in the client's password manager.
6. Add the consultant as a delegated user where supported.
7. Record the registrar, domain, renewal date, billing owner, and DNS provider.

**Exit criteria:** The client controls the registrar and recovery method, auto-renewal is enabled, and the consultant has delegated access.

### Phase C: Business email and DNS

1. Select the email provider with the client.
2. Add the provider's DNS verification and mail records.
3. Configure SPF, DKIM, and DMARC according to the provider's instructions.
4. Create the approved mailboxes, aliases, or groups.
5. Test inbound mail, outbound mail, and replies.
6. Configure the independent recovery email as a secondary recovery route.
7. Document which people receive each role address.

**Exit criteria:** Mail works in both directions, authentication records pass provider checks, and recovery does not depend only on the new domain.

### Phase D: Technical services

Create production services inside client-owned organizations or workspaces. Use individual invitations and least-privilege roles.

| Service | Required ownership/access standard |
| --- | --- |
| Source code | Client organization owns the repository; consultant is maintainer/admin |
| Hosting | Client organization and billing; consultant has deployment access |
| CMS/backend | Client owns project; consultant is admin; editors use individual accounts |
| DNS/CDN | Client owner plus delegated consultant access |
| Analytics/Search | Client owns property; consultant receives admin access during the project |
| Forms/email delivery | Client owns account, sending domain, billing, and production API keys |
| Monitoring | Client receives outage and billing alerts; consultant receives technical alerts during support |

For each service:

1. Enable multi-factor authentication where available.
2. Assign the minimum role each person needs.
3. Configure billing and renewal notices to reach the client.
4. Record the service in the account register.
5. Store secrets only in the provider's secret manager or deployment environment.
6. Never commit passwords, tokens, private keys, recovery codes, or production `.env` files to Git.

### Phase E: Pre-launch audit

Before changing production DNS or announcing the website, verify:

- the client can sign in to every critical service;
- the client is owner or billing owner of each production asset;
- two-factor authentication and recovery methods work;
- domain auto-renewal and payment details are current;
- DNS records and nameservers are documented;
- HTTPS is valid;
- website forms deliver to the correct recipients;
- public contact addresses are correct;
- analytics and search verification are connected;
- production environment variables are present and not stored in the repository;
- backups, export procedures, or recovery options are understood;
- privacy, cookie, and consent requirements have been reviewed for the project's jurisdiction and features.

### Phase F: Handover

1. Conduct a recorded or documented walkthrough with the client website lead.
2. Demonstrate CMS editing, publishing, user management, and rollback/recovery where available.
3. Review the account register without exposing passwords in the meeting notes.
4. Confirm that the client can access domain, DNS, hosting, repository, CMS, email, and analytics.
5. Transfer any temporary consultant-owned asset into client ownership.
6. Remove test accounts, temporary credentials, and unused API keys.
7. Rotate any secret that was shared during setup.
8. Deliver deployment notes, content instructions, renewal dates, and support terms.
9. Obtain written acceptance from the authorized client contact.
10. Reduce or remove consultant access according to the maintenance agreement.

**Exit criteria:** The client has verified access, all deliverables are accepted, and post-launch responsibility is explicit.

### Phase G: Ongoing review and offboarding

Review production access at least every six months and whenever someone joins or leaves either organization.

On consultant offboarding:

1. Confirm the client has at least two working owner/recovery routes.
2. Export the latest account register and operational documentation.
3. Transfer any remaining assets.
4. Remove the consultant's individual access.
5. Revoke consultant API tokens, deploy keys, and app integrations.
6. Rotate secrets that the consultant could access.
7. Record the completion date and approving client contact.

## 6. Security standard

- Use a business password manager with a client-owned vault or collection.
- Use unique generated passwords; never reuse a password across clients or services.
- Prefer passkeys or authenticator-app MFA. Avoid SMS as the only factor when stronger methods are available.
- Store recovery codes in the password manager, not in email, chat, Git, or the project folder.
- Do not send passwords or API keys in invoices, contracts, handover PDFs, messaging apps, or meeting notes.
- Use separate development, preview, and production secrets.
- Rotate credentials after accidental exposure, staff changes, and handover.
- Review audit logs after suspicious activity and at major launch or migration milestones.
- Keep client services separate from the consultant's personal workspaces and payment methods.

## 7. Decision rules and exceptions

If a client cannot create an account during setup, the consultant may create a temporary account only when all of the following are documented:

- why the exception is required;
- which client representative authorized it;
- the planned transfer date;
- who pays recurring fees before transfer;
- how ownership and recovery will be transferred.

The transfer should occur before launch or final payment. An exception must not quietly become the permanent ownership model.

For very small clients with one owner, use the owner's named account as primary owner, the role mailbox for notices, and the independent recovery address as backup. Document an emergency recovery contact where practical.

## 8. Account register template

Keep this register in an access-controlled client workspace. It records where access is stored, not the secret itself.

| Service | URL/account ID | Asset/project | Client owner | Consultant role | Login/recovery email | MFA owner | Billing owner | Renewal/date | Credential location | Status/notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Domain registrar |  |  |  |  |  |  |  |  | Password manager |  |
| DNS/CDN |  |  |  |  |  |  |  |  | Password manager |  |
| Email provider |  |  |  |  |  |  |  |  | Password manager |  |
| Source repository |  |  |  |  |  |  |  |  | Individual login |  |
| Hosting |  |  |  |  |  |  |  |  | Individual login |  |
| CMS/backend |  |  |  |  |  |  |  |  | Individual login |  |
| Analytics/Search |  |  |  |  |  |  |  |  | Individual login |  |
| Forms/email delivery |  |  |  |  |  |  |  |  | Secret manager |  |
| Other integrations |  |  |  |  |  |  |  |  |  |  |

## 9. Yangnar Studio implementation plan

Use this as the initial target state for `yangnarstudio.com`.

| Asset | Recommended owner | Consultant access | Notes |
| --- | --- | --- | --- |
| `yangnarstudio.com` | Yangnar Studio representative | Delegated domain/DNS access | Register first using an existing independent email |
| Domain email | Yangnar Studio | Admin during setup | Create `hello@...` and private `admin@...`; retain independent recovery |
| GitHub repository | Yangnar Studio organization | Maintainer/admin | Transfer or create under client organization before handover |
| Vercel hosting | Yangnar Studio team | Developer/admin | Client owns billing and production project |
| Sanity project | Yangnar Studio organization/project | Administrator | Editors receive individual member accounts |
| Website inquiries | Yangnar Studio | Technical access during support | Deliver to approved staff, not only the consultant |
| Analytics/Search | Yangnar Studio | Admin during project/support | Client retains permanent owner access |

Recommended address use:

- `hello@yangnarstudio.com`: shown publicly and used for general inquiries;
- `admin@yangnarstudio.com`: private service notices and renewal alerts;
- `website@yangnarstudio.com`: optional form notifications or automated website operations;
- independent existing email: domain and emergency recovery fallback.

Immediate Yangnar actions:

1. Confirm the Yangnar representative who will legally own the domain and approve billing.
2. Confirm the existing independent recovery email to use for domain registration.
3. Register `yangnarstudio.com` in a Yangnar-controlled registrar account.
4. Enable MFA, registrar lock, auto-renewal, and secure recovery codes.
5. Select and configure the business email provider.
6. Create `hello@yangnarstudio.com` and private administrative aliases.
7. Audit ownership of the existing GitHub, Vercel, and Sanity assets.
8. Move any consultant-owned production assets into Yangnar-controlled organizations.
9. Complete the account register and test client access before launch.
10. Sign off the handover checklist and define the maintenance arrangement.

## 10. Client acceptance record

**Project:**

**Domain:**

**Client owner:**

**Client website lead:**

**Consultant:**

**Handover date:**

**Maintenance arrangement:**

The client confirms that it has received and tested access to the domain, DNS, email, source code, hosting, CMS/backend, analytics, and other production services listed in the account register.

**Client approval:** ____________________

**Consultant confirmation:** ____________________
