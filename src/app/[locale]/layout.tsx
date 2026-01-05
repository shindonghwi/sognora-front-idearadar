import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { fontClassNames } from '@/infra/fonts';
import { defaultMetadata } from '@/core/seo/metadata';
import { GoogleOAuthProviderWrapper, AuthProvider, QueryProvider, ThemeProvider } from '@/infra/providers';
import { LayoutClient } from './layout-client';
import { locales } from '@/infra/i18n/config';
import { SognoraThemeScript } from '@sognora/ui/theme/server';
import { auneriThemeLight, auneriThemeDark } from '@/infra/theme/front-theme';
import '../globals.css';

// 기본 메타데이터 export
export const metadata = defaultMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

// FOUC 방지: 테마에서 배경색 추출
const LIGHT_BG = auneriThemeLight.semantic?.surface?.default || '#FFFFFF';
const DARK_BG = auneriThemeDark.semantic?.surface?.base || '#121212';

// FOUC 방지: 인라인 CSS - 모든 외부 CSS보다 먼저 적용
const themeBlockingStyles = `
html,body{background-color:${LIGHT_BG};color-scheme:light}
html[data-theme="auneri-dark"],html[data-theme="auneri-dark"] body{background-color:${DARK_BG}!important;color-scheme:dark}
html[data-theme="auneri-light"],html[data-theme="auneri-light"] body{background-color:${LIGHT_BG}!important;color-scheme:light}
`;

// FOUC 방지: 렌더링 차단 스크립트 - data-theme 속성 즉시 설정
const themeInitScript = `
(function(){
  try{
    var m=localStorage.getItem('theme-mode')||'light';
    document.documentElement.setAttribute('data-theme','auneri-'+m);
  }catch(e){
    document.documentElement.setAttribute('data-theme','auneri-light');
  }
})();
`;

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  // 서버에서 쿠키 체크
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');
  const initialAuthState = !!accessToken?.value;

  // SSR 테마 결정 (쿠키에서 읽기)
  const themeCookie = cookieStore.get('theme-mode');
  const ssrThemeMode = themeCookie?.value === 'dark' ? 'dark' : 'light';
  const ssrDataTheme = `auneri-${ssrThemeMode}`;

  return (
    <html lang={locale} className={fontClassNames} data-theme={ssrDataTheme} suppressHydrationWarning>
      <head>
        {/* FOUC 방지 1: 인라인 CSS (가장 먼저 로드) */}
        <style dangerouslySetInnerHTML={{ __html: themeBlockingStyles }} />
        {/* FOUC 방지 2: 테마 속성 즉시 설정 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* SSR Theme CSS injection */}
        <SognoraThemeScript
          themeName="auneri"
          defaultMode="light"
          lightConfig={auneriThemeLight}
          darkConfig={auneriThemeDark}
          storageKey="theme-mode"
        />
      </head>
      <body style={{ backgroundColor: ssrThemeMode === 'dark' ? DARK_BG : LIGHT_BG }} suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <GoogleOAuthProviderWrapper>
              <NextIntlClientProvider locale={locale} messages={messages}>
                <AuthProvider initialAuthState={initialAuthState}>
                  <LayoutClient>{children}</LayoutClient>
                </AuthProvider>
              </NextIntlClientProvider>
            </GoogleOAuthProviderWrapper>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
