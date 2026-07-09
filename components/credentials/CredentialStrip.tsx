import { credentials } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §3 Credential strip — light, quiet. A single restrained line of proof before
 * the demos: shipped-to-production employers as an understated logotype row.
 * Roles are dropped here to keep it calm (detail lives in About).
 */
export function CredentialStrip() {
  return (
    <section aria-label="Track record" className="hairline-top hairline-bottom">
      <div className="container-content py-16 sm:py-20">
        <Reveal>
          <p className="eyebrow mb-8">Shipped to production at</p>
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {credentials.employers.map((e) => (
              <li
                key={e.company}
                className="text-title-3 text-primary/70 transition-colors duration-200 hover:text-primary"
              >
                {e.company}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
