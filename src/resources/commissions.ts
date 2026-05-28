/**
 * Commission management resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { Commission, CommissionStatus, RequestOptions } from '../types.js';

function buildQuery(p: Record<string, unknown>): Record<string, string | number | undefined> {
  const q: Record<string, string | number | undefined> = {};
  if (p.partnerId !== undefined) q.partnerId = String(p.partnerId);
  if (p.status !== undefined) q.status = String(p.status);
  if (p.from !== undefined) q.from = String(p.from);
  if (p.to !== undefined) q.to = String(p.to);
  if (p.page !== undefined) q.page = p.page as number;
  if (p.limit !== undefined) q.limit = p.limit as number;
  return q;
}

export function createCommissionsResource(config: HttpClientConfig) {
  return {
    async create(
      body: { partnerId: string; leadId: string; amount: number; type?: 'flat' | 'percentage'; status?: CommissionStatus },
      opts?: RequestOptions
    ) {
      const { data } = await request<Commission>(config, {
        method: 'POST',
        path: '/v1/commissions/records',
        body,
        requestId: opts?.requestId,
      });
      return data as Commission;
    },
    async get(commissionId: string, opts?: RequestOptions) {
      const { data } = await request<Commission>(config, {
        method: 'GET',
        path: `/v1/commissions/records/${commissionId}`,
        requestId: opts?.requestId,
      });
      return data as Commission;
    },
    async list(
      params?: { partnerId?: string; status?: string; dateRange?: { from: string; to: string }; from?: string; to?: string; page?: number; limit?: number },
      opts?: RequestOptions
    ) {
      const q = buildQuery({
        ...params,
        from: params?.from ?? params?.dateRange?.from,
        to: params?.to ?? params?.dateRange?.to,
      } as Record<string, unknown>);
      const { data } = await request<Commission[]>(config, {
        method: 'GET',
        path: '/v1/commissions/records',
        query: q,
        requestId: opts?.requestId,
      });
      return { data: Array.isArray(data) ? data : [], pagination: (data as { pagination?: unknown })?.pagination };
    },
    async approve(commissionId: string, opts?: RequestOptions) {
      const { data } = await request<Commission>(config, {
        method: 'POST',
        path: `/v1/commissions/records/${commissionId}/approve`,
        requestId: opts?.requestId,
      });
      return data as Commission;
    },
    async reject(commissionId: string, reason?: string, opts?: RequestOptions) {
      const { data } = await request<Commission>(config, {
        method: 'POST',
        path: `/v1/commissions/records/${commissionId}/reject`,
        body: reason ? { reason } : {},
        requestId: opts?.requestId,
      });
      return data as Commission;
    },
    async markPaid(
      commissionId: string,
      opts?: { paidAt?: Date; paymentMethod?: 'platform' | 'external'; transactionRef?: string },
      requestOpts?: RequestOptions
    ) {
      const body: Record<string, unknown> = {};
      if (opts?.paidAt) body.paidAt = opts.paidAt.toISOString();
      if (opts?.paymentMethod) body.paymentMethod = opts.paymentMethod;
      if (opts?.transactionRef) body.transactionRef = opts.transactionRef;
      const { data } = await request<Commission>(config, {
        method: 'POST',
        path: `/v1/commissions/records/${commissionId}/mark-paid`,
        body,
        requestId: requestOpts?.requestId,
      });
      return data as Commission;
    },
    async getRules(opts?: RequestOptions) {
      const { data } = await request<unknown[]>(config, {
        method: 'GET',
        path: '/v1/commissions/rules',
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async createRule(
      body: { name: string; type: 'flat' | 'percentage'; value: number; conditions?: Record<string, unknown> },
      opts?: RequestOptions
    ) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/commissions/rules',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async updateRule(ruleId: string, body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'PUT',
        path: `/v1/commissions/rules/${ruleId}`,
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async deleteRule(ruleId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/commissions/rules/${ruleId}`,
        requestId: opts?.requestId,
      });
    },
    async getPayoutSummary(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/commissions/partners/${partnerId}/payout-summary`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getWalletBalance(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/commissions/partners/${partnerId}/wallet`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async requestPayout(partnerId: string, amount: number, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/commissions/partners/${partnerId}/payouts`,
        body: { amount },
        requestId: opts?.requestId,
      });
      return data;
    },
    async getPayoutHistory(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/commissions/partners/${partnerId}/payouts`,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async getSummary(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string; groupBy?: string }, opts?: RequestOptions) {
      const q = buildQuery({
        from: params?.from ?? params?.dateRange?.from,
        to: params?.to ?? params?.dateRange?.to,
        groupBy: params?.groupBy,
      } as Record<string, unknown>);
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/commissions/summary',
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getByPartner(partnerId: string, params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<Commission[]>(config, {
        method: 'GET',
        path: '/v1/commissions/records',
        query: { partnerId, ...buildQuery((params ?? {}) as Record<string, unknown>) },
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async getTotalOwed(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/commissions/total-owed',
        requestId: opts?.requestId,
      });
      return data;
    },
    async getTotalPaid(params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/commissions/total-paid',
        query: buildQuery({
          from: params?.from ?? params?.dateRange?.from,
          to: params?.to ?? params?.dateRange?.to,
        } as Record<string, unknown>),
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
