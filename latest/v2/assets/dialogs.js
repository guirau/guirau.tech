// Dialog mechanics. Native <dialog> + showModal() supplies focus trapping,
// Esc-to-close, background inert and focus restoration; this file only wires
// the triggers and adds backdrop-click, which the platform does not give us.

const dialogs = new Map(
  ['services', 'contact'].map((id) => [id, document.getElementById(`${id}-dialog`)])
);

function open(id) {
  const dialog = dialogs.get(id);
  if (!dialog) return;
  // Only one dialog at a time. An offer CTA inside Services must close it
  // first, or Contact stacks on top and Esc unwinds through two layers.
  for (const other of dialogs.values()) {
    if (other !== dialog && other.open) other.close();
  }
  dialog.showModal();
  document.dispatchEvent(new CustomEvent('dialog:open', { detail: { id } }));
}

function close(dialog) {
  dialog.close();
}

document.querySelectorAll('[data-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => open(trigger.dataset.open));
});

for (const dialog of dialogs.values()) {
  dialog.querySelector('.dialog__close')
    .addEventListener('click', () => close(dialog));

  // A modal <dialog> covers the whole viewport; the visible panel is a child.
  // A click whose target is the dialog itself therefore landed on the backdrop.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close(dialog);
  });

  dialog.addEventListener('close', () => {
    document.dispatchEvent(new CustomEvent('dialog:close', { detail: { id: dialog.id } }));
  });
}

export { open };

// hCaptcha is ~50 KB of third-party script. It costs nothing at page load
// because it is fetched the first time Contact opens, and never again.
let captchaLoaded = false;

document.addEventListener('dialog:open', (event) => {
  if (event.detail.id !== 'contact' || captchaLoaded) return;
  captchaLoaded = true;

  const script = document.createElement('script');
  script.src = 'https://web3forms.com/client/script.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
