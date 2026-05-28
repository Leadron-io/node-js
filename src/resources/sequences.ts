/**
 * Sequence (drip/automation) management resource.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';
import type { Sequence, RequestOptions } from '../types.js';

export function createSequencesResource(config: HttpClientConfig) {
  return {
    async create(body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<Sequence>(config, {
        method: 'POST',
        path: '/v1/sequences',
        body,
        requestId: opts?.requestId,
      });
      return data as Sequence;
    },
    async get(sequenceId: string, opts?: RequestOptions) {
      const { data } = await request<Sequence>(config, {
        method: 'GET',
        path: `/v1/sequences/${sequenceId}`,
        requestId: opts?.requestId,
      });
      return data as Sequence;
    },
    async list(opts?: RequestOptions) {
      const { data } = await request<Sequence[]>(config, {
        method: 'GET',
        path: '/v1/sequences',
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async update(sequenceId: string, body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<Sequence>(config, {
        method: 'PUT',
        path: `/v1/sequences/${sequenceId}`,
        body,
        requestId: opts?.requestId,
      });
      return data as Sequence;
    },
    async delete(sequenceId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/sequences/${sequenceId}`,
        requestId: opts?.requestId,
      });
    },
    async activate(sequenceId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/activate`,
        requestId: opts?.requestId,
      });
    },
    async pause(sequenceId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/pause`,
        requestId: opts?.requestId,
      });
    },
    async enrollLead(sequenceId: string, leadId: string, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/enroll`,
        body: { leadId },
        requestId: opts?.requestId,
      });
      return data;
    },
    async enrollBulk(sequenceId: string, leadIds: string[], opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/enroll/bulk`,
        body: { leadIds },
        requestId: opts?.requestId,
      });
    },
    async unenrollLead(sequenceId: string, leadId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/unenroll/${leadId}`,
        requestId: opts?.requestId,
      });
    },
    async getEnrolledLeads(sequenceId: string, opts?: RequestOptions) {
      const { data } = await request<unknown[]>(config, {
        method: 'GET',
        path: `/v1/sequences/${sequenceId}/enrolled`,
        requestId: opts?.requestId,
      });
      return Array.isArray(data) ? data : [];
    },
    async addStep(sequenceId: string, step: { type: 'sms' | 'email' | 'wait'; delay?: Record<string, unknown>; content?: string }, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/steps`,
        body: step,
        requestId: opts?.requestId,
      });
      return data;
    },
    async updateStep(sequenceId: string, stepId: string, body: Record<string, unknown>, opts?: RequestOptions) {
      const { data } = await request<unknown>(config, {
        method: 'PUT',
        path: `/v1/sequences/${sequenceId}/steps/${stepId}`,
        body,
        requestId: opts?.requestId,
      });
      return data;
    },
    async deleteStep(sequenceId: string, stepId: string, opts?: RequestOptions) {
      await request(config, {
        method: 'DELETE',
        path: `/v1/sequences/${sequenceId}/steps/${stepId}`,
        requestId: opts?.requestId,
      });
    },
    async reorderSteps(sequenceId: string, stepOrder: string[], opts?: RequestOptions) {
      await request(config, {
        method: 'POST',
        path: `/v1/sequences/${sequenceId}/steps/reorder`,
        body: { stepOrder },
        requestId: opts?.requestId,
      });
    },
  };
}
