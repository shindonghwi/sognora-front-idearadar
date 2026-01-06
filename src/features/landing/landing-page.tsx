'use client';

export function LandingPage() {
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
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>
        Welcome to App
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--on-surface-muted)' }}>
        Start building your application
      </p>
    </div>
  );
}
