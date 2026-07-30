import { test, expect } from '@playwright/test';

// U+002D HYPHEN-MINUS. Not U+2013 EN DASH, not U+2014 EM DASH.
const LEGAL = 'Alejandro Guirau - Software Consulting';

test('footer renders the legal string with a hyphen-minus', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toContainText(LEGAL);
});

test('the legal string is real, visible text — not an image or hidden', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  const box = await footer.boundingBox();
  expect(box, 'footer must occupy layout space').not.toBeNull();
  expect(box.height).toBeGreaterThan(0);

  // A verification reviewer copies text out of the page. Assert the exact
  // codepoints survive, so no ligature or dash substitution can pass.
  // Collapse ASCII formatting whitespace only. Deliberately NOT \s+, which
  // would also normalize U+00A0 and mask exactly the substitution this
  // test exists to catch.
  const codes = await footer.evaluate((el) =>
    [...el.textContent.replace(/[ \t\n\r]+/g, ' ').trim()].map((c) => c.codePointAt(0))
  );
  expect(String.fromCodePoint(...codes)).toBe(LEGAL);
  expect(codes).toContain(0x2d);       // hyphen-minus present
  expect(codes).not.toContain(0x2013); // no en dash
  expect(codes).not.toContain(0x2014); // no em dash
});

test('the legal string also appears in the document title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Alejandro Guirau/);
});
