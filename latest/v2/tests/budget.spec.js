import { test, expect } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const gzipped = (rel) =>
  gzipSync(readFileSync(new URL(rel, import.meta.url))).length;

test('styles.css is under the 5 KB gzipped target (spec §3.3)', () => {
  const size = gzipped('../assets/styles.css');
  expect(size, `styles.css = ${(size / 1024).toFixed(1)} KB gzipped`)
    .toBeLessThan(5 * 1024);
});

test('page JavaScript is under the 150 KB gzipped budget', () => {
  const size = gzipped('../assets/dialogs.js');
  expect(size, `dialogs.js = ${(size / 1024).toFixed(1)} KB gzipped`)
    .toBeLessThan(150 * 1024);
});

test('subset fonts stay under 60 KB gzipped combined', () => {
  const total = gzipped('../assets/fonts/geist-sans.woff2')
              + gzipped('../assets/fonts/geist-mono.woff2');
  expect(total, `fonts = ${(total / 1024).toFixed(1)} KB`).toBeLessThan(60 * 1024);
});
