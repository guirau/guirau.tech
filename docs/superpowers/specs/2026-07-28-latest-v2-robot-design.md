# Design: `latest/v2` — single-screen robot page

**Date:** 2026-07-28
**Status:** approved design, not yet implemented
**Scope:** a new page at `latest/v2/`, built root-ready so it can be promoted
to `guirau.tech/` later.

---

## 1. Purpose

A single full-screen page whose centrepiece is a photoreal humanoid robot
rendered in Three.js, animated with four behaviours. Below the robot: name,
positioning line, four links, and a legal-name footer. No navigation, no
scrolling content sections.

The page **opens on Alejandro's face**, then pulls back and closes the robot's
visor over it — the visitor sees the person before they see the machine, and
the machine is revealed to be worn rather than watched. The final state keeps
the face faintly visible through the visor. This is a **gated 3.5s sequence**:
the marquee reveals only once it completes. See §6.1.

The robot is a reconstruction of the visual language seen on
`getroamify.com/en/sign-in/` — a glossy near-black humanoid in the Figure 02 /
Optimus idiom. The model is **generated from an original written brief**, not
derived from their asset. See §5.

### Out of scope

Scroll sections, blog, live ML demos, a scheduler integration. The page has
exactly one conversion path: the Contact dialog.

---

## 2. Page structure

One screen. `100dvh`. No page scroll. **Asymmetric marquee** composition,
following Apple's product page — see `docs/DESIGN-SYSTEM.md` §5 for the full
rationale and CSS.

```text
┌─ 100dvh ─────────────────────────────────────────────┐
│                  ╭──────────╮                        │  canvas is a fixed
│                  │  ROBOT   │                        │  full-bleed backdrop;
│                  ╰──────────╯                        │  robot upper ~60%,
│                                                      │  biased right
│  Alejandro Guirau                    ← eyebrow, 600  │
│  Freelance AI engineer.              ← headline,     │
│  Production systems, not prototypes.   gradient, 600 │
│                              ╭─────────────────────╮ │
│  LinkedIn   GitHub           │ Services  ( Contact )│ │
│                              ╰─────────────────────╯ │
│  Alejandro Guirau - Software Consulting              │  footer, 13px, secondary
└──────────────────────────────────────────────────────┘
```

`100dvh` and not `100vh`: `vh` excludes the mobile address bar, which pushes
the links and footer below the visible area on phones.

The canvas is `position: fixed; inset: 0` and sits behind everything at
`z-index: 0`; the marquee is a `z-index: 1` grid overlaying it. The robot is
therefore never displaced by the text — it is framed *around* it by the camera
bias in §6.1. Below 900px the grid collapses to a single centred column.

The four links split by job rather than sitting in one flat row: LinkedIn and
GitHub are quiet credentials bottom-left; Services and Contact live in the
raised card bottom-right, with Contact as the only accent pill on the page.

**The marquee is gated behind the intro sequence** (§6.1) — it is
`visibility: hidden` until the 3.5s reveal completes, which also keeps it out
of the tab order rather than exposing focusable-but-invisible links. Gating is
a deliberate choice to protect the opening beat, and 3.5s is chosen to sit
under the **5-second threshold in WCAG 2.2.2 (Pause, Stop, Hide)**, above which
moving content would require a pause control. Two escapes exist regardless:
`prefers-reduced-motion` renders the settled state immediately (§7), and any
**keyboard interaction jumps to the settled state** so a Tab press never lands
on nothing. Mouse and touch have no skip — for them the gate is the design.

### 2.1 Positioning line

Default (**content-only, swappable in one place**):

> Freelance AI engineer. Production systems, not prototypes.

The longer credibility line from `CONTENT.md` ("7+ years shipping
cloud-native systems to production…") lives in the Services dialog instead.

### 2.2 Footer — verification-critical

Must render as the exact string, with a **hyphen-minus**:

```
Alejandro Guirau - Software Consulting
```

Do not substitute an en dash or em dash. Business verification is a string
match, and the root `index.html` uses the hyphen. Requirements:

- real text in a `<footer>` element; never an image, never `display: none`,
  never a visually-hidden utility class
- inside the `100dvh` block, legible **without scrolling** on every breakpoint
- de-emphasized (13px, `--text-secondary`) but never hidden. There is no
  tertiary tier in the v2 palette; `--text-secondary` measures 5.80:1 on black,
  so the footer is visually quiet *and* fully legible (see `DESIGN-SYSTEM.md` §1.2)

The legal name additionally appears in `<title>` and in a JSON-LD
`ProfessionalService` block (~200 bytes) carrying legal name, URL and email.

### 2.3 Links

| Link | Behaviour |
|---|---|
| LinkedIn | external, `target="_blank" rel="noopener noreferrer"` |
| GitHub | external, same |
| Services | native `<dialog>`, scrolls internally |
| Contact | native `<dialog>` |

Both popups use the native `<dialog>` element with `showModal()`. This
provides focus trapping, Esc-to-close, background `inert`, a stylable
`::backdrop`, and focus restoration to the trigger — correct by default, in
roughly ten lines, with no modal library. `<dialog>` defaults to
`display: none` and shrink-to-fit, so sizing must be set explicitly in CSS.

### 2.4 Services dialog

Four compact cards, sourced from `docs/CONTENT.md`. Per card: headline,
tagline, price and duration, and 3–5 bullets.

| Offer | Price / duration |
|---|---|
| AI Strategy Consultation | From $199 · 3 days |
| n8n Workflow Automation | From $497 · 5 days |
| Custom AI Agent | From $897 · 3 tiers |
| AI App — End-to-End Build | $8,997 · 5 weeks |

Every card CTA closes Services and opens **Contact**, preserving the funnel.

Credentials shown: HelloFresh, Hewlett Packard Enterprise, Telefónica, Enso,
Masterschool. **Santander Bank is withheld** pending confirmation
(`CLAUDE.md` caution). Adding it later is a one-line change.

Copy is taken verbatim from `CONTENT.md`; its em-dashes are preserved and no
new ones are introduced.

### 2.5 Contact dialog

Backend: **Web3Forms**, `POST https://api.web3forms.com/submit`, public
`access_key` in a hidden input, delivering to
**alejandro.guirau@gmail.com**.

Formspree is not used: its free tier offers no captcha (honeypot only) and
caps at 50 submissions/month. Web3Forms supports **hCaptcha on the free plan
with zero configuration** — no hCaptcha account required.

- Fields: name, email, message
- Anti-spam, three layers: hCaptcha (`<div class="h-captcha" data-captcha="true">`),
  a honeypot field, and Web3Forms' own filtering
- The email address is also shown as a plain `mailto:` link
- The hCaptcha script (~50 KB, third-party) is **lazy-loaded on first open of
  the Contact dialog**, so it costs nothing at initial page load

### 2.6 Responsive envelope

A page that is exactly one viewport tall has no scroll to absorb a bad
assumption. Three cases are specified rather than left to emerge.

**Safe-area insets.** The footer is verification-critical (§2.2) and must be
legible without scrolling *at every breakpoint*, which a notch or home
indicator can silently break. The canvas is decorative and should run
full-bleed underneath them; the marquee grid must not:

```css
.marquee {
  padding-inline: max(var(--gutter-inline), env(safe-area-inset-left),
                                            env(safe-area-inset-right));
  padding-block-end: max(var(--gutter-block-end), env(safe-area-inset-bottom));
}
```

`max()` and not addition — on a device with no inset `env()` resolves to `0`
and the design gutter still applies.

**Landscape phones break the width-only breakpoint.** §2 collapses the grid to
a single centred column below 900px. A 844×390 phone is below that threshold,
so it would stack a column into 390px of height and push the footer out. The
breakpoint must read **both axes**:

| Viewport | Layout |
|---|---|
| width ≥ 900px | two-column asymmetric marquee |
| width < 900px **and** height ≥ 500px | single centred column |
| width < 900px **and** height < 500px | two-column marquee, compressed |

Short-landscape keeps two columns precisely *because* it is short: horizontal
space is what it has, and vertical space is what it lacks. This is the same
class of failure as the short-viewport headline collision recorded in
`DESIGN-SYSTEM.md` §2.5, and the two must be resolved together against a real
render.

**The face poster is the LCP element.** It is the first meaningful paint and
it is an image, so it is preloaded and prioritised:

```html
<link rel="preload" as="image" href="assets/face-1024.jpg" fetchpriority="high"
      media="(prefers-reduced-motion: no-preference)">
<link rel="preload" as="image" href="assets/robot-poster.webp" fetchpriority="high"
      media="(prefers-reduced-motion: reduce)">
```

`media` on a preload is what keeps this honest: reduced-motion users never see
the face-fill frame (§7), so preloading it for them would fetch an image that
is never painted and delay the one that is. The branch is resolved by the
browser before any JavaScript runs.

Nothing else on the page is preloaded — not the GLB, not `app.js`. Both are
needed *after* first paint, and preloading them would compete with the element
LCP is actually measured against.

`.github/workflows/static.yml` uploads `path: '.'` with **no build step** —
whatever is committed is served verbatim. `latest/v2` must therefore need no
build at deploy time.

Three.js ships as ES modules. Rather than an import map pointing at a CDN
(which would add a runtime third-party dependency), the bundle is built
**locally with esbuild and committed**.

```text
latest/v2/
├── index.html
├── assets/
│   ├── styles.css
│   ├── app.js              # committed esbuild output — see staleness rule
│   ├── robot.glb
│   ├── face-512.jpg        # matted portrait, square — see §4.5
│   ├── face-1024.jpg
│   ├── face-1536.jpg
│   └── robot-poster.webp   # composited final state — see §7
├── src/
│   ├── main.js
│   ├── build.mjs
│   ├── tools/split-rig.py
│   └── robot/…
└── package.json
```

All asset paths in `index.html` are **relative** (`assets/app.js`, not
`/latest/v2/assets/app.js`) so the folder can be promoted to the repo root by
copying it up, with no edits.

### 3.1 Committed-artifact staleness rule

`assets/app.js` is a build output under version control — a deliberate
consequence of a build-free host. The failure mode is a bundle that no longer
matches `src/`, which only surfaces as the deployed page behaving differently
from the source.

Mitigations, all required:

- a header comment in `app.js` marking it generated and naming the build command
- `npm run build` in `package.json` as the single build entry point
- `npm run build` must be re-run and its output staged **in the same commit**
  as any `src/` change

### 3.2 Root-readiness

Built to be promotable: relative paths, canonical URL, favicon, JSON-LD
schema. The Meta domain-verification tag (`9cpdahk10rj5hgf8tzbfx2m7qffuxb`)
is included from the start. Carrying it on a subpath is harmless —
verification only reads the domain root.

### 3.3 Weight targets

| Asset | gzipped target |
|---|---|
| `app.js` (tree-shaken Three + GLTFLoader + our code) | ~150 KB |
| `robot.glb` (geometry only, Meshopt) | < 800 KB |
| `styles.css` | < 5 KB |

The GLB carries **no baked colour textures** — materials are authored in
Three.js — which is what keeps it under 1 MB.

---

## 4. Asset pipeline

```
written brief -> Higgsfield image gen -> 4 reference views
                                              |
                              multi_image_to_3d -> GLB (one fused mesh)
                                              |
                      Blender headless (src/tools/split-rig.py)
                      split into rigid parts, set pivots, parent, re-export
                                              |
                        gltf-transform: Meshopt compress
                                              |
                                    Three.js: author materials
```

Blender is required because the robot is **hard-surface mechanical**. Joints
must pivot rigidly. A skinned/auto-rigged mesh stretches the surface at the
elbow like skin, which reads as a bug on a glossy hard shell. The requirement
is *separate rigid parts in a parent-child tree*, not a skeleton.

**Higgsfield's rigging is not a substitute.** The captured specs
(`docs/higgsfield-model-specs.json`) show `enable_rigging` paired with
`enable_animation` + `animation_action_id` — a library of pre-made animation
actions selected by ID. Canned actions can only replay against a **standard
skinned humanoid skeleton**, which is precisely the soft-deformation rig this
design rejects. `3d_rigging` takes a `model_url` and rigs an existing model,
so it is the same mechanism applied after the fact.

> This is a strong inference from the parameter shape, not a documented
> guarantee. If a trial generation with `enable_rigging=true` turns out to
> emit separated rigid parts, the Blender step shrinks. Plan for Blender.

**No texture-stripping step is needed.** `should_texture` defaults to
`false`, so the generated GLB is geometry-only by default — we simply never
ask for textures. gltf-transform is used for Meshopt compression alone.

### 4.1 Node hierarchy (contract between Blender and Three.js)

```
Root
└── Torso
    ├── Neck ── Head
    ├── Shoulder_L ── Forearm_L ── Hand_L
    └── Shoulder_R ── Forearm_R ── Hand_R
```

Model normalized to **1.8 units tall, origin at the feet, facing +Z**.
`rig.js` binds these names and **throws on a missing node** — a misfired
split must fail loudly at load, not present as a silently frozen head.

### 4.2 Split heuristics (starting values, tune against the real mesh)

| Part | Rule |
|---|---|
| Head | vertices above Y = 1.55 |
| Arms | \|X\| beyond torso half-width measured at chest height |
| Elbow | midpoint between shoulder and wrist along the arm axis |
| Wrist | 88% of the way from shoulder to arm tip |

Pivots are placed at the joint centre, not the part's bounding-box centre.

### 4.3 Generation brief (image stage)

Four views: **front, side, three-quarter, back**. Shared prompt:

> Full-body humanoid robot, photoreal product render. Egg-shaped helmet with a
> **dark smoked visor** covering the face area — a deep near-black tinted
> panel, like a motorcycle helmet visor, **no face, no eyes, no screen**. The
> helmet shell around the visor is a glossy near-black hard surface. Segmented
> mechanical neck collar. Carbon fibre weave torso tapering to a narrow waist.
> Articulated shoulders and elbows. Simplified hands. Near-black glossy shell.
> Standing in a **wide A-pose, arms held clearly away from the body with
> visible gaps at the armpits, elbows straight**. Pure white seamless
> background, soft even studio lighting, no dramatic highlights. Neutral
> industrial design.

Three constraints are load-bearing:

- **Wide A-pose, clear armpit gaps, straight elbows.** Arms touching the body
  get fused into the torso by the generator, which breaks the scripted split.
  A bend baked into the elbow can never be straightened, and the idle sway
  rotates from rest.
- **Blank visor, no eyes.** The dot-matrix eye panels are authored in
  Three.js as planes with an emissive shader. This makes the blink sharp,
  resolution-independent, and — critically — **independent of generation
  quality**. It works identically on attempt 1 and attempt 6.
- **A smoked visor, not chrome.** An earlier version of this brief specified a
  *chrome mirror-finish faceplate*. That is incompatible with the intro
  sequence (§6.1), which needs the face visible behind the visor: a mirror
  finish is defined by not transmitting light, so no material tuning
  reconciles the two. The visor reads as darkened glass, and its final
  transparency is authored in Three.js (§6.1), not baked into the generation —
  the brief only has to stop the generator drawing a *reflective* plate.

Lighting is specified flat and even because image-to-3D routinely
reconstructs blown specular highlights as surface geometry.

### 4.4 Generation parameters (`multi_image_to_3d`)

From the captured specs. These are set explicitly; do not rely on defaults.

| Param | Value | Why |
|---|---|---|
| `image_references` | the 4 views | required |
| `pose_mode` | `"a-pose"` | the A-pose as a **parameter**, not a prompt hope |
| `symmetry_mode` | `"on"` | a humanoid is bilaterally symmetric; enforced symmetry makes the left/right split heuristics mirror reliably |
| `topology` | `"quad"` | quad edge loops cut far more cleanly at joints than triangles |
| `should_texture` | `false` | geometry-only GLB (also the default) |
| `should_remesh` | `true` | uniform topology for predictable splitting |
| `target_polycount` | 40000 | holds the GLB budget without decimating in Blender |
| `seed` | fixed, recorded per attempt | makes the 6-attempt loop reproducible |
| `enable_rigging` | `false` | see §4 — we do not want a skinned rig |
| `enable_animation` | `false` | requires rigging; all motion is authored in code |

`pose_mode` is a documented enum (`a-pose` | `t-pose`), which materially
de-risks the pose constraint: the A-pose no longer depends on the image
generator honouring prose. **Keep the prose constraint anyway** — it governs
the reference images, which is where fused-in arms actually originate.

> **Verify on the first generation:** `pose_mode` sits alongside
> `rigging_height_meters` in the parameter list, so it may only take effect
> when `enable_rigging=true`. If the A-pose is ignored with rigging off, the
> prompt constraint in §4.3 becomes the sole guarantee and matters more, not
> less.

**Budget.** Account is on the starter plan with 243 credits at capture. A
text-to-3D reference job costs 5 credits; image-based 3D jobs cannot be
priced without an upload, so per-attempt cost is unknown. Record actual cost
after attempt 1 and re-check the 6-attempt stop rule against it.

### 4.5 Portrait asset preparation

The source is `docs/reference/me.jpg` — 1600×1600, front-facing
head-and-shoulders, on a saturated amber backdrop.

**It cannot ship from where it sits.** `docs/reference/` is gitignored
(`.gitignore:37`), so nothing in it reaches GitHub Pages. It is also the wrong
home on principle: §5 pins that directory shut on the grounds that it holds *a
third party's screenshots*, which never described Alejandro's own portrait.
The prepared derivatives live at `latest/v2/assets/` and are committed like
any other deployed asset.

This is **one-time manual asset prep, not a pipeline stage.** There is no
build step to hang it on (§3) and it runs exactly once, so it is specified as
requirements plus a starting recipe, not as a script to be maintained.

**Measured source values** (sampled with `ffprobe`/`ffmpeg`, so the key is
asserted rather than tuned):

| Region | Value |
|---|---|
| backdrop, top-left / top-centre / top-right | `#F5B706` / `#F4B507` / `#F7BA08` |
| bottom corners (his shirt) | `#020200` / `#050403` |

Two things follow. The backdrop is **evenly lit** — under 3 points of drift
across the top edge — so a single key value works. And the **blue channel is
the separator**: backdrop `B≈6`, skin `B≈96`. Keying on *high red with
near-zero blue* has a ~90-point margin against skin, which is an assertion,
not a threshold that needs tuning. Do **not** key on hue; amber and skin are
neighbours there.

The lower third needs no work at all — the black shirt already measures
`#020200`, which *is* the target background.

**Requirements for the output:**

1. Background is `#000000`, matching `--surface-0`
2. **No amber fringe** on the hair. Curly edges are semi-transparent against
   the backdrop and are where a lazy key shows
3. **No amber spill** on skin, jawline or collar. Uncorrected, it reads as a
   wrong-coloured rim light once the background is black — the single most
   likely tell that this is a cut-out
4. **Cropped square to the face**, not head-and-shoulders. The plane maps 1:1
   to the visor (§6.1), so the face must fill the frame or it ends up a small
   portrait floating inside the helmet
5. Emitted at **512 / 1024 / 1536** px, served via `srcset`
6. JPEG **pre-composited on black**, not PNG with alpha. The background is
   always black, so alpha buys nothing, costs bytes, and lets the spill
   problem survive to runtime instead of being solved once here

**Starting recipe.** `ffmpeg` is available locally; ImageMagick, PIL and
rembg are not. Sample the exact backdrop hex first, then key, despill by
lifting blue in the keyed neighbourhood, crop and scale. Expect to eyeball the
hair edge and iterate the similarity/blend values. If the fringe resists,
finish it by hand in an image editor — it is one image, and a brittle filter
chain is not worth maintaining for a single asset.

## 5. Fidelity acceptance criteria

Generation is credit-metered and iterative. Without a written gate,
"perfect copy" has no stopping condition.

**Method.** Render the settled pose at three-quarter, full-body framing and
judge it against the written checklist below. The check is the checklist, not
a pixel diff — consistent with the approved approach of working from a
written brief rather than from the original's pixels.

Captured frames of the original are kept at `docs/reference/` **for human
eyeballing only**. That directory is **gitignored and must stay that way**:
`static.yml` uploads `path: '.'`, so anything committed is published, and
these are a third party's screenshots. They are an aid to judgement, never a
build input and never a deployed asset.

> That rationale is about **third-party material**, and it does not extend to
> `docs/reference/me.jpg`. Alejandro's own portrait is a deployed asset that
> was merely sitting in the wrong folder; §4.5 moves it to
> `latest/v2/assets/`. Nothing else leaves this directory.

**Must match — regenerate if any fails:**

1. Helmet is an ovoid/egg form with a **dark smoked visor** over the face
   area, no face features, and **no mirror-chrome finish on the visor**. A
   reflective plate fails this criterion: §6.1 needs the face visible behind
   it. Gloss on the *shell around* the visor is fine and wanted
2. Head-to-body proportion within ~10% of reference
3. Torso shows a clear shoulder-to-waist taper
4. Arm length: fingertips reach mid-thigh
5. Silhouette reads unambiguously as a humanoid robot at 400px tall

**Explicitly not matched — accept and move on:**

- individual fingers (simplified/mitten hands are fine)
- the visor's exact tint and transparency (authored in Three.js — §6.1)
- the exact specular streak down the helmet (authored in Three.js)
- carbon weave surface detail (authored as a normal map)
- exact visor outline and helmet facet count
- the original's settled arm pose (we generate neutral and pose in code)

**Stop rule.** After **6 generation attempts** without passing, stop. Either
revise the written brief or fall back to the unsplit-mesh mode in §7. Do not continue
open-endedly.

---

## 6. Robot runtime

Behaviours are pure functions — `(time, inputState) → pose delta` — writing
into a plain rotation object. A single `applyPose()` composes them and writes
to the scene graph **once per frame**.

This keeps each behaviour unit-testable without WebGL, and structurally
prevents the classic bug where two systems both write `head.rotation.y` and
fight frame to frame. They contribute; one writer resolves.

```text
src/robot/
├── rig.js          # bind named nodes, throw on missing
├── pose.js         # compose deltas, apply — the only writer
├── face.js         # build + parent the face plane and visor to Head
└── behaviours/
    ├── intro.js    # camera + face/visor opacity on one clock — §6.1
    ├── blink.js
    ├── idle.js
    └── lookAt.js
```

`intro.js` replaces the former `dolly.js`: the camera move and the two opacity
ramps are keyed against a single normalized `t`, so they are one behaviour
rather than three that have to be kept in step.

### 6.1 Intro sequence — face to robot

One-shot on load, **3.5s total**, after which the marquee reveals. Camera fov
35°. Model units (1.8 tall, feet at origin).

#### The face is a plane parented to `Head`

`face.js` builds two planes and parents both to the `Head` node from §4.1: the
**face plane** carrying the matted portrait (§4.5), and the **visor plane**
immediately in front of it.

Parenting is the whole reason registration is free. The face rides the same
transform matrix as the helmet, so as the camera pulls back and the head later
turns toward the cursor, the face cannot drift, jitter, or mismatch by a
subpixel — there is no synchronisation to get wrong. The rejected alternative,
a DOM `<img>` repositioned each frame by projecting a 3D point into screen
space, reintroduces exactly that class of bug for no benefit.

#### Timeline

Camera, `faceOpacity` and `visorOpacity` are keyed against one normalized `t`.

| Phase | Window | Camera | `faceOpacity` | `visorOpacity` |
|---|---|---|---|---|
| A — face | 0.00–0.60s | held at `d0` | 1.00 | 0.00 |
| B — visor forms | 0.60–1.80s | `d0` → 60% of travel, ease-in-out | 1.00 | 0.00 → 0.80 |
| C — face recedes | 1.80–2.70s | 60% → 88% | 1.00 → 0.70 | 0.80 → 0.90 |
| D — settle | 2.70–3.50s | 88% → end, `cubic-bezier(0.16, 1, 0.3, 1)` | 0.70 | 0.90 → 0.92 |
| marquee reveal | 3.50–3.90s | static | 0.70 | 0.92 |

**Phase A is a hold, not an ease — this is the load-bearing detail.** The
previous design used a single `cubic-bezier(0.16, 1, 0.3, 1)` across the whole
move, which front-loads nearly all travel into the first second. Applied here,
the face would be gone before a visitor registered it was a face. The hold is
what buys the "this is a person" beat inside a 3.5s budget; the expo ease is
demoted to phase D, where its job is stopping smoothly.

The visor emerges *from black* rather than fading in over the face: at
`visorOpacity: 0` the helmet shell around it is unlit and reads as background,
so the mask appears to condense out of the dark exactly as intended.

#### Final subtlety is one number, not two

Visible face contribution through the visor is multiplicative:

```
contribution = faceOpacity × (1 − visorOpacity)
             = 0.70 × 0.08 ≈ 0.056
```

**Tune `contribution`, never the two inputs independently.** They trade
against each other, and adjusting them separately lands on a visor that is
either milky or a mirror. Target ≈5%: present under inspection, invisible at a
glance. Both inputs are starting values; the product is the specification.

#### Start distance is derived, not hardcoded

The helmet is generated (§4), so the visor's edge length `F` is unknown until
it exists. `F`, the face-centre height `yFace` (≈1.62) and the visor plane
depth `zFace` are **measured once at calibration and recorded here**, in the
same class as the §4.2 split heuristics. `d0` then follows:

```js
const d0 = F / (2 * Math.tan((fov * Math.PI / 180) / 2) * Math.min(aspect, 1));
```

| Stage | Camera position | LookAt |
|---|---|---|
| Start — face fills frame | `(0, yFace, zFace + d0)` | `(0, yFace, 0)` |
| End — full body | `(0, 1.00, 3.50)` | `(0, 1.00, 0)` |
| End — chest-up | `(0, 1.45, 1.50)` | `(0, 1.45, 0)` |

`Math.min(aspect, 1)` is the entire responsive story for the opening frame: in
landscape the square face fills the viewport **height**; in portrait it fills
the **width**, with page-black above and below. One expression covers both
orientations with no breakpoint and no second crop.

#### Poster handoff

The DOM poster is the LCP element (§2.6) and cross-fades out over 200ms on the
first rendered WebGL frame. The handoff is invisible only if both render
identical framing — so they are made to, by construction rather than by tuning:

```css
.intro-poster { position: fixed; inset: 0; width: 100%; height: 100%;
                object-fit: contain; background: var(--surface-0); }
```

`object-fit: contain` on a **square** image means *fill the shorter axis,
letterbox the longer* — which is the same rule `Math.min(aspect, 1)` encodes
for the camera. The two are one decision expressed twice, and neither may be
changed alone.

#### Off-axis bias ramps in from zero

The bias below pushes the robot right-of-centre and high to clear the marquee.
**It must be zero at `t=0`** — a face shoved into the corner is not a portrait
— and ramp to full across phases B–D on the same clock.

The canvas is full-viewport (§2), so end framing keys off **viewport
height** directly:

```
viewportHeight < 620px  ->  chest-up
otherwise               ->  full body
```

Re-evaluated on resize. This is the detail that looks correct at 1440 and
breaks at 390.

#### Off-axis bias

The marquee is asymmetric, so the robot must sit right-of-centre and high.
**Do not rotate the camera to achieve this** — that skews the perspective and
the helmet reads as tilted. Shift `camera.position` **and** the lookAt target by
the same vector, which is a pure lateral translation: framing moves, projection
does not.

Express the shift as a fraction of the visible extent at the subject plane so it
holds across aspect ratios:

```js
const visibleH = 2 * Math.tan((fov * Math.PI / 180) / 2) * distance;
const visibleW = visibleH * (canvasW / canvasH);
const bias = { x: -kx * visibleW, y: -ky * visibleH };
// scaled by the phase B–D ramp, then added to both camera.position and the
// lookAt target, every frame of the intro
```

Negative `camera.x` pushes the robot **right** in frame; negative `camera.y`
pushes it **up**.

| Breakpoint | `kx` | `ky` |
|---|---|---|
| ≥900px | `0.12` | `0.10` |
| <900px | `0` | `0.06` |

Both are starting values to tune against the real mesh — the model's bounding
box is not symmetric about its origin once the arms are posed, so the visual
centre and the pivot do not coincide.

### 6.2 Blink

Drives an emissive uniform and scale-Y on the eye planes. 120ms close-open,
randomised 2–6s gaps. Never touches the rig.

### 6.3 Idle

Layered sines on shoulders, elbows and torso at **deliberately
incommensurate frequencies** (0.23 / 0.31 / 0.17 Hz). Shared factors make the
loop visibly repeat within ~15 seconds and read as mechanical.

### 6.4 LookAt

**Critically damped spring** (ω ≈ 6 rad/s), not a lerp — no overshoot, no
wobble when the cursor stops. That damping is what produces the heavy,
deliberate feel rather than a twitchy one.

Neck yaw ±22°, pitch ±14°. Torso receives 30% of neck yaw as counter-rotation.

---

## 7. Degradation and performance

| Condition | Behaviour |
|---|---|
| No WebGL | Face poster cross-fades to `robot-poster.webp` — see below |
| `prefers-reduced-motion` | **Composited final state, static** — see below |
| Keyboard input during intro | Jump to settled state, reveal marquee (§2) |
| Touch (no cursor) | Intro + blink + idle; lookAt disabled |
| Dialog open | Render loop paused |
| Low-end device | DPR capped at 1.5, frame rate capped at 30 |

**Without WebGL the reveal still happens, just not in 3D.** The face poster is
already painted (it is the LCP element), so a failed context is not a blank
screen: it cross-fades to `robot-poster.webp` over the same phase-C window.
The visitor gets face → robot, losing only the camera move and the live
behaviours. This costs one extra image and no JavaScript beyond the capability
check that was needed anyway.

**`prefers-reduced-motion` shows the *end* of the reveal, not a substitute for
it.** The robot renders at the settled pose with `faceOpacity: 0.70` and
`visorOpacity: 0.92` already applied — the face faintly visible behind the
visor — with no camera move, no blink and no idle. Skipping to a face-less
robot would delete the content of the sequence for an audience that asked to
lose the *animation*, not the meaning. The marquee is visible immediately;
there is nothing to gate.

`robot-poster.webp` depicts that same composited final state, so the one asset
serves both the no-WebGL fallback and the reduced-motion path.

**On dialog close, check for a canvas resize before resuming.** Rotation or
an on-screen keyboard can change canvas dimensions while the loop is paused;
resuming blind restores a stale drawing-buffer size.

**Unsplit-mesh mode.** If the split cannot produce a usable hierarchy,
`rig.js` throwing is the signal. The intro (§6.1) and blink still work on any
mesh, and the whole robot yaws toward the cursor in place of independent
head-turn and arm sway. Two of four behaviours, degraded rather than broken.

In this mode there is **no `Head` node to parent the face and visor planes
to**, so `face.js` falls back to parenting them to the root object instead.
Registration survives because in unsplit mode the whole robot is what yaws —
the planes still ride the only transform that moves. The calibration constants
`F` / `yFace` / `zFace` are measured against the fused mesh instead, and are
otherwise used identically.

---

## 8. Verification

- Playwright screenshots at 320 / 375 / 768 / 1024 / 1440 / 1920
- **Landscape-phone pass at 844×390 and 926×428**: two-column marquee, footer
  visible, no overflow (§2.6)
- **Short-laptop pass at 1024×640 and 1280×720**: whole marquee inside
  `100dvh`, no robot/eyebrow collision (`DESIGN-SYSTEM.md` §2.5)
- **Safe-area pass**: simulated notch + home indicator, footer fully legible
- No horizontal overflow; footer legible without scrolling at every width
- **Intro sequence**: face legible at `t=0` on both orientations; poster→WebGL
  handoff shows no jump in framing; total elapsed to marquee reveal ≤ 3.9s
- **Face registration**: face stays inside the visor across the full camera
  travel *and* through the lookAt range (neck yaw ±22°, pitch ±14°)
- **Final `contribution` ≈ 0.05** — face detectable on inspection, not at a glance
- `prefers-reduced-motion` pass: static composited state, face visible, no motion
- Keyboard: Tab during the intro jumps to settled state; then Tab through
  links, open/close both dialogs, focus returns to trigger, Esc closes
- WCAG AA contrast on all text including the footer; every pairing in
  `DESIGN-SYSTEM.md` §1.3 re-verified against the shipped CSS
- Unit tests on the four behaviours (pure functions, no WebGL)
- Measured gzipped transfer sizes against §3.3
- Contact form: verified end-to-end delivery to the target inbox

---

## 9. Open items

1. **`pose_mode` with rigging off** — verify on the first generation (§4.4).
   The A-pose is the highest-stakes constraint in the pipeline.
2. **Per-attempt credit cost** — unknown until attempt 1 (§4.4). Re-check the
   6-attempt stop rule once measured.
3. **Santander** — withheld; confirm before adding.
4. **Positioning line** — default proposed in §2.1, swappable.
5. **Root promotion** — page is built root-ready; the actual promotion (and
   retiring the current root `index.html`) is a separate decision.
6. **Face calibration constants** — `F`, `yFace`, `zFace` (§6.1) cannot be
   written until the helmet exists. Record them here once measured; the intro
   is not implementable before then.
7. **Visor generation risk** — §4.3 now asks for a smoked visor rather than
   chrome. If the generator keeps producing reflective plates, the fallback is
   to author the visor entirely in Three.js as a plane over a blank helmet,
   which is the §4.3 eye-panel argument applied one level up. Decide by
   attempt 3, not attempt 6.
8. **Spill correction on the portrait** — §4.5 asserts the key is safe; the
   hair fringe is the part that may need hand finishing. Confirm against the
   real output before committing the derivatives.
9. **Short-viewport lever** — `DESIGN-SYSTEM.md` §2.5 records three candidate
   fixes for the headline collision and does not pick one. It must be resolved
   together with the §2.6 landscape breakpoint, against a real render.
