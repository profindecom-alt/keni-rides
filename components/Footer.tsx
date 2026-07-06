import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FallbackImg from './FallbackImg';
import { CONFIG } from '@/lib/config';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="nav-logo" href="/">
              <FallbackImg src="/logo.webp" alt="Keni Rides" placeholderLabel="Keni Rides" />
            </Link>
            <p>{t('tagline')}</p>
            <div className="socials" style={{ marginTop: '1.2rem' }}>
              <a href={CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Keni Rides on Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
              </a>
              <a href={CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Keni Rides on Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
              <a href={CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Keni Rides on YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4>{t('explore')}</h4>
            <ul>
              <li><Link href="/motorcycles">{t('links.motorcycles')}</Link></li>
              <li><Link href="/gallery">{t('links.gallery')}</Link></li>
              <li><Link href="/testimonials">{t('links.testimonials')}</Link></li>
              <li><Link href="/about">{t('links.about')}</Link></li>
              <li><Link href="/conditions">{t('links.conditions')}</Link></li>
              <li><Link href="/faq">{t('links.faq')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('topBikes')}</h4>
            <ul>
              <li><Link href={{ pathname: '/motorcycles/[slug]', params: { slug: 'bmw-gs1200-adventure' } }}>BMW GS 1200 Adventure</Link></li>
              <li><Link href={{ pathname: '/motorcycles/[slug]', params: { slug: 'yamaha-tenere-700-world-raid' } }}>Ténéré 700 World Raid</Link></li>
              <li><Link href={{ pathname: '/motorcycles/[slug]', params: { slug: 'yamaha-tenere-700' } }}>Yamaha Ténéré 700</Link></li>
              <li><Link href={{ pathname: '/motorcycles/[slug]', params: { slug: 'honda-transalp-700' } }}>Honda Transalp 700</Link></li>
              <li><Link href={{ pathname: '/motorcycles/[slug]', params: { slug: 'suzuki-dr650' } }}>Suzuki DR650</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('contact')}</h4>
            <ul>
              <li><a href={CONFIG.phoneHref}>{CONFIG.phone}</a></li>
              <li><a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">{t('whatsapp')}</a></li>
              <li><Link href="/contact">{t('contactForm')}</Link></li>
              <li>{t('base')}</li>
              <li>{t('hours')}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('rights', { year: new Date().getFullYear() })}</span>
          <Link href="/conditions">{t('rentalConditions')}</Link>
        </div>
      </div>
    </footer>
  );
}
