import { test } from 'node:test';
import assert from 'node:assert/strict';
import { composePose, applyPose, captureRest, EMPTY_POSE } from '../../src/robot/pose.js';

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !== ${b}`);

test('composePose sums deltas from every behaviour rather than letting one win', () => {
  const idle    = { Head: { ry: 0.05 }, Torso: { ry: 0.02 } };
  const lookAt  = { Head: { ry: 0.20, rx: -0.10 }, Torso: { ry: -0.06 } };

  const pose = composePose([idle, lookAt]);
  close(pose.Head.ry, 0.25);
  close(pose.Head.rx, -0.10);
  close(pose.Torso.ry, -0.04);
});

test('composePose ignores null contributions from disabled behaviours', () => {
  const pose = composePose([{ Head: { ry: 0.1 } }, null, undefined, {}]);
  close(pose.Head.ry, 0.1);
});

test('composePose never mutates its inputs', () => {
  const idle = { Head: { ry: 0.05 } };
  composePose([idle, { Head: { ry: 0.5 } }]);
  close(idle.Head.ry, 0.05);
});

test('applyPose writes rotations onto the bound rig', () => {
  const makeNode = () => ({ rotation: { x: 0, y: 0, z: 0 } });
  const rig = { Head: makeNode(), Torso: makeNode() };

  applyPose(rig, { Head: { ry: 0.3, rx: -0.1 }, Torso: { ry: -0.09 } });

  close(rig.Head.rotation.y, 0.3);
  close(rig.Head.rotation.x, -0.1);
  close(rig.Torso.rotation.y, -0.09);
});

test('applyPose resets unaddressed axes so a stopped behaviour does not stick', () => {
  const rig = { Head: { rotation: { x: 0.9, y: 0.9, z: 0.9 } } };
  applyPose(rig, { Head: { ry: 0.1 } });

  close(rig.Head.rotation.y, 0.1);
  close(rig.Head.rotation.x, 0, 1e-12);
  close(rig.Head.rotation.z, 0, 1e-12);
});

test('applyPose skips nodes the rig does not have — unsplit-mesh mode is not a crash', () => {
  const rig = { Head: { rotation: { x: 0, y: 0, z: 0 } } };
  assert.doesNotThrow(() => applyPose(rig, { Head: { ry: 0.1 }, Shoulder_L: { rz: 0.4 } }));
});

test('captureRest snapshots the rest rotations of every bound node', () => {
  const rig = {
    Shoulder_L: { rotation: { x: 0, y: 0, z: -0.28 } },
    Head:       { rotation: { x: 0, y: 0, z: 0 } },
  };
  const rest = captureRest(rig);

  close(rest.Shoulder_L.z, -0.28);
  close(rest.Head.z, 0, 1e-12);
});

test('applyPose returns a node to its REST rotation, not to zero', () => {
  // The A-pose lives in the rig: the placeholder authors Shoulder_L at z=-0.28,
  // and a regenerated GLB may ship its own non-identity rest rotations. Writing
  // the raw delta would drop the arms to the model's sides on the first frame.
  const rig = { Shoulder_L: { rotation: { x: 0, y: 0, z: -0.28 } } };
  const rest = captureRest(rig);

  applyPose(rig, { Shoulder_L: { rz: 0.022 } }, rest);
  close(rig.Shoulder_L.rotation.z, -0.28 + 0.022);

  // And when the behaviour stops contributing, it settles back to the A-pose.
  applyPose(rig, { Shoulder_L: {} }, rest);
  close(rig.Shoulder_L.rotation.z, -0.28);
});

test('EMPTY_POSE is frozen so no caller can accumulate into the shared default', () => {
  assert.ok(Object.isFrozen(EMPTY_POSE));
});
