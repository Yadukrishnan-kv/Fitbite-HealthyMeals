/**
 * Thin fetch wrapper for the PUBLIC API (no auth required).
 * Mirrors the admin client's error shape so callers can rely on ApiError.
 * GET requests read published content; POST is used for the enquiry form.
 */
const BASE = '/api';

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(method, path, { body } = {}) {
  const opts = { method, headers: {} };

  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, opts);
  } catch {
    throw new ApiError('Network error — is the server running?', 0);
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.details);
  }
  return data;
}

export const publicApi = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, { body }),
};

/** Build a query string from an object, skipping empty values. */
export function qs(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.append(k, v);
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export default publicApi;
