/**
 * 반응형 브레이크포인트 상수
 *
 * variables.css의 --breakpoint-* 값과 동기화 필요
 * 모든 컴포넌트에서 일관된 브레이크포인트를 사용하도록 보장합니다.
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

/**
 * 미디어쿼리 문자열
 *
 * useMediaQuery 훅에서 직접 사용 가능
 */
export const mediaQueries = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(max-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.tablet + 1}px)`,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
