import { test, expect } from '@playwright/test';

test('tab order reaches every control in a sensible sequence', async ({ page }) => {
  await page.goto('/');
  const order = [];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => document.activeElement.textContent.trim()));
  }
  expect(order).toContain('LinkedIn');
  expect(order).toContain('GitHub');
  expect(order).toContain('Services');
  expect(order).toContain('Contact');
});

test('the page uses semantic landmarks, not a div stack', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('nav[aria-label]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('the decorative stage is hidden from assistive tech', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.stage')).toHaveAttribute('aria-hidden', 'true');
});

test('reduced motion renders the page with no transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page.locator('.pill').first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.05);
});
