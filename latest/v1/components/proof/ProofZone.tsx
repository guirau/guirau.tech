import { proof } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §4 Proof zone — DARK warm "espresso" register (section-scoped, not OS-driven).
 * The claim -> proof pivot. Simplified to a statement + two demo entries as
 * elegant rows. Gateway only: no live inference, honest "coming soon", mono
 * carries the evidence (model/pipeline).
 */
export function ProofZone() {
  return (
    <section
      id="proof"
      data-theme="dark"
      aria-labelledby="proof-heading"
      className="section grain relative overflow-hidden bg-surface-0 text-primary"
    >
      <div aria-hidden className="atmosphere" />

      <div className="container-content relative">
        <Reveal className="measure">
          <p className="eyebrow mb-5">{proof.eyebrow}</p>
          <h2 id="proof-heading" className="text-title-1 text-primary">
            {proof.heading}
          </h2>
          <p className="text-lead mt-6">{proof.lead}</p>
        </Reveal>

        <div className="mt-16">
          {proof.demos.map((demo, i) => (
            <Reveal
              key={demo.id}
              delay={i * 90}
              className="block border-t border-[var(--hairline)]"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="chip">
                      <span className="status-dot status-dot--pending" />
                      {demo.status}
                    </span>
                  </div>
                  <h3 className="text-title-2 mt-5 text-primary">
                    {demo.title}
                  </h3>
                  <p className="text-lead mt-2 max-w-[42ch]">{demo.blurb}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="chip">{demo.model}</span>
                  <span className="chip">{demo.pipeline}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
