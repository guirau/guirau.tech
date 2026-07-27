import { process } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §6 How it works — light, quiet. Three beats, big numbers, minimal words.
 * De-riskers reduced to one calm line rather than a boxed grid.
 */
export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section hairline-top"
    >
      <div className="container-content">
        <Reveal className="measure">
          <p className="eyebrow mb-5">{process.eyebrow}</p>
          <h2 id="process-heading" className="text-title-1 text-primary">
            {process.heading}
          </h2>
          <p className="text-lead mt-5">{process.lead}</p>
        </Reveal>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {process.steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 90} as="li" className="block">
              <div className="text-display text-primary/15" aria-hidden>
                {step.step}
              </div>
              <h3 className="text-title-3 mt-4 text-primary">{step.title}</h3>
              <p className="text-body mt-3 text-secondary">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={100} className="mt-16 block">
          <ul className="flex flex-wrap gap-x-3 gap-y-2 text-small text-secondary">
            {process.deriskers.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden className="text-tertiary">
                    ·
                  </span>
                ) : null}
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
