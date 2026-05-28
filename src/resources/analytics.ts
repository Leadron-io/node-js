/**
 * Analytics resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { RequestOptions } from '../types.js';

function dateQuery(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }) {
  const q: Record<string, string | undefined> = {};
  if (params?.from ?? params?.dateRange?.from) q.from = params?.from ?? params?.dateRange?.from;
  if (params?.to ?? params?.dateRange?.to) q.to = params?.to ?? params?.dateRange?.to;
  return q;
}

export function createAnalyticsResource(config: HttpClientConfig) {
  return {
    async getOverview(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/analytics/overview',
        query: dateQuery(params),
        requestId: opts?.requestId,
      });
      return data;
    },
    async getLeadMetrics(
      params?: { dateRange?: { from: string; to: string }; from?: string; to?: string; groupBy?: 'day' | 'week' | 'month' },
      opts?: RequestOptions
    ) {
      const q = dateQuery(params);
      if (params?.groupBy) q.groupBy = params.groupBy;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/analytics/leads',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getCommissionMetrics(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/analytics/commissions',
        query: dateQuery(params),
        requestId: opts?.requestId,
      });
      return data;
    },
    async getPartnerMetrics(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/analytics/partners',
        query: dateQuery(params),
        requestId: opts?.requestId,
      });
      return data;
    },
    async getConversionRate(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/analytics/conversion-rate',
        query: dateQuery(params),
        requestId: opts?.requestId,
      });
      return data;
    },
    async getSmsMetrics(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/analytics/sms',
        query: dateQuery(params),
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
