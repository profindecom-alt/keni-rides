import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { BIKE_SLUGS } from '@/lib/bikes';
import { absoluteUrl, type Href } from '@/lib/seo';

// Static routes that exist in every locale, with a rough crawl priority.
const STATIC_ROUTES: { href: Href; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { href: '/', priority: 1.0, changeFrequency: 'weekly' },
  { href: '/motorcycles', priority: 0.9, changeFrequency: 'weekly' },
  { href: '/gallery', priority: 0.7, changeFrequency: 'monthly' },
  { href: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
  { href: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { href: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { href: '/conditions', priority: 0.5, changeFrequency: 'yearly' },
  { href: '/contact', priority: 0.6, changeFrequency: 'yearly' },
];

/** hreflang alternates block for a route (one localized URL per locale). */
function languagesFor(href: Href): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(locale, href);
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ href, priority, changeFrequency }) => ({
    url: absoluteUrl(routing.defaultLocale, href),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: languagesFor(href) },
  }));

  const bikeEntries: MetadataRoute.Sitemap = BIKE_SLUGS.map((slug) => {
    const href: Href = { pathname: '/motorcycles/[slug]', params: { slug } };
    return {
      url: absoluteUrl(routing.defaultLocale, href),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: languagesFor(href) },
    };
  });

  return [...staticEntries, ...bikeEntries];
}
