import * as THREE from 'three';

const generateVenusTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#cca366');
  grad.addColorStop(0.2, '#e6c288');
  grad.addColorStop(0.5, '#d4a34d');
  grad.addColorStop(0.8, '#e6c288');
  grad.addColorStop(1, '#cca366');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const w = Math.random() * 600 + 100;
    const h = Math.random() * 30 + 5;
    ctx.fillStyle = Math.random() > 0.6 ? '#ffffff' : '#8b5a2b';
    ctx.beginPath();
    const tilt = (y - 512) * 0.0005;
    ctx.ellipse(x, y, w, h, tilt, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#5c3a1e';
  ctx.lineWidth = 180;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-200, 512);
  ctx.bezierCurveTo(512, 900, 1536, 100, 2248, 512);
  ctx.stroke();
  return new THREE.CanvasTexture(canvas);
};

export const createVenus = (size) => {
  const group = new THREE.Group();
  const tex = generateVenusTexture();
  const venusMat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 1.0,
    metalness: 0.0
  });
  const venus = new THREE.Mesh(new THREE.SphereGeometry(size, 128, 128), venusMat);
  venus.userData = { name: 'Venus' };
  group.add(venus);

  const limbGlow = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.01, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffeebb,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  group.add(limbGlow);

  const haze = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.06, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xd4a34d,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  group.add(haze);

  const update = () => {
    venus.rotation.y -= 0.0004;
  };

  return { mesh: group, update };
};