// Idle sway. Pure: (time) -> pose deltas.
//
// The three frequencies are deliberately incommensurate (spec §6.3). Their
// ratios do not reduce to small integers, so the combined motion has no short
// common period and never reads as a loop.
export const IDLE_FREQUENCIES = Object.freeze({
  torso: 0.23,
  shoulders: 0.31,
  head: 0.17,
});

const AMPLITUDE = Object.freeze({
  torso: 0.018,
  shoulders: 0.022,
  head: 0.012,
});

const wave = (t, hz) => Math.sin(2 * Math.PI * hz * t);

export function idlePose(time) {
  const torso     = wave(time, IDLE_FREQUENCIES.torso);
  const shoulders = wave(time, IDLE_FREQUENCIES.shoulders);
  const head      = wave(time, IDLE_FREQUENCIES.head);

  return {
    Torso:      { ry: AMPLITUDE.torso * torso, rz: AMPLITUDE.torso * 0.4 * torso },
    // Mirrored: the arms breathe outward together rather than swinging in parallel.
    Shoulder_L: { rz: AMPLITUDE.shoulders * shoulders },
    Shoulder_R: { rz: -AMPLITUDE.shoulders * shoulders },
    Head:       { rx: AMPLITUDE.head * head },
  };
}
