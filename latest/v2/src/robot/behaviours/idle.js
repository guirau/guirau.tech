// Idle sway. Pure: (time) -> pose deltas.
//
// The three frequencies (spec §6.3) have pairwise-coprime numerators over a
// common denominator of 100, so the combined motion's exact period is 100
// seconds. That is far beyond what reads as a loop; what matters is that no
// SHORT common period exists, and none does: the pairwise ratios 23:31,
// 23:17 and 31:17 do not reduce.
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
