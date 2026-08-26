import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import FleetGrid from '@/components/FleetGrid';
import CityLinks from '@/components/CityLinks';
import FallbackImg from '@/components/FallbackImg';
import Reveal from '@/components/Reveal';
import { routing } from '@/i18n/routing';
import { CITY_SLUGS, findCity, type CityBase } from '@/lib/cities';
import { mergeBikes, type BikeTranslation } from '@/lib/bikes';
import { CONFIG } from '@/lib/config';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import { cityServiceNode, breadcrumbNode, faqNode } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CITY_SLUGS.map((city) => ({ locale, city })));
}

/** '/gallery/moto-dunes-sahara-maroc.jpg' → 'moto-dunes-sahara-maroc', the alt-text key. */
function photoKey(src: string): string {
  return src.split('/').pop()!.replace(/\.\w+$/, '');
}

interface PageProps {
  params: Promise<{ locale: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, city } = await params;
  const c = findCity(city);
  if (!c) return {};

  const t = await getTranslations({ locale, namespace: 'rentalCity' });
  const cityName = t(`cities.${c.slug}.name`);
  return pageMetadata({
    locale,
    href: { pathname: '/rentals/[city]', params: { city: c.slug } },
    title: t('metaTitle', { city: cityName }),
    description: t(`cities.${c.slug}.lead`),
    image: c.heroImage,
  });
}

export default async function RentalCityPage({ params }: PageProps) {
  const { locale, city } = await params;
  setRequestLocale(locale);
  const c = findCity(city);
  if (!c) notFound();

  const t = await getTranslations({ locale, namespace: 'rentalCity' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const cityName = t(`cities.${c.slug}.name`);
  const faq = t.raw(`cities.${c.slug}.faq`) as { q: string; a: string }[];
  const cityUrl = absoluteUrl(locale, { pathname: '/rentals/[city]', params: { city: c.slug } });

  const graph = [
    cityServiceNode({
      city: c,
      cityName,
      url: cityUrl,
      name: t('metaTitle', { city: cityName }),
      description: t(`cities.${c.slug}.lead`),
    }),
    breadcrumbNode([
      { name: tNav('home'), url: absoluteUrl(locale, '/') },
      { name: t('breadcrumbLabel', { city: cityName }), url: cityUrl },
    ]),
    faqNode(faq),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <RentalCityContent city={c} />
    </>
  );
}

function RentalCityContent({ city }: { city: CityBase }) {
  const t = useTranslations('rentalCity');
  const cityName = t(`cities.${city.slug}.name`);
  const tCommon = useTranslations('common');
  const tBikes = useTranslations();
  const bikes = mergeBikes(tBikes.raw('bikes') as Record<string, BikeTranslation>);

  const intro = t.raw(`cities.${city.slug}.intro`) as string[];
  const routes = t.raw(`cities.${city.slug}.routes`) as { title: string; desc: string }[];
  const faq = t.raw(`cities.${city.slug}.faq`) as { q: string; a: string }[];

  return (
    <>
      <PageHero
        image={city.heroImage}
        imageAlt={t('heroAlt', { city: cityName })}
        placeholderLabel={cityName}
        crumbLabel={t('breadcrumbLabel', { city: cityName })}
        title={<>{t('heroTitle')} <span className="text-gradient">{cityName}</span></>}
        lead={t(`cities.${city.slug}.lead`)}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '5%', right: '-15%' }} /></div>
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">{t('introEyebrow')}</p>
          </Reveal>
          <div style={{ maxWidth: '70ch' }}>
            {intro.map((p, i) => (
              <Reveal
                as="p"
                key={p}
                delay={i * 0.06}
                className={i === 0 ? 'lead' : ''}
                style={{ marginBottom: '1.2rem', color: i === 0 ? undefined : 'var(--text-2)' }}
              >
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('routesEyebrow')}</p>
            <h2>{t('routesTitle', { city: cityName })}</h2>
          </Reveal>
          {/* Each translated route is paired with its measured itinerary from
              lib/cities: duration, distance, difficulty, the waypoints and the
              bikes we would actually suggest for that terrain. */}
          <div className="itinerary-grid">
            {routes.map((r, i) => {
              const plan = city.itineraries[i];
              if (!plan) return null;
              return (
                <Reveal as="article" className="itinerary-card" key={r.title} delay={i * 0.08}>
                  <div className="itinerary-photo">
                    {/* Alt text describes the photo itself, keyed off its
                        filename, rather than repeating the route title — the
                        same shot is reused across cities and image search is
                        this site's biggest impression source. */}
                    <FallbackImg
                      src={plan.image}
                      alt={tCommon(`photoAlt.${photoKey(plan.image)}`)}
                      placeholderLabel={r.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>
                  <div className="itinerary-body">
                    <div className="itinerary-chips">
                      <span className="itinerary-chip is-accent">{t('itinerary.days', { days: plan.days })}</span>
                      <span className="itinerary-chip">{t('itinerary.distance', { km: plan.km })}</span>
                      <span className="itinerary-chip">{t(`itinerary.levels.${plan.level}`)}</span>
                    </div>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>

                    <div className="itinerary-detail">
                      <h4>{t('itinerary.stagesLabel')}</h4>
                      <ol className="itinerary-stages">
                        {plan.stages.map((stage) => (
                          <li key={stage.place}>
                            <span>{stage.place}</span>
                            <span className="km">{stage.km} km</span>
                          </li>
                        ))}
                      </ol>
                      <h4>{t('itinerary.bikeLabel')}</h4>
                      <div className="itinerary-bikes">
                        {plan.bikes.map((slug) => {
                          const bike = bikes.find((b) => b.slug === slug);
                          return bike ? (
                            <Link key={slug} href={{ pathname: '/motorcycles/[slug]', params: { slug } }}>
                              {bike.short}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('fleetEyebrow')}</p>
            <h2>{t('fleetTitle', { city: cityName })}</h2>
            <p className="lead" style={{ maxWidth: '60ch', margin: '0.6rem auto 0' }}>{t('fleetLead', { city: cityName })}</p>
          </Reveal>
          <FleetGrid bikes={bikes} />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('faqEyebrow')}</p>
            <h2>{t('faqTitle')}</h2>
          </Reveal>
          <div className="faq-list">
            {faq.map((f, i) => (
              <Reveal as="details" className="faq-item" key={f.q} delay={(i % 6) * 0.05} {...(i === 0 ? { open: true } : {})}>
                <summary>
                  {f.q}
                  <span className="chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
                </summary>
                <div className="faq-body">
                  <p>{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Every city page links to the other nine, so the ten of them reinforce
          each other instead of each depending on the homepage for link equity. */}
      <CityLinks exclude={city.slug} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/moto-piste-poussiere-montagne-maroc.jpg" alt="" placeholderLabel="" fill sizes="100vw" />
            <h2>{t('cta.title', { city: cityName })}</h2>
            <p>{t('cta.lead')}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">{t('cta.button')}</Link>
              <a className="btn btn-ghost btn-lg" href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">{tCommon('chatWhatsapp')}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
