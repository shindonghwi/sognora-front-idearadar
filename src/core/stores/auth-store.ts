/**
 * 인증 상태 Store
 *
 * 책임: 인증 상태 관리 + 프로필 정보 관리
 * - UI 상태(모달, 로딩)는 ui-store.ts에서 관리
 * - 토큰 저장은 token.ts 유틸리티에서 담당 (localStorage + Cookie)
 * - persist로 상태 유지하되 AuthProvider에서 SSR 상태와 동기화
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';
import type { ProfileRO, ProfileAttributeRO } from '@/core/api/generated/ro/profile';
import { ProfileAttributeKey, ProfileStatus } from '@/core/api/generated/types/profile';

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  accountStatus: ProfileStatus | null;
  profile: ProfileRO | null;
  attributes: ProfileAttributeRO[];
  _hasHydrated: boolean;

  // 액션
  login: (accountStatus?: ProfileStatus) => void;
  logout: () => void;
  setProfile: (profile: ProfileRO | null) => void;
  setAttributes: (attributes: ProfileAttributeRO[]) => void;
  setAccountStatus: (status: ProfileStatus) => void;
  setHasHydrated: (state: boolean) => void;

  // 헬퍼
  getAttribute: (key: string) => ProfileAttributeRO | undefined;
  getDisplayName: () => string;
  getAvatarUrl: () => string | null;
  isDormant: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isAuthenticated: false,
      accountStatus: null,
      profile: null,
      attributes: [],
      _hasHydrated: false,

      // 액션
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      login: (accountStatus?: ProfileStatus) => set({
        isAuthenticated: true,
        accountStatus: accountStatus ?? ProfileStatus.ProfileStatusActive,
      }),
      logout: () => {
        clearTokens();
        clearAccountStatus();
        set({ isAuthenticated: false, accountStatus: null, profile: null, attributes: [] });
        // URL에서 returnUrl 파라미터 제거 후 홈으로 이동
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      setProfile: (profile) => set({ profile }),
      setAttributes: (attributes) => set({ attributes }),
      setAccountStatus: (status) => set({ accountStatus: status }),

      // 헬퍼
      getAttribute: (key) => {
        const attrs = get().attributes;
        return Array.isArray(attrs) ? attrs.find((attr) => attr.key === key) : undefined;
      },
      getDisplayName: () => {
        const attrs = get().attributes;
        if (!Array.isArray(attrs)) return 'User';
        // nickname 우선, 없으면 display_name, 둘 다 없으면 'User'
        const nicknameAttr = attrs.find((attr) => attr.key === ProfileAttributeKey.ProfileKeyNickname);
        if (nicknameAttr?.value) {
          return String(nicknameAttr.value);
        }
        const displayNameAttr = attrs.find((attr) => attr.key === ProfileAttributeKey.ProfileKeyDisplayName);
        if (displayNameAttr?.value) {
          return String(displayNameAttr.value);
        }
        return 'User';
      },
      getAvatarUrl: () => {
        const attrs = get().attributes;
        if (!Array.isArray(attrs)) return null;
        const avatarAttr = attrs.find((attr) => attr.key === ProfileAttributeKey.ProfileKeyAvatarURL);
        if (!avatarAttr?.value) return null;
        const path = String(avatarAttr.value);
        // 이미 full URL이면 그대로 반환
        if (path.startsWith('http')) return path;
        // path만 저장된 경우 CDN URL과 결합
        const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
        return cdnUrl ? `${cdnUrl}/${path}` : null;
      },
      isDormant: () => get().accountStatus === ProfileStatus.ProfileStatusInactive,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accountStatus: state.accountStatus,
        profile: state.profile,
        attributes: state.attributes,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
