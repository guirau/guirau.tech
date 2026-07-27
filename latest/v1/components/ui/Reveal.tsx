"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-in reveal driven by IntersectionObserver.
 *
 * Robust-by-default: server-rendered markup carries no data-reveal attribute,
 * so with no JS or with prefers-reduced-motion the content is fully visible
 * (see globals.css). Only when motion is allowed does it hide-then-reveal.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const allowMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;
    if (!allowMotion) return;

    el.setAttribute("data-reveal", "hidden");
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-reveal", "shown");
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
