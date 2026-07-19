import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Reveal from '@/components/Reveal';
import ParallaxHero from '@/components/ParallaxHero';
import Counter from '@/components/Counter';
import FleetGrid from '@/components/FleetGrid';
import Marquee from '@/components/Marquee';
import FallbackImg from '@/components/FallbackImg';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { mergeBikes, pickBikes, type BikeTranslation } from '@/lib/bikes';
import { CONFIG } from '@/lib/config';
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

const FEATURED_SLUGS = [
  'bmw-gs1200-adventure',
  'yamaha-tenere-700-world-raid',
  'yamaha-tenere-700',
  'bmw-f800gs-adventure',
  'suzuki-dr650',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    href: '/',
    title: t('home.title'),
    description: t('siteDescription'),
    absoluteTitle: true,
  });
}

const STAR = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"/></svg>
);
const FIVE_STARS = <div className="stars" aria-label="5 out of 5 stars">{STAR}{STAR}{STAR}{STAR}{STAR}</div>;

const GALLERY_STRIP: { src: string; size?: 'wide' }[] = [
  { src: '/gallery/DSC01210.jpg', size: 'wide' },
  { src: '/gallery/DSC01332.jpg' },
  { src: '/gallery/DSC01352.jpg' },
  { src: '/gallery/DSC01895.jpg' },
  { src: '/gallery/DSC01993.jpg' },
  { src: '/gallery/DSC02225.jpg', size: 'wide' },
];

const DEST_IMAGES = ['/destinations/sahara.webp', '/destinations/atlas.webp', '/destinations/mediterranee.webp', '/destinations/atlantique.webp'];

const FEATURE_ICONS = [
  <path key="1" d="m12 15 2 5 3-9 4-1-9-8-1 4-9 3 9 4z" transform="rotate(45 12 12)" />,
  <path key="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  <path key="3" d="M14 17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9m0 12 4.5 2.5V4.5L14 7m0 10V7" />,
  <g key="4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g>,
  <g key="5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></g>,
  <path key="6" d="M12 2a5 5 0 0 0-5 5v3H5l-1 4h3v8h10v-8h3l-1-4h-2V7a5 5 0 0 0-5-5Z" />,
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('home');
  const tRoot = useTranslations();
  const tGallery = useTranslations('galleryPage');
  const tCommon = useTranslations('common');

  const bikes = mergeBikes(tRoot.raw('bikes') as Record<string, BikeTranslation>);
  const featured = pickBikes(bikes, FEATURED_SLUGS);
  const destinations = t.raw('destinations.items') as { tag: string; name: string; desc: string }[];
  const features = t.raw('why.features') as { title: string; desc: string }[];
  const checklist = t.raw('founder.checklist') as { strong: string; text: string }[];
  const steps = t.raw('how.steps') as { title: string; desc: string }[];
  const reviews = tRoot.raw('reviews') as { quote: string; initials: string; name: string; loc: string }[];
  const galleryImages = tGallery.raw('images') as { alt: string; label: string }[];

  return (
    <>
      {/* HERO — full-bleed cinematic */}
      <section className="hero">
        <ParallaxHero
          src="/gallery/DSC02225.jpg"
          alt="Motorcycle blasting through desert dunes in Morocco"
          placeholderLabel="Ride Morocco"
          speed={0.18}
          fetchPriority="high"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container">
          <div className="hero-content">
            <p className="hero-kicker"><span className="dot" aria-hidden="true" /> {t('heroKicker')}</p>
            <Reveal as="h1">{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span> {t('heroTitleEnd')}</Reveal>
            <Reveal as="p" className="lead" delay={0.1}>{t('heroLead')}</Reveal>
            <Reveal as="div" className="hero-actions" delay={0.2}>
              <Link className="btn btn-primary btn-lg" href="/motorcycles">
                {t('exploreFleet')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/testimonials">{t('watchStories')}</Link>
            </Reveal>
            <Reveal as="div" className="hero-stats" delay={0.3}>
              <div className="stat"><strong><Counter value={35} suffix="+" /></strong><span>{t('stats.bikes')}</span></div>
              <div className="stat"><strong><Counter value={4} /></strong><span>{t('stats.regions')}</span></div>
              <div className="stat"><strong><Counter value={500} suffix="+" /></strong><span>{t('stats.riders')}</span></div>
              <div className="stat"><strong>24/7</strong><span>{t('stats.support')}</span></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee text={t('marquee')} />

      {/* FLEET PREVIEW */}
      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '-10%', left: '-15%' }} /></div>
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">{t('fleet.eyebrow')}</p>
            <h2>{t('fleet.titleStart')}<span className="text-gradient">{t('fleet.titleEmphasis')}</span></h2>
            <p className="lead">{t('fleet.lead')}</p>
          </Reveal>
          <FleetGrid bikes={featured} />
          <Reveal as="div" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="btn btn-ghost btn-lg" href="/motorcycles">
              {t('fleet.seeAll')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FOUNDER TEASER — L'Histoire, directly after the fleet */}
      <section className="section section-dark">
        <div className="container split">
          <Reveal as="div" className="split-media" direction="left">
            <FallbackImg src="/founder.webp" alt="Mohamed (Simo) Bennis, founder of Keni Rides" placeholderLabel="Simo Bennis" />
            <span className="media-caption">{t('founder.caption')}</span>
          </Reveal>
          <Reveal as="div" direction="right">
            <p className="eyebrow">{t('founder.eyebrow')}</p>
            <h2>{t('founder.title')}</h2>
            <p className="lead" style={{ marginTop: '1rem' }}>{t('founder.lead')}</p>
            <ul className="checklist">
              {checklist.map((item) => (
                <li key={item.strong}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                  <span><strong>{item.strong}</strong>, {item.text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '2rem' }}>
              <Link className="link-arrow" href="/about">{t('founder.meetFounder')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIAL VIDEOS + PREVIEW */}
      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '-10%', right: '-15%' }} /></div>
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('stories.eyebrow')}</p>
            <h2>{t('stories.title')}</h2>
            <p className="lead">{t('stories.videosLead')}</p>
          </Reveal>
          <div className="grid grid-2" style={{ marginBottom: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            <Reveal as="div"><YouTubeEmbed videoId="9nKm-KqKiLo" title="Keni Rides rider testimonial 1" /></Reveal>
            <Reveal as="div" delay={0.1}><YouTubeEmbed videoId="6TvE1ueoDvg" title="Keni Rides rider testimonial 2" /></Reveal>
          </div>
          <div className="grid grid-3">
            {reviews.slice(0, 3).map((r, i) => (
              <Reveal as="figure" className="quote-card" key={r.name} delay={i * 0.1}>
                {FIVE_STARS}
                <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="avatar" role="img" aria-label="Google">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.63H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.37l4.01-3.09Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.63l4.01 3.09C6.22 6.86 8.87 4.75 12 4.75Z"/></svg>
                  </span>
                  <span><strong>{r.name}</strong><span>{r.loc}</span></span>
                </figcaption>
              </Reveal>
            ))}
          </div>
          <Reveal as="div" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="link-arrow" href="/testimonials">{t('stories.watchVideos')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('how.eyebrow')}</p>
            <h2>{t('how.title')}</h2>
            <p className="lead">{t('how.lead')}</p>
          </Reveal>
          <div className="grid grid-3">
            {steps.map((s, i) => (
              <Reveal as="div" className="feature-card" key={s.title} delay={i * 0.12} style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ marginInline: 'auto' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow g2" style={{ bottom: '-20%', right: '-10%' }} /></div>
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">{t('destinations.eyebrow')}</p>
            <h2>{t('destinations.titleStart')}<span className="text-gradient">{t('destinations.titleEmphasis')}</span></h2>
            <p className="lead">{t('destinations.lead')}</p>
          </Reveal>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {destinations.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.1}>
                <Link href="/gallery" className="route-card">
                  <FallbackImg src={DEST_IMAGES[i]} alt={d.name} placeholderLabel={d.name} />
                  <div className="route-card-body">
                    <span className="route-tag">{d.tag}</span>
                    <h3>{d.name}</h3>
                    <p>{d.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY KENI */}
      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('why.eyebrow')}</p>
            <h2>{t('why.title')}</h2>
            <p className="lead">{t('why.lead')}</p>
          </Reveal>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <Reveal as="div" className="feature-card" key={f.title} delay={(i % 3) * 0.08}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{FEATURE_ICONS[i]}</svg>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="section">
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">{t('journey.eyebrow')}</p>
            <h2>{t('journey.title')}</h2>
          </Reveal>
          <div className="gallery-grid">
            {GALLERY_STRIP.map((g, i) => (
              <Reveal as="div" className={`gallery-item${g.size ? ` ${g.size}` : ''}`} key={g.src} delay={(i % 3) * 0.06}>
                <FallbackImg src={g.src} alt={galleryImages[i]?.alt || ''} placeholderLabel={galleryImages[i]?.label || ''} />
              </Reveal>
            ))}
          </div>
          <Reveal as="div" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="btn btn-ghost" href="/gallery">{t('journey.openGallery')}</Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span>{t('cta.titleEnd')}</h2>
            <p>{t('cta.lead')}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/motorcycles">{tCommon('bookYourMotorcycle')}</Link>
              <a className="btn btn-ghost btn-lg" href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">{tCommon('chatWhatsapp')}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
