'use client';

import { useState, type CSSProperties } from 'react';

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

interface FallbackImgProps {
  src: string;
  alt: string;
  placeholderLabel?: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;
  height?: number;
}

/** Plain <img> that swaps to a branded SVG placeholder if the real asset 404s. */
export default function FallbackImg({
  src,
  alt,
  placeholderLabel,
  className,
  style,
  loading = 'lazy',
  fetchPriority,
  width,
  height,
}: FallbackImgProps) {
  const [failed, setFailed] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failed ? placeholderSVG(placeholderLabel || alt) : src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
}
