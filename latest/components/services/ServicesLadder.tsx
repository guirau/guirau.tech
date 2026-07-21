import { services, type Offer } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * §5 Services — priced ladder, told as a story, not a spec sheet. Each offer is
 * one confident line + price (detail belongs on the discovery call, not a
 * brochure). Flagship anchored. Prices shown to qualify. No per-card CTA; the
 * single ask lands at §8.
 */
function OfferRow({ offer }: { offer: Offer }) {
  const name = offer.nameSub ? `${offer.name} ${offer.nameSub}` : offer.name;
  return (
    <div
      className={`grid grid-cols-1 items-baseline gap-x-8 gap-y-3 py-8 sm:grid-cols-[auto_1fr_auto] sm:py-10 ${
        offer.flagship ? "sm:py-12" : ""
      }`}
    >
      <span className="text-mono text-tertiary">{offer.index}</span>

      <div>
        <h3
          className={`text-primary ${offer.flagship ? "text-title-1" : "text-title-2"}`}
        >
          {name}
        </h3>
        <p className="text-lead mt-2 max-w-[46ch]">{offer.tagline}</p>
      </div>

      <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
        <span
          className={`text-primary ${offer.flagship ? "text-title-1" : "text-title-2"}`}
        >
          {offer.price}
        </span>
        <span className="text-small text-secondary">{offer.duration}</span>
      </div>
    </div>
  );
}

export function ServicesLadder() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section"
    >
      <div className="container-content">
        <Reveal className="measure">
          <p className="eyebrow mb-5">{services.eyebrow}</p>
          <h2 id="services-heading" className="text-title-1 text-primary">
            {services.heading}
          </h2>
          <p className="text-lead mt-5">{services.lead}</p>
        </Reveal>

        <div className="mt-16">
          {services.offers.map((offer, i) => (
            <Reveal
              key={offer.id}
              delay={i * 80}
              className={`block border-t border-[var(--hairline)] ${
                offer.flagship
                  ? "mt-2 border-t-2 border-[var(--border)]"
                  : ""
              }`}
            >
              <OfferRow offer={offer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
