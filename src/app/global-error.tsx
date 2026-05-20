'use client';

import { useEffect } from 'react';

/**
 * Global Error Boundary — catches errors in the root layout.
 * Regular error.tsx only catches errors within the layout boundary.
 * If the root layout itself crashes (AuthProvider, font loading, etc.),
 * this is the only thing between the user and a blank white screen.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0F0A1E',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '400px',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}>
            !
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Something went wrong
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            We encountered an unexpected error. This has been logged and our team will look into it.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
          <div style={{ marginTop: '1rem' }}>
            <a
              href="/"
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              Go to homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
