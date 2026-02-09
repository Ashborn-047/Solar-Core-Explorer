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
import { createSpacetimeGrid } from './components/visuals/SpacetimeGrid';

import { PLANET_INFO, PLANET_CONFIG, MISSION_DATA } from './data';
import DeepDiveOverlay from './components/overlays/DeepDiveOverlay';
import MissionsPage from './pages/MissionsPage';
import { Microscope, Rocket } from 'lucide-react';


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
  const isInteracting = useRef(false);

  // UI Consolidation States
  const [isHUDOpen, setIsHUDOpen] = useState(window.innerWidth > 768);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [showMissionsPage, setShowMissionsPage] = useState(false);

  // Phase 4 Deep Dive Expansion States
  const [isExploringMore, setIsExploringMore] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [activeDeepDiveModule, setActiveDeepDiveModule] = useState('Geography');
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [isStructuralView, setIsStructuralView] = useState(false);
  const [isHeatmapView, setIsHeatmapView] = useState(false);
  const [isGravityView, setIsGravityView] = useState(false);
  const [isRoverView, setIsRoverView] = useState(false);
  const [isCameraStabilized, setIsCameraStabilized] = useState(false);

  useEffect(() => {
    stateRef.current = {
      selected: selectedPlanet,
      timeScale: timeScale,
      isLabMode: isLabMode,
      showMissions: showMissions,
      audioEnabled: audioEnabled,
      isExploringMore: isExploringMore,
      activeLandmark: activeLandmark,
      nasaData: nasaData,
      isStructuralView: isStructuralView,
      isHeatmapView: isHeatmapView,
      isGravityView: isGravityView,
      isRoverView: isRoverView,
      isCameraStabilized: isCameraStabilized
    };
  }, [selectedPlanet, timeScale, isLabMode, showMissions, audioEnabled, isExploringMore, activeLandmark, nasaData, isStructuralView, isHeatmapView, isGravityView, isRoverView]);

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
    const planetInfo = PLANET_INFO[selectedPlanet] || {};
    const text = `Analyzing ${selectedPlanet}. Classification: ${planetInfo.class || 'Unknown'}. ${planetInfo.description || 'No data available.'}`;

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

      // Dynamic Mission Objects (only render missions with path data)
      MISSION_DATA.forEach(m => {
        if (!m.path || !Array.isArray(m.path)) return; // Skip missions without 3D path data

        const points = m.path.map(p => new THREE.Vector3(...p));
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        const mat = new THREE.LineBasicMaterial({ color: m.color, transparent: true, opacity: 0.6 });
        const line = new THREE.Line(geo, mat);

        // Agency-specific Notations (Shapes)
        let markerGeo;
        switch (m.agency) {
          case 'ISRO': markerGeo = new THREE.OctahedronGeometry(1.2); break;
          case 'ESA': markerGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5); break;
          case 'CNSA': markerGeo = new THREE.ConeGeometry(1, 2, 8); break;
          case 'USSR': markerGeo = new THREE.TetrahedronGeometry(1.5); break;
          default: markerGeo = new THREE.SphereGeometry(1.2, 16, 16); // NASA/Default
        }

        const markerMat = new THREE.MeshBasicMaterial({ color: m.color });
        const marker = new THREE.Mesh(markerGeo, markerMat);

        const pulseGeo = new THREE.SphereGeometry(2.2, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.3 });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        marker.add(pulse);
        marker.userData = {
          name: m.name,
          size: 2,
          type: 'mission',
          agency: m.agency,
          description: m.description,
          target: m.target
        };

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
        Pluto: createPluto,
        'Asteroid Belt': size => createMoon(size, '#777777', 'Asteroid Belt')
      };

      const sunAsset = createSun();
      // Sun poles should now appear at top/bottom without rotation
      scene.add(sunAsset.mesh);


      const spacetimeGrid = createSpacetimeGrid();
      scene.add(spacetimeGrid.mesh);

      const roverSphere = new THREE.Mesh(
        new THREE.SphereGeometry(300, 64, 64),
        new THREE.MeshStandardMaterial({
          side: THREE.BackSide,
          metalness: 0,
          roughness: 1,
          transparent: true,
          opacity: 0,
          depthWrite: false
        })
      );
      scene.add(roverSphere);

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

        // CLICK PROTECTION: Ignore clicks on HUD/UI overlays
        if (e.type === 'mousedown' && e.target && e.target.closest('.pointer-events-auto')) {
          return;
        }

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

        // Update Spacetime Grid
        const gravityTarget = groups.find(g => g.data.name === selected);
        let gravityPos = new THREE.Vector3(0, 0, 0); // Default to Sun
        let gravityMass = 30; // Sun mass unit
        if (gravityTarget && selected !== 'Sun') {
          gravityTarget.asset.mesh.getWorldPosition(gravityPos);
          gravityMass = (gravityTarget.data.size || 1) * 0.5;
        }
        spacetimeGrid.update(st, stateRef.current, gravityPos, gravityMass);

        // Update Rover Perspective
        if (stateRef.current.isRoverView && gravityTarget) {
          roverSphere.visible = true;
          roverSphere.position.copy(camera.position);
          roverSphere.material.opacity = THREE.MathUtils.lerp(roverSphere.material.opacity, 1, 0.1);
          roverSphere.material.color.set(gravityTarget.data.color || '#ffffff');
          // Add some procedural noise/scale if needed
        } else {
          roverSphere.material.opacity = THREE.MathUtils.lerp(roverSphere.material.opacity, 0, 0.1);
          if (roverSphere.material.opacity < 0.01) roverSphere.visible = false;
        }

        sunAsset.update(st, stateRef.current.nasaData);

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
          item.asset.update(st, stateRef.current);

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
              let offset, lookAtOffset;

              const activeLM = stateRef.current.activeLandmark;
              const isExMore = stateRef.current.isExploringMore;

              if (activeLM && PLANET_INFO[selected]?.landmarks) {
                const landmark = PLANET_INFO[selected].landmarks.find(l => l.name === activeLM);
                if (landmark) {
                  // Landmark view: Tighter crop and specific angle
                  const [lx, ly, lz] = landmark.coords;
                  offset = new THREE.Vector3(lx * 2, ly * 1.5, lz * 2).add(new THREE.Vector3(0, size * 0.5, size * 1.2));
                  lookAtOffset = new THREE.Vector3(lx, ly, lz);
                }
              } else if (isExMore) {
                // Deep Dive Mode: Pull back Sun specifically, others closer
                const zoomMult = selected === 'Sun' ? 4 : 2;
                offset = new THREE.Vector3(size * zoomMult, size * 0.8, size * (zoomMult + 1));
                // Look slightly to the right of center to push planet to the left (clear space for right-HUD)
                lookAtOffset = new THREE.Vector3(size * 1.5, 0, 0);
              } else {
                // Normal Dashboard Mode: Look even further right
                offset = new THREE.Vector3(size * 4, size * 1.5, size * 8);
                lookAtOffset = new THREE.Vector3(size * 4, 0, 0);
              }

              if (!stateRef.current.isCameraStabilized) {
                camera.position.lerp(worldPos.clone().add(offset), 0.05);
                controls.target.lerp(worldPos.clone().add(lookAtOffset), 0.05);
              }
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
      {/* IMMERSIVE MODE TOGGLE */}
      <button
        onClick={() => setIsImmersive(!isImmersive)}
        className="absolute top-4 right-4 z-[10003] p-2 bg-black/60 border border-white/20 rounded-full hover:bg-white/10 transition-all text-white/50 hover:text-white"
        title="Toggle Immersive Mode"
      >
        <div className={`w-3 h-3 rounded-full ${isImmersive ? 'bg-green-500 shadow-[0_0_10px_#00ff00]' : 'border border-white/50'}`} />
      </button>

      {/* CONSOLIDATED SYSTEM STATUS (TOP LEFT) */}
      {!isImmersive && (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
          {/* Diagnostic & NASA Panel */}
          <div className={`transition-all duration-500 overflow-hidden bg-black/80 border border-cyan-500/30 backdrop-blur-xl rounded-lg ${isSystemOpen ? 'max-h-[500px] w-64 p-4 opacity-100' : 'max-h-0 w-64 p-0 opacity-0'}`}>
            <div className="text-[10px] font-black text-cyan-500 mb-3 border-b border-cyan-500/20 pb-1">SYSTEM_DIAGNOSTICS</div>
            <div className="space-y-2 text-[9px]">
              <div className="flex justify-between">
                <span className="text-white/40 uppercase">Engine_Ref</span>
                <span className="text-cyan-400 font-bold">OPTIMAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 uppercase">Telemetry</span>
                <span className="text-green-400 font-bold">ACTIVE</span>
              </div>
              <button onClick={() => window.location.reload()} className="w-full mt-2 py-1 bg-cyan-500 text-black font-bold uppercase rounded hover:bg-cyan-400 transition-all">Flush_Cache</button>
            </div>

            <div className="text-[10px] font-black text-cyan-500 mt-4 mb-2 border-b border-cyan-500/20 pb-1 uppercase">NASA_Solar_Live</div>
            {nasaData ? (
              <div className="text-[9px] text-cyan-400 opacity-80 leading-relaxed">
                Flare Class: {nasaData.classType || "Normal"}<br />
                Peak Time: {nasaData.peakTime ? new Date(nasaData.peakTime).toLocaleTimeString() : "Scanning..."}
              </div>
            ) : (
              <div className="text-[9px] text-cyan-400/50 italic">Syncing with NASA DONKI...</div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsSystemOpen(!isSystemOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-cyan-500/30 backdrop-blur-md rounded-full text-[9px] font-black tracking-widest text-cyan-500/80 hover:bg-cyan-500/20 transition-all uppercase"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            {isSystemOpen ? "Close_Link" : "System_Status"}
          </button>
        </div>
      )}

      {isBooting && (
        <div className="absolute inset-0 z-[20000] bg-[#050508] flex flex-col items-center justify-center p-10 font-mono animate-in fade-in duration-300">
          <div className="w-full max-w-2xl border border-cyan-500/30 bg-black/40 backdrop-blur-3xl p-8 rounded-lg shadow-[0_0_100px_rgba(6,182,212,0.1)] relative overflow-hidden">
            {/* BRAIN SCAN ANIMATION */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 animate-scan shadow-[0_0_10px_#06b6d4]" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <h2 className="text-xl font-black text-cyan-400 tracking-widest uppercase">Initializing_Deep_Scan</h2>
                <p className="text-[10px] text-cyan-500/40 uppercase tracking-[0.5em]">Auth: Hyperion_Secure_Kernel_V4</p>
              </div>
            </div>

            <div className="space-y-2 text-[10px] text-cyan-400/60 lowercase leading-relaxed">
              <div className="flex gap-3"><span className="text-white/20">[00.012]</span> <span>loading_astrometric_shrub_logic...</span> <span className="text-green-500 ml-auto">OK</span></div>
              <div className="flex gap-3"><span className="text-white/20">[00.451]</span> <span>mapping_planetary_axial_tilt...</span> <span className="text-green-500 ml-auto">OK</span></div>
              <div className="flex gap-3"><span className="text-white/20">[00.982]</span> <span>syncing_nasa_donki_flare_vectors...</span> <span className="text-green-500 ml-auto">OK</span></div>
              <div className="flex gap-3"><span className="text-white/20">[01.102]</span> <span>preparing_immersive_buffer_report...</span> <span className="text-yellow-500 ml-auto">PENDING</span></div>
              <div className="flex gap-3 animate-pulse"><span className="text-white/20">[01.562]</span> <span>connecting_to_{selectedPlanet?.toLowerCase()}_telemetry...</span></div>
            </div>

            <div className="mt-8 pt-6 border-t border-cyan-500/20 flex justify-between items-end">
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-widest text-white/40">Data_Throughput</div>
                <div className="flex gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-cyan-500/20 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-cyan-500 animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-black text-cyan-500">BOOT_PROCESS: 68%</span>
            </div>
          </div>

          <style>{`
            @keyframes scan {
              0% { transform: translateY(0); opacity: 0; }
              50% { opacity: 0.8; }
              100% { transform: translateY(400px); opacity: 0; }
            }
            .animate-scan {
              animation: scan 1.5s linear infinite;
            }
          `}</style>
        </div>
      )}

      {errorStatus && (
        <div className="absolute inset-0 z-[10000] bg-[#1a0000] text-[#ff5555] p-10 sm:p-20 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-black italic tracking-tighter leading-none">SYSTEM_CRASH</h1>
          <p className="text-lg sm:text-xl md:text-2xl mt-4 opacity-80 uppercase tracking-widest font-mono">Terminal_Malfunction: <b className="text-white">{errorStatus}</b></p>
          <button onClick={() => window.location.reload()} className="mt-12 px-8 py-4 bg-[#ff5555] text-white font-black uppercase tracking-[0.3em] hover:bg-red-400 transition-all w-fit">Reboot Engine</button>
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

      {/* GLOBAL HUD COMMAND SLATE - Repositioned to the left to avoid overlapping info cards */}
      {!isImmersive && (
        <>
          <div className={`absolute bottom-8 left-8 z-50 flex flex-col gap-4 p-6 bg-[#050508]/90 border border-white/10 backdrop-blur-3xl rounded-3xl w-72 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ${isHUDOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-[10px] tracking-[0.3em] text-cyan-500 uppercase font-black">Command_Unit</div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <button
                onClick={() => setIsHUDOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/30 hover:text-white"
              >
                <div className="w-3 h-[1px] bg-current" />
              </button>
            </div>

            {/* Time Scale Controller */}
            <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[10px] font-black tracking-widest text-white/40">
                <span>TEMPORAL_DRIFT</span>
                <span className="text-cyan-400">{timeScale.toFixed(1)}x</span>
              </div>
              <input
                type="range" min="-10" max="100" step="0.5" value={timeScale}
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                className="w-full appearance-none bg-cyan-900/40 h-1.5 rounded-full outline-none accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Lens Mode Switcher */}
            <div className="grid grid-cols-2 gap-2">
              {['normal', 'thermal', 'xray', 'retro'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setLensMode(mode)}
                  className={`py-2 text-[8px] font-black rounded-lg border transition-all uppercase tracking-widest ${lensMode === mode ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 border-white/5 text-white/30 hover:text-white/60'}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="h-[1px] bg-white/5 my-1" />


            {/* MISSIONS PAGE BUTTON */}
            <button
              onClick={() => setShowMissionsPage(true)}
              className="w-full px-3 py-3 text-[9px] font-black tracking-widest rounded-xl border transition-all bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 flex items-center justify-center gap-2"
            >
              <Rocket size={12} />
              MISSION_CONTROL
            </button>

            <div className="h-[1px] bg-white/5 my-1" />

            {/* Toggles Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsCameraStabilized(!isCameraStabilized)}
                className={`px-3 py-3 text-[9px] font-black tracking-widest rounded-xl border transition-all ${isCameraStabilized ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/5 text-white/30 hover:text-white/60'}`}
              >
                STABLE_CAM
              </button>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`px-3 py-3 text-[9px] font-black tracking-widest rounded-xl border transition-all ${audioEnabled ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-white/30 hover:text-white/60'}`}
              >
                AUDIO_{audioEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setIsLabMode(!isLabMode)}
                className={`px-3 py-3 text-[9px] font-black tracking-widest rounded-xl border transition-all ${isLabMode ? 'bg-yellow-500/20 border-yellow-400 text-yellow-500' : 'bg-white/5 border-white/5 text-white/30 hover:text-white/60'}`}
              >
                LAB_LINK
              </button>
            </div>
          </div>

          {/* Persistent Restore Button (when HUD is closed) */}
          {!isHUDOpen && (
            <button
              onClick={() => setIsHUDOpen(true)}
              className="absolute bottom-8 left-8 z-50 p-4 bg-[#050508]/80 border border-cyan-500/30 backdrop-blur-xl rounded-2xl flex items-center gap-3 text-cyan-500 hover:bg-cyan-500/10 transition-all animate-in slide-in-from-left-4 duration-500 shadow-2xl group"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:animate-ping" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">Open_Command_Deck</span>
            </button>
          )}
        </>
      )}

      {/* HUD Toggle FAB (Mobile Only) */}
      <div className="absolute bottom-4 right-4 z-[60] sm:hidden">
        <button
          onClick={() => setIsHUDOpen(!isHUDOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border shadow-2xl ${isHUDOpen ? 'bg-red-500/20 border-red-500 rotate-45' : 'bg-cyan-500/20 border-cyan-500'}`}
        >
          <div className={`w-6 h-0.5 bg-current absolute transition-all ${isHUDOpen ? 'translate-y-0' : '-translate-y-1'}`} />
          <div className={`w-6 h-0.5 bg-current absolute transition-all ${isHUDOpen ? 'hidden' : 'translate-y-1'}`} />
          <div className={`w-6 h-0.5 bg-current absolute transition-all ${isHUDOpen ? 'opacity-0' : 'opacity-100'}`} />
        </button>
      </div>

      {/* Lab Mode Overlay */}
      {
        isLabMode && !isImmersive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none px-4">
            <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border-2 border-yellow-500/50 rounded-full animate-ping opacity-20" />
            <div className="absolute top-full text-yellow-500 text-[8px] sm:text-[10px] mt-4 text-center w-full uppercase tracking-[0.2em] sm:tracking-widest font-bold">
              Laboratory Scale Calibration
            </div>
          </div>
        )
      }

      {/* Cinematic HUD Overlays */}
      {
        !isImmersive && (
          <div className="absolute inset-0 pointer-events-none border-[1px] border-white/[0.03]" />
        )
      }

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />

      {/* Primary Header */}
      {
        !selectedPlanet && !isImmersive && (
          <div className="absolute top-16 left-4 sm:top-20 sm:left-16 pointer-events-none z-10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-ping" />
              <span className="text-[8px] sm:text-[11px] font-mono tracking-[0.4em] sm:tracking-[1em] text-blue-400 uppercase">System_Wide_Scan</span>
            </div>
            <h1 className="text-4xl sm:text-7xl md:text-9xl font-black italic tracking-tighter opacity-10 sm:opacity-30 uppercase leading-none">Astro_Metric</h1>
            <p className="hidden sm:block text-[10px] font-mono tracking-[0.4em] text-white/40 mt-6 uppercase">SCROLL: DEPTH_ZOOM // CLICK: SPECTRAL_LOCK</p>
          </div>
        )
      }

      {/* Interaction Cursor Tag */}
      {
        hoveredPlanet && !selectedPlanet && (
          <div className="absolute bottom-24 sm:bottom-16 left-1/2 -translate-x-1/2 px-8 sm:px-12 py-3 sm:py-4 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-full animate-pulse z-20 pointer-events-none">
            <span className="text-[9px] sm:text-[11px] font-black tracking-[0.3em] sm:tracking-[0.6em] text-blue-400 uppercase">Tracking: {hoveredPlanet}</span>
          </div>
        )
      }

      {/* DEEP ANALYTICS SPLIT-SCREEN PANEL */}
      {
        selectedPlanet && PLANET_INFO[selectedPlanet] && !isExploringMore && (
          <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
            <div className="w-full md:w-[42%] h-full bg-black/60 backdrop-blur-[60px] border-l border-white/10 p-6 sm:p-12 md:p-20 flex flex-col justify-start pointer-events-auto shadow-[-150px_0_200px_rgba(0,0,0,0.9)] border-r-[10px] sm:border-r-[20px] border-r-blue-600 animate-in slide-in-from-right-full duration-700 overflow-y-auto custom-scrollbar">

              <header className="mb-8 sm:mb-16 pt-10 sm:pt-10">
                <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-8">
                  <div className="w-12 sm:w-20 h-[1px] bg-blue-500" />
                  <span className="text-[9px] sm:text-[11px] font-black tracking-[0.5em] sm:tracking-[1em] text-blue-500 uppercase">Core_Telemetry</span>
                </div>
                <h2 className="text-5xl sm:text-8xl md:text-[10rem] font-black italic tracking-tighter leading-none" style={{ color: PLANET_INFO[selectedPlanet].color }}>
                  {selectedPlanet}
                </h2>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <span className="px-3 py-0.5 sm:px-4 sm:py-1 border border-blue-500/30 text-blue-400 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest rounded-full">{PLANET_INFO[selectedPlanet].class}</span>
                  <p className="text-white/20 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em]">Status: Signal_Lock</p>
                </div>
              </header>

              {/* Scientific Breakdown Section */}
              <div className="mb-8 sm:mb-16">
                <h3 className="text-[9px] sm:text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-4 sm:mb-6 border-b border-white/5 pb-2">Technical Summary</h3>
                <p className="text-lg sm:text-xl md:text-2xl font-mono leading-relaxed text-gray-300">
                  {typewriter}<span className="inline-block w-3 h-6 sm:w-4 sm:h-8 bg-blue-500 ml-2 animate-pulse" />
                </p>
              </div>

              {/* Detailed Physics Grid */}
              {PLANET_INFO[selectedPlanet]?.stats && Object.keys(PLANET_INFO[selectedPlanet].stats).length > 0 && (
                <div className="mb-8 sm:mb-16">
                  <h3 className="text-[9px] sm:text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-6 sm:mb-8 border-b border-white/5 pb-2">Planetary Physics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {Object.entries(PLANET_INFO[selectedPlanet].stats).map(([k, v]) => (
                      <div key={k} className="bg-white/[0.02] p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] border border-white/5 group hover:border-blue-500/40 transition-all">
                        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-1 sm:mb-2 font-bold">{k}</p>
                        <p className="text-xl sm:text-2xl font-black">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Compositional Analysis */}
              {PLANET_INFO[selectedPlanet]?.composition && Object.keys(PLANET_INFO[selectedPlanet].composition).length > 0 && (
                <div className="mb-8 sm:mb-16">
                  <h3 className="text-[9px] sm:text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-4 sm:mb-8 border-b border-white/5 pb-2">Chemical Composition</h3>
                  <div className="space-y-2 sm:space-y-4">
                    {Object.entries(PLANET_INFO[selectedPlanet].composition).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-mono text-white/60 uppercase tracking-widest">{k}</span>
                        <div className="flex-1 mx-3 sm:mx-6 h-[1px] bg-white/10" />
                        <span className="text-xs sm:text-sm font-black text-blue-400">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}



              {/* Orbital Vectors */}
              {PLANET_INFO[selectedPlanet]?.mechanics && Object.keys(PLANET_INFO[selectedPlanet].mechanics).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[9px] sm:text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-6 sm:mb-8 border-b border-white/5 pb-2">Orbital Dynamics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(PLANET_INFO[selectedPlanet].mechanics).map(([k, v]) => (
                      <div key={k} className="text-center p-3 bg-white/5 rounded-2xl sm:bg-transparent sm:p-0">
                        <p className="text-[7px] sm:text-[8px] text-gray-600 uppercase mb-1 font-bold">{k}</p>
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-white/80">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Mission History Integration (Fixed Visibility) */}
              <div className="mb-8 sm:mb-16">
                <h3 className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase mb-6 border-b border-blue-500/20 pb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  Active_&_Historical_Missions
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {MISSION_DATA.filter(m => m.target === selectedPlanet || (selectedPlanet === 'Earth' && m.path?.[0]?.join?.(',') === '65,0,0')).map(m => (

                    <div key={m.name} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-white group-hover:text-blue-400 transition-colors">{m.name}</span>
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{m.agency}</span>
                      </div>
                      <p className="text-[10px] text-white/40 leading-relaxed mb-4">{m.description}</p>

                      {m.scientific_goal && (
                        <div className="mb-3 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Microscope size={12} className="text-blue-400" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-400/80">Scientific_Objective</span>
                          </div>
                          <p className="text-[9px] text-white/60 leading-relaxed italic">{m.scientific_goal}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[8px] font-mono uppercase tracking-widest text-white/20">
                        <span>Launch: {m.launch}</span>
                        <span>Target: {m.target}</span>
                        <span className={m.status === 'Active' ? 'text-green-500/50' : ''}>Status: {m.status}</span>
                      </div>
                    </div>
                  ))}
                  {MISSION_DATA.filter(m => m.target === selectedPlanet || (selectedPlanet === 'Earth' && m.path?.[0]?.join?.(',') === '65,0,0')).length === 0 && (

                    <p className="text-[10px] font-mono text-white/20 italic">No mission data recorded for this sector.</p>
                  )}
                </div>
              </div>

              {/* Action Interface */}
              <div className="flex flex-col gap-4 mt-auto pt-10 pb-8 sm:pb-0">
                <button
                  onClick={() => {
                    setIsBooting(true);
                    setIsHUDOpen(false);
                    isInteracting.current = false;

                    // Simulate system boot-up sequence
                    setTimeout(() => {
                      setIsExploringMore(true);
                      setIsBooting(false);
                    }, 2500);
                  }}
                  className="w-full py-6 sm:py-8 bg-gradient-to-r from-blue-900 to-blue-600 rounded-[50px] font-black uppercase text-[12px] sm:text-[14px] tracking-[0.5em] transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400/40 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  Explore_More
                </button>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleSpeak}
                    className={`flex-1 py-5 sm:py-8 rounded-[50px] font-black uppercase text-[10px] sm:text-[12px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 sm:gap-4 ${isSpeaking ? 'bg-red-600 shadow-2xl shadow-red-600/40' : 'bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40'}`}
                  >
                    {isSpeaking ? 'Kill_Audio' : 'Neural_Voice_Sync'}
                  </button>
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="px-8 sm:px-12 py-5 sm:py-8 bg-white/[0.04] hover:bg-white/10 rounded-[50px] border border-white/10 transition-all uppercase text-[9px] sm:text-[11px] font-black tracking-[0.4em]"
                  >
                    Close
                  </button>
                </div>
              </div>

              <p className="text-[9px] font-mono text-white/5 mt-16 text-center tracking-[1.5em] uppercase">Security_Protocol_Active // NASA_SOURCE_2024</p>
            </div>
          </div>
        )
      }

      {/* PHASE 4: DEEP DIVE OVERLAY */}
      {
        selectedPlanet && isExploringMore && (
          <DeepDiveOverlay
            planetName={selectedPlanet}
            activeModule={activeDeepDiveModule}
            setActiveModule={setActiveDeepDiveModule}
            activeLandmark={activeLandmark}
            setActiveLandmark={setActiveLandmark}
            isStructuralView={isStructuralView}
            setIsStructuralView={setIsStructuralView}
            isHeatmapView={isHeatmapView}
            setIsHeatmapView={setIsHeatmapView}
            isGravityView={isGravityView}
            setIsGravityView={setIsGravityView}
            isRoverView={isRoverView}
            setIsRoverView={setIsRoverView}
            onOpenMissions={() => {
              setIsExploringMore(false);
              setShowMissionsPage(true);
            }}
            onClose={() => {
              setIsExploringMore(false);
              setActiveLandmark(null);
              setIsStructuralView(false);
              setIsHeatmapView(false);
              setIsGravityView(false);
              setIsRoverView(false);
              setIsHUDOpen(true);
            }}
          />
        )
      }

      {/* MISSIONS PAGE OVERLAY */}
      {showMissionsPage && (
        <MissionsPage onClose={() => setShowMissionsPage(false)} />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
      `}</style>
    </div >
  );
}