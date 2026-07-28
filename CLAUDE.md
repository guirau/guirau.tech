# CLAUDE.md

Guidance for Claude Code when working in this repository.

## ⛔ Files NOT to read

Do **not** open, `cat`, `grep`, or otherwise load the contents of these paths.
They are stale or private and will pollute fresh work:

- **`docs/method.md`** — private working notes. Not an input to the build.
- **v0 at the repo root** — `index.html`, `assets/`, `images/`, `projects/`. The
  original HTML5 UP template (jQuery, FontAwesome, SASS). It is **not** the design
  direction for v2, and reading it biases new work toward outdated patterns.
  It was previously archived under `_legacy/`; that directory no longer exists and
  the v0 files were restored to root, so this rule now names the root paths instead.

  **Narrow exception:** `index.html` is the *live* site and the reference for the
  footer legal string. Reading a specific line to confirm that string is fine
  (it is `Alejandro Guirau - Software Consulting`, plain hyphen, at lines 4, 24
  and 385). Do not read it for layout, styling, or markup patterns.

> A hard backstop for the Read tool is configured in `.claude/settings.local.json`
> (`permissions.deny`). This section extends that to Bash/Grep by intent — please
> respect it rather than working around it.

## What this project is

**guirau.tech** — a single-page scroll portfolio site that works as a
**client-acquisition funnel** for Alejandro Guirau, a freelance AI/ML engineer and
consultant. It is not a personal homepage or art project; its job is to convert
tech-space prospects into booked discovery calls.

Funnel: **live ML demos build trust → productized offers convert → free discovery
call closes.** See `docs/CONTEXT.md` for the full why/who/strategy.

## Current status

Three generations of the site coexist in this repo:

| Where | What | State |
|---|---|---|
| repo **root** | **v0** — the original HTML5 UP template site | **currently live** on GitHub Pages; kept for Meta domain verification |
| `latest/v1/` | **v1** — Next.js + Tailwind build of the nine-section scroll funnel (hero → credentials → proof zone → services ladder → process → about → final CTA) | built, **not deployed** |
| `latest/v2/` | **v2** — single-screen robot page. The current work. | **not yet built** — spec written, no code |

**v2 is the active target.** This file's design system, structure, and tech
sections describe v2 and only v2; they previously described v1, whose blueprint
now lives in git history and in the `latest/v1/` source itself.

## Repository map

```
.
├── index.html, assets/, images/, projects/   # v0 — live site (see Cautions)
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
│   ├── support/              # Apple HIG notes, working checklist
│   ├── variants/             # Niche copy variants (creator, performance)
│   ├── higgsfield-model-specs.json   # Captured CLI parameter schemas
│   └── method.md             # ⛔ private notes — do not read
├── docs/reference/           # gitignored — third-party screenshots, never ship
└── .github/workflows/
    └── static.yml            # Publishes the ENTIRE repo to GitHub Pages
```

## Documentation hierarchy (sources of truth)

1. **`docs/CONTEXT.md`** — the *why and who*. Read first for orientation.
2. **`CLAUDE.md`** (this file) — the rules to obey when building v2.
3. **`docs/superpowers/specs/2026-07-28-latest-v2-robot-design.md`** — the v2
   build spec: page structure, asset pipeline, robot runtime, acceptance criteria.
4. **`docs/DESIGN-SYSTEM.md`** — v2 visual system. Authoritative for every token,
   contrast ratio, and composition rule; tags each value measured / derived /
   to-be-tuned.
5. **`docs/CONTENT.md`** — the *actual words and numbers* (offers, prices,
   employer names, headlines, CTAs). Single source of truth for copy — do not
   invent or alter offers/prices; pull them from here.

## Style & Design System

**Full spec: `docs/DESIGN-SYSTEM.md`.** That file is authoritative and tags every
value as measured / derived / to-be-tuned. This section is the summary and the
non-negotiables.

Derived from Apple's **MacBook Pro product page**, measured live from computed
styles — not from the HIG. The two are different design languages from the same
company: the HIG governs app UI, the product page governs marketing. v2 is a
marketing page. (`docs/support/Apple_design_system.md` is the HIG doc; it still
supplies the accessibility floor and the reserve-colour-for-action rule.)

### The five rules

1. **Two background values, total** — `#000000` and `#1D1D1F`. Not a ramp.
2. **Depth from surface delta, not shadows** — no `box-shadow` anywhere on the
   page. Elevation is a luminance step plus a 28px radius.
3. **Display type is weight 600; buttons are weight 400** — never 700, anywhere.
   Hierarchy comes from size, and the button earns emphasis from its fill.
4. **Rhythm is asymmetric** — nothing is padded equally on all sides.
5. **One colour moment** — a gradient-clipped headline, in an otherwise
   monochrome page. Blue appears only on interactive elements.

### Tokens (abbreviated — full set in `DESIGN-SYSTEM.md`)

| Role | Value | Note |
|---|---|---|
| `--surface-0` | `#000000` | page, robot stage |
| `--surface-1` | `#1D1D1F` | raised: dialogs, floating card |
| `--text-primary` | `#F5F5F7` | 19.3:1 on surface-0 |
| `--text-secondary` | `#86868B` | 5.8:1 — there is **no** tertiary tier |
| `--accent` | `#0071E3` | **fill only** |
| `--accent-text` | `#2997FF` | text links on black |
| `--on-accent` | `#FFFFFF` | 4.70:1 on accent, tight |

**`color: var(--accent)` is forbidden.** `#0071E3` as text on black measures
4.47:1 and fails AA. It is a fill colour; `--accent-text` is the text colour.
For the same reason `--accent-hover` goes *lighter*, not darker.

### Typefaces

Geist Sans and Geist Mono, self-hosted variable, subset, `font-display: swap`.
Unchanged. SF Pro is not an option — the `-apple-system` stack renders SF only on
Apple devices and falls back to Helvetica/Arial elsewhere, which would show a
third of visitors a design tuned for a font they are not seeing.

**Tracking is not portable from Apple.** Their curve (near-neutral at display,
−0.022em at body) is a product of SF Pro's optical sizing, which Geist lacks.
Transfer the principle — per-size optical correction set by eye — not the
numbers. Starting values and the record of final tuned values live in
`DESIGN-SYSTEM.md` §2.3.

### Dark, and why that is not a contradiction

Earlier versions of this file locked a light-primary system with dark reserved
for "proof zones", and forbade flipping the site dark on `prefers-color-scheme`.

That prohibition still holds and is still obeyed. v2 is dark because it is
**art-directed dark**, not because the OS asked. The light → dark → light rhythm
it governed described a nine-section scroll page; v2 has one screen and no
scroll, so there are no zones to alternate between.

Non-negotiable: WCAG AA verified as a build-time gate, `prefers-reduced-motion`
respected, focus-visible rings, self-hosted subset variable fonts,
compositor-only motion (`transform` / `opacity` / `clip-path`).

## Structure & Narrative Flow

**Full spec: `docs/superpowers/specs/2026-07-28-latest-v2-robot-design.md`.**

One screen. `100dvh`. No page scroll, no nav, no sections.

### Composition — asymmetric marquee

Not a centred hero. Following Apple's product marquee: subject upper, type
bottom-left, floating action card bottom-right.

```text
┌─ 100dvh ─────────────────────────────────────────────┐
│                  ╭──────────╮                        │  full-bleed canvas,
│                  │  ROBOT   │                        │  robot in upper ~60%,
│                  ╰──────────╯                        │  biased right
│                                                      │
│  Alejandro Guirau                    ← tagline       │
│  Freelance AI engineer.              ← headline,     │
│  Production systems, not prototypes.   gradient      │
│                              ╭─────────────────────╮ │
│  LinkedIn   GitHub           │ Services  ( Contact )│ │
│                              ╰─────────────────────╯ │
│  Alejandro Guirau - Software Consulting              │
└──────────────────────────────────────────────────────┘
```

The robot canvas is a `position: fixed` full-bleed backdrop; the marquee grid
overlays it. Below 900px everything stacks and centres.

### Why the links split

Two different jobs, so two different weights:

- **bottom-left, quiet** — LinkedIn, GitHub. Credentials. A visitor verifying
  you goes looking for these; they do not need to be loud.
- **bottom-right, in the raised card** — Services as a text link, Contact as the
  blue pill. Apple's "From $1,599" + "Buy" pairing: context beside the single
  committed action.

Conversion gets one unambiguous target.

### Where conversion lands

Single and emphatic: **Contact**, the only blue pill on the page. Services is
the supporting context beside it. Both open native `<dialog>` modals; LinkedIn
and GitHub leave the page.

### Motion

Exactly two moments, unchanged: the **staged text reveal** and the **one-shot
dolly-out** (3.7s, `cubic-bezier(0.16, 1, 0.3, 1)`). Apple's product-page motion
is scroll-driven and does not port to a single screen. Everything else is a
150ms hover/focus transition.

### Swappable-for-niching blocks

Content-only, so a future niche re-skin (creator economy, performance marketing
— see `CONTEXT.md`) never touches structure: the headline and tagline, and the
Services dialog copy. Fixed regardless of niche: the marquee composition, the
link split, the accent-driven Contact pill, and the footer legal string.

> **Content note:** pull all words/numbers from `CONTENT.md`. **Santander is
> gated** — held back, confirm before it ships publicly (see Cautions).
## Positioning & Copy Strategy

Durable strategy for the build. The *words and numbers* live in `CONTENT.md`
(single source of truth); this section captures only the high-level decisions
that govern how those words are framed and where they may be swapped.

### Positioning strategy

- **Lead with production engineering, sincerely.** Present real, deployed ML and
  systems as the through-line; let proof compound into the pitch. Never hedge the
  engineering claim behind irony or hype.
- **Broad now, niche later.** Audience is generic (any business needing production
  AI apps, agents, automations). Niche re-skins come later — candidates: creator
  economy, performance marketing (variant copy in `docs/variants/`).
- **Swappable-for-niching blocks (content-only, never structural):** the headline
  and tagline, and the Services dialog copy. **Fixed regardless of niche:** the
  marquee composition, the link split, the accent-driven Contact pill, and the
  footer legal string.

### Core differentiator (thread everywhere)

**Production-grade engineering — real trained ML and deployed systems, not
prototypes or no-code patchwork.** It is the site's whole reason to be believed.

In v2 the proof is the robot itself: a real WebGL humanoid, rigged and animated,
rather than a stock illustration. It has to carry the claim that the nine-section
funnel's live ML demos used to carry, which is why its fidelity is specified so
tightly in the build spec. Geist Mono remains the typographic tell, now scoped to
prices and durations in the Services dialog.

### Copy & tone rules

- **Voice:** outcome-first, plain English, confident and direct, no hype.
- **Source of truth:** pull every word/number from `CONTENT.md`; niche variants
  from `docs/variants/`. Never invent or alter offers, prices, tiers, or credentials.
- **No em-dashes in authored copy.** `CONTENT.md` currently contains em-dashes;
  preserve that text verbatim where it renders as copy, and let heading
  label/subtitle dashes resolve into layout (two typographic elements) rather than
  editing them. Never add a new em-dash.
- **One conversion.** The single emphatic ask is **Contact** — the only blue pill
  on the page. The Services dialog presents the offers and their prices, but
  carries no per-card CTA; every path ends at the same contact form.

### Funnel role

v2 compresses the funnel into one screen. The robot builds trust, Services
prices the work, Contact closes. Proof still precedes pitch — the visitor sees
the robot before they can read a price — but the sequence is now spatial rather
than scrolled. The composition and link hierarchy are specified in **Structure &
Narrative Flow** above; that section is the authority.

## Tech & deployment

- **Stack:** static HTML, CSS and ES modules. **No framework, no build step at
  deploy time.** Three.js is vendored as a committed, pre-bundled artifact so the
  host never has to run a build. Geist is self-hosted directly. There is no
  Next.js, no Tailwind, and no shadcn/ui in v2 — the page is one screen with two
  dialogs and a WebGL canvas, and a framework would cost more than it returns.
- **Deploy:** **GitHub Pages**, via `.github/workflows/static.yml` on push to
  `main`. The workflow uploads the **entire repository** verbatim (`path: '.'`)
  with no build step, which has two consequences that govern everything else:
  1. Anything committed is published. `docs/reference/` is gitignored for exactly
     this reason (third-party screenshots must never ship).
  2. Committed build artifacts must not go stale — see the staleness rule in the
     build spec §3.1.
- **Root-readiness:** v2 is built to be promotable to the site root without
  rework, because business verification inspects the home page (see Cautions).
- Standards: semantic HTML, design tokens over hardcoded values,
  compositor-friendly motion, accessibility, and a landing-page budget of
  **JS < 150kb, CSS < 30kb** gzipped.

## Cautions / open questions

- **`static.yml` publishes the whole repo.** `path: '.'` with no build step means
  every committed file is served, including `docs/`. This is the deploy path for
  v2, so it must not simply be deleted — but before launch, decide what to do
  about `docs/` being publicly reachable (pricing and strategy are in there).
  Options: move the site into a subdirectory and set `path:` to it, or accept
  publication and scrub `docs/`. Not yet decided.
- **Meta business verification reads the home page.** The footer legal string
  `Alejandro Guirau - Software Consulting` must render as real text, with a plain
  hyphen-minus, matching the root `index.html` character-for-character (it is
  there at lines 4, 24 and 385). A footer at `/latest/v2/` does nothing for
  verification until v2 is promoted to root.
- **Promoting v2 to root replaces the live v0 site.** v0 is currently deployed
  and is what Meta is verifying against right now. Do not promote v2 without
  carrying over, and re-verifying: the legal string, the Meta domain-verification
  meta tag, the canonical URL, and the favicon. Recent history shows a deliberate
  revert *back* to v0 for verification, so treat root as load-bearing.
- **v1 is built but undocumented here.** `latest/v1/` is a complete Next.js +
  Tailwind implementation of the nine-section funnel. This file used to describe
  it; those sections now describe v2. If v1 is ever revived, recover its design
  system and section blueprint from git history (before the v2 rewrite) rather
  than reconstructing them.
- **Employer list is not settled.** `CONTEXT.md` says to *confirm Santander
  before it ships publicly*, while `CONTENT.md` lists it. Resolved for now:
  **Santander is held back.** Confirm before anything goes public.
