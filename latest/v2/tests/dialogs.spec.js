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
