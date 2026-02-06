import React, { useEffect, useState } from 'react';
import { PLANET_CONFIG } from '../../data';

export default function SystemMiniMap({ planetName }) {
    const [rotation, setRotation] = useState(0);
    const planetConfig = PLANET_CONFIG.find(p => p.name === planetName);

    // Simulation of orbital positions for the mini-map
    // In a real app, this would be synced with the main Three.js clock
    useEffect(() => {
        let frame;
        const animate = (time) => {
            setRotation(time * 0.001);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    if (!planetConfig) return null;

    const moons = planetConfig.moons || [];
    const centerX = 100;
    const centerY = 100;
    const planetRadius = 15;

    return (
        <div className="w-full h-full relative flex items-center justify-center p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                {/* ORBITS */}
                {moons.map((moon, i) => (
                    <circle
                        key={`orbit-${i}`}
                        cx={centerX}
                        cy={centerY}
                        r={moon.dist * 8}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                        className="opacity-20"
                    />
                ))}

                {/* PLANET CENTER */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={planetRadius}
                    className="fill-cyan-500/20 stroke-cyan-500/60"
                    strokeWidth="1"
                />
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={2}
                    className="fill-cyan-400"
                />

                {/* MOONS */}
                {moons.map((moon, i) => {
                    const angle = rotation * (moon.speed * 0.5) + (i * 1.5);
                    const r = moon.dist * 8;
                    const mx = centerX + Math.cos(angle) * r;
                    const my = centerY + Math.sin(angle) * r;

                    return (
                        <g key={`moon-group-${i}`}>
                            <line
                                x1={centerX}
                                y1={centerY}
                                x2={mx}
                                y2={my}
                                className="stroke-cyan-500/10"
                                strokeWidth="0.5"
                            />
                            <circle
                                cx={mx}
                                cy={my}
                                r={moon.size * 3}
                                className="fill-white stroke-cyan-400/40"
                                strokeWidth="0.5"
                            />
                            <text
                                x={mx + 5}
                                y={my + 2}
                                className="fill-cyan-400/60 font-mono text-[8px] uppercase font-bold"
                            >
                                {moon.name}
                            </text>
                        </g>
                    );
                })}

                {/* SCANNER SWEEP */}
                <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos(rotation) * 80}
                    y2={centerY + Math.sin(rotation) * 80}
                    className="stroke-cyan-500/30"
                    strokeWidth="1"
                />
            </svg>

            {/* HUD ANNOTATION */}
            <div className="absolute top-2 left-2 flex gap-1 items-center">
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-[7px] text-cyan-500/60 font-black uppercase tracking-widest">Orbital_Sync_L4</span>
            </div>
        </div>
    );
}
