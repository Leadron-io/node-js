/**
 * Partner management resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { Partner, ListParams, RequestOptions } from '../types.js';

function buildQuery(p: Record<string, unknown>): Record<string, string | number | undefined> {
  const q: Record<string, string | number | undefined> = {};
  if (p.page !== undefined) q.page = p.page as number;
  if (p.limit !== undefined) q.limit = p.limit as number;
  if (p.status !== undefined) q.status = String(p.status);
  if (p.tier !== undefined) q.tier = String(p.tier);
  return q;
}

export function createPartnersResource(config: HttpClientConfig) {
  return {
    async create(body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<Partner>(config, {
        method: 'POST',
        path: '/v1/partners',
        body,
        requestId: opts?.requestId,
      });
      return data as Partner;
    },
    async get(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<Partner>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}`,
        requestId: opts?.requestId,
      });
      return data as Partner;
    },
    async update(partnerId: string, body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<Partner>(config, {
        method: 'PATCH',
        path: `/v1/partners/${partnerId}`,
        body,
        requestId: opts?.requestId,
      });
      return data as Partner;
    },
    async list(params?: ListParams & { status?: string; tier?: string }, opts?: RequestOptions) {
      const { data } = await request<Partner[]>(config, {
        method: 'GET',
        path: '/v1/partners',
        query: buildQuery((params ?? {}) as Record<string, unknown>),
        requestId: opts?.requestId,
      });
      return { data: Array.isArray(data) ? data : [], pagination: (data as { pagination?: unknown })?.pagination };
    },
    async deactivate(partnerId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/partners/${partnerId}/deactivate`,
        requestId: opts?.requestId,
      });
    },
    async getReferralTree(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/hierarchy`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getUpline(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/hierarchy`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getReferralLink(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<{ url?: string }>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/referral-link`,
        requestId: opts?.requestId,
      });
      return (data as { url?: string })?.url ?? data;
    },
    async getStats(partnerId: string, params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const q: Record<string, string | undefined> = {};
      if (params?.from ?? params?.dateRange?.from) q.from = params?.from ?? params?.dateRange?.from;
      if (params?.to ?? params?.dateRange?.to) q.to = params?.to ?? params?.dateRange?.to;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/metrics`,
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getLeaderboard(params?: { period?: string; limit?: number }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/partners/leaderboard',
        query: params as Record<string, string | number | undefined>,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getTopPerformers(params?: { limit?: number }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/partners/leaderboard',
        query: { limit: params?.limit ?? 10 },
        requestId: opts?.requestId,
      });
      return data;
    },
    async invite(body: { email: string; name?: string; referredBy?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/partners/invite',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async resendInvite(partnerId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/partners/${partnerId}/resend-invite`,
        requestId: opts?.requestId,
      });
    },
    async getOnboardingStatus(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/onboarding`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async sendAgreement(partnerId: string, templateId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/partners/${partnerId}/agreements/send`,
        body: { templateId },
        requestId: opts?.requestId,
      });
      return data;
    },
    async getSignedDocuments(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/documents/signed`,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
    },
    async getAgreementStatus(partnerId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/partners/${partnerId}/agreement-status`,
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
