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

// Gates verify the SHIPPED stylesheet, not this file's idea of it: every
// token is parsed out of styles.css, so a drifted value fails the ratio
// check instead of leaving these assertions green against stale constants.
const token = (name) => {
  const m = css().match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`token ${name} not found in styles.css`);
  return parse(m[1]);
};

test('every text pairing from DESIGN-SYSTEM §1.3 meets its threshold', () => {
  const surface0 = token('--surface-0');
  const surface1 = token('--surface-1');
  const cases = [
    ['text-primary on surface-0',   token('--text-primary'),   surface0, 4.5],
    ['text-secondary on surface-0', token('--text-secondary'), surface0, 4.5],
    ['accent-text on surface-0',    token('--accent-text'),    surface0, 4.5],
    ['text-primary on surface-1',   token('--text-primary'),   surface1, 4.5],
    ['text-secondary on surface-1', token('--text-secondary'), surface1, 4.5],
    ['on-accent on accent',         token('--on-accent'),      token('--accent'), 4.5],
  ];

  for (const [label, fg, bg, threshold] of cases) {
    const ratio = contrast(fg, bg);
    expect(ratio, `${label} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(threshold);
  }
});

test('the accent focus ring clears the 3:1 non-text threshold (SC 1.4.11)', () => {
  const ratio = contrast(token('--accent'), token('--surface-0'));
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

test('exactly two surface tokens exist, and they are the two approved values', () => {
  const surfaces = [...css().matchAll(/--surface-(\d+):\s*(#[0-9A-Fa-f]{6})/g)]
    .map((m) => [m[1], m[2].toUpperCase()]);
  // Exclusivity, not just presence: a --surface-2 is the ramp CLAUDE.md bans.
  expect(surfaces.map(([n]) => n).sort()).toEqual(['0', '1']);
  expect(Object.fromEntries(surfaces)).toEqual({ 0: '#000000', 1: '#1D1D1F' });
});

test('reduced motion is honoured', () => {
  expect(css()).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('focus-visible rings exist', () => {
  expect(css()).toMatch(/:focus-visible\s*\{[^}]*outline:/);
});
