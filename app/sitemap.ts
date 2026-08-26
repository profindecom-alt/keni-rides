import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { BIKE_SLUGS, getBikeGallery } from '@/lib/bikes';
import { CITY_BASE } from '@/lib/cities';
import { GALLERY_SRCS } from '@/lib/gallery';
import { absoluteUrl, SITE_URL, type Href } from '@/lib/seo';

/**
 * Google Image search is one of this site's biggest traffic sources (Search
 * Console: ~58 clicks in a 28-day window, a sixth of the total), so every
 * entry declares the photos on that page. Image sitemap URLs must be absolute.
 */
function imageUrls(paths: string[]): string[] {
  return paths.map((p) => `${SITE_URL}${p}`);
}

// Static routes that exist in every locale, with a rough crawl priority.
const STATIC_ROUTES: { href: Href; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; images?: string[] }[] = [
  { href: '/', priority: 1.0, changeFrequency: 'weekly', images: ['/gallery/moto-col-montagne-crepuscule-maroc.jpg'] },
  { href: '/motorcycles', priority: 0.9, changeFrequency: 'weekly', images: ['/gallery/moto-traversee-desert-maroc.jpg', ...BIKE_SLUGS.map((s) => getBikeGallery(s)[0])] },
  { href: '/gallery', priority: 0.7, changeFrequency: 'monthly', images: GALLERY_SRCS.map((g) => g.src) },
  { href: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
  { href: '/about', priority: 0.6, changeFrequency: 'yearly', images: ['/founder.webp'] },
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

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ href, priority, changeFrequency, images }) => ({
    url: absoluteUrl(routing.defaultLocale, href),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: languagesFor(href) },
    ...(images ? { images: imageUrls(images) } : {}),
  }));

  const bikeEntries: MetadataRoute.Sitemap = BIKE_SLUGS.map((slug) => {
    const href: Href = { pathname: '/motorcycles/[slug]', params: { slug } };
    return {
      url: absoluteUrl(routing.defaultLocale, href),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: languagesFor(href) },
      // Hero photo plus the three studio angles — these are the thumbnails
      // Search Console already shows against the bike pages.
      images: imageUrls(getBikeGallery(slug)),
    };
  });

  const cityEntries: MetadataRoute.Sitemap = CITY_BASE.map(({ slug, heroImage, itineraries }) => {
    const href: Href = { pathname: '/rentals/[city]', params: { city: slug } };
    // The hero plus every itinerary photo. Declaring only the hero left three
    // quarters of each city page's imagery out of the image sitemap, and image
    // search is this site's largest impression source. Deduped because a city
    // can legitimately reuse one photo for its hero and a route.
    const photos = [...new Set([heroImage, ...itineraries.map((i) => i.image)])];
    return {
      url: absoluteUrl(routing.defaultLocale, href),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: { languages: languagesFor(href) },
      images: imageUrls(photos),
    };
  });

  return [...staticEntries, ...bikeEntries, ...cityEntries];
}
