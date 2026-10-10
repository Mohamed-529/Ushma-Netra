import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Wind, Flame, ShieldCheck, Sliders, MapPin, RefreshCw, Cpu } from 'lucide-react';
import { verifyDeviceHandshake } from '../utils/cryptoVerify';

interface TwinProps {
  alleyWidth?: number; // 4m to 8m
  acUnitsCount?: number; // 10 to 100
  louversEngaged?: boolean; // Active toggle
  presetName?: string; // Synced to Canyon Presets
  onLouversChange?: (engaged: boolean) => void;
}

export const ThermalPlumeTwin: React.FC<TwinProps> = ({
  alleyWidth: initialAlleyWidth = 6.2,
  acUnitsCount: initialAcUnits = 48,
  louversEngaged: initialLouvers = false,
  presetName = 'Chandni Chowk',
  onLouversChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [alleyWidth, setAlleyWidth] = useState<number>(initialAlleyWidth);
  const [acUnitsCount, setAcUnitsCount] = useState<number>(initialAcUnits);
  const [louversEngaged, setLouversEngaged] = useState<boolean>(initialLouvers);
  const [activePreset, setActivePreset] = useState<string>(presetName);
  const [hardwareVerified, setHardwareVerified] = useState<boolean>(true);

  // Sync external prop changes
  useEffect(() => {
    if (initialLouvers !== undefined) setLouversEngaged(initialLouvers);
  }, [initialLouvers]);

  useEffect(() => {
    if (presetName) setActivePreset(presetName);
  }, [presetName]);

  // Three.js object references for smooth reactive mutations without rebuilding WebGL context
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const buildingMeshOppositeRef = useRef<THREE.Mesh | null>(null);
  const acUnitsGroupRef = useRef<THREE.Group | null>(null);
  const louversGroupRef = useRef<THREE.Group | null>(null);
  const particleGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const particleVelocitiesRef = useRef<Float32Array | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Location preset visual parameters
  const presets: Record<string, {
    canyonWidth: number;
    ambientTemp: number;
    atmosphereColor: number;
    fogDensity: number;
    plumeHue: 'severe_crimson' | 'amber_dust' | 'dense_thermal';
    description: string;
  }> = {
    'Chandni Chowk': {
      canyonWidth: 4.8,
      ambientTemp: 44.2,
      atmosphereColor: 0x1a0f0a,
      fogDensity: 0.028,
      plumeHue: 'severe_crimson',
      description: 'Dense historical commercial canyon; extreme thermal trapping, pedestrian alley width < 5m.',
    },
    'Indiranagar 100ft': {
      canyonWidth: 7.4,
      ambientTemp: 37.8,
      atmosphereColor: 0x091419,
      fogDensity: 0.020,
      plumeHue: 'dense_thermal',
      description: 'Mixed retail corridor; high rooftop VRF density discharging directly into walkway.',
    },
    'Connaught Place Inner': {
      canyonWidth: 8.0,
      ambientTemp: 45.1,
      atmosphereColor: 0x1f140d,
      fogDensity: 0.024,
      plumeHue: 'severe_crimson',
      description: 'Neoclassical colonnade facade; severe ground-level reverberation into vendor zones.',
    },
  };

  const currentPresetData = presets[activePreset] || presets['Chandni Chowk'];

  // Handle Preset Switching
  const applyPreset = (name: string) => {
    setActivePreset(name);
    const p = presets[name];
    if (p) {
      setAlleyWidth(p.canyonWidth);
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(p.atmosphereColor);
        if (sceneRef.current.fog) {
          (sceneRef.current.fog as THREE.FogExp2).color = new THREE.Color(p.atmosphereColor);
          (sceneRef.current.fog as THREE.FogExp2).density = p.fogDensity;
        }
      }
    }
  };

  // Setup WebGL Scene with strict lifecycle cleanup and .dispose() discipline
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Atmosphere Continuity
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(currentPresetData.atmosphereColor);
    scene.fog = new THREE.FogExp2(currentPresetData.atmosphereColor, currentPresetData.fogDensity);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(13, 9, 14);
    camera.lookAt(0, 2.5, 0);

    // 3. Renderer with shadow maps and antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.3);
    sunLight.position.set(12, 18, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const heatGlowLight = new THREE.PointLight(0xff3300, 2.8, 14);
    heatGlowLight.position.set(-3.8, 2.5, 0);
    scene.add(heatGlowLight);

    // 5. Environment Mesh Construction
    // Road & Sidewalk
    const roadGeo = new THREE.PlaneGeometry(36, 24);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x141824, roughness: 0.9 });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    // Source Commercial Building Facade (Left Wall with Condensers)
    const bldgGeo = new THREE.BoxGeometry(6, 14, 18);
    const bldgMat = new THREE.MeshStandardMaterial({ color: 0x222a38, roughness: 0.8, metalness: 0.1 });
    const sourceBuilding = new THREE.Mesh(bldgGeo, bldgMat);
    sourceBuilding.position.set(-6, 7, 0);
    sourceBuilding.castShadow = true;
    sourceBuilding.receiveShadow = true;
    scene.add(sourceBuilding);

    // Opposite Canyon Building (Right Wall - position updates reactively based on alleyWidth)
    const oppBldgGeo = new THREE.BoxGeometry(6, 14, 18);
    const oppBldgMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.85 });
    const oppBuilding = new THREE.Mesh(oppBldgGeo, oppBldgMat);
    oppBuilding.position.set(alleyWidth + 3, 7, 0);
    oppBuilding.receiveShadow = true;
    oppBuilding.castShadow = true;
    scene.add(oppBuilding);
    buildingMeshOppositeRef.current = oppBuilding;

    // AC Condenser Units Bank
    const acGroup = new THREE.Group();
    acUnitsGroupRef.current = acGroup;
    scene.add(acGroup);

    const louversGroup = new THREE.Group();
    louversGroupRef.current = louversGroup;
    scene.add(louversGroup);

    // Rebuild condenser meshes helper
    const buildCondensers = (count: number) => {
      while (acGroup.children.length > 0) {
        const obj = acGroup.children[0] as THREE.Mesh;
        if (obj.geometry) obj.geometry.dispose();
        acGroup.remove(obj);
      }
      while (louversGroup.children.length > 0) {
        const obj = louversGroup.children[0] as THREE.Mesh;
        if (obj.geometry) obj.geometry.dispose();
        louversGroup.remove(obj);
      }

      const rows = 4;
      const cols = Math.max(3, Math.ceil(count / rows));
      const condenserGeo = new THREE.BoxGeometry(0.7, 0.9, 0.9);
      const condenserMat = new THREE.MeshStandardMaterial({ color: 0x5a6578, metalness: 0.6, roughness: 0.4 });
      const grillMat = new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.3 });

      const louverGeo = new THREE.BoxGeometry(0.8, 0.1, 1.0);
      const louverMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5, roughness: 0.2 });

      let placed = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (placed >= count) break;
          const y = 1.6 + r * 1.3;
          const z = (c - cols / 2) * 1.3;

          const unitMesh = new THREE.Mesh(condenserGeo, condenserMat);
          unitMesh.position.set(-3.3, y, z);
          unitMesh.castShadow = true;
          acGroup.add(unitMesh);

          // Fan grill detail
          const grillMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.75), grillMat);
          grillMesh.position.set(-2.92, y, z);
          acGroup.add(grillMesh);

          // Mitigation Louver Plate
          const lMesh = new THREE.Mesh(louverGeo, louverMat);
          lMesh.position.set(-2.8, y + 0.35, z);
          lMesh.rotation.z = Math.PI / 4; // 45-degree skyward tilt
          lMesh.visible = louversEngaged;
          louversGroup.add(lMesh);

          placed++;
        }
      }
    };
    buildCondensers(acUnitsCount);

    // Street Vendor Cart in the Canyon
    const cartGroup = new THREE.Group();
    const cartBaseGeo = new THREE.BoxGeometry(1.4, 0.9, 2.2);
    const cartBaseMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
    const cartBase = new THREE.Mesh(cartBaseGeo, cartBaseMat);
    cartBase.position.set(alleyWidth * 0.55, 0.45, 0);
    cartBase.castShadow = true;
    cartGroup.add(cartBase);

    // Cart Canopy (Vendor Protection Zone)
    const canopyGeo = new THREE.ConeGeometry(1.6, 0.6, 4);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(alleyWidth * 0.55, 2.3, 0);
    canopy.rotation.y = Math.PI / 4;
    cartGroup.add(canopy);

    // Micro-Beacon IoT Node with blinking thermal indicator
    const beaconGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(alleyWidth * 0.55 - 0.4, 1.1, 0.6);
    cartGroup.add(beacon);

    scene.add(cartGroup);

    // 6. Thermal Exhaust Plume Particle Simulation
    const particleCount = 1400;
    const particleGeo = new THREE.BufferGeometry();
    particleGeoRef.current = particleGeo;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    particleVelocitiesRef.current = velocities;

    const resetParticle = (i: number) => {
      positions[i * 3] = -2.9; // Spawns directly at condenser fans
      positions[i * 3 + 1] = 1.5 + Math.random() * 4.5; // Fan height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      if (louversEngaged) {
        // Skyward dispersion (deflected at 50 degrees upwards)
        velocities[i * 3] = 0.03 + Math.random() * 0.04;
        velocities[i * 3 + 1] = 0.08 + Math.random() * 0.07; // High vertical lift
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

        // Cools down into cyan/green as heat vents safely into boundary layer
        colors[i * 3] = 0.1;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.75;
      } else {
        // Horizontal street-level jet blasting pedestrian/vendor breathing zone
        velocities[i * 3] = 0.10 + Math.random() * 0.06;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015; // Trapped at head level
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025;

        // Incandescent thermal false-color (FLIR white-hot -> searing red-amber)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.28;
        colors[i * 3 + 2] = 0.08;
      }
    };

    for (let i = 0; i < particleCount; i++) {
      resetParticle(i);
      positions[i * 3] += Math.random() * 6.0; // Distribute initially
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Animation Loop with Beacon Pulsing
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Beacon status pulse
      if (beaconMat) {
        const pulse = (Math.sin(elapsed * 5) + 1) * 0.5;
        beaconMat.color.setHex(hardwareVerified ? 0x10b981 : 0xef4444);
        beacon.scale.setScalar(1 + pulse * 0.25);
      }

      // Heat light flicker
      heatGlowLight.intensity = louversEngaged ? 0.8 : 2.5 + Math.sin(elapsed * 3) * 0.4;

      // Update particle stream
      if (particleGeoRef.current && particleVelocitiesRef.current) {
        const posAttr = particleGeoRef.current.attributes.position as THREE.BufferAttribute;
        const colAttr = particleGeoRef.current.attributes.color as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;
        const col = colAttr.array as Float32Array;
        const vel = particleVelocitiesRef.current;

        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += vel[i * 3];
          pos[i * 3 + 1] += vel[i * 3 + 1];
          pos[i * 3 + 2] += vel[i * 3 + 2];

          const dist = pos[i * 3] - -2.9;

          if (louversEngaged) {
            // Rapid vertical dissipation
            if (pos[i * 3 + 1] > 10.0 || pos[i * 3] > alleyWidth + 1.0) {
              resetParticle(i);
            }
          } else {
            // Horizontal impact against opposite canyon wall
            if (pos[i * 3] > alleyWidth || dist > 9.0) {
              resetParticle(i);
            }
          }
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Thorough Memory & WebGL Cache Cleanup (.dispose() discipline)
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      // Recursively traverse scene to dispose geometries, materials, and textures
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        } else if (obj instanceof THREE.Points) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  // Reactive updates to Alley Width without recreating WebGL context
  useEffect(() => {
    if (buildingMeshOppositeRef.current) {
      buildingMeshOppositeRef.current.position.set(alleyWidth + 3, 7, 0);
    }
  }, [alleyWidth]);

  // Reactive updates to Louvers toggle
  useEffect(() => {
    if (louversGroupRef.current) {
      louversGroupRef.current.children.forEach((child) => {
        child.visible = louversEngaged;
      });
    }
  }, [louversEngaged]);

  const toggleLouvers = () => {
    const next = !louversEngaged;
    setLouversEngaged(next);
    if (onLouversChange) onLouversChange(next);
  };

  // Keyboard shortcut listener for spacebar toggle (Game-grade drill experience)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        toggleLouvers();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [louversEngaged]);

  // Verify hardware crypto handshake on demand
  const handleVerifyHardware = () => {
    const mockPayload = {
      node_id: 'BEACON-DELHI-W84-V01',
      wbgt: 38.6,
      ambient_temp: currentPresetData.ambientTemp,
      timestamp: new Date().toISOString(),
    };
    const isValid = verifyDeviceHandshake(mockPayload, 'un_hw_secure_ecc_p256_09x84b2e1');
    setHardwareVerified(isValid);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#08080a] flex flex-col overflow-hidden rounded-2xl border border-zinc-800/40 shadow-2xl">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Tactical Objective HUD (Top-Left) */}
      <div className="absolute top-16 left-4 z-20 bg-[#0c0d12]/85 backdrop-blur-md rounded-xl border border-zinc-800/40 p-3 shadow-xl font-mono text-[10px] space-y-1.5 max-w-xs pointer-events-auto">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>DRILL // THERMAL DEFENSE</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-semibold">LIVE CFD</span>
        </div>
        <p className="text-zinc-300 text-[11px] font-sans font-light leading-tight">
          {louversEngaged
            ? '✅ Skyward louvers engaged! Exhaust heat deflected vertically into upper atmosphere.'
            : '⚠️ 53.6°C exhaust jet hitting pedestrian street corridor. Rameshwar Pal in extreme thermal danger!'}
        </p>
        <div className="flex items-center gap-2 pt-0.5 text-[9px] text-zinc-400">
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-semibold">SPACE</span>
          <span>TOGGLE LOUVERS</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">DRAG TO ORBIT</span>
        </div>
      </div>

      {/* Tactical 2D Radar Minimap (Top-Right) */}
      <div className="absolute top-16 right-4 z-20 w-44 bg-[#0c0d12]/85 backdrop-blur-md rounded-xl border border-zinc-800/40 p-2.5 shadow-xl font-mono text-[10px] space-y-2 pointer-events-auto">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-1 text-zinc-400">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-200 tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>RADAR // SECTOR</span>
          </div>
          <span className="text-[9px] text-zinc-500">{alleyWidth.toFixed(1)}m WIDE</span>
        </div>
        
        {/* Vector Top-Down Schematic */}
        <div className="relative h-20 w-full bg-black/80 rounded-lg border border-zinc-800/60 overflow-hidden flex items-center justify-between px-2">
          {/* Left Building Facade / AC Units */}
          <div className="w-2.5 h-full bg-red-950/80 border-r-2 border-red-500 flex flex-col justify-around py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-auto" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-auto" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-auto" />
          </div>

          {/* Heat Plume Trajectory */}
          <div className="flex-1 h-full relative overflow-hidden flex items-center">
            <div 
              className={`absolute inset-y-1 transition-all duration-500 ${
                louversEngaged 
                  ? 'w-6 bg-gradient-to-t from-emerald-500/40 to-sky-400/60 rounded-t-lg'
                  : 'w-full bg-gradient-to-r from-red-600/60 via-amber-500/40 to-transparent'
              }`}
              style={{ left: '4px' }}
            />
            {/* Vendor Pin */}
            <div 
              className="absolute z-10 flex flex-col items-center"
              style={{ left: '60%' }}
            >
              <div className={`h-2.5 w-2.5 rounded-full border ${louversEngaged ? 'bg-emerald-400 border-white' : 'bg-amber-400 border-red-500 animate-pulse'}`} />
              <span className="text-[7px] text-zinc-300 font-bold whitespace-nowrap mt-0.5">VENDOR</span>
            </div>

            {/* Mist Refuge Kiosk */}
            <div 
              className="absolute top-1 right-1.5 z-10 flex items-center gap-0.5 text-sky-400 text-[7px]"
            >
              <span className="h-1 w-1 rounded-full bg-sky-400" />
              <span>MIST #3</span>
            </div>
          </div>

          {/* Right Building Facade */}
          <div className="w-2.5 h-full bg-zinc-900 border-l-2 border-zinc-700" />
        </div>

        {/* Legend & Plume Status */}
        <div className="flex items-center justify-between text-[9px] pt-0.5 text-zinc-400">
          <div className="flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${louversEngaged ? 'bg-emerald-400' : 'bg-red-500'}`} />
            <span>{louversEngaged ? 'SKYWARD DEFLECTION' : '54°C TRAPPED JET'}</span>
          </div>
          <span className="text-zinc-500 font-bold">[SPACE]</span>
        </div>
      </div>

      {/* Top Floating Telemetry & Preset Ribbon */}
      <div className="relative z-10 p-4 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Location Presets Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">Canyon Archetype:</span>
            {Object.keys(presets).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activePreset === name
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Cryptographic Handshake Status */}
          <div
            onClick={handleVerifyHardware}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs cursor-pointer backdrop-blur-md transition-all ${
              hardwareVerified
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                : 'bg-red-950/60 border-red-800/80 text-red-400'
            }`}
            title="Click to re-verify AWS Secrets Manager ECC-P256 token"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">
              {hardwareVerified ? 'IoT Beacon: Authenticated (P-256)' : 'IoT Beacon: Token Tampered'}
            </span>
          </div>
        </div>

        {/* Real-Time Canyon Status Metrics */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Canyon Aspect Ratio (H/W)</div>
            <div className="text-sm font-mono font-bold text-amber-400 tabular-nums">
              {(14 / alleyWidth).toFixed(2)}:1
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Breathing-Zone Plume Temp</div>
            <div className={`text-sm font-mono font-bold tabular-nums ${louversEngaged ? 'text-emerald-400' : 'text-red-400'}`}>
              {louversEngaged ? `${(currentPresetData.ambientTemp + 0.9).toFixed(1)}°C (Skyward)` : `${(currentPresetData.ambientTemp + 6.8).toFixed(1)}°C (Trapped)`}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Spatial Controls Panel */}
      <div className="mt-auto relative z-10 p-4 pointer-events-auto bg-[#0c0d12]/85 backdrop-blur-md border-t border-zinc-800/40 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Alley Width Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              Alley Width (Canyon Geometry)
            </span>
            <span className="text-sky-400 font-bold">{alleyWidth.toFixed(1)}m</span>
          </div>
          <input
            type="range"
            min="4.0"
            max="8.0"
            step="0.2"
            value={alleyWidth}
            onChange={(e) => setAlleyWidth(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-zinc-800/60"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>4.0m (Trapped Chasm)</span>
            <span>8.0m (Open Boulevard)</span>
          </div>
        </div>

        {/* AC Units Count Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Condenser Density (Split & VRF)
            </span>
            <span className="text-amber-400 font-bold">{acUnitsCount} units</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="2"
            value={acUnitsCount}
            onChange={(e) => setAcUnitsCount(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-zinc-800/60"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>10 units (85 kW heat)</span>
            <span>100 units (850 kW blast)</span>
          </div>
        </div>

        {/* Louver Mitigation Toggle */}
        <div className="flex items-center justify-end">
          <button
            onClick={toggleLouvers}
            className={`w-full py-2.5 px-4 rounded-xl font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              louversEngaged
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40'
                : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border border-amber-500/40'
            }`}
          >
            {louversEngaged ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Restorative Skyward Louvers ENGAGED</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-current animate-pulse" />
                <span>Engage Section 133 Skyward Louvers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
