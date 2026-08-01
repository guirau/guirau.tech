import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('meta domain-verification tag is present', async ({ page }) => {
  await page.goto('/');
  const tag = page.locator('meta[name="facebook-domain-verification"]');
  await expect(tag).toHaveAttribute('content', '9cpdahk10rj5hgf8tzbfx2m7qffuxb');
});

test('canonical URL points at the production domain', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]'))
    .toHaveAttribute('href', 'https://guirau.tech/');
});

test('JSON-LD carries the legal name, url and email', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw);
  expect(data['@type']).toBe('ProfessionalService');
  expect(data.legalName).toBe('Alejandro Guirau - Software Consulting');
  expect(data.url).toBe('https://guirau.tech/');
  expect(data.email).toBe('alejandro.guirau@gmail.com');
});

test('every asset path is relative, so the folder can be promoted to root', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const absolute = [...html.matchAll(/(?:href|src)="(\/[^/][^"]*)"/g)].map((m) => m[1]);
  expect(absolute, `absolute paths would break root promotion: ${absolute}`).toEqual([]);
});

test('preloads branch on prefers-reduced-motion', async ({ page }) => {
  await page.goto('/');
  const preloads = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="preload"]')].map((l) => ({
      href: l.getAttribute('href'),
      media: l.getAttribute('media'),
      priority: l.getAttribute('fetchpriority'),
    }))
  );

  const face = preloads.find((p) => p.href === 'assets/face-1024.jpg');
  expect(face, 'face poster must be preloaded').toBeTruthy();
  expect(face.media).toBe('(prefers-reduced-motion: no-preference)');
  expect(face.priority).toBe('high');

  const poster = preloads.find((p) => p.href === 'assets/robot-poster.webp');
  expect(poster, 'reduced-motion poster must be preloaded').toBeTruthy();
  expect(poster.media).toBe('(prefers-reduced-motion: reduce)');
});

test('nothing else is preloaded — the GLB and bundle would compete with LCP', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="preload"]')].map((l) => l.getAttribute('href'))
  );
  expect(hrefs.sort()).toEqual(['assets/face-1024.jpg', 'assets/robot-poster.webp']);
});
