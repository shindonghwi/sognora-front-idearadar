'use client';

/**
 * AuthProvider
 *
 * 책임: 앱 초기화 시 인증 상태 설정 (1회만)
 *
 * 역할:
 * 1. 서버에서 전달받은 initialAuthState로 로그인 상태 설정
 * 2. 로그인 상태면 React Query로 프로필/속성 조회 → Store 동기화
 * 3. 실패 시 logout 처리
 *
 * 사용처:
 * - layout.tsx에서 Provider로 감싸서 사용
 * - Header, ProfileMenu 등 전역 UI에서 Store 데이터 사용
 *
 * 주의:
 * - React Query 캐시 공유로 중복 API 호출 방지
 * - 프로필 페이지에서 useProfileSync 호출해도 캐시 사용
 * - 개발용 토큰(DEV_ACCESS_TOKEN)일 경우 프로필 API 호출 건너뜀
 */

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/core/stores/auth-store';
import { useUIStore } from '@/core/stores/ui-store';
import { useProfileMeGet, useProfileMeAttributesGet } from '@/core/domain/profile';
import { ProfileStatus } from '@/core/api/generated/types/profile';
import type { ProfileRO, ProfileAttributeRO } from '@/core/api/generated/ro/profile';
import { isDevAccessToken } from '@/components/dev/dev-tools-float-button';

const AuthContext = createContext<{ initialAuthState: boolean }>({
  initialAuthState: false,
});

/**
 * 클라이언트에서 쿠키에서 access_token 읽기
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

export function AuthProvider({
  children,
  initialAuthState,
}: {
  children: React.ReactNode;
  initialAuthState: boolean;
}) {
  const { login, logout, setProfile, setAttributes, isAuthenticated, accountStatus } = useAuthStore();
  const { setGlobalLoading } = useUIStore();
  const hasInitialized = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const pathname = usePathname();

  // 개발 토큰 확인 (매 렌더링마다 재계산 - 토큰 변경 감지)
  const token = getAccessTokenFromCookie();
  const isDevToken = isDevAccessToken(token);

  // Zustand persist hydration 완료 대기 (깜빡임 방지)
  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    // persist가 이미 hydrate되었을 수도 있음
    useAuthStore.persist.rehydrate();
    return unsubscribe;
  }, []);

  // 휴면 페이지에서는 프로필 조회를 건너뜀
  // (휴면 계정은 프로필 API가 403을 반환할 수 있음)
  // 개발용 토큰일 경우에도 프로필 조회 건너뜀 (API가 401 반환)
  const isDormantPage = pathname?.includes('/account/dormant');
  const shouldFetchProfile = initialAuthState && isAuthenticated && !isDormantPage && !isDevToken;

  // React Query로 프로필 조회 (캐시 공유됨)
  const profileQuery = useProfileMeGet({
    enabled: shouldFetchProfile,
  });

  const attributesQuery = useProfileMeAttributesGet(undefined, {
    enabled: shouldFetchProfile,
  });

  // 초기 인증 상태 설정 (hydration 완료 후 SSR 상태와 동기화)
  useLayoutEffect(() => {
    if (!hasHydrated) return; // hydration 완료 대기
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // SSR 상태와 localStorage 상태가 다르면 동기화
    if (initialAuthState && !isAuthenticated) {
      login();
    } else if (!initialAuthState && isAuthenticated) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, initialAuthState]);

  // 로딩 상태 관리 (휴면 페이지에서는 로딩 표시 안 함)
  useEffect(() => {
    if (shouldFetchProfile) {
      const isLoading = profileQuery.isLoading || attributesQuery.isLoading;
      setGlobalLoading(isLoading);
    }
  }, [shouldFetchProfile, profileQuery.isLoading, attributesQuery.isLoading, setGlobalLoading]);

  // 프로필 조회 성공 시 Store 업데이트
  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data as ProfileRO);
    }
  }, [profileQuery.data, setProfile]);

  // 속성 조회 성공 시 Store 업데이트
  useEffect(() => {
    if (attributesQuery.data) {
      setAttributes(attributesQuery.data as ProfileAttributeRO[]);
    }
  }, [attributesQuery.data, setAttributes]);

  // 조회 실패 시 로그아웃
  useEffect(() => {
    if (profileQuery.isError || attributesQuery.isError) {
      logout();
    }
  }, [profileQuery.isError, attributesQuery.isError, logout]);

  // 휴면 상태인데 휴면 페이지가 아니면 리다이렉트
  useEffect(() => {
    if (
      isAuthenticated &&
      accountStatus === ProfileStatus.ProfileStatusInactive &&
      !isDormantPage
    ) {
      window.location.href = '/account/dormant';
    }
  }, [isAuthenticated, accountStatus, isDormantPage]);

  return (
    <AuthContext.Provider value={{ initialAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
