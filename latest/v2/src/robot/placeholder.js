// A stand-in robot built from primitives, satisfying the spec §4.1 contract:
//   Root > Torso > { Neck > Head, Shoulder_{L,R} > Forearm_{L,R} > Hand_{L,R} }
// normalized to 1.8 units tall, origin at the feet, facing +Z.
//
// Dev-only: excluded from the bundle. Its purpose is to let the runtime, the
// behaviours and every test be written and verified before the real GLB exists.
import * as THREE from 'three';

const shell = () => new THREE.MeshStandardMaterial({
  color: 0x0a0a0c, roughness: 0.25, metalness: 0.6,
});

function part(name, geometry, position) {
  const mesh = new THREE.Mesh(geometry, shell());
  mesh.name = `${name}_Mesh`;
  const node = new THREE.Object3D();
  node.name = name;
  node.position.set(...position);
  node.add(mesh);
  return node;
}

export function buildPlaceholder() {
  const root = new THREE.Object3D();
  root.name = 'Root';

  // Torso: shoulder-to-waist taper, chest centred at y=1.20.
  const torso = part('Torso', new THREE.CylinderGeometry(0.16, 0.11, 0.62, 16), [0, 1.20, 0]);
  root.add(torso);

  // Legs are static — no behaviour touches them, so they need no named nodes.
  const legs = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.09, 0.90, 12), shell()
  );
  legs.name = 'Legs_Mesh';
  legs.position.set(0, -0.76, 0);
  torso.add(legs);

  // Neck > Head. Head origin sits at the neck joint so rotation pivots correctly.
  const neck = part('Neck', new THREE.CylinderGeometry(0.055, 0.065, 0.10, 12), [0, 0.34, 0]);
  torso.add(neck);

  const head = new THREE.Object3D();
  head.name = 'Head';
  head.position.set(0, 0.08, 0);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 20), shell());
  helmet.name = 'Head_Mesh';
  helmet.scale.set(1, 1.18, 1.05);   // egg form
  helmet.position.y = 0.12;
  head.add(helmet);
  neck.add(head);

  // Arms, both sides. Wide A-pose: clear gaps at the armpits, elbows straight.
  for (const [suffix, sign] of [['L', 1], ['R', -1]]) {
    const shoulder = part(`Shoulder_${suffix}`,
      new THREE.CapsuleGeometry(0.045, 0.24, 4, 8), [sign * 0.20, 0.24, 0]);
    shoulder.rotation.z = sign * -0.28;
    torso.add(shoulder);

    const forearm = part(`Forearm_${suffix}`,
      new THREE.CapsuleGeometry(0.038, 0.22, 4, 8), [0, -0.28, 0]);
    shoulder.add(forearm);

    const hand = part(`Hand_${suffix}`,
      new THREE.BoxGeometry(0.07, 0.11, 0.045), [0, -0.20, 0]);
    forearm.add(hand);
  }

  return root;
}
