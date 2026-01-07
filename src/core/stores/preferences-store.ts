/**
 * User Preferences Store
 *
 * Manages user preferences for personalized analysis
 * - Niches (interest areas)
 * - Target revenue
 * - Service scale
 * - Onboarding status
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  type UserPreferences,
  type TargetRevenue,
  type ServiceScale,
  defaultUserPreferences,
} from '@/core/mocks/preferences';

interface PreferencesState {
  // State
  preferences: UserPreferences;
  _hasHydrated: boolean;

  // Actions
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setNiches: (niches: string[]) => void;
  setTargetRevenue: (revenue: TargetRevenue) => void;
  setServiceScale: (scale: ServiceScale) => void;
  completeOnboarding: () => void;
  resetPreferences: () => void;
  setHasHydrated: (state: boolean) => void;

  // Helpers
  isOnboardingCompleted: () => boolean;
  hasSelectedNiches: () => boolean;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: defaultUserPreferences,
      _hasHydrated: false,

      // Actions
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
            updatedAt: new Date().toISOString(),
          },
        })),

      setNiches: (niches) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            niches: niches.slice(0, 3), // Max 3 niches
            updatedAt: new Date().toISOString(),
          },
        })),

      setTargetRevenue: (revenue) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            targetRevenue: revenue,
            updatedAt: new Date().toISOString(),
          },
        })),

      setServiceScale: (scale) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            serviceScale: scale,
            updatedAt: new Date().toISOString(),
          },
        })),

      completeOnboarding: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            onboardingCompleted: true,
            updatedAt: new Date().toISOString(),
          },
        })),

      resetPreferences: () =>
        set({
          preferences: {
            ...defaultUserPreferences,
            updatedAt: new Date().toISOString(),
          },
        }),

      // Helpers
      isOnboardingCompleted: () => get().preferences.onboardingCompleted,
      hasSelectedNiches: () => get().preferences.niches.length > 0,
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
