import { test, expect } from '@playwright/test';

test('external links open safely in a new tab', async ({ page }) => {
  await page.goto('/');
  for (const name of ['LinkedIn', 'GitHub']) {
    const link = page.getByRole('link', { name });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
    await expect(link).toHaveAttribute('href', /^https:\/\//);
  }
});

test('GitHub points at the confirmed profile', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'GitHub' }))
    .toHaveAttribute('href', 'https://github.com/guirau');
});

test('Contact is the only accent-filled control on the page', async ({ page }) => {
  await page.goto('/');
  const filled = await page.evaluate(() => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim().toLowerCase();
    const toRgb = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
    };
    const target = toRgb(accent);
    return [...document.querySelectorAll('button, a')]
      .filter((el) => getComputedStyle(el).backgroundColor === target)
      .map((el) => el.textContent.trim());
  });
  expect(filled).toEqual(['Contact']);
});

test('every interactive target meets the 44px minimum', async ({ page }) => {
  await page.goto('/');
  const targets = page.locator('.marquee a, .marquee button');
  for (let i = 0; i < await targets.count(); i++) {
    const box = await targets.nth(i).boundingBox();
    const label = await targets.nth(i).textContent();
    expect(box.height, `"${label.trim()}" height`).toBeGreaterThanOrEqual(44);
    expect(box.width, `"${label.trim()}" width`).toBeGreaterThanOrEqual(44);
  }
});
