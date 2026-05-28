/**
 * Leadron SDK for JavaScript/TypeScript
 * @see https://api.leadron.io
 */

export { Leadron } from './client.js';
export type { LeadronConfig } from './client.js';

export {
  LeadronError,
  LeadronAuthError,
  LeadronValidationError,
  LeadronRateLimitError,
} from './errors.js';

export type {
  Lead,
  LeadCreate,
  LeadStatus,
  Partner,
  Commission,
  CommissionType,
  CommissionStatus,
  PaymentMethod,
  Webhook,
  WebhookEvent,
  Sequence,
  Pagination,
  ListParams,
  DateRangeParams,
  RequestOptions,
  ApiResponse,
} from './types.js';
