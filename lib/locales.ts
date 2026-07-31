/* ============================================================
   KENI RIDES — Locale display names
   Shared by the floating language switcher (LangFab) and the
   footer's locale links, so both spell the languages the same
   way. Names are deliberately written in their own language —
   a Spanish visitor looks for "Español", not "Espagnol".
   ============================================================ */

export interface LocaleLabel {
  /** Two-letter badge shown in the switcher. */
  code: string;
  /** Endonym — the language's name in that language. */
  name: string;
}

export const LOCALE_LABELS: Record<string, LocaleLabel> = {
  fr: { code: 'FR', name: 'Français' },
  en: { code: 'EN', name: 'English' },
  es: { code: 'ES', name: 'Español' },
};

/** Label for a locale, falling back to the raw code for unknown ones. */
export function localeLabel(locale: string): LocaleLabel {
  return LOCALE_LABELS[locale] ?? { code: locale.toUpperCase(), name: locale };
}
