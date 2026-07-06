import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Reveal from './Reveal';
import FallbackImg from './FallbackImg';
import { getBikeImage, type Bike } from '@/lib/bikes';

export default function BikeCard({ bike, delay = 0 }: { bike: Bike; delay?: number }) {
  const t = useTranslations('common');
  const href = { pathname: '/motorcycles/[slug]', params: { slug: bike.slug } } as const;
  return (
    <Reveal as="article" className="bike-card" delay={delay}>
      <Link className="bike-card-media" href={href} tabIndex={-1} aria-hidden="true">
        <span className="bike-badge">{bike.category}</span>
        <FallbackImg
          src={getBikeImage(bike.slug)}
          alt={bike.name}
          placeholderLabel={bike.short}
          width={800}
          height={600}
        />
      </Link>
      <div className="bike-card-body">
        <h3><Link href={href}>{bike.name}</Link></h3>
        <div className="bike-card-specs">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>
            {bike.engine}
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>
            {bike.power}
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22c4 0 7-3.1 7-7 0-4.5-4.6-9.7-6.3-11.5a1 1 0 0 0-1.4 0C9.6 5.3 5 10.5 5 15c0 3.9 3 7 7 7Z"/></svg>
            {bike.tank}
          </span>
        </div>
        <div className="bike-card-foot">
          <p className="price"><small>{t('from')}</small><strong>&euro;{bike.price} <em>{t('perDay')}</em></strong></p>
          <Link className="btn btn-ghost" href={href}>{t('viewAndBook')}</Link>
        </div>
      </div>
    </Reveal>
  );
}
