'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname, usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { localeLabel } from '@/lib/locales';
import type { Href } from '@/lib/seo';

/**
 * Floating language switcher — a round FAB matching the call/WhatsApp buttons
 * that pops a small menu of the available locales above it.
 *
 * The options are real `<a href>` elements, and the menu stays mounted (hidden
 * with CSS rather than unmounted) so every page ships a crawlable link to its
 * own translations. They used to be `<button>`s driving `router.replace`, which
 * left /en and /es without a single inbound link anywhere on the site.
 */
export default function LangFab() {
  const t = useTranslations('fab');
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // `usePathname` returns the *internal* route template, so on a bike or city
  // page it reads '/motorcycles/[slug]' rather than the resolved path. Handing
  // that to next-intl with no params throws ("Insufficient params provided for
  // localized pathname") — which is why switching language silently did nothing
  // on those pages. Re-attach the params of the route we're actually on.
  const href = useMemo<Href>(() => {
    if (!pathname.includes('[')) return pathname as Href;
    const { locale: _current, ...rest } = params;
    return { pathname, params: rest } as Href;
  }, [pathname, params]);

  /**
   * Public URL of the current page in `target`. No forced prefix, so French
   * stays at the root (`/nos-motos`) instead of `/fr/nos-motos`, which would
   * only redirect — next-intl's `Link` forces the prefix whenever a `locale`
   * prop is set, hence the plain anchor.
   */
  function urlFor(target: Locale): string {
    try {
      return getPathname({ href, locale: target });
    } catch {
      // Route outside the pathnames map (a 404, say) — offer that locale's home.
      return getPathname({ href: '/', locale: target });
    }
  }

  function select(event: React.MouseEvent<HTMLAnchorElement>, target: Locale) {
    // Leave open-in-new-tab / new-window clicks to the browser.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    if (target === locale) return;
    // Navigate through next-intl so the locale cookie follows the switch.
    router.replace(href as Parameters<typeof router.replace>[0], { locale: target });
  }

  return (
    <div className="fab-lang-wrap" ref={wrapRef}>
      <nav className={`fab-lang-menu${open ? ' open' : ''}`} aria-label={t('language')}>
        {routing.locales.map((loc) => {
          const info = localeLabel(loc);
          const active = loc === locale;
          return (
            <a
              key={loc}
              href={urlFor(loc)}
              hrefLang={loc}
              aria-current={active ? 'true' : undefined}
              className={`fab-lang-opt${active ? ' active' : ''}`}
              onClick={(e) => select(e, loc)}
            >
              <span className="fab-lang-opt-code">{info.code}</span>
              <span className="fab-lang-opt-name">{info.name}</span>
              {active && (
                <svg className="fab-lang-opt-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
              )}
            </a>
          );
        })}
      </nav>
      <button
        type="button"
        className={`fab fab-lang${open ? ' open' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('language')}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></svg>
        <span className="fab-lang-current" aria-hidden="true">{localeLabel(locale).code}</span>
      </button>
    </div>
  );
}
