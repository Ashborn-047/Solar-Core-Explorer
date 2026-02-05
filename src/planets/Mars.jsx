import * as THREE from 'three';

const generateMarsTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8b3a1b'; ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
    ctx.beginPath(); ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1024, 40); ctx.fillRect(0, 472, 1024, 40);
  return new THREE.CanvasTexture(canvas);
};

export const createMars = (size) => {
  const group = new THREE.Group();
  const tex = generateMarsTexture();
  const mars = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.06, roughness: 1 })
  );
  mars.userData = { name: 'Mars' };
  group.add(mars);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.02, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xff6644, transparent: true, opacity: 0.1, side: THREE.BackSide })
  );
  group.add(glow);

  const update = () => {
    mars.rotation.y += 0.001;
  };

  return { mesh: group, update };
};