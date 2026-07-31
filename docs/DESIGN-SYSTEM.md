# Design system — `latest/v2`

Derived from Apple's MacBook Pro product page (`apple.com/vn/macbook-pro/`),
measured live at 1440×900 from computed styles. Authoritative for `latest/v2`.

Every value below is tagged:

- **[measured]** — read off Apple's live page. Trustworthy as a fact about Apple.
- **[derived]** — our decision, reasoned from a measurement.
- **[tune]** — a starting value that must be adjusted by eye against rendered
  output before it is final.

The distinction matters. Apple's page is tuned to SF Pro and to product
photography we do not have. Copying its numbers blindly reproduces its
constraints, not its quality.

---

## 0. The five findings that actually matter

Everything else in this document follows from these. If you remember nothing
else, remember these.

1. **Two background values, total.** `#000000` and `#1D1D1F`. Not a ramp, not a
   scale. **[measured]**
2. **Depth comes from surface delta, not shadows.** The dominant card is `#000`
   sitting on `#1D1D1F` with `box-shadow: none`. Elevation is signalled by a
   29-unit luminance step and a radius, nothing else. **[measured]**
3. **Display type is weight 600; buttons are weight 400.** Never 700, anywhere.
   The counterintuitive half is the button: the loudest element on the page uses
   the lightest weight and earns its emphasis from the blue fill. **[measured]**
4. **Rhythm is asymmetric.** Section padding measured 144px top / 216px bottom.
   Nothing is uniformly padded. **[measured]**
5. **One colour moment.** A gradient-clipped headline is the only chromatic
   event in an otherwise monochrome page. **[measured]**

### What this supersedes

`CLAUDE.md` previously locked a light-primary design system for a nine-section
scroll funnel. `latest/v2` is one screen with no scroll, so three of those
clauses no longer apply and are replaced here:

| Superseded clause | Replacement |
|---|---|
| Light-primary surfaces; dark reserved for "proof zones" | Full dark. There are no zones, because there is one screen. |
| "Soft layered shadows in light; luminous elevation in dark" | No shadows. Surface-delta depth (finding 2). |
| Display tracking `-0.022em` | Near-neutral at display, per §2.3. |

The old rule that dark must never be driven by `prefers-color-scheme` still
holds and is still obeyed: v2 is dark because it is art-directed dark, not
because the OS asked.

---

## 1. Surfaces and colour

### 1.1 Tokens

```css
:root {
  /* surfaces — two values, deliberately */
  --surface-0: #000000;   /* page, robot stage                    [measured] */
  --surface-1: #1D1D1F;   /* raised: dialogs, the floating card   [measured] */

  /* text — two values, deliberately */
  --text-primary:   #F5F5F7;   /* 19.3:1 on surface-0             [measured] */
  --text-secondary: #86868B;   /*  5.8:1 on surface-0             [measured] */

  /* accent */
  --accent:        #0071E3;   /* CTA fill only                    [measured] */
  --accent-hover:  #0077ED;   /*                                     [tune] */
  --accent-text:   #2997FF;   /* text links on black              [derived] */
  --on-accent:     #FFFFFF;   /* 4.70:1 on --accent               [measured] */

  /* hairline — dialog and card edges */
  --hairline: rgba(255, 255, 255, 0.10);                       /* [derived] */
}
```

### 1.2 Two text values, not three

The old system had `--text-primary` / `--text-secondary` / `--text-tertiary`,
where tertiary sat at roughly 3:1 and was restricted to non-essential meta.

Apple's dark page has no tertiary tier. `#86868B` is the dimmest grey it uses,
and it measures **5.80:1 on black** — comfortably above the 4.5:1 normal-text
threshold. De-emphasis is achieved with *size and position*, not by pushing
contrast toward the floor.

Adopt this. It removes a tier, and it removes the class of accessibility bug
where "meta only" text quietly becomes load-bearing. Notably, it means the
verification-critical footer string can be visually quiet **and** fully legible
at the same time, which the old tertiary tier could not deliver.

### 1.3 Verified contrast

Computed against WCAG 2.x relative luminance. These are gates, not aspirations.

| Pairing | Ratio | Verdict |
|---|---|---|
| `--text-primary` on `--surface-0` | 19.28:1 | pass, large margin |
| `--text-secondary` on `--surface-0` | 5.80:1 | pass AA normal text |
| `--on-accent` on `--accent` | 4.70:1 | pass AA normal text, tight |
| `--accent-text` on `--surface-0` | 6.97:1 | pass AA normal text |
| `--accent` **as text** on `--surface-0` | **4.47:1** | **fails AA normal text** |

That last row is the trap and the reason `--accent-text` exists as a separate
token. `#0071E3` is a *fill* colour. It works with white on top of it; it does
not work as coloured text on black. Never set `color: var(--accent)`.

The `--on-accent` pairing at 4.70:1 passes but has almost no headroom, which
means the button fill is not free to drift darker during hover. `--accent-hover`
goes **lighter**, not darker — the opposite of the usual instinct.

### 1.4 The accent is reserved for action

Carried over from the HIG and confirmed by the marketing page: blue appears on
interactive elements only. On v2 that is exactly two places — the Contact pill,
and text links. Nothing decorative is blue.

**The `--accent` ban is a property ban, not a token ban.** WCAG sets two
thresholds, and `#0071E3` on black lands between them at 4.47:1:

| Property | Threshold | `--accent` on `--surface-0` | Verdict |
|---|---|---|---|
| `color` (text) | 4.5:1 — SC 1.4.3 | 4.47:1 | **forbidden** |
| `background-color` (fill) | n/a — judged by `--on-accent` | — | permitted |
| `outline-color`, `border-color` | 3:1 — SC 1.4.11 | 4.47:1 | **permitted** |

So `outline: 2px solid var(--accent)` is legitimate, and is in fact the focus
ring §6 specifies. Only `color: var(--accent)` is out; `--accent-text`
(`#2997FF`, 6.97:1) is the text colour. The §7 gate greps the *declaration*
`color: var(--accent)`, not the bare token, for exactly this reason.

---

## 2. Typography

Geist Sans and Geist Mono, self-hosted variable, unchanged from the previous
system.

### 2.1 Why not SF Pro

Apple self-hosts SF Pro because Apple owns it. Our two options are the
`-apple-system` stack, which renders SF only on Apple devices and falls back to
Helvetica or Arial everywhere else, or a webfont we can actually serve.

The system stack is disqualified on rendering consistency alone: the whole
typographic argument below is about tracking and weight, and neither survives a
fallback to a different family with different metrics. Roughly a third of
visitors would see a design tuned for a font they are not being shown.

Geist stays. It is already self-hosted, variable, subset, and SF-adjacent.

### 2.2 Weight

**600 for all display type. 400 for buttons and body. Never 700.** **[measured]**

Apple's 64px headline, 48px section header, 28px eyebrow and 28px tagline are
*all* weight 600. The hierarchy between them is carried entirely by size. This
is the single cheapest way to read as premium: resisting the urge to reach for
bold at the top of the scale.

The button at weight 400 is the tell that the system trusts colour to do the
emphasis work.

### 2.3 Tracking — transfer the principle, not the numbers

Measured on Apple, converted to em:

| Size | Tracking |
|---|---|
| 64px | −0.009em |
| 48px | −0.003em |
| 28px | **+0.007em** |
| 17px | −0.022em |
| 14px | −0.016em |
| 12px | −0.010em |

Two things stand out. Display tracking is essentially neutral, and body
tracking is *more* negative than display tracking — the inverse of the usual
web convention, and the inverse of what the old `CLAUDE.md` scale specified.

**Do not copy these numbers into Geist.** They are a product of SF Pro shipping
optical sizes: SF Display already tightens its own letterforms at large sizes,
so Apple needs almost no manual correction there, while SF Text is drawn loose
and gets pulled in. Geist has no optical sizing, so the corrections it needs are
different in both magnitude and direction.

What transfers is the principle: **tracking is a per-size optical correction,
set by eye against rendered text.** Starting points, all **[tune]**:

| Role | Tracking |
|---|---|
| Headline 40–64px | `-0.02em` |
| Tagline 22–28px | `-0.01em` |
| Body / links 17px | `0` |
| Caption 13px | `0` |

Tune these against real rendered copy before shipping and record the final
values here.

### 2.4 Scale

v2 is one screen, so it needs six roles, not a full ramp.

| Token | Size | Weight | Line height | Colour |
|---|---|---|---|---|
| `--text-eyebrow` | `clamp(1.375rem, 1.2rem + 0.9vw, 1.75rem)` 22→28px | 600 | `1.19` | `--text-secondary` |
| `--text-headline` | `clamp(2.5rem, 1.2rem + 5.6vw, 4rem)` 40→64px | 600 | `1.08` | gradient (§3) |
| `--text-body` | `1.0625rem` 17px | 400 | `1.47` | `--text-primary` |
| `--text-link` | `1.0625rem` 17px | 400 | `1.47` | `--accent-text` |
| `--text-caption` | `0.8125rem` 13px | 400 | `1.43` | `--text-secondary` |
| `--text-mono` | `0.8125rem` 13px | 400 | `1.43` | `--text-secondary` |

17px is the body floor, held from the HIG. **[measured]**

**Line height, unlike tracking, ports directly.** **[measured]** §2.3 refuses to
copy Apple's tracking because those numbers are an artifact of SF Pro's optical
sizing. Leading carries no such baggage — it is a ratio applied to the em box,
and the em box is the same shape in Geist. So these come across close to face
value rather than as starting points to tune.

Apple's observed curve: display 1.07–1.19, body 1.47, caption 1.43. The shape of
it is the point — **leading tightens as size grows.** Their 56px hero runs 1.07
and their 21px tagline runs 1.19, so our 40→64px headline takes `1.08` and our
22→28px eyebrow takes `1.19`. Body and caption are lifted unchanged.

One Apple value is deliberately not taken: their footer link columns run an
unusually relaxed `2.41`. That exists to make dense multi-column link stacks
scannable. v2's footer is a single legal line, so the caption ratio applies.

**`--text-mono` drops from 500 to 400.** **[derived]** Apple's weight ladder is
300 / 400 / 600 / 700 with **500 deliberately absent** — mid-weight readings
always resolve to 600. Since §2.2 already commits to that ladder, keeping mono
at 500 would be the one token contradicting the rule that makes the rest of the
system read as premium. Geist Mono at 400 is optically heavier than Geist Sans
at 400 anyway (monospace faces widen to fill the advance), so 400 already reads
with the emphasis 500 was reaching for.

The caption is 13px rather than Apple's measured 12px. **[derived]** — that
row is the footer legal string, which a business-verification reviewer has to
read; one step of extra legibility is worth more than exact parity, and at
`--text-secondary` it still measures 5.80:1 and still reads as quiet.

### 2.5 Which text gets which role

**The name is the eyebrow. The positioning line is the headline.** **[derived,
deliberate]**

| Slot | Copy | Treatment |
|---|---|---|
| eyebrow | `Alejandro Guirau` | 22→28px, 600, `--text-secondary` |
| headline | `Freelance AI engineer. Production systems, not prototypes.` | 40→64px, 600, gradient |

This is worth stating explicitly because it looks inverted at a glance: the name
is the small grey text and the pitch is the giant gradient one.

It matches Apple. Their marquee runs **eyebrow 28px → headline 64px → tagline
28px**, and the eyebrow is the *product name* ("MacBook Pro") while the headline
is the *claim*. The name identifies; the headline sells. Since the one colour
moment lands on the headline, the gradient is spent on the claim, which is the
correct place for a conversion page — a visitor who does not yet know the name
has no reason to care about it, and a visitor who does will still find it.

If a future niche re-skin swaps the copy, keep the roles: name in the eyebrow,
claim in the headline. Do not promote the name to display size.

**Measure cap.** The headline is a two-to-three line block, not a banner. At
64px in a `minmax(0, 1fr)` column beside the card it has roughly 50–60% of the
viewport, so cap it explicitly rather than letting ultrawide flatten it to one
long line:

```css
.marquee__headline { max-width: 20ch; text-wrap: balance; }
```

**[tune]** — the current headline is **58 characters**, so a 20ch cap wraps it
to 3 lines at every width from 1440px down. Re-check whenever the copy changes.

**The clamp saturates at ~800px, and it is blind to height.** `1.2rem + 5.6vw`
reaches the 4rem ceiling at a 797px viewport, so from ~800px up the headline is
a *fixed* 64px and only the `1fr` robot row absorbs any change in window size.
On a short laptop viewport the arithmetic gets tight — 1024×640, three lines:

| Band | Height |
|---|---|
| headline, 3 × 64px × 1.08 | 207px |
| eyebrow, 28px × 1.19 | 33px |
| links row + card | ~25px |
| footer legal, 13px × 1.43 | 19px |
| gaps and page gutters (§5.2) | ~160px |
| **consumed** | **~444px of 640px** |

That leaves ~196px for the `1fr` void, against a spec that wants the robot in
the upper ~60% (384px). **The robot's lower third would collide with the
eyebrow.**

**Resolved in Task 14**, against real renders at both candidate viewports
(1024×640 and 1280×720). Measured headroom before any fix: **182px** at
1024×640, **262px** at 1280×720, both short of the 384px floor. Neither
single-lever candidate closes the gap alone. Widening the cap to 28ch does
nothing at 1024px width, because the grid column binds before the cap does,
and only helps once the viewport is wide enough for the cap to bite (it
recovers headroom at 1280px but not at 1024px). A `clamp()` reading `dvh`
saturates at its 4rem ceiling on both viewports and barely moves the number
either. The `@media (max-height: 760px)` step-down alone reaches two lines
and clears 1280×720, but falls short at 1024×640 by ~39px (344.64px measured
against the 384px floor).

**The decision is the combination**: the step-down's fixed 2.5rem headline
(42.5px computed, above the 40px floor §3 requires) plus the wider 28ch cap,
plus trimming the same rhythm tokens the step-down already touches
(`--space-4`, card padding, eyebrow margin) to close the remaining gap. The
bound is `@media (max-height: 760px) and (min-width: 1000px)`, one pixel past
Case 3's `max-width: 999px` (§2.6), not the 900px a first pass reached for,
because at 900px this query started matching short landscape phones (e.g.
926×428) that Case 3 already owns, and being later in source order it
silently overrode Case 3's own compression. `--safe-bottom` is left out of
the trim for the same reason: Playwright's default "Desktop Chrome" viewport
is 1280×720, one of the two viewports this fix targets, and the existing
safe-area-inset test reads that default expecting the un-compressed
`clamp()` value. The result, now in `assets/styles.css`: **392.64px**
headroom at 1024×640, **472.64px** at 1280×720, both clearing 384px.

**Known gap, left unresolved by this decision:** viewports 900-999px wide
by 500-760px tall (e.g. 960×600) match neither this query nor Case 3
(`max-width: 999px` and `max-height: 499px`) and fall back to the base
layout at full clamp scale, measured at 142.8px headroom, below the 384px
floor. The footer stays visible there, so it is a headroom gap rather than
an overflow bug. Neither of Task 14's two target viewports lands in that
band, so it is recorded here rather than folded into a bound the render
work didn't cover.

---

## 3. The gradient headline

The one colour moment. **[measured]** exactly:

```css
background-image: linear-gradient(
  90deg,
  #E4F6F0 0%,
  #9DCFCA 31%,
  #6B95AC 68%,
  #45657D 100%
);
background-clip: text;
-webkit-text-fill-color: transparent;
```

The darkest stop, `#45657D`, measures **3.41:1 on black**. That passes AA for
large text (3:1) and the headline is 40px+ at weight 600, so it qualifies — but
there is no margin. **The gradient may not be reused at any size below 40px,**
and if the headline ever shrinks below that on a narrow breakpoint, it must fall
back to a flat `--text-primary`.

### 3.1 Mandatory fallback

`-webkit-text-fill-color: transparent` makes the text **invisible** if the
gradient does not paint. That is a total-content-loss failure, not a cosmetic
one, and it is reachable through forced-colors mode.

Always set a real colour first and apply the clip only where it is supported:

```css
.headline {
  color: var(--text-primary);   /* the fallback, always present */
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .headline {
    background-image: linear-gradient(90deg, #E4F6F0, #9DCFCA 31%, #6B95AC 68%, #45657D);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

@media (forced-colors: active) {
  .headline {
    -webkit-text-fill-color: revert;
    background-image: none;
  }
}
```

This is a launch gate, verified in §7.

---

## 4. Shape, depth, and space

### 4.1 Radius

| Token | Value | Applied to |
|---|---|---|
| `--radius-card` | `28px` | floating card, dialogs **[measured]** |
| `--radius-pill` | `980px` | CTA button **[measured]** |
| `--radius-control` | `12px` | form inputs **[derived]** |

28px was the dominant radius on Apple's page by a wide margin (77 uses). It is
large enough to read as a distinct object class rather than a softened
rectangle, which is what makes the shadowless approach work.

### 4.2 Depth without shadows

```css
.card {
  background: var(--surface-1);
  border-radius: var(--radius-card);
  border: 1px solid var(--hairline);
  box-shadow: none;
}
```

Elevation = a surface-value step plus a radius. Nothing casts a shadow anywhere
on this page. The hairline is **[derived]**, not measured; it exists because our
card sits on `#000` while Apple's sat on `#1D1D1F`, so ours needs a defined edge
that Apple's got for free from the surface delta.

Note the inversion this implies: Apple raises a **darker** card onto a lighter
section. We raise a **lighter** card onto a black page. The mechanism is the
delta, not the direction.

### 4.3 Space

8pt grid, 4px for fine adjustment. Carried forward unchanged.

```css
--space-1:  4px;   --space-5: 32px;
--space-2:  8px;   --space-6: 48px;
--space-3: 16px;   --space-7: 64px;
--space-4: 24px;   --space-8: 96px;

--gutter: clamp(24px, 5vw, 80px);
--safe-bottom: clamp(24px, 3vh, 48px);
```

Apple's 144/216 asymmetric section padding is a scroll-page device and does not
port to a single screen. What ports is the *principle* — never pad a thing
equally on all sides just because it is easier. On v2 it surfaces as the marquee
hugging the bottom-left with a large void above it, in §5.

44×44px minimum on every interactive target, unchanged. **[measured]** — the
CTA measured exactly 44px tall via `11px 21px` padding on 17px text.

---

## 5. Composition — the asymmetric marquee

The largest single lever on whether this reads as Apple or as a generic hero.
Apple's marquee is **not centred**: product upper, type bottom-left, floating
action card bottom-right.

### 5.1 Desktop (≥900px)

```text
┌─ 100dvh ─────────────────────────────────────────────┐
│                                                      │
│                  ╭──────────╮                        │  robot occupies
│                  │  ROBOT   │   full-bleed canvas    │  the upper ~60%,
│                  │          │   behind everything    │  biased right
│                  ╰──────────╯                        │
│                                                      │
│  Alejandro Guirau                    ← eyebrow, 600  │
│  Freelance AI engineer.              ← headline,     │
│  Production systems, not prototypes.   gradient, 600 │
│                              ╭─────────────────────╮ │
│  LinkedIn   GitHub           │ Services  ( Contact )│ │
│                              ╰─────────────────────╯ │
│  Alejandro Guirau - Software Consulting              │
└──────────────────────────────────────────────────────┘
```

```css
.stage {                       /* the robot canvas */
  position: fixed;
  inset: 0;
  z-index: 0;
}

.marquee {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: 1fr auto auto;      /* void | marquee | footer */
  grid-template-columns: minmax(0, 1fr) auto;
  padding: var(--gutter);
  padding-bottom: var(--safe-bottom);
}

.marquee__text   { grid-area: 2 / 1; align-self: end; }
.marquee__card   { grid-area: 2 / 2; align-self: end; }
.marquee__footer { grid-area: 3 / 1 / 4 / 3; }

/* The legal string must render as literal characters. Disable inherited
   font features so no ligature or contextual alternate can substitute the
   hyphen a verification reviewer is matching against. */
.marquee__footer {
  font-variant-ligatures: none;
  font-feature-settings: normal;
}
```

The canvas becomes a fixed full-bleed backdrop rather than a flex child. This
supersedes the `flex: 1` canvas in §2 of the build spec, and it changes the
dolly framing rule — see §5.3.

### 5.2 Why the links split

The previous flat row (`LinkedIn · GitHub · Services · Contact`) gave four
destinations equal weight. Splitting them across the marquee separates two
different jobs:

- **bottom-left, `--text-secondary`, quiet** — LinkedIn and GitHub. Credentials.
  A visitor who wants to verify you goes looking for these; they do not need to
  be loud.
- **bottom-right, in the raised card** — Services as a text link, Contact as the
  blue pill. This is precisely Apple's "From $1,599" + "Buy" pairing: context
  beside the single committed action.

Conversion gets one unambiguous target. The old row had four peers and no
answer to "what do you want me to do".

### 5.3 Off-axis framing (supersedes the centred dolly)

An off-centre robot must not be produced by rotating the camera — that skews the
perspective and the helmet reads as tilted. Shift the camera **and** its lookAt
target by the same vector. That is a pure lateral translation: the framing moves,
the projection does not change.

Express the shift as a fraction of the visible extent at the subject plane, so
it holds across aspect ratios:

```js
const visibleH = 2 * Math.tan((fov * Math.PI / 180) / 2) * distance;
const visibleW = visibleH * (canvasW / canvasH);

const bias = {
  x: -kx * visibleW,   // negative camera.x pushes the robot right in frame
  y: -ky * visibleH,   // negative camera.y pushes the robot up in frame
};
// applied identically to camera.position and to the lookAt target
```

| Breakpoint | `kx` | `ky` | Effect |
|---|---|---|---|
| ≥900px | `0.12` | `0.10` | robot right-of-centre, upper ~60% |
| <900px | `0` | `0.06` | centred, lifted clear of the stacked text |

Both **[tune]** — check against the real mesh, since the model's own bounding
box is not symmetric about its origin once the arms are posed.

Because the canvas is now full-viewport, the end-framing rule in build spec §6.1
can no longer key off a flex-derived canvas height. It keys off viewport height
directly, and the threshold moves to account for the text block now overlaying
rather than displacing the robot.

### 5.4 Mobile (<900px)

Single column, everything centred, the split from §5.2 collapsed back into one
row of links with Contact still carrying the pill treatment. `kx` drops to 0.
The card loses its float and becomes a full-width block above the footer.

---

## 6. Motion

Apple's product-page motion is scroll-driven and v2 has no scroll, so there is
nothing to port. Two moments only: the **intro sequence** and the marquee
reveal that follows it.

**Timings are not restated here.** The build spec §6.1 owns the phase table,
the easing per phase, and the reduced-motion end state; this file owns how
things are *drawn*, not when they move (`CLAUDE.md`, documentation hierarchy).
An earlier version of this section described a single 3.7s
`cubic-bezier(0.16, 1, 0.3, 1)` dolly and a reduced-motion state with no face.
Both were superseded when the intro sequence was designed — the move is now
3.5s in four phases with the expo curve demoted to the settle, and
reduced-motion renders the *composited* end state with the face still faintly
visible. Cite §6.1, never this paragraph.

Everything else is a 150ms hover or focus transition. Compositor-friendly
properties only — `transform`, `opacity`, `clip-path`.

No easing value in the system is claimed as measured from Apple. We did not
measure their easing curves.

### 6.1 Interaction states

Three states, and they are the whole vocabulary. **[measured]**

```css
/* Press — the system-wide micro-interaction, on every button and link. */
.pill:active,
.link:active { transform: scale(0.95); }

/* Focus — see §1.4: --accent is legal as a ring at 4.47:1 (3:1 threshold). */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* Hover — see the deviation note below. */
.pill:hover { background-color: var(--accent-hover); }
.link:hover { opacity: 0.8; }
```

`scale(0.95)` is Apple's press state on *every* button in their system, and it
fits our constraints exactly: `transform` is compositor-only, so it costs
nothing per frame and needs no exception in the reduced-motion path (a 150ms
scale on deliberate press is feedback, not decoration).

`outline-offset: 3px` is **[derived]**, not measured — the ring needs to clear
the 980px pill radius or it reads as a second border.

**Deviation: we document hover; Apple does not.** Their system says *default and
active/pressed states only*, which is right for a page of hundreds of components
where hover states multiply into an unmaintainable matrix — and where half the
traffic is touch, which has no hover at all. v2 has four interactive elements.
The matrix is four rows, and a pill that does not respond to the pointer on a
page this sparse reads as broken rather than restrained. Recorded here so the
divergence is a decision rather than an oversight.

Note that hover cannot darken the pill: `--on-accent` sits at 4.70:1 with almost
no headroom, so `--accent-hover` goes lighter (§1.1).

---

## 7. Launch gates

Verifiable, not aspirational. Each must be checked before v2 ships.

- [ ] Every pairing in §1.3 re-verified against the shipped CSS
- [ ] The declaration `color: var(--accent)` appears nowhere in the codebase.
      Grep the property, not the token — `outline: 2px solid var(--accent)` is
      the specified focus ring and must survive this check (§1.4)
- [ ] Gradient headline renders as solid `--text-primary` with
      `background-clip` disabled, and in `forced-colors: active`
- [ ] Gradient headline never renders below 40px at any breakpoint
- [ ] No `box-shadow` anywhere
- [ ] No font-weight 700 anywhere, and no font-weight 500 (§2.4)
- [ ] Footer legal string is real text, legible without scrolling at every
      breakpoint from 320px up, and copies out of the rendered page
      byte-identical to the root `index.html` version with the plain
      hyphen-minus intact (§5.1 disables font features on the footer;
      confirm nothing re-enables them)
- [ ] Headline wraps to 2–3 lines at 1440px / 1024px / 768px and clears the
      robot's feet at the tallest wrap; `max-width` recorded in §2.5
- [ ] **Short-viewport fit**: at 1024×640 and 1280×720 the whole marquee sits
      inside `100dvh` with the footer visible and no overlap between the robot
      and the eyebrow. §2.5 computes ~444px consumed of 640px — verify against
      the real render, and record which lever was used (cap widened to ~28ch,
      `dvh`-aware clamp, or `max-height` step-down)
- [ ] Every interactive target ≥44×44px
- [ ] Keyboard path reaches all four links plus both dialogs; focus visible
      throughout; Esc closes dialogs; focus returns to trigger
- [ ] `prefers-reduced-motion` verified, including the dolly
- [ ] Final tracking values recorded in §2.3, replacing the **[tune]** markers

---

## 8. What we deliberately do not copy

Apple's page is 37,174px tall and sells a physical product with a photography
budget. Taking more than its grammar would be a mistake.

- **Scroll-driven everything.** v2 is one screen. Its entire motion vocabulary
  is the dolly.
- **Photography as the design.** Apple's surfaces are largely empty because the
  product imagery carries the page. v2's equivalent is the robot, and it has to
  carry the same load with far less pixel budget — which is why §5.3's framing
  matters more here than the equivalent choice does for Apple.
- **The 48px section-header tier.** No sections, no tier.
- **Liquid Glass / `backdrop-filter`.** The marketing page barely uses it, and a
  full-bleed WebGL canvas behind a blur layer is an expensive per-frame
  composite for no narrative gain.
- **Alpha-white text (`rgba(255,255,255,0.92)`).** Apple needs it because type
  sits over varying photography. Our type sits over flat black, so a solid
  token is both simpler and more predictable.

---

## 9. Reconciliation with `apple_design_system_web.md`

`docs/support/apple_design_system_web.md` is a third-party analysis of Apple's
marketing site (MIT, VoltAgent). It arrived *after* this file was measured, so
it functions as an independent second observation of the same source. That makes
it useful in a specific way: where it agrees, it is corroboration by a party who
could not have copied us; where it disagrees, the disagreement is diagnostic.

**Scope limit, stated once.** Its own Known Gaps section concedes that what it
documents is *"the daytime/light-dominant variant Apple ships by default"* and
that the dark variants were not surfaced. It therefore **cannot govern v2's dark
treatment**, and nothing in it should be read as authority over §1. Its light
palette, 18px card radius, 80px section padding, and tile-alternation rhythm are
all out of scope for a single dark screen.

### 9.1 Corroborated — arrived at independently, same answer

| Finding | Their observation | Ours |
|---|---|---|
| **The dark-surface blue split** | `#2997ff`, named for use *"where Action Blue would disappear"* on dark tiles | `--accent-text: #2997FF`, derived from contrast math alone (§1.1) |
| Display weight | ladder 300/400/600/700; *"mid-weight readings always use 600"* | 600 everywhere, never 700 (§2.2) |
| Body size | 17px, *"not 16px"* | 17px floor (§2.4) |
| No gradient tokens | zero in their palette | one gradient, scoped to the headline (§3) |
| Pill radius on primary CTA | pill | `--radius-pill: 980px` (§4.1) |
| Touch targets | 44×44 | 44×44 (§7) |
| Button padding | 11px × 22px | measured 11px × 21px |
| Elevation | *"exactly one drop-shadow in the entire system,"* reserved for product photography; UI elevation comes from surface-colour change | no `box-shadow` at all; depth from luminance delta (§4.2) |
| Single accent | *"non-negotiable"* | §1.4 |

The `#2997FF` row is the strongest validation in the file. Two observers, one
working from contrast arithmetic and one from a palette audit, split Apple's
blue into fill and dark-surface-text variants at the same hex.

Their "Note on Font Substitutes" also supports §2.1 and §2.3 without meaning to:
it concedes that non-Apple platforms need Inter (i.e. `-apple-system` does not
deliver SF off-Apple, which is exactly why we rejected the system stack), and it
prescribes a `-0.01em` tracking nudge *specific to Inter* — conceding that
Apple's tracking numbers are not portable across typefaces. We keep Geist; the
substitute recommendation is cited as support, not adopted.

### 9.2 Conflicts — recorded, and how each resolves

| Point | Them | Us | Resolution |
|---|---|---|---|
| Accent hex | `#0066CC` "Action Blue"; `#0071E3` demoted to "Focus Blue" | `--accent: #0071E3` | **Ours.** We measured `#0071E3` as the button fill on the actual target page (MacBook Pro). Theirs is a cross-page average over five surfaces. Different sampling, and ours is the page we are deriving from. |
| Mono weight | 500 absent from the ladder | was 500 | **Theirs.** Resolved in §2.4 — `--text-mono` is now 400. |
| Card radius | 18px, utility grid cards | 28px | **Both.** Different surfaces. Their 18px is a dense card in a 3–5 column grid; our 28px is a single floating marquee card, measured on Apple's own. |
| Stack breakpoint | 834px structural | 900px | **Ours, informed.** Their observed value is noted beside ours so the choice reads as considered. 900px is where our marquee's two columns stop fitting, which is a property of our composition, not theirs. |
| Hover states | *"Never document hover"* | documented | **Ours, as a stated deviation.** Reasoning in §6.1. |

### 9.3 One finding that changed our confidence, not our design

Their footer spec puts the legal row at 12px `{colors.ink-muted-48}` (`#7a7a7a`)
on `{colors.canvas-parchment}` (`#f5f5f7`). Computing that pairing:

```
L(#7a7a7a) = 0.1946      L(#f5f5f7) = 0.9143
ratio = (0.9143 + 0.05) / (0.1946 + 0.05) = 0.9643 / 0.2446 = 3.94:1
```

**Apple's own footer legal fine print fails WCAG AA for normal text** (3.94:1
against a 4.5:1 requirement). §2.4 already set our caption to 13px rather than
their 12px, tagged **[derived]**, on the reasoning that a business-verification
reviewer has to read that exact string. This computation retroactively justifies
that call: the thing we declined to copy is measurably the weakest point in the
system we were copying from. Our footer runs 13px at 5.80:1 and passes.
