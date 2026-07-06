import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>{t('eyebrow')}</p>
        <h1>{t('title')}</h1>
        <p className="lead" style={{ margin: '1rem auto 2rem' }}>
          {t('lead')}
        </p>
        <Link className="btn btn-primary btn-lg" href="/">{t('back')}</Link>
      </div>
    </section>
  );
}
