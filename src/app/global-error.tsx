'use client';

import { useEffect } from 'react';

/**
 * Root Global Error Page (500)
 *
 * 앱 전체의 최상위 에러 핸들러
 * - root layout 에러 시 표시
 * - CSS 변수 사용 불가하여 하드코딩 필수
 * - 404 페이지와 동일한 디자인, 인라인 스타일로 구현
 */
export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>500 - Server Error</title>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          :root {
            --bg-base: #F5F5F5;
            --bg-paper: #FFFFFF;
            --text-default: #212121;
            --text-muted: #757575;
            --border-muted: #E0E0E0;
            --accent-primary: #3B82F6;
            --accent-hover: #2563EB;
            --secondary-bg: #F5F5F5;
            --secondary-text: #424242;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg-base: #0A0A0A;
              --bg-paper: #181818;
              --text-default: #FAFAFA;
              --text-muted: #A3A3A3;
              --border-muted: #282828;
              --accent-primary: #60A5FA;
              --accent-hover: #93C5FD;
              --secondary-bg: #282828;
              --secondary-text: #D4D4D4;
            }
          }
        `}</style>
      </head>
      <body
        style={{
          fontFamily: 'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
          background: 'var(--bg-base)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-muted)',
            background: 'var(--bg-paper)',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-default)',
              textDecoration: 'none',
            }}
          >
            IdeaRadar
          </a>
        </header>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* Error Code */}
            <div
              style={{
                fontSize: '120px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                lineHeight: 1,
                marginBottom: '24px',
                letterSpacing: '-0.04em',
                opacity: 0.3,
              }}
            >
              500
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--text-default)',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              Server Error
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '40px',
              }}
            >
              A temporary error has occurred.
              <br />
              Please try again later.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '40px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  background: 'var(--accent-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--accent-primary)';
                }}
              >
                Go to Home
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--secondary-text)',
                  background: 'var(--secondary-bg)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-muted)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-muted)';
                }}
              >
                Try Again
              </button>
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--border-muted)',
                marginBottom: '40px',
              }}
            />

            {/* Helpful Links */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '16px',
                }}
              >
                Helpful Links
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <a
                  href="/"
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-default)',
                    textDecoration: 'none',
                    position: 'relative',
                  }}
                >
                  Home
                </a>
                <a
                  href="/pricing"
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-default)',
                    textDecoration: 'none',
                    position: 'relative',
                  }}
                >
                  Pricing
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Responsive Styles */}
        <style>{`
          @media (max-width: 640px) {
            body > main > div > div:first-child {
              font-size: 80px !important;
              margin-bottom: 16px !important;
            }
            body > main > div > h1 {
              font-size: 22px !important;
            }
            body > main > div > p {
              font-size: 14px !important;
              margin-bottom: 24px !important;
            }
            body > main > div > div:nth-of-type(1) {
              flex-direction: column !important;
              gap: 8px !important;
              margin-bottom: 24px !important;
            }
            body > main > div > div:nth-of-type(1) button {
              width: 100%;
            }
            body > main > div > div:last-child > div {
              flex-direction: column !important;
              gap: 12px !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
