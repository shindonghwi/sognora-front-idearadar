import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

// Locale 유효성 검증 (정규식 안전성 보장)
const VALID_LOCALE_PATTERN = /^[a-z]{2}$/;
const invalidLocales = locales.filter((loc) => !VALID_LOCALE_PATTERN.test(loc));
if (invalidLocales.length > 0) {
  throw new Error(`Invalid locale format detected: ${invalidLocales.join(', ')}. Locales must be 2-letter lowercase codes.`);
}

// 단일 언어 여부 확인
export const isSingleLocale = (locales.length as number) === 1;

// 다국어 지원 설정
// - 단일 언어: localePrefix 'never' (prefix 없이 / 만 사용)
// - 다국어: localePrefix 'always' (/ko, /en 같은 prefix 사용)
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: isSingleLocale ? 'never' : 'always',
});

// 로케일 패턴 export (middleware에서 사용)
// 단일 언어일 때는 빈 패턴, 다국어일 때는 전체 locale 패턴
export const LOCALE_PATTERN = isSingleLocale ? '' : `(${locales.join('|')})`;
export const LOCALE_REGEX = isSingleLocale ? /^$/ : new RegExp(`^\\/(${locales.join('|')})`);

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);