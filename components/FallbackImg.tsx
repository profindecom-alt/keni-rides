'use client';

import Image from 'next/image';
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
  /**
   * Render through next/image as a fill layer. The parent must be positioned
   * and have a height of its own (every container we use it in sets
   * `position: relative` plus an `aspect-ratio`).
   */
  fill?: boolean;
  /** Slot width per breakpoint, so the browser picks the right srcset entry. */
  sizes?: string;
}

/**
 * Site image with a branded SVG placeholder if the asset 404s.
 *
 * Photos go through next/image, which is the whole point: the source files are
 * 2400px and every device used to download that same file. With `fill` (or an
 * explicit width/height) Next emits a srcset, so a phone rendering a 350px card
 * fetches a 640px image instead of a 1600px one — the difference between a
 * ~3 MB city page and a few hundred KB.
 *
 * Callers that pass neither `fill` nor width/height keep a plain <img>: that is
 * the logo path, where the intrinsic size is set in CSS and optimisation buys
 * nothing.
 */
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
  fill,
  sizes,
}: FallbackImgProps) {
  const [failed, setFailed] = useState(false);

  // The placeholder is a data: URI, which the optimiser cannot process.
  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={placeholderSVG(placeholderLabel || alt)}
        alt={alt}
        className={className}
        style={style}
        width={width}
        height={height}
      />
    );
  }

  const shared = {
    src,
    alt,
    className,
    style,
    quality: 78,
    priority: fetchPriority === 'high',
    onError: () => setFailed(true),
  };

  if (fill) {
    return <Image {...shared} fill sizes={sizes ?? '100vw'} />;
  }

  if (width && height) {
    return <Image {...shared} width={width} height={height} sizes={sizes} loading={fetchPriority === 'high' ? undefined : loading} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
    />
  );
}
