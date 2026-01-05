/**
 * 토큰 관리 유틸리티
 * localStorage + Cookie 동시 관리
 */

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCOUNT_STATUS_KEY = 'account_status';

/**
 * 쿠키 설정 (클라이언트 사이드만)
 */
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * 쿠키 읽기 (클라이언트 사이드만)
 */
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * 쿠키 삭제 (클라이언트 사이드만)
 */
function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Access Token 저장 (localStorage + Cookie)
 * 클라이언트 사이드만 동작
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  setCookie(TOKEN_KEY, token, 7); // 7일
}

/**
 * Refresh Token 저장 (localStorage + Cookie)
 * 클라이언트 사이드만 동작
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  setCookie(REFRESH_TOKEN_KEY, token, 30); // 30일
}

/**
 * Access Token 읽기
 * 클라이언트 사이드만 동작
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  // localStorage 우선, 없으면 cookie
  return localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY);
}

/**
 * Refresh Token 읽기
 * 클라이언트 사이드만 동작
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY) || getCookie(REFRESH_TOKEN_KEY);
}

/**
 * 모든 토큰 삭제
 * 클라이언트 사이드만 동작
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  deleteCookie(TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
}

/**
 * 토큰 존재 여부 확인
 */
export function hasValidToken(): boolean {
  return !!getAccessToken();
}

/**
 * Account Status 저장 (쿠키 전용 - middleware에서 읽어야 함)
 */
export function setAccountStatus(status: string): void {
  if (typeof window === 'undefined') return;
  setCookie(ACCOUNT_STATUS_KEY, status, 7);
}

/**
 * Account Status 읽기
 */
export function getAccountStatus(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie(ACCOUNT_STATUS_KEY);
}

/**
 * Account Status 삭제
 */
export function clearAccountStatus(): void {
  if (typeof window === 'undefined') return;
  deleteCookie(ACCOUNT_STATUS_KEY);
}
