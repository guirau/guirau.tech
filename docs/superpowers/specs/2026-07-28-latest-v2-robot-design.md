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

The robot is a reconstruction of the visual language seen on
`getroamify.com/en/sign-in/` — a glossy near-black humanoid in the Figure 02 /
Optimus idiom. The model is **generated from an original written brief**, not
derived from their asset. See §5.

### Out of scope

Scroll sections, blog, live ML demos, a scheduler integration. The page has
exactly one conversion path: the Contact dialog.

---

## 2. Page structure

One screen. `100dvh`. No page scroll.

```text
┌─ 100dvh ───────────────────────────────────┐
│              [ ROBOT CANVAS ]              │  flex: 1, min-height: 0
│ ·········································· │
│             Alejandro Guirau               │  name
│    Freelance AI engineer.                  │  positioning (swappable)
│    Production systems, not prototypes.     │
│   LinkedIn · GitHub · Services · Contact   │  links
│    Alejandro Guirau - Software Consulting  │  footer, 13px, tertiary
└────────────────────────────────────────────┘
```

`100dvh` and not `100vh`: `vh` excludes the mobile address bar, which pushes
the links and footer below the visible area on phones.

The text block is fixed-height; the canvas is `flex: 1` and absorbs the
remainder, so the robot is always as large as the device allows and the type
is never displaced.

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
- de-emphasized (13px, tertiary colour) but never hidden

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

---

## 3. Build and deployment

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
│   └── robot-poster.webp
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

> Full-body humanoid robot, photoreal product render. Chrome mirror-finish
> egg-shaped helmet with a faceted faceplate and **no face, no eyes, no
> screen — a smooth blank plate**. Segmented mechanical neck collar. Carbon
> fibre weave torso tapering to a narrow waist. Articulated shoulders and
> elbows. Simplified hands. Near-black glossy shell. Standing in a **wide
> A-pose, arms held clearly away from the body with visible gaps at the
> armpits, elbows straight**. Pure white seamless background, soft even
> studio lighting, no dramatic highlights. Neutral industrial design.

Two constraints are load-bearing:

- **Wide A-pose, clear armpit gaps, straight elbows.** Arms touching the body
  get fused into the torso by the generator, which breaks the scripted split.
  A bend baked into the elbow can never be straightened, and the idle sway
  rotates from rest.
- **Blank faceplate, no eyes.** The dot-matrix eye panels are authored in
  Three.js as planes with an emissive shader. This makes the blink sharp,
  resolution-independent, and — critically — **independent of generation
  quality**. It works identically on attempt 1 and attempt 6.

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

---

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

**Must match — regenerate if any fails:**

1. Helmet is an ovoid/egg form with a faceted faceplate, chrome finish, no
   face features
2. Head-to-body proportion within ~10% of reference
3. Torso shows a clear shoulder-to-waist taper
4. Arm length: fingertips reach mid-thigh
5. Silhouette reads unambiguously as a humanoid robot at 400px tall

**Explicitly not matched — accept and move on:**

- individual fingers (simplified/mitten hands are fine)
- the exact specular streak down the helmet (authored in Three.js)
- carbon weave surface detail (authored as a normal map)
- exact faceplate facet count
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
└── behaviours/
    ├── dolly.js
    ├── blink.js
    ├── idle.js
    └── lookAt.js
```

### 6.1 Dolly-out

One-shot on load, **3.7s**, `cubic-bezier(0.16, 1, 0.3, 1)`. Camera fov 35°.
Model units (1.8 tall, feet at origin):

| Stage | Camera position | LookAt |
|---|---|---|
| Start (helmet close-up) | `(0, 1.62, 0.60)` | `(0, 1.62, 0)` |
| End — full body | `(0, 1.00, 3.50)` | `(0, 1.00, 0)` |
| End — chest-up | `(0, 1.45, 1.50)` | `(0, 1.45, 0)` |

**End framing is chosen from the canvas's own measured height, not the
window's** — the canvas is flex-derived and unknown until the text block
measures.

```
canvasHeight < 420px  ->  chest-up
otherwise             ->  full body
```

Re-evaluated on resize. This is the detail that looks correct at 1440 and
breaks at 390.

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
| No WebGL | `robot-poster.webp`, no JS penalty |
| `prefers-reduced-motion` | Model renders, settled pose, no dolly/idle/blink |
| Touch (no cursor) | Dolly + blink + idle; lookAt disabled |
| Dialog open | Render loop paused |
| Low-end device | DPR capped at 1.5, frame rate capped at 30 |

**On dialog close, check for a canvas resize before resuming.** Rotation or
an on-screen keyboard can change canvas dimensions while the loop is paused;
resuming blind restores a stale drawing-buffer size.

**Unsplit-mesh mode.** If the split cannot produce a usable hierarchy,
`rig.js` throwing is the signal. Camera dolly and blink still work on any
mesh, and the whole robot yaws toward the cursor in place of independent
head-turn and arm sway. Two of four behaviours, degraded rather than broken.

---

## 8. Verification

- Playwright screenshots at 320 / 375 / 768 / 1024 / 1440 / 1920
- No horizontal overflow; footer legible without scrolling at every width
- `prefers-reduced-motion` pass
- Keyboard: Tab through links, open/close both dialogs, focus returns to
  trigger, Esc closes
- WCAG AA contrast on all text including the tertiary footer
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
