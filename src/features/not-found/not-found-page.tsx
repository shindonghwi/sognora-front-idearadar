'use client';

import Link from 'next/link';

export function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '24px',
    }}>
      <h1 style={{ fontSize: '64px', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--on-surface-muted)' }}>
        Page not found
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--on-primary)',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
