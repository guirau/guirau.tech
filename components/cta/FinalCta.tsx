import { finalCta } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §8 Final CTA / close — the single emphatic ask, earned by everything above.
 * Weight comes from composition + a warm atmosphere + the one accent button,
 * not scroll motion. id="book" is the booking destination + swappable anchor.
 */
export function FinalCta() {
  return (
    <section
      id="book"
      aria-labelledby="cta-heading"
      className="grain relative overflow-hidden bg-surface-1"
    >
      <div aria-hidden className="atmosphere" />
      <div className="container-content relative py-28 sm:py-40">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2
            id="cta-heading"
            className="text-display text-balance text-primary"
          >
            {finalCta.heading}
          </h2>
          <p className="text-lead mt-8 max-w-xl">{finalCta.body}</p>

          <a href={finalCta.cta.href} className="btn btn-accent mt-12">
            {finalCta.cta.label}
          </a>
          <p className="text-caption mt-5">{finalCta.reassurance}</p>
        </Reveal>
      </div>
    </section>
  );
}
