/**
 * 인증 미들웨어
 *
 * 책임:
 * - 보호된 라우트 접근 시 인증 확인
 * - 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
 * - 로그인 후 원래 페이지로 돌아가기 위한 returnUrl 저장
 * - 휴면 계정(inactive) 접근 제어
 */

import { NextRequest, NextResponse } from 'next/server';
import { ROUTES, ROUTE_CONFIG } from '@/core/routes';
import { locales } from '@/infra/i18n/config';

// 휴면 상태 값 (ProfileStatus.ProfileStatusInactive)
const INACTIVE_STATUS = 'inactive';

// 휴면 계정이 접근 가능한 경로
const DORMANT_ALLOWED_PATHS = ['/account/dormant'];

// locale prefix 제거용 정규식 (예: /ko/saju -> /saju)
const LOCALE_PREFIX_REGEX = new RegExp(`^\\/(${locales.join('|')})`);

/**
 * 인증 미들웨어
 */
export async function authMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // locale prefix 제거 (항상 제거 - App Router의 [locale] 폴더 구조 대응)
  // 예: /ko/my/profile -> /my/profile
  const pathnameWithoutLocale = pathname.replace(LOCALE_PREFIX_REGEX, '');

  // 쿠키에서 access_token과 account_status 확인
  const accessToken = request.cookies.get('access_token')?.value;
  const accountStatus = request.cookies.get('account_status')?.value;

  // 휴면 계정 접근 제어 (토큰이 있는 경우에만 체크, 모든 라우트에서 체크)
  if (accessToken && accountStatus === INACTIVE_STATUS) {
    // 휴면 계정이 허용된 경로인지 확인
    const isDormantAllowedPath = DORMANT_ALLOWED_PATHS.some((path) =>
      pathnameWithoutLocale.startsWith(path)
    );

    // 휴면 페이지가 아닌 곳에 접근하려고 하면 휴면 페이지로 리다이렉트
    if (!isDormantAllowedPath) {
      const dormantUrl = new URL('/account/dormant', request.url);
      return NextResponse.redirect(dormantUrl);
    }

    // 휴면 계정이 허용된 경로에 접근하면 통과
    return null;
  }

  // 활성 계정이 휴면 페이지에 접근하면 홈으로 리다이렉트
  if (accessToken && pathnameWithoutLocale.startsWith('/account/dormant')) {
    const homeUrl = new URL(ROUTES.HOME, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 보호된 라우트인지 확인
  const isProtected = ROUTE_CONFIG.protected.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // public 라우트면 통과
  if (!isProtected) {
    return null;
  }

  // 토큰이 없으면 홈으로 리다이렉트 (로그인 모달로 처리)
  if (!accessToken) {
    const homeUrl = new URL(ROUTES.HOME, request.url);

    // 로그인 후 돌아올 URL 저장 (locale 포함된 전체 경로)
    homeUrl.searchParams.set('returnUrl', pathname);

    return NextResponse.redirect(homeUrl);
  }

  // TODO: 토큰 유효성 검증 (JWT 검증, 만료 확인 등)
  // 현재는 토큰 존재 여부만 확인

  // 인증 통과
  return null;
}
