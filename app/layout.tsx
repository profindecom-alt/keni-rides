import type { ReactNode } from 'react';

// The [locale] segment owns <html>/<body>. This passthrough root layout is
// required so the root not-found.tsx can compile — without it, the first
// request to an unknown path (e.g. /ads.txt, /favicon.ico) fatally wedges
// the dev server with "not-found.tsx doesn't have a root layout".
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
