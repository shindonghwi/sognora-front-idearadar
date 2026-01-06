import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { fontClassNames } from '@/infra/fonts';
import { defaultMetadata } from '@/core/seo/metadata';
import { AuthProvider, QueryProvider, ThemeProvider } from '@/infra/providers';
import { LayoutClient } from './layout-client';
import { locales } from '@/infra/i18n/config';
import { SognoraThemeScript } from '@sognora/ui/theme/server';
import { appThemeLight, appThemeDark } from '@/infra/theme/front-theme';
import '../globals.css';

// 기본 메타데이터 export
export const metadata = defaultMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

// FOUC prevention: extract background colors from theme
const LIGHT_BG = appThemeLight.semantic?.surface?.default || '#FFFFFF';
const DARK_BG = appThemeDark.semantic?.surface?.base || '#121212';

// FOUC prevention: inline CSS - loads before all external CSS
const themeBlockingStyles = `
html,body{background-color:${LIGHT_BG};color-scheme:light}
html[data-theme="app-dark"],html[data-theme="app-dark"] body{background-color:${DARK_BG}!important;color-scheme:dark}
html[data-theme="app-light"],html[data-theme="app-light"] body{background-color:${LIGHT_BG}!important;color-scheme:light}
`;

// FOUC prevention: render-blocking script - set data-theme attribute immediately
const themeInitScript = `
(function(){
  try{
    var m=localStorage.getItem('theme-mode')||'light';
    document.documentElement.setAttribute('data-theme','app-'+m);
  }catch(e){
    document.documentElement.setAttribute('data-theme','app-light');
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

  // SSR theme decision (read from cookie)
  const themeCookie = cookieStore.get('theme-mode');
  const ssrThemeMode = themeCookie?.value === 'dark' ? 'dark' : 'light';
  const ssrDataTheme = `app-${ssrThemeMode}`;

  return (
    <html lang={locale} className={fontClassNames} data-theme={ssrDataTheme} suppressHydrationWarning>
      <head>
        {/* FOUC 방지 1: 인라인 CSS (가장 먼저 로드) */}
        <style dangerouslySetInnerHTML={{ __html: themeBlockingStyles }} />
        {/* FOUC 방지 2: 테마 속성 즉시 설정 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* SSR Theme CSS injection */}
        <SognoraThemeScript
          themeName="app"
          defaultMode="light"
          lightConfig={appThemeLight}
          darkConfig={appThemeDark}
          storageKey="theme-mode"
        />
      </head>
      <body style={{ backgroundColor: ssrThemeMode === 'dark' ? DARK_BG : LIGHT_BG }} suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AuthProvider initialAuthState={initialAuthState}>
                <LayoutClient>{children}</LayoutClient>
              </AuthProvider>
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
