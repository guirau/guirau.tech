import { about } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §7 About — light, quiet. Engineer-first; physics + ex-documentary/TV as
 * texture. Humanizes late so it never dilutes the engineering lead.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">{about.eyebrow}</p>
            <h2 id="about-heading" className="text-title-1 text-primary">
              {about.heading}
            </h2>
          </Reveal>

          <Reveal delay={90} className="measure">
            <div className="flex flex-col gap-5">
              {about.paragraphs.map((p) => (
                <p key={p} className="text-body text-secondary">
                  {p}
                </p>
              ))}
            </div>
            <p className="text-mono mt-8 text-primary">{about.signature}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
