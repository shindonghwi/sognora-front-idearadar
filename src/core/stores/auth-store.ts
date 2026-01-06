/**
 * Auth State Store
 *
 * Responsibilities: Auth state management + Profile info management
 * - UI states (modal, loading) are managed in ui-store.ts
 * - Token storage is handled by token.ts utility (localStorage + Cookie)
 * - State persisted with zustand persist, synced with SSR state via AuthProvider
 *
 * TODO: Replace local types with generated types after running `make swagger`
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';

// Local type definitions (replace with generated types after `make swagger`)
export enum ProfileStatus {
  ProfileStatusActive = 'ACTIVE',
  ProfileStatusInactive = 'INACTIVE',
  ProfileStatusPending = 'PENDING',
}

export enum ProfileAttributeKey {
  ProfileKeyNickname = 'nickname',
  ProfileKeyDisplayName = 'display_name',
  ProfileKeyAvatarURL = 'avatar_url',
}

export interface ProfileRO {
  idx?: number;
  email?: string;
  status?: ProfileStatus;
  authProvider?: string;
  createdAt?: string;
}

export interface ProfileAttributeRO {
  key: string;
  value: string | number | boolean;
}

interface AuthState {
  // State
  isAuthenticated: boolean;
  accountStatus: ProfileStatus | null;
  profile: ProfileRO | null;
  attributes: ProfileAttributeRO[];
  _hasHydrated: boolean;

  // Actions
  login: (accountStatus?: ProfileStatus) => void;
  logout: () => void;
  setProfile: (profile: ProfileRO | null) => void;
  setAttributes: (attributes: ProfileAttributeRO[]) => void;
  setAccountStatus: (status: ProfileStatus) => void;
  setHasHydrated: (state: boolean) => void;

  // Helpers
  getAttribute: (key: string) => ProfileAttributeRO | undefined;
  getDisplayName: () => string;
  getAvatarUrl: () => string | null;
  isDormant: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      accountStatus: null,
      profile: null,
      attributes: [],
      _hasHydrated: false,

      // Actions
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      login: (accountStatus?: ProfileStatus) => set({
        isAuthenticated: true,
        accountStatus: accountStatus ?? ProfileStatus.ProfileStatusActive,
      }),
      logout: () => {
        clearTokens();
        clearAccountStatus();
        set({ isAuthenticated: false, accountStatus: null, profile: null, attributes: [] });
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      setProfile: (profile) => set({ profile }),
      setAttributes: (attributes) => set({ attributes }),
      setAccountStatus: (status) => set({ accountStatus: status }),

      // Helpers
      getAttribute: (key) => {
        const attrs = get().attributes;
        return Array.isArray(attrs) ? attrs.find((attr) => attr.key === key) : undefined;
      },
      getDisplayName: () => {
        const attrs = get().attributes;
        if (!Array.isArray(attrs)) return 'User';
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
        if (path.startsWith('http')) return path;
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
