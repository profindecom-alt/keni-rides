import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Dead WordPress/WooCommerce URL families, answered with 410 Gone.
 *
 * These are plumbing endpoints and thin taxonomy archives that never held
 * content worth preserving, so there is no sensible 301 target. Pointing them
 * all at /nos-motos would be a mass irrelevant redirect — Google reads that as
 * a soft 404 and keeps the URLs in the index (and in the "Introuvable" report)
 * for months. A 410 is an explicit "permanently gone", which drops them far
 * faster than a 404 and stops the failed-validation loop in Search Console.
 *
 * Deliberately NOT listed:
 *  - /wp-content/*  — old uploads still rank in Google Images, our biggest
 *    impression source; the one dead PDF there is 301'd in next.config.ts.
 *  - /produit/*, /inventory/*, /categorie-produit/*, … — real product pages
 *    with rankings and links; those are 301'd in next.config.ts, which Next
 *    applies before middleware, so those redirects still win.
 */
const GONE_PATTERNS: RegExp[] = [
  // WordPress core plumbing.
  /^\/wp-(admin|includes|json)(\/|$)/,
  /^\/wp-(login|cron|signup|trackback)\.php$/,
  /^\/(xmlrpc|index)\.php$/,
  /^\/wp-sitemap[\w-]*\.xml$/,
  // Syndication feeds (site-wide and per-section, e.g. /comments/feed).
  /^\/(feed|rss|rss2|rdf|atom)(\/|$)/,
  /\/feed\/?$/,
  // WooCommerce account / checkout flow.
  /^\/(mon-compte|my-account|commande|commande-recue|validation-de-commande|checkout|order-received)(\/|$)/,
  // Thin taxonomy + author archives.
  /^\/(tag|category|categorie|etiquette-produit|product-tag|marque)(\/|$)/,
  /^\/author(\/|$)/,
  // Blog pagination and date archives (/page/2, /2024, /2024/04, /2024/04/12).
  /^\/page\/\d+\/?$/,
  /^\/\d{4}(\/\d{2}){0,2}\/?$/,
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (GONE_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse('410 Gone — this page no longer exists.', {
      status: 410,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        // Gone for good: let caches and crawlers hold onto that fact.
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // The pattern above skips anything containing a dot, which would exclude
    // the legacy .php / .xml endpoints above — list them explicitly.
    '/index.php',
    '/xmlrpc.php',
    '/wp-login.php',
    '/wp-cron.php',
    '/wp-signup.php',
    '/wp-trackback.php',
    '/wp-sitemap.xml',
  ],
};
