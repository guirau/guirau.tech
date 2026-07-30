import { test, expect } from '@playwright/test';

test('page serves and has a title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Alejandro Guirau/);
});
