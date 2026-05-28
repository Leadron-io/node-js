/**
 * Reports resource.
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

export function createReportsResource(config: HttpClientConfig) {
  return {
    async leads(
      params?: { dateRange?: { from: string; to: string }; from?: string; to?: string; groupBy?: string; format?: 'json' | 'csv' },
      opts?: RequestOptions
    ) {
      const q = dateQuery(params);
      if (params?.groupBy) q.groupBy = params.groupBy;
      if (params?.format) q.format = params.format;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/reports/leads',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async commissions(
      params?: { dateRange?: { from: string; to: string }; from?: string; to?: string; format?: 'json' | 'csv' },
      opts?: RequestOptions
    ) {
      const q = dateQuery(params);
      if (params?.format) q.format = params.format;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/reports/commissions',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async partners(
      params?: { dateRange?: { from: string; to: string }; from?: string; to?: string; format?: 'json' | 'csv' },
      opts?: RequestOptions
    ) {
      const q = dateQuery(params);
      if (params?.format) q.format = params.format;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/reports/partners',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async export(reportConfig: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<{ url?: string }>(config, {
        method: 'POST',
        path: '/v1/reports/export',
        body: reportConfig,
        requestId: opts?.requestId,
      });
      return (data as { url?: string })?.url ?? data;
    },
  };
}
