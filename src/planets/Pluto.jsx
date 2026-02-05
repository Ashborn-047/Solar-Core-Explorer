import * as THREE from 'three';

const generatePlutoTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#968570'; ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(400, 300, 100, 120, 0.4, 0, Math.PI * 2); ctx.fill();
  return new THREE.CanvasTexture(canvas);
};

export const createPluto = (size) => {
  const group = new THREE.Group();
  const pluto = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ map: generatePlutoTexture(), roughness: 0.9 })
  );
  pluto.userData = { name: 'Pluto' };
  group.add(pluto);

  const update = () => {
    pluto.rotation.y += 0.0004;
  };

  return { mesh: group, update };
};