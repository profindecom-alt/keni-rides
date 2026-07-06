'use client';

import { useEffect, useState, type CSSProperties } from 'react';

// @google/model-viewer registers the <model-viewer> custom element on import.
// It touches window/customElements, so it must load client-side only.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
        HTMLElement
      >;
    }
  }
}

interface BikeViewer3DProps {
  src: string;
  alt: string;
  poster?: string;
}

export default function BikeViewer3D({ src, alt, poster }: BikeViewer3DProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    import('@google/model-viewer').then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const style: CSSProperties = {
    width: '100%',
    height: '100%',
    // model-viewer custom props for progress/poster theming
    ['--poster-color' as string]: 'transparent',
    ['--progress-bar-color' as string]: 'var(--brand)',
    ['--progress-bar-height' as string]: '3px',
  };

  return (
    <div className="bike-3d">
      <span className="bike-3d-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
        </svg>
        3D
      </span>
      {ready ? (
        <model-viewer
          src={src}
          alt={alt}
          poster={poster}
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="600"
          rotation-per-second="18deg"
          interaction-prompt="auto"
          shadow-intensity="0.9"
          shadow-softness="0.8"
          exposure="1.1"
          environment-image="neutral"
          camera-orbit="35deg 78deg 105%"
          min-camera-orbit="auto 55deg auto"
          max-camera-orbit="auto 95deg 160%"
          touch-action="pan-y"
          style={style}
        />
      ) : (
        <div className="bike-3d-loading" role="status" aria-live="polite">
          {poster ? <img src={poster} alt="" aria-hidden="true" /> : null}
          <span className="bike-3d-spinner" aria-hidden="true" />
          <span className="visually-hidden">Loading 3D model…</span>
        </div>
      )}
      <p className="bike-3d-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/></svg>
        Drag to rotate · scroll to zoom
      </p>
    </div>
  );
}
