import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.conditions' });
  return pageMetadata({ locale, href: '/conditions', title: t('title'), description: t('description') });
}

const SECTION_IDS = [
  'minimumRental', 'age', 'license', 'deposit', 'reservation',
  'documents', 'delivery', 'equipment', 'insurance', 'breakdown', 'terms',
] as const;

const SECTION_ANCHORS: Record<(typeof SECTION_IDS)[number], string> = {
  minimumRental: 'minimum-rental', age: 'age', license: 'license', deposit: 'deposit',
  reservation: 'reservation', documents: 'documents', delivery: 'delivery',
  equipment: 'equipment', insurance: 'insurance', breakdown: 'breakdown', terms: 'terms',
};

const SECTION_ICONS: Record<(typeof SECTION_IDS)[number], React.ReactNode> = {
  minimumRental: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  age: <><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></>,
  license: <><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M14 10h5M14 14h5"/></>,
  deposit: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  reservation: <path d="M20 6 9 17l-5-5"/>,
  documents: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></>,
  delivery: <path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M5 17H3v-4l2-5h9l4 5h3v4h-2"/>,
  equipment: <><path d="M12 2a8 8 0 0 0-8 8v1h10l6 3v-4a8 8 0 0 0-8-8z"/><path d="M4 11v2a8 8 0 0 0 8 8h1"/></>,
  insurance: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
  breakdown: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
  terms: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
};

interface SectionData {
  title: string;
  body?: string;
  intro?: string;
  note?: string;
  list?: string[];
  tableHeaders?: { location: string; delivery: string; pickup: string };
  rows?: { location: string; delivery: string; pickup: string }[];
  otherLocations?: string;
  otherPrice?: string;
}

export default async function ConditionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConditionsContent />;
}

function ConditionsContent() {
  const t = useTranslations('conditionsPage');
  const tFooter = useTranslations('footer');
  const sections = t.raw('sections') as Record<string, SectionData>;

  return (
    <>
      <PageHero
        image="/gallery/DSC02705.jpg"
        imageAlt="Keni Rides team at a garage in Morocco"
        placeholderLabel="The Fine Print"
        crumbLabel={tFooter('rentalConditions')}
        title={<>{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span></>}
        lead={t('heroLead')}
      />

      <section className="section">
        <div className="container conditions-grid">
          <aside className="conditions-nav" aria-label="Conditions sections">
            {SECTION_IDS.map((id) => (
              <a key={id} href={`#${SECTION_ANCHORS[id]}`}>{t(`nav.${id}`)}</a>
            ))}
          </aside>

          <div>
            {SECTION_IDS.map((id) => {
              const section = sections[id];
              return (
                <Reveal as="div" className="condition-block" id={SECTION_ANCHORS[id]} key={id}>
                  <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SECTION_ICONS[id]}</svg>
                    {section.title}
                  </h2>
                  {section.body && <p dangerouslySetInnerHTML={{ __html: section.body }} />}
                  {section.intro && <p>{section.intro}</p>}
                  {section.rows && section.tableHeaders && (
                    <table>
                      <thead><tr><th>{section.tableHeaders.location}</th><th>{section.tableHeaders.delivery}</th><th>{section.tableHeaders.pickup}</th></tr></thead>
                      <tbody>
                        {section.rows.map((row) => (
                          <tr key={row.location}><td>{row.location}</td><td>{row.delivery}</td><td>{row.pickup}</td></tr>
                        ))}
                        {section.otherLocations && (
                          <tr><td>{section.otherLocations}</td><td colSpan={2}>{section.otherPrice}</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}
                  {section.list && (
                    <ul>
                      {section.list.map((item, i) => (
                        // eslint-disable-next-line react/no-danger
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ul>
                  )}
                  {section.note && <p style={{ marginTop: '0.6rem' }}>{section.note}</p>}
                </Reveal>
              );
            })}

            <Reveal as="div" style={{ marginTop: '2.5rem' }}>
              <div className="cta-band">
                <h2 style={{ fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)' }}>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span></h2>
                <p>{t('cta.lead')}</p>
                <div className="hero-actions">
                  <Link className="btn btn-primary" href="/motorcycles">{t('cta.choose')}</Link>
                  <Link className="btn btn-ghost" href="/contact">{t('cta.ask')}</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
