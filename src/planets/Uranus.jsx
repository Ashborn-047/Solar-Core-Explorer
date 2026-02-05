import * as THREE from 'three';

const generateUranusTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#a2d2ff'; ctx.fillRect(0, 0, 512, 256);
  return new THREE.CanvasTexture(canvas);
};

export const createUranus = (size) => {
  const group = new THREE.Group();
  const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ map: generateUranusTexture(), roughness: 0.7 })
  );
  uranus.rotation.z = Math.PI / 2;
  uranus.userData = { name: 'Uranus' };
  group.add(uranus);

  const update = () => {
    uranus.rotation.y += 0.001;
  };

  return { mesh: group, update };
};