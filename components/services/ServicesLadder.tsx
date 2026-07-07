import { services, type Offer } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/** Renders a bullet, resolving a verbatim "Label: description" into a bold
 *  label + description (only the flagship's CONTENT.md bullets use colons). */
function BulletText({ text }: { text: string }) {
  const idx = text.indexOf(": ");
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      <span className="font-semibold text-primary">{text.slice(0, idx)}</span>
      {text.slice(idx + 1)}
    </span>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="mt-1 shrink-0 text-accent"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PriceLine({
  offer,
  hideNote = false,
}: {
  offer: Offer;
  hideNote?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-title-2 text-primary">{offer.price}</span>
      <span className="text-small text-secondary">{offer.duration}</span>
      {offer.note && !hideNote ? (
        <span className="chip chip-accent ml-auto">{offer.note}</span>
      ) : null}
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="surface-card flex h-full flex-col p-7">
      <div className="flex items-center justify-between">
        <span className="text-mono text-tertiary">{offer.index}</span>
      </div>

      <h3 className="text-title-3 mt-4 text-primary">{offer.name}</h3>
      <div className="mt-4">
        <PriceLine offer={offer} />
      </div>

      <p className="text-body mt-5 font-medium text-primary">{offer.headline}</p>
      <p className="text-small mt-1 text-secondary">{offer.tagline}</p>

      <ul className="mt-6 flex flex-col gap-2.5">
        {offer.whatYouGet.map((item) => (
          <li key={item} className="text-small flex gap-2.5 text-secondary">
            <Check />
            <BulletText text={item} />
          </li>
        ))}
      </ul>

      {offer.tiers ? (
        <ul className="mt-6 flex flex-col gap-px overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hairline)]">
          {offer.tiers.map((tier) => (
            <li
              key={tier.name}
              className="flex flex-wrap items-baseline gap-x-2 bg-surface-2 px-4 py-3"
            >
              <span className="text-small font-semibold text-primary">
                {tier.name}
              </span>
              {tier.recommended ? (
                <span className="chip chip-accent">recommended</span>
              ) : null}
              <span className="text-mono ml-auto text-secondary">
                {tier.price}
              </span>
              <span className="text-caption w-full">{tier.desc}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function FlagshipCard({ offer }: { offer: Offer }) {
  return (
    <article
      className="relative overflow-hidden rounded-[var(--radius-lg)] border p-8 sm:p-10"
      style={{
        borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border))",
        backgroundColor: "var(--accent-tint)",
      }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-mono text-accent">{offer.index}</span>
            <span className="chip chip-accent">{offer.note}</span>
          </div>
          <h3 className="text-title-1 mt-5 text-primary">
            {offer.name}
            {offer.nameSub ? (
              <span className="block font-normal text-secondary">
                {offer.nameSub}
              </span>
            ) : null}
          </h3>
          <div className="mt-5">
            <PriceLine offer={offer} hideNote />
          </div>
          <p className="text-lead mt-6 max-w-md text-primary">
            {offer.headline}
          </p>
          <p className="text-body mt-1 text-secondary">{offer.tagline}</p>
        </div>

        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:content-center">
          {offer.whatYouGet.map((item) => (
            <li key={item} className="text-small flex gap-2.5 text-secondary">
              <Check />
              <BulletText text={item} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/**
 * §5 Services — priced ladder. Placed right after the trust peak. Flagship
 * anchored; prices shown to qualify leads; NO per-card CTA (the single ask is
 * withheld to §8). Bento composition per the Instrument Panel direction.
 */
export function ServicesLadder() {
  const ladder = services.offers.filter((o) => !o.flagship);
  const flagship = services.offers.find((o) => o.flagship);

  return (
    <section id="services" aria-labelledby="services-heading" className="section">
      <div className="container-content">
        <Reveal className="measure">
          <p className="eyebrow mb-5">{services.eyebrow}</p>
          <h2 id="services-heading" className="text-title-1 text-primary">
            {services.heading}
          </h2>
          <p className="text-lead mt-5">{services.lead}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {ladder.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 90} className="h-full">
              <OfferCard offer={offer} />
            </Reveal>
          ))}
        </div>

        {flagship ? (
          <Reveal delay={120} className="mt-5 block">
            <FlagshipCard offer={flagship} />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
