import { useState, useEffect } from 'react';
import { mediaQueries } from './breakpoints';

/**
 * 미디어 쿼리 훅
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // 초기값 설정
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(media.matches);

    // 변경 감지
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    media.addEventListener('change', listener);

    // 클린업
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * 반응형 브레이크포인트 훅
 *
 * 모든 컴포넌트에서 일관된 브레이크포인트를 사용하도록 보장합니다.
 * variables.css와 동기화된 브레이크포인트를 제공합니다.
 *
 * @returns 현재 화면 크기에 대한 플래그
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useResponsive();
 *
 * return (
 *   <div className={isMobile ? 'p-4' : 'p-8'}>
 *     {isMobile ? <MobileView /> : <DesktopView />}
 *   </div>
 * );
 * ```
 */
export function useResponsive() {
  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);

  return {
    /** 모바일 화면 (≤768px) */
    isMobile,
    /** 태블릿 화면 (≤1024px) */
    isTablet,
    /** 데스크톱 화면 (≥1025px) */
    isDesktop,
    /** 모바일 또는 태블릿 (≤1024px) */
    isMobileOrTablet: isMobile || isTablet,
  };
}
