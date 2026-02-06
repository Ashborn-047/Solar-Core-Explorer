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

  let mantleMesh = null;
  let coreMesh = null;

  // --- STRUCTURAL LAYERS ---
  // Mercury's mantle is extremely thin
  mantleMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.9, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.9
    })
  );
  mantleMesh.visible = false;
  group.add(mantleMesh);

  // Mercury has an oversized iron core (~85% of radius)
  coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.85, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
      metalness: 1,
      roughness: 0.1
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
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 30 + 5;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(200, 200, 255, 0.4)'); // Helium/Sodium exosphere signatures
        grad.addColorStop(0.5, 'rgba(50, 50, 100, 0.1)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      return c;
    })()
  );

  const heatmapMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.01, 64, 64),
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

    if (mercury) {
      mercury.rotation.y += 0.0005;
      mercury.material.transparent = isStructural || isHeatmap;
      mercury.material.opacity = isStructural ? 0.2 : (isHeatmap ? 0.4 : 1);
    }

    if (heatmapMesh) {
      heatmapMesh.visible = isHeatmap && !isStructural;
      heatmapMesh.material.opacity = isHeatmap ? 0.8 : 0;
      heatmapMesh.rotation.y += 0.0008;
    }

    if (mantleMesh) {
      mantleMesh.visible = isStructural;
      mantleMesh.rotation.y += 0.0004;
    }
    if (coreMesh) {
      coreMesh.visible = isStructural;
      coreMesh.rotation.y += 0.0002;
    }
  };

  return { mesh: group, update };
};