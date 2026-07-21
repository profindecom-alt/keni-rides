import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
  // French (the primary language) lives at the root; /en and /es are prefixed.
  localePrefix: 'as-needed',
  // Localised URL slugs. Internal route folders keep their English names
  // (app/[locale]/motorcycles, /gallery, …); next-intl rewrites the public
  // French URLs to the SEO-friendly slugs below. EN/ES keep the English paths.
  pathnames: {
    '/': '/',
    '/motorcycles': {
      fr: '/nos-motos',
      en: '/motorcycles',
      es: '/motorcycles',
    },
    '/motorcycles/[slug]': {
      fr: '/nos-motos/[slug]',
      en: '/motorcycles/[slug]',
      es: '/motorcycles/[slug]',
    },
    '/rentals/[city]': {
      fr: '/location-moto/[city]',
      en: '/motorcycle-rental/[city]',
      es: '/alquiler-motos/[city]',
    },
    '/gallery': {
      fr: '/gallerie',
      en: '/gallery',
      es: '/gallery',
    },
    '/about': {
      fr: '/a-propos-de-nous',
      en: '/about',
      es: '/about',
    },
    '/conditions': {
      fr: '/conditions-de-location',
      en: '/conditions',
      es: '/conditions',
    },
    '/testimonials': '/testimonials',
    '/faq': '/faq',
    '/contact': '/contact',
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
