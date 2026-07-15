import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Every build renames the hashed JS chunks an HTML document points at,
        // so a page held in a shared cache keeps serving the previous build's
        // code. Hostinger's CDN pins pages for a year and never purges on
        // deploy, which is how the call/WhatsApp tap tracking silently stopped
        // firing. Force HTML to revalidate; the immutable hashed assets under
        // /_next/static are excluded and keep their long-lived caching.
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
