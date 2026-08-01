import { test } from 'node:test';
import assert from 'node:assert/strict';
import { idlePose, IDLE_FREQUENCIES } from '../../src/robot/behaviours/idle.js';

test('uses the three specified incommensurate frequencies', () => {
  assert.deepEqual(IDLE_FREQUENCIES, { torso: 0.23, shoulders: 0.31, head: 0.17 });
});

test('is bounded — sway never becomes a lurch', () => {
  for (let t = 0; t < 600; t += 0.05) {
    const pose = idlePose(t);
    for (const [node, delta] of Object.entries(pose)) {
      for (const value of Object.values(delta)) {
        assert.ok(Math.abs(value) <= 0.05,
          `${node} exceeded the sway envelope at t=${t.toFixed(2)}: ${value}`);
      }
    }
  }
});

test('is deterministic — the same time gives the same pose', () => {
  assert.deepEqual(idlePose(12.345), idlePose(12.345));
});

test('does not repeat within one 95-second window', () => {
  // The exact common period is 100 s (pairwise-coprime numerators over 100),
  // so inside one period no two sampled poses may coincide. The window stops
  // short of t=100 deliberately: at the true period the pose recurs by
  // construction, and only float rounding hides it.
  const at = (t) => JSON.stringify(idlePose(t));
  const seen = new Set();
  let collisions = 0;
  for (let t = 0; t < 95; t += 0.25) {
    const key = at(t);
    if (seen.has(key)) collisions++;
    seen.add(key);
  }
  assert.equal(collisions, 0, 'idle motion repeated inside one period');
});

test('touches only torso, shoulders and head — never the hands or the root', () => {
  const nodes = Object.keys(idlePose(3.2)).sort();
  assert.deepEqual(nodes, ['Head', 'Shoulder_L', 'Shoulder_R', 'Torso']);
});

test('shoulders mirror — the arms breathe together, not in parallel', () => {
  const pose = idlePose(7.7);
  assert.equal(pose.Shoulder_L.rz, -pose.Shoulder_R.rz);
});
