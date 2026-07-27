"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

/**
 * §1 Sticky nav — glass overlay, wayfinding only. The "Book a call" link is a
 * de-emphasized text link (safety valve for an already-convinced visitor); the
 * loud, single ask is withheld to §8.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`glass transition-[box-shadow,background-color] duration-300 ${
          scrolled ? "shadow-[0_1px_0_var(--hairline)]" : ""
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="container-content flex h-16 items-center justify-between gap-6"
        >
          <a
            href="#top"
            className="text-mono font-semibold tracking-tight text-primary"
          >
            {site.name}
          </a>

          <ul className="hidden items-center gap-7 md:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-small text-secondary transition-colors duration-150 hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={nav.cta.href}
            className="text-small font-medium text-accent underline-offset-4 transition-colors duration-150 hover:text-accent-hover hover:underline"
          >
            {nav.cta.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
