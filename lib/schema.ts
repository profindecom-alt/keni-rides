/* ============================================================
   KENI RIDES — Structured data building blocks

   Every page emits a single JSON-LD document shaped as
   { "@context": …, "@graph": [ … ] } (see components/JsonLd).
   Nodes carry stable @ids and point at each other by reference
   rather than repeating themselves, so a crawler — or an LLM
   reading one page — can resolve "who rents this, from where,
   at what price" without stitching pages together.

   The single source of truth for the business itself is the
   LocalBusiness node in app/[locale]/layout.tsx, published on
   every page under BUSINESS_ID. Nothing else redeclares it.
   ============================================================ */
import { BIKE_BASE, LONG_TERM_MIN_DAYS, getBikeGallery, type Bike } from './bikes';
import { CITY_BASE, DELIVERY_CITIES, findCity, type CityBase } from './cities';
import { CONFIG } from './config';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './seo';
import { routing } from '@/i18n/routing';

/** @id of the one LocalBusiness node, declared in the root layout. */
export const BUSINESS_ID = `${SITE_URL}/#business`;

/** Where the fleet physically lives and hands over. Everything else is delivery. */
const HOME_CITY = findCity('kenitra')!;

/** @id of the WebSite node, also declared in the root layout. */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Point at the business instead of describing it again. */
export const businessRef = { '@id': BUSINESS_ID } as const;

/**
 * GoodRelations "LeaseOut": the offer rents the item out, it does not sell it.
 * Without this a price on a Product reads as a purchase price, which is how
 * these pages started attracting "prix maroc neuf" buying intent.
 */
const LEASE_OUT = 'http://purl.org/goodrelations/v1#LeaseOut';

/** Cheapest and dearest daily rate across the fleet, derived so they can't drift. */
export const FLEET_MIN_DAILY = Math.min(...BIKE_BASE.map((bike) => bike.price));
export const FLEET_MAX_DAILY = Math.max(...BIKE_BASE.map((bike) => bike.priceShort));

/**
 * The one business entity for the whole site, rendered by the root layout.
 *
 * Everything else — bike offers, city services, the contact page — points at
 * this @id instead of restating the name, address or phone. That is what keeps
 * the NAP consistent, and it means an LLM parsing any single page can resolve
 * the operator without crawling the rest of the site.
 */
export const BUSINESS_NODE = {
  '@type': 'LocalBusiness',
  '@id': BUSINESS_ID,
  name: SITE_NAME,
  description: 'Premium adventure motorcycle rental in Morocco.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  telephone: CONFIG.phoneHref.replace('tel:', ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: '362 A. du N',
    addressLocality: 'Kénitra',
    addressCountry: 'MA',
  },
  // Taken from the Kénitra entry in lib/cities.ts rather than restated, so the
  // business's own coordinates can never drift from the city page's. (These
  // used to point ~100 km south of Kénitra, contradicting addressLocality and
  // weakening the local signal behind our best-performing query.)
  geo: {
    '@type': 'GeoCoordinates',
    latitude: HOME_CITY.lat,
    longitude: HOME_CITY.lng,
  },
  // Canonical Google Maps listing (CID from the Business Profile).
  hasMap: CONFIG.google.profile,
  // The bikes are based in Kénitra and delivered anywhere in Morocco. The
  // Country entry carries "anywhere"; the named cities are the ones riders
  // actually ask for, whether or not they have a landing page yet.
  areaServed: [
    { '@type': 'Country', name: 'Morocco' },
    ...CITY_BASE.map((city) => ({ '@type': 'City', name: city.name })),
    ...DELIVERY_CITIES.map((name) => ({ '@type': 'City', name })),
  ],
  knowsLanguage: [...routing.locales],
  openingHours: 'Mo-Su 09:00-19:00',
  priceRange: `€${FLEET_MIN_DAILY}–€${FLEET_MAX_DAILY} / day`,
  currenciesAccepted: 'EUR',
  // NOTE: no aggregateRating here on purpose. Google treats a business rating
  // self-published in structured data on its own site as a "self-serving
  // review" — not eligible for star rich results. The real 4.8★ already shows
  // via the Business Profile in the map pack, and the footer links to it.
  sameAs: [
    CONFIG.google.profile,
    CONFIG.social.facebook,
    CONFIG.social.instagram,
    CONFIG.social.youtube,
  ],
};

/** The site itself, so the entity graph has a root above the individual pages. */
export const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: [...routing.locales],
  publisher: businessRef,
};

/** Leading number of a spec string — '810 mm' → 810, '7.8 L' → 7.8. */
function amount(spec: string): number {
  return Number.parseFloat(spec);
}

/** Daily-rate offers for one bike: a short-term band and a long-term band. */
export function rentalOffers(bike: Bike, url: string) {
  return [
    { price: bike.priceShort, minDays: 1, maxDays: LONG_TERM_MIN_DAYS - 1 },
    { price: bike.price, minDays: LONG_TERM_MIN_DAYS, maxDays: undefined },
  ].map(({ price, minDays, maxDays }) => ({
    '@type': 'Offer',
    businessFunction: LEASE_OUT,
    availability: 'https://schema.org/InStock',
    url,
    price,
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'EUR',
      unitCode: 'DAY',
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        unitCode: 'DAY',
        minValue: minDays,
        ...(maxDays ? { maxValue: maxDays } : {}),
      },
    },
    seller: businessRef,
  }));
}

/**
 * A bike as a schema.org Motorcycle rather than a bare Product.
 *
 * Motorcycle is a Vehicle subtype, so the spec table on the page becomes real
 * machine-readable values (displacement, power, tank, kerb weight, seat height)
 * instead of prose. `vehicleSpecialUsage: RentalVehicleUsage` states outright
 * that this is a rental bike.
 */
export function motorcycleNode(bike: Bike, url: string) {
  return {
    '@type': 'Motorcycle',
    '@id': `${url}#rental`,
    name: bike.name,
    description: bike.description,
    category: bike.category,
    vehicleConfiguration: bike.category,
    image: getBikeGallery(bike.slug).map((path) => `${SITE_URL}${path}`),
    url,
    brand: { '@type': 'Brand', name: bike.name.split(' ')[0] },
    vehicleSpecialUsage: 'https://schema.org/RentalVehicleUsage',
    vehicleEngine: {
      '@type': 'EngineSpecification',
      fuelType: 'https://schema.org/Petrol',
      // CMQ is the UN/CEFACT code for cubic centimetre. Metric horsepower has
      // no reliable code, so power is published with a plain unitText.
      engineDisplacement: { '@type': 'QuantitativeValue', value: bike.displacementCc, unitCode: 'CMQ' },
      enginePower: { '@type': 'QuantitativeValue', value: bike.powerHp, unitText: 'hp' },
    },
    fuelCapacity: { '@type': 'QuantitativeValue', value: amount(bike.tank), unitCode: 'LTR' },
    weight: { '@type': 'QuantitativeValue', value: amount(bike.weight), unitCode: 'KGM' },
    // Seat height is not a Vehicle property, so it rides along as a named
    // additionalProperty — still structured, still queryable.
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Seat height', value: amount(bike.seat), unitCode: 'MMT' },
      { '@type': 'PropertyValue', name: 'Security deposit', value: bike.deposit, unitText: 'EUR' },
    ],
    // Every bike in the fleet is a two-up capable dual-sport.
    seatingCapacity: 2,
    offers: rentalOffers(bike, url),
  };
}

/**
 * The rental service as offered in one city.
 *
 * The city pages previously carried only a breadcrumb and an FAQ, which said
 * nothing about what is actually being offered there. A Service node with
 * `areaServed` pinned to the city's real coordinates states the thing the page
 * exists to rank for: this operator rents these bikes, in this city, from this
 * price.
 */
export function cityServiceNode({
  city,
  url,
  name,
  description,
}: {
  city: CityBase;
  url: string;
  name: string;
  description: string;
}) {
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    url,
    serviceType: 'Motorcycle rental',
    provider: businessRef,
    areaServed: {
      '@type': 'City',
      name: city.name,
      geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      servicePhone: CONFIG.phoneHref.replace('tel:', ''),
    },
    offers: {
      '@type': 'AggregateOffer',
      businessFunction: LEASE_OUT,
      lowPrice: FLEET_MIN_DAILY,
      highPrice: FLEET_MAX_DAILY,
      priceCurrency: 'EUR',
      offerCount: BIKE_BASE.length,
      seller: businessRef,
    },
  };
}

/** BreadcrumbList from an ordered [name, url] trail. */
export function breadcrumbNode(trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: step.url,
    })),
  };
}

/** FAQPage from question/answer pairs already written in the messages files. */
export function faqNode(pairs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: pairs.map((pair) => ({
      '@type': 'Question',
      name: pair.q,
      acceptedAnswer: { '@type': 'Answer', text: pair.a },
    })),
  };
}
