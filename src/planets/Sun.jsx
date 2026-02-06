import * as THREE from 'three';

/**
 * PHOTOREALISTIC SUN - V2.2.0 (Active Granulation Edition)
 * 1. "Yellow Patches": Large, bright convection cells.
 * 2. High-Contrast Base: Deep red background so the yellow pops.
 * 3. Clean Corona: Soft, ray-free aura.
 */

const generateSolarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Deep Magma Base
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#220500'); // Darker poles
  grad.addColorStop(0.3, '#cc2200');
  grad.addColorStop(0.5, '#ff5500');
  grad.addColorStop(0.7, '#cc2200');
  grad.addColorStop(1, '#220500');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Active Convection Patches (The "Occasional Yellow Patches")
  // We use Screen blending to make them glow hot against the dark base
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = Math.random() * 25 + 5; // Variation in patch size

    const patchGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    patchGrad.addColorStop(0, 'rgba(255, 230, 80, 0.6)'); // Bright yellow core
    patchGrad.addColorStop(0.4, 'rgba(255, 140, 0, 0.3)'); // Orange surround
    patchGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = patchGrad;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // 3. Fine-Grain Granulation (Surface Noise)
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

// Generate a clean, soft corona texture without rays
const generateCoronaTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  // Soft, intense center fading to transparent
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
  // Ensure poles are at top/bottom, not rotated
  sun.rotation.x = 0;
  sun.rotation.y = 0;
  sun.rotation.z = 0;
  group.add(sun);


  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(15.15, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
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
    depthWrite: false
  }));
  corona.scale.set(60, 60, 1);
  group.add(corona);

  const update = (time, nasaData) => {
    sun.rotation.y += 0.001;

    // Base pulse
    let flareIntensity = 1;
    if (nasaData && nasaData.classType) {
      const flareClass = nasaData.classType[0];
      if (flareClass === 'X') flareIntensity = 1.8;
      else if (flareClass === 'M') flareIntensity = 1.4;
      else if (flareClass === 'C') flareIntensity = 1.2;
    }

    const pulse = (0.98 + Math.sin(time * 1.5) * 0.02) * flareIntensity;
    corona.scale.set(60 * pulse, 60 * pulse, 1);
    corona.material.opacity = (0.6 + Math.sin(time * 2) * 0.1) * flareIntensity;
    sunMat.emissiveIntensity = 2.5 * flareIntensity;
  };

  return { mesh: group, update, sunMesh: sun };
};