'use client';

import type { CSSProperties, ElementType, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type RevealDirection = 'up' | 'left' | 'right' | 'zoom';

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, 'onKeyDown'> {
  children: ReactNode;
  as?: ElementType;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  onKeyDown?: (e: KeyboardEvent) => void;
  /** Passed through when `as` is a link-like component (e.g. next/link) or "a". */
  href?: string;
  target?: string;
  rel?: string;
  /** Passed through when `as="details"`. */
  open?: boolean;
}

/** Client-side scroll reveal — mirrors the old [data-reveal] IntersectionObserver behavior. */
export default function Reveal({
  children,
  as: Tag = 'div',
  direction,
  delay = 0,
  className = '',
  style,
  ...rest
}: RevealProps) {
  // `any` is deliberate: Tag is a dynamic ElementType, so the underlying
  // DOM node type varies per tag and a single ref type can't express that.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={direction || 'up'}
      className={`${inView ? 'in-view' : ''} ${className}`.trim()}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
