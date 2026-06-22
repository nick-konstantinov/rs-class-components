'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '1rem',
          margin: 0,
        }}
      >
        <h2 style={{ margin: 0 }}>Something went wrong</h2>
        <button
          type="button"
          onClick={reset}
          style={{ padding: '0.5rem 1.25rem', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
