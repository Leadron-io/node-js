/**
 * HTTP client with retry, API key auth, and optional idempotency/request ID.
 */

import {
  LeadronError,
  LeadronAuthError,
  LeadronValidationError,
  LeadronRateLimitError,
} from './errors.js';

const DEFAULT_BASE_URL = 'https://api.leadron.io';
const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export interface HttpClientConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  /** Optional ref to store last X-RateLimit-Remaining from response headers */
  rateLimitRef?: { current?: number };
}

export interface RequestConfig {
  method: string;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  requestId?: string;
  idempotencyKey?: string;
}

function buildUrl(base: string, path: string, query?: Record<string, string | number | undefined>): string {
  const url = new URL(path.startsWith('http') ? path : `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

function isRetryable(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function request<T>(
  config: HttpClientConfig,
  req: RequestConfig
): Promise<{ data: T; pagination?: unknown; rateLimitRemaining?: number }> {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  const maxRetries = config.maxRetries ?? DEFAULT_RETRIES;
  const url = buildUrl(baseUrl, req.path, req.query);

  const headers: Record<string, string> = {
    'X-API-Key': config.apiKey,
    'Content-Type': 'application/json',
  };
  if (req.requestId) headers['X-Request-Id'] = req.requestId;
  if (req.idempotencyKey) headers['Idempotency-Key'] = req.idempotencyKey;

  let lastError: LeadronError | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: req.method,
        headers,
        body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
      });

      const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining')
        ? parseInt(res.headers.get('X-RateLimit-Remaining')!, 10)
        : undefined;

      let body: unknown;
      const text = await res.text();
      try {
        body = text ? JSON.parse(text) : undefined;
      } catch {
        body = text;
      }

      if (res.ok) {
        const b = body as { data?: T; pagination?: unknown };
        if (config.rateLimitRef && rateLimitRemaining !== undefined) config.rateLimitRef.current = rateLimitRemaining;
        return {
          data: b.data ?? (body as T),
          pagination: b.pagination,
          rateLimitRemaining,
        } as { data: T; pagination?: unknown; rateLimitRemaining?: number };
      }

      const message = (body as { message?: string })?.message ?? res.statusText ?? `HTTP ${res.status}`;

      if (res.status === 401) throw new LeadronAuthError(message, res.status, body);
      if (res.status === 422) throw new LeadronValidationError(message, res.status, body);
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After')
          ? parseInt(res.headers.get('Retry-After')!, 10)
          : RETRY_DELAY_MS;
        lastError = new LeadronRateLimitError(message, retryAfter, res.status, body);
        if (attempt < maxRetries) {
          await sleep(retryAfter * 1000);
          continue;
        }
        throw lastError;
      }
      if (isRetryable(res.status) && attempt < maxRetries) {
        lastError = new LeadronError(message, res.status, undefined, body);
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      throw new LeadronError(message, res.status, undefined, body);
    } catch (e) {
      if (e instanceof LeadronError && !isRetryable(e.statusCode ?? 0)) throw e;
      if (e instanceof LeadronAuthError || e instanceof LeadronValidationError) throw e;
      lastError = e instanceof LeadronError ? e : new LeadronError(String(e));
      if (attempt === maxRetries) throw lastError;
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }
  throw lastError ?? new LeadronError('Request failed');
}
