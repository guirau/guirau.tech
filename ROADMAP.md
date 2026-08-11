# ROADMAP.md — v2 Build: Resume State

> **Purpose.** This document lets a fresh agent session resume the v2 build
> exactly where the previous session stopped, with zero rediscovery. Read this
> file first, then `CLAUDE.md` (rules), then the plan files it points to.
> The previous session stopped, at the user's request, **immediately after
> completing Plan 2 Task 6**. The next action is **dispatching Plan 2 Task 7**.

---

## 1. Snapshot

| | |
|---|---|
| **Resume on** | **`feature/v2-build`** — `git checkout feature/v2-build` before anything else. All 87 commits of v2 work live here and nowhere else. |
| Branch state | 87 commits ahead of `main`, pushed to `origin/feature/v2-build` (tracking). `main` is untouched by v2 work and still serves the live v0 site. |
| Last commit | `git log -1` on the branch. The P2-Task-6 checkpoint this document describes is `a8ee8d1`; anything after it is this document's own upkeep. |
| Test state | **66 Playwright + 28 unit tests, all green** (`cd latest/v2 && npx playwright test` and `npm run test:unit`) |
| Working tree | Clean. |
| Plan 1 (page) | **COMPLETE** — all 20 tasks, both reviews each |
| Plan 2 (runtime) | Tasks 1–6 of 13 **COMPLETE**; resume at **Task 7** |
| Plan 3 (asset) | Not started (requires human prerequisites, see §7) |

The three plans (all in `docs/superpowers/plans/`):

1. `2026-07-28-v2-page.md` — Plan 1, static page. Executed fully.
2. `2026-07-28-v2-runtime.md` — Plan 2, Three.js runtime. In progress.
3. `2026-07-28-v2-robot-asset.md` — Plan 3, real robot GLB generation. Not started.

**Critical convention: the plan files have been continuously SYNCED to match
shipped code.** Whenever execution deviated from a plan (a fix, a review
finding, a corrected constant), the plan's fenced block was edited to match
the shipped file and committed with a `docs:` message explaining why. The
plan files are therefore the current source of truth — trust them over any
memory of "original" plan text. Diffs between plan blocks and shipped files
should be zero (verified byte-for-byte at every review).

---

## 2. Execution methodology (continue exactly this way)

The user chose **subagent-driven development** (superpowers:subagent-driven-development
skill). Per task:

1. **Extract the task's full text** from the plan file (`sed -n 'START,ENDp'` —
   find boundaries with `grep -n "^## Task"`). Never make a subagent read the
   plan file; paste the complete task text into its prompt.
2. **Dispatch one implementer subagent** (Agent tool, `general-purpose`),
   `run_in_background: false`, one at a time — never parallel implementers.
   Model choice: `haiku` for verbatim-transcription tasks, `sonnet` for tasks
   with environment risk or judgment. The prompt template: task text verbatim +
   scene-setting context + constraints (below) + report format
   (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT).
3. **Spec-compliance review** (fresh subagent, usually `haiku`): diff shipped
   files byte-for-byte against the plan's fenced blocks, re-run suites, run
   independent functional probes, check commit shape (exact files, exact
   message, no trailers). "Do not trust the implementer's report" framing.
4. **Code-quality review** (fresh subagent, usually `haiku`): quality only,
   values settled; proportionate to diff size.
5. **Fix loops**: reviewer findings judged by the controller. Important
   findings → SendMessage back to the SAME implementer agent (its agentId keeps
   its context) with exact fix instructions **and a negative proof** (make the
   test fail for the right reason, then restore). Then sync the plan file and
   commit the sync (`docs:` prefix). Re-review with the same reviewer agent
   unless the fix was the reviewer's own prescription applied verbatim (then
   skip the ceremony). Minor findings: take them if cheap, otherwise record.
6. Mark the task complete in TodoWrite; next task.

**Constraints that go in every implementer prompt:**
- Work from `/Users/guirau/GitHub/guirau/guirau.tech`, branch `feature/v2-build`.
- Do NOT read repo-root `index.html`, `assets/`, `images/`, `projects/`
  (off-limits legacy v0; `latest/v2/assets/` is fine). Everything needed is
  supplied in the prompt.
- Transcribe fenced blocks exactly (em dashes in code comments are by design).
- Commit exactly the named files; no attribution footers (repo convention).
- All user-facing text plain ASCII; the footer legal string
  `Alejandro Guirau - Software Consulting` (plain hyphen-minus) is
  codepoint-pinned by tests and must never change.

**Quality bar achieved so far** (keep it): ~20 substantive review findings
caught and fixed across the run — vacuous test anchors, false-green gates,
scroll-structure bugs, a11y landmark loss, float-rounding-dependent tests.
Negative proofs (make it fail for the right reason) are mandatory for every
test-hardening fix.

---

## 3. Plan 1 — COMPLETE (context for later tasks)

All 20 tasks executed, spec- and quality-reviewed. What ships in `latest/v2/`:
a complete, deployable one-screen page (the spec-§7 no-WebGL state minus
`robot-poster.webp`): marquee grid (eyebrow "Alejandro Guirau", gradient
headline "Freelance AI engineer. Production systems, not prototypes."),
LinkedIn (`https://www.linkedin.com/in/guirau`) / GitHub
(`https://github.com/guirau`) links, Services dialog (4 offers verbatim from
`docs/CONTENT.md`, Santander withheld, 5 employers), Contact dialog
(Web3Forms POST, access key `b1d8beed-d4f5-4bac-8c07-356932d30828` — public
by design, matches `.env`; zero-size aria-hidden honeypot; lazy hCaptcha with
success-latched loader), three-case responsive envelope, safe-area insets,
subset Geist fonts (woff2, wght axis intact), portrait crops
(`face-{512,1024,1536}.jpg` from pixel-sampled crop `755:755:432:238`),
branching LCP preloads, contrast/banned-pattern/budget/a11y gates.

**Rulings made by the controller (user may veto, none vetoed yet):**
1. **Modal submit is an accent pill** (`.pill` on "Send message"); the
   one-accent-pill uniqueness test is scoped to the page surface via
   `!el.closest('dialog')`. Rationale: the marquee owns the one-pill rule;
   the modal submit is the conversion continuing.
2. **CSS weight target revised 5 → 6 KB** in spec §3.3 (measured 5.47 KB
   gzipped; binding CLAUDE.md 30 KB budget passes with huge margin).
3. **Case 3 responsive bound widened 899 → 999px** so iPhone Pro Max
   landscape (926×428) matches a case (plan defect found in execution).
4. **Placeholder GLB dimensions** honestly recorded as ~1.91 units (naming
   contract is the gate; Plan 3 normalizes the real GLB numerically).

**Known notes:**
- Chromium-only Playwright project (cross-browser was consciously deferred).
- The `test:unit` script is `node --test tests/unit/*.test.js` (directory
  form breaks on Node 25).
- `budget.spec.js`'s JS gate measures `dialogs.js` and carries an in-file
  marker: point it at `assets/app.js` when the bundle becomes the real page JS
  (Plan 2 Task 10/13 territory).
- Preload for `assets/robot-poster.webp` 404s by design until Plan 3;
  CLAUDE.md's promotion caution now gates root-promotion on that file existing.

---

## 4. Plan 2 — Tasks 1–6 COMPLETE

| Task | Commits | Delivered |
|---|---|---|
| 1. Bundler + staleness rule | `2287b86`, `2c4e7e8`, `939887d` | `src/build.mjs` (esbuild → committed `assets/app.js`, GENERATED banner, 150 KB gzip hard-fail), staleness mtime guard (`tests/unit/build.test.js`, `.m?js` filter, branch-switch false-positive documented), `test:unit` glob fix |
| 2. Camera maths | `a5c024e`, `140d030` | `src/robot/camera.js` — pure: `faceDistance` (min(aspect,1) = object-fit: contain), `chooseEndFraming` (620px threshold; frozen deep constants), `frustumBias`, `biasFractions` (900px breakpoint, tested) |
| 3. Placeholder rig | `44e08a1`, `d44a08e` | `src/robot/placeholder.js` (10-node contract hierarchy from primitives, honest ~1.91-unit header), `src/tools/make-placeholder.mjs` (**FileReader shim** before dynamic GLTFExporter import — Node lacks the browser global), committed `assets/robot.glb` (71.2 KB, byte-deterministic regeneration), @gltf-transform devDeps |
| 4. Rig binding | `ce72631`, `b916ef2` | `src/robot/rig.js` — `bindRig` duck-typed on traverse/name; `RigError` (.missing) is the §7 unsplit-mesh signal; `DuplicateNodeError` (.duplicates) checked first; frozen return. Typed duplicate assertion in tests |
| 5. Pose composition | `d6848e4`, `1f0936c` | `src/robot/pose.js` — `composePose` (sums fragments), `captureRest` (frozen snapshot; **deltas are offsets from rest** — the A-pose is a non-zero shoulder rotation), `applyPose(rig, pose, rest)`, `EMPTY_POSE`; hoisted `AXIS_KEYS`/`AXIS_ENTRIES` |
| 6. Idle sway | `d87c4f7`, `999eebc` | `src/robot/behaviours/idle.js` — 0.23/0.31/0.17 Hz. **Honest maths**: exact period is 100 s (coprime numerators over 100), not "no period"; the non-repetition test window is 95 s deliberately (at t=100 the pose recurs and only float rounding hides it). Mirror invariant pinned. 6 idle tests |

Unit tally by file: build 2, camera 8, rig 3, pose 9, idle 6 = **28**.

**Gotchas the next agent must know:**
- After ANY new/edited file under `latest/v2/src/`, the staleness guard fires:
  run `npm run build` (refreshes `assets/app.js` mtime) before `npm run test:unit`.
  Until `main.js` actually imports the robot modules, the bundle content does
  not change — verify `git status` shows no `app.js` diff and do not commit it
  when contentless.
- `src/main.js` is still the two-line stub (`export const VERSION = '2.0.0'`).
  Task 10 replaces it and wires everything; at that point `app.js` gains real
  content and MUST be rebuilt and committed in the same commit as src changes.
- `.pill` matches TWO elements (marquee Contact + modal submit) — Playwright
  strict mode needs `.first()` or scoping (`.marquee__card [data-open=...]`
  is the established pattern for trigger locators).
- Chromium serializes damped transitions as `1e-05s` — never string-match
  transition durations; use `parseFloat(...) < 0.05`.

---

## 5. RESUME HERE: Plan 2 Task 7 and the rest

Plan file: `docs/superpowers/plans/2026-07-28-v2-runtime.md`.
Current task boundaries (line numbers in the CURRENT synced plan — re-run
`grep -n "^## Task" <plan>` to confirm before extracting, since syncs shift
lines):

| Task | Start line (verified) | Content |
|---|---|---|
| **7. Blink and cursor-follow** ← NEXT | 1017 | `behaviours/blink.js` (`nextBlinkTime`, `blinkState` — eyeScale/emissive timeline) + `behaviours/lookAt.js` (`stepLookAt` — damped pursuit, yaw ±22° pitch ±14° envelope, Neck/Torso split). Pure functions + unit tests |
| 8. Intro timeline | 1273 | `src/robot/intro.js` — the 3.5 s face→helmet→dolly sequence as a pure `(t) → state` timeline: `cameraT`, `faceOpacity` (0.70 hold), `visorOpacity` (0.92), contribution product gate `0.70 × (1−0.92) ≈ 0.056 ∈ [0.04, 0.07]`, marquee reveal timing. Unit tests pin the timeline keyframes |
| 9. Face plane, visor, vignette | 1481 | `src/robot/face.js` — `buildFace` (textured plane parented to Head), `setFaceOpacity` (multiplicative compositing — NEVER tune the 0.70/0.92 independently; the product is the spec), `pickFaceTexture` (DPR-based size selection from face-{512,1024,1536}), vignette shader + `tests/unit/vignette.test.js` |
| 10. Wire the runtime | 1714 | Replaces `src/main.js`: renderer, GLTFLoader on `assets/robot.glb`, bindRig with RigError → unsplit-mode fallback, `captureRest` BEFORE behaviours, frame loop `applyPose(rig, composePose(fragments), rest)`, `FACE_CALIBRATION` constants (placeholder-derived; Plan 3 Task 8 re-measures), window globals: `__introComplete`, `__unsplitMode`, `__renderPaused`. Playwright tests incl. intro completion. **This is where `app.js` becomes real: rebuild + commit the bundle in the same commit. Also update `budget.spec.js`'s JS gate to `assets/app.js` per its in-file marker** |
| 11. Degradation paths | 2105 | `tests/degradation.spec.js` — no-WebGL end state, unsplit-mesh mode (`window.__unsplitMode`), reduced-motion static composite, tab-hidden render pause |
| 12. Resolve bias fractions | 2207 | Tune `kx`/`ky` against renders (like Plan 1 Task 14: measure, screenshot, judge, record in DESIGN-SYSTEM, remove `[tune]`) |
| 13. Acceptance sweep | 2285 | Full suites, bundle budget vs 150 KB, ten-breakpoint screenshots, spec §8 checklist |

After Plan 2: **Plan 3** (`2026-07-28-v2-robot-asset.md`) — generation runbook
(Higgsfield image → 3D → Blender split via `split-rig.py` → meshopt → swap →
face recalibration → eye planes → poster capture). Gated on human
prerequisites (§7 below). Then the **final cross-plan code review** (planned
todo), then the user decides merge/deploy.

---

## 6. Standing decisions already made (do not re-litigate)

- Stack: static HTML/CSS/ES modules; Three.js vendored via committed esbuild
  bundle; no framework; `DESIGN-SYSTEM.md` is the only design authority.
- One conversion: Contact is the only accent pill **on the page surface**;
  Services has no per-card CTA styling beyond text links.
- Santander is withheld from credentials (test-enforced).
- Copy is verbatim from `docs/CONTENT.md`; never add an em dash to authored
  copy (code comments are exempt; the plans' § references and dashes are fine).
- Intro is a full cinematic gate, 3–4 s, with a keyboard-skip affordance
  (an addition the user was offered veto on — still standing).
- The face-behind-visor contribution product (0.70 × 0.08 ≈ 0.056) is the
  spec; inputs never tuned independently.
- Deploy remains GitHub Pages publishing the WHOLE repo (`static.yml`,
  `path: '.'`); `docs/reference/` is gitignored; everything committed is
  published once pushed.

## 7. Human-pending items (surface these to the user when relevant)

1. **Manual funnel proof** (Plan 1 Task 12 Step 7, still unperformed): serve
   `latest/v2`, open Contact, solve the captcha, submit for real, confirm
   the email arrives at alejandro.guirau@gmail.com. Also decide whether to add
   a Web3Forms `redirect` hidden field (currently a successful submit lands on
   Web3Forms' generic success page).
2. **Vetoes open**: pill submit ruling; 6 KB CSS target; keyboard-skip intro
   affordance.
3. **Plan 3 prerequisites**: H3 — connect/authenticate the Higgsfield MCP
   interactively; H4 — accept credit spend (243 credits at capture; image→3D
   job cost unknowable until first upload; six-image-attempt stop rule);
   H5 — the human fidelity gate on generated images (§5 checklist).
4. **Business decisions before launch** (CLAUDE.md Cautions): `static.yml`
   publishes `docs/` (pricing/strategy) — scrub or re-path before promoting;
   root promotion checklist (legal string, Meta tag, canonical, favicon,
   **and `robot-poster.webp` existing**).

## 8. Key file map (v2 work only)

```
latest/v2/
├── index.html                  # complete page shell (head metadata, marquee, dialogs, preloads)
├── assets/
│   ├── styles.css              # tokens + full page CSS (5.47 KB gz; 6 KB gate)
│   ├── dialogs.js              # dialog mechanics + captcha lazy-loader (success-latched)
│   ├── app.js                  # GENERATED esbuild bundle (currently stub; Task 10 makes it real)
│   ├── robot.glb               # placeholder rig (Plan 3 overwrites)
│   ├── favicon.svg, face-{512,1024,1536}.jpg, fonts/geist-{sans,mono}.woff2
├── src/
│   ├── main.js                 # two-line stub until Task 10
│   ├── build.mjs               # esbuild bundler + 150 KB gate
│   ├── robot/                  # camera.js, rig.js, pose.js, placeholder.js, behaviours/idle.js
│   └── tools/                  # subset-fonts.sh, crop-portrait.sh, make-placeholder.mjs
└── tests/
    ├── unit/                   # build, camera, rig, pose, idle (28 tests)
    └── *.spec.js               # smoke, footer, metadata, layout, links, dialogs,
                                #   responsive, contrast, budget, a11y (66 tests)
```

Serve: `cd latest/v2 && npm run serve` (python http.server :4173).
Suites: `npx playwright test` and `npm run test:unit`. Build: `npm run build`.
