import * as THREE from 'three';

const TEXTURE_URLS = {
  map: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
  specular: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
  bump: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"
};

const createProceduralFallback = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#051025'; ctx.fillRect(0, 0, 2048, 1024);
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = `rgb(${20 + Math.random() * 40},${60 + Math.random() * 40},${20 + Math.random() * 20})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 2048, Math.random() * 1024, Math.random() * 40, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
};

export const createEarth = (size) => {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();
  let cloudsMesh = null;
  let earthMesh = null;

  const loadTextures = async () => {
    try {
      const [map, spec, cloudMap, bump] = await Promise.all([
        loader.loadAsync(TEXTURE_URLS.map).catch(() => createProceduralFallback()),
        loader.loadAsync(TEXTURE_URLS.specular).catch(() => null),
        loader.loadAsync(TEXTURE_URLS.clouds).catch(() => null),
        loader.loadAsync(TEXTURE_URLS.bump).catch(() => null)
      ]);

      const earthMat = new THREE.MeshPhongMaterial({
        map: map,
        specularMap: spec,
        specular: new THREE.Color(0x222222),
        shininess: 15,
        bumpMap: bump || map,
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

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.05, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      group.add(atmosphere);

    } catch (err) {
      console.error("Earth texture load error:", err);
    }
  };

  loadTextures();

  const update = () => {
    if (earthMesh) earthMesh.rotation.y += 0.0006;
    if (cloudsMesh) cloudsMesh.rotation.y += 0.001;
  };

  return { mesh: group, update };
};