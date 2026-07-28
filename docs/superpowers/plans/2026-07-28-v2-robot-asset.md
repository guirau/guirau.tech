# v2 Robot Asset (Plan 3 of 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the real `robot.glb` — generate four reference views, convert to 3D, split into a rigid parented hierarchy in Blender, calibrate the face constants against the actual helmet, and swap it in behind the runtime Plan 2 already built and tested.

**Architecture:** A five-stage pipeline (image → 3D → split → compress → author) with a **human judgement gate between the image stage and the 3D stage**. That gate is where the credits are saved: every one of spec §5's five fidelity criteria is visible in the front image view, so the design is settled while iteration is still cheap. The 3D stage then verifies a conversion rather than discovering a design.

**Tech Stack:** Higgsfield MCP (image generation + `multi_image_to_3d`), Blender 4.x headless with a Python script, `@gltf-transform/cli` for Meshopt compression, Three.js for material authoring.

---

## Scope Check — this plan is a runbook, not TDD

Plans 1 and 2 are test-driven because their outputs are deterministic: given the same input, the code either produces the specified number or it does not. **This plan is not, and forcing it into that shape would be dishonest.**

Its central operations are a generative model and a human eye. "Does the helmet read as an ovoid with a smoked visor?" has no assertion. Writing `expect(helmet).toBeEggShaped()` would be theatre.

So the structure is different, deliberately:

| | Plans 1 & 2 | This plan |
|---|---|---|
| Unit of work | a failing test | a stage with a written gate |
| Pass condition | assertion passes | checklist judged by a human |
| On failure | fix the code | retry, with a hard attempt cap |
| Bounded by | correctness | **credits and a stop rule** |

**Where automated checks do apply, they are here.** The hierarchy contract (Task 6), the normalization (Task 7), the polycount and file size (Task 8) and the full regression suite (Task 12) are all machine-checkable, and they are checked. What cannot be automated is fenced into explicit human gates rather than smuggled into a fake assertion.

**The stop rule is binding.** Spec §5: after **6 image attempts** without passing the checklist, stop. Either revise the written brief or ship the unsplit-mesh mode from §7 — which Plan 2 already implemented and tested, so it is a real fallback, not a euphemism for failure.

### What this plan changes in already-shipped code

Everything below is a modification to working, tested code from Plan 2. Nothing here is new architecture.

| Change | File | Why it was deferred |
|---|---|---|
| `robot.glb` swap | `assets/robot.glb` | placeholder satisfied the contract |
| `FACE_CALIBRATION` | `src/main.js` | spec open item 6 — unmeasurable without a helmet |
| Eye planes + blink rewiring | `src/robot/face.js`, `src/main.js` | needs a real visor to sit on |
| Crop ↔ vignette re-tune | `src/tools/crop-portrait.sh`, `src/robot/face.js` | Plan 2 Task 9 tuned it against the placeholder |
| `robot-poster.webp` | `assets/robot-poster.webp` | it is a screenshot of the finished thing |

---

## Human prerequisites

| # | Action | Needed by |
|---|---|---|
| H3 | Connect and authenticate the Higgsfield MCP server in an interactive session. It cannot be authorized from a non-interactive run. | Task 2 |
| H4 | Confirm the credit balance and accept the spend. Spec §4.4 records 243 credits at capture and notes that **image-based 3D jobs cannot be priced without an upload** — so the per-attempt cost of the 3D stage is genuinely unknown until attempt 1 completes. | Task 2 |
| H5 | Judge the §5 checklist at Tasks 3 and 5. This is the one thing in the whole project that cannot be delegated to a test. | Tasks 3, 5 |

---

## File Structure

| File | Responsibility |
|---|---|
| `latest/v2/src/tools/split-rig.py` | Blender headless script: split the fused mesh, set pivots, parent, normalize, re-export. The single most complex artifact in this plan. |
| `latest/v2/src/tools/verify-glb.mjs` | Machine checks on any GLB that do not depend on node transforms: hierarchy, duplicate names, parenting, polycount. Run against both the placeholder and the real asset. Dimensions are gated in `split-rig.py` instead — see Task 1 Step 2. |
| `latest/v2/src/tools/capture-poster.mjs` | Screenshots the settled frame with the marquee suppressed. A build tool, not a test. |
| `latest/v2/assets/robot.glb` | **Replaces** the placeholder. Same path, same contract. |
| `latest/v2/assets/robot-poster.webp` | Static composited final frame for the no-WebGL and reduced-motion paths. |
| `docs/robot-generation-log.md` | Per-attempt record: seed, parameters, cost, verdict. Makes the 6-attempt loop auditable rather than remembered. |
| `latest/v2/src/robot/face.js` | Modified: gains the emissive eye planes. |
| `latest/v2/src/main.js` | Modified: real `FACE_CALIBRATION`, blink rewired to the eye planes. |

**Generation intermediates** (`robot-front.png` and the other three views) go to
`docs/reference/robot-gen/`. That directory is already gitignored, which is
correct here for a different reason than usual: they are working files, not
deployed assets, and `static.yml` would otherwise publish every rejected attempt.

---

## Task 1: Pre-flight and the generation log

**Files:**
- Create: `docs/robot-generation-log.md`
- Create: `latest/v2/src/tools/verify-glb.mjs`

Before spending anything, establish what "working" means and where the record goes.

- [ ] **Step 1: Confirm the toolchain**

```bash
blender --version && node --version && npx gltf-transform --version
```

Expected: Blender 4.x, Node v25.x, gltf-transform 4.x. If Blender is missing, `docs/setup-guides/` has the install steps — do not proceed without it, because §4 is explicit that the rigid split is not optional.

- [ ] **Step 2: Write the GLB verifier**

Create `latest/v2/src/tools/verify-glb.mjs`:

```js
// Machine-checkable properties of any robot GLB. Runs against the placeholder
// and the generated asset alike — if it passes for one and not the other, the
// difference is real and worth knowing about.
import { NodeIO } from '@gltf-transform/core';

const REQUIRED = [
  'Root', 'Torso', 'Neck', 'Head',
  'Shoulder_L', 'Forearm_L', 'Hand_L',
  'Shoulder_R', 'Forearm_R', 'Hand_R',
];

const path = process.argv[2];
if (!path) {
  console.error('usage: node src/tools/verify-glb.mjs <file.glb>');
  process.exit(1);
}

const doc = await new NodeIO().read(path);
const root = doc.getRoot();
const failures = [];

// --- Hierarchy ---
const names = root.listNodes().map((n) => n.getName());
const missing = REQUIRED.filter((r) => !names.includes(r));
if (missing.length) failures.push(`missing nodes: ${missing.join(', ')}`);

const duplicates = REQUIRED.filter((r) => names.filter((n) => n === r).length > 1);
if (duplicates.length) failures.push(`duplicate nodes: ${duplicates.join(', ')}`);

// --- Parenting: every part must hang off Root, not sit loose in the scene ---
const looseParts = root.listNodes()
  .filter((n) => REQUIRED.includes(n.getName()) && n.getName() !== 'Root')
  .filter((n) => n.getParentNode() === null)
  .map((n) => n.getName());
if (looseParts.length) failures.push(`unparented: ${looseParts.join(', ')}`);

// --- Polycount ---
let triangles = 0;
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const position = prim.getAttribute('POSITION');
    const indices = prim.getIndices();
    triangles += indices ? indices.getCount() / 3 : (position?.getCount() ?? 0) / 3;
  }
}
if (triangles > 45000) failures.push(`${Math.round(triangles)} triangles exceeds the 40k target + slack`);

console.log(`${path}`);
console.log(`  nodes ${root.listNodes().length}  tris ${Math.round(triangles)}`);

if (failures.length) {
  console.error('\nFAIL:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('  OK');
```

> **Why this script does not measure height, feet or centring.** Those are
> *world*-space facts, and a glTF accessor's `min`/`max` are **local** to its own
> primitive. On a single unsplit mesh at identity the two coincide, so a bounds
> check here would appear to work — and then silently lie the moment Task 6 splits
> the model, because `origin_set` rewrites each part's vertices around its joint
> pivot and moves the offset onto the node translation. Unioning `Head`'s
> neck-relative box with `Torso`'s waist-relative box yields a number that is not
> the robot's height and not anything else either. Composing world matrices here
> would be possible but duplicates work `split-rig.py` already does correctly in
> Blender, where the coordinates are unambiguous. **The bounds assertion lives in
> `split-rig.py` (Task 6); this script owns only the transform-independent
> checks** — hierarchy, duplicates, parenting, polycount.

- [ ] **Step 3: Verify it against the placeholder**

```bash
cd latest/v2 && node src/tools/verify-glb.mjs assets/robot.glb
```

Expected: `OK`. The placeholder was built to the §4.1 hierarchy, so every check here should pass on it. If it does not, the placeholder is wrong — fix it before generating anything, because Plan 2's runtime is bound to that same contract.

- [ ] **Step 4: Create the generation log**

Create `docs/robot-generation-log.md`:

```markdown
# Robot generation log

Per-attempt record for the spec §5 six-attempt stop rule. The count is **image
attempts**; a failed 3D conversion of an approved image set is a separate,
shorter loop (§5) and is logged below the table.

Credits at start: <record before attempt 1>

## Image attempts

| # | Seed | Brief change from previous | Criteria 1-5 | Verdict | Credits |
|---|---|---|---|---|---|
| 1 | | (baseline §4.3 brief) | | | |

Criteria, from spec §5 — all five must pass:
1. Ovoid helmet, dark smoked visor, no face features, **not mirror-chrome**
2. Head-to-body proportion within ~10%
3. Clear shoulder-to-waist taper
4. Fingertips reach mid-thigh
5. Reads as a humanoid robot at 400px tall

## 3D conversions

| # | Source images | Parameter change | Result | Credits |
|---|---|---|---|---|

## Outcome

<filled in at the end: passed at attempt N, or fell back to unsplit-mesh mode>
```

- [ ] **Step 5: Commit**

```bash
git add latest/v2/src/tools/verify-glb.mjs docs/robot-generation-log.md
git commit -m "chore: add GLB verifier and generation log"
```

---

## Task 2: Generate the front view

**Human gate — H3, H4 and the first credit spend.**

Only the front view. Spec §5 is explicit that all five criteria are judgeable from it, so generating four views before the design is settled would multiply the cost of every rejected attempt by four.

- [ ] **Step 1: Record the starting balance**

Query the Higgsfield account credit balance and write it into
`docs/robot-generation-log.md` under "Credits at start".

- [ ] **Step 2: Generate the front view**

Use the shared prompt from spec §4.3 **verbatim** — it is the design, and paraphrasing it silently changes the brief:

> Full-body humanoid robot, photoreal product render. Egg-shaped helmet with a **dark smoked visor** covering the face area — a deep near-black tinted panel, like a motorcycle helmet visor, **no face, no eyes, no screen**. The helmet shell around the visor is a glossy near-black hard surface. Segmented mechanical neck collar. Carbon fibre weave torso tapering to a narrow waist. Articulated shoulders and elbows. Simplified hands. Near-black glossy shell. Standing in a **wide A-pose, arms held clearly away from the body with visible gaps at the armpits, elbows straight**. Pure white seamless background, soft even studio lighting, no dramatic highlights. Neutral industrial design.

Append for this view only: `Front orthographic view, camera at chest height, subject centred and fully in frame.`

Record the **seed** — the loop is only reproducible if each attempt's seed is written down.

- [ ] **Step 3: Save it**

```bash
mkdir -p docs/reference/robot-gen
```

Save as `docs/reference/robot-gen/attempt-1-front.png`.

- [ ] **Step 4: Record the actual cost**

Write the credits consumed into the log. Spec §4.4 flags that this number was unknowable in advance — now it is known, so **re-check the six-attempt budget against it**. If six attempts would exhaust the balance, raise that before attempt 2 rather than discovering it at attempt 5.

---

## Task 3: The fidelity gate

**Human gate — H5. This is the decision the entire plan is built around.**

- [ ] **Step 1: Judge the front view against all five criteria**

Open `docs/reference/robot-gen/attempt-N-front.png` and check each in order. Reference frames of the original in `docs/reference/` are an aid to the eye — **look at them, never build from them**; the approved approach is a written brief, not their pixels.

1. **Ovoid helmet, dark smoked visor, no face features, not mirror-chrome.** The chrome sub-clause is the one that most often fails silently: a generator asked for "glossy near-black" will happily return a mirror plate, and a mirror finish is *defined by not transmitting light*. §6.1 needs the face visible behind the visor at 5% contribution, so no amount of material tuning in Three.js reconciles a mirror. **If the visor is reflective, this criterion has failed** even if it looks striking.
2. **Head-to-body proportion within ~10%.**
3. **Clear shoulder-to-waist taper.**
4. **Fingertips reach mid-thigh.**
5. **Reads unambiguously as a humanoid robot at 400px tall.** Actually shrink the image to check — a silhouette that only works at full size will not survive the settled framing.

Also check the load-bearing pose constraint from §4.3, which is not one of the five but breaks the split if violated: **visible gaps at the armpits, elbows straight**. Arms touching the body get fused into the torso by the generator, and a bend baked into the elbow can never be straightened.

- [ ] **Step 2: Record the verdict**

Fill in the attempt's row in `docs/robot-generation-log.md` — per-criterion pass/fail, not just an overall verdict. The pattern across attempts is what tells you which clause of the brief to revise.

- [ ] **Step 3: Branch**

**All five pass** → Task 4.

**Any fail, attempts 1–2** → revise the brief clause that governs the failed criterion, generate again with a new seed, return to Step 1.

**Any fail, attempt 3** → stop and reconsider the visor before burning the remaining budget. If criterion 1 has now failed three times on the chrome sub-clause, the smoked-visor brief is not landing, and there are two levers:

- Strengthen the negative constraint — "matte-finish tinted glass, absorbs light, non-reflective, not chrome, not mirrored, not polished metal".
- Accept a **plain dark faceplate with no transparency at all** and author the entire see-through effect in Three.js by keeping the face plane in front of the visor at low opacity rather than behind it. This preserves the intro exactly as specified — the contribution maths is unchanged — and costs only the physical plausibility of *why* the face shows through.

The second is a real design change. **Raise it rather than adopting it silently**, and record which was chosen.

**Any fail, attempt 6** → the stop rule binds. Do not continue. Either revise the written brief substantially and restart the count with that noted in the log, or ship §7's unsplit-mesh mode — Plan 2 built and tested that path, so it degrades to a robot that yaws as one piece with no articulated arms. Record the outcome and raise it.

---

## Task 4: Generate the remaining three views

Only reached once the front view has passed. Same seed, same prompt.

- [ ] **Step 1: Generate side, three-quarter and back**

Use the §4.3 prompt verbatim with the same seed, appending per view:

- `Side orthographic view, camera at chest height, subject facing screen-right, fully in frame.`
- `Three-quarter view, camera at chest height, subject rotated 45 degrees, fully in frame.`
- `Back orthographic view, camera at chest height, subject centred and fully in frame.`

Save to `docs/reference/robot-gen/` as `approved-{side,threequarter,back}.png`, and copy the passing front view to `approved-front.png`.

- [ ] **Step 2: Check consistency across the four**

Not a re-judgement of the design — a check that the four views describe *the same object*. Proportions, helmet shape and arm length must agree. `multi_image_to_3d` fuses them, so a back view with a different silhouette produces a confused mesh.

If one view disagrees, regenerate **that view only**. This does not count against the six-attempt rule, which counts design iterations, not view mismatches — note it in the log as such.

- [ ] **Step 3: Log**

Record the four filenames and the shared seed.

---

## Task 5: Convert to 3D

- [ ] **Step 1: Run `multi_image_to_3d` with the §4.4 parameters**

Set every one explicitly — §4.4 says not to rely on defaults:

| Param | Value |
|---|---|
| `image_references` | the four approved views |
| `pose_mode` | `"a-pose"` |
| `symmetry_mode` | `"on"` |
| `topology` | `"quad"` |
| `should_texture` | `false` |
| `should_remesh` | `true` |
| `target_polycount` | `40000` |
| `seed` | the recorded seed |
| `enable_rigging` | `false` |
| `enable_animation` | `false` |

- [ ] **Step 2: Verify `pose_mode` actually took effect**

Spec §4.4 flags this specifically: `pose_mode` sits alongside `rigging_height_meters` in the parameter list, so **it may only apply when `enable_rigging=true`** — which is off. Look at the returned mesh: are the arms in a wide A-pose with clear armpit gaps?

If not, `pose_mode` was ignored, and the §4.3 prose constraint is the sole guarantee — which makes the reference images matter more, not less. Record this finding in the log either way; it determines whether a future regeneration can rely on the parameter.

- [ ] **Step 3: Download and inspect**

```bash
cd latest/v2 && node src/tools/verify-glb.mjs docs/reference/robot-gen/fused.glb
```

Expected at this stage: **hierarchy failures are correct and expected** — this is one fused mesh, so `Torso`, `Head` and the rest do not exist yet. Task 6 creates them. What matters here is the triangle count (should be near 40,000) and that the file loads at all.

- [ ] **Step 4: Log the conversion**

Record parameters, cost and result. If the conversion failed on an approved image set, §5 is explicit that this is a *parameter* problem, not a design problem — adjust §4.4 values and retry. This is a separate, shorter loop and does not consume image attempts.

---

## Task 6: The Blender split

**Files:**
- Create: `latest/v2/src/tools/split-rig.py`

The most intricate artifact in the project. §4 explains why it is not optional: the robot is hard-surface mechanical, so joints must pivot **rigidly**. A skinned rig stretches the elbow like skin, which reads as a bug on a glossy hard shell. The requirement is separate rigid parts in a parent-child tree, not a skeleton.

- [ ] **Step 1: Write the split script**

Create `latest/v2/src/tools/split-rig.py`:

```python
"""Split a fused humanoid GLB into the spec §4.1 rigid hierarchy.

Run headless:
    blender --background --python src/tools/split-rig.py -- <in.glb> <out.glb>

The §4.2 heuristics are STARTING VALUES measured against the reference
proportions. Print the measured bounds first, then adjust — a threshold that
is right for one generation is not automatically right for the next.
"""
import bpy
import sys
from mathutils import Vector

# --- §4.2 split heuristics, as fractions of total height so they survive
# --- a model that imports at a different scale.
HEAD_CUT_FRACTION = 1.55 / 1.80   # vertices above this are the head
WRIST_FRACTION = 0.88             # along the shoulder -> arm tip axis
TARGET_HEIGHT = 1.80


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()


def import_glb(path):
    bpy.ops.import_scene.gltf(filepath=path)
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    if not meshes:
        raise SystemExit('FAIL: no mesh in the imported GLB')
    # The conversion emits one fused mesh; join defensively in case it did not.
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    return bpy.context.view_layer.objects.active


def world_bounds(objs):
    """Axis-aligned world bounds over one or more objects, in Blender Z-up."""
    corners = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    min_v = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
    max_v = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
    return min_v, max_v


def normalize(obj):
    """1.8 units tall, origin at the feet, centred on X, facing +Z."""
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    min_v, max_v = world_bounds([obj])
    height = max_v.z - min_v.z
    print(f'  imported bounds: {min_v} .. {max_v}  height {height:.4f}')

    scale = TARGET_HEIGHT / height
    obj.scale = (scale, scale, scale)
    bpy.ops.object.transform_apply(scale=True)

    # Re-measure after scaling, then move feet to origin and centre on X.
    min_v, max_v = world_bounds([obj])
    obj.location.z -= min_v.z
    obj.location.x -= (min_v.x + max_v.x) / 2
    bpy.ops.object.transform_apply(location=True)

    print(f'  normalized to height {TARGET_HEIGHT}, feet at z=0')
    return TARGET_HEIGHT


def assert_world_bounds(objs):
    """Gate the assembled rig on the §4.1 dimensions before export."""
    min_v, max_v = world_bounds(objs)
    height = max_v.z - min_v.z
    centre_x = (min_v.x + max_v.x) / 2
    print(f'  final world bounds: {min_v} .. {max_v}')
    print(f'  height {height:.4f}  feet z={min_v.z:.4f}  x-centre {centre_x:.4f}')

    failures = []
    if abs(height - TARGET_HEIGHT) > 0.02:
        failures.append(f'height {height:.4f} != {TARGET_HEIGHT} (tolerance 0.02)')
    if abs(min_v.z) > 0.02:
        failures.append(f'feet at z={min_v.z:.4f}, expected 0 — origin is not at the feet')
    if abs(centre_x) > 0.05:
        failures.append(f'not centred on X: midpoint {centre_x:.4f}')
    if failures:
        raise SystemExit('FAIL:\n' + '\n'.join(f'  - {f}' for f in failures))
    print('  bounds OK')


def measure_torso_half_width(obj, chest_z):
    """Torso half-width at chest height — the §4.2 arm threshold."""
    xs = [(obj.matrix_world @ v.co).x for v in obj.data.vertices
          if abs((obj.matrix_world @ v.co).z - chest_z) < 0.04]
    if not xs:
        raise SystemExit(f'FAIL: no vertices near chest height z={chest_z:.3f}')
    half = max(max(xs), -min(xs))
    print(f'  torso half-width at chest: {half:.4f}')
    return half


def separate_by_selection(obj, name):
    """Split the current vertex selection into its own object."""
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    new = [o for o in bpy.context.selected_objects if o is not obj][-1]
    new.name = name
    return new


def select_vertices(obj, predicate):
    bpy.ops.object.mode_set(mode='OBJECT')
    for v in obj.data.vertices:
        v.select = predicate(obj.matrix_world @ v.co)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.object.mode_set(mode='OBJECT')


def set_pivot(obj, location):
    """Move the origin to a JOINT CENTRE, not the bounding-box centre (§4.2).

    This is the difference between an elbow that bends and an elbow that
    swings around the middle of the forearm.
    """
    bpy.context.scene.cursor.location = location
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')


def parent_to(child, parent):
    bpy.ops.object.select_all(action='DESELECT')
    child.select_set(True)
    parent.select_set(True)
    bpy.context.view_layer.objects.active = parent
    bpy.ops.object.parent_set(type='OBJECT', keep_transform=True)


def main():
    argv = sys.argv[sys.argv.index('--') + 1:]
    in_path, out_path = argv[0], argv[1]

    clear_scene()
    body = import_glb(in_path)
    height = normalize(body)

    head_cut = HEAD_CUT_FRACTION * height
    chest_z = 0.78 * height
    torso_half = measure_torso_half_width(body, chest_z)

    # --- Head -------------------------------------------------------------
    select_vertices(body, lambda co: co.z > head_cut)
    head = separate_by_selection(body, 'Head')
    set_pivot(head, Vector((0, 0, head_cut)))   # pivot at the neck joint

    # --- Arms, both sides -------------------------------------------------
    arms = {}
    for suffix, sign in (('L', 1), ('R', -1)):
        select_vertices(
            body,
            lambda co, s=sign: s * co.x > torso_half and co.z > 0.55 * height,
        )
        arm = separate_by_selection(body, f'Arm_{suffix}')

        verts = [arm.matrix_world @ v.co for v in arm.data.vertices]
        shoulder = Vector((sign * torso_half, 0, max(v.z for v in verts)))
        tip = min(verts, key=lambda v: v.z)

        wrist = shoulder.lerp(tip, WRIST_FRACTION)
        elbow = shoulder.lerp(wrist, 0.5)   # §4.2: midpoint shoulder -> wrist
        print(f'  {suffix}: shoulder {shoulder}  elbow {elbow}  wrist {wrist}')

        # Cut the arm at the wrist, then at the elbow. Order matters: cutting
        # the elbow first would leave the hand attached to the wrong half.
        select_vertices(arm, lambda co, w=wrist: co.z < w.z)
        hand = separate_by_selection(arm, f'Hand_{suffix}')
        set_pivot(hand, wrist)

        select_vertices(arm, lambda co, e=elbow: co.z < e.z)
        forearm = separate_by_selection(arm, f'Forearm_{suffix}')
        set_pivot(forearm, elbow)

        arm.name = f'Shoulder_{suffix}'
        set_pivot(arm, shoulder)
        arms[suffix] = (arm, forearm, hand)

    # --- Torso and neck ---------------------------------------------------
    body.name = 'Torso'
    set_pivot(body, Vector((0, 0, 0.55 * height)))   # waist

    neck = bpy.data.objects.new('Neck', None)   # empty: a pure pivot
    bpy.context.collection.objects.link(neck)
    neck.location = (0, 0, head_cut)

    root = bpy.data.objects.new('Root', None)
    bpy.context.collection.objects.link(root)
    root.location = (0, 0, 0)

    # --- Assemble the §4.1 tree -------------------------------------------
    parent_to(body, root)
    parent_to(neck, body)
    parent_to(head, neck)
    for suffix, (shoulder, forearm, hand) in arms.items():
        parent_to(shoulder, body)
        parent_to(forearm, shoulder)
        parent_to(hand, forearm)

    # --- World-bounds gate ------------------------------------------------
    # This is the only place the robot's real dimensions can be read without
    # ambiguity. After set_pivot(), each part's *local* vertex data is relative
    # to its own joint, so a downstream reader of the GLB accessors sees ten
    # small boxes around ten different origins, not one robot. Blender still has
    # the world matrices, so assert here.
    assert_world_bounds([body, head, *(o for trio in arms.values() for o in trio)])

    # --- Export -----------------------------------------------------------
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='NONE',   # materials are authored in Three.js
        export_yup=True,           # Blender is Z-up, glTF is Y-up
    )
    print(f'exported {out_path}')


main()
```

> **`export_yup=True` is load-bearing.** Blender is Z-up; glTF is Y-up. The
> script works in Blender's Z-up throughout — which is why every height check
> above reads `co.z` — and the exporter converts on the way out. Getting this
> wrong produces a robot lying on its back, with every "height above 1.55"
> threshold having silently cut along the wrong axis.

- [ ] **Step 2: Run it**

```bash
cd latest/v2 && blender --background --python src/tools/split-rig.py -- \
  docs/reference/robot-gen/fused.glb docs/reference/robot-gen/split.glb
```

Expected output: the imported bounds, the normalized height, the torso half-width, per-side shoulder/elbow/wrist coordinates, then `final world bounds`, `bounds OK`, and `exported ...`.

If it exits with `FAIL:` on the bounds gate, the split has moved geometry it should not have — most likely a part was separated but never re-parented, so it kept a stale transform. Check the assembly block before touching any threshold.

- [ ] **Step 3: Verify the contract**

```bash
cd latest/v2 && node src/tools/verify-glb.mjs docs/reference/robot-gen/split.glb
```

Expected: `OK` — all ten nodes present, no duplicate names, everything parented under `Root`, under the triangle cap. Dimensions were already gated by `assert_world_bounds` in Step 2; this is the hierarchy contract Plan 2's `bindRig` consumes.

- [ ] **Step 4: Iterate the thresholds if it fails**

The §4.2 values are explicitly "starting values, tune against the real mesh". The printed measurements from Step 2 are what you tune against:

| Symptom | Adjust |
|---|---|
| Head cut through the jaw or the collar | `HEAD_CUT_FRACTION` |
| Torso fragments pulled into an arm | the `0.55 * height` floor in the arm predicate |
| Arms not separated at all | `torso_half` — the chest measurement may have caught a shoulder pad |
| Hand includes half the forearm | `WRIST_FRACTION` |

Re-run Steps 2–3 after each change. This is a real iteration loop; expect several passes.

- [ ] **Step 5: Open it in Blender and check the pivots by eye**

The verifier confirms the tree exists; it cannot confirm the joints are in the right *place*. Load `split.glb` in the Blender GUI and rotate `Forearm_L` by 40°. The elbow should hinge. If the forearm swings around its own middle, the pivot went to the bounding-box centre instead of the joint — which is exactly what §4.2 warns about.

- [ ] **Step 6: Commit**

```bash
git add latest/v2/src/tools/split-rig.py
git commit -m "feat: add Blender rigid-split script"
```

---

## Task 7: Compress and swap in

**Files:**
- Modify: `latest/v2/assets/robot.glb`

- [ ] **Step 1: Meshopt-compress**

```bash
cd latest/v2 && npx gltf-transform meshopt \
  docs/reference/robot-gen/split.glb docs/reference/robot-gen/compressed.glb
```

§4 is explicit that gltf-transform is used for compression **alone** — no texture stripping is needed, because `should_texture: false` means the GLB was never textured.

- [ ] **Step 2: Check the size**

```bash
cd latest/v2 && ls -lh docs/reference/robot-gen/compressed.glb
```

Expected: comfortably under 800 KB. If it is over, reduce `target_polycount` and re-convert rather than decimating in Blender — §4.4 sets 40,000 precisely so the budget holds without a decimation step.

- [ ] **Step 3: Verify the compressed file still satisfies the contract**

```bash
cd latest/v2 && node src/tools/verify-glb.mjs docs/reference/robot-gen/compressed.glb
```

Expected: `OK`. Meshopt should not alter the hierarchy — if it did, that is worth knowing before it ships.

- [ ] **Step 4: Swap it in**

```bash
cd latest/v2 && cp docs/reference/robot-gen/compressed.glb assets/robot.glb
node src/tools/verify-glb.mjs assets/robot.glb
```

- [ ] **Step 5: Confirm the runtime binds it without falling back**

```bash
cd latest/v2 && npx playwright test degradation -g "unsplit-mesh"
```

Expected: PASS with `window.__unsplitMode === false`. This is the single most valuable moment in the plan — the runtime Plan 2 built against boxes and spheres now drives the real robot, and the contract held.

- [ ] **Step 6: Commit**

```bash
git add latest/v2/assets/robot.glb docs/robot-generation-log.md
git commit -m "feat: replace placeholder with the generated robot"
```

---

## Task 8: Measure the face calibration constants

**Files:**
- Modify: `latest/v2/src/main.js`

Spec open item 6: `F`, `yFace` and `zFace` are measurements *of the helmet*, so they could not exist before now. The intro currently runs against the placeholder's approximations.

- [ ] **Step 1: Measure the visor**

```bash
cd latest/v2 && blender --background --python-expr "
import bpy
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete()
bpy.ops.import_scene.gltf(filepath='assets/robot.glb')
head = bpy.data.objects['Head']
verts = [head.matrix_world @ v.co for v in head.data.vertices]
# glTF import gives Y-up: y is height, z is depth, +z faces the viewer.
front = [v for v in verts if v.z > max(x.z for x in verts) - 0.03]
print('VISOR_HEIGHT', max(v.y for v in front) - min(v.y for v in front))
print('VISOR_CENTRE_Y', (max(v.y for v in front) + min(v.y for v in front)) / 2)
print('VISOR_FRONT_Z', max(v.z for v in verts))
print('HEAD_ORIGIN', tuple(head.matrix_world.translation))
"
```

- [ ] **Step 2: Derive the three constants**

- **`F`** — the world height the face plane should occupy. Take `VISOR_HEIGHT` and multiply by roughly 0.9 so the plane sits inside the visor rather than overlapping the helmet shell.
- **`yFace`** — `VISOR_CENTRE_Y` **relative to the `Head` node's origin**, since the plane is parented to `Head` and inherits its transform. Subtract the head origin's Y.
- **`zFace`** — `VISOR_FRONT_Z` minus the head origin's Z, minus about 0.005 so the plane sits just *behind* the visor surface.

- [ ] **Step 3: Write them in**

In `latest/v2/src/main.js`, replace the placeholder block:

```js
// Face calibration, measured from the generated helmet (Plan 3 Task 8).
// Resolves spec open item 6. yFace and zFace are relative to the Head node's
// origin, because the face plane is parented to Head and inherits its transform.
const FACE_CALIBRATION = { F: <measured>, yFace: <measured>, zFace: <measured> };
```

Also remove the placeholder-era branch in the `buildFace` call — the `yFace: unsplit ? FACE_CALIBRATION.yFace : 0.10` conditional existed only because the primitive head had a different origin. It becomes:

```js
  const faceParts = buildFace({
    head: rig.Head,
    texture,
    faceSize: FACE_CALIBRATION.F,
    yFace: FACE_CALIBRATION.yFace,
    zFace: FACE_CALIBRATION.zFace,
  });
```

- [ ] **Step 4: Verify the t=0 framing**

```bash
cd latest/v2 && npm run build && npm run serve
```

Load the page and freeze the first frame. The face must fill the frame exactly — it is the first thing any visitor sees, and a face that starts slightly off-centre or slightly cropped is the most visible possible flaw.

If it is off, the constants are wrong, **not the camera maths** — `faceDistance()` is unit-tested and correct. Re-measure.

- [ ] **Step 5: Commit**

```bash
git add latest/v2/src/main.js latest/v2/assets/app.js
git commit -m "fix: calibrate face constants against the real helmet"
```

---

## Task 9: Re-tune the crop and vignette against the real helmet

Plan 2 Task 9 tuned this pair against the placeholder. The visor's actual size and shape change how much of the plane is visible, so the pair needs one more pass — this is the same coupled tuning, not a new problem.

- [ ] **Step 1: Re-run the Plan 2 Task 9 judgement**

At 1440×900 and 375×812, at `t=0` and at the settled state, check in order: no amber in any corner or along the top edge; the chin not clipped; no hard letterbox edge; and now additionally — **the face sits inside the visor**, not overlapping the helmet shell.

- [ ] **Step 2: Adjust whichever is wrong**

Crop offsets live in `src/tools/crop-portrait.sh`; the radii are `VIGNETTE_INNER` / `VIGNETTE_OUTER` in `src/robot/face.js`. If a radius changes, the **CSS poster mask in `assets/styles.css` must change to match** — the unit test in `tests/unit/vignette.test.js` asserts they are the same two numbers, so it will catch a one-sided edit.

- [ ] **Step 3: Check face registration across the full lookAt range**

Spec §8 requires the face to stay inside the visor *through the neck's whole travel*, not only at rest. The face plane is parented to `Head`, so it rotates with the helmet — but a plane that is slightly too large or sitting too far forward in Z will clip through the shell at the extremes, and the extremes are where a visitor's cursor puts it.

Drive the neck to each limit and look:

```bash
cd latest/v2 && npm run serve
```

In the browser console:

```js
// Park the neck at each corner of the lookAt envelope (spec §6.4: yaw ±22, pitch ±14).
const rad = (d) => (d * Math.PI) / 180;
for (const [yaw, pitch] of [[22, 14], [-22, 14], [22, -14], [-22, -14]]) {
  window.__rig.Neck.rotation.set(rad(pitch), rad(yaw), 0);
  console.log(`yaw ${yaw} pitch ${pitch} — inspect, then continue`);
  await new Promise((r) => setTimeout(r, 2500));
}
```

This needs `window.__rig` exposed. Plan 2 already sets `window.__unsplitMode` for the degradation tests; add the rig beside it in `src/main.js`, immediately after the bind:

```js
  window.__rig = rig;   // inspection handle for calibration (Plan 3 Task 9)
```

At every one of the four corners the face must remain wholly within the visor with no edge of the plane crossing the helmet shell. If it clips, reduce `F` — **not `zFace`**. Pushing the plane deeper solves the clip at the cost of the face receding behind the visor, which changes the perceived contribution without changing the number the test gates on.

- [ ] **Step 4: Confirm the face contribution still reads correctly**

```bash
cd latest/v2 && node --test tests/unit/intro.test.js
```

Expected: PASS, including the `[0.04, 0.07]` gate. Then look at the settled frame: the face should be *barely* perceptible behind the visor. If it is obviously visible, the visor material is too transparent — adjust the **material**, never the `0.70`/`0.92` timeline values, which are gate-verified.

- [ ] **Step 5: Commit**

```bash
git add latest/v2/src/robot/face.js latest/v2/src/main.js latest/v2/assets/styles.css \
        latest/v2/src/tools/crop-portrait.sh latest/v2/assets/face-*.jpg latest/v2/assets/app.js
git commit -m "fix: re-tune crop and vignette against the real visor"
```

---

## Task 10: Author the eye planes

**Files:**
- Modify: `latest/v2/src/robot/face.js`
- Modify: `latest/v2/src/main.js`

Spec §4.3: the dot-matrix eye panels are **authored in Three.js, not generated** — which is why the brief asks for a blank visor. This makes the blink sharp, resolution-independent and, critically, *independent of generation quality*: it works identically on attempt 1 and attempt 6.

Plan 2 wired `blink.emissive` to the visor material as a stand-in, because no eye planes existed. This replaces that shortcut with the real thing.

- [ ] **Step 1: Add the eye planes**

In `latest/v2/src/robot/face.js`, add after `buildFace`:

```js
/**
 * Emissive eye planes on the visor surface.
 *
 * Authored rather than generated (spec §4.3). Scale-Y is what closes them —
 * a bone-driven eyelid would need a rig the hard-surface split deliberately
 * does not have, and an opacity fade reads as a dimmer, not a blink.
 */
export function buildEyes({ head, faceSize, yFace, zFace }) {
  const material = new THREE.MeshBasicMaterial({
    color: 0x9fd6ff,
    transparent: true,
    opacity: 0.9,
  });

  const width = faceSize * 0.26;
  const height = faceSize * 0.055;
  const gap = faceSize * 0.17;

  const eyes = [-1, 1].map((side) => {
    const eye = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material.clone());
    eye.name = `Eye_${side < 0 ? 'R' : 'L'}`;
    eye.position.set(side * gap, yFace + faceSize * 0.06, zFace + 0.012);
    eye.renderOrder = 3;   // in front of the visor
    head.add(eye);
    return eye;
  });

  return { eyes, materials: eyes.map((e) => e.material) };
}

export function setBlink({ eyes, materials }, eyeScale, emissive) {
  for (const eye of eyes) {
    // Floor the scale: a true zero collapses the plane's normals and some
    // drivers render a flickering artifact instead of nothing.
    eye.scale.y = Math.max(eyeScale, 0.001);
  }
  for (const material of materials) {
    material.opacity = 0.9 * emissive;
  }
}
```

- [ ] **Step 2: Rewire the blink**

In `latest/v2/src/main.js`, import the two new functions alongside the existing `face.js` imports:

```js
import { buildFace, buildEyes, setBlink, setFaceOpacity, pickFaceTexture } from './robot/face.js';
```

Build the eyes right after the face:

```js
  const eyeParts = buildEyes({
    head: rig.Head,
    faceSize: FACE_CALIBRATION.F,
    yFace: FACE_CALIBRATION.yFace,
    zFace: FACE_CALIBRATION.zFace,
  });
```

And replace the Plan 2 stand-in line in the render loop:

```js
    const blink = blinkState(time, blinkStart);
    faceParts.visorMaterial.emissiveIntensity = blink.emissive;
```

with:

```js
    const blink = blinkState(time, blinkStart);
    setBlink(eyeParts, blink.eyeScale, blink.emissive);
```

- [ ] **Step 3: Hide the eyes until the visor has formed**

The eyes must not be visible over the face during phase A — the visitor should see a face, then a visor forming, then eyes on it. Add just before `setBlink`:

```js
    // The eyes belong to the visor, so they appear with it.
    for (const eye of eyeParts.eyes) eye.visible = intro.visorOpacity > 0.3;
```

- [ ] **Step 4: Verify**

```bash
cd latest/v2 && npm run build && npm run serve
```

Watch a full sequence. Expected: no eyes during the face hold; eyes appearing partway through the visor formation; a crisp blink every 2–6 seconds afterwards. The blink should read as a *snap*, not a fade — 120ms is short.

- [ ] **Step 5: Commit**

```bash
git add latest/v2/src/robot/face.js latest/v2/src/main.js latest/v2/assets/app.js
git commit -m "feat: author emissive eye planes and rewire blink"
```

---

## Task 11: Capture the poster

**Files:**
- Create: `latest/v2/assets/robot-poster.webp`

The static composited final state. Plan 1 Task 19 already preloads it under `media="(prefers-reduced-motion: reduce)"` and Plan 2's fallback already references it — this task only supplies the file.

**The marquee must not be baked into it.** Every path that shows this poster also renders the marquee as live HTML on top, so a poster containing the text would double it. The marquee reveals at 3.9s and the settled frame is after that, which means it is present in any naive screenshot — it has to be hidden at capture time.

`npx playwright screenshot` has no flag for injecting CSS, so this needs a short script rather than a one-liner.

- [ ] **Step 1: Write the capture script**

Create `latest/v2/src/tools/capture-poster.mjs`:

```js
// Captures the settled composited frame with the marquee suppressed.
// Not a test — a build tool that happens to drive a browser.
import { chromium } from 'playwright';

const [, , url = 'http://127.0.0.1:4173', out = '/tmp/poster-raw.png'] = process.argv;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url);

// Hide the marquee before it reveals, so no frame of it is ever composited.
await page.addStyleTag({ content: '.marquee { visibility: hidden !important; }' });

// 3.5s sequence + 0.4s reveal + margin.
await page.waitForFunction(() => window.__introComplete === true, null, { timeout: 15000 });
await page.waitForTimeout(500);   // let the idle sway settle into a neutral frame

await page.screenshot({ path: out });
await browser.close();
console.log(`captured ${out}`);
```

> Waiting on `window.__introComplete` rather than a fixed sleep is the same
> hook Plan 2's runtime tests use. A hard `waitForTimeout(5000)` would silently
> capture a mid-dolly frame on a slow machine — and a poster is exactly the
> artifact where nobody would notice for months.

- [ ] **Step 2: Capture and encode**

```bash
cd latest/v2 && npm run serve
```

In a second shell:

```bash
cd latest/v2 && node src/tools/capture-poster.mjs
```

Expected: `captured /tmp/poster-raw.png`.

```bash
cd latest/v2 && ffmpeg -y -i /tmp/poster-raw.png -c:v libwebp -quality 82 \
  assets/robot-poster.webp
```

No crop — the script already excluded the marquee, and the poster should cover the full viewport because Plan 2's fallback stretches it to `inset: 0`.

- [ ] **Step 3: Check the size**

```bash
cd latest/v2 && ls -lh assets/robot-poster.webp
```

Expected: under 120 KB. Reduce `-quality` if not — it is a dark, low-detail image and compresses well.

- [ ] **Step 4: Verify both paths that use it**

```bash
cd latest/v2 && npx playwright test degradation -g "no WebGL"
cd latest/v2 && npx playwright test degradation -g "reduced motion"
```

Expected: both PASS, now with a real image rather than a 404.

- [ ] **Step 5: Look at the reduced-motion result**

The user chose "static composited final state" for reduced motion. Load the page with reduced motion on and confirm it looks like a *finished composition*, not a frozen mid-animation frame. The face should still be faintly present behind the visor — that is the whole point of the composited state.

- [ ] **Step 6: Commit**

```bash
git add latest/v2/assets/robot-poster.webp latest/v2/src/tools/capture-poster.mjs
git commit -m "feat: add composited poster for the no-motion paths"
```

---

## Task 12: Full acceptance sweep

Everything from all three plans, against the real asset.

- [ ] **Step 1: Unit suite**

```bash
cd latest/v2 && npm run test:unit
```

Expected: all pass, including the contribution gate and the vignette/CSS agreement check.

- [ ] **Step 2: Rebuild and check the budget**

```bash
cd latest/v2 && npm run build
```

Expected: under 150 KB gzipped.

- [ ] **Step 3: Full browser suite**

```bash
cd latest/v2 && npx playwright test
```

Expected: every spec from Plans 1, 2 and 3 passes.

- [ ] **Step 4: Total page weight**

```bash
cd latest/v2 && du -ch assets/app.js assets/styles.css assets/robot.glb \
  assets/robot-poster.webp assets/face-1024.jpg assets/fonts/*.woff2 | tail -1
```

Record the total. The GLB dominates and is uncompressed on the wire beyond Meshopt.

- [ ] **Step 5: Breakpoint sweep with the real robot**

```bash
cd latest/v2 && for size in 320,568 375,812 768,1024 1024,768 1440,900 1920,1080 844,390 926,428 1024,640 1280,720; do
  npx playwright screenshot --viewport-size="$size" --wait-for-timeout=5000 \
    http://127.0.0.1:4173 "/tmp/final-${size}.png"
done
```

Review all ten. Check specifically: the robot is fully in frame at each; it does not collide with the marquee; the chest-up framing engages below 620px of height; the short-landscape cases are legible.

- [ ] **Step 6: Close the spec's open items**

Update `docs/superpowers/specs/2026-07-28-latest-v2-robot-design.md` §9:

- **Item 6** (`F`, `yFace`, `zFace`) — replace with the measured values from Task 8.
- **Item 8** (crop ↔ vignette) — should already be closed by Plan 2 Task 9; confirm Task 9 here did not change it, and update if it did.
- **Item 1, 2, 7** — resolved by this plan's execution; record the outcomes.

Delete the `[tune]` markers on anything now resolved. A settled value that still reads as open gets re-litigated by the next person to open the file.

- [ ] **Step 7: Complete the generation log**

Fill in the Outcome section of `docs/robot-generation-log.md`: which attempt passed, total credits spent, whether `pose_mode` took effect with rigging off, and whether the visor fallback was taken. This is the record that makes a future regeneration cheap.

- [ ] **Step 8: Commit**

```bash
git add docs/superpowers/specs/2026-07-28-latest-v2-robot-design.md \
        docs/robot-generation-log.md latest/v2/assets/app.js
git commit -m "docs: close spec open items resolved by the asset build"
```

---

## Plan 3 Done — and what is still open

`latest/v2/` is complete: a single-screen page with a real WebGL humanoid, both dialogs, a working contact funnel, every degradation path tested, and all three of the spec's measurement-dependent open items closed.

**Two decisions remain, and neither belongs to any plan** — both are business calls recorded in `CLAUDE.md` under Cautions:

1. **`static.yml` publishes the entire repository** (`path: '.'`, no build step). `docs/` contains pricing and strategy. Before launch: either move the site into a subdirectory and point `path:` at it, or accept publication and scrub `docs/`. Note that this plan adds `docs/robot-generation-log.md`, which is harmless, but `docs/reference/robot-gen/` stays gitignored and must remain so.

2. **Promoting v2 to root replaces the live v0 site**, which is what Meta is currently verifying against. Recent history shows a deliberate revert *back* to v0 for exactly that reason. Promotion requires carrying over and re-verifying the legal string, the Meta domain-verification meta tag, the canonical URL and the favicon — Plan 1 Task 6 built all four into v2 and asserted no absolute asset paths exist, so the folder is root-ready. The promotion itself is still the user's call.
