import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import FallbackImg from '@/components/FallbackImg';
import Reveal from '@/components/Reveal';
import { CONFIG } from '@/lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });
  return pageMetadata({ locale, href: '/about', title: t('title'), description: t('description') });
}

const REGION_IMAGES = ['/gallery/DSC04394.jpg', '/gallery/DSC01895.jpg', '/gallery/agence-01.jpg', '/gallery/agence-02.jpg'];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('aboutPage');
  const tNav = useTranslations('nav');
  const paragraphs = t.raw('founder.paragraphs') as string[];
  const regions = t.raw('regions.items') as { tag: string; name: string; desc: string }[];
  const values = t.raw('values.items') as { title: string; desc: string }[];

  return (
    <>
      <PageHero
        image="/gallery/DSC01210.jpg"
        imageAlt="Keni Rides group at a mountain viewpoint in Morocco"
        placeholderLabel="The Story"
        crumbLabel={tNav('about')}
        title={t('heroTitle')}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '10%', right: '-15%' }} /></div>
        <div className="container split">
          <Reveal as="div" className="split-media" direction="left">
            <FallbackImg src="/founder.webp" alt="Mohamed (Simo) Bennis, founder of Keni Rides, with his motorcycle" placeholderLabel="Simo Bennis" />
            <span className="media-caption">{t('founder.caption')}</span>
          </Reveal>
          <Reveal as="div" direction="right">
            <p className="eyebrow">{t('founder.eyebrow')}</p>
            <h2 style={{ textTransform: 'none' }}>{t('founder.title')}</h2>
            <div style={{ display: 'grid', gap: '1.1rem', marginTop: '1.2rem', color: 'var(--text-2)', fontSize: '1.05rem' }}>
              {paragraphs.map((p, i) => (
                // eslint-disable-next-line react/no-danger
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
            <div style={{ marginTop: '2rem' }} className="hero-actions">
              <Link className="btn btn-primary" href="/motorcycles">{t('founder.rideWithUs')}</Link>
              <a className="btn btn-ghost" href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">{t('founder.sayHello')}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('regions.eyebrow')}</p>
            <h2>{t('regions.titleStart')}<span className="text-gradient">{t('regions.titleEmphasis')}</span></h2>
          </Reveal>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {regions.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1}>
                <Link href="/gallery" className="route-card">
                  <FallbackImg src={REGION_IMAGES[i]} alt={r.name} placeholderLabel={r.name} />
                  <div className="route-card-body">
                    <span className="route-tag">{r.tag}</span>
                    <h3>{r.name}</h3>
                    <p>{r.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('values.eyebrow')}</p>
            <h2>{t('values.title')}</h2>
          </Reveal>
          <div className="grid grid-3">
            {values.map((v, i) => (
              <Reveal as="div" className="feature-card" key={v.title} delay={i * 0.08}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {i === 0 && <path d="M19 14c1.5-1.4 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.1 3 5.5l7 7z"/>}
                    {i === 1 && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>}
                    {i === 2 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/></>}
                  </svg>
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span></h2>
            <p>{t('cta.lead')}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/motorcycles">{t('cta.explore')}</Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">{t('cta.contact')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
