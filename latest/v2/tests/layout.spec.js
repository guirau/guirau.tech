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

test('headline declares a solid colour before the gradient claims it', async ({ page }) => {
  await page.goto('/');
  const css = await page.evaluate(async () => {
    const res = await fetch('assets/styles.css');
    return res.text();
  });

  // The unconditional rule must set `color`, so a browser without
  // background-clip:text still paints readable text.
  expect(css).toMatch(/\.marquee__headline\s*\{[^}]*color:\s*var\(--text-primary\)/);

  // Transparency is only ever declared once, and only after the @supports
  // gate opens — never as an unconditional rule.
  const transparentFills = [...css.matchAll(/-webkit-text-fill-color:\s*transparent/g)];
  expect(transparentFills).toHaveLength(1);
  // Anchor on the rule itself, not the bare `@supports` keyword — the
  // explanatory comment above also mentions "@supports" in prose, and a
  // keyword-only search would match that first.
  const supportsAt = css.indexOf('@supports (background-clip: text)');
  expect(supportsAt).toBeGreaterThan(-1);
  expect(transparentFills[0].index, 'transparent fill must live inside the @supports gate')
    .toBeGreaterThan(supportsAt);
});

test('headline is never rendered below 40px, where the darkest stop fails AA', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const size = await page.locator('.marquee__headline')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, `headline at ${width}px viewport`).toBeGreaterThanOrEqual(40);
  }
});
