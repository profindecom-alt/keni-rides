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
  { src: '/gallery/DSC01210.jpg', size: 'wide' },
  { src: '/gallery/DSC01332.jpg' },
  { src: '/gallery/DSC01352.jpg', size: 'tall' },
  { src: '/gallery/DSC01895.jpg' },
  { src: '/gallery/DSC01993.jpg', size: 'tall' },
  { src: '/gallery/DSC02225.jpg' },
  { src: '/gallery/DSC02705.jpg', size: 'wide' },
  { src: '/gallery/DSC02757.jpg' },
  { src: '/gallery/DSC02961.jpg' },
  { src: '/gallery/DSC03120.jpg', size: 'tall' },
  { src: '/gallery/DSC03230.jpg' },
  { src: '/gallery/DSC03273.jpg', size: 'wide' },
  { src: '/gallery/DSC03818.jpg' },
  { src: '/gallery/DSC03952.jpg' },
  { src: '/gallery/DSC04394.jpg', size: 'wide' },
  { src: '/gallery/DSC05655.jpg', size: 'tall' },
  { src: '/gallery/DSC05672.jpg' },
  { src: '/gallery/DSC05794.jpg' },
];
