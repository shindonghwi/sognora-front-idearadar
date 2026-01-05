import { getRequestConfig } from 'next-intl/server';
import { loadMessages, isValidLocale } from './utils';
import { defaultLocale } from './config';
import type { Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // locale이 없거나 유효하지 않으면 기본값 사용
  const validLocale = locale && isValidLocale(locale) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: await loadMessages(validLocale as Locale)
  };
});