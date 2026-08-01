// Framing maths. Pure — no Three.js, no DOM. Everything here is testable in Node.

const rad = (deg) => (deg * Math.PI) / 180;

/**
 * Distance at which a subject of `subjectSize` world units exactly fills the frame.
 *
 * Math.min(aspect, 1) is the whole trick: on a canvas narrower than it is tall,
 * fitting by height alone would crop the sides, so the camera retreats until the
 * subject fits by width too. That is precisely `object-fit: contain` on a square
 * image, which is what the face plane is.
 */
export function faceDistance({ subjectSize, fov, aspect }) {
  return subjectSize / (2 * Math.tan(rad(fov) / 2) * Math.min(aspect, 1));
}

const FULL_BODY = Object.freeze({
  name: 'full-body',
  position: Object.freeze([0, 1.00, 3.50]),
  lookAt: Object.freeze([0, 1.00, 0]),
});
const CHEST_UP = Object.freeze({
  name: 'chest-up',
  position: Object.freeze([0, 1.45, 1.50]),
  lookAt: Object.freeze([0, 1.45, 0]),
});

/** Short viewports cannot fit a 1.8-unit figure without shrinking it to nothing. */
export const SHORT_VIEWPORT_PX = 620;

export function chooseEndFraming(viewportHeight) {
  return viewportHeight < SHORT_VIEWPORT_PX ? CHEST_UP : FULL_BODY;
}

/**
 * Off-centre bias in WORLD units.
 *
 * kx/ky are fractions of the visible frustum, not fixed offsets — so the robot
 * sits at the same fraction of the screen regardless of camera distance or
 * canvas size. A fixed world offset would drift across the dolly.
 */
export function frustumBias({ kx, ky, fov, distance, canvasW, canvasH }) {
  const visibleH = 2 * Math.tan(rad(fov) / 2) * distance;
  const visibleW = visibleH * (canvasW / canvasH);
  return { x: -kx * visibleW, y: -ky * visibleH };
}

/** Breakpoint-matched bias fractions. Values tuned in Plan 2 Task 12. */
export function biasFractions(viewportWidth) {
  return viewportWidth >= 900 ? { kx: 0.12, ky: 0.10 } : { kx: 0, ky: 0.06 };
}
