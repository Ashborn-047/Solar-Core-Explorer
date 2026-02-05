import * as THREE from 'three';

const generateNeptuneTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2b4a9a'; ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i < 30; i++) ctx.fillRect(0, Math.random() * 256, 512, 1);
  return new THREE.CanvasTexture(canvas);
};

export const createNeptune = (size) => {
  const group = new THREE.Group();
  const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ map: generateNeptuneTexture(), roughness: 0.8 })
  );
  neptune.userData = { name: 'Neptune' };
  group.add(neptune);

  const update = () => {
    neptune.rotation.y += 0.0015;
  };

  return { mesh: group, update };
};