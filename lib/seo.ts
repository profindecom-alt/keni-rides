/* ============================================================
   KENI RIDES — Centralised SEO helpers
   One source of truth for canonical URLs, hreflang alternates,
   and per-page Open Graph metadata across the three locales.

   Localised URL slugs (e.g. /nos-motos, /gallerie) are resolved
   through next-intl's `getPathname`, so canonical + hreflang tags
   always match the public URLs defined in i18n/routing's `pathnames`.
   ============================================================ */
import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export const SITE_URL = 'https://keni-rides.com';
export const SITE_NAME = 'Keni Rides';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

const DEFAULT_LOCALE = routing.defaultLocale;

/** next-intl `href` — a known pathname string or a dynamic `{ pathname, params }`. */
export type Href = Parameters<typeof getPathname>[0]['href'];

/** Localised public path for a route (incl. locale prefix as-needed), e.g. '/nos-motos'. */
export function localizedPath(locale: string, href: Href): string {
  return getPathname({ href, locale: locale as Locale });
}

/** Absolute URL (origin included) for a route in a given locale. */
export function absoluteUrl(locale: string, href: Href): string {
  return `${SITE_URL}${localizedPath(locale, href)}`;
}

/** Open Graph locale codes keyed by our short locale. */
const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  es: 'es_ES',
};

/** Canonical + hreflang alternates (incl. x-default) for a route. */
export function alternatesFor(locale: string, href: Href): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedPath(l, href);
  languages['x-default'] = localizedPath(DEFAULT_LOCALE, href);
  return { canonical: localizedPath(locale, href), languages };
}

interface PageMetaOptions {
  locale: string;
  /** next-intl href: a pathname string ('/motorcycles') or `{ pathname, params }`. */
  href: Href;
  title: string;
  description?: string;
  /** Absolute-or-relative image path; defaults to the site OG image. */
  image?: string;
  /** When true, the title bypasses the `%s | Keni Rides` template. */
  absoluteTitle?: boolean;
}

/**
 * Full per-page Metadata: title, description, canonical + hreflang
 * alternates, and a complete Open Graph block (replaces the layout's
 * default OG so every page ships its own title/description/url/locale).
 */
export function pageMetadata({
  locale,
  href,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  absoluteTitle = false,
}: PageMetaOptions): Metadata {
  const alternateLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALE[l]);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, href),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: absoluteUrl(locale, href),
      locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
      alternateLocale: alternateLocales,
      images: [image],
    },
  };
}
