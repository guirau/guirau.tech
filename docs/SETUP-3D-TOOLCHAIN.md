# Setup: 3D toolchain for `guirau.tech` → `latest/v2`

**Audience:** a fresh Claude Code session with no prior context.
**Goal:** leave this machine able to (a) generate 3D assets with Higgsfield,
(b) post-process them in headless Blender, (c) compress them for the web.

You are **only** doing setup and fact-gathering. Do **not** generate any
assets, write any website code, or modify anything under `latest/`.
Finish by reporting back in the format given in Part 5.

---

## Context (read first)

The project is building a page at `latest/v2/` whose centrepiece is a
photoreal humanoid robot rendered in Three.js, with four animated behaviours:
a camera dolly-out on load, blinking eyes, an idle arm sway, and head/torso
cursor-following.

The planned pipeline is:

```
Higgsfield: text -> 4 reference views -> multi_image_to_3d -> GLB (one fused mesh)
        |
Blender (headless, scripted): split the fused mesh into rigid parts
        (head, upper arms, forearms, hands), set pivots at the joints,
        parent into a hierarchy, re-export GLB
        |
gltf-transform: compress geometry (Meshopt), strip baked textures
        |
Three.js: author materials, drive the four behaviours by rotating named nodes
```

Blender is needed because the robot is **hard-surface mechanical**. Its joints
must pivot rigidly like hinges. A conventional skinned/auto-rigged mesh would
stretch the surface at the elbow like skin, which looks wrong on a glossy
hard shell. So the requirement is *separate rigid parts in a parent-child
tree*, not a skeleton.

---

## Environment already verified

Do not re-check these; they are confirmed present:

| Tool | Version |
|---|---|
| macOS | 26.5.2, arm64 (Apple Silicon) |
| Homebrew | 6.0.12 |
| Node | v25.2.1 |
| npm | 11.6.2 |
| Python | 3.11.13 (system; Blender bundles its own) |
| pipx | present at `/opt/homebrew/bin/pipx` |

Confirmed **absent**, and therefore your job to install: Blender, the
Higgsfield CLI, and glTF compression tooling.

---

## Part 1 — Blender

### 1.1 Install

```bash
brew install --cask blender
```

If Homebrew reports the cask is unavailable or the download fails, fall back
to the official build from <https://www.blender.org/download/> (pick the
**macOS Apple Silicon** build) and drag it to `/Applications`.

### 1.2 Confirm the executable path

Homebrew installs the app bundle, and whether it also puts `blender` on your
`PATH` varies. The reliable path to the real binary is:

```bash
/Applications/Blender.app/Contents/MacOS/Blender --version
```

Expect output beginning with `Blender 4.x` or `5.x`. **Record the exact
version** — you will report it back.

### 1.3 Put it on PATH

Only if `command -v blender` returns nothing:

```bash
ln -sf /Applications/Blender.app/Contents/MacOS/Blender /opt/homebrew/bin/blender
```

Then confirm:

```bash
blender --version
```

### 1.4 Verify headless scripting works

This is the capability the project actually depends on — Blender running with
no GUI, driven by a Python script. Create a throwaway test file **in a temp
directory, not in the repo**:

```bash
cat > /tmp/bl_check.py <<'EOF'
import bpy, addon_utils
print("BLENDER_OK", bpy.app.version_string)
names = [m.__name__ for m in addon_utils.modules()]
print("GLTF_ADDON_PRESENT", "io_scene_gltf2" in names)
print("GLTF_ENABLED", addon_utils.check("io_scene_gltf2"))
EOF

blender --background --python /tmp/bl_check.py 2>&1 | grep -E "BLENDER_OK|GLTF_"
```

You need **all three** to look right:

- `BLENDER_OK <version>` — the Python API is reachable
- `GLTF_ADDON_PRESENT True` — the glTF/GLB importer-exporter ships with Blender
- `GLTF_ENABLED (True, True)` — it is enabled by default

If `GLTF_ENABLED` shows `(False, False)`, that is fine and expected on some
builds; it just needs enabling inside the script at runtime. Note it and
move on — do not try to fix it.

### 1.5 First launch may be blocked by Gatekeeper

If macOS refuses to open Blender because it is from an unidentified
developer, open it once from Finder with right-click → Open, or run:

```bash
xattr -dr com.apple.quarantine /Applications/Blender.app
```

Note in your report whether this was needed.

---

## Part 2 — Higgsfield CLI

The project will drive this through Bash. The hosted MCP server at
`https://mcp.higgsfield.ai/mcp` exists, but Higgsfield's own documentation
says that for Claude Code the CLI is the better option — so install the CLI.
Do not set up the MCP server.

### 2.1 Install

```bash
npm install -g @higgsfield/cli
```

The postinstall step downloads a prebuilt binary for macOS arm64. The
executable is named `higgsfield`.

```bash
higgsfield --version
```

### 2.2 Authenticate — this step needs the human

```bash
higgsfield auth login
```

This opens a browser for sign-in. **You cannot complete this yourself.** Ask
the user to finish the browser flow, then wait for them to confirm before
continuing.

Two things the user needs to know:

- Higgsfield is **paid and credit-metered**. Generating 3D assets consumes
  credits and image-to-3D typically takes several attempts to get a usable
  result. Budget for roughly **3–10 generations**, not one.
- Auth tokens are **short-lived**. If commands later fail with an auth error,
  re-run `higgsfield auth login`.

### 2.3 Verify the session

```bash
higgsfield generate create --help
```

This should list flags without an authentication error.

---

## Part 3 — glTF compression tooling

The exported GLB gets compressed before shipping, and its baked textures get
stripped (the web build authors its own materials in Three.js, so generated
colour maps are dead weight).

```bash
npm install -g @gltf-transform/cli
gltf-transform --version
```

---

## Part 4 — Capture model specifications (do not skip)

This is the most valuable part of the task. The project's design still has
open questions that only the live model specs can answer. Run each of these
and **save the full raw JSON output** to
`docs/higgsfield-model-specs.json` in the repo:

```bash
higgsfield model get multi_image_to_3d --json
higgsfield model get image_to_3d --json
higgsfield model get 3d_rigging --json
```

If `higgsfield model get` is not a valid subcommand, discover the correct one
with `higgsfield --help` and `higgsfield model --help`, and use that instead.

Combine them into a single JSON file keyed by model name, e.g.:

```json
{
  "multi_image_to_3d": { ... },
  "image_to_3d": { ... },
  "3d_rigging": { ... }
}
```

While reading those specs, answer these specific questions in your report.
They directly determine whether the Blender step is still needed:

1. **Does `multi_image_to_3d` output a rigged model or a single static
   mesh?** How many input images does it accept, and in what formats?
2. **What does `3d_rigging` actually do?** Does it take a GLB as input? Does
   it produce a *skinned* rig (bones with soft vertex weights) or *separated
   rigid parts*? This distinction is the whole reason Blender is in the
   pipeline — if `3d_rigging` yields rigid parts, the Blender step may be
   reducible.
3. **What output formats are available** (GLB, GLTF, FBX, OBJ)?
4. **Are there polycount, texture-resolution, or file-size limits?**
5. **What does each of these cost in credits?**

Also fetch and skim `MODELS.md` from the CLI repository for per-model
parameters, since the README does not include them:
<https://github.com/higgsfield-ai/cli>

---

## Part 5 — Report back

Reply with exactly this, filled in. Keep it terse.

```
BLENDER
  installed:        yes / no
  version:
  path:
  on PATH:          yes / no  (symlink created? yes / no)
  headless python:  ok / failed
  gltf addon:       present? enabled?
  gatekeeper fix needed: yes / no

HIGGSFIELD CLI
  installed:        yes / no
  version:
  authenticated:    yes / no
  plan / credits:   (if visible)

GLTF-TRANSFORM
  installed:        yes / no
  version:

MODEL SPECS
  saved to docs/higgsfield-model-specs.json: yes / no
  Q1 multi_image_to_3d rigged or static:
  Q2 3d_rigging skinned or rigid parts:
  Q3 output formats:
  Q4 limits:
  Q5 credit costs:

PROBLEMS
  (anything that failed, was ambiguous, or needs a decision)
```

Do not commit anything except `docs/higgsfield-model-specs.json`. Leave the
rest of the working tree untouched.
