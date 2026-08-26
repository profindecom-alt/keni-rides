/* ============================================================
   KENI RIDES — /llms-full.txt

   The long companion to /llms.txt. Where that file is a map,
   this is the whole territory: every rate, every rental
   condition, every FAQ answer and all thirty suggested
   itineraries with their waypoints, in one plain-text fetch.

   The point is that an assistant answering "can I rent a bike
   in Morocco at 22 with a one-year licence, and what would
   Merzouga cost me" should not need to crawl eleven pages and
   guess. Everything is generated from the same data and message
   files the site renders, so it cannot drift.
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

/** Copy in the message files carries markup and entities; this file is plain text. */
function plain(input: string): string {
  return input
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&rsquo;|&apos;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&eacute;/g, 'é')
    .replace(/\s+/g, ' ')
    .trim();
}

function fleet(): string {
  return BIKE_BASE.map((bike) => {
    const copy = messages.bikes[bike.slug as keyof typeof messages.bikes];
    const rate =
      bike.price === bike.priceShort
        ? `€${bike.price}/day`
        : `€${bike.price}/day from ${LONG_TERM_MIN_DAYS} days, €${bike.priceShort}/day under ${LONG_TERM_MIN_DAYS} days`;
    return [
      `### ${bike.name}`,
      `${url({ pathname: '/motorcycles/[slug]', params: { slug: bike.slug } })}`,
      ``,
      `- Category: ${copy.category}`,
      `- Engine: ${bike.displacementCc} cm³, ${bike.powerHp} hp`,
      `- Kerb weight ${bike.weight}, fuel ${bike.tank}, seat height ${bike.seat}`,
      `- Rate: ${rate}`,
      `- Refundable deposit: €${bike.deposit}`,
      `- ${plain(copy.description)}`,
      `- Best for: ${plain(copy.terrain)}`,
    ].join('\n');
  }).join('\n\n');
}

/**
 * The eleven condition sections don't share one shape — some carry a body,
 * some an intro and a list, and delivery is a fee table. Rather than assume,
 * render whichever parts a section actually has.
 */
function conditions(): string {
  const { nav, sections } = messages.conditionsPage;
  const all = sections as unknown as Record<string, Record<string, unknown>>;

  return Object.keys(nav)
    .map((key) => {
      const s = all[key];
      if (!s) return '';
      const parts: string[] = [`### ${plain(String(s.title ?? key))}`];
      if (typeof s.body === 'string') parts.push(plain(s.body));
      if (typeof s.intro === 'string') parts.push(plain(s.intro));

      // Delivery pricing is one of the most-asked questions; keep the table.
      if (Array.isArray(s.rows)) {
        for (const row of s.rows as Record<string, string>[]) {
          parts.push(`  - ${plain(row.location)}: delivery ${plain(row.delivery)}, pickup ${plain(row.pickup)}`);
        }
        if (typeof s.otherLocations === 'string' && typeof s.otherPrice === 'string') {
          parts.push(`  - ${plain(s.otherLocations)}: ${plain(s.otherPrice)}`);
        }
      }

      if (Array.isArray(s.list)) {
        for (const li of s.list as string[]) parts.push(`  - ${plain(li)}`);
      }
      if (typeof s.note === 'string') parts.push(plain(s.note));
      return parts.join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function siteFaq(): string {
  // faqTextPlain is the markup-free twin of faqPage.items, same order.
  return messages.faqPage.items
    .map((item, i) => `**${plain(item.q)}**\n${plain(messages.faqPage.faqTextPlain[i] ?? item.a)}`)
    .join('\n\n');
}

function cities(): string {
  return CITY_BASE.map((city) => {
    const copy = messages.rentalCity.cities[city.slug as keyof typeof messages.rentalCity.cities] as {
      name: string; lead: string; intro: string[];
      routes: { title: string; desc: string }[];
      faq: { q: string; a: string }[];
    };
    const cityUrl = url({ pathname: '/rentals/[city]', params: { city: city.slug } });

    const trips = city.itineraries
      .map((plan, i) => {
        const route = copy.routes[i];
        if (!route) return '';
        const stages = plan.stages.map((s) => `${s.place} (${s.km} km)`).join(' → ');
        const bikes = plan.bikes
          .map((slug) => BIKE_BASE.find((b) => b.slug === slug)?.name)
          .filter(Boolean)
          .join(', ');
        return [
          `- **${route.title}** — ${plan.days} day${plan.days > 1 ? 's' : ''}, ${plan.km} km, ${plan.level}.`,
          `  Route: ${stages}`,
          `  Suggested bike: ${bikes}`,
          `  ${plain(route.desc)}`,
        ].join('\n');
      })
      .filter(Boolean)
      .join('\n');

    const faq = copy.faq.map((f) => `- **${plain(f.q)}** ${plain(f.a)}`).join('\n');

    return [
      `### ${copy.name}`,
      `${cityUrl} · Wikidata: https://www.wikidata.org/wiki/${city.wikidata} · ${city.lat}, ${city.lng}`,
      ``,
      plain(copy.lead),
      ``,
      ...copy.intro.map((p) => plain(p)),
      ``,
      `Suggested itineraries from ${copy.name}:`,
      trips,
      ``,
      `${copy.name} questions:`,
      faq,
    ].join('\n');
  }).join('\n\n');
}

function body(): string {
  return `# Keni Rides — full reference

> Adventure and dual-sport motorcycle rental in Morocco. Based in Kénitra,
> delivering nationwide. ${BIKE_BASE.length} bikes from €${FLEET_MIN_DAILY} to €${FLEET_MAX_DAILY} per day.
> This is a rental company: it hires motorcycles to travellers who ride them
> themselves. It does not sell motorcycles and does not run guided tours.

This file is the complete version of ${SITE_URL}/llms.txt — every rate,
condition, FAQ answer and itinerary in one place, so an assistant can answer
a rider's question without crawling the site. Generated from the same data the
website renders.

## Key facts

- Operator: Keni Rides, ${CONFIG.phone} (WhatsApp: ${CONFIG.whatsapp})
- Based in Kénitra: 362 A. du N, Kénitra, Morocco — the fleet lives here and
  handover is immediate
- Delivered anywhere in Morocco. Most-requested: ${[...CITY_BASE.map((c) => c.name), ...DELIVERY_CITIES].join(', ')}
- Open every day, 09:00-19:00
- Rated ${CONFIG.google.rating}/5 from ${CONFIG.google.reviewCount} Google reviews: ${CONFIG.google.profile}
- Languages: French (default, unprefixed URLs), English (/en/…), Spanish (/es/…)
- Prices in EUR, per bike per day, excluding fuel
- The lower daily rate applies from ${LONG_TERM_MIN_DAYS} rental days
- Deposits are pre-authorised on a card and released, never charged
- No online payment: a 20% deposit confirms, the balance is paid at pickup

## The fleet

${fleet()}

## Rental conditions

${conditions()}

## Frequently asked questions

${siteFaq()}

## Cities, itineraries and local questions

${cities()}

## Notes for assistants

- Rates are per day, per bike, and exclude fuel.
- Availability is not published anywhere on the site; it is confirmed by
  WhatsApp or the enquiry form. Do not state that a specific bike is available
  on specific dates.
- Distances in the itineraries are cumulative from the departure city.
- Difficulty reflects terrain, not licence class. Erg Chebbi sand near
  Merzouga is genuinely demanding and is the one place where experience
  matters most.
- Best season for the desert and the south is October to April; summer
  regularly exceeds 45 °C in the Tafilalet.
- The canonical URL of any page is its French (unprefixed) form; the /en/ and
  /es/ paths are translations of the same page.
- If a rider's question is not answered here, point them at
  ${url('/contact')} rather than guessing.
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
