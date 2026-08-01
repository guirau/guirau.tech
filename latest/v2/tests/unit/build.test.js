import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url).pathname;

test('app.js is marked generated and names its build command', () => {
  const head = readFileSync(join(root, 'assets/app.js'), 'utf8').slice(0, 400);
  assert.match(head, /GENERATED FILE/);
  assert.match(head, /npm run build/);
});

test('app.js is newer than every source file it is built from', () => {
  const bundle = statSync(join(root, 'assets/app.js')).mtimeMs;

  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : [];
  });

  const stale = walk(join(root, 'src'))
    .filter((f) => !f.endsWith('placeholder.js'))   // dev-only, not bundled
    .filter((f) => statSync(f).mtimeMs > bundle);

  assert.deepEqual(stale, [],
    `these sources are newer than the committed bundle — run npm run build:\n${stale.join('\n')}`);
});
