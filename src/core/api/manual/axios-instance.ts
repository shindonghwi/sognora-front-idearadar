/**
 * Axios 인스턴스 (인증 인터셉터 포함)
 *
 * 이 파일은 수동으로 관리됩니다 (make swagger 영향 없음)
 *
 * 401 에러 처리 흐름:
 * 1. refresh token이 있으면 → 토큰 갱신 시도 → 성공 시 원래 요청 재시도
 * 2. refresh token이 없거나 갱신 실패 → 로그아웃 처리
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
import { useAuthStore } from '@/core/stores/auth-store';
import { ProfileStatus } from '@/core/api/generated/types/profile';
import { isDevAccessToken } from '@/components/dev/dev-tools-float-button';

// 환경별 API 설정 (순환 참조 방지를 위해 직접 정의)
const API_CONFIGS = {
  local: { baseUrl: '' }, // Next.js rewrites 프록시 사용
  development: { baseUrl: 'https://dev.api.sognoragroup.com' },
  production: { baseUrl: 'https://api.sognoragroup.com' },
} as const;

type Environment = keyof typeof API_CONFIGS;
const currentEnv = (process.env.NEXT_PUBLIC_ENV || 'production') as Environment;

export const BASE_URL = API_CONFIGS[currentEnv].baseUrl;
export const BRAND_KEY = process.env.NEXT_PUBLIC_BRAND_KEY || '';

if (process.env.NODE_ENV === 'development') {
  console.log('[DEBUG] Axios config:', { currentEnv, BASE_URL, BRAND_KEY });
}

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Brand-Key': BRAND_KEY,
  },
});

// 토큰 리프레시 중복 방지
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

// Request Interceptor: 매 요청마다 토큰 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG] Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        'X-Brand-Key': config.headers['X-Brand-Key'],
        'Authorization': config.headers.Authorization ? 'Bearer ***' : undefined
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 403 휴면 계정 응답 타입
interface AccountStatusErrorResponse {
  statusCode: number;
  message: string;
  accountStatus?: ProfileStatus;
}

// Response Interceptor: 응답 unwrap + 401 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // API 응답이 { statusCode, message, data: {...} } 형태이면 data만 추출
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError<AccountStatusErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 403 에러 + accountStatus 처리 (휴면/차단/승인대기 계정)
    // 새 백엔드: 휴면 계정도 로그인 시 토큰 발급되므로 이 케이스는 드묾
    // 하지만 혹시 다른 API에서 발생할 수 있으므로 유지
    if (error.response?.status === 403 && error.response?.data?.accountStatus) {
      const { accountStatus } = error.response.data;

      // 휴면 페이지에서는 리다이렉트하지 않음 (휴면 해제 API 호출 허용)
      const isDormantPage = typeof window !== 'undefined' && window.location.pathname.includes('/account/dormant');

      if (accountStatus === ProfileStatus.ProfileStatusInactive && !isDormantPage) {
        // 휴면 계정 → 휴면 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
          window.location.href = '/account/dormant';
        }
      }
      // blocked, pending_approval 등 다른 상태는 에러 그대로 반환
      return Promise.reject(error);
    }

    // 401 에러가 아니면 그냥 에러 반환
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 이미 재시도한 요청이면 로그인 모달 표시 후 에러 반환
    if (originalRequest._retry) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // refresh 요청 자체가 실패한 경우 (무한루프 방지)
    if (originalRequest.url?.includes('/auth/refresh')) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // 리프레시 토큰이 없으면 바로 로그인 모달 표시
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    // 이미 리프레시 중이면 큐에 추가
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
      // 토큰 리프레시 요청 (인터셉터 우회를 위해 axios 직접 사용)
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

      // 새 토큰 저장
      setAccessToken(newAccessToken);
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      // 대기 중인 요청들 처리
      processQueue(null, newAccessToken);

      // 원래 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // 리프레시 실패 → 로그인 모달 표시
      processQueue(refreshError, null);
      handleUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * 401 에러 시 로그아웃 처리
 * - 토큰만 삭제하고 상태는 AuthProvider가 자연스럽게 처리하도록 함
 * - 휴면 페이지에서는 처리하지 않음
 * - 개발용 토큰(DEV_ACCESS_TOKEN)에서는 처리하지 않음
 */
function handleUnauthorized() {
  // 개발용 토큰 체크
  const currentToken = getAccessToken();
  if (isDevAccessToken(currentToken)) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] 401 with dev token, skipping logout');
    }
    return;
  }

  // 휴면 페이지에서는 처리하지 않음
  const isDormantPage = typeof window !== 'undefined' &&
    window.location.pathname.includes('/account/dormant');

  if (isDormantPage) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] 401 on dormant page, skipping logout');
    }
    return;
  }

  // 토큰만 삭제 (상태는 건드리지 않음 - 깜빡임 방지)
  // AuthProvider가 다음 렌더링에서 토큰 없음을 감지하고 자연스럽게 로그아웃 처리
  clearTokens();
  clearAccountStatus();

  // 페이지 리로드하여 서버에서 initialAuthState=false로 재계산
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] 401 Unauthorized, redirecting to home');
  }
}
