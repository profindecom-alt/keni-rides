'use client';

import { useEffect, useState } from 'react';

/**
 * Full-screen intro overlay shown on first paint of a full page load.
 * It sits in the initial SSR HTML (so it covers content before hydration),
 * then dismisses itself once the window `load` event fires — with a short
 * minimum display so it never flickers, and a hard safety timeout so a
 * stalled asset can never trap the visitor behind it.
 *
 * Persists across soft (client) navigations without re-triggering because it
 * mounts once in the layout; only a full reload shows it again.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const MIN_SHOW = 650; // ms — keeps the intro from flashing on fast loads
    const MAX_SHOW = 4000; // ms — safety net if `load` never fires
    const start = Date.now();
    let dismissTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const elapsed = Date.now() - start;
      dismissTimer = setTimeout(() => setDone(true), Math.max(0, MIN_SHOW - elapsed));
    };

    // Lock scroll while the overlay is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const safety = setTimeout(() => setDone(true), MAX_SHOW);

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(dismissTimer);
      clearTimeout(safety);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Release the scroll lock the moment we start fading out.
  useEffect(() => {
    if (done) document.body.style.overflow = '';
  }, [done]);

  return (
    <div className={`preloader${done ? ' is-done' : ''}`} aria-hidden="true">
      {/* Visitors without JS should never be trapped behind the overlay. */}
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>

      <div className="preloader-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="preloader-logo"
          src="/logo.webp"
          alt="Keni Rides"
          width={96}
          height={96}
          decoding="async"
        />
        <span className="preloader-word">Keni Rides</span>
        <div className="preloader-track">
          <span className="preloader-bar" />
        </div>
      </div>
    </div>
  );
}
