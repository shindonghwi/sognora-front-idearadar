'use client';

import { SognoraThemeProvider } from '@sognora/ui/theme/client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { appThemeDark, appThemeLight } from '../theme/front-theme';

type ThemeMode = 'light' | 'dark' | 'system';

// 자체 Theme Context (라이브러리 타입 정의 누락 대응)
interface ThemeContextValue {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Theme Provider (App)
 *
 * ✅ Light mode default
 * ✅ Save mode to localStorage
 * ✅ System preference support
 * ✅ New API (themeName, mode, setMode, lightConfig, darkConfig)
 * ✅ FOUC prevention (CSS variables defined in globals.css)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // setMode wrapper - localStorage + 쿠키 저장 + data-theme 업데이트
  const setMode = useCallback((newMode: 'light' | 'dark') => {
    setModeState(newMode);

    // localStorage에 저장
    localStorage.setItem('theme-mode', newMode);

    // 쿠키에도 저장 (SSR에서 읽기 위해) - 1년 유효
    document.cookie = `theme-mode=${newMode};path=/;max-age=31536000;SameSite=Lax`;

    // data-theme 업데이트
    document.documentElement.setAttribute('data-theme', `app-${newMode}`);
  }, []);

  // 클라이언트 사이드에서만 실행 (SSR 방지)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // localStorage에서 저장된 테마 복원 (기본값: light)
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
    const targetMode: ThemeMode = savedMode || 'light';

    setModeState(targetMode);
    document.documentElement.setAttribute('data-theme', `app-${targetMode}`);
  }, []);

  // System preference 변경 감지
  useEffect(() => {
    if (!mounted || mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const effectiveMode = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', `app-${effectiveMode}`);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, mode]);

  // Effective mode 계산 (system인 경우 실제 모드로 변환)
  const effectiveMode: 'light' | 'dark' = mode === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    : mode;

  return (
    <ThemeContext.Provider value={{ mode: effectiveMode, setMode }}>
      <SognoraThemeProvider
        themeName="app"
        mode={effectiveMode}
        setMode={setMode}
        lightConfig={appThemeLight}
        darkConfig={appThemeDark}
      >
        {children}
      </SognoraThemeProvider>
    </ThemeContext.Provider>
  );
}
