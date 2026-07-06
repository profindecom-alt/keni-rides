import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import ParallaxHero from './ParallaxHero';

interface PageHeroProps {
  image: string;
  imageAlt: string;
  placeholderLabel: string;
  crumbLabel: string;
  title: ReactNode;
  lead?: ReactNode;
}

export default function PageHero({ image, imageAlt, placeholderLabel, crumbLabel, title, lead }: PageHeroProps) {
  const t = useTranslations('nav');
  return (
    <section className="hero hero-sub">
      <ParallaxHero src={image} alt={imageAlt} placeholderLabel={placeholderLabel} speed={0.18} fetchPriority="high" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container">
        <div className="hero-content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{t('home')}</Link><span className="sep">/</span><span aria-current="page">{crumbLabel}</span>
          </nav>
          <h1 data-reveal="up" className="in-view">{title}</h1>
          {lead && <p className="lead in-view" data-reveal="up">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
