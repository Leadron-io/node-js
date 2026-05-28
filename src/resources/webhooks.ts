/**
 * Webhook management resource. Signature verification is on auth.verifyWebhookSignature or constructEvent.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { Webhook, WebhookEvent, RequestOptions } from '../types.js';

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function createWebhooksResource(config: HttpClientConfig) {
  return {
    async create(body: { url: string; events: string[]; secret?: string }, opts?: RequestOptions) {
      const { data } = await request<Webhook>(config, {
        method: 'POST',
        path: '/v1/integrations/webhooks',
        body,
        requestId: opts?.requestId,
      });
      return data as Webhook;
    },
    async list(opts?: RequestOptions) {
      const { data } = await request<Webhook[]>(config, {
        method: 'GET',
        path: '/v1/integrations/webhooks',
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async get(webhookId: string, opts?: RequestOptions) {
      const { data } = await request<Webhook>(config, {
        method: 'GET',
        path: `/v1/integrations/webhooks/${webhookId}`,
        requestId: opts?.requestId,
      });
      return data as Webhook;
    },
    async update(webhookId: string, body: { url?: string; events?: string[]; secret?: string }, opts?: RequestOptions) {
      const { data } = await request<Webhook>(config, {
        method: 'PUT',
        path: `/v1/integrations/webhooks/${webhookId}`,
        body,
        requestId: opts?.requestId,
      });
      return data as Webhook;
    },
    async delete(webhookId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/integrations/webhooks/${webhookId}`,
        requestId: opts?.requestId,
      });
    },
    async test(webhookId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/integrations/webhooks/${webhookId}/test`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getLogs(webhookId: string, opts?: RequestOptions) {
      const { data } = await request<unknown[]>(config, {
        method: 'GET',
        path: `/v1/integrations/webhooks/${webhookId}/logs`,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async retry(webhookId: string, logId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/integrations/webhooks/${webhookId}/retry`,
        body: { logId },
        requestId: opts?.requestId,
      });
      return data;
    },
    async constructEvent(rawBody: string, signature: string, secret: string): Promise<WebhookEvent> {
      const expected = await hmacSha256Hex(secret, rawBody);
      if (expected !== signature && `sha256=${expected}` !== signature) {
        throw new Error('Webhook signature verification failed');
      }
      return JSON.parse(rawBody) as WebhookEvent;
    },
  };
}
