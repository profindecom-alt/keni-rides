/* ============================================================
   KENI RIDES — Gallery photo list
   Locale-independent: the file order here is the grid order, and
   the alt text / labels are matched BY INDEX from
   messages/<locale>.json under "galleryPage.images" — so never
   reorder or splice this array without updating all three
   message files to match.
   Lives in lib/ (not the page) so the sitemap can declare these
   as page images: Google Image search is a material traffic
   source for this site.
   ============================================================ */

export interface GallerySrc {
  src: string;
  size?: 'wide' | 'tall';
}

export const GALLERY_SRCS: GallerySrc[] = [
  { src: '/gallery/groupe-moto-point-de-vue-montagne-maroc.jpg', size: 'wide' },
  { src: '/gallery/moto-piste-poussiere-montagne-maroc.jpg' },
  { src: '/gallery/moto-canyon-roches-rouges-maroc.jpg', size: 'tall' },
  { src: '/gallery/moto-col-montagne-maroc.jpg' },
  { src: '/gallery/route-col-montagne-atlas-maroc.jpg', size: 'tall' },
  { src: '/gallery/moto-col-montagne-crepuscule-maroc.jpg' },
  { src: '/gallery/equipe-keni-rides-garage-maroc.jpg', size: 'wide' },
  { src: '/gallery/riders-keni-rides-ensemble-maroc.jpg' },
  { src: '/gallery/rider-pause-desert-maroc.jpg' },
  { src: '/gallery/motos-plaines-desertiques-maroc.jpg', size: 'tall' },
  { src: '/gallery/moto-traversee-desert-maroc.jpg' },
  { src: '/gallery/groupe-moto-acacia-desert-maroc.jpg', size: 'wide' },
  { src: '/gallery/riders-desert-maroc.jpg' },
  { src: '/gallery/moto-piste-montagne-maroc.jpg' },
  { src: '/gallery/moto-dunes-sahara-maroc.jpg', size: 'wide' },
  { src: '/gallery/assistance-moto-garage-zagora-maroc.jpg', size: 'tall' },
  { src: '/gallery/rider-keni-rides-moto-maroc.jpg' },
  { src: '/gallery/reparation-pneu-moto-desert-maroc.jpg' },
];
