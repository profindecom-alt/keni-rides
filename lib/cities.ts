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
  { slug: 'agadir', name: 'Agadir', lat: 30.4278, lng: -9.5981, heroImage: '/gallery/DSC05567.jpg' },
  { slug: 'tanger', name: 'Tanger', lat: 35.7595, lng: -5.834, heroImage: '/gallery/DSC04394.jpg' },
  { slug: 'fes', name: 'Fès', lat: 34.0331, lng: -5.0003, heroImage: '/gallery/DSC03244.jpg' },
  { slug: 'rabat', name: 'Rabat', lat: 34.0209, lng: -6.8416, heroImage: '/gallery/DSC03818.jpg' },
  { slug: 'essaouira', name: 'Essaouira', lat: 31.5085, lng: -9.7595, heroImage: '/gallery/DSC05707.jpg' },
  { slug: 'ouarzazate', name: 'Ouarzazate', lat: 30.9335, lng: -6.937, heroImage: '/gallery/DSC02705.jpg' },
  { slug: 'merzouga', name: 'Merzouga', lat: 31.0996, lng: -4.0129, heroImage: '/gallery/DSC01895.jpg' },
];

export const CITY_SLUGS = CITY_BASE.map((c) => c.slug);

/**
 * Further destinations we deliver to, named in areaServed and /llms.txt but
 * without a landing page of their own.
 *
 * Every one of these already appears in the route copy of the city pages
 * above, so naming them states the real service area rather than inventing
 * coverage. Promote one into CITY_BASE when it earns a page with its own
 * translated copy — listing it here costs nothing and creates no thin page.
 */
export const DELIVERY_CITIES = ['Meknès', 'Chefchaouen', 'Zagora', 'Tiznit'];

export function findCity(slug: string | undefined | null): CityBase | undefined {
  return CITY_BASE.find((c) => c.slug === slug);
}
