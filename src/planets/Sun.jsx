import * as THREE from 'three';

const generateSolarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#220500');
  grad.addColorStop(0.3, '#cc2200');
  grad.addColorStop(0.5, '#ff5500');
  grad.addColorStop(0.7, '#cc2200');
  grad.addColorStop(1, '#220500');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = Math.random() * 25 + 5;
    const patchGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    patchGrad.addColorStop(0, 'rgba(255, 230, 80, 0.6)');
    patchGrad.addColorStop(0.4, 'rgba(255, 140, 0, 0.3)');
    patchGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = patchGrad;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  ctx.globalCompositeOperation = 'overlay';
  for (let i = 0; i < 50000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    ctx.fillStyle = `rgba(255, 200, 100, ${Math.random() * 0.1})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

const generateCoronaTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(255, 200, 50, 1)');
  grad.addColorStop(0.3, 'rgba(255, 100, 0, 0.6)');
  grad.addColorStop(0.6, 'rgba(255, 50, 0, 0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(canvas);
};

export const createSun = () => {
  const group = new THREE.Group();

  const sunTex = generateSolarTexture();
  const sunGeo = new THREE.SphereGeometry(15, 128, 128);
  const sunMat = new THREE.MeshStandardMaterial({
    map: sunTex,
    emissive: 0xff3300,
    emissiveIntensity: 2.5,
    emissiveMap: sunTex,
    color: 0x000000
  });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.userData = { name: 'Sun' };
  group.add(sun);

  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(15.15, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false // CRITICAL: Stop the glow from blocking objects behind it
    })
  );
  group.add(innerGlow);

  const coronaTex = generateCoronaTexture();
  const corona = new THREE.Sprite(new THREE.SpriteMaterial({
    map: coronaTex,
    color: 0xff6600,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.7,
    depthWrite: false // CRITICAL: Prevent the sprite bounding box from showing as a black square
  }));
  corona.scale.set(60, 60, 1);
  group.add(corona);

  const update = (time) => {
    sun.rotation.y += 0.001;
    sun.rotation.x += 0.0002;
    const pulse = 0.98 + Math.sin(time * 1.5) * 0.02;
    corona.scale.set(60 * pulse, 60 * pulse, 1);
    corona.material.opacity = 0.6 + Math.sin(time * 2) * 0.1;
  };

  return { mesh: group, update, sunMesh: sun };
};