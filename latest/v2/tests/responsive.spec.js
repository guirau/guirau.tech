import { test, expect } from '@playwright/test';

const WIDTHS = [320, 375, 768, 1024, 1440, 1920];
const LANDSCAPE = [{ w: 844, h: 390 }, { w: 926, h: 428 }];
const SHORT_LAPTOP = [{ w: 1024, h: 640 }, { w: 1280, h: 720 }];

async function footerFullyVisible(page) {
  return page.locator('footer').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom <= window.innerHeight + 1 && r.top >= 0 && r.height > 0;
  });
}

async function horizontalOverflow(page) {
  return page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

for (const width of WIDTHS) {
  test(`${width}px: no horizontal overflow, footer legible without scrolling`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    expect(await footerFullyVisible(page)).toBe(true);
  });
}

for (const { w, h } of LANDSCAPE) {
  test(`${w}x${h} landscape phone: two-column marquee, footer visible`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');

    // Short landscape keeps two columns precisely BECAUSE it is short:
    // horizontal space is what it has, vertical space is what it lacks.
    const cols = await page.locator('.marquee')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(cols, 'must stay two-column below 900px when height < 500px').toBe(2);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    expect(await footerFullyVisible(page)).toBe(true);
  });
}

test('375x812 portrait phone: single centred column', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const cols = await page.locator('.marquee')
    .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(cols, 'width < 900 and height >= 500 collapses to one column').toBe(1);
  expect(await footerFullyVisible(page)).toBe(true);
});

for (const { w, h } of SHORT_LAPTOP) {
  test(`${w}x${h} short laptop: whole marquee inside 100dvh`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');
    expect(await footerFullyVisible(page)).toBe(true);

    const marquee = await page.locator('.marquee').boundingBox();
    expect(marquee.height, 'marquee must not exceed the viewport').toBeLessThanOrEqual(h + 1);
  });
}

test('the marquee respects safe-area insets without losing its design gutter', async ({ page }) => {
  await page.goto('/');
  const padding = await page.locator('.marquee').evaluate((el) => {
    const s = getComputedStyle(el);
    return { left: parseFloat(s.paddingLeft), bottom: parseFloat(s.paddingBottom) };
  });
  // With no simulated inset, env() resolves to 0 and max() must fall back to
  // the design gutter. Addition instead of max() would show 0 here.
  expect(padding.left).toBeGreaterThanOrEqual(24);
  expect(padding.bottom).toBeGreaterThanOrEqual(24);
});
