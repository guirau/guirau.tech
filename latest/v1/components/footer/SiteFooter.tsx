import { footer, site } from "@/lib/content";

/**
 * §9 Footer — light. Secondary conversion + trust details (contact, LinkedIn,
 * legal, remote/timezone).
 */
export function SiteFooter() {
  return (
    <footer className="hairline-top bg-surface-1">
      <div className="container-content flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-mono font-semibold text-primary">{site.name}</p>
          <p className="text-small mt-3 text-secondary">{footer.location}</p>
          <p className="text-caption mt-1">{footer.entity}</p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${footer.email}`}
            className="text-small text-secondary transition-colors duration-150 hover:text-accent"
          >
            {footer.email}
          </a>
          <a
            href={footer.linkedin.href}
            className="text-small text-secondary transition-colors duration-150 hover:text-accent"
          >
            {footer.linkedin.label}
          </a>
        </div>

        <ul className="flex flex-col gap-3">
          {footer.legal.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-small text-tertiary transition-colors duration-150 hover:text-secondary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
