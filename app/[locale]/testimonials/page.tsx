import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import FallbackImg from '@/components/FallbackImg';
import Reveal from '@/components/Reveal';
import { CONFIG } from '@/lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.testimonials' });
  return pageMetadata({ locale, href: '/testimonials', title: t('title'), description: t('description') });
}

const STAR = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"/></svg>
);
const FIVE_STARS = <div className="stars" aria-label="5 out of 5 stars">{STAR}{STAR}{STAR}{STAR}{STAR}</div>;

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TestimonialsContent />;
}

function TestimonialsContent() {
  const t = useTranslations('testimonialsPage');
  const tNav = useTranslations('nav');
  const tReviews = useTranslations();
  const reviews = tReviews.raw('reviews') as { quote: string; initials: string; name: string; loc: string }[];

  return (
    <>
      <PageHero
        image="/gallery/DSC03273.jpg"
        imageAlt="Keni Rides group under an acacia tree in the desert"
        placeholderLabel="Rider Stories"
        crumbLabel={tNav('testimonials')}
        title={<>{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span></>}
        lead={t('heroLead')}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: 0, right: '-15%' }} /></div>
        <div className="container">
          <Reveal as="div" className="section-head">
            <p className="eyebrow">{t('videos.eyebrow')}</p>
            <h2>{t('videos.title')}</h2>
          </Reveal>
          <div className="grid grid-2">
            <Reveal as="div"><YouTubeEmbed videoId="9nKm-KqKiLo" title="Keni Rides rider testimonial 1" /></Reveal>
            <Reveal as="div" delay={0.1}><YouTubeEmbed videoId="6TvE1ueoDvg" title="Keni Rides rider testimonial 2" /></Reveal>
          </div>
          <Reveal as="p" style={{ marginTop: '1.5rem', color: 'var(--text-3)', fontSize: '0.9rem' }}>
            {t('videos.more')}{' '}
            <a href={CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-bright)', fontWeight: 600 }}>{t('videos.youtubeChannel')}</a>.
          </Reveal>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal as="div" className="section-head center">
            <p className="eyebrow">{t('reviews.eyebrow')}</p>
            <h2>{t('reviews.title')}</h2>
          </Reveal>
          <div className="grid grid-3">
            {reviews.map((r, i) => (
              <Reveal as="figure" className="quote-card" key={r.name} delay={(i % 3) * 0.08}>
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span></h2>
            <p>{t('cta.lead')}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/motorcycles">{t('cta.button')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
