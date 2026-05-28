/**
 * Authentication and API key helpers. Webhook signature verification is client-side only.
 */

import type { HttpClientConfig } from '../http.js';
import { request } from '../http.js';

export interface AuthResource {
  validate(): Promise<{ valid: boolean }>;
  getScopes(): Promise<{ scopes: string[] }>;
  verifyWebhookSignature(payload: string | Uint8Array, signature: string, secret: string): Promise<boolean>;
}

async function hmacSha256Hex(secret: string, payload: string | Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = typeof payload === 'string' ? encoder.encode(payload) : payload;
  const key = await crypto.subtle.importKey('raw', keyData as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, msgData as BufferSource);
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function createAuthResource(config: HttpClientConfig): AuthResource {
  return {
    async validate() {
      const { data } = await request<{ valid?: boolean }>(config, {
        method: 'GET',
        path: '/v1/api-keys/validate',
      });
      return { valid: (data as { valid?: boolean })?.valid ?? true };
    },

    async getScopes() {
      const { data } = await request<{ scopes?: string[] }>(config, {
        method: 'GET',
        path: '/v1/api-keys/scopes',
      });
      return { scopes: (data as { scopes?: string[] })?.scopes ?? [] };
    },

    async verifyWebhookSignature(payload: string | Uint8Array, signature: string, secret: string): Promise<boolean> {
      const payloadStr = typeof payload === 'string' ? payload : new TextDecoder().decode(payload);
      const expected = await hmacSha256Hex(secret, payloadStr);
      return expected === signature || `sha256=${expected}` === signature;
    },
  };
}
