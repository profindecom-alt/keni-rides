/* ============================================================
   KENI RIDES — Site configuration
   Set your n8n webhook URLs here. Every form on the site POSTs
   JSON to these endpoints. No data is stored locally.
   ============================================================ */
window.KENI_CONFIG = {
  webhooks: {
    // n8n webhook that receives booking requests (motorcycle detail pages)
    booking: 'https://YOUR-N8N-INSTANCE.com/webhook/keni-rides-booking',
    // n8n webhook that receives contact / quote messages
    contact: 'https://YOUR-N8N-INSTANCE.com/webhook/keni-rides-contact'
  },
  phone: '+212 616 712266',
  phoneHref: 'tel:+212616712266',
  whatsapp: 'https://wa.me/212616712266',
  social: {
    facebook: 'https://www.facebook.com/share/ZKKKbiGrdkfL6RLS/?mibextid=LQQJ4d',
    instagram: 'https://www.instagram.com/keni_rides/',
    youtube: 'https://www.youtube.com/@KeniRides'
  }
};
