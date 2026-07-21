import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Legacy WooCommerce/WordPress URLs Google still has indexed after this site
// migrated off WordPress. Several old /produit/* pages still rank and receive
// clicks (per Search Console) but now 404 — 301 each to the closest current
// page so the ranking + traffic carry over instead of being lost. FR is the
// default locale, so bikes live unprefixed at /nos-motos/<slug>.
// Order matters: specific product URLs must precede the /produit/:path* catch-all.
const LEGACY_REDIRECTS = [
  // --- Old WooCommerce /produit/<slug> pages → matching bike detail page.
  // Old slugs were irregular (some prefixed "location-", one suffixed
  // "-a-louer-au-maroc"), so each is mapped by its exact GSC-observed path.
  { source: '/produit/location-bmw-r1200-gs-adventure', destination: '/nos-motos/bmw-gs1200-adventure' },
  { source: '/produit/f-800-gs-aventure', destination: '/nos-motos/bmw-f800gs-adventure' },
  { source: '/produit/location-tenere-700-world-raid', destination: '/nos-motos/yamaha-tenere-700-world-raid' },
  { source: '/produit/yamaha-tenere-700', destination: '/nos-motos/yamaha-tenere-700' },
  { source: '/produit/tenere-xtz-660', destination: '/nos-motos/yamaha-tenere-700' },
  { source: '/produit/yamaha-xt-660-r', destination: '/nos-motos/yamaha-tenere-700' },
  { source: '/produit/honda-crf-250', destination: '/nos-motos/honda-crf250' },
  { source: '/produit/suzuki-dr-200', destination: '/nos-motos/suzuki-dr200' },
  { source: '/produit/suzuki-dr-400', destination: '/nos-motos/suzuki-dr400' },
  { source: '/produit/suzuki-dr-650-a-louer-au-maroc', destination: '/nos-motos/suzuki-dr650' },
  // Bikes no longer in the fleet → the fleet listing (still relevant, not a 404).
  { source: '/produit/honda-transalp-700', destination: '/nos-motos' },
  // Any other old /produit/* we didn't map explicitly → the fleet listing.
  { source: '/produit/:path*', destination: '/nos-motos' },

  // --- Fleet slugs that changed shape during the migration, per locale.
  // These are exact dead slugs, so they don't shadow the live /[slug] bikes.
  { source: '/nos-motos/yamaha-xtz660-tenere', destination: '/nos-motos/yamaha-tenere-700' },
  { source: '/en/motorcycles/yamaha-xtz660-tenere', destination: '/en/motorcycles/yamaha-tenere-700' },
  { source: '/es/motorcycles/yamaha-xtz660-tenere', destination: '/es/motorcycles/yamaha-tenere-700' },
  { source: '/nos-motos/honda-transalp-700', destination: '/nos-motos' },
  { source: '/en/motorcycles/honda-transalp-700', destination: '/en/motorcycles' },
  { source: '/es/motorcycles/honda-transalp-700', destination: '/es/motorcycles' },

  // --- WooCommerce / booking-plugin taxonomies → fleet listing ---
  { source: '/panier', destination: '/nos-motos' },
  { source: '/boutique', destination: '/nos-motos' },
  { source: '/categorie-produit/:path*', destination: '/nos-motos' },
  { source: '/pickup_location/:path*', destination: '/nos-motos' },
  { source: '/dropoff_location/:path*', destination: '/nos-motos' },
  { source: '/mb_categories/:path*', destination: '/nos-motos' },

  // --- Old WordPress content pages → closest current page ---
  { source: '/histoire', destination: '/a-propos-de-nous' },
  { source: '/informations-generales', destination: '/conditions-de-location' },
  { source: '/blog', destination: '/' },
  { source: '/blog-2', destination: '/' },
  { source: '/vivez-l-aventure-ultime-explorez-a-moto-avec-keni-rides.com', destination: '/' },
  { source: '/keni-rides-com-votre-partenaire-de-confiance-pour-des-aventures-a-moto-inoubliables', destination: '/' },
  // Old rental-agreement PDF (still drawing impressions) → the conditions page.
  { source: '/wp-content/uploads/2024/04/RENTAL-AGREEMENT.pdf-1.pdf', destination: '/conditions-de-location' },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
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
