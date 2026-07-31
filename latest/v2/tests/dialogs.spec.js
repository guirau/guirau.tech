import { test, expect } from '@playwright/test';

for (const id of ['services', 'contact']) {
  test(`${id}: opens, traps focus, Esc closes, focus returns to trigger`, async ({ page }) => {
    await page.goto('/');

    const trigger = page.locator(`[data-open="${id}"]`);
    const dialog = page.locator(`#${id}-dialog`);

    await expect(dialog).toBeHidden();
    await trigger.click();
    await expect(dialog).toBeVisible();

    // showModal() makes the rest of the document inert.
    const isModal = await dialog.evaluate((el) => el.matches(':modal'));
    expect(isModal, 'must be opened with showModal(), not show()').toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test(`${id}: the close button also restores focus`, async ({ page }) => {
    await page.goto('/');
    await page.locator(`[data-open="${id}"]`).click();
    await page.locator(`#${id}-dialog .dialog__close`).click();
    await expect(page.locator(`#${id}-dialog`)).toBeHidden();
    await expect(page.locator(`[data-open="${id}"]`)).toBeFocused();
  });
}

test('clicking the backdrop closes the dialog', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();
  const dialog = page.locator('#services-dialog');
  await expect(dialog).toBeVisible();

  // Click at the very top-left of the viewport, which is backdrop, not panel.
  await page.mouse.click(2, 2);
  await expect(dialog).toBeHidden();
});

test('clicking inside the panel does not close the dialog', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();
  const dialog = page.locator('#services-dialog');
  await dialog.locator('.dialog__panel').click({ position: { x: 40, y: 40 } });
  await expect(dialog).toBeVisible();
});

test('the close button stays put while the body scrolls', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();
  const close = page.locator('#services-dialog .dialog__close');

  // Fill first: content injection legitimately resizes and recentres the dialog.
  await page.locator('#services-dialog .dialog__body').evaluate((el) => {
    el.innerHTML = '<p>filler</p>'.repeat(400);
  });
  const before = await close.boundingBox();

  // Now scroll every scrollable region inside the dialog. Only .dialog__body
  // should be one, and scrolling it must not move the chrome.
  await page.locator('#services-dialog').evaluate((el) => {
    el.querySelectorAll('*').forEach((n) => { n.scrollTop = 500; });
  });

  const after = await close.boundingBox();
  expect(after.y, 'close button must not move when the body scrolls').toBe(before.y);
  expect(after.x).toBe(before.x);
});
