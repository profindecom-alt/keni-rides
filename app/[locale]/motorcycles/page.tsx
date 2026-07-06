import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import FleetGrid from '@/components/FleetGrid';
import FallbackImg from '@/components/FallbackImg';
import Reveal from '@/components/Reveal';
import { mergeBikes, type BikeTranslation } from '@/lib/bikes';
import { CONFIG } from '@/lib/config';
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.motorcycles' });
  return pageMetadata({ locale, href: '/motorcycles', title: t('title'), description: t('description') });
}

export default async function MotorcyclesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MotorcyclesContent />;
}

function MotorcyclesContent() {
  const t = useTranslations('motorcyclesPage');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tBikes = useTranslations();
  const bikes = mergeBikes(tBikes.raw('bikes') as Record<string, BikeTranslation>);
  const items = t.raw('goodToKnow.items') as { title: string; desc: string }[];

  return (
    <>
      <PageHero
        image="/gallery/DSC03230.jpg"
        imageAlt="Rider standing on the pegs crossing the Moroccan desert"
        placeholderLabel="The Fleet"
        crumbLabel={tNav('motorcycles')}
        title={<>{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span></>}
        lead={t('heroLead')}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '5%', right: '-15%' }} /></div>
        <div className="container">
          <FleetGrid bikes={bikes} />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('goodToKnow.eyebrow')}</p>
            <h2>{t('goodToKnow.title')}</h2>
          </Reveal>
          <div className="grid grid-3">
            {items.map((item, i) => (
              <Reveal as="div" className="feature-card" key={item.title} delay={i * 0.08}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {i === 0 && <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}
                    {i === 1 && <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>}
                    {i === 2 && <path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M5 17H3v-4l2-5h9l4 5h3v4h-2"/>}
                  </svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal as="div" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="link-arrow" href="/conditions">{t('readConditions')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span>{t('cta.titleEnd')}</h2>
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
