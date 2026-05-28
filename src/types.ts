/**
 * Shared types for Leadron API resources and responses.
 */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type CommissionType = 'flat' | 'percentage';
export type CommissionStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type PaymentMethod = 'platform' | 'external';

export interface Lead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  source?: string;
  status: LeadStatus;
  score?: number;
  assignedTo?: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface LeadCreate {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  source?: string;
  status?: LeadStatus;
  score?: number;
  customFields?: Record<string, unknown>;
}

export interface Partner {
  id: string;
  email: string;
  name?: string;
  status?: string;
  tier?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  partnerId: string;
  leadId: string;
  amount: number;
  type: CommissionType;
  status: CommissionStatus;
  createdAt: string;
  paidAt?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  createdAt?: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface Sequence {
  id: string;
  name?: string;
  status?: string;
  steps?: unknown[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DateRangeParams {
  from?: string;
  to?: string;
  dateRange?: { from: string; to: string };
}

export interface RequestOptions {
  requestId?: string;
  idempotencyKey?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  pagination?: Pagination;
  message?: string;
  meta?: Record<string, unknown>;
}
