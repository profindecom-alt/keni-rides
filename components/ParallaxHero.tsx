'use client';

import { useEffect, useRef, useState } from 'react';

function placeholderSVG(label: string): string {
  const text = (label || 'KENI RIDES').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'>" +
    "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
    "<stop offset='0' stop-color='#221c15'/><stop offset='0.55' stop-color='#120f0c'/><stop offset='1' stop-color='#0b0a08'/>" +
    "</linearGradient><radialGradient id='o' cx='0.2' cy='0.9' r='0.9'>" +
    "<stop offset='0' stop-color='#ff6b00' stop-opacity='0.32'/><stop offset='0.6' stop-color='#ff6b00' stop-opacity='0'/>" +
    '</radialGradient></defs>' +
    "<rect width='1200' height='900' fill='url(#g)'/><rect width='1200' height='900' fill='url(#o)'/>" +
    "<path d='M330 610 l90 -150 h60 l-40 70 h140 l80 -120 h70 l-90 200 z' fill='none' stroke='#ff6b00' stroke-opacity='0.55' stroke-width='10' stroke-linejoin='round'/>" +
    "<circle cx='420' cy='640' r='58' fill='none' stroke='#f5f2ee' stroke-opacity='0.35' stroke-width='10'/>" +
    "<circle cx='760' cy='640' r='58' fill='none' stroke='#f5f2ee' stroke-opacity='0.35' stroke-width='10'/>" +
    "<text x='600' y='790' text-anchor='middle' font-family='Arial, sans-serif' font-size='34' letter-spacing='14' fill='#8a8177'>" +
    text.toUpperCase() +
    '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

interface ParallaxHeroProps {
  src: string;
  alt: string;
  placeholderLabel?: string;
  speed?: number;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/** Hero background image with a subtle scroll parallax, matching the old .parallax-media behavior. */
export default function ParallaxHero({ src, alt, placeholderLabel, speed = 0.2, fetchPriority = 'auto' }: ParallaxHeroProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let ticking = false;
    function apply() {
      const el = imgRef.current;
      if (!el || !el.parentElement) return;
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = `translateY(${rect.top * -speed}px)`;
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div className="hero-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={failed ? placeholderSVG(placeholderLabel || alt) : src}
        alt={alt}
        className="parallax-media"
        loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
        fetchPriority={fetchPriority}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
