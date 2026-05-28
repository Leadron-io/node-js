/**
 * Documents and e-signing resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { RequestOptions } from '../types.js';

export function createDocumentsResource(config: HttpClientConfig) {
  const templates = {
    async create(body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/documents/templates',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async list(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/documents/templates',
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async get(templateId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/documents/templates/${templateId}`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async update(templateId: string, body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'PUT',
        path: `/v1/documents/templates/${templateId}`,
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async delete(templateId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/documents/templates/${templateId}`,
        requestId: opts?.requestId,
      });
    },
  };

  return {
    templates,
    async send(body: { templateId: string; recipientEmail: string; recipientName: string; customFields?: Record<string, unknown> }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/documents/send',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async sendToPartner(templateId: string, partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/documents/send-to-partner',
        body: { templateId, partnerId },
        requestId: opts?.requestId,
      });
      return data;
    },
    async get(documentId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/documents/${documentId}`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async list(params?: { status?: string; partnerId?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/documents',
        query: params as Record<string, string | undefined>,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async getStatus(documentId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/documents/${documentId}/status`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async download(documentId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/documents/${documentId}/download`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getAuditTrail(documentId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/documents/${documentId}/audit-trail`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async void(documentId: string, reason?: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/documents/${documentId}/void`,
        body: reason ? { reason } : {},
        requestId: opts?.requestId,
      });
    },
    async resend(documentId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/documents/${documentId}/resend`,
        requestId: opts?.requestId,
      });
    },
  };
}
