import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindRig, REQUIRED_NODES, RigError, DuplicateNodeError } from '../../src/robot/rig.js';

// A minimal stand-in for an Object3D tree — bindRig must not need Three.js.
const node = (name, children = []) => ({
  name,
  children,
  traverse(fn) { fn(this); this.children.forEach((c) => c.traverse(fn)); },
});

const completeTree = () => node('Root', [
  node('Torso', [
    node('Neck', [node('Head')]),
    node('Shoulder_L', [node('Forearm_L', [node('Hand_L')])]),
    node('Shoulder_R', [node('Forearm_R', [node('Hand_R')])]),
  ]),
]);

test('binds all ten contract nodes by name', () => {
  const rig = bindRig(completeTree());
  for (const name of REQUIRED_NODES) {
    assert.equal(rig[name].name, name, `${name} must be bound`);
  }
});

test('throws a RigError naming exactly which nodes are missing', () => {
  const tree = node('Root', [node('Torso', [node('Neck', [node('Head')])])]);

  assert.throws(() => bindRig(tree), (err) => {
    assert.ok(err instanceof RigError, 'must be a RigError so §7 can catch it specifically');
    assert.deepEqual(err.missing.sort(), [
      'Forearm_L', 'Forearm_R', 'Hand_L', 'Hand_R', 'Shoulder_L', 'Shoulder_R',
    ]);
    assert.match(err.message, /Shoulder_L/);
    return true;
  });
});

test('a duplicate node name is an error, not a silent last-wins', () => {
  const tree = completeTree();
  tree.children[0].children.push(node('Head'));
  assert.throws(() => bindRig(tree), (err) => {
    assert.ok(err instanceof DuplicateNodeError, 'must be the typed error');
    assert.deepEqual(err.duplicates, ['Head']);
    assert.match(err.message, /duplicate/i);
    return true;
  });
});
