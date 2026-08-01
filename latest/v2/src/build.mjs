// Bundles src/main.js into the committed assets/app.js.
//
// GitHub Pages serves this repo with no build step, so the committed bundle IS
// what ships. Spec §3.1: re-run this and stage the output in the SAME commit as
// any src/ change, or the deployed behaviour silently lags the source.
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const OUT = 'assets/app.js';

const banner = `/* GENERATED FILE — do not edit.
 * Source: src/main.js and src/robot/
 * Rebuild: npm run build   (and commit the result alongside the src change)
 */`;

await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  outfile: OUT,
  banner: { js: banner },
  legalComments: 'none',
});

const raw = readFileSync(OUT);
const gz = gzipSync(raw).length;
console.log(`${OUT}  ${(raw.length / 1024).toFixed(1)} KB raw  ${(gz / 1024).toFixed(1)} KB gzipped`);

if (gz > 150 * 1024) {
  console.error(`FAIL: ${(gz / 1024).toFixed(1)} KB gzipped exceeds the 150 KB budget`);
  process.exit(1);
}
