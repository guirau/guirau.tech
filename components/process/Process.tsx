import { process } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §6 How it works — light, quiet. Shared 3-step path + de-riskers. Removes
 * purchase risk for the B2B buyer, right after prices.
 */
export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section hairline-top bg-surface-1"
    >
      <div className="container-content">
        <Reveal className="measure">
          <p className="eyebrow mb-5">{process.eyebrow}</p>
          <h2 id="process-heading" className="text-title-1 text-primary">
            {process.heading}
          </h2>
          <p className="text-lead mt-5">{process.lead}</p>
        </Reveal>

        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {process.steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 90} as="li" className="block">
              <div className="text-mono text-accent">{step.step}</div>
              <div
                aria-hidden
                className="mt-4 h-px w-full bg-[var(--border)]"
              />
              <h3 className="text-title-3 mt-5 text-primary">{step.title}</h3>
              <p className="text-body mt-2 text-secondary">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal
          delay={120}
          className="mt-14 rounded-[var(--radius-md)] border border-[var(--hairline)] bg-surface-0 p-6 sm:p-8"
        >
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {process.deriskers.map((item) => (
              <li key={item} className="text-small flex items-start gap-2.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                  className="mt-1 shrink-0 text-success"
                >
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
