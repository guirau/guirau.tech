// The ONLY writer to the scene graph.
//
// Behaviours are pure: each returns a plain object of per-node rotation deltas
// and touches nothing. This module sums them and writes once per frame. That is
// what stops idle sway and cursor-follow from fighting over head.rotation.y —
// they are not competing writers, they are two addends.

const AXES = { rx: 'x', ry: 'y', rz: 'z' };
const AXIS_KEYS = Object.keys(AXES);
const AXIS_ENTRIES = Object.entries(AXES);

export const EMPTY_POSE = Object.freeze({});

/** Sum any number of pose fragments. Inputs are never mutated. */
export function composePose(fragments) {
  const out = {};

  for (const fragment of fragments) {
    if (!fragment) continue;
    for (const [nodeName, delta] of Object.entries(fragment)) {
      const target = (out[nodeName] ??= { rx: 0, ry: 0, rz: 0 });
      for (const key of AXIS_KEYS) {
        if (delta[key] !== undefined) target[key] += delta[key];
      }
    }
  }

  return out;
}

/**
 * Snapshot the rig's rest rotations. Call once, straight after bindRig, before
 * any behaviour has run — this is the pose deltas are measured *from*.
 */
export function captureRest(rig) {
  const rest = {};
  for (const [nodeName, node] of Object.entries(rig)) {
    const { x, y, z } = node.rotation;
    rest[nodeName] = Object.freeze({ x, y, z });
  }
  return Object.freeze(rest);
}

/**
 * Write a composed pose onto the rig, as an offset from the rest pose.
 *
 * Every axis of every addressed node is written, including the ones the pose
 * left at zero — otherwise a behaviour that stops contributing (blink ending,
 * lookAt disabled on touch) leaves its last rotation frozen into the model.
 * Zero means "back to rest", which is why `rest` is added rather than assumed
 * to be identity: the A-pose is a non-zero shoulder rotation.
 *
 * Missing nodes are skipped rather than thrown on, because unsplit-mesh mode
 * (§7) runs the same behaviours against a rig with only Root bound.
 */
export function applyPose(rig, pose, rest = EMPTY_POSE) {
  for (const [nodeName, delta] of Object.entries(pose)) {
    const node = rig[nodeName];
    if (!node) continue;
    const base = rest[nodeName];
    for (const [key, axis] of AXIS_ENTRIES) {
      node.rotation[axis] = (base?.[axis] ?? 0) + (delta[key] ?? 0);
    }
  }
}
