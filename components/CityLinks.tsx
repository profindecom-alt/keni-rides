import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Reveal from './Reveal';
import { CITY_BASE } from '@/lib/cities';

/**
 * Cross-links every fleet page to the city rental landing pages.
 *
 * Search Console showed 76% of clicks landing on the homepage while the bike
 * and city pages barely ranked — the deep pages had almost no internal links
 * pointing at them apart from the footer. The city pages already link out to
 * every bike (via FleetGrid); this closes the loop in the other direction.
 * The anchor text deliberately mirrors the target page's keyword
 * ("location moto <city>") rather than describing the current page.
 *
 * @param exclude slug of the city page currently being viewed, so it doesn't self-link.
 */
export default function CityLinks({ dark = false, exclude }: { dark?: boolean; exclude?: string }) {
  const t = useTranslations('cityLinks');
  const cities = exclude ? CITY_BASE.filter((c) => c.slug !== exclude) : CITY_BASE;
  if (cities.length === 0) return null;

  return (
    <section className={dark ? 'section section-dark' : 'section'}>
      <div className="container">
        <Reveal as="div" className="section-head center">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2>{t('title')}</h2>
          <p className="lead" style={{ maxWidth: '60ch', margin: '0.6rem auto 0' }}>{t('lead')}</p>
        </Reveal>
        <Reveal as="nav" className="hero-actions" style={{ justifyContent: 'center' }} aria-label={t('title')}>
          {cities.map((c) => (
            <Link
              key={c.slug}
              className="btn btn-ghost"
              href={{ pathname: '/rentals/[city]', params: { city: c.slug } }}
            >
              {t('linkLabel', { city: c.name })}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
