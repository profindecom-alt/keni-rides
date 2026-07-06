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
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return pageMetadata({ locale, href: '/faq', title: t('title'), description: t('description') });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'faqPage' });
  const items = t.raw('items') as { q: string; a: string }[];
  const plainText = t.raw('faqTextPlain') as string[];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item, i) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: plainText[i] },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqContent items={items} />
    </>
  );
}

function FaqContent({ items }: { items: { q: string; a: string }[] }) {
  const t = useTranslations('faqPage');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <>
      <PageHero
        image="/gallery/DSC02225.jpg"
        imageAlt="Motorcycle riding through a mountain pass at dusk"
        placeholderLabel="Questions"
        crumbLabel={tNav('faq')}
        title={<>{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span></>}
        lead={<>{t('heroLeadStart')} <Link href="/contact" style={{ color: 'var(--brand-bright)', fontWeight: 600 }}>{t('heroLeadLink')}</Link>.</>}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '30%', left: '-18%' }} /></div>
        <div className="container">
          <div className="faq-list">
            {items.map((item, i) => (
              <Reveal as="details" className="faq-item" key={item.q} delay={(i % 6) * 0.05} {...(i === 0 ? { open: true } : {})}>
                <summary>
                  {item.q}
                  <span className="chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
                </summary>
                <div className="faq-body">
                  {/* eslint-disable-next-line react/no-danger */}
                  <p dangerouslySetInnerHTML={{ __html: item.a }} />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal as="div" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.2rem' }}>{t('readFinePrint')}</p>
            <Link className="btn btn-ghost btn-lg" href="/conditions">{t('fullConditions')}</Link>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span></h2>
            <p>{t('cta.lead')}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/motorcycles">{tCommon('bookYourMotorcycle')}</Link>
              <a className="btn btn-ghost btn-lg" href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">{t('cta.askWhatsapp')}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
