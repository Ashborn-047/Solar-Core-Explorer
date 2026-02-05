import * as THREE from 'three';

const generateMoonTexture = (color = '#888888') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color; ctx.fillRect(0, 0, 1024, 512);

    // Add craters
    for (let i = 0; i < 500; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 5 + 1;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(0,0,0,0.4)');
        g.addColorStop(1, 'rgba(255,255,255,0.1)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
};

export const createMoon = (size, color = '#888888', name = 'Moon') => {
    const group = new THREE.Group();
    const tex = generateMoonTexture(color);
    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.02, roughness: 1 })
    );
    moon.userData = { name };
    group.add(moon);

    const update = () => {
        moon.rotation.y += 0.002;
    };

    return { mesh: group, update };
};
