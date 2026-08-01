// Binds the named nodes that the Blender split (spec §4.2) produces.
// Duck-typed on `traverse` and `name`, so it works with a real Object3D and
// with a plain test double — no Three.js import, no WebGL needed to test it.

export const REQUIRED_NODES = Object.freeze([
  'Root', 'Torso', 'Neck', 'Head',
  'Shoulder_L', 'Forearm_L', 'Hand_L',
  'Shoulder_R', 'Forearm_R', 'Hand_R',
]);

/**
 * Thrown when the loaded model does not satisfy the §4.1 contract.
 * Spec §7 catches this specifically: it is the switch into unsplit-mesh mode,
 * where the whole robot yaws as one piece instead of articulating.
 */
export class RigError extends Error {
  constructor(missing) {
    super(`Rig contract not satisfied — missing node(s): ${missing.join(', ')}`);
    this.name = 'RigError';
    this.missing = missing;
  }
}

/** Thrown when the same contract name appears twice — a split that went wrong. */
export class DuplicateNodeError extends Error {
  constructor(names) {
    super(`Rig has duplicate node name(s): ${names.join(', ')}`);
    this.name = 'DuplicateNodeError';
    this.duplicates = names;
  }
}

export function bindRig(root) {
  const found = new Map();
  const duplicates = new Set();

  root.traverse((node) => {
    if (!REQUIRED_NODES.includes(node.name)) return;
    if (found.has(node.name)) duplicates.add(node.name);
    else found.set(node.name, node);
  });

  // Duplicates first: a last-wins bind would silently animate the wrong mesh,
  // which is far harder to diagnose than an outright failure.
  if (duplicates.size) throw new DuplicateNodeError([...duplicates]);

  const missing = REQUIRED_NODES.filter((n) => !found.has(n));
  if (missing.length) throw new RigError(missing);

  return Object.freeze(Object.fromEntries(found));
}
