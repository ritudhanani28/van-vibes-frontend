import { envConfig } from '@/config/env';

export const FASTAPI_BACKEND_URL = envConfig.getFastApiBackendUrl();

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
