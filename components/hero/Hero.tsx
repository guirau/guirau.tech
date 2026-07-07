import { hero } from "@/lib/content";

/**
 * §2 Hero — light. Positioning headline + subhead + soft scroll cue (no hard
 * CTA). Staged reveal (headline -> subhead -> cue) via .rise with delay
 * stagger; reduced-motion users get it instantly (globals override).
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Faint instrument grid — atmosphere, not decoration overload. */}
      <div aria-hidden className="hero-grid" />

      <div className="container-content relative w-full">
        <div className="measure">
          <p
            className="rise eyebrow mb-6"
            style={{ animationDelay: "40ms" }}
          >
            {hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="rise text-display text-primary"
            style={{ animationDelay: "120ms" }}
          >
            {hero.headline}
          </h1>

          <p
            className="rise text-lead mt-7 max-w-[54ch]"
            style={{ animationDelay: "260ms" }}
          >
            {hero.subhead}
          </p>

          <a
            href="#proof"
            className="rise mt-12 inline-flex items-center gap-2 text-small font-medium text-secondary transition-colors duration-150 hover:text-primary"
            style={{ animationDelay: "420ms" }}
          >
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
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
      </div>
    </section>
  );
}
