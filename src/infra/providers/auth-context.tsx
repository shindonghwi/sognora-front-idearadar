'use client';

/**
 * AuthProvider
 *
 * Simplified auth context for template.
 * Provides initialAuthState from SSR and basic auth state management.
 *
 * TODO: Enable full auth integration after running `make swagger`
 */

import { createContext, useContext } from 'react';

const AuthContext = createContext<{ initialAuthState: boolean }>({
  initialAuthState: false,
});

export function AuthProvider({
  children,
  initialAuthState,
}: {
  children: React.ReactNode;
  initialAuthState: boolean;
}) {
  return (
    <AuthContext.Provider value={{ initialAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
