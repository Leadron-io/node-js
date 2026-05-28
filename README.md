# Leadron JavaScript/TypeScript SDK

Official SDK for the [Leadron](https://leadron.io) API — lead management and partner commission platform.

## Install

```bash
npm install leadron
# or
yarn add leadron
pnpm add leadron
```

## Usage

```typescript
import { Leadron } from 'leadron';

const client = new Leadron({
  apiKey: process.env.LEADRON_API_KEY!,
  baseUrl: 'https://api.leadron.io', // optional, default production
});

// Auth
const valid = await client.auth.validate();
const scopes = await client.auth.getScopes();

// Leads
const lead = await client.leads.create({
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
});
const list = await client.leads.list({ status: 'qualified', limit: 20 });
for await (const l of list.autoPaginate()) {
  console.log(l.email);
}

// Partners & commissions
const partner = await client.partners.get(partnerId);
await client.commissions.approve(commissionId);

// Webhooks — verify signature (client-side)
const isValid = await client.auth.verifyWebhookSignature(rawBody, signature, secret);
const event = await client.webhooks.constructEvent(rawBody, signature, secret);

// Optional: idempotency and request ID
await client.leads.create(data, { idempotencyKey: 'unique-key-123', requestId: 'my-request-id' });

// Rate limit (from last response)
const remaining = client.getRateLimitStatus();
```

## API surface

- **auth** — validate, getScopes, verifyWebhookSignature
- **leads** — create, get, update, delete, list (with autoPaginate), assign, updateStatus, addNote, getNotes, getTimeline, markConverted, bulkCreate, bulkAssign, bulkUpdateStatus, search, filter
- **partners** — create, get, update, list, deactivate, getReferralTree, getUpline, getReferralLink, getStats, getLeaderboard, getTopPerformers, invite, resendInvite, getOnboardingStatus, sendAgreement, getSignedDocuments, getAgreementStatus
- **commissions** — create, get, list, approve, reject, markPaid, getRules, createRule, updateRule, deleteRule, getPayoutSummary, getWalletBalance, requestPayout, getPayoutHistory, getSummary, getByPartner, getTotalOwed, getTotalPaid
- **sequences** — create, get, list, update, delete, activate, pause, enrollLead, enrollBulk, unenrollLead, getEnrolledLeads, addStep, updateStep, deleteStep, reorderSteps
- **sms** — send, getInbox, getOutbox, getConversation, getUsage
- **phoneNumbers** — search, list, get, release, assignToTeam, unassignFromTeam, getUsage, get10DLCStatus
- **teams** — create, get, list, update, delete, addMember, removeMember, getMembers, assignLead, assignPhoneNumber, getStats, getLeaderboard
- **documents** — templates (create, list, get, update, delete), send, sendToPartner, get, list, getStatus, download, getAuditTrail, void, resend
- **webhooks** — create, list, get, update, delete, test, getLogs, retry, constructEvent
- **analytics** — getOverview, getLeadMetrics, getCommissionMetrics, getPartnerMetrics, getConversionRate, getSmsMetrics
- **reports** — leads, commissions, partners, export
- **account** — get, update, getBranding, updateBranding, apiKeys (list, create, revoke), getUsage, getPlan, getLimits

## Webhook events

See [Leadron Events](https://docs.leadron.io/events) for the full list of webhook event types (e.g. `lead.created`, `lead.converted`, `commission.approved`, `document.signed`). Verify payloads with `client.auth.verifyWebhookSignature(payload, signature, secret)` before processing.

## API docs

Full API reference: [Leadron Docs](https://docs.leadron.io).
