import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import GalleryGrid, { type GalleryImage } from '@/components/GalleryGrid';
import FallbackImg from '@/components/FallbackImg';
import Reveal from '@/components/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.gallery' });
  return pageMetadata({ locale, href: '/gallery', title: t('title'), description: t('description') });
}

const IMAGE_SRCS: { src: string; size?: 'wide' | 'tall' }[] = [
  { src: '/gallery/DSC01210.jpg', size: 'wide' },
  { src: '/gallery/DSC01332.jpg' },
  { src: '/gallery/DSC01352.jpg', size: 'tall' },
  { src: '/gallery/DSC01895.jpg' },
  { src: '/gallery/DSC01993.jpg', size: 'tall' },
  { src: '/gallery/DSC02225.jpg' },
  { src: '/gallery/DSC02705.jpg', size: 'wide' },
  { src: '/gallery/DSC02757.jpg' },
  { src: '/gallery/DSC02961.jpg' },
  { src: '/gallery/DSC03120.jpg', size: 'tall' },
  { src: '/gallery/DSC03230.jpg' },
  { src: '/gallery/DSC03273.jpg', size: 'wide' },
  { src: '/gallery/DSC03818.jpg' },
  { src: '/gallery/DSC03952.jpg' },
  { src: '/gallery/DSC04394.jpg', size: 'wide' },
  { src: '/gallery/DSC05655.jpg', size: 'tall' },
  { src: '/gallery/DSC05672.jpg' },
  { src: '/gallery/DSC05794.jpg' },
];

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GalleryContent />;
}

function GalleryContent() {
  const t = useTranslations('galleryPage');
  const tNav = useTranslations('nav');
  const translatedImages = t.raw('images') as { alt: string; label: string }[];

  const images: GalleryImage[] = IMAGE_SRCS.map((img, i) => ({
    src: img.src,
    size: img.size,
    alt: translatedImages[i]?.alt || '',
    placeholderLabel: translatedImages[i]?.label || '',
  }));

  return (
    <>
      <PageHero
        image="/gallery/DSC01993.jpg"
        imageAlt="Aerial view of a mountain pass road in Morocco"
        placeholderLabel="The Gallery"
        crumbLabel={tNav('gallery')}
        title={<>{t('heroTitleStart')}<span className="text-gradient">{t('heroTitleEmphasis')}</span></>}
        lead={t('heroLead')}
      />

      <section className="section">
        <div className="glow-field" aria-hidden="true"><span className="glow" style={{ top: '20%', left: '-18%' }} /></div>
        <div className="container">
          <GalleryGrid images={images} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta-band" direction="zoom">
            <FallbackImg src="/gallery/DSC01332.jpg" alt="" placeholderLabel="" />
            <h2>{t('cta.titleStart')}<span className="text-gradient">{t('cta.titleEmphasis')}</span>{t('cta.titleEnd')}</h2>
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
