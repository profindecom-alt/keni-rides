'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing, type AppPathname } from '@/i18n/routing';
import FallbackImg from './FallbackImg';

const LANGUAGE_LABELS: Record<string, string> = { fr: 'FR', en: 'EN', es: 'ES' };

// Static nav destinations (no dynamic [slug]/[city] routes here).
type StaticPathname = Exclude<AppPathname, '/motorcycles/[slug]' | '/rentals/[city]'>;

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const LINKS: { href: StaticPathname; label: string }[] = [
    { href: '/', label: t('home') },
    { href: '/motorcycles', label: t('motorcycles') },
    { href: '/gallery', label: t('gallery') },
    { href: '/testimonials', label: t('testimonials') },
    { href: '/about', label: t('about') },
    { href: '/faq', label: t('faq') },
    { href: '/contact', label: t('contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  function switchLocale(nextLocale: string) {
    // `pathname` is the resolved internal path; next-intl re-localises it for the
    // target locale. The typed router can't express the dynamic template here, so cast.
    router.replace(pathname as Parameters<typeof router.replace>[0], { locale: nextLocale });
    setLangOpen(false);
  }

  // every page (home included) now opens on a full-bleed dark photo hero, so the
  // nav stays transparent over the top scrim until scrolled
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
      <div className="container nav-inner">
        <Link className="nav-logo" href="/" aria-label="Keni Rides home">
          <FallbackImg src="/logo.webp" alt="Keni Rides" placeholderLabel="Keni Rides" />
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label="Open menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg className="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          <svg className="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <div
          className={`nav-backdrop${open ? ' open' : ''}`}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
        <div className={`nav-links${open ? ' open' : ''}`} id="nav-menu">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="lang-switch" role="group" aria-label="Language">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                type="button"
                className={`lang-btn${loc === locale ? ' active' : ''}`}
                aria-pressed={loc === locale}
                onClick={() => switchLocale(loc)}
              >
                {LANGUAGE_LABELS[loc]}
              </button>
            ))}
          </div>
          <span className="nav-cta">
            <Link className="btn btn-primary" href="/motorcycles">{t('bookRide')}</Link>
          </span>
        </div>
      </div>
    </nav>
  );
}
