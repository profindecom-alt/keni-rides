'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_NAMES: Record<string, { code: string; name: string }> = {
  fr: { code: 'FR', name: 'Français' },
  en: { code: 'EN', name: 'English' },
  es: { code: 'ES', name: 'Español' },
};

/** Floating language switcher — a round FAB matching the call/WhatsApp buttons
 * that pops a small menu of the available locales above it. */
export default function LangFab() {
  const t = useTranslations('fab');
  const locale = useLocale();
  const pathname = usePathname();
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

  function switchLocale(next: string) {
    setOpen(false);
    // Cast: the typed router can't express the current dynamic path for locale switching.
    if (next !== locale) router.replace(pathname as Parameters<typeof router.replace>[0], { locale: next });
  }

  return (
    <div className="fab-lang-wrap" ref={wrapRef}>
      {open && (
        <div className="fab-lang-menu" role="menu" aria-label={t('language')}>
          {routing.locales.map((loc) => {
            const info = LANGUAGE_NAMES[loc] ?? { code: loc.toUpperCase(), name: loc };
            const active = loc === locale;
            return (
              <button
                key={loc}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                className={`fab-lang-opt${active ? ' active' : ''}`}
                onClick={() => switchLocale(loc)}
              >
                <span className="fab-lang-opt-code">{info.code}</span>
                <span className="fab-lang-opt-name">{info.name}</span>
                {active && (
                  <svg className="fab-lang-opt-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                )}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        className={`fab fab-lang${open ? ' open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('language')}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></svg>
        <span className="fab-lang-current" aria-hidden="true">{LANGUAGE_NAMES[locale]?.code ?? locale.toUpperCase()}</span>
      </button>
    </div>
  );
}
