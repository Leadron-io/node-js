/**
 * Lead management resource.
 */

import type { HttpClientConfig, RequestConfig } from '../http.js';
import { request } from '../http.js';
import type { Lead, LeadCreate, LeadStatus, ListParams, Pagination, RequestOptions } from '../types.js';

export interface LeadsListResponse {
  data: Lead[];
  pagination?: Pagination;
  autoPaginate(): AsyncGenerator<Lead>;
}

function buildQuery(params?: Record<string, unknown>): Record<string, string | number | undefined> {
  if (!params) return {};
  const q: Record<string, string | number | undefined> = {};
  if (params.page != null) q.page = Number(params.page);
  if (params.limit != null) q.limit = Number(params.limit);
  if (params.status != null) q.status = String(params.status);
  if (params.source != null) q.source = String(params.source);
  if (params.assignedTo != null) q.assignedTo = String(params.assignedTo);
  if (params.sort != null) q.sort = String(params.sort);
  if (params.order != null) q.order = String(params.order);
  if (params.from != null) q.from = String(params.from);
  if (params.to != null) q.to = String(params.to);
  return q;
}

export function createLeadsResource(config: HttpClientConfig) {
  async function list(
    params?: ListParams & { status?: string; assignedTo?: string; source?: string; from?: string; to?: string },
    opts?: RequestOptions
  ): Promise<LeadsListResponse> {
    const res = await request<Lead[]>(config, {
      method: 'GET',
      path: '/v1/leads',
      query: buildQuery(params as Record<string, unknown>),
      requestId: opts?.requestId,
    });
    const listData = Array.isArray(res.data) ? res.data : [];
    const pagination = res.pagination as Pagination | undefined;

    async function* autoPaginate() {
      let page = params?.page ?? 1;
      const limit = params?.limit ?? 20;
      let totalFetched = listData.length;
      for (const item of listData) yield item;
      while (pagination?.hasNext) {
        page += 1;
        const next = await request<Lead[]>(config, {
          method: 'GET',
          path: '/v1/leads',
          query: buildQuery({ ...params, page, limit }),
          requestId: opts?.requestId,
        });
        const nextData = Array.isArray(next.data) ? next.data : [];
        for (const item of nextData) yield item;
        totalFetched += nextData.length;
        if (nextData.length < limit) break;
      }
    }

    return {
      data: listData,
      pagination,
      autoPaginate,
    };
  }

  return {
    async create(body: LeadCreate, opts?: RequestOptions) {
      const { data } = await request<Lead>(config, {
        method: 'POST',
        path: '/v1/leads',
        body: body as unknown as Record<string, unknown>,
        idempotencyKey: opts?.idempotencyKey,
        requestId: opts?.requestId,
      });
      return (Array.isArray(data) ? data[0] : data) as Lead;
    },
    async get(leadId: string, opts?: RequestOptions) {
      const { data } = await request<Lead>(config, {
        method: 'GET',
        path: `/v1/leads/${leadId}`,
        requestId: opts?.requestId,
      });
      return data as Lead;
    },
    async update(leadId: string, body: Partial<LeadCreate>, opts?: RequestOptions) {
      const { data } = await request<Lead>(config, {
        method: 'PATCH',
        path: `/v1/leads/${leadId}`,
        body: body as unknown as Record<string, unknown>,
        requestId: opts?.requestId,
      });
      return data as Lead;
    },
    async delete(leadId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/leads/${leadId}`,
        requestId: opts?.requestId,
      });
    },
    list,
    async assign(leadId: string, partnerId: string, opts?: RequestOptions) {
      const { data } = await request<Lead>(config, {
        method: 'POST',
        path: `/v1/leads/${leadId}/assign`,
        body: { userId: partnerId },
        requestId: opts?.requestId,
      });
      return data as Lead;
    },
    async updateStatus(leadId: string, status: LeadStatus, opts?: RequestOptions) {
      const { data } = await request<Lead>(config, {
        method: 'PUT',
        path: `/v1/leads/${leadId}/status`,
        body: { status },
        requestId: opts?.requestId,
      });
      return data as Lead;
    },
    async addNote(leadId: string, note: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/leads/${leadId}/notes`,
        body: { content: note },
        requestId: opts?.requestId,
      });
      return data;
    },
    async getNotes(leadId: string, opts?: RequestOptions) {
      const { data } = await request<unknown[]>(config, {
        method: 'GET',
        path: `/v1/leads/${leadId}/notes`,
        requestId: opts?.requestId,
      });
      return (Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? []) as unknown[];
    },
    async getTimeline(leadId: string, opts?: RequestOptions) {
      const { data } = await request<unknown[]>(config, {
        method: 'GET',
        path: `/v1/leads/${leadId}/timeline`,
        requestId: opts?.requestId,
      });
      return (Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? []) as unknown[];
    },
    async markConverted(
      leadId: string,
      opts: { dealValue?: number; closedAt?: Date; notes?: string },
      requestOpts?: RequestOptions
    ) {
      const body: Record<string, unknown> = {};
      if (opts.dealValue !== undefined) body.dealValue = opts.dealValue;
      if (opts.closedAt !== undefined) body.closedAt = opts.closedAt instanceof Date ? opts.closedAt.toISOString() : opts.closedAt;
      if (opts.notes !== undefined) body.notes = opts.notes;
      const { data } = await request<Lead>(config, {
        method: 'POST',
        path: `/v1/leads/${leadId}/convert`,
        body,
        requestId: requestOpts?.requestId,
      });
      return data as Lead;
    },
    async bulkCreate(leads: LeadCreate[], opts?: RequestOptions) {
      const { data } = await request<{ data?: Lead[] }>(config, {
        method: 'POST',
        path: '/v1/leads/bulk',
        body: { leads },
        idempotencyKey: opts?.idempotencyKey,
        requestId: opts?.requestId,
      });
      return (data as { data?: Lead[] })?.data ?? (Array.isArray(data) ? data : []);
    },
    async bulkAssign(leadIds: string[], partnerId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: '/v1/leads/bulk/assign',
        body: { leadIds, partnerId },
        requestId: opts?.requestId,
      });
    },
    async bulkUpdateStatus(leadIds: string[], status: LeadStatus, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: '/v1/leads/bulk/status',
        body: { leadIds, status },
        requestId: opts?.requestId,
      });
    },
    async search(q: string, opts?: RequestOptions) {
      const { data } = await request<{ data?: Lead[] }>(config, {
        method: 'GET',
        path: '/v1/search/leads',
        query: { q },
        requestId: opts?.requestId,
      });
      return (data as { data?: Lead[] })?.data ?? (Array.isArray(data) ? data : []);
    },
    async filter(params: { status?: string; source?: string; dateRange?: { from: string; to: string }; assignedTo?: string }, opts?: RequestOptions) {
      const query = buildQuery({
        ...params,
        from: params.dateRange?.from,
        to: params.dateRange?.to,
      } as Record<string, unknown>);
      const { data } = await request<{ data?: Lead[] }>(config, {
        method: 'GET',
        path: '/v1/leads',
        query,
        requestId: opts?.requestId,
      });
      return (data as { data?: Lead[] })?.data ?? (Array.isArray(data) ? data : []);
    },
  };
}
