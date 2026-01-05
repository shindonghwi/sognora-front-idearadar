import { Locale, locales, defaultLocale } from './config';

// 메시지 로드
export async function loadMessages(locale: Locale) {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // 기본 언어로 폴백
    const defaultMessages = await import(`../../../messages/${defaultLocale}.json`);
    return defaultMessages.default;
  }
}

// 로케일 검증
export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

// 경로에서 로케일 추출
export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  return isValidLocale(maybeLocale) ? maybeLocale : null;
}

// 로케일별 날짜 포맷
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

// 로케일별 통화 포맷
export function formatCurrency(amount: number, locale: Locale, currency?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || getCurrencyForLocale(locale)
  }).format(amount);
}

// 로케일 통화 반환
function getCurrencyForLocale(locale: Locale): string {
  const currencies: Record<string, string> = {
    ko: 'KRW',
    en: 'USD',
    es: 'EUR',
    pt: 'BRL',
    fr: 'EUR',
    de: 'EUR',
    it: 'EUR',
    ar: 'SAR',
    zh: 'CNY',
    ja: 'JPY',
    hi: 'INR',
    id: 'IDR',
    th: 'THB',
  };
  return currencies[locale] || 'KRW';
}