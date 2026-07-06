'use client';

import { useState, type KeyboardEvent } from 'react';
import Reveal from './Reveal';
import FallbackImg from './FallbackImg';

export interface GalleryImage {
  src: string;
  alt: string;
  placeholderLabel: string;
  size?: 'wide' | 'tall';
}

export default function GalleryGrid({ images, rowHeight }: { images: GalleryImage[]; rowHeight?: number }) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="gallery-grid" style={rowHeight ? { gridAutoRows: `${rowHeight}px` } : undefined}>
        {images.map((img, i) => (
          <Reveal
            key={img.src}
            as="div"
            className={`gallery-item${img.size ? ` ${img.size}` : ''}`}
            delay={(i % 6) * 0.05}
            role="button"
            tabIndex={0}
            onClick={() => setActive(img)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(img);
              }
            }}
          >
            <FallbackImg src={img.src} alt={img.alt} placeholderLabel={img.placeholderLabel} />
          </Reveal>
        ))}
      </div>

      <div className={`lightbox${active ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Image preview">
        <button className="lightbox-close" aria-label="Close preview" onClick={() => setActive(null)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        {active && <img src={active.src} alt={active.alt} />}
      </div>
    </>
  );
}
