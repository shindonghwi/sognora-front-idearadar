'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore, ProfileStatus, ProfileRO } from '@/core/stores/auth-store';
import { setAccessToken, setAccountStatus, clearTokens, clearAccountStatus } from '@/core/utils/token';
import styles from './dev-tools-float-button.module.css';

// Dev dummy profile
const DEV_PROFILE: ProfileRO = {
  idx: 999999,
  email: 'dev@example.com',
  status: ProfileStatus.ProfileStatusActive,
  authProvider: 'dev',
  createdAt: new Date().toISOString(),
};

// Dev dummy token - exported for use in other components
export const DEV_ACCESS_TOKEN = 'dev-access-token-for-testing';

/**
 * Read access_token from cookie (SSR safe)
 */
function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Check if token is dev token
 */
export function isDevAccessToken(token: string | null | undefined): boolean {
  return token === DEV_ACCESS_TOKEN;
}

/**
 * DevToolsFloatButton
 *
 * Development floating button
 * - Toggle login/logout state
 * - Cookie-based for middleware bypass
 * - Restores state from cookie on page load
 */
export function DevToolsFloatButton() {
  const { isAuthenticated, login, logout, setProfile } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [cookieToken, setCookieToken] = useState<string | null>(null);

  // Mount check and read cookie
  useEffect(() => {
    setMounted(true);
    const token = getTokenFromCookie();
    setCookieToken(token);
  }, []);

  // Restore Zustand state if dev token exists
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
      // Logout
      clearTokens();
      clearAccountStatus();
      logout();
      setCookieToken(null);
      // Refresh page to update UI state
      window.location.reload();
    } else {
      // Login
      setAccessToken(DEV_ACCESS_TOKEN);
      setAccountStatus(ProfileStatus.ProfileStatusActive);
      login(ProfileStatus.ProfileStatusActive);
      setProfile(DEV_PROFILE);
      setCookieToken(DEV_ACCESS_TOKEN);

      // Redirect to onboarding after login
      window.location.href = '/onboarding';
    }
  }, [isAuthenticated, login, logout, setProfile]);

  // Don't render during SSR (hydration mismatch prevention)
  if (!mounted) {
    return null;
  }

  // Button state: dev token in cookie or authenticated in Zustand
  const isLoggedIn = cookieToken === DEV_ACCESS_TOKEN || isAuthenticated;

  return (
    <button
      className={styles.floatButton}
      onClick={handleAuthToggle}
      title={isLoggedIn ? 'Switch to logged out' : 'Switch to logged in'}
    >
      {isLoggedIn ? '🔓' : '🔒'}
    </button>
  );
}
