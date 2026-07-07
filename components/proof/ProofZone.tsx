import { proof } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §4 Proof zone — DARK register (section-scoped via data-theme, not OS-driven).
 * The light -> dark hinge and the site's emotional apex. Gateway cards ONLY:
 * no live inference. Geist Mono carries the evidence (model/pipeline labels);
 * status is an honest "coming soon", never fabricated metrics.
 */
export function ProofZone() {
  return (
    <section
      id="proof"
      data-theme="dark"
      aria-labelledby="proof-heading"
      className="section relative bg-surface-0 text-primary"
    >
      {/* Hinge: soft luminous wash bleeding from the top edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--accent-tint), transparent 70%)",
        }}
      />

      <div className="container-content relative">
        <Reveal className="measure">
          <p className="eyebrow mb-5">{proof.eyebrow}</p>
          <h2 id="proof-heading" className="text-title-1 text-primary">
            {proof.heading}
          </h2>
          <p className="text-lead mt-5">{proof.lead}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {proof.demos.map((demo, i) => (
            <Reveal key={demo.id} delay={i * 120}>
              <article
                aria-disabled="true"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-surface-1 p-7"
              >
                {/* luminous edge highlight — depth in the dark register */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 80% 0%, var(--accent-tint), transparent 60%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="chip">
                      <span className="status-dot status-dot--pending" />
                      {demo.status}
                    </span>
                    <span aria-hidden className="text-caption">
                      0{proof.demos.indexOf(demo) + 1} / 0{proof.demos.length}
                    </span>
                  </div>

                  <h3 className="text-title-3 mt-6 text-primary">
                    {demo.title}
                  </h3>
                  <p className="text-body mt-2 text-secondary">{demo.blurb}</p>
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-2 border-t border-[var(--hairline)] pt-5">
                  <span className="chip">{demo.model}</span>
                  <span className="chip">{demo.pipeline}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
