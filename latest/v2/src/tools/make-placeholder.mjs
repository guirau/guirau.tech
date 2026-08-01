// Exports the primitive placeholder to assets/robot.glb.
// Plan 3 overwrites that file with the generated robot; nothing else changes.
import * as THREE from 'three';
import { writeFileSync } from 'node:fs';
import { buildPlaceholder } from '../robot/placeholder.js';

// Node has no FileReader (browser-only global). GLTFExporter's binary path
// uses it solely to read a Blob into an ArrayBuffer, so a minimal shim
// covering that one call is enough — no need to touch the exporter itself.
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        this.onloadend?.();
      });
    }
  };
}

const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

const scene = new THREE.Scene();
scene.add(buildPlaceholder());

const exporter = new GLTFExporter();
const glb = await new Promise((resolve, reject) =>
  exporter.parse(scene, resolve, reject, { binary: true })
);

writeFileSync('assets/robot.glb', Buffer.from(glb));
console.log(`assets/robot.glb  ${(glb.byteLength / 1024).toFixed(1)} KB`);
