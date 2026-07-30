import { test, expect } from '@playwright/test';

test('the whole marquee fits inside the viewport with no page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }));
  expect(overflow.x, 'no horizontal overflow').toBeLessThanOrEqual(0);
  expect(overflow.y, 'no vertical overflow — the page is exactly one screen').toBeLessThanOrEqual(0);
});

test('the stage sits behind the marquee', async ({ page }) => {
  await page.goto('/');
  const stageZ = await page.locator('.stage').evaluate((el) => getComputedStyle(el).zIndex);
  const marqueeZ = await page.locator('.marquee').evaluate((el) => getComputedStyle(el).zIndex);
  expect(Number(stageZ)).toBeLessThan(Number(marqueeZ));
});

test('eyebrow is the name and headline is the positioning line', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.marquee__eyebrow')).toHaveText('Alejandro Guirau');
  await expect(page.locator('.marquee__headline'))
    .toHaveText('Freelance AI engineer. Production systems, not prototypes.');

  // §2.5: the name must NOT be promoted to display size.
  const sizes = await page.evaluate(() => ({
    eyebrow: parseFloat(getComputedStyle(document.querySelector('.marquee__eyebrow')).fontSize),
    headline: parseFloat(getComputedStyle(document.querySelector('.marquee__headline')).fontSize),
  }));
  expect(sizes.eyebrow).toBeLessThan(sizes.headline);
});

test('display type is weight 600 and never 700 or 500', async ({ page }) => {
  await page.goto('/');
  const weights = await page.evaluate(() =>
    [...document.querySelectorAll('.marquee__eyebrow, .marquee__headline')]
      .map((el) => getComputedStyle(el).fontWeight)
  );
  expect(weights.every((w) => w === '600')).toBe(true);
});
