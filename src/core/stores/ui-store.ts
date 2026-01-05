/**
 * UI 상태 Store
 *
 * 책임: UI 관련 전역 상태 관리 (모달, 로딩 등)
 * Core 레이어의 비즈니스 로직과 분리된 순수 UI 상태
 */

import { create } from 'zustand';

interface UIState {
  // 글로벌 로딩
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // 로그인 모달
  isLoginModalOpen: boolean;
  loginReturnUrl: string | null;
  openLoginModal: (returnUrl?: string) => void;
  closeLoginModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // 글로벌 로딩
  isGlobalLoading: false,
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),

  // 로그인 모달
  isLoginModalOpen: false,
  loginReturnUrl: null,
  openLoginModal: (returnUrl) => set({ isLoginModalOpen: true, loginReturnUrl: returnUrl || null }),
  closeLoginModal: () => set({ isLoginModalOpen: false, loginReturnUrl: null }),
}));
