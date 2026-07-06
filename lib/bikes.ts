/* ============================================================
   KENI RIDES — Fleet data
   Technical specs (locale-independent) live here. The
   translatable copy (category, tagline, engine/power wording,
   terrain, description, features) lives in messages/<locale>.json
   under "bikes.<slug>" and is merged in via mergeBikes().
   Images live in /public/bikes/<slug>.<ext> — drop the real photos
   in and they are picked up automatically.
   ============================================================ */

export interface BikeBase {
  slug: string;
  name: string;
  short: string;
  /** Long-term daily rate (rentals of 6 days or more) — the headline "from" price. */
  price: number;
  /** Short-term daily rate (rentals under 6 days). Equals `price` when a bike has a single flat rate. */
  priceShort: number;
  /** Refundable security deposit (caution) in EUR — pre-authorized on the card, never charged. */
  deposit: number;
  seat: string;
  weight: string;
  tank: string;
}

export interface BikeTranslation {
  category: string;
  tagline: string;
  engine: string;
  power: string;
  terrain: string;
  description: string;
  features: string[];
}

export interface Bike extends BikeBase, BikeTranslation {}

export const BIKE_BASE: BikeBase[] = [
  { slug: 'bmw-gs1200-adventure', name: 'BMW GS 1200 Adventure', short: 'BMW GS 1200', price: 140, priceShort: 160, deposit: 1500, seat: '890 mm', weight: '260 kg', tank: '30 L' },
  { slug: 'yamaha-tenere-700-world-raid', name: 'Yamaha Ténéré 700 World Raid', short: 'Ténéré 700 World Raid', price: 140, priceShort: 150, deposit: 1500, seat: '890 mm', weight: '220 kg', tank: '23 L' },
  { slug: 'yamaha-tenere-700', name: 'Yamaha Ténéré 700', short: 'Ténéré 700', price: 120, priceShort: 140, deposit: 1500, seat: '875 mm', weight: '204 kg', tank: '16 L' },
  { slug: 'bmw-f800gs-adventure', name: 'BMW F800GS Adventure', short: 'BMW F800GS', price: 120, priceShort: 140, deposit: 2000, seat: '890 mm', weight: '229 kg', tank: '24 L' },
  { slug: 'honda-transalp-700', name: 'Honda Transalp 700', short: 'Transalp 700', price: 85, priceShort: 95, deposit: 1000, seat: '841 mm', weight: '214 kg', tank: '17.5 L' },
  { slug: 'yamaha-xtz660-tenere', name: 'Yamaha XTZ660 Ténéré', short: 'XTZ660 Ténéré', price: 80, priceShort: 85, deposit: 1500, seat: '895 mm', weight: '206 kg', tank: '23 L' },
  { slug: 'yamaha-xt660r', name: 'Yamaha XT660R', short: 'XT660R', price: 75, priceShort: 85, deposit: 1000, seat: '865 mm', weight: '181 kg', tank: '15 L' },
  { slug: 'suzuki-dr650', name: 'Suzuki DR650', short: 'DR650', price: 75, priceShort: 75, deposit: 1000, seat: '885 mm', weight: '166 kg', tank: '13 L' },
  { slug: 'suzuki-dr400', name: 'Suzuki DR400', short: 'DR400', price: 70, priceShort: 70, deposit: 1000, seat: '935 mm', weight: '145 kg', tank: '10 L' },
  { slug: 'honda-crf250', name: 'Honda CRF250', short: 'CRF250', price: 70, priceShort: 80, deposit: 1000, seat: '830 mm', weight: '144 kg', tank: '7.8 L' },
  { slug: 'suzuki-dr200', name: 'Suzuki DR200', short: 'DR200', price: 60, priceShort: 70, deposit: 1000, seat: '810 mm', weight: '126 kg', tank: '13 L' },
];

/** Number of days at or above which the long-term (lower) daily rate applies. */
export const LONG_TERM_MIN_DAYS = 6;

/** Daily rate for a given number of rental days: long-term rate at 6+ days, otherwise the short-term rate. */
export function dailyRate(bike: Pick<BikeBase, 'price' | 'priceShort'>, days: number): number {
  return days >= LONG_TERM_MIN_DAYS ? bike.price : bike.priceShort;
}

export const BIKE_SLUGS = BIKE_BASE.map((b) => b.slug);

// Most bike photos were delivered as .webp; two arrived as .jpg. Track the
// real extension per slug so we point at the actual file instead of guessing.
const BIKE_IMAGE_EXT: Record<string, string> = {
  'yamaha-tenere-700-world-raid': 'jpg',
  'yamaha-xtz660-tenere': 'jpg',
};

export function getBikeImage(slug: string): string {
  const ext = BIKE_IMAGE_EXT[slug] || 'webp';
  return `/bikes/${slug}.${ext}`;
}

/**
 * Ordered gallery for a bike: the real hero photo followed by the three
 * generated studio angles (front / side / rear), all under /public/bikes.
 */
export function getBikeGallery(slug: string): string[] {
  return [
    getBikeImage(slug),
    `/bikes/${slug}-front.webp`,
    `/bikes/${slug}-side.webp`,
    `/bikes/${slug}-rear.webp`,
  ];
}

/** Combine locale-independent specs with the translated copy for the current locale. */
export function mergeBikes(translations: Record<string, BikeTranslation>): Bike[] {
  return BIKE_BASE.map((base) => ({ ...base, ...translations[base.slug] }));
}

export function findBike(bikes: Bike[], slug: string | undefined | null): Bike | undefined {
  return bikes.find((b) => b.slug === slug);
}

export function getSimilarBikes(bikes: Bike[], bike: Bike, count = 3): Bike[] {
  return bikes
    .filter((b) => b.slug !== bike.slug)
    .sort((a, b) => {
      const catA = a.category === bike.category ? 0 : 1;
      const catB = b.category === bike.category ? 0 : 1;
      if (catA !== catB) return catA - catB;
      return Math.abs(a.price - bike.price) - Math.abs(b.price - bike.price);
    })
    .slice(0, count);
}

export function pickBikes(bikes: Bike[], slugs: string[]): Bike[] {
  return slugs.map((s) => findBike(bikes, s)).filter((b): b is Bike => Boolean(b));
}
