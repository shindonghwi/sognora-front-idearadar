// i18n 설정 - 여기만 수정하면 전체 프로젝트에 반영됨
export const locales = ['ko', 'en', 'ja'] as const;
export const defaultLocale = 'ko' as const;

export type Locale = (typeof locales)[number];

// 로케일 메타데이터
export const localeMetadata = {
  en: { name: 'English', flag: '🇺🇸', direction: 'ltr' },
  es: { name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  pt: { name: 'Português', flag: '🇧🇷', direction: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  de: { name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  it: { name: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  zh: { name: '简体中文', flag: '🇨🇳', direction: 'ltr' },
  ja: { name: '日本語', flag: '🇯🇵', direction: 'ltr' },
  ko: { name: '한국어', flag: '🇰🇷', direction: 'ltr' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' },
  id: { name: 'Bahasa Indonesia', flag: '🇮🇩', direction: 'ltr' },
  th: { name: 'ไทย', flag: '🇹🇭', direction: 'ltr' },
} as const;

// 로케일별 통화
export const localeCurrencies = {
  en: 'USD',
  es: 'EUR',
  pt: 'BRL',
  fr: 'EUR',
  de: 'EUR',
  it: 'EUR',
  ar: 'SAR',
  zh: 'CNY',
  ja: 'JPY',
  ko: 'KRW',
  hi: 'INR',
  id: 'IDR',
  th: 'THB',
} as const;

// 날짜 형식
export const localeDateFormats = {
  en: 'MM/DD/YYYY',
  es: 'DD/MM/YYYY',
  pt: 'DD/MM/YYYY',
  fr: 'DD/MM/YYYY',
  de: 'DD.MM.YYYY',
  it: 'DD/MM/YYYY',
  ar: 'DD/MM/YYYY',
  zh: 'YYYY年MM月DD日',
  ja: 'YYYY年MM月DD日',
  ko: 'YYYY년 MM월 DD일',
  hi: 'DD/MM/YYYY',
  id: 'DD/MM/YYYY',
  th: 'DD/MM/YYYY',
} as const;