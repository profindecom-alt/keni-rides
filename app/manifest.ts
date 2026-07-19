import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Keni Rides — Premium Motorcycle Adventures in Morocco',
    short_name: SITE_NAME,
    description: 'Premium adventure motorcycle rental in Morocco.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f1',
    theme_color: '#faf7f1',
    icons: [
      {
        src: '/logo.webp',
        sizes: '768x384',
        type: 'image/webp',
      },
    ],
  };
}
