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
    // Let the browser parse the token instead of hand-rolling hex→rgb:
    // immune to 3/6/8-digit hex, rgb(), or future colour formats.
    const probe = document.createElement('div');
    probe.style.backgroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim();
    document.body.append(probe);
    const target = getComputedStyle(probe).backgroundColor;
    probe.remove();
    // Scoped to the page surface: the marquee owns the one-accent-pill rule.
    // Inside the modal, the submit is the same conversion action continuing.
    return [...document.querySelectorAll('button, a')]
      .filter((el) => !el.closest('dialog'))
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
