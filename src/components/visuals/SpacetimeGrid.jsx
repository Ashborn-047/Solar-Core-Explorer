import * as THREE from 'three';

export const createSpacetimeGrid = () => {
    const size = 1000;
    const segments = 120;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -20; // Slightly below the orbital plane

    const originalPositions = geometry.attributes.position.array.slice();

    const update = (time, state = {}, planetCoords = null, mass = 1) => {
        const isGravity = state.isGravityView;
        mesh.visible = isGravity;

        if (!isGravity || !planetCoords) return;

        const positions = geometry.attributes.position.array;
        const worldPos = new THREE.Vector3();

        // The grid is rotated and at y=-20. We need to project the planet onto the grid.
        // Grid local X = World X
        // Grid local Y = World -Z (because of rotation)

        const targetX = planetCoords.x;
        const targetY = -planetCoords.z;

        for (let i = 0; i < positions.length; i += 3) {
            const x = originalPositions[i];
            const y = originalPositions[i + 1];

            const dx = x - targetX;
            const dy = y - targetY;
            const distSq = dx * dx + dy * dy;

            // Gravitational Well Formula: depth = G * M / r
            const influence = (mass * 1000) / (distSq + 100);
            positions[i + 2] = originalPositions[i + 2] + Math.min(influence, 50);
        }

        geometry.attributes.position.needsUpdate = true;
        material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
    };

    return { mesh, update };
};
