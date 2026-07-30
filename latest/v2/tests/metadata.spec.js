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
