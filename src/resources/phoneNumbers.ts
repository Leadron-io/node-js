/**
 * Phone number management resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { RequestOptions } from '../types.js';

export function createPhoneNumbersResource(config: HttpClientConfig) {
  return {
    async search(params?: { countryIso?: string; areaCode?: string; type?: 'local' | 'tollfree' }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/phone-numbers',
        body: params ?? {},
        requestId: opts?.requestId,
      });
      return data;
    },
    async list(params?: { page?: number; limit?: number }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/phone-numbers',
        query: params as Record<string, string | number | undefined>,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
    },
    async get(numberId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/phone-numbers/${numberId}`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async release(numberId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/phone-numbers/${numberId}`,
        requestId: opts?.requestId,
      });
    },
    async assignToTeam(numberId: string, teamId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/phone-numbers/${numberId}/assign-team`,
        body: { teamId },
        requestId: opts?.requestId,
      });
    },
    async unassignFromTeam(numberId: string, teamId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/phone-numbers/${numberId}/unassign-team`,
        body: { teamId },
        requestId: opts?.requestId,
      });
    },
    async getUsage(numberId: string, params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const q: Record<string, string | undefined> = {};
      if (params?.from ?? params?.dateRange?.from) q.from = params?.from ?? params?.dateRange?.from;
      if (params?.to ?? params?.dateRange?.to) q.to = params?.to ?? params?.dateRange?.to;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/phone-numbers/${numberId}/usage`,
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async get10DLCStatus(numberId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/phone-numbers/${numberId}/10dlc-status`,
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
