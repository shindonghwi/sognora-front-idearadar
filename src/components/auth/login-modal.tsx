'use client';

import { useUIStore } from '@/core/stores/ui-store';

/**
 * LoginModal
 *
 * Basic login modal - implement authentication logic as needed
 * TODO: Add OAuth providers (Google, Kakao, etc.)
 */
export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useUIStore();

  if (!isLoginModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={closeLoginModal}
    >
      <div
        style={{
          backgroundColor: 'var(--surface-default, #fff)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '16px', fontSize: '24px' }}>Sign In</h2>
        <p style={{ marginBottom: '24px', color: 'var(--on-surface-muted)' }}>
          Sign in to access your account
        </p>
        <button
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={closeLoginModal}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
