import * as THREE from 'three';

const generateMercuryTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 1024; const y = Math.random() * 512; const r = Math.random() * 4;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0.8)'); g.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
};

export const createMercury = (size) => {
  const group = new THREE.Group();
  const tex = generateMercuryTexture();
  const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.05, roughness: 1 })
  );
  mercury.userData = { name: 'Mercury' };
  group.add(mercury);

  const update = () => {
    mercury.rotation.y += 0.0005;
  };

  return { mesh: group, update };
};