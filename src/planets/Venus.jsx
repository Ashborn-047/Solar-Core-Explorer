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

  let mantleMesh = null;
  let coreMesh = null;

  // --- STRUCTURAL LAYERS ---
  mantleMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.7, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.9
    })
  );
  mantleMesh.visible = false;
  group.add(mantleMesh);

  coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.35, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 1,
      roughness: 0.2
    })
  );
  coreMesh.visible = false;
  group.add(coreMesh);

  // --- SPECTRAL HEATMAP ---
  const heatmapTex = new THREE.CanvasTexture(
    (() => {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 450; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 60 + 20;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(200, 255, 100, 0.4)'); // Acidic/Sulfur signature
        grad.addColorStop(0.5, 'rgba(100, 150, 0, 0.1)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      return c;
    })()
  );

  const heatmapMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.07, 64, 64),
    new THREE.MeshBasicMaterial({
      map: heatmapTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0
    })
  );
  group.add(heatmapMesh);
  // -------------------------

  const update = (time, state = {}) => {
    const isStructural = state.isStructuralView;
    const isHeatmap = state.isHeatmapView;

    if (venus) {
      venus.rotation.y -= 0.0004;
      venus.material.transparent = isStructural || isHeatmap;
      venus.material.opacity = isStructural ? 0.2 : (isHeatmap ? 0.4 : 1);
    }
    if (limbGlow) {
      limbGlow.material.opacity = isStructural ? 0.05 : (isHeatmap ? 0.02 : 0.15);
    }
    if (haze) {
      haze.material.opacity = isStructural ? 0.01 : (isHeatmap ? 0.005 : 0.04);
    }

    if (heatmapMesh) {
      heatmapMesh.visible = isHeatmap && !isStructural;
      heatmapMesh.material.opacity = isHeatmap ? 0.8 : 0;
      heatmapMesh.rotation.y += 0.0006;
    }

    if (mantleMesh) {
      mantleMesh.visible = isStructural;
      mantleMesh.rotation.y += 0.0003;
    }
    if (coreMesh) {
      coreMesh.visible = isStructural;
      coreMesh.rotation.y += 0.0002;
    }
  };

  return { mesh: group, update };
};