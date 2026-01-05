// i18n 중앙 설정
export * from './config';
export * from './utils';

// 하위 호환성
import { locales, defaultLocale } from './config';
export const i18nConfig = {
  locales,
  defaultLocale,
} as const;