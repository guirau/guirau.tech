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

| Token | Size | Weight | Colour |
|---|---|---|---|
| `--text-headline` | `clamp(2.5rem, 1.2rem + 5.6vw, 4rem)` 40→64px | 600 | gradient (§3) |
| `--text-tagline` | `clamp(1.375rem, 1.2rem + 0.9vw, 1.75rem)` 22→28px | 600 | `--text-secondary` |
| `--text-body` | `1.0625rem` 17px | 400 | `--text-primary` |
| `--text-link` | `1.0625rem` 17px | 400 | `--accent-text` |
| `--text-caption` | `0.8125rem` 13px | 400 | `--text-secondary` |
| `--text-mono` | `0.8125rem` 13px | 500 | `--text-secondary` |

17px is the body floor, held from the HIG. **[measured]**

The caption is 13px rather than Apple's measured 12px. **[derived]** — that
row is the footer legal string, which a business-verification reviewer has to
read; one step of extra legibility is worth more than exact parity, and at
`--text-secondary` it still measures 5.80:1 and still reads as quiet.

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
│  Alejandro Guirau                    ← tagline, 600  │
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

Unchanged from the build spec — Apple's product-page motion is scroll-driven
and v2 has no scroll, so there is nothing to port.

Two moments, both already specified: the staged text reveal and the one-shot
dolly-out. `cubic-bezier(0.16, 1, 0.3, 1)`, 3.7s.

Everything else is a 150ms hover or focus transition. Compositor-friendly
properties only — `transform`, `opacity`, `clip-path`. Full
`prefers-reduced-motion` fallback: the dolly resolves instantly to its end
framing, text appears at full opacity, the robot holds a static pose.

No easing value here is claimed as measured from Apple. We did not measure their
easing curves.

---

## 7. Launch gates

Verifiable, not aspirational. Each must be checked before v2 ships.

- [ ] Every pairing in §1.3 re-verified against the shipped CSS
- [ ] `color: var(--accent)` appears nowhere in the codebase
- [ ] Gradient headline renders as solid `--text-primary` with
      `background-clip` disabled, and in `forced-colors: active`
- [ ] Gradient headline never renders below 40px at any breakpoint
- [ ] No `box-shadow` anywhere
- [ ] No font-weight 700 anywhere
- [ ] Footer legal string is real text, legible without scrolling, at every
      breakpoint from 320px up
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
