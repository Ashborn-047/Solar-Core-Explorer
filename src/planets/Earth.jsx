import * as THREE from 'three';

const TEXTURE_URLS = {
  map: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
  specular: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
  bump: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"
};

const createProceduralFallback = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#051025'; ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = '#1b3d0a';
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 40, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
};

export const createEarth = (size) => {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();
  let cloudsMesh = null;
  let earthMesh = null;
  let mantleMesh = null;
  let coreMesh = null;
  let heatmapMesh = null;

  const init = async () => {
    try {
      const loadTex = (url) => new Promise((res) => {
        loader.load(url, res, undefined, () => res(createProceduralFallback()));
      });

      const [map, spec, cloudMap, bump] = await Promise.all([
        loadTex(TEXTURE_URLS.map),
        loadTex(TEXTURE_URLS.specular),
        loadTex(TEXTURE_URLS.clouds),
        loadTex(TEXTURE_URLS.bump)
      ]);

      const earthMat = new THREE.MeshPhongMaterial({
        map: map,
        specularMap: spec,
        specular: new THREE.Color(0x333333),
        shininess: 15,
        bumpMap: bump,
        bumpScale: 0.05
      });

      earthMesh = new THREE.Mesh(new THREE.SphereGeometry(size, 64, 64), earthMat);
      earthMesh.userData = { name: 'Earth' };
      group.add(earthMesh);

      if (cloudMap) {
        cloudsMesh = new THREE.Mesh(
          new THREE.SphereGeometry(size * 1.015, 64, 64),
          new THREE.MeshStandardMaterial({
            map: cloudMap,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
          })
        );
        group.add(cloudsMesh);
      }

      const innerAtmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.01, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      group.add(innerAtmosphere);

      const outerAtmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.15, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0x0044ff,
          transparent: true,
          opacity: 0.05,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      group.add(outerAtmosphere);

      // --- STRUCTURAL LAYERS ---
      mantleMesh = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.7, 64, 64),
        new THREE.MeshStandardMaterial({
          color: 0xff4400,
          emissive: 0xff2200,
          emissiveIntensity: 0.5,
          roughness: 0.8
        })
      );
      mantleMesh.visible = false;
      group.add(mantleMesh);

      coreMesh = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.35, 64, 64),
        new THREE.MeshStandardMaterial({
          color: 0xffcc00,
          emissive: 0xffaa00,
          emissiveIntensity: 2,
          metalness: 1,
          roughness: 0.2
        })
      );
      coreMesh.visible = false;
      group.add(coreMesh);

      const heatmapTex = new THREE.CanvasTexture(
        (() => {
          const c = document.createElement('canvas');
          c.width = 1024; c.height = 512;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1024, 512);
          for (let i = 0; i < 500; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const r = Math.random() * 50 + 20;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, 'rgba(168, 85, 247, 0.6)');
            grad.addColorStop(0.5, 'rgba(88, 28, 135, 0.2)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
          }
          return c;
        })()
      );

      heatmapMesh = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.02, 64, 64),
        new THREE.MeshBasicMaterial({
          map: heatmapTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0
        })
      );
      group.add(heatmapMesh);

    } catch (err) {
      console.error("Earth texture load error:", err);
    }
  };

  init();

  const update = (time, state = {}) => {
    const isStructural = state.isStructuralView;
    const isHeatmap = state.isHeatmapView;

    if (earthMesh) {
      earthMesh.rotation.y += 0.0006;
      earthMesh.material.transparent = isStructural || isHeatmap;
      earthMesh.material.opacity = isStructural ? 0.2 : (isHeatmap ? 0.4 : 1);
    }
    if (cloudsMesh) {
      cloudsMesh.rotation.y += 0.001;
      cloudsMesh.material.opacity = isStructural ? 0.1 : (isHeatmap ? 0.05 : 0.8);
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