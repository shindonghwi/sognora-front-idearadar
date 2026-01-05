'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/core/stores';
import { setAccessToken, setAccountStatus, clearTokens, clearAccountStatus } from '@/core/utils/token';
import { ProfileStatus } from '@/core/api/generated/types/profile';
import type { ProfileRO } from '@/core/api/generated/ro/profile';
import styles from './dev-tools-float-button.module.css';

// 개발용 더미 프로필
const DEV_PROFILE: ProfileRO = {
  idx: 999999,
  email: 'dev@example.com',
  status: ProfileStatus.ProfileStatusActive,
  authProvider: 'kakao',
  createdAt: new Date().toISOString(),
};

// 개발용 더미 토큰 - AuthProvider에서도 사용할 수 있도록 export
export const DEV_ACCESS_TOKEN = 'dev-access-token-for-testing';

/**
 * 쿠키에서 직접 access_token 읽기 (SSR 안전)
 */
function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * 개발용 토큰인지 확인
 */
export function isDevAccessToken(token: string | null | undefined): boolean {
  return token === DEV_ACCESS_TOKEN;
}

/**
 * DevToolsFloatButton
 *
 * 개발용 플로팅 버튼
 * - 로그인/로그아웃 상태 토글
 * - 쿠키 설정으로 미들웨어도 우회
 * - 페이지 로드 시 쿠키에서 상태 복원
 */
export function DevToolsFloatButton() {
  const { isAuthenticated, login, logout, setProfile } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [cookieToken, setCookieToken] = useState<string | null>(null);

  // 마운트 확인 및 쿠키 읽기
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const token = getTokenFromCookie();
    setCookieToken(token);
  }, []);

  // 개발용 토큰이 있으면 Zustand 상태 복원 (한 번만 실행)
  useEffect(() => {
    if (!mounted) return;

    const isDevToken = cookieToken === DEV_ACCESS_TOKEN;
    if (isDevToken && !isAuthenticated) {
      login(ProfileStatus.ProfileStatusActive);
      setProfile(DEV_PROFILE);
    }
  }, [mounted, cookieToken, isAuthenticated, login, setProfile]);

  const handleAuthToggle = useCallback(() => {
    const currentToken = getTokenFromCookie();
    const isCurrentlyLoggedIn = currentToken === DEV_ACCESS_TOKEN || isAuthenticated;

    if (isCurrentlyLoggedIn) {
      // 로그아웃
      clearTokens();
      clearAccountStatus();
      logout();
      setCookieToken(null);
      // 보호된 페이지에 있으면 홈으로 이동
      if (window.location.pathname.includes('/my/')) {
        window.location.href = '/';
      }
    } else {
      // 로그인
      setAccessToken(DEV_ACCESS_TOKEN);
      setAccountStatus(ProfileStatus.ProfileStatusActive);
      login(ProfileStatus.ProfileStatusActive);
      setProfile(DEV_PROFILE);
      setCookieToken(DEV_ACCESS_TOKEN);
    }
  }, [isAuthenticated, login, logout, setProfile]);

  // SSR 중에는 렌더링하지 않음 (hydration mismatch 방지)
  if (!mounted) {
    return null;
  }

  // 버튼 상태: 쿠키에 dev 토큰이 있거나 Zustand에서 인증됨
  const isLoggedIn = cookieToken === DEV_ACCESS_TOKEN || isAuthenticated;

  return (
    <button
      className={styles.floatButton}
      onClick={handleAuthToggle}
      title={isLoggedIn ? '로그아웃으로 전환' : '로그인으로 전환'}
    >
      {isLoggedIn ? '🔓' : '🔒'}
    </button>
  );
}
