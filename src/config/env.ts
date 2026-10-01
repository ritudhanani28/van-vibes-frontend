/**
 * Centralized Environment Configuration for Van Vibes Customer Frontend
 * Single Source of Truth for API, WebSocket, Backend URLs, and Port Settings.
 */

export const envConfig = {
  // Application Port
  port: parseInt(process.env.PORT || '3000', 10),

  // Environment mode
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',

  /**
   * Resolves the server-side FastAPI backend URL (used by Next.js Server Route Handlers).
   */
  getFastApiBackendUrl(): string {
    const envUrl = process.env.FASTAPI_BACKEND_URL;
    if (envUrl && envUrl.trim()) {
      return envUrl.trim().replace(/\/+$/, '');
    }
    return 'http://127.0.0.1:8000';
  },

  /**
   * Resolves the public REST API base URL.
   */
  getApiBaseUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.trim()) {
      let resolved = envUrl.trim();
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && resolved.startsWith('http://')) {
        resolved = resolved.replace(/^http:\/\//, 'https://');
      }
      return resolved.replace(/\/+$/, '');
    }

    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
    }

    return 'http://127.0.0.1:8000/api/v1';
  },

  /**
   * Dynamically resolves the live WebSocket Stream URL.
   * - Automatically selects wss:// on https: and ws:// on http:
   * - Dynamically falls back to current hostname
   */
  getWebSocketUrl(): string {
    const envWsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (envWsUrl && envWsUrl.trim()) {
      let baseWsUrl = envWsUrl.trim();
      if (
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:' &&
        baseWsUrl.startsWith('ws://')
      ) {
        baseWsUrl = baseWsUrl.replace(/^ws:\/\//, 'wss://');
      }
      return baseWsUrl;
    }

    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const hostname = window.location.hostname || '127.0.0.1';
      return `${protocol}//${hostname}:8000/api/v1/ws/orders`;
    }

    return 'ws://127.0.0.1:8000/api/v1/ws/orders';
  },

  /**
   * Resolves public customer app URL for metadata, SEO, and share links.
   */
  getPublicAppUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (envUrl && envUrl.trim()) {
      return envUrl.trim().replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  },
};
