# CLAUDE.md

Guidance for Claude Code when working in this repository.

## ⛔ Files NOT to read

Do **not** open, `cat`, `grep`, or otherwise load the contents of these paths.
They are stale or private and will pollute fresh work:

- **`_legacy/`** — the old v0 website (HTML5 UP template, jQuery, FontAwesome, SASS).
  Kept for reference only. It is **not** the design direction for the rebuild; reading
  it biases new work toward outdated patterns.
- **`docs/METHOD.md`** — private working notes. Not an input to the build.

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

Rebuild in progress. The **new site has not been built yet** — there is no
production HTML/CSS/JS at the repo root, no `package.json`, and no build tooling.
Right now the repo holds **planning docs** (`docs/`) plus the archived v0 in
`_legacy/`.

## Repository map

```
.
├── docs/                     # Planning & content (source of truth for the build)
│   ├── CONTEXT.md            # Why/who/funnel/success criteria — read first
│   ├── CONTENT.md            # Actual copy: offers, prices, tiers, credentials, CTAs
│   ├── variants/             # Niche copy variants (creator, performance)
│   ├── the_10k_checklist.md  # Working checklist
│   └── METHOD.md             # ⛔ private notes — do not read
├── _legacy/                  # ⛔ archived v0 site — do not read
├── .github/workflows/
│   └── static.yml            # Deploys the repo to GitHub Pages on push to main
└── .claude/
    └── settings.local.json   # Local permissions (deny rules for the paths above)
```

## Documentation hierarchy (sources of truth)

1. **`docs/CONTEXT.md`** — the *why and who*. Read first for orientation.
2. **`CLAUDE.md`** (this file) — the rules to obey when building. Over time this
   grows to hold the design system, structure/narrative blueprint, and copy
   *strategy* (per the intent noted in CONTEXT.md).
3. **`docs/CONTENT.md`** — the *actual words and numbers* (offers, prices,
   employer names, headlines, CTAs). Single source of truth for copy — do not
   invent or alter offers/prices; pull them from here.

## Style & Design System

The locked visual direction for the rebuild. Derived from Apple's HIG
(clarity / deference / depth) but re-tuned from a calm *content app* into a
*conversion funnel*: keep Apple's engineering discipline (restraint, semantic
colour, hierarchy-by-weight, accessibility); drop the parts tuned for passive
consumption rather than active persuasion. **Reference:** `docs/Apple_Design_System.md`.

### Typefaces

- **Display & body: Geist Sans** — self-hosted, variable (`wght` 400–700),
  Latin-subset `woff2`. SF-adjacent and neutral, but built for a developer-tools
  brand, so it carries "modern engineering" without being loud. Chosen over Inter
  deliberately (Inter is the SaaS default — too template).
- **Technical: Geist Mono** — the designed companion. Reserved for *evidence*:
  model names (`CLIP ViT-B/32`, `SegFormer`), demo output, latency/confidence
  readouts, endpoint/technical labels. Mono is not decoration — it is the
  typographic tell for the site's core differentiator (real production engineering).
- One family, two roles. Hierarchy comes from **weight + size + space**, never a
  third face or scattered colour.
- Perf: variable file covers all weights; preload only the hero weight;
  `font-display: swap` for the rest (on Next.js, `next/font` self-hosts and
  subsets Geist automatically). Landing-page budget: **JS < 150kb, CSS < 30kb
  gzipped** — hold the line with server components and static rendering, ship
  client JS only where a section needs it.

### Colour palette — semantic, role-first (light default + dark proof zone)

Author role-based CSS custom properties with a light and a dark value each; the
site is **light-primary** (trust register) with **dark "proof zones"** for the
live ML demo sections. The accent (electric blue) is reserved almost entirely
for interactive elements — "coloured = clickable" — so every CTA is unmissable.

| Role | Light (default) | Dark (proof zone) |
|---|---|---|
| `--surface-0` (page) | `#FBFBFD` | `#101218` |
| `--surface-1` (cards) | `#F4F5F8` | `#191C24` |
| `--surface-2` (wells/insets) | `#EBEDF2` | `#232733` |
| `--hairline` | `#E4E7EC` | `rgba(255,255,255,.08)` |
| `--border` | `#D3D8E0` | `#3A4150` |
| `--text-primary` (label) | `#15171C` | `#F1F3F8` |
| `--text-secondary` | `#565D6B` | `#A6AEBF` |
| `--text-tertiary` (meta only) | `#878E9C` | `#707890` |
| `--accent` (electric blue) | `#1E63F5` | `#4C82FF` |
| `--accent-hover` | `#1A53D1` | `#6B99FF` |
| `--accent-tint` (bg wash) | `#EDF3FE` | `rgba(76,130,255,.12)` |
| `--on-accent` | `#FFFFFF` | `#0A0C10` |
| `--success` (signal) | `#1F9D57` | `#37C46F` |
| `--danger` | `#DC3B41` | `#FF6166` |

Rules: text-primary is off-black, not pure black. `--success`/`--danger` are
*signal* colours (demo "live"/confidence, errors) — always paired with an icon or
label, never colour alone, and never competing with the blue accent for *action*.
`--text-tertiary` is de-emphasized meta only (~3:1 — large/non-essential text).
**Contrast is a build-time gate:** verify every pairing at WCAG AA before shipping;
accent-on-white is ~4.6:1 (passes but tight), so accent-bearing text stays
≥ 16px semibold. In dark mode, accent buttons use dark `--on-accent` text.

### Type scale — fluid, with deliberate hero drama

17px body floor (Apple). Big scale *contrast* at the hero; calm mid-range.

| Token | Clamp (min → max) | Weight / tracking |
|---|---|---|
| `--text-display` (hero) | `clamp(2.75rem, 1.4rem + 6.2vw, 6rem)` 44→96px | 600, `-0.022em`, lh 1.0 |
| `--text-title-1` | `clamp(2rem, 1.6rem + 1.8vw, 2.75rem)` 32→44px | 600, `-0.015em`, lh 1.1 |
| `--text-title-2` | `clamp(1.5rem, 1.3rem + 1vw, 1.875rem)` 24→30px | 600, `-0.01em` |
| `--text-title-3` | `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)` 20→24px | 500 |
| `--text-lead` | `clamp(1.1875rem, 1.1rem + 0.4vw, 1.375rem)` 19→22px | 400, secondary colour |
| `--text-body` | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` 17→19px | 400, lh 1.55 |
| `--text-small` | `0.9375rem` 15px | 400 / 500 |
| `--text-mono` | `0.875rem` 14px | Geist Mono 500 |
| `--text-caption` | `0.8125rem` 13px | 500, tertiary |

Text measure capped ~68ch. Weights used: 400 / 500 / 600 / 700 only (no thin/ultralight).

### Spacing rhythm — 8pt grid, intentional not uniform

- Base unit **8px** (4px for fine adjustment). Non-linear scale so rhythm reads
  composed, not gridded-flat: `--space-*` = `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160` px.
- **Section rhythm:** `--space-section: clamp(5rem, 3rem + 8vw, 10rem)`.
- Content column `max-width: 1200px`; **44×44px minimum** on every interactive target.
- **Radius:** `--radius-sm 8px` (controls) · `--radius-md 12px` (cards) ·
  `--radius-lg 20px` (demo panels) · `--radius-pill 999px` (CTAs).
- **Depth:** soft layered shadows in light; luminous elevation in dark. Glass
  (`backdrop-filter: blur(16px)` + translucent surface + hairline) is used **only**
  on the sticky nav and demo control panels — never page-wide.

### Motion — two signature moments, quiet everywhere else

Tokens: `--dur-fast 150ms` · `--dur-normal 300ms` · `--dur-slow 600ms`;
`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` for entrances, standard ease for
hovers. Animate **compositor-friendly properties only** (`transform`, `opacity`,
`clip-path`).

1. **Hero staged reveal** — headline → subhead → CTA rise on opacity + small
   `translateY` (expo ease). Sets a calm-confident "senior, in control" tone.
2. **Light → dark proof-zone hinge** — scrolling into the ML demos, the surface
   transitions to the dark register and the demo result (segmentation mask /
   classification) animates in. The narrative pivot from *claim* to *proof*.

Everything else: 150ms hover/focus micro-states and CTA hover-lift. Full
`prefers-reduced-motion` fallback (opacity-only or instant; no scroll-jacking).

### Core aesthetic principles (the 5 rules that keep it coherent)

1. **Defer to content, emphasize for conversion.** One accent, reserved for action;
   drama spent only on the hero and the demos.
2. **Hierarchy from weight, size, and space** — never a second display face or
   scattered colour.
3. **Evidence is the ornament.** Mono, real demo output, and technical specificity
   *are* the decoration — production credibility is the aesthetic.
4. **Restraint as atmosphere.** Glass and motion appear surgically at named moments;
   quiet is the default.
5. **Light → dark narrative rhythm.** The page breathes between a light "trust"
   register and dark "proof" zones — the contrast carries the story.

**Theme is section-scoped, not OS-driven.** The site is light-primary; the dark
"proof zones" are applied to the demo sections regardless of the visitor's OS
setting. Do **not** flip the whole site to dark on `prefers-color-scheme: dark`
(full OS-driven theming was considered and declined) — dark is a deliberate
art-directed register for the proof sections, not a user preference toggle.

Non-negotiable: WCAG AA verified, `prefers-reduced-motion` respected,
focus-visible accent rings, self-hosted subset variable fonts, compositor-only motion.

## Structure & Narrative Flow

The locked section sequence for the single-page scroll. Derived from the
scroll-driven showcase-funnel pattern in `docs/STRUCTURE.md`, but **inverted**:
that reference hides capability behind a parody and withholds its ask until a
late rug-pull; this site *leads with real capability sincerely* and lets it
compound. Same scroll grammar (hook → demos → offers → close), opposite honesty.

### Funnel logic

**Live ML demos build trust → priced offers convert → one free discovery call
closes.** Proof precedes pitch; the pitch is only credible because the proof
already landed. The scroll walks the visitor from *"who is this?"* → *"this
person actually ships production ML"* → *"here's what I can buy, and for how
much"* → *"booking a call is low-risk and obvious."* Do not reorder demos after
offers — trust must be earned before value is priced.

### Section order (locked)

| # | Section | Register | Rationale (placement + transition) |
|---|---------|----------|-----------------------------------|
| 1 | **Sticky nav** — wayfinding anchors + *de-emphasized* "Book a call" text link | light (glass) | Orientation only; the loud ask is withheld to the close. Overlays all below. |
| 2 | **Hero** — positioning headline (production-grade AI, not prototypes), subhead, soft "scroll to proof" cue (no hard CTA) | light | Hook + value prop in one screen; sets "senior, in control." → "claims aren't proof — watch." |
| 3 | **Credential strip** — "7+ yrs shipping to production" + employers | light, quiet | Instant authority anchor before the demos; deliberately quiet to contrast the loud beat next. → hinge to dark. |
| 4 | **Proof zone — live demos** (CLIP classifier + SegFormer/SAM2 segmentation), Geist Mono readouts (model, latency, confidence) | **dark** | Trust core and emotional apex; "the demo IS the proof." No CTA here. → back to light: "here's what you can buy." |
| 5 | **Services — priced ladder** ($199 → $497 → $897+ → $8,997), flagship anchored, prices shown, no per-card CTA | light | Funnel's "offers convert" step, placed right after the trust peak. Prices visible to qualify leads. → "what the engagement is like." |
| 6 | **How it works** — shared 3-step (discovery → build/evaluate → deploy & hand over) + de-riskers (your cloud, IaC, docs, no-risk guarantee) | light, quiet | Removes purchase risk for the B2B buyer. → to the human. |
| 7 | **About — seasoning** — engineer-first; physics + ex-documentary/TV as texture; remote Freiberufler | light, quiet | Humanizes late so it never dilutes the engineering lead (per `CONTEXT.md`). → to the close. |
| 8 | **Final CTA / close** — *the* single emphatic ask: free discovery call + no-risk guarantee | light, **warm accent zone** | The earned conversion moment; everything above set it up. |
| 9 | **Footer** — contact, LinkedIn, legal, remote/timezone | light | Secondary conversion + trust details. |

### High-weight scroll moments

Exactly two motion set-pieces, mapped 1:1 to the locked style's signature moments:

1. **Hero staged reveal** (§2) — calm-confident entrance.
2. **Light → dark proof-zone hinge into the live demos** (§4) — the *claim → proof*
   pivot. **This is the emotional apex.**

The **close** (§8) is a *third emotional beat* but carries its weight through
**composition and accent colour, not scroll motion** — no third motion set-piece
(the style supports only two). Everything else (credential strip, ladder,
process, about, footer) stays quiet by contrast.

### Where conversion lands

Single, delayed, emphatic: **book a free discovery call** at **§8**, set up by
proof (§4) → priced offers (§5) → de-risk (§6) → human (§7). No repeated loud
CTAs; the nav's de-emphasized link is the only mid-scroll safety valve for an
already-convinced visitor.

### Swappable-for-niching blocks

Keep these **content-only** so a future niche re-skin (candidate niches: creator
economy, performance marketing — see `CONTEXT.md`) never touches structure or
sequence: hero headline/subhead (§2), credential framing (§3), offer-card copy
(§5), about angle (§7). The `--accent`-driven CTA, section order, and the
light → dark → light rhythm are fixed regardless of niche.

> **Content note:** pull all words/numbers from `CONTENT.md`. The employer list
> in §3 is a swappable block and **Santander is gated** — confirm before it ships
> publicly (see Cautions).

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
- **Swappable-for-niching blocks (content-only, never structural):** hero
  headline/subhead (§2), credential framing (§3), offer-card copy (§5), about
  angle (§7). **Fixed regardless of niche:** the `--accent`-driven CTA, the locked
  section order, and the light → dark → light rhythm.

### Core differentiator (thread everywhere)

**Production-grade engineering — real trained ML and deployed systems, not
prototypes or no-code patchwork.** It is the site's whole reason to be believed.
Geist Mono is its typographic tell: evidence (model names, readouts, real output)
*is* the ornament. Do not dilute it — every section should reinforce "this person
ships production ML," not "this person knows about AI."

### Copy & tone rules

- **Voice:** outcome-first, plain English, confident and direct, no hype.
- **Source of truth:** pull every word/number from `CONTENT.md`; niche variants
  from `docs/variants/`. Never invent or alter offers, prices, tiers, or credentials.
- **No em-dashes in authored copy.** `CONTENT.md` currently contains em-dashes;
  preserve that text verbatim where it renders as copy, and let heading
  label/subtitle dashes resolve into layout (two typographic elements) rather than
  editing them. Never add a new em-dash.
- **One conversion.** Every offer's CTA is the free discovery call; the single
  emphatic ask lands once at §8. Booking is wired to a single `#book` placeholder
  anchor, swappable in one place when a real scheduler URL exists.

### Funnel role per section

Funnel logic: **live-demo proof builds trust → priced offers convert → one free
discovery call closes.** Proof precedes pitch. The per-section roles, registers,
and placement rationale are specified in **Structure & Narrative Flow** above
(the locked section table) — that table is the authority; do not duplicate or
drift from it here.

## Tech & deployment

- **Stack:** a React app built with **Next.js (App Router)**, **Tailwind CSS**, and
  **shadcn/ui**; Geist self-hosted via `next/font`. Prefer server components and
  static rendering; add client interactivity only where a section needs it, and
  pull in only the shadcn components actually used. (Not yet scaffolded — see
  Current status.)
- **Deploy:** **Vercel**, Git-connected — preview deploy per push, production on
  `main`. Only the build output is served, so planning docs are not published as a
  side effect of deploying.
- New frontend work should follow production-quality standards: semantic HTML,
  design tokens over hardcoded values, compositor-friendly motion, accessibility,
  and the landing-page performance budget (JS < 150kb, CSS < 30kb gzipped).

## Cautions / open questions

- **Retire the old GitHub Pages workflow.** `.github/workflows/static.yml` still
  uploads the **entire repository** (`path: '.'`) to GitHub Pages, which would serve
  `docs/` (pricing, strategy) and `_legacy/` publicly. It is superseded by the
  Vercel deploy — disable or delete it before launch so the two don't both publish.
  Vercel serves only the build output; use `.gitignore` / deploy-ignore for anything
  that must never ship.
- **Employer list is not settled.** `CONTEXT.md` says to *confirm Santander before
  it ships publicly*, while `CONTENT.md` lists it. Do not treat the credentials
  list as final; confirm before anything goes public.
