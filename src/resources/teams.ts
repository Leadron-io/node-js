/**
 * Team management resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { RequestOptions } from '../types.js';

export function createTeamsResource(config: HttpClientConfig) {
  return {
    async create(body: { name: string; description?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: '/v1/teams',
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async get(teamId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/teams/${teamId}`,
        requestId: opts?.requestId,
      });
      return data;
    },
    async list(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/teams',
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
    },
    async update(teamId: string, body: { name?: string; description?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'PUT',
        path: `/v1/teams/${teamId}`,
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async delete(teamId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/teams/${teamId}`,
        requestId: opts?.requestId,
      });
    },
    async addMember(teamId: string, userId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/teams/${teamId}/members`,
        body: { userId },
        requestId: opts?.requestId,
      });
    },
    async removeMember(teamId: string, userId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/teams/${teamId}/members/${userId}`,
        requestId: opts?.requestId,
      });
    },
    async getMembers(teamId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/teams/${teamId}/members`,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async assignLead(teamId: string, leadId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/teams/${teamId}/assign/lead`,
        body: { leadId },
        requestId: opts?.requestId,
      });
    },
    async assignPhoneNumber(teamId: string, numberId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/teams/${teamId}/assign/phone-number`,
        body: { numberId },
        requestId: opts?.requestId,
      });
    },
    async getStats(teamId: string, params?: { dateRange?: { from: string; to: string }; from?: string; to?: string }, opts?: RequestOptions) {
      const q: Record<string, string | undefined> = {};
      if (params?.from ?? params?.dateRange?.from) q.from = params?.from ?? params?.dateRange?.from;
      if (params?.to ?? params?.dateRange?.to) q.to = params?.to ?? params?.dateRange?.to;
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: `/v1/teams/${teamId}/stats`,
        query: q,
        requestId: opts?.requestId,
      });
      return data;
    },
    async getLeaderboard(opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'GET',
        path: '/v1/teams/leaderboard',
        requestId: opts?.requestId,
      });
      return data;
    },
  };
}
