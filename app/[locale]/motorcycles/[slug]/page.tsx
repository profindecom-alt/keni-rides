import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import FleetGrid from '@/components/FleetGrid';
import BookingPanel from '@/components/BookingPanel';
import Reveal from '@/components/Reveal';
import ParallaxHero from '@/components/ParallaxHero';
import BikeViewer3D from '@/components/BikeViewer3D';
import BikeGallery from '@/components/BikeGallery';
import { routing } from '@/i18n/routing';
import { BIKE_SLUGS, findBike, getBikeImage, getBikeGallery, getSimilarBikes, mergeBikes, type Bike, type BikeTranslation } from '@/lib/bikes';
import { has3DModel, get3DModelPath } from '@/lib/models3d';
import { pageMetadata, absoluteUrl, SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => BIKE_SLUGS.map((slug) => ({ locale, slug })));
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function loadBike(locale: string, slug: string): Promise<Bike | undefined> {
  const t = await getTranslations({ locale });
  const bikes = mergeBikes(t.raw('bikes') as Record<string, BikeTranslation>);
  return findBike(bikes, slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const bike = await loadBike(locale, slug);
  if (!bike) return {};

  const t = await getTranslations({ locale, namespace: 'meta.motorcycleDetail' });

  return pageMetadata({
    locale,
    href: { pathname: '/motorcycles/[slug]', params: { slug: bike.slug } },
    title: `${bike.name} ${t('titleSuffix', { price: bike.price })}`,
    description: bike.tagline,
    image: getBikeImage(bike.slug),
    // Bike names can be long (e.g. "Yamaha Ténéré 700 World Raid"); skip the
    // "| Keni Rides" template so the SERP title stays under the truncation point.
    absoluteTitle: true,
  });
}

export default async function MotorcyclePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const bike = await loadBike(locale, slug);
  if (!bike) notFound();

  const t = await getTranslations({ locale });
  const bikes = mergeBikes(t.raw('bikes') as Record<string, BikeTranslation>);
  const similar = getSimilarBikes(bikes, bike, 3);
  const bikeUrl = absoluteUrl(locale, { pathname: '/motorcycles/[slug]', params: { slug: bike.slug } });

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${bike.name} · Motorcycle Rental Morocco`,
    description: bike.description,
    image: `${SITE_URL}${getBikeImage(bike.slug)}`,
    brand: { '@type': 'Brand', name: bike.name.split(' ')[0] },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(bike.price),
      highPrice: String(bike.priceShort),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: bikeUrl,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absoluteUrl(locale, '/') },
      { '@type': 'ListItem', position: 2, name: t('motorcycleDetail.breadcrumbMotorcycles'), item: absoluteUrl(locale, '/motorcycles') },
      { '@type': 'ListItem', position: 3, name: bike.name, item: bikeUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]) }}
      />
      <MotorcycleDetailContent bike={bike} similar={similar} />
    </>
  );
}

function MotorcycleDetailContent({ bike, similar }: { bike: Bike; similar: Bike[] }) {
  const t = useTranslations('motorcycleDetail');
  const tNav = useTranslations('nav');
  const conditionItems = t.raw('conditions.items') as string[];

  return (
    <>
      <section className="hero hero-sub">
        <ParallaxHero
          src={getBikeImage(bike.slug)}
          alt={`${bike.name} adventure motorcycle`}
          placeholderLabel={bike.short}
          speed={0.18}
          fetchPriority="high"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container">
          <div className="hero-content">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">{tNav('home')}</Link><span className="sep">/</span>
              <Link href="/motorcycles">{t('breadcrumbMotorcycles')}</Link><span className="sep">/</span>
              <span aria-current="page">{bike.short}</span>
            </nav>
            <p className="hero-kicker"><span className="dot" aria-hidden="true" /> {bike.category}</p>
            <h1 data-reveal="up" className="in-view">{bike.name}</h1>
            <p className="lead in-view" data-reveal="up">{bike.tagline}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: 0, right: '-20%' }} /></div>
        <div className="container detail-layout">
          {/* 1 · GALLERY */}
          <div className="detail-gallery">
            <Reveal as="div">
              <p className="eyebrow">{t('gallery.eyebrow')}</p>
              <h2 style={{ textTransform: 'none', fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', marginBottom: '1.2rem' }}>{t('gallery.title')}</h2>
              <BikeGallery
                images={getBikeGallery(bike.slug)}
                name={bike.name}
                labels={[t('gallery.main'), t('gallery.front'), t('gallery.side'), t('gallery.rear')]}
                zoomLabel={t('gallery.zoom')}
                closeLabel={t('gallery.close')}
              />
            </Reveal>
          </div>

          {/* 2 · BOOKING FORM + ESTIMATE — sticky buy-box */}
          <div className="detail-book">
            <BookingPanel bike={bike} />
          </div>

          {/* 3 · THE REST — specs, description, 3D, features, conditions */}
          <div className="detail-info">
            <Reveal as="div">
              <p className="eyebrow">{t('whyLoveItEyebrow')}</p>
              <h2 style={{ textTransform: 'none', fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)' }}>{t('whyLoveItTitle')}</h2>
              <p className="lead" style={{ marginTop: '1rem' }}>{bike.description}</p>
            </Reveal>

            <Reveal as="div" className="spec-grid">
              <div className="spec-tile"><span>{t('specs.engine')}</span><strong>{bike.engine}</strong></div>
              <div className="spec-tile"><span>{t('specs.power')}</span><strong>{bike.power}</strong></div>
              <div className="spec-tile"><span>{t('specs.tank')}</span><strong>{bike.tank}</strong></div>
              <div className="spec-tile"><span>{t('specs.seat')}</span><strong>{bike.seat}</strong></div>
              <div className="spec-tile"><span>{t('specs.weight')}</span><strong>{bike.weight}</strong></div>
              <div className="spec-tile"><span>{t('specs.from')}</span><strong>€{bike.price} / day</strong></div>
            </Reveal>

            {has3DModel(bike.slug) ? (
              <Reveal as="div" style={{ marginTop: '2rem' }}>
                <p className="eyebrow">{t('view3d.eyebrow')}</p>
                <h3 style={{ marginBottom: '1rem' }}>{t('view3d.title')}</h3>
                <BikeViewer3D
                  src={get3DModelPath(bike.slug)}
                  alt={`Interactive 3D model of the ${bike.name}`}
                  poster={getBikeImage(bike.slug)}
                />
              </Reveal>
            ) : null}

            <Reveal as="div" className="bike-highlights">
              <p className="eyebrow">{t('featuresEyebrow')}</p>
              <h3 style={{ textTransform: 'none', fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', marginBottom: '0.6rem' }}>{t('featuresTitle')}</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: '1.3rem' }}>
                <strong style={{ color: 'var(--text)' }}>{t('bestTerrain')} :</strong> {bike.terrain}
              </p>
              <ul className="bike-feature-grid">
                {bike.features.map((f) => (
                  <li className="bike-feature" key={f}>
                    <span className="bike-feature-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="div" className="feature-card conditions-summary" style={{ marginTop: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg style={{ width: 20, height: 20, color: 'var(--brand-bright)', flex: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
                {t('conditions.title')}
              </h3>
              <ul className="checklist" style={{ marginTop: '1.1rem' }}>
                {conditionItems.map((c) => (
                  <li key={c}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '1.1rem', color: 'var(--text-2)' }}>{t('included.text')}</p>
              <p style={{ marginTop: '0.8rem' }}>
                <Link className="link-arrow" href="/conditions">{t('conditionsLink')}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">{t('keepExploring')}</p>
            <h2>{t('youMightLike')}</h2>
          </Reveal>
          <FleetGrid bikes={similar} />
        </div>
      </section>
    </>
  );
}
