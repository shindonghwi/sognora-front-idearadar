/**
 * 폰트 설정
 * Next.js next/font를 사용한 최적화된 폰트 로딩
 */

import localFont from 'next/font/local';

/**
 * Manrope - 본문/UI용 Sans-serif
 * Variable font (100-900 weight)
 */
export const manrope = localFont({
  src: '../../../public/fonts/manrope.ttf',
  variable: '--font-manrope',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

/**
 * Noto Sans - 다국어 폴백 (한글, 중국어, 태국어, 힌디어)
 * Variable font (100-900 weight)
 */
export const notoSans = localFont({
  src: '../../../public/fonts/notosans.ttf',
  variable: '--font-noto-sans',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

/**
 * 통합 폰트 클래스
 * HTML 태그에 적용하여 CSS 변수로 사용 가능
 *
 * @example
 * <html className={fontClassNames}>
 *   <body className="font-manrope">...</body>
 * </html>
 */
export const fontClassNames = `${manrope.variable} ${notoSans.variable}`;
