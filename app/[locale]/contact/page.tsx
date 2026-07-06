import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import { CONFIG } from '@/lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return pageMetadata({ locale, href: '/contact', title: t('title'), description: t('description') });
}

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Keni Rides',
  url: 'https://keni-rides.com',
  telephone: '+212616712266',
  areaServed: 'Morocco',
  address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
  openingHours: 'Mo-Su 09:00-19:00',
  sameAs: [CONFIG.social.facebook, CONFIG.social.instagram, CONFIG.social.youtube],
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactContent />
    </>
  );
}

function ContactContent() {
  const t = useTranslations('contactPage');
  const tNav = useTranslations('nav');

  return (
    <>
      <PageHero
        image="/gallery/DSC05655.jpg"
        imageAlt="Keni Rides riders sharing a moment together"
        placeholderLabel="Say Salam"
        crumbLabel={tNav('contact')}
        title={<>{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span></>}
        lead={t('heroLead')}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: 0, left: '-18%' }} /></div>
        <div className="container">
          <div className="detail-layout">
            <div>
              <Reveal as="div" className="section-head">
                <p className="eyebrow">{t('reach.eyebrow')}</p>
                <h2 style={{ textTransform: 'none', fontSize: 'clamp(1.4rem, 2.6vw, 2rem)' }}>{t('reach.title')}</h2>
              </Reveal>
              <div className="grid grid-2">
                <Reveal as="a" className="contact-tile" href={CONFIG.phoneHref}>
                  <span className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></span>
                  <span><h3>{t('tiles.phone')}</h3><span className="value">{CONFIG.phone}</span></span>
                </Reveal>
                <Reveal as="a" className="contact-tile" href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" delay={0.05}>
                  <span className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
                  <span><h3>{t('tiles.whatsapp')}</h3><span className="value">{t('tiles.whatsappValue')}</span></span>
                </Reveal>
                <Reveal as="div" className="contact-tile" delay={0.1}>
                  <span className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
                  <span><h3>{t('tiles.bases')}</h3><p>{t('tiles.basesValue')}<br />{t('tiles.basesValue2')}</p></span>
                </Reveal>
                <Reveal as="div" className="contact-tile" delay={0.15}>
                  <span className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
                  <span><h3>{t('tiles.hours')}</h3><p>{t('tiles.hoursValue')}<br />{t('tiles.hoursValue2')}</p></span>
                </Reveal>
              </div>

              <Reveal as="div" style={{ marginTop: '1.8rem' }}>
                <h3 style={{ marginBottom: '0.8rem' }}>{t('follow')}</h3>
                <div className="socials">
                  <a href={CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Keni Rides on Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg></a>
                  <a href={CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Keni Rides on Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>
                  <a href={CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Keni Rides on YouTube"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg></a>
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal as="div" className="form-card" direction="right">
                <h2 style={{ textTransform: 'none', fontSize: '1.25rem', marginBottom: '1.4rem' }}>{t('formTitle')}</h2>
                <ContactForm />
              </Reveal>
            </div>
          </div>

          <Reveal as="div" style={{ marginTop: '3.5rem' }}>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54339.83625566703!2d-8.038169!3d31.6294723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakesh!5e0!3m2!1sen!2sma!4v1700000000000!5m2!1sen!2sma"
                title="Keni Rides location · Marrakech, Morocco"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>{t('mapCaption')}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
