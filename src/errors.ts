/**
 * Leadron API errors.
 */

export class LeadronError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'LeadronError';
    Object.setPrototypeOf(this, LeadronError.prototype);
  }
}

export class LeadronAuthError extends LeadronError {
  constructor(message: string, statusCode?: number, body?: unknown) {
    super(message, statusCode, 'auth_error', body);
    this.name = 'LeadronAuthError';
  }
}

export class LeadronValidationError extends LeadronError {
  constructor(message: string, statusCode?: number, body?: unknown) {
    super(message, statusCode, 'validation_error', body);
    this.name = 'LeadronValidationError';
  }
}

export class LeadronRateLimitError extends LeadronError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    statusCode?: number,
    body?: unknown
  ) {
    super(message, statusCode, 'rate_limit_error', body);
    this.name = 'LeadronRateLimitError';
  }
}
