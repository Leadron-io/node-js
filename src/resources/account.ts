/**
 * Account and API key management resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { RequestOptions } from '../types.js';

export function createAccountResource(config: HttpClientConfig) {
  const apiKeys = {
    async list(params?: { environment?: string; status?: string; page?: number; limit?: number }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/api-keys',
        query: params as Record<string, string | number | undefined>,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
    },
    async create(body: { name: string; environment?: 'live' | 'sandbox' }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/api-keys',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async revoke(keyId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/api-keys/${keyId}`,
        requestId: opts?.requestId,
      });
    },
  };

  return {
    apiKeys,
    async get(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/account',
        requestId: opts?.requestId,
      });
      return data;
    },
    async update(body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'PATCH',
        path: '/v1/account',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getBranding(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/account/branding',
        requestId: opts?.requestId,
      });
      return data;
    },
    async updateBranding(body: { logo?: string; primaryColor?: string; companyName?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'PUT',
        path: '/v1/account/branding',
        body,
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
        path: '/v1/account/usage',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getPlan(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/account/plan',
        requestId: opts?.requestId,
      });
      return data;
    },
    async getLimits(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/account/limits',
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
