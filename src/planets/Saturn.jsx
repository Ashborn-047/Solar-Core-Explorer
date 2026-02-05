import * as THREE from 'three';

const generateSaturnTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 4096; canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  const colors = ['#2b1d0e', '#594025', '#8c6339', '#bf925a', '#f2c98a', '#8c6339'];
  for (let y = 0; y < 2048; y++) {
    const normalizedY = y / 2048;
    const wave = Math.sin(normalizedY * 35) * 0.5 + Math.sin(normalizedY * 15) * 0.5;
    const index = Math.floor((normalizedY + wave * 0.01) * colors.length);
    const safeIndex = Math.max(0, Math.min(colors.length - 1, index));
    ctx.fillStyle = colors[safeIndex];
    ctx.fillRect(0, y, 4096, 1);
  }
  ctx.globalCompositeOperation = 'overlay';
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * 4096;
    const y = Math.random() * 2048;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.fillRect(x, y, 2, 2);
  }
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 4096;
    const y = Math.random() * 2048;
    const w = Math.random() * 400 + 50;
    const h = Math.random() * 15 + 2;
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(255,220,180, 0.2)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 16;
  return tex;
};

const generateRingTexture = (type = 'color') => {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 4096, 1024);
  for (let y = 0; y < 1024; y++) {
    const n = y / 1024;
    let density = 0.4 + (Math.sin(y * 0.2) * 0.3) + (Math.sin(y * 0.03) * 0.1);
    if (n > 0.65 && n < 0.68) density = 0.0;
    if (n > 0.92 && n < 0.93) density = 0.0;
    if (n < 0.08) density *= (n / 0.08);
    let r = 210 + (n * 45);
    let g = 180 + (n * 60);
    let b = 130 + (n * 90);
    for (let x = 0; x < 4096; x += 4) {
      const grain = (Math.random() - 0.5) * 0.6;
      const clump = Math.sin(x * 0.1 + y * 0.2) * 0.1;
      let finalOpacity = Math.max(0, Math.min(1, density + clump + grain));
      if (type === 'bump') {
        const val = Math.floor(finalOpacity * 255);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
      } else {
        if (Math.random() > 0.98 && finalOpacity > 0.1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 1.5})`;
        } else {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
        }
      }
      ctx.fillRect(x, y, 4, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 16;
  return tex;
};

export const createSaturn = (size) => {
  const group = new THREE.Group();
  const saturnMat = new THREE.MeshStandardMaterial({
    map: generateSaturnTexture(),
    roughness: 0.6,
    metalness: 0.1,
  });
  const saturn = new THREE.Mesh(new THREE.SphereGeometry(size, 128, 128), saturnMat);
  saturn.scale.set(1, 0.88, 1);
  saturn.castShadow = true;
  saturn.receiveShadow = true;
  saturn.userData = { name: 'Saturn' };
  group.add(saturn);

  const ringGeo = new THREE.RingGeometry(size * 1.2, size * 2.8, 512);
  const pos = ringGeo.attributes.position;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const angle = Math.atan2(v3.y, v3.x);
    const u = (angle + Math.PI) / (2 * Math.PI);
    const v = (v3.length() - (size * 1.2)) / (size * 1.6);
    ringGeo.attributes.uv.setXY(i, u, v);
  }
  const ringMat = new THREE.MeshStandardMaterial({
    map: generateRingTexture('color'),
    transparent: true,
    side: THREE.DoubleSide,
    roughness: 0.8,
    metalness: 0.3,
    bumpMap: generateRingTexture('bump'),
    bumpScale: 0.5,
    alphaTest: 0.1
  });
  const rings = new THREE.Mesh(ringGeo, ringMat);
  rings.rotation.x = Math.PI / 2.15;
  group.add(rings);

  const update = () => {
    saturn.rotation.y += 0.0005;
    rings.rotation.z -= 0.0003;
  };

  return { mesh: group, update };
};