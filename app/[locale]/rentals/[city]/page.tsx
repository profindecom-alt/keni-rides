import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import FleetGrid from '@/components/FleetGrid';
import FallbackImg from '@/components/FallbackImg';
import Reveal from '@/components/Reveal';
import { routing } from '@/i18n/routing';
import { CITY_SLUGS, findCity, type CityBase } from '@/lib/cities';
import { mergeBikes, type BikeTranslation } from '@/lib/bikes';
import { CONFIG } from '@/lib/config';
import { pageMetadata, absoluteUrl } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CITY_SLUGS.map((city) => ({ locale, city })));
}

interface PageProps {
  params: Promise<{ locale: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, city } = await params;
  const c = findCity(city);
  if (!c) return {};

  const t = await getTranslations({ locale, namespace: 'rentalCity' });
  return pageMetadata({
    locale,
    href: { pathname: '/rentals/[city]', params: { city: c.slug } },
    title: t('metaTitle', { city: c.name }),
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
  const faq = t.raw(`cities.${c.slug}.faq`) as { q: string; a: string }[];
  const cityUrl = absoluteUrl(locale, { pathname: '/rentals/[city]', params: { city: c.slug } });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tNav('home'), item: absoluteUrl(locale, '/') },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbLabel', { city: c.name }), item: cityUrl },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd]) }}
      />
      <RentalCityContent city={c} />
    </>
  );
}

function RentalCityContent({ city }: { city: CityBase }) {
  const t = useTranslations('rentalCity');
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
        imageAlt={t('heroAlt', { city: city.name })}
        placeholderLabel={city.name}
        crumbLabel={t('breadcrumbLabel', { city: city.name })}
        title={<>{t('heroTitle')} <span className="text-gradient">{city.name}</span></>}
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
            <h2>{t('routesTitle', { city: city.name })}</h2>
          </Reveal>
          <div className="grid grid-3">
            {routes.map((r, i) => (
              <Reveal as="div" className="feature-card" key={r.title} delay={i * 0.08}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 20 3 17V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13"/></svg>
                </div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('fleetEyebrow')}</p>
            <h2>{t('fleetTitle', { city: city.name })}</h2>
            <p className="lead" style={{ maxWidth: '60ch', margin: '0.6rem auto 0' }}>{t('fleetLead', { city: city.name })}</p>
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.title', { city: city.name })}</h2>
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
