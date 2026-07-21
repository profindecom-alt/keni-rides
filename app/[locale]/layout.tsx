import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FabStack from '@/components/FabStack';
import Preloader from '@/components/Preloader';
import TapTracker from '@/components/TapTracker';
import { routing } from '@/i18n/routing';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import '../globals.css';

// Self-hosted variable fonts (see app/fonts/*.woff2, from @fontsource-variable).
// Bundled locally so there is no build-time Google fetch and no render-blocking
// external request. Each exposes a CSS variable that globals.css maps onto
// --font-display / --font-body / --font-mono.
const spaceGrotesk = localFont({
  src: '../fonts/space-grotesk-latin.woff2',
  weight: '300 700',
  variable: '--font-space-grotesk',
  display: 'swap',
});
const manrope = localFont({
  src: '../fonts/manrope-latin.woff2',
  weight: '200 800',
  variable: '--font-manrope',
  display: 'swap',
});
const jetbrainsMono = localFont({
  src: '../fonts/jetbrains-mono-latin.woff2',
  weight: '100 800',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const fontVariables = `${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable}`;

const OG_LOCALE: Record<string, string> = { fr: 'fr_FR', en: 'en_US', es: 'es_ES' };

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#faf7f1',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('siteTitle'),
      template: `%s | ${SITE_NAME}`,
    },
    description: t('siteDescription'),
    applicationName: SITE_NAME,
    icons: {
      icon: '/logo.webp',
      shortcut: '/logo.webp',
      apple: '/logo.webp',
    },
    // Site-wide defaults. Individual pages override these with their own
    // title/description/url/canonical via lib/seo's `pageMetadata`.
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: t('siteTitle'),
      description: t('siteDescription'),
      url: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
      locale: OG_LOCALE[locale] ?? OG_LOCALE[routing.defaultLocale],
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteTitle'),
      description: t('siteDescription'),
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': `${SITE_URL}/#business`,
              name: SITE_NAME,
              description: 'Premium adventure motorcycle rental in Morocco.',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.webp`,
              image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
              telephone: '+212616712266',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '362 A. du N',
                addressLocality: 'Kénitra',
                addressCountry: 'MA',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 33.2960489,
                longitude: -6.5358158,
              },
              // Canonical Google Maps listing (CID from the Business Profile).
              hasMap: 'https://www.google.com/maps?cid=13573386500998719410',
              areaServed: { '@type': 'Country', name: 'Morocco' },
              priceRange: '€60–€160 / day',
              currenciesAccepted: 'EUR',
              // NOTE: no aggregateRating here on purpose. Google treats a
              // business rating self-published in structured data on its own
              // site as a "self-serving review" — not eligible for star rich
              // results. The real 4.8★ already shows via the Business Profile
              // in the map pack, and the footer links to it. Keep it out of JSON-LD.
              sameAs: [
                // Google Business Profile — links this site to the Maps listing.
                'https://www.google.com/maps?cid=13573386500998719410',
                'https://www.facebook.com/share/ZKKKbiGrdkfL6RLS/?mibextid=LQQJ4d',
                'https://www.instagram.com/keni_rides/',
                'https://www.youtube.com/@KeniRides',
              ],
            }),
          }}
        />
      </head>
      <body>
        <Preloader />
        <TapTracker />
        <NextIntlClientProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <FabStack />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
