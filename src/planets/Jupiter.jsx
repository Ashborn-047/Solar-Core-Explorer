import * as THREE from 'three';

const generateJupiterTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const palette = [
    '#756050', '#eaddcf', '#8f705d', '#f0e6d2', '#9c8c74',
    '#fff0d0', '#b08a6d', '#f5ebd0', '#a88b70', '#8a6e5e'
  ];

  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  palette.forEach((color, i) => {
    grad.addColorStop(i / (palette.length - 1), color);
  });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  ctx.globalAlpha = 0.2;
  const numStreams = 4500;
  for (let i = 0; i < numStreams; i++) {
    const yBase = Math.random() * 1024;
    const colorIndex = Math.floor((yBase / 1024) * palette.length);
    const baseColor = palette[Math.min(colorIndex, palette.length - 1)];
    ctx.strokeStyle = Math.random() > 0.5 ? baseColor : '#ffffff';
    if (Math.random() > 0.85) ctx.strokeStyle = '#5a2a1e';
    const width = Math.random() * 400 + 50;
    const xStart = Math.random() * 2048 - 200;
    const windSpeed = Math.sin(yBase * 0.05) * 60;
    ctx.lineWidth = Math.random() * 3 + 1.5;
    ctx.beginPath();
    ctx.moveTo(xStart, yBase);
    ctx.bezierCurveTo(
      xStart + width * 0.3, yBase + Math.sin(xStart * 0.01) * 20 + windSpeed,
      xStart + width * 0.6, yBase - Math.sin(xStart * 0.01) * 20 - windSpeed,
      xStart + width, yBase
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

export const createJupiter = (size) => {
  const group = new THREE.Group();
  const jupiterTex = generateJupiterTexture();
  const jupiterGeo = new THREE.SphereGeometry(size, 64, 64);
  jupiterGeo.scale(1, 0.935, 1);

  const jupiterMat = new THREE.MeshStandardMaterial({
    map: jupiterTex,
    roughness: 0.5,
    metalness: 0.1,
  });
  const jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
  jupiter.userData = { name: 'Jupiter' };
  group.add(jupiter);

  const hazeGeo = new THREE.SphereGeometry(size * 1.02, 64, 64);
  hazeGeo.scale(1, 0.935, 1);
  const hazeMat = new THREE.MeshBasicMaterial({
    color: 0xd9cbb1,
    transparent: true,
    opacity: 0.06,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const haze = new THREE.Mesh(hazeGeo, hazeMat);
  group.add(haze);

  const update = () => {
    jupiter.rotation.y += 0.0015;
  };

  return { mesh: group, update };
};