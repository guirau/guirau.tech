import { finalCta } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §8 Final CTA / close — light, warm accent zone. THE single emphatic ask,
 * earned by everything above. Carries its weight through composition + accent
 * colour, not scroll motion (the style supports only two motion set-pieces).
 * id="book" is the booking destination + swappable scheduler anchor.
 */
export function FinalCta() {
  return (
    <section
      id="book"
      aria-labelledby="cta-heading"
      className="section relative overflow-hidden"
      style={{ backgroundColor: "var(--accent-tint)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.5,
        }}
      />
      <div className="container-content">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2
            id="cta-heading"
            className="text-title-1 text-balance text-primary"
          >
            {finalCta.heading}
          </h2>
          <p className="text-lead mt-5 max-w-xl">{finalCta.body}</p>

          <a href={finalCta.cta.href} className="btn btn-accent mt-10">
            {finalCta.cta.label}
          </a>
          <p className="text-caption mt-4">{finalCta.reassurance}</p>
        </Reveal>
      </div>
    </section>
  );
}
