/* ============================================================
   KENI RIDES — Site configuration
   Set your n8n webhook URLs here (or via environment variables).
   Every form on the site POSTs JSON to these endpoints.
   No data is stored locally.
   ============================================================ */

export const CONFIG = {
  webhooks: {
    // Single n8n endpoint receives every form submission; the workflow branches
    // on the payload's `type` field ('booking' | 'contact').
    // n8n webhook that receives booking requests (motorcycle detail pages)
    booking:
      process.env.NEXT_PUBLIC_BOOKING_WEBHOOK_URL ||
      'https://n8n.srv1019025.hstgr.cloud/webhook/keni-rides-forms',
    // n8n webhook that receives contact / quote messages
    contact:
      process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL ||
      'https://n8n.srv1019025.hstgr.cloud/webhook/keni-rides-forms',
  },
  phone: '+212 616 712266',
  phoneHref: 'tel:+212616712266',
  whatsapp: 'https://wa.me/212616712266',
  // Real Google Business Profile rating (Kénitra listing). Bump these two
  // numbers as reviews accumulate; they feed both the footer badge and the
  // LocalBusiness AggregateRating schema so the markup always matches what
  // visitors see on the page.
  google: {
    rating: 4.8,
    reviewCount: 48,
    profile: 'https://www.google.com/maps?cid=13573386500998719410',
  },
  social: {
    facebook: 'https://www.facebook.com/share/ZKKKbiGrdkfL6RLS/?mibextid=LQQJ4d',
    instagram: 'https://www.instagram.com/keni_rides/',
    youtube: 'https://www.youtube.com/@KeniRides',
  },
} as const;

export type WebhookKind = keyof typeof CONFIG.webhooks;
