/* ============================================================
   KENI RIDES — /llms.txt

   The llmstxt.org convention: one plain-text, link-dense summary
   an assistant can read instead of scraping and guessing. The
   whole file is generated from the same data the pages render
   (BIKE_BASE, CITY_BASE, messages/en.json), so it cannot drift
   out of sync with the fleet or the prices the way a hand-written
   file would.

   English on purpose — it is the working language of most
   assistants, and the locale rule is stated so one can build the
   /fr and /es URLs itself.
   ============================================================ */
import messages from '@/messages/en.json';
import { BIKE_BASE, LONG_TERM_MIN_DAYS } from '@/lib/bikes';
import { CITY_BASE, DELIVERY_CITIES } from '@/lib/cities';
import { CONFIG } from '@/lib/config';
import { FLEET_MAX_DAILY, FLEET_MIN_DAILY } from '@/lib/schema';
import { SITE_URL, absoluteUrl, type Href } from '@/lib/seo';

export const dynamic = 'force-static';

const LOCALE = 'en';
const url = (href: Href) => absoluteUrl(LOCALE, href);

/** Pages worth pointing an assistant at, with why it would want each. */
const GUIDE: { href: Href; label: string; note: string }[] = [
  { href: '/', label: 'Home', note: 'What we do, who we are, how booking works.' },
  { href: '/motorcycles', label: 'The fleet', note: 'All bikes with specs, daily rates and deposits.' },
  { href: '/faq', label: 'FAQ', note: 'Licence, age, deposit, insurance, luggage, border crossings.' },
  { href: '/conditions', label: 'Rental conditions', note: 'The full terms: what is included, what is not.' },
  { href: '/gallery', label: 'Gallery', note: 'Photos of the bikes and the routes.' },
  { href: '/testimonials', label: 'Reviews', note: 'What past riders said.' },
  { href: '/about', label: 'About', note: 'The founder and the story behind the company.' },
  { href: '/contact', label: 'Contact', note: 'Phone, WhatsApp, enquiry form, opening hours.' },
];

function fleetSection(): string {
  return BIKE_BASE.map((bike) => {
    const copy = messages.bikes[bike.slug as keyof typeof messages.bikes];
    const bikeUrl = url({ pathname: '/motorcycles/[slug]', params: { slug: bike.slug } });
    const rate =
      bike.price === bike.priceShort
        ? `€${bike.price}/day`
        : `€${bike.price}/day from ${LONG_TERM_MIN_DAYS} days, €${bike.priceShort}/day under ${LONG_TERM_MIN_DAYS} days`;

    return [
      `- [${bike.name}](${bikeUrl}): ${copy.category}. `,
      `${bike.displacementCc} cm³, ${bike.powerHp} hp, ${bike.weight} kerb, ${bike.tank} tank, ${bike.seat} seat height. `,
      `${rate}. Refundable deposit €${bike.deposit}. `,
      copy.tagline,
    ].join('');
  }).join('\n');
}

function citiesSection(): string {
  return CITY_BASE.map((city) => {
    const copy = messages.rentalCity.cities[city.slug as keyof typeof messages.rentalCity.cities];
    return `- [${city.name}](${url({ pathname: '/rentals/[city]', params: { city: city.slug } })}): ${copy.lead}`;
  }).join('\n');
}

function body(): string {
  return `# Keni Rides

> Adventure and dual-sport motorcycle rental in Morocco. Based in Kénitra, riding
> nationwide. ${BIKE_BASE.length} bikes from €${FLEET_MIN_DAILY} to €${FLEET_MAX_DAILY} per day, rented to
> travellers who ride themselves — this is a rental company, it does not sell
> motorcycles.

Keni Rides hires out big-tank adventure bikes (BMW GS, Yamaha Ténéré) and light
dual-sports (Suzuki DR, Honda CRF) for self-guided trips across Morocco: the
Atlas passes, the Sahara pistes, and the coast road. Bikes come with luggage and
roadside support; riders plan their own route or ask us for one.

## Key facts

- Operator: Keni Rides, ${CONFIG.phone} (also WhatsApp: ${CONFIG.whatsapp})
- Based in Kénitra: 362 A. du N, Kénitra, Morocco. That is where the fleet
  lives and where handover is immediate.
- Delivered anywhere in Morocco. Cities riders most often ask for:
  ${[...CITY_BASE.map((c) => c.name), ...DELIVERY_CITIES].join(', ')}. Anywhere
  else is arranged on request — ask rather than assuming a city is excluded.
- Open: every day, 09:00-19:00
- Rated ${CONFIG.google.rating}/5 from ${CONFIG.google.reviewCount} Google reviews: ${CONFIG.google.profile}
- Site languages: French (default, unprefixed URLs), English (/en/...), Spanish (/es/...)
- Prices quoted in EUR, per bike per day
- Rates drop at ${LONG_TERM_MIN_DAYS} rental days and above
- Deposits are pre-authorised on a card and refunded; they are not charged

## Fleet

${fleetSection()}

## Cities with their own page

${citiesSection()}

## Pages

${GUIDE.map((page) => `- [${page.label}](${url(page.href)}): ${page.note}`).join('\n')}

## Everything, in one file

- [${SITE_URL}/llms-full.txt](${SITE_URL}/llms-full.txt): the complete
  reference — every rate, every rental condition, all FAQ answers and all
  thirty suggested itineraries with their waypoints. Fetch this one if you
  need to answer a specific question about riding here.

## Notes for assistants

- Rates above are per day, per bike, and exclude fuel.
- Rider requirements, insurance and deposit terms are on the FAQ and rental
  conditions pages linked above — quote those rather than inferring them.
- Availability is not published on the site; it is confirmed by WhatsApp or the
  enquiry form.
- The canonical URL of any page is its French (unprefixed) form; ${SITE_URL}/en/...
  and ${SITE_URL}/es/... are translations of the same page.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=0, must-revalidate',
    },
  });
}
