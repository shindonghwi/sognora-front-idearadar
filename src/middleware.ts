import { LOCALE_PATTERN, isSingleLocale } from '@/infra/i18n/routing';
import { authMiddleware } from '@/infra/middleware/auth';
import { localeMiddleware } from '@/infra/middleware/locale';
import { NextRequest, NextResponse } from 'next/server';

// 미들웨어 합성
export default async function middleware(request: NextRequest) {
  // 정적 파일 (fonts, images, animations, videos)은 미들웨어 처리 건너뛰기
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/fonts/') || pathname.startsWith('/images/') || pathname.startsWith('/animations/') || pathname.startsWith('/videos/')) {
    return NextResponse.next();
  }

  // 다국어 지원일 때만 locale prefix가 붙은 정적 파일 요청 처리
  if (!isSingleLocale && LOCALE_PATTERN) {
    const localePattern = new RegExp(`^\\/${LOCALE_PATTERN}\\/(fonts|images|animations|videos)\\/`);
    const match = pathname.match(localePattern);
    if (match) {
      const newPath = pathname.replace(`/${match[1]}/`, '/');
      return NextResponse.rewrite(new URL(newPath, request.url));
    }
  }

  // 1. auth 미들웨어 먼저 실행 (리다이렉트 필요 시 바로 반환)
  const authResponse = await authMiddleware(request);
  if (authResponse) {
    return authResponse;
  }

  // 2. locale 미들웨어 실행 (항상 응답 반환)
  return localeMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    // API, static 파일, images, fonts, animations, videos 제외
    '/((?!api|_next/static|_next/image|favicon.ico|images/|fonts/|animations/|videos/).*)',
  ],
};