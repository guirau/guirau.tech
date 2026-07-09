import { hero } from "@/lib/content";

/**
 * §2 Hero — warm paper register, editorial and SPACIOUS. Giant display type is
 * the one focal element; a single supporting line; a quiet scroll cue. Kept
 * deliberately uncluttered to leave room for the scroll animation. No hard CTA.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Hero media stage — full-bleed layer for the scroll-scrubbed hero VIDEO
          (provided later). For now the warm atmosphere is the placeholder; drop
          a <video data-hero-video> here and wire scroll scrub when the asset
          lands. Type overlays this layer. */}
      <div data-hero-media aria-hidden className="absolute inset-0">
        <div className="atmosphere" />
        <div className="hero-grid" />
      </div>

      <div className="container-content relative">
        <p className="rise eyebrow mb-8" style={{ animationDelay: "40ms" }}>
          {hero.eyebrow}
        </p>

        <h1
          id="hero-heading"
          className="rise text-display text-primary"
          style={{ animationDelay: "120ms" }}
        >
          Production-grade AI,
          <br />
          <span className="text-primary/35">not prototypes.</span>
        </h1>

        <p
          className="rise text-lead mt-10 max-w-[40ch]"
          style={{ animationDelay: "280ms" }}
        >
          {hero.subhead}
        </p>
      </div>

      {/* Quiet scroll cue, anchored to the bottom edge. */}
      <div className="container-content absolute inset-x-0 bottom-10">
        <a
          href="#proof"
          className="rise group inline-flex items-center gap-3 text-small font-medium text-secondary transition-colors duration-150 hover:text-primary"
          style={{ animationDelay: "440ms" }}
        >
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] transition-transform duration-300 group-hover:translate-y-1"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M7 2v10M3 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {hero.scrollCue}
        </a>
      </div>
    </section>
  );
}
