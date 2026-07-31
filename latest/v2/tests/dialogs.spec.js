import { test, expect } from '@playwright/test';

for (const id of ['services', 'contact']) {
  test(`${id}: opens, traps focus, Esc closes, focus returns to trigger`, async ({ page }) => {
    await page.goto('/');

    // Scoped to the marquee card: offer CTAs inside Services also carry
    // data-open="contact", so the bare attribute selector is no longer unique.
    const trigger = page.locator(`.marquee__card [data-open="${id}"]`);
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
    await page.locator(`.marquee__card [data-open="${id}"]`).click();
    await page.locator(`#${id}-dialog .dialog__close`).click();
    await expect(page.locator(`#${id}-dialog`)).toBeHidden();
    await expect(page.locator(`.marquee__card [data-open="${id}"]`)).toBeFocused();
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

test('services shows four offers with prices from CONTENT.md', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();

  const expected = [
    ['AI Strategy Consultation', 'From $199', '3 days'],
    ['n8n Workflow Automation', 'From $497', '5 days'],
    ['Custom AI Agent', 'From $897', '3 tiers'],
    ['AI App — End-to-End Build', '$8,997', '5 weeks'],
  ];

  const cards = page.locator('.offer');
  await expect(cards).toHaveCount(4);

  for (const [i, [title, price, duration]] of expected.entries()) {
    await expect(cards.nth(i).locator('.offer__title')).toHaveText(title);
    await expect(cards.nth(i).locator('.offer__meta')).toContainText(price);
    await expect(cards.nth(i).locator('.offer__meta')).toContainText(duration);
  }
});

test('prices and durations are the only mono text', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();
  const monoClasses = await page.evaluate(() =>
    [...document.querySelectorAll('#services-dialog *')]
      .filter((el) => getComputedStyle(el).fontFamily.includes('Geist Mono'))
      .map((el) => el.className)
  );
  expect(monoClasses.every((c) => c.includes('offer__meta'))).toBe(true);
  expect(monoClasses.length).toBe(4);
});

test('Santander is withheld from the credentials list', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();
  const body = await page.locator('#services-dialog').textContent();
  expect(body).not.toContain('Santander');
  for (const employer of ['HelloFresh', 'Hewlett Packard Enterprise',
                          'Telefónica', 'Enso', 'Masterschool']) {
    expect(body).toContain(employer);
  }
});

test('every offer CTA closes Services and opens Contact', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open="services"]').click();

  const ctas = page.locator('.offer__cta');
  await expect(ctas).toHaveCount(4);

  await ctas.first().click();
  await expect(page.locator('#services-dialog')).toBeHidden();
  await expect(page.locator('#contact-dialog')).toBeVisible();
});

test('contact form posts to Web3Forms with a real access key', async ({ page }) => {
  await page.goto('/');
  await page.locator('.marquee__card [data-open="contact"]').click();

  const form = page.locator('#contact-form');
  await expect(form).toHaveAttribute('action', 'https://api.web3forms.com/submit');
  await expect(form).toHaveAttribute('method', 'POST');

  const key = await page.locator('input[name="access_key"]').inputValue();
  expect(key, 'access_key must be the real UUID from prerequisite H1')
    .toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});

test('contact has name, email and message fields, all required', async ({ page }) => {
  await page.goto('/');
  await page.locator('.marquee__card [data-open="contact"]').click();
  for (const name of ['name', 'email', 'message']) {
    const field = page.locator(`#contact-form [name="${name}"]`);
    await expect(field).toBeVisible();
    await expect(field).toHaveAttribute('required', '');
  }
});

test('a honeypot field exists and is hidden from humans', async ({ page }) => {
  await page.goto('/');
  await page.locator('.marquee__card [data-open="contact"]').click();
  const honeypot = page.locator('#contact-form [name="botcheck"]');
  await expect(honeypot).toBeHidden();
});

test('the email address is also offered as a plain mailto link', async ({ page }) => {
  await page.goto('/');
  await page.locator('.marquee__card [data-open="contact"]').click();
  await expect(page.locator('#contact-dialog a[href^="mailto:"]'))
    .toHaveAttribute('href', 'mailto:alejandro.guirau@gmail.com');
});

test('after an offer CTA swaps dialogs, Esc returns focus to the Services trigger', async ({ page }) => {
  // Pins the focus hand-off the close-then-showModal ordering produces:
  // Services restores focus to its trigger synchronously, and Contact
  // snapshots that as its own restore target. A reorder of close()/
  // showModal() would break this without failing any other test.
  await page.goto('/');
  await page.locator('.marquee__card [data-open="services"]').click();
  await page.locator('.offer__cta').first().click();
  await expect(page.locator('#contact-dialog')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.locator('#contact-dialog')).toBeHidden();
  await expect(page.locator('.marquee__card [data-open="services"]')).toBeFocused();
});

test('hCaptcha is not fetched until Contact is first opened', async ({ page }) => {
  const captchaRequests = [];
  page.on('request', (r) => {
    if (r.url().includes('hcaptcha.com')) captchaRequests.push(r.url());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(captchaRequests, 'must cost nothing at initial page load').toEqual([]);

  await page.locator('.marquee__card [data-open="contact"]').click();
  await page.waitForRequest((r) => r.url().includes('hcaptcha.com'), { timeout: 5000 });
  expect(captchaRequests.length).toBeGreaterThan(0);
});
