export const FASTAPI_BACKEND_URL =
  process.env.FASTAPI_BACKEND_URL || 'http://127.0.0.1:8000';

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const url = `${FASTAPI_BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
}
