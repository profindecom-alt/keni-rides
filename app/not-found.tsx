import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ background: '#faf7f1', color: '#241a10', fontFamily: 'system-ui, sans-serif' }}>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '1.5rem' }}>
          <h1>404 · Page Not Found</h1>
          <Link href="/" style={{ color: '#c2410c', fontWeight: 600 }}>Back to Home</Link>
        </section>
      </body>
    </html>
  );
}
