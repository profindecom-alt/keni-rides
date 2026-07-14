'use client';

import { useEffect } from 'react';
import { trackTap, type TapKind } from '@/lib/track';

/**
 * Site-wide contact-intent tracker. A single delegated click listener
 * catches every call (`tel:`) and WhatsApp (`wa.me` / `api.whatsapp.com`)
 * link anywhere on the site — the FAB stack, footer, and every page CTA —
 * so new links are covered automatically without wiring each one.
 *
 * Renders nothing; mounts once in the layout.
 */
export default function TapTracker() {
  useEffect(() => {
    const kindForHref = (href: string): TapKind | null => {
      const h = href.toLowerCase();
      if (h.startsWith('tel:')) return 'call';
      if (h.includes('wa.me') || h.includes('whatsapp.com')) return 'whatsapp';
      return null;
    };

    let lastFire = 0;

    const onClick = (e: MouseEvent) => {
      // Ignore non-primary / modified clicks that don't act on the link.
      if (e.button !== 0 || e.defaultPrevented) return;

      const target = e.target as Element | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const kind = kindForHref(anchor.getAttribute('href') || '');
      if (!kind) return;

      // Guard against a single tap registering twice (e.g. nested handlers).
      const now = Date.now();
      if (now - lastFire < 800) return;
      lastFire = now;

      trackTap(kind, anchor.href);
    };

    // Capture phase so we still fire even if a handler stops propagation.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
