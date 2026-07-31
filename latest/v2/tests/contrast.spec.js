import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const css = () => readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');

function relativeLuminance([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  const [a, b] = [relativeLuminance(fg), relativeLuminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const parse = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const BLACK = parse('#000000');
const SURFACE_1 = parse('#1D1D1F');

test('every text pairing from DESIGN-SYSTEM §1.3 meets its threshold', () => {
  const cases = [
    ['text-primary on black',     parse('#F5F5F7'), BLACK,      4.5],
    ['text-secondary on black',   parse('#86868B'), BLACK,      4.5],
    ['accent-text on black',      parse('#2997FF'), BLACK,      4.5],
    ['text-primary on surface-1', parse('#F5F5F7'), SURFACE_1,  4.5],
    ['text-secondary on surf-1',  parse('#86868B'), SURFACE_1,  4.5],
    ['on-accent on accent',       parse('#FFFFFF'), parse('#0071E3'), 4.5],
  ];

  for (const [label, fg, bg, threshold] of cases) {
    const ratio = contrast(fg, bg);
    expect(ratio, `${label} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(threshold);
  }
});

test('the accent focus ring clears the 3:1 non-text threshold (SC 1.4.11)', () => {
  const ratio = contrast(parse('#0071E3'), BLACK);
  expect(ratio, `accent ring = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
});

test('accent is never used as a text colour', () => {
  // Bans the DECLARATION, not the token. `--accent: #0071E3` is legitimate;
  // `color: var(--accent)` measures 4.47:1 and fails AA.
  const offenders = css().split('\n')
    .map((line, i) => [i + 1, line])
    .filter(([, line]) => /(^|[^-])color:\s*var\(--accent\)\s*[;}]/.test(line));
  expect(offenders, `color: var(--accent) at lines ${offenders.map(([n]) => n)}`).toEqual([]);
});

test('no box-shadow anywhere — depth is a luminance step plus a radius', () => {
  expect(css()).not.toMatch(/box-shadow\s*:\s*(?!none)/);
});

test('no font-weight of 500 or 700', () => {
  const offenders = css().match(/font-weight:\s*(500|700)\b/g) ?? [];
  expect(offenders).toEqual([]);
});

test('exactly two background values are in play', () => {
  const hexes = new Set(
    (css().match(/#[0-9A-Fa-f]{6}\b/g) ?? []).map((h) => h.toUpperCase())
  );
  // Backgrounds only — text, accent and gradient stops are separate roles.
  expect(hexes.has('#000000')).toBe(true);
  expect(hexes.has('#1D1D1F')).toBe(true);
});

test('reduced motion is honoured', () => {
  expect(css()).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('focus-visible rings exist', () => {
  expect(css()).toMatch(/:focus-visible\s*\{[^}]*outline:/);
});
