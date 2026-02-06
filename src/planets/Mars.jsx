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
    new THREE.SphereGeometry(size * 1.05, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xff4422,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  group.add(glow);

  let mantleMesh = null;
  let coreMesh = null;

  // --- STRUCTURAL LAYERS ---
  // Mars Mantle: Silicate rock
  mantleMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.75, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x8b3a1b,
      roughness: 0.9
    })
  );
  mantleMesh.visible = false;
  group.add(mantleMesh);

  // Mars Core: Iron-nickel-sulfur
  coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 0.45, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 1,
      roughness: 0.3
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
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 40 + 10;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(255, 50, 50, 0.5)'); // Martian Iron signature
        grad.addColorStop(0.5, 'rgba(100, 0, 0, 0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      return c;
    })()
  );

  const heatmapMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.015, 64, 64),
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

    if (mars) {
      mars.rotation.y += 0.001;
      mars.material.transparent = isStructural || isHeatmap;
      mars.material.opacity = isStructural ? 0.2 : (isHeatmap ? 0.4 : 1);
    }

    if (heatmapMesh) {
      heatmapMesh.visible = isHeatmap && !isStructural;
      heatmapMesh.material.opacity = isHeatmap ? 0.8 : 0;
      heatmapMesh.rotation.y += 0.0012;
    }

    if (mantleMesh) {
      mantleMesh.visible = isStructural;
      mantleMesh.rotation.y += 0.0006;
    }
    if (coreMesh) {
      coreMesh.visible = isStructural;
      coreMesh.rotation.y += 0.0004;
    }
  };

  return { mesh: group, update };
};