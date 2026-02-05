import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import high-fidelity planet assets
import { createSun } from './planets/Sun';
import { createMercury } from './planets/Mercury';
import { createVenus } from './planets/Venus';
import { createEarth } from './planets/Earth';
import { createMars } from './planets/Mars';
import { createJupiter } from './planets/Jupiter';
import { createSaturn } from './planets/Saturn';
import { createUranus } from './planets/Uranus';
import { createNeptune } from './planets/Neptune';
import { createPluto } from './planets/Pluto';
import { createMoon } from './planets/Moon';

import { PLANET_INFO, PLANET_CONFIG, MISSION_DATA } from './data';

export default function SolarSystemExplorer() {
  const containerRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [timeScale, setTimeScale] = useState(1);
  const [lensMode, setLensMode] = useState('normal');
  const [isLabMode, setIsLabMode] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [nasaData, setNasaData] = useState(null);
  const [typewriter, setTypewriter] = useState("");
  const simulationTime = useRef(0);
  const [errorStatus, setErrorStatus] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  const planetObjects = useRef([]);
  const missionObjects = useRef([]);
  const requestRef = useRef();
  const stateRef = useRef({ selected: null, timeScale: 1, isLabMode: false, showMissions: false, audioEnabled: false });
  const [debugLog, setDebugLog] = useState("Engine: Standby");
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    stateRef.current = {
      selected: selectedPlanet,
      timeScale: timeScale,
      isLabMode: isLabMode,
      showMissions: showMissions,
      audioEnabled: audioEnabled
    };
  }, [selectedPlanet, timeScale, isLabMode, showMissions, audioEnabled]);

  useEffect(() => {
    const timer = setInterval(() => setPulse(p => (p + 1) % 100), 500);
    return () => clearInterval(timer);
  }, []);

  console.log("AstroMetric Engine: Component Rendering Lifecycle");

  // Deep Data Typewriter logic
  useEffect(() => {
    if (!selectedPlanet || !PLANET_INFO[selectedPlanet]) { setTypewriter(""); return; }
    const text = PLANET_INFO[selectedPlanet].description;
    let i = 0;
    const interval = setInterval(() => {
      setTypewriter(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [selectedPlanet]);

  // Live NASA Solar Data Fetching
  useEffect(() => {
    const fetchSolar = async () => {
      try {
        const res = await fetch("https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&endDate=2024-12-31&api_key=DEMO_KEY");
        const data = await res.json();
        if (data && data.length > 0) setNasaData(data[data.length - 1]);
      } catch (e) { console.error("NASA API Error:", e); }
    };
    fetchSolar();
  }, []);

  // Neural Voice Interface
  const handleSpeak = async () => {
    if (isSpeaking) {
      if (audioRef.current) audioRef.current.pause();
      setIsSpeaking(false);
      return;
    }
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const text = `Analyzing ${selectedPlanet}. Classification: ${PLANET_INFO[selectedPlanet].class}. ${PLANET_INFO[selectedPlanet].description}`;
    try {
      setIsSpeaking(true);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `In a clinical, highly-detailed artificial intelligence voice: ${text}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } }
          }
        })
      });
      const data = await res.json();
      const pcmBase64 = data.candidates[0].content.parts[0].inlineData.data;

      const pcmToWav = (base64, rate) => {
        const pcm = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const wav = new ArrayBuffer(44 + pcm.length);
        const view = new DataView(wav);
        view.setUint32(0, 0x52494646, false); view.setUint32(4, 36 + pcm.length, true);
        view.setUint32(8, 0x57415645, false); view.setUint32(12, 0x666d7420, false);
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
        view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true);
        view.setUint16(32, 2, true); view.setUint16(34, 16, true);
        view.setUint32(36, 0x64617461, false); view.setUint32(40, pcm.length, true);
        new Uint8Array(wav, 44).set(pcm);
        return new Blob([wav], { type: 'audio/wav' });
      };

      const audio = new Audio(URL.createObjectURL(pcmToWav(pcmBase64, 24000)));
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (e) { setIsSpeaking(false); }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    console.log("AstroMetric Engine: Initializing System...");
    let renderer, handleResize, onPointer, audioCtx;
    let scene, camera, controls;

    planetObjects.current = [];
    missionObjects.current = [];

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#020205'); // Slightly lifted from pure black

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
      camera.position.set(300, 250, 500);

      renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      containerRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 5;
      controls.maxDistance = 2000;
      controls.enablePan = true;
      controls.panSpeed = 1.2;

      // Lighting
      const sunLight = new THREE.PointLight(0xffffff, 2000, 3000); // Supernova levels for visibility
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);
      scene.add(new THREE.AmbientLight(0xffffff, 0.15));

      // Deep Nebula Starfield
      const starCount = 30000;
      const starGeom = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 6000;
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.6 })));

      // Dynamic Mission Objects
      MISSION_DATA.forEach(m => {
        const points = m.path.map(p => new THREE.Vector3(...p));
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        const mat = new THREE.LineBasicMaterial({ color: m.color, transparent: true, opacity: 0.6 });
        const line = new THREE.Line(geo, mat);

        const markerGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ color: m.color });
        const marker = new THREE.Mesh(markerGeo, markerMat);

        const pulseGeo = new THREE.SphereGeometry(2, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.3 });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        marker.add(pulse);
        marker.userData = { name: m.name, size: 2 };

        line.add(marker);
        scene.add(line);
        missionObjects.current.push({ line, marker, pulse, curve });
        planetObjects.current.push(marker);
      });

      // Lab Mode Earth Reference
      const labEarth = createEarth(2.2);
      labEarth.mesh.visible = false;
      scene.add(labEarth.mesh);

      // Asset Map
      const assetCreators = {
        Sun: createSun,
        Mercury: createMercury,
        Venus: createVenus,
        Earth: createEarth,
        Mars: createMars,
        Jupiter: createJupiter,
        Saturn: createSaturn,
        Uranus: createUranus,
        Neptune: createNeptune,
        Pluto: createPluto
      };

      const sunAsset = createSun();
      scene.add(sunAsset.mesh);

      const groups = [];
      PLANET_CONFIG.forEach(data => {
        if (data.name === 'Sun') return;

        // Precise Orbit Paths
        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(data.dist, 0.15, 16, 300),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 })
        );
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        const orbitGroup = new THREE.Group();
        const asset = assetCreators[data.name](data.size);
        asset.mesh.position.x = data.dist;
        asset.mesh.userData = { ...data };

        orbitGroup.add(asset.mesh);
        scene.add(orbitGroup);

        // Moon Integration
        const moonAssets = [];
        if (data.moons) {
          data.moons.forEach(m => {
            const moonOrbit = new THREE.Group();
            const moon = createMoon(m.size, m.color, m.name);
            moon.mesh.position.x = m.dist;
            moonOrbit.add(moon.mesh);
            asset.mesh.add(moonOrbit); // Orbit around the planet
            moonAssets.push({ group: moonOrbit, data: m, asset: moon });
            planetObjects.current.push(moon.mesh);
          });
        }

        groups.push({ orbitGroup, data, asset, moonAssets });
        planetObjects.current.push(asset.mesh);
      });

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      onPointer = (e) => {
        const cx = e.clientX || (e.touches && e.touches[0].clientX);
        const cy = e.clientY || (e.touches && e.touches[0].clientY);
        if (cx === undefined) return;

        mouse.x = (cx / window.innerWidth) * 2 - 1;
        mouse.y = -(cy / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        // Raycast against all planet asset groups and the sun
        const hits = raycaster.intersectObjects([...planetObjects.current, sunAsset.mesh], true);

        if (hits.length > 0) {
          // Find the root object with name in userData
          let target = hits[0].object;
          while (target && (!target.userData || !target.userData.name)) {
            target = target.parent;
          }

          if (target && target.userData.name) {
            const name = target.userData.name;
            setHoveredPlanet(name);
            document.body.style.cursor = 'crosshair';
            if (e.type === 'mousedown') setSelectedPlanet(name);
          }
        } else {
          setHoveredPlanet(null);
          document.body.style.cursor = 'grab';
          if (e.type === 'mousedown') setSelectedPlanet(null);
        }
      };

      window.addEventListener('mousedown', onPointer);
      window.addEventListener('mousemove', onPointer);

      // Procedural Audio Engine
      let noise, filter, gain;
      const startAudio = () => {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

        noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        gain = audioCtx.createGain();
        gain.gain.value = 0.05;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      };

      if (stateRef.current.audioEnabled && !audioCtx) startAudio();

      const isInteracting = { current: false };
      controls.addEventListener('start', () => { isInteracting.current = true; });
      controls.addEventListener('end', () => { isInteracting.current = false; });

      const clock = new THREE.Clock();
      const animate = () => {
        const delta = clock.getDelta();
        const currentTS = stateRef.current.timeScale || 1;
        simulationTime.current += delta * currentTS;
        const st = simulationTime.current;

        const audioActive = stateRef.current.audioEnabled;
        if (filter && gain && audioActive) {
          filter.frequency.value = 200 + (Math.abs(currentTS) * 50);
          gain.gain.value = 0.02 + (Math.sin(st) * 0.01);
        } else if (audioCtx && !audioActive && audioCtx.state === 'running') {
          // Stop audio if disabled
          audioCtx.close();
          audioCtx = null;
          noise = null;
          filter = null;
          gain = null;
        }

        const selected = stateRef.current.selected;

        // Update comparison Lab
        const isPlanetSelected = selected && !['Sun', 'Earth'].includes(selected) && PLANET_INFO[selected];
        labEarth.mesh.visible = stateRef.current.isLabMode && isPlanetSelected;
        if (labEarth.mesh.visible) {
          const target = groups.find(g => g.data.name === selected)?.asset;
          if (target && target.mesh) {
            const worldPos = new THREE.Vector3();
            target.mesh.getWorldPosition(worldPos);
            labEarth.mesh.position.set(worldPos.x + (target.mesh.userData.size || 5) * 2, worldPos.y, worldPos.z);
            labEarth.update();
          }
        }

        sunAsset.update(st);

        const missionsActive = stateRef.current.showMissions;
        missionObjects.current.forEach((m, idx) => {
          m.line.visible = missionsActive;
          if (missionsActive) {
            const t = (st * 0.05 + idx * 0.3) % 1;
            const pos = m.curve.getPointAt(t);
            m.marker.position.copy(pos);
            m.pulse.scale.setScalar(1 + Math.sin(st * 3) * 0.3);
            m.pulse.material.opacity = 0.3 + Math.sin(st * 3) * 0.2;
          }
        });

        groups.forEach(item => {
          if (selected !== item.data.name) {
            item.orbitGroup.rotation.y = st * item.data.speed * 0.12;
          }
          item.asset.update(st);

          // Update Moons
          item.moonAssets.forEach(m => {
            m.group.rotation.y = st * m.data.speed;
            m.asset.update(st);
          });
        });

        if (selected) {
          // Correcting Targeting Logic: handle both planet asset objects and raw meshes (for missions)
          let targetMesh = null;
          if (selected === 'Sun' && sunAsset) {
            targetMesh = sunAsset.mesh;
          } else if (groups) {
            const planet = groups.find(g => g.data.name === selected);
            if (planet) {
              targetMesh = planet.asset.mesh;
            } else {
              const mission = missionObjects.current.find(m => m.marker.userData.name === selected);
              if (mission) targetMesh = mission.marker;
            }
          }

          if (targetMesh && targetMesh.getWorldPosition) {
            const worldPos = new THREE.Vector3();
            targetMesh.getWorldPosition(worldPos);
            const size = targetMesh.userData?.size || 5;

            // NAN PROTECTION: Ensure worldPos is valid
            if (!isNaN(worldPos.x) && !isNaN(worldPos.y) && !isNaN(worldPos.z) && !isInteracting.current) {
              const offset = new THREE.Vector3(size * 4, size * 1.5, size * 8);
              const lookAtOffset = new THREE.Vector3(size * 4, 0, 0);

              camera.position.lerp(worldPos.clone().add(offset), 0.05);
              controls.target.lerp(worldPos.clone().add(lookAtOffset), 0.05);
            }
          }
        }

        controls.update();
        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };
      console.log("AstroMetric Engine: Scene Compiled. Ignition Sequence Start.");
      animate();

      handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

    } catch (e) {
      console.error("3D SETUP CRASH:", e);
      setErrorStatus(e.message);
    }

    return () => {
      cancelAnimationFrame(requestRef.current);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (onPointer) {
        window.removeEventListener('mousedown', onPointer);
        window.removeEventListener('mousemove', onPointer);
      }
      if (renderer) {
        renderer.dispose();
        if (containerRef.current) containerRef.current.innerHTML = '';
      }
      if (audioCtx) audioCtx.close();
    };
  }, []); // Only run once on mount

  const getLensFilter = () => {
    switch (lensMode) {
      case 'thermal': return 'hue-rotate(150deg) saturate(5) brightness(1.5) contrast(1.2)';
      case 'xray': return 'invert(1) hue-rotate(180deg) brightness(1.2) opacity(0.7)';
      case 'retro': return 'sepia(1) hue-rotate(60deg) contrast(1.5) brightness(0.8)';
      default: return 'none';
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050508', position: 'relative', overflow: 'hidden' }} className="font-mono text-cyan-200">
      {/* --- EMERGENCY DIAGNOSTIC OVERLAY --- */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #00ffff, #0055ff)', zIndex: 10001, boxShadow: '0 0 15px #00ffff' }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10002, background: 'rgba(0, 0, 0, 0.9)', border: '1px solid #00ffff', padding: '12px 20px', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,255,255,0.2)' }}>
        <div style={{ fontSize: '12px', fontWeight: '900', color: '#00ffff', marginBottom: '4px' }}>ASTRO_METRIC // ENGINE_CORE_REF</div>
        <div style={{ fontSize: '9px', color: '#fff' }}>
          STATUS: <span style={{ color: '#00ff00' }}>OPTIMAL</span>
          <span style={{ marginLeft: '10px', opacity: 0.5 }}>[{"=".repeat(pulse % 5)}{" ".repeat(5 - (pulse % 5))}]</span>
        </div>
        <div style={{ fontSize: '9px', color: '#00ffff', marginTop: '4px' }}>TELEMETRY_LINK: ACTIVE</div>
        <button onClick={() => window.location.reload()} style={{ marginTop: '10px', background: '#00ffff', color: '#000', border: 'none', padding: '6px 12px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px', width: '100%' }}>FORCED_CACHE_FLUSH</button>
      </div>
      {/* --- END EMERGENCY OVERLAY --- */}

      {errorStatus && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10000, background: '#1a0000', color: '#ff5555', padding: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: '900', letterSpacing: '-0.05em' }}>SYSTEM_CRASH</h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>TERMINAL_MALFUNCTION: <b>{errorStatus}</b></p>
          <button onClick={() => window.location.reload()} style={{ width: 'fit-content', mt: '40px', padding: '20px 40px', background: '#ff5555', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>REBOOT ENGINE</button>
        </div>
      )}

      {/* Engine Health indicator (Only visible in console) */}
      <div className="hidden">System Status: Active</div>
      {/* 3D Scene Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair transition-all duration-700"
        style={{ filter: getLensFilter() }}
      />

      {/* Retro Scanline Overlay */}
      {lensMode === 'retro' && (
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />
      )}

      {/* GLOBAL HUD CONTROLS */}
      <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-4 p-6 bg-black/80 border border-cyan-500/30 backdrop-blur-xl rounded-xl">
        <div className="text-[10px] tracking-[0.2em] text-cyan-500/70 mb-2 uppercase font-bold">Terminal Control Unit</div>

        {/* Time Scale Controller */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px]">
            <span>TEMPORAL DRIFT</span>
            <span className="text-white font-bold">{timeScale.toFixed(1)}x</span>
          </div>
          <input
            type="range" min="-10" max="100" step="0.5" value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            className="w-48 appearance-none bg-cyan-900/40 h-1.5 rounded-full overflow-hidden outline-none accent-cyan-400"
          />
        </div>

        {/* Lens Mode Switcher */}
        <div className="flex gap-2 pt-2 border-t border-cyan-500/10">
          {['normal', 'thermal', 'xray', 'retro'].map(mode => (
            <button
              key={mode}
              onClick={() => setLensMode(mode)}
              className={`px-3 py-1 text-[10px] rounded border transition-all uppercase ${lensMode === mode ? 'bg-cyan-500 text-black border-cyan-400 font-bold' : 'border-cyan-500/30 hover:bg-cyan-500/10'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Comparison Lab Toggle */}
        <button
          onClick={() => setIsLabMode(!isLabMode)}
          className={`flex items-center justify-between w-full px-4 py-2 text-[11px] rounded transition-all ${isLabMode ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-500' : 'bg-white/5 border border-white/10 text-white shadow-lg'
            }`}
        >
          <span>COMPARISON LAB</span>
          <div className={`w-2 h-2 rounded-full ${isLabMode ? 'bg-yellow-500 animate-pulse' : 'bg-white/20'}`} />
        </button>

        {/* New Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowMissions(!showMissions)}
            className={`flex-1 px-3 py-2 text-[10px] rounded border transition-all ${showMissions ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white'
              }`}
          >
            MISSIONS
          </button>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex-1 px-3 py-2 text-[10px] rounded border transition-all ${audioEnabled ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-white/10 text-white'
              }`}
          >
            AUDIO: {audioEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Lab Mode Overlay */}
      {isLabMode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="w-[300px] h-[300px] border-2 border-yellow-500/50 rounded-full animate-ping opacity-20" />
          <div className="absolute top-full text-yellow-500 text-[10px] mt-4 text-center w-full uppercase tracking-widest font-bold">
            Laboratory Scale Calibration Active
          </div>
        </div>
      )}

      {/* Cinematic HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/[0.03]" />

      {/* Top Left: NASA Live Feed */}
      <div className="absolute top-8 left-8 z-50 p-4 bg-black/40 border-l-2 border-cyan-500 backdrop-blur-md">
        <div className="text-[10px] text-cyan-500 font-bold mb-1 uppercase tracking-tighter">NASA DONKI SEC_OFFICE</div>
        <div className="text-[14px] text-white font-bold flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE SOLAR STATUS
        </div>
        {nasaData && (
          <div className="mt-2 text-[10px] text-cyan-400 opacity-80 leading-relaxed">
            Flare Class: {nasaData.classType || "Normal"}<br />
            Peak Time: {nasaData.peakTime ? new Date(nasaData.peakTime).toLocaleTimeString() : "Scanning..."}
          </div>
        )}
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />

      {/* Primary Header */}
      {!selectedPlanet && (
        <div className="absolute top-16 left-16 pointer-events-none z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
            <span className="text-[11px] font-mono tracking-[1em] text-blue-400 uppercase">System_Wide_Scan</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter opacity-30 uppercase leading-none">Astro_Metric</h1>
          <p className="text-[10px] font-mono tracking-[0.4em] text-white/40 mt-6">SCROLL: DEPTH_ZOOM // CLICK: SPECTRAL_LOCK</p>
        </div>
      )}

      {/* Interaction Cursor Tag */}
      {hoveredPlanet && !selectedPlanet && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-4 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-full animate-pulse z-20 pointer-events-none">
          <span className="text-[11px] font-black tracking-[0.6em] text-blue-400 uppercase">Tracking: {hoveredPlanet}</span>
        </div>
      )}

      {/* DEEP ANALYTICS SPLIT-SCREEN PANEL */}
      {selectedPlanet && PLANET_INFO[selectedPlanet] && (
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
          <div className="w-full md:w-[42%] h-full bg-black/60 backdrop-blur-[60px] border-l border-white/10 p-12 md:p-20 flex flex-col justify-start pointer-events-auto shadow-[-150px_0_200px_rgba(0,0,0,0.9)] border-r-[20px] border-r-blue-600 animate-in slide-in-from-right-full duration-700 overflow-y-auto custom-scrollbar">

            <header className="mb-16 pt-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-[1px] bg-blue-500" />
                <span className="text-[11px] font-black tracking-[1em] text-blue-500 uppercase">Core_Telemetry</span>
              </div>
              <h2 className="text-8xl md:text-[10rem] font-black italic tracking-tighter leading-none" style={{ color: PLANET_INFO[selectedPlanet].color }}>
                {selectedPlanet}
              </h2>
              <div className="flex items-center gap-4 mt-8">
                <span className="px-4 py-1 border border-blue-500/30 text-blue-400 font-mono text-[10px] uppercase tracking-widest rounded-full">{PLANET_INFO[selectedPlanet].class}</span>
                <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Status: Signal_Lock</p>
              </div>
            </header>

            {/* Scientific Breakdown Section */}
            <div className="mb-16">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-6 border-b border-white/5 pb-2">Technical Summary</h3>
              <p className="text-xl md:text-2xl font-mono leading-relaxed text-gray-300">
                {typewriter}<span className="inline-block w-4 h-8 bg-blue-500 ml-2 animate-pulse" />
              </p>
            </div>

            {/* Detailed Physics Grid */}
            <div className="mb-16">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-8 border-b border-white/5 pb-2">Planetary Physics</h3>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(PLANET_INFO[selectedPlanet].stats).map(([k, v]) => (
                  <div key={k} className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 group hover:border-blue-500/40 transition-all">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-bold">{k}</p>
                    <p className="text-2xl font-black">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compositional Analysis */}
            <div className="mb-16">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-8 border-b border-white/5 pb-2">Chemical Composition</h3>
              <div className="space-y-4">
                {Object.entries(PLANET_INFO[selectedPlanet].composition).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white/60 uppercase tracking-widest">{k}</span>
                    <div className="flex-1 mx-6 h-[1px] bg-white/10" />
                    <span className="text-sm font-black text-blue-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orbital Vectors */}
            <div className="mb-16">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-8 border-b border-white/5 pb-2">Orbital Dynamics</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(PLANET_INFO[selectedPlanet].mechanics).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <p className="text-[8px] text-gray-600 uppercase mb-1">{k}</p>
                    <p className="text-[11px] font-mono font-bold text-white/80">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Interface */}
            <div className="flex gap-4 mt-auto pt-10">
              <button
                onClick={handleSpeak}
                className={`flex-1 py-8 rounded-[50px] font-black uppercase text-[12px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${isSpeaking ? 'bg-red-600 shadow-2xl shadow-red-600/40' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {isSpeaking ? 'Kill_Audio' : 'Neural_Voice_Sync'}
              </button>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="px-12 py-8 bg-white/[0.04] hover:bg-white/10 rounded-[50px] border border-white/10 transition-all uppercase text-[11px] font-black tracking-[0.4em]"
              >
                Close
              </button>
            </div>

            <p className="text-[9px] font-mono text-white/5 mt-16 text-center tracking-[1.5em] uppercase">Security_Protocol_Active // NASA_SOURCE_2024</p>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
      `}</style>
    </div>
  );
}