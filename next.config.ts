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
  // Second batch, from the 2026-07-25 Search Console 404 export: the same bikes
  // were also published under shorter slugs. The catch-all below would flatten
  // these to the fleet listing, which throws away the per-bike ranking, so map
  // each one explicitly.
  { source: '/produit/suzuki-dr-650', destination: '/nos-motos/suzuki-dr650' },
  { source: '/produit/gs-1200-adventure', destination: '/nos-motos/bmw-gs1200-adventure' },
  { source: '/produit/gs-1200-adventure-copie', destination: '/nos-motos/bmw-gs1200-adventure' },
  { source: '/produit/tenere-700-world-raid', destination: '/nos-motos/yamaha-tenere-700-world-raid' },
  // Bikes no longer in the fleet → the fleet listing (still relevant, not a 404).
  { source: '/produit/honda-transalp-700', destination: '/nos-motos' },
  // Any other old /produit/* we didn't map explicitly → the fleet listing.
  { source: '/produit/:path*', destination: '/nos-motos' },

  // --- Pre-WooCommerce /inventory/<slug> listing URLs (still being crawled) ---
  { source: '/inventory/honda-crf-250', destination: '/nos-motos/honda-crf250' },
  { source: '/inventory/suzuki-dr-200', destination: '/nos-motos/suzuki-dr200' },
  { source: '/inventory/suzuki-dr-650', destination: '/nos-motos/suzuki-dr650' },
  { source: '/inventory/:path*', destination: '/nos-motos' },

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
  { source: '/shop', destination: '/nos-motos' },
  { source: '/shop/:path*', destination: '/nos-motos' },
  // Booking-plugin search/listing endpoints and a duplicate fleet page that
  // WordPress had published, all still in Google's 404 report.
  { source: '/nos-motos-2', destination: '/nos-motos' },
  { source: '/rent-list', destination: '/nos-motos' },
  { source: '/rental-search', destination: '/nos-motos' },
  { source: '/quote-checkout-redirect', destination: '/nos-motos' },
  { source: '/categorie-produit/:path*', destination: '/nos-motos' },
  { source: '/pickup_location/:path*', destination: '/nos-motos' },
  { source: '/dropoff_location/:path*', destination: '/nos-motos' },
  { source: '/mb_categories/:path*', destination: '/nos-motos' },

  // --- Renamed image assets ---
  // The gallery and destination photos were renamed from camera filenames
  // (DSC03120.jpg) to descriptive ones (motos-plaines-desertiques-maroc.jpg).
  // Image search is this site's largest impression source and the old URLs are
  // already indexed, so each one redirects rather than 404ing and dropping the
  // ranking that came with it.
  { source: '/gallery/DSC01210.jpg', destination: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg' },
  { source: '/gallery/DSC01332.jpg', destination: '/gallery/moto-piste-poussiere-montagne-maroc.jpg' },
  { source: '/gallery/DSC01352.jpg', destination: '/gallery/moto-canyon-roches-rouges-maroc.jpg' },
  { source: '/gallery/DSC01895.jpg', destination: '/gallery/moto-col-montagne-maroc.jpg' },
  { source: '/gallery/DSC01993.jpg', destination: '/gallery/route-col-montagne-atlas-maroc.jpg' },
  { source: '/gallery/DSC02225.jpg', destination: '/gallery/moto-col-montagne-crepuscule-maroc.jpg' },
  { source: '/gallery/DSC02705.jpg', destination: '/gallery/equipe-keni-rides-garage-maroc.jpg' },
  { source: '/gallery/DSC02757.jpg', destination: '/gallery/riders-keni-rides-ensemble-maroc.jpg' },
  { source: '/gallery/DSC02961.jpg', destination: '/gallery/rider-pause-desert-maroc.jpg' },
  { source: '/gallery/DSC03120.jpg', destination: '/gallery/motos-plaines-desertiques-maroc.jpg' },
  { source: '/gallery/DSC03230.jpg', destination: '/gallery/moto-traversee-desert-maroc.jpg' },
  { source: '/gallery/DSC03273.jpg', destination: '/gallery/groupe-moto-acacia-desert-maroc.jpg' },
  { source: '/gallery/DSC03818.jpg', destination: '/gallery/riders-desert-maroc.jpg' },
  { source: '/gallery/DSC03952.jpg', destination: '/gallery/moto-piste-montagne-maroc.jpg' },
  { source: '/gallery/DSC04394.jpg', destination: '/gallery/moto-dunes-sahara-maroc.jpg' },
  { source: '/gallery/DSC05655.jpg', destination: '/gallery/assistance-moto-garage-zagora-maroc.jpg' },
  { source: '/gallery/DSC05672.jpg', destination: '/gallery/rider-keni-rides-moto-maroc.jpg' },
  { source: '/gallery/DSC05794.jpg', destination: '/gallery/reparation-pneu-moto-desert-maroc.jpg' },
  { source: '/gallery/agence-01.jpg', destination: '/gallery/motos-location-cote-atlantique-maroc.jpg' },
  { source: '/gallery/agence-02.jpg', destination: '/gallery/livraison-moto-remorque-maroc.jpg' },
  { source: '/gallery/group-ride.webp', destination: '/gallery/groupe-moto-aventure-maroc.webp' },
  { source: '/destinations/sahara.webp', destination: '/destinations/desert-sahara-moto-maroc.webp' },
  { source: '/destinations/atlas.webp', destination: '/destinations/montagnes-atlas-moto-maroc.webp' },
  { source: '/destinations/mediterranee.webp', destination: '/destinations/cote-mediterranee-moto-maroc.webp' },
  { source: '/destinations/atlantique.webp', destination: '/destinations/cote-atlantique-moto-maroc.webp' },

  // --- Old WordPress content pages → closest current page ---
  { source: '/histoire', destination: '/a-propos-de-nous' },
  { source: '/a-propos', destination: '/a-propos-de-nous' },
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
  images: {
    // AVIF first, WebP second: both are a large step down from the source JPEG
    // and every browser we see in Search Console supports at least one.
    formats: ['image/avif', 'image/webp'],
    // The widths srcset is generated at. Trimmed to the sizes this layout
    // actually uses — a 4-across gallery tile and a 3-across card on desktop,
    // full-bleed heroes — so we are not caching variants nothing requests.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920],
    imageSizes: [256, 384],
    // Optimised variants are immutable for a year; the filenames are stable and
    // a changed photo gets a new name.
    minimumCacheTTL: 31536000,
  },
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
