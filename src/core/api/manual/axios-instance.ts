/**
 * Axios Instance (with auth interceptors)
 *
 * This file is manually managed (not affected by make swagger)
 *
 * 401 error handling flow:
 * 1. If refresh token exists -> try token refresh -> retry original request on success
 * 2. If no refresh token or refresh fails -> logout
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  clearAccountStatus,
} from '@/core/utils/token';
import { ProfileStatus } from '@/core/stores/auth-store';

// Environment-specific API config
const API_CONFIGS = {
  local: { baseUrl: '' }, // Uses Next.js rewrites proxy
  development: { baseUrl: 'https://dev.api.example.com' },
  production: { baseUrl: 'https://api.example.com' },
} as const;

type Environment = keyof typeof API_CONFIGS;
const currentEnv = (process.env.NEXT_PUBLIC_ENV || 'production') as Environment;

export const BASE_URL = API_CONFIGS[currentEnv].baseUrl;
export const BRAND_KEY = process.env.NEXT_PUBLIC_BRAND_KEY || '';

if (process.env.NODE_ENV === 'development') {
  console.log('[DEBUG] Axios config:', { currentEnv, BASE_URL, BRAND_KEY });
}

// Create Axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Brand-Key': BRAND_KEY,
  },
});

// Token refresh queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 403 dormant account response type
interface AccountStatusErrorResponse {
  statusCode: number;
  message: string;
  accountStatus?: string;
}

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError<AccountStatusErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 403 with accountStatus
    if (error.response?.status === 403 && error.response?.data?.accountStatus) {
      const { accountStatus } = error.response.data;
      const isDormantPage = typeof window !== 'undefined' && window.location.pathname.includes('/account/dormant');

      if (accountStatus === ProfileStatus.ProfileStatusInactive && !isDormantPage) {
        if (typeof window !== 'undefined') {
          window.location.href = '/account/dormant';
        }
      }
      return Promise.reject(error);
    }

    // Non-401 errors pass through
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried
    if (originalRequest._retry) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // Refresh request itself failed
    if (originalRequest.url?.includes('/auth/refresh')) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // No refresh token
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // Already refreshing - queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject: (err: unknown) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Brand-Key': BRAND_KEY,
          },
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

      setAccessToken(newAccessToken);
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Handle 401 unauthorized - clear tokens and redirect
 */
function handleUnauthorized() {
  clearTokens();
  clearAccountStatus();

  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}
