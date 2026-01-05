/**
 * Google OAuth Provider
 *
 * Google OAuth 기능을 앱 전체에 제공
 */

'use client';

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google';
import { ReactNode } from 'react';
import config from '@/core/config/env';

interface GoogleOAuthProviderWrapperProps {
  children: ReactNode;
}

const GOOGLE_CLIENT_ID = config.googleClientId || '';

export function GoogleOAuthProviderWrapper({ children }: GoogleOAuthProviderWrapperProps) {
  if (!GOOGLE_CLIENT_ID) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
    return <>{children}</>;
  }

  return (
    <GoogleProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleProvider>
  );
}
