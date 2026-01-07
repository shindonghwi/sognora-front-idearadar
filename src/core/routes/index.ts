/**
 * 애플리케이션 라우트 상수
 *
 * - 모든 경로를 중앙에서 관리
 * - 타입 안전성 보장
 * - 미들웨어, 컴포넌트에서 공통 사용
 */

/**
 * 기본 라우트
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',

  // Protected routes - Ideas
  IDEAS: '/ideas',
  REPORTS: '/reports',
  ONBOARDING: '/onboarding',

  // Protected routes (account/* 페이지)
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_LIBRARY: '/account/library',
  ACCOUNT_SETTINGS: '/account/settings',
  ACCOUNT_DORMANT: '/account/dormant',
  ACCOUNT_WITHDRAWAL: '/account/withdrawal',

  // Legacy routes (호환성 유지)
  MY_PROFILE: '/my/profile',
  MY_PURCHASES: '/my/purchases',
  LIBRARY: '/library',
  PAYMENT: '/payment',
} as const;

/**
 * Route 타입 - Next.js Link href와 호환
 */
export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * 동적 라우트 생성 함수
 */
export const DYNAMIC_ROUTES = {
  IDEA_DETAIL: (id: string) => `/ideas/${id}` as const,
};

/**
 * 라우트 설정 (인증, 권한 등)
 */
export const ROUTE_CONFIG = {
  /** 인증이 필요한 경로 */
  protected: [
    '/account',
    ROUTES.IDEAS,
    ROUTES.REPORTS,
    ROUTES.ONBOARDING,
    ROUTES.MY_PROFILE,
    ROUTES.MY_PURCHASES,
    ROUTES.LIBRARY,
    ROUTES.PAYMENT,
  ] as const,

  /** 인증 없이 접근 가능한 경로 */
  public: [
    ROUTES.HOME,
    ROUTES.PRICING,
  ] as const,
} as const;

/**
 * 타입 추출
 */
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
export type ProtectedRoute = (typeof ROUTE_CONFIG.protected)[number];
export type PublicRoute = (typeof ROUTE_CONFIG.public)[number];

/**
 * 라우트 검증 유틸리티
 */
export function isValidRoute(path: string): path is Route {
  return (Object.values(ROUTES) as string[]).includes(path);
}

/**
 * 라우트가 보호된 라우트인지 확인
 */
export function isProtectedRoute(path: string): boolean {
  return ROUTE_CONFIG.protected.includes(path as ProtectedRoute);
}