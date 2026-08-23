/* ============================================================
   KENI RIDES — City rental landing pages
   Locale-independent facts per city (name, coordinates, hero
   photo). The translatable copy — lead, intro, routes, FAQ —
   lives in messages/<locale>.json under "rentalCity.cities.<slug>".
   These pages target local search intent ("location moto <city>")
   which Google surfaces with a map pack; Kénitra is our home base.
   ============================================================ */

export interface CityBase {
  slug: string;
  /** Display name (same across locales; Kénitra keeps its accent). */
  name: string;
  lat: number;
  lng: number;
  /** Hero photo under /public/gallery. */
  heroImage: string;
}

export const CITY_BASE: CityBase[] = [
  { slug: 'marrakech', name: 'Marrakech', lat: 31.6295, lng: -7.9811, heroImage: '/gallery/DSC05422.jpg' },
  { slug: 'casablanca', name: 'Casablanca', lat: 33.5731, lng: -7.5898, heroImage: '/gallery/DSC03063.jpg' },
  { slug: 'kenitra', name: 'Kénitra', lat: 34.261, lng: -6.5802, heroImage: '/gallery/DSC03902.jpg' },
];

export const CITY_SLUGS = CITY_BASE.map((c) => c.slug);

/**
 * Cities we deliver to that don't have a landing page yet.
 *
 * Named in the business's areaServed and in /llms.txt so the real service area
 * is explicit — the bikes are based in Kénitra and go anywhere in Morocco.
 * Promote one into CITY_BASE when it earns a page with its own translated
 * copy; listing a city here costs nothing and creates no thin page.
 */
export const DELIVERY_CITIES = ['Agadir', 'Tanger', 'Fès'];

export function findCity(slug: string | undefined | null): CityBase | undefined {
  return CITY_BASE.find((c) => c.slug === slug);
}
