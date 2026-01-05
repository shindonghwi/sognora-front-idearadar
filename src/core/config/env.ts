/**
 * 환경 설정
 *
 * NEXT_PUBLIC_ENV 환경 변수에 따라 API URL과 기타 설정을 결정합니다.
 */

export type Environment = 'local' | 'dev' | 'prod';

export const ENV = (process.env.NEXT_PUBLIC_ENV || 'local') as Environment;

/**
 * 환경별 API Base URL
 */
const API_BASE_URLS: Record<Environment, string> = {
  local: 'http://localhost:8080/api/v1',
  dev: 'https://dev.api.sognoragroup.com/api/v1',
  prod: 'https://api.sognoragroup.com/api/v1',
};

/**
 * 현재 환경의 API Base URL
 */
export const API_BASE_URL = API_BASE_URLS[ENV];

/**
 * 브랜드 키
 */
export const BRAND_KEY = process.env.NEXT_PUBLIC_BRAND_KEY;

/**
 * 사이트 URL
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * Google OAuth Client ID
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * 환경 설정 객체
 */
export const config = {
  env: ENV,
  apiBaseUrl: API_BASE_URL,
  brandKey: BRAND_KEY,
  siteUrl: SITE_URL,
  googleClientId: GOOGLE_CLIENT_ID,
  isDevelopment: ENV === 'dev',
  isProduction: ENV === 'prod',
  isLocal: ENV === 'local',
} as const;

export default config;
