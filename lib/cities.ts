/* ============================================================
   KENI RIDES — City rental landing pages
   Locale-independent facts per city (name, coordinates, hero
   photo, suggested itineraries). The translatable copy — lead,
   intro, routes, FAQ — lives in messages/<locale>.json under
   "rentalCity.cities.<slug>".
   These pages target local search intent ("location moto <city>")
   which Google surfaces with a map pack; Kénitra is our home base.
   ============================================================ */

/** How demanding an itinerary is, mapped to a translated label at render time. */
export type RouteLevel = 'easy' | 'moderate' | 'demanding';

/** One waypoint on an itinerary, with distance ridden from the start. */
export interface RouteStage {
  /** Place name. Moroccan proper nouns, so they read the same in all three locales. */
  place: string;
  /** Cumulative kilometres from the departure city. */
  km: number;
}

/**
 * The measurable half of a suggested itinerary.
 *
 * Index-matched to `rentalCity.cities.<slug>.routes` in the message files,
 * which hold the title and description. Distances, days, difficulty and the
 * waypoint list are facts rather than prose, so they live here once instead of
 * being re-typed (and drifting) across three translations.
 */
export interface Itinerary {
  /** Suggested trip length in days. */
  days: number;
  /** Total distance, equal to the final stage's cumulative figure. */
  km: number;
  level: RouteLevel;
  /** Slugs from lib/bikes of the machines we would put a rider on here. */
  bikes: string[];
  /** Photo for the itinerary card — chosen to match the terrain of the route. */
  image: string;
  stages: RouteStage[];
}

export interface CityBase {
  slug: string;
  /** Display name (same across locales; Kénitra keeps its accent). */
  name: string;
  /**
   * Wikidata entity id, taken from the canonical Wikipedia article rather
   * than guessed. Published as sameAs on the City node so an answer engine
   * resolves "Tanger" to the Moroccan port and not to one of the other
   * places with that name — entity grounding is most of what makes a small
   * site quotable to an assistant.
   */
  wikidata: string;
  lat: number;
  lng: number;
  /** Hero photo under /public. */
  heroImage: string;
  /** Suggested itineraries, index-matched to the translated `routes` array. */
  itineraries: Itinerary[];
}

export const CITY_BASE: CityBase[] = [
  {
    slug: 'marrakech',
    name: 'Marrakech',
    wikidata: 'Q101625',
    lat: 31.6295,
    lng: -7.9811,
    heroImage: '/destinations/montagnes-atlas-moto-maroc.webp',
    itineraries: [
      {
        days: 4,
        km: 560,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'bmw-gs1200-adventure'],
        image: '/destinations/desert-sahara-moto-maroc.webp',
        stages: [
          { place: 'Ouarzazate', km: 200 },
          { place: 'Boumalne Dadès', km: 320 },
          { place: 'Erfoud', km: 500 },
          { place: 'Merzouga', km: 560 },
        ],
      },
      {
        days: 1,
        km: 200,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure', 'yamaha-tenere-700'],
        image: '/destinations/montagnes-atlas-moto-maroc.webp',
        stages: [
          { place: 'Aït Ourir', km: 35 },
          { place: 'Tizi n\'Tichka', km: 105 },
          { place: 'Aït Benhaddou', km: 170 },
          { place: 'Ouarzazate', km: 200 },
        ],
      },
      {
        days: 1,
        km: 140,
        level: 'easy',
        bikes: ['honda-crf250', 'suzuki-dr650'],
        image: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
        stages: [
          { place: 'Tnine Ourika', km: 35 },
          { place: 'Setti Fatma', km: 65 },
          { place: 'Oukaïmeden', km: 95 },
          { place: 'Marrakech', km: 140 },
        ],
      },
    ],
  },
  {
    slug: 'casablanca',
    name: 'Casablanca',
    wikidata: 'Q7903',
    lat: 33.5731,
    lng: -7.5898,
    heroImage: '/destinations/cote-atlantique-moto-maroc.webp',
    itineraries: [
      {
        days: 2,
        km: 350,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure', 'bmw-f800gs-adventure'],
        image: '/destinations/cote-atlantique-moto-maroc.webp',
        stages: [
          { place: 'El Jadida', km: 100 },
          { place: 'Oualidia', km: 175 },
          { place: 'Safi', km: 250 },
          { place: 'Essaouira', km: 350 },
        ],
      },
      {
        days: 1,
        km: 240,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure'],
        image: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
        stages: [
          { place: 'Settat', km: 75 },
          { place: 'Ben Guerir', km: 160 },
          { place: 'Marrakech', km: 240 },
        ],
      },
      {
        days: 3,
        km: 400,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'bmw-f800gs-adventure'],
        image: '/destinations/montagnes-atlas-moto-maroc.webp',
        stages: [
          { place: 'Khouribga', km: 120 },
          { place: 'Beni Mellal', km: 220 },
          { place: 'Azrou', km: 380 },
          { place: 'Ifrane', km: 400 },
        ],
      },
    ],
  },
  {
    slug: 'kenitra',
    name: 'Kénitra',
    wikidata: 'Q478207',
    lat: 34.261,
    lng: -6.5802,
    heroImage: '/gallery/motos-location-cote-atlantique-maroc.jpg',
    itineraries: [
      {
        days: 2,
        km: 210,
        level: 'easy',
        bikes: ['bmw-f800gs-adventure', 'yamaha-tenere-700'],
        image: '/destinations/montagnes-atlas-moto-maroc.webp',
        stages: [
          { place: 'Ouezzane', km: 110 },
          { place: 'Bab Taza', km: 175 },
          { place: 'Chefchaouen', km: 210 },
        ],
      },
      {
        days: 1,
        km: 80,
        level: 'easy',
        bikes: ['suzuki-dr650', 'honda-crf250'],
        image: '/destinations/cote-atlantique-moto-maroc.webp',
        stages: [
          { place: 'Sidi Allal Tazi', km: 45 },
          { place: 'Moulay Bousselham', km: 80 },
        ],
      },
      {
        days: 2,
        km: 200,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure'],
        image: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
        stages: [
          { place: 'Sidi Kacem', km: 70 },
          { place: 'Meknès', km: 130 },
          { place: 'Volubilis', km: 160 },
          { place: 'Fès', km: 200 },
        ],
      },
    ],
  },
  {
    slug: 'agadir',
    name: 'Agadir',
    wikidata: 'Q170525',
    lat: 30.4278,
    lng: -9.5981,
    heroImage: '/destinations/cote-atlantique-moto-maroc.webp',
    itineraries: [
      {
        days: 1,
        km: 150,
        level: 'easy',
        bikes: ['honda-crf250', 'suzuki-dr650'],
        image: '/gallery/groupe-moto-aventure-maroc.webp',
        stages: [
          { place: 'Aourir', km: 15 },
          { place: 'Paradise Valley', km: 35 },
          { place: 'Immouzzer des Ida Outanane', km: 60 },
          { place: 'Agadir', km: 150 },
        ],
      },
      {
        days: 2,
        km: 285,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'bmw-f800gs-adventure'],
        image: '/gallery/moto-col-montagne-maroc.jpg',
        stages: [
          { place: 'Aït Baha', km: 90 },
          { place: 'Tafraoute', km: 175 },
          { place: 'Vallée des Ameln', km: 195 },
          { place: 'Tiznit', km: 285 },
        ],
      },
      {
        days: 1,
        km: 175,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure'],
        image: '/destinations/cote-atlantique-moto-maroc.webp',
        stages: [
          { place: 'Taghazout', km: 20 },
          { place: 'Tamri', km: 55 },
          { place: 'Sidi Kaouki', km: 150 },
          { place: 'Essaouira', km: 175 },
        ],
      },
    ],
  },
  {
    slug: 'tanger',
    name: 'Tanger',
    wikidata: 'Q126148',
    lat: 35.7595,
    lng: -5.834,
    heroImage: '/destinations/cote-mediterranee-moto-maroc.webp',
    itineraries: [
      {
        days: 1,
        km: 115,
        level: 'easy',
        bikes: ['yamaha-tenere-700', 'bmw-f800gs-adventure'],
        image: '/destinations/montagnes-atlas-moto-maroc.webp',
        stages: [
          { place: 'Tétouan', km: 60 },
          { place: 'Bab Taza', km: 95 },
          { place: 'Chefchaouen', km: 115 },
        ],
      },
      {
        days: 2,
        km: 300,
        level: 'moderate',
        bikes: ['bmw-gs1200-adventure', 'yamaha-tenere-700'],
        image: '/destinations/cote-mediterranee-moto-maroc.webp',
        stages: [
          { place: 'Tétouan', km: 60 },
          { place: 'Oued Laou', km: 100 },
          { place: 'Jebha', km: 175 },
          { place: 'Al Hoceïma', km: 300 },
        ],
      },
      {
        days: 1,
        km: 130,
        level: 'easy',
        bikes: ['suzuki-dr650'],
        image: '/destinations/cote-atlantique-moto-maroc.webp',
        stages: [
          { place: 'Cap Spartel', km: 15 },
          { place: 'Grottes d\'Hercule', km: 18 },
          { place: 'Ksar es-Seghir', km: 55 },
          { place: 'Tétouan', km: 130 },
        ],
      },
    ],
  },
  {
    slug: 'fes',
    name: 'Fès',
    wikidata: 'Q80985',
    lat: 34.0331,
    lng: -5.0003,
    heroImage: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
    itineraries: [
      {
        days: 1,
        km: 170,
        level: 'easy',
        bikes: ['yamaha-tenere-700', 'bmw-f800gs-adventure'],
        image: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
        stages: [
          { place: 'Imouzzer Kandar', km: 40 },
          { place: 'Ifrane', km: 65 },
          { place: 'Azrou', km: 85 },
          { place: 'Fès', km: 170 },
        ],
      },
      {
        days: 2,
        km: 470,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'bmw-gs1200-adventure'],
        image: '/destinations/desert-sahara-moto-maroc.webp',
        stages: [
          { place: 'Ifrane', km: 65 },
          { place: 'Midelt', km: 205 },
          { place: 'Errachidia', km: 340 },
          { place: 'Erfoud', km: 415 },
          { place: 'Merzouga', km: 470 },
        ],
      },
      {
        days: 2,
        km: 300,
        level: 'easy',
        bikes: ['bmw-f800gs-adventure'],
        image: '/destinations/montagnes-atlas-moto-maroc.webp',
        stages: [
          { place: 'Meknès', km: 65 },
          { place: 'Ouezzane', km: 200 },
          { place: 'Chefchaouen', km: 300 },
        ],
      },
    ],
  },
  {
    slug: 'rabat',
    name: 'Rabat',
    wikidata: 'Q3551',
    lat: 34.0209,
    lng: -6.8416,
    heroImage: '/gallery/motos-location-cote-atlantique-maroc.jpg',
    itineraries: [
      {
        days: 2,
        km: 250,
        level: 'easy',
        bikes: ['bmw-f800gs-adventure', 'yamaha-tenere-700'],
        image: '/destinations/montagnes-atlas-moto-maroc.webp',
        stages: [
          { place: 'Kénitra', km: 40 },
          { place: 'Ouezzane', km: 150 },
          { place: 'Chefchaouen', km: 250 },
        ],
      },
      {
        days: 1,
        km: 200,
        level: 'easy',
        bikes: ['suzuki-dr650'],
        image: '/destinations/cote-atlantique-moto-maroc.webp',
        stages: [
          { place: 'Kénitra', km: 40 },
          { place: 'Sidi Allal Tazi', km: 85 },
          { place: 'Moulay Bousselham', km: 120 },
          { place: 'Rabat', km: 200 },
        ],
      },
      {
        days: 2,
        km: 170,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure'],
        image: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
        stages: [
          { place: 'Khémisset', km: 85 },
          { place: 'Meknès', km: 140 },
          { place: 'Volubilis', km: 170 },
        ],
      },
    ],
  },
  {
    slug: 'essaouira',
    name: 'Essaouira',
    wikidata: 'Q216939',
    lat: 31.5085,
    lng: -9.7595,
    heroImage: '/destinations/cote-atlantique-moto-maroc.webp',
    itineraries: [
      {
        days: 1,
        km: 175,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure', 'yamaha-tenere-700'],
        image: '/destinations/cote-atlantique-moto-maroc.webp',
        stages: [
          { place: 'Sidi Kaouki', km: 25 },
          { place: 'Tamri', km: 120 },
          { place: 'Taghazout', km: 155 },
          { place: 'Agadir', km: 175 },
        ],
      },
      {
        days: 1,
        km: 220,
        level: 'easy',
        bikes: ['suzuki-dr650', 'yamaha-tenere-700'],
        image: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg',
        stages: [
          { place: 'Ounagha', km: 30 },
          { place: 'Chichaoua', km: 130 },
          { place: 'Marrakech', km: 220 },
        ],
      },
      {
        days: 1,
        km: 60,
        level: 'easy',
        bikes: ['honda-crf250', 'suzuki-dr200'],
        image: '/gallery/motos-location-cote-atlantique-maroc.jpg',
        stages: [
          { place: 'Cap Sim', km: 20 },
          { place: 'Sidi Kaouki', km: 30 },
          { place: 'Essaouira', km: 60 },
        ],
      },
    ],
  },
  {
    slug: 'ouarzazate',
    name: 'Ouarzazate',
    wikidata: 'Q505208',
    lat: 30.9335,
    lng: -6.937,
    heroImage: '/gallery/equipe-keni-rides-garage-maroc.jpg',
    itineraries: [
      {
        days: 2,
        km: 260,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'suzuki-dr650'],
        image: '/destinations/desert-sahara-moto-maroc.webp',
        stages: [
          { place: 'Agdz', km: 70 },
          { place: 'Zagora', km: 165 },
          { place: 'Tamegroute', km: 185 },
          { place: 'M\'Hamid', km: 260 },
        ],
      },
      {
        days: 2,
        km: 235,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'bmw-f800gs-adventure'],
        image: '/gallery/moto-col-montagne-maroc.jpg',
        stages: [
          { place: 'Skoura', km: 40 },
          { place: 'Boumalne Dadès', km: 115 },
          { place: 'Gorges du Dadès', km: 145 },
          { place: 'Tinghir', km: 220 },
          { place: 'Gorges du Todra', km: 235 },
        ],
      },
      {
        days: 1,
        km: 190,
        level: 'easy',
        bikes: ['bmw-gs1200-adventure'],
        image: '/gallery/equipe-keni-rides-garage-maroc.jpg',
        stages: [
          { place: 'Aït Benhaddou', km: 30 },
          { place: 'Telouet', km: 75 },
          { place: 'Tizi n\'Tichka', km: 95 },
          { place: 'Ouarzazate', km: 190 },
        ],
      },
    ],
  },
  {
    slug: 'merzouga',
    name: 'Merzouga',
    wikidata: 'Q1922278',
    lat: 31.0996,
    lng: -4.0129,
    heroImage: '/gallery/moto-dunes-sahara-maroc.jpg',
    itineraries: [
      {
        days: 1,
        km: 90,
        level: 'demanding',
        bikes: ['honda-crf250', 'suzuki-dr650'],
        image: '/gallery/moto-dunes-sahara-maroc.jpg',
        stages: [
          { place: 'Dayet Srji', km: 8 },
          { place: 'Khamlia', km: 15 },
          { place: 'Hassi Labied', km: 25 },
          { place: 'Merzouga', km: 90 },
        ],
      },
      {
        days: 1,
        km: 120,
        level: 'moderate',
        bikes: ['suzuki-dr650', 'yamaha-tenere-700'],
        image: '/gallery/motos-plaines-desertiques-maroc.jpg',
        stages: [
          { place: 'Rissani', km: 40 },
          { place: 'Ksar Abbar', km: 50 },
          { place: 'Erfoud', km: 85 },
          { place: 'Merzouga', km: 120 },
        ],
      },
      {
        days: 2,
        km: 235,
        level: 'moderate',
        bikes: ['yamaha-tenere-700', 'bmw-f800gs-adventure'],
        image: '/gallery/moto-col-montagne-maroc.jpg',
        stages: [
          { place: 'Erfoud', km: 55 },
          { place: 'Tinejdad', km: 145 },
          { place: 'Tinghir', km: 200 },
          { place: 'Gorges du Todra', km: 235 },
        ],
      },
    ],
  },
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
