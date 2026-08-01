import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faceDistance, chooseEndFraming, frustumBias } from '../../src/robot/camera.js';

const FOV = 35;
const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !== ${b}`);

test('faceDistance frames a subject of height F exactly at the given fov', () => {
  // At the returned distance the visible height must equal F on a square canvas.
  const F = 0.30;
  const d = faceDistance({ subjectSize: F, fov: FOV, aspect: 1 });
  const visibleH = 2 * Math.tan((FOV * Math.PI / 180) / 2) * d;
  close(visibleH, F);
});

test('faceDistance pulls back on a portrait canvas, matching object-fit: contain', () => {
  const F = 0.30;
  const square = faceDistance({ subjectSize: F, fov: FOV, aspect: 1 });
  const portrait = faceDistance({ subjectSize: F, fov: FOV, aspect: 0.5 });

  // aspect < 1 means the canvas is narrower than tall; the subject must fit
  // WIDTH-wise too, so the camera retreats. Math.min(aspect,1) is exactly
  // `object-fit: contain` on a square image.
  assert.ok(portrait > square, 'portrait must be further back');
  close(portrait, square / 0.5);
});

test('faceDistance ignores extra width on a landscape canvas', () => {
  const F = 0.30;
  const square = faceDistance({ subjectSize: F, fov: FOV, aspect: 1 });
  const wide = faceDistance({ subjectSize: F, fov: FOV, aspect: 2.5 });
  close(wide, square, 1e-9);
});

test('end framing switches to chest-up below 620px of viewport height', () => {
  assert.equal(chooseEndFraming(619).name, 'chest-up');
  assert.equal(chooseEndFraming(620).name, 'full-body');
  assert.equal(chooseEndFraming(1080).name, 'full-body');

  assert.deepEqual(chooseEndFraming(1080).position, [0, 1.00, 3.50]);
  assert.deepEqual(chooseEndFraming(1080).lookAt,   [0, 1.00, 0]);
  assert.deepEqual(chooseEndFraming(500).position,  [0, 1.45, 1.50]);
  assert.deepEqual(chooseEndFraming(500).lookAt,    [0, 1.45, 0]);
});

test('frustumBias converts fractions into world units at the current distance', () => {
  const bias = frustumBias({ kx: 0.12, ky: 0.10, fov: FOV, distance: 3.5, canvasW: 1440, canvasH: 900 });
  const visibleH = 2 * Math.tan((FOV * Math.PI / 180) / 2) * 3.5;
  const visibleW = visibleH * (1440 / 900);

  close(bias.x, -0.12 * visibleW);
  close(bias.y, -0.10 * visibleH);
});

test('frustumBias scales with distance — the same k means the same screen fraction', () => {
  const args = { kx: 0.12, ky: 0.10, fov: FOV, canvasW: 1440, canvasH: 900 };
  const near = frustumBias({ ...args, distance: 1 });
  const far  = frustumBias({ ...args, distance: 4 });
  close(far.x / near.x, 4);
});
