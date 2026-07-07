import { credentials } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §3 Credential strip — light, quiet. Instant authority anchor before the
 * demos; deliberately restrained to contrast the loud proof beat that follows.
 */
export function CredentialStrip() {
  return (
    <section
      aria-label="Track record"
      className="hairline-top hairline-bottom bg-surface-1"
    >
      <div className="container-content py-14 sm:py-16">
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <p className="text-title-3 max-w-xs shrink-0 text-primary">
            {credentials.lead}
          </p>

          <ul className="grid flex-1 grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            {credentials.employers.map((e) => (
              <li key={e.company} className="flex flex-col gap-1">
                <span className="text-body font-semibold text-primary">
                  {e.company}
                </span>
                <span className="text-small text-secondary">{e.role}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
