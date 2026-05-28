/**
 * SMS / communications resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { RequestOptions } from '../types.js';

export function createSmsResource(config: HttpClientConfig) {
  return {
    async send(body: { to: string; from?: string; message?: string; body?: string }, opts?: RequestOptions) {
      const payload = { to: body.to, body: body.message ?? body.body };
      if (body.from) (payload as Record<string, string>).from = body.from;
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/communications/send/sms',
        body: payload,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getInbox(phoneNumberId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/communications/inbox',
        query: { phoneNumberId },
        requestId: opts?.requestId,
      });
      return data;
    },
    async getOutbox(phoneNumberId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/communications/outbox',
        query: { phoneNumberId },
        requestId: opts?.requestId,
      });
      return data;
    },
    async getConversation(leadId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/communications/conversations/${leadId}`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getUsage(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const q: Record<string, string | undefined> = {};
      if (params?.from ?? params?.dateRange?.from) q.from = params?.from ?? params?.dateRange?.from;
      if (params?.to ?? params?.dateRange?.to) q.to = params?.to ?? params?.dateRange?.to;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/communications/usage',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
