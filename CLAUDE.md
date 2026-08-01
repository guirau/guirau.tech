# CLAUDE.md

Guidance for Claude Code when working in this repository.

This file is **rules to obey**. It is deliberately not a spec — where a detail is
specified elsewhere, this file points rather than restates, so the two can never
drift apart. See **Documentation hierarchy** for which file owns what.

## ⛔ Files NOT to read

Do **not** open, `cat`, `grep`, or otherwise load the contents of these paths.
They are stale or private and will pollute fresh work:

- **v0 at the repo root** — `index.html`, `assets/`, `images/`, `projects/`. The
  original HTML5 UP template (jQuery, FontAwesome, SASS). It is **not** the design
  direction for v2, and reading it biases new work toward outdated patterns.

  **Narrow exception:** `index.html` is the *live* site and the reference for the
  footer legal string. Reading a specific line to confirm that string is fine
  (it is `Alejandro Guirau - Software Consulting`, plain hyphen, at lines 4, 24
  and 385). Do not read it for layout, styling, or markup patterns.

> A hard backstop for the Read tool is configured in `.claude/settings.local.json`
> (`permissions.deny`). This section extends that to Bash/Grep by intent — please
> respect it rather than working around it.

### `docs/method.md` — readable, but not authoritative

Formerly listed above as unreadable. It is Alejandro's working notes on *how to
build an animated site with Claude + Higgsfield*, and it is a legitimate input
to **process** questions: how to stage generation, what to gate on, what the
polish passes are.

It is **not** a spec, and two of its assumptions do not hold for v2:

- It describes a **single-page scroll** site throughout — narrative flow, scroll
  moments, frame-by-frame scroll wiring. v2 is one screen with no scroll, so
  its Phase 2 structure work and Phase 4 scroll wiring do not apply.
- It recommends **UI/UX Pro Max** and a Next.js/Tailwind/shadcn default stack.
  Both are superseded below and in `docs/DESIGN-SYSTEM.md`. By `method.md`'s own
  rule — *"if anything conflicts with CLAUDE.md, CLAUDE.md wins"* — this file
  and the docs it points to take precedence.

It also holds a **second copy of the offer content**. `CONTENT.md` owns the
words and numbers; treat the copy in `method.md` as a snapshot that may drift.
They agree as of this writing.

## What this project is

**guirau.tech** — a client-acquisition funnel for Alejandro Guirau, a freelance
AI/ML engineer and consultant. Not a personal homepage or an art project; its job
is to convert tech-space prospects into booked discovery calls.

**v2 compresses the funnel onto one screen:** the robot builds trust, Services
prices the work, Contact closes. Proof still precedes pitch — the visitor sees the
robot before they can read a price — but the sequence is spatial, not scrolled.

See `docs/CONTEXT.md` for the full why/who/strategy.

## Current status

Three generations coexist in this repo:

| Where | What | State |
|---|---|---|
| repo **root** | **v0** — original HTML5 UP template | **currently live** on GitHub Pages; kept for Meta domain verification |
| `latest/v1/` | **v1** — Next.js + Tailwind, nine-section scroll funnel | built, **not deployed** |
| `latest/v2/` | **v2** — single-screen robot page | **not yet built** — spec written, no code |

**v2 is the active target.** Everything below governs v2 and only v2.

## Repository map

```
.
├── index.html, assets/, images/, projects/   # v0 — live site (see ⛔ above)
├── latest/
│   ├── v1/                   # Next.js build of the nine-section funnel
│   └── v2/                   # ← the current work (not yet created)
├── docs/
│   ├── CONTEXT.md            # Why/who/funnel/success criteria — read first
│   ├── CONTENT.md            # Actual copy: offers, prices, tiers, credentials
│   ├── DESIGN-SYSTEM.md      # v2 design system (Apple-derived, measured)
│   ├── STRUCTURE.md          # Scroll-showcase reference pattern
│   ├── superpowers/specs/    # Build specs — v2 robot page lives here
│   ├── setup-guides/         # 3D toolchain setup (Blender, Higgsfield)
│   ├── support/              # Apple reference docs, working checklist
│   ├── variants/             # Niche copy variants (creator, performance)
│   ├── higgsfield-model-specs.json   # Captured CLI parameter schemas
│   └── method.md             # ⛔ private notes — do not read
├── docs/reference/           # gitignored — third-party screenshots, never ship
└── .github/workflows/
    └── static.yml            # Publishes the ENTIRE repo to GitHub Pages
```

## Documentation hierarchy (sources of truth)

Consult in this order. Each file is authoritative for its column; do not
reconstruct its contents here or anywhere else.

| # | File | Owns |
|---|---|---|
| 1 | `docs/CONTEXT.md` | The *why and who*. Read first for orientation. |
| 2 | **`CLAUDE.md`** (this file) | The rules to obey. |
| 3 | `docs/superpowers/specs/2026-07-28-latest-v2-robot-design.md` | *What is on the page and how it is produced* — page structure, dialogs, asset pipeline, robot runtime, motion timings, acceptance criteria. |
| 4 | `docs/DESIGN-SYSTEM.md` | *How it is drawn* — every token, contrast ratio, type value, interaction state, and the marquee's grid CSS and breakpoints. Tags each value as measured / derived / to-be-tuned. |
| 5 | `docs/CONTENT.md` | The *actual words and numbers* — offers, prices, employers, headlines, CTAs. |

**Apple reference material** in `docs/support/`, both third-party, neither
authoritative on its own:

- `apple_design_system_app.md` — the **HIG** (app UI). Supplies the accessibility
  floor and the reserve-colour-for-action rule.
- `apple_design_system_web.md` — a **marketing-site** analysis (VoltAgent, MIT;
  vendored byte-identical to `npx getdesign@latest add apple`, so leave it
  verbatim). Light-dominant by its own admission, so it **cannot govern v2's dark
  treatment**. Reconciled against our measurements in `DESIGN-SYSTEM.md` §9.

The two Apple docs are different design languages from the same company. v2 is a
marketing page, and `DESIGN-SYSTEM.md` is measured from Apple's live MacBook Pro
product page rather than derived from either doc.

### `DESIGN-SYSTEM.md` is the only design authority. Do not run design skills.

**Build v2's frontend from `docs/DESIGN-SYSTEM.md` and nothing else.** No
design-recommendation skill, no generated design system, no proposed style
directions. This includes `ui-ux-pro-max`, which `docs/method.md` recommends —
that recommendation is superseded here.

The reasoning generalises past that one skill. A recommender's job is to
*choose* a direction, palette and type pairing from a catalogue. **v2 has
already chosen all three, by measuring Apple's live product page rather than by
picking from a list.** Running one now would not add a viewpoint; it would add
a second source of truth competing with `DESIGN-SYSTEM.md`, and that argument
resolves the wrong way — measured values ("`#1D1D1F`, sampled") lose to
confident ones ("dark-luxury palette, 161 options"). Their stack presets are
Tailwind-first besides, which v2 bans.

For a one-screen page with two dialogs and a canvas, that is overengineering:
cost and risk with no decision left to make.

Such tools are reasonable where nothing is chosen yet. The niche re-skins in
`docs/variants/` are the plausible future case, and those are content-only
today. Not v2's design system.

## Non-negotiables

These are the rules. Values, rationale, and specification live in the files above.

**Colour and depth**

- Two background values, total. Not a ramp.
- No `box-shadow` anywhere. Elevation is a luminance step plus a radius.
- One colour moment: the gradient headline. Blue is otherwise interactive-only.
- **`color: var(--accent)` is forbidden** — it fails AA as text. It is a fill and
  a focus ring. This bans the *property*, not the token (`DESIGN-SYSTEM.md` §1.4).

**Type**

- Display type is weight **600**. Buttons are **400**. Never 700, never 500.
- Geist Sans and Geist Mono, self-hosted variable, subset, `font-display: swap`.
  SF Pro is not an option — `-apple-system` renders it only on Apple devices.
- **Do not copy Apple's tracking numbers.** They are an artifact of SF Pro's
  optical sizing, which Geist lacks; transfer the principle, tune by eye
  (`DESIGN-SYSTEM.md` §2.3). Line height *does* port directly (§2.4).
- The name is the **eyebrow** (small, grey); the positioning line is the
  **headline** (large, gradient). Do not promote the name to display size
  (`DESIGN-SYSTEM.md` §2.5).

**Composition and rhythm**

- Rhythm is asymmetric — nothing is padded equally on all sides.
- One screen, `100dvh`, no page scroll, no nav, no sections.
- **One conversion.** Contact is the only blue pill on the page. Services is
  supporting context beside it, with no per-card CTA.

**Accessibility and performance** — all build-time gates, not aspirations

- WCAG AA verified; `prefers-reduced-motion` respected; `focus-visible` rings.
- Compositor-only motion — `transform` / `opacity` / `clip-path`.
- Budget: **JS < 150kb, CSS < 30kb** gzipped.

### Dark, and why that is not a contradiction

Earlier versions of this file locked a light-primary system with dark reserved
for "proof zones", and forbade flipping the site dark on `prefers-color-scheme`.

That prohibition still holds and is still obeyed. v2 is dark because it is
**art-directed dark**, not because the OS asked. The light → dark → light rhythm
it governed described a nine-section scroll page; v2 has one screen and no
scroll, so there are no zones to alternate between.

## Copy rules

The words themselves are in `CONTENT.md`; niche variants in `docs/variants/`.
These are the constraints on using them:

- **Never invent or alter** offers, prices, tiers, or credentials. Pull them.
- **Voice:** outcome-first, plain English, confident and direct, no hype.
- **Lead with production engineering, sincerely.** The differentiator is real
  trained ML and deployed systems, not prototypes or no-code patchwork. Never
  hedge it behind irony. In v2 the robot *is* the proof — a real WebGL humanoid,
  which is why the spec pins its fidelity so tightly. Geist Mono is the
  typographic tell, scoped to prices and durations in the Services dialog.
- **No em-dashes in authored copy.** `CONTENT.md` contains some; preserve that
  text verbatim where it renders as copy, and let heading label/subtitle dashes
  resolve into layout rather than editing them. Never add a new em-dash.
- **Santander is held back** — confirm before it ships publicly (see Cautions).

**Swappable for niching (content only, never structural):** the headline and
eyebrow, and the Services dialog copy. **Fixed regardless of niche:** the marquee
composition, the link split, the accent-driven Contact pill, and the footer legal
string. Audience is generic for now; niche re-skins come later.

## Tech & deployment

- **Stack:** static HTML, CSS and ES modules. **No framework, no build step at
  deploy time.** Three.js is vendored as a committed, pre-bundled artifact so the
  host never has to run a build; Geist is self-hosted directly. No Next.js, no
  Tailwind, no shadcn/ui in v2 — one screen with two dialogs and a WebGL canvas,
  where a framework would cost more than it returns.
- **Deploy:** GitHub Pages via `.github/workflows/static.yml` on push to `main`.
  It uploads the **entire repository** verbatim (`path: '.'`) with no build step.
  Two consequences govern everything else:
  1. Anything committed is published. `docs/reference/` is gitignored for exactly
     this reason.
  2. Committed build artifacts must not go stale — see the build spec §3.1.
- **Root-readiness:** v2 must be promotable to the site root without rework,
  because business verification inspects the home page (see Cautions).

## Cautions / open questions

- **`static.yml` publishes the whole repo.** `path: '.'` with no build step means
  every committed file is served, including `docs/` (pricing and strategy are in
  there). It is the deploy path for v2, so it must not simply be deleted. Before
  launch, decide: move the site into a subdirectory and set `path:` to it, or
  accept publication and scrub `docs/`. **Not yet decided.**
- **Meta business verification reads the home page.** The footer legal string
  `Alejandro Guirau - Software Consulting` must render as real text with a plain
  hyphen-minus, matching root `index.html` character-for-character. A footer at
  `/latest/v2/` does nothing for verification until v2 is promoted to root.
- **Promoting v2 to root replaces the live v0 site.** v0 is what Meta is verifying
  against right now. Do not promote without carrying over and re-verifying: the
  legal string, the Meta domain-verification meta tag, the canonical URL, and the
  favicon. Additionally, `assets/robot-poster.webp` must exist on disk before
  promotion: its preload is committed ahead of the file by design, and shipping
  the 404 to root would hit reduced-motion users specifically. Recent history
  shows a deliberate revert *back* to v0 for verification, so treat root as
  load-bearing.
- **v1 is built but undocumented here.** If `latest/v1/` is ever revived, recover
  its design system and section blueprint from git history (before the v2
  rewrite) rather than reconstructing them.
- **Employer list is not settled.** `CONTEXT.md` says to confirm Santander before
  it ships publicly, while `CONTENT.md` lists it. Resolved for now: **held back.**
