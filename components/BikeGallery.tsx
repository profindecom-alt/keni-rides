'use client';

import { useCallback, useEffect, useState } from 'react';

interface BikeGalleryProps {
  images: string[];
  name: string;
  /** Localised labels aligned to images order: [main, front, side, rear]. */
  labels: string[];
  zoomLabel: string;
  closeLabel: string;
}

export default function BikeGallery({ images, name, labels, zoomLabel, closeLabel }: BikeGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, go]);

  return (
    <div className="bike-gallery">
      <button
        type="button"
        className="bike-gallery-main"
        onClick={() => setLightbox(true)}
        aria-label={zoomLabel}
      >
        <img src={images[active]} alt={`${name} · ${labels[active] ?? ''}`} />
        <span className="bike-gallery-zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>
        </span>
      </button>
      <div className="bike-gallery-thumbs" role="tablist" aria-label={name}>
        {images.map((src, i) => (
          <button
            type="button"
            key={src}
            role="tab"
            aria-selected={i === active}
            aria-label={labels[i] ?? `${i + 1}`}
            className={`bike-gallery-thumb${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            <img src={src} alt="" aria-hidden="true" loading="lazy" />
          </button>
        ))}
      </div>

      {lightbox ? (
        <div className="lightbox open" onClick={() => setLightbox(false)} role="dialog" aria-modal="true" aria-label={name}>
          <button type="button" className="lightbox-close" aria-label={closeLabel} onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
          <button type="button" className="lightbox-nav prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <img src={images[active]} alt={`${name} · ${labels[active] ?? ''}`} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lightbox-nav next" aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
