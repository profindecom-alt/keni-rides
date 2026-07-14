/* ============================================================
   KENI RIDES — Lightweight tap tracking
   Fires a fire-and-forget webhook when a visitor taps a
   call or WhatsApp link, so the owner is notified of the
   contact intent. Same n8n endpoint as the forms; the
   workflow branches on the payload `type` ('call' | 'whatsapp').
   ============================================================ */

import { CONFIG } from './config';

export type TapKind = 'call' | 'whatsapp';

/**
 * Report a contact-intent tap. Uses `fetch` with `keepalive` so the
 * request survives the navigation that `tel:` / WhatsApp links trigger
 * (the page may leave or a new tab may open before the request settles).
 * Never throws and never blocks the click.
 */
export function trackTap(kind: TapKind, href: string): void {
  const url = CONFIG.webhooks.contact;
  if (!url || url.includes('YOUR-N8N-INSTANCE')) return;

  const payload = {
    type: kind,
    target: href,
    page: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    submittedAt: new Date().toISOString(),
  };

  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      // Fire-and-forget: we don't read the response and don't want it to
      // hold anything up. `no-cors` isn't used because n8n already returns
      // permissive CORS headers for the form POSTs on this same endpoint.
    }).catch(() => {});
  } catch {
    /* ignore — tracking must never break the click */
  }
}
