/**
 * Leadron API client. All resources are namespaced under the client.
 */

import type { HttpClientConfig } from './http.js';
import { createAuthResource } from './resources/auth.js';
import { createLeadsResource } from './resources/leads.js';
import { createPartnersResource } from './resources/partners.js';
import { createMarketersResource } from './resources/marketers.js';
import { createCommissionsResource } from './resources/commissions.js';
import { createSequencesResource } from './resources/sequences.js';
import { createSmsResource } from './resources/sms.js';
import { createPhoneNumbersResource } from './resources/phoneNumbers.js';
import { createTeamsResource } from './resources/teams.js';
import { createDocumentsResource } from './resources/documents.js';
import { createWebhooksResource } from './resources/webhooks.js';
import { createAnalyticsResource } from './resources/analytics.js';
import { createReportsResource } from './resources/reports.js';
import { createAccountResource } from './resources/account.js';

export interface LeadronConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
}

export class Leadron {
  private config: HttpClientConfig;
  private rateLimitRef: { current?: number } = {};

  constructor(config: LeadronConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      maxRetries: config.maxRetries,
      rateLimitRef: this.rateLimitRef,
    };
  }

  get auth() {
    return createAuthResource(this.config);
  }

  get leads() {
    return createLeadsResource(this.config);
  }

  get partners() {
    return createPartnersResource(this.config);
  }

  get marketers() {
    return createMarketersResource(this.config);
  }

  get commissions() {
    return createCommissionsResource(this.config);
  }

  get sequences() {
    return createSequencesResource(this.config);
  }

  get sms() {
    return createSmsResource(this.config);
  }

  get phoneNumbers() {
    return createPhoneNumbersResource(this.config);
  }

  get teams() {
    return createTeamsResource(this.config);
  }

  get documents() {
    return createDocumentsResource(this.config);
  }

  get webhooks() {
    return createWebhooksResource(this.config);
  }

  get analytics() {
    return createAnalyticsResource(this.config);
  }

  get reports() {
    return createReportsResource(this.config);
  }

  get account() {
    return createAccountResource(this.config);
  }

  /** Remaining requests in the current rate limit window (from last response). */
  getRateLimitStatus(): number | undefined {
    return this.rateLimitRef.current;
  }
}
