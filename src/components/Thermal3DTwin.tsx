import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BuildingAudit, VendorTelemetry } from '../types';
import { Wind, Flame, ShieldCheck, Eye, RotateCcw, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';

interface Props {
  building: BuildingAudit;
  vendor: VendorTelemetry;
  onMitigationToggle?: (mitigated: boolean) => void;
}

export const Thermal3DTwin: React.FC<Props> = ({ building, vendor, onMitigationToggle }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [acLoadPct, setAcLoadPct] = useState<number>(95);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(3);
  const [selectedHotspot, setSelectedHotspot] = useState<'ac_exhaust' | 'vendor_cart' | 'street_canyon' | null>('ac_exhaust');
  const [cameraView, setCameraView] = useState<'pedestrian' | 'side' | 'isometric'>('isometric');

  // Animation & Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const particleGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const particleVelocitiesRef = useRef<Float32Array | null>(null);
  const deflectorMeshesRef = useRef<THREE.Mesh[]>([]);

  // Calculate dynamic temperatures
  const effectiveExhaustTemp = (36 + (acLoadPct / 100) * 18).toFixed(1);
  const effectiveStreetDelta = isMitigated
    ? '+1.2°C (Mitigated)'
    : `+${((acLoadPct / 100) * 6.5).toFixed(1)}°C (Artificial Plume)`;
  const currentPlumeTemp = isMitigated
    ? (building.ambientBaselineTempCelsius + 1.2).toFixed(1)
    : (building.ambientBaselineTempCelsius + (acLoadPct / 100) * 6.5).toFixed(1);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(14, 11, 16);
    camera.lookAt(0, 2.5, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3d6, 1.2);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Warm glow from AC exhaust bank
    const exhaustGlow = new THREE.PointLight(0xff4400, 2.5, 12);
    exhaustGlow.position.set(-3.5, 2.5, 0);
    scene.add(exhaustGlow);

    // 5. Build Environment
    // Ground - Asphalt Street & Sidewalks
    const roadGeo = new THREE.PlaneGeometry(36, 18);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x171d2b,
      roughness: 0.85,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    // Sidewalk on building side
    const sidewalkGeo = new THREE.BoxGeometry(4, 0.25, 18);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x242e42, roughness: 0.9 });
    const sidewalkBuilding = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalkBuilding.position.set(-3, 0.125, 0);
    sidewalkBuilding.receiveShadow = true;
    scene.add(sidewalkBuilding);

    // Sidewalk on vendor side
    const sidewalkVendor = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalkVendor.position.set(4.5, 0.125, 0);
    sidewalkVendor.receiveShadow = true;
    scene.add(sidewalkVendor);

    // Yellow road lane markings
    const laneGeo = new THREE.PlaneGeometry(0.2, 16);
    const laneMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const lane = new THREE.Mesh(laneGeo, laneMat);
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(0.7, 0.01, 0);
    scene.add(lane);

    // 6. Commercial Building Facade
    const buildingGeo = new THREE.BoxGeometry(7, 14, 18);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.6,
      metalness: 0.1,
    });
    const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);
    buildingMesh.position.set(-8.5, 7, 0);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    scene.add(buildingMesh);

    // Glass Windows on Building
    for (let floor = 1; floor <= 4; floor++) {
      for (let w = -7; w <= 7; w += 2.8) {
        const windowGeo = new THREE.BoxGeometry(0.1, 1.8, 1.8);
        const windowMat = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          roughness: 0.2,
          metalness: 0.8,
        });
        const windowMesh = new THREE.Mesh(windowGeo, windowMat);
        windowMesh.position.set(-4.95, floor * 2.8 + 1, w);
        scene.add(windowMesh);
      }
    }

    // 7. AC Outdoor Condenser Units Bank (Mounted on Building Exterior Wall)
    const acUnitsGroup = new THREE.Group();
    const acUnitGeo = new THREE.BoxGeometry(0.65, 0.75, 1.1);
    const acUnitMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5, roughness: 0.4 });
    const fanGrillMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    deflectorMeshesRef.current = [];

    // Create 3 rows of 5 units (15 major condenser units)
    for (let row = 0; row < 3; row++) {
      for (let col = -3; col <= 3; col += 1.5) {
        const unit = new THREE.Mesh(acUnitGeo, acUnitMat);
        unit.position.set(-4.6, 1.6 + row * 1.1, col);
        unit.castShadow = true;

        // Circular exhaust grill facing street
        const grillGeo = new THREE.CircleGeometry(0.32, 16);
        const grill = new THREE.Mesh(grillGeo, fanGrillMat);
        grill.rotation.y = Math.PI / 2;
        grill.position.set(0.33, 0, 0);
        unit.add(grill);

        // Add deflector cowl (toggled with isMitigated)
        const deflectorGeo = new THREE.BoxGeometry(0.5, 0.08, 1.0);
        const deflectorMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.3 });
        const deflector = new THREE.Mesh(deflectorGeo, deflectorMat);
        deflector.position.set(0.4, 0.35, 0);
        deflector.rotation.z = Math.PI / 4; // 45 degrees upward
        deflector.visible = isMitigated;
        unit.add(deflector);
        deflectorMeshesRef.current.push(deflector);

        acUnitsGroup.add(unit);
      }
    }
    scene.add(acUnitsGroup);

    // 8. Opposing Street Side - Street Vendor Stall (Tea & Snack Cart)
    const vendorGroup = new THREE.Group();
    vendorGroup.position.set(4.5, 0.25, 0);

    // Wooden cart body
    const cartGeo = new THREE.BoxGeometry(2.2, 0.9, 1.4);
    const cartMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
    const cart = new THREE.Mesh(cartGeo, cartMat);
    cart.position.y = 0.45;
    cart.castShadow = true;
    vendorGroup.add(cart);

    // Cart wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const wheel1 = new THREE.Mesh(wheelGeo, wheelMat);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(-0.8, 0.35, 0.7);
    vendorGroup.add(wheel1);

    const wheel2 = new THREE.Mesh(wheelGeo, wheelMat);
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.set(0.8, 0.35, 0.7);
    vendorGroup.add(wheel2);

    // Canopy / Umbrella over cart
    const canopyGeo = new THREE.ConeGeometry(1.6, 0.6, 8);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 2.4, 0);
    canopy.castShadow = true;
    vendorGroup.add(canopy);

    const canopyPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5);
    const canopyPoleMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const canopyPole = new THREE.Mesh(canopyPoleGeo, canopyPoleMat);
    canopyPole.position.set(0, 1.6, 0);
    vendorGroup.add(canopyPole);

    // Vendor avatar figure (simple low-poly representation)
    const personBodyGeo = new THREE.CylinderGeometry(0.25, 0.2, 1.1, 8);
    const personBodyMat = new THREE.MeshStandardMaterial({ color: 0xffedd5 });
    const personBody = new THREE.Mesh(personBodyGeo, personBodyMat);
    personBody.position.set(0, 0.8, 1.1);
    personBody.castShadow = true;
    vendorGroup.add(personBody);

    const personHeadGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const personHeadMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
    const personHead = new THREE.Mesh(personHeadGeo, personHeadMat);
    personHead.position.set(0, 1.5, 1.1);
    vendorGroup.add(personHead);

    scene.add(vendorGroup);

    // 9. Thermal Plume Particle System (Representing 53°C hot exhaust blast)
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    particleGeoRef.current = particleGeo;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    particleVelocitiesRef.current = velocities;

    const resetParticle = (i: number) => {
      // Spawn at random AC outdoor unit grill
      const zSpawn = (Math.random() - 0.5) * 8.5;
      const ySpawn = 1.6 + Math.random() * 2.8;
      positions[i * 3] = -4.3; // Right at exhaust grill
      positions[i * 3 + 1] = ySpawn;
      positions[i * 3 + 2] = zSpawn;

      if (isMitigated) {
        // Angled upwards at 45-60 degrees toward the sky/roof
        velocities[i * 3] = 0.04 + Math.random() * 0.04;
        velocities[i * 3 + 1] = 0.08 + Math.random() * 0.06; // Upward
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      } else {
        // Horizontally blasting directly across street toward vendor at head height
        velocities[i * 3] = 0.08 + (acLoadPct / 100) * 0.08 + Math.random() * 0.04; // Blowing +X
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // Stays at ground/head level!
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
      }

      // Initial color: Hot incandescent red-amber
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = isMitigated ? 0.6 : 0.25;
      colors[i * 3 + 2] = 0.05;
    };

    for (let i = 0; i < particleCount; i++) {
      resetParticle(i);
      // Scatter initial positions along path
      positions[i * 3] += Math.random() * 8.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update particles
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

          // Heat dissipation along path
          const distanceTraveled = pos[i * 3] - -4.3;

          if (isMitigated) {
            // Cools quickly into green/cyan as it dissipates high above
            col[i * 3] = Math.max(0.2, 1.0 - distanceTraveled * 0.1);
            col[i * 3 + 1] = Math.min(0.9, 0.4 + distanceTraveled * 0.08);
            col[i * 3 + 2] = 0.4;
          } else {
            // Stays angrily red-amber hitting street level
            col[i * 3] = 1.0;
            col[i * 3 + 1] = Math.max(0.15, 0.4 - distanceTraveled * 0.02);
            col[i * 3 + 2] = 0.05;
          }

          // Reset condition
          if (isMitigated) {
            if (pos[i * 3 + 1] > 9.5 || pos[i * 3] > 6.0) {
              resetParticle(i);
            }
          } else {
            if (pos[i * 3] > 6.5) {
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

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [isMitigated, acLoadPct]);

  // Handle Camera switch
  const setPresetCamera = (preset: 'pedestrian' | 'side' | 'isometric') => {
    setCameraView(preset);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (preset === 'pedestrian') {
      // Standing on sidewalk looking at exhaust blast
      cam.position.set(4.2, 1.7, 3.5);
      cam.lookAt(-4.5, 2.5, 0);
    } else if (preset === 'side') {
      // Cross-section looking along the canyon
      cam.position.set(0, 5, 14);
      cam.lookAt(0, 2.5, 0);
    } else {
      // High isometric
      cam.position.set(13, 10, 15);
      cam.lookAt(0, 2.5, 0);
    }
  };

  const toggleMitigation = () => {
    const next = !isMitigated;
    setIsMitigated(next);
    if (onMitigationToggle) {
      onMitigationToggle(next);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#090D16] flex flex-col overflow-hidden rounded-xl border border-slate-800">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Floating Telemetry HUD */}
      <div className="relative z-10 p-4 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800 text-xs">
          <span className="font-semibold text-slate-200">3D Micro-Canyon Digital Twin</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{building.name}</span>
          <span className="text-slate-500">·</span>
          <span className="text-amber-400 font-mono font-medium">7.2m Canyon Width</span>
        </div>

        {/* Real-time Thermal Metrics Strip */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">AC Exhaust Temp</div>
            <div className="text-sm font-mono font-bold text-red-400 tabular-nums">
              {effectiveExhaustTemp}°C
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Street Heat Delta</div>
            <div className={`text-sm font-mono font-bold tabular-nums ${isMitigated ? 'text-emerald-400' : 'text-amber-400'}`}>
              {effectiveStreetDelta}
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Vendor WBGT</div>
            <div className="text-sm font-mono font-bold text-amber-300 tabular-nums">
              {isMitigated ? '30.2°C' : `${vendor.wetBulbGlobeTempCelsius}°C`}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Interactive Controls Drawer */}
      <div className="mt-auto relative z-10 p-4 pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" /> Perspective:
            </span>
            <button
              onClick={() => setPresetCamera('isometric')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${cameraView === 'isometric' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white bg-slate-800/70'}`}
            >
              Canyon Overview
            </button>
            <button
              onClick={() => setPresetCamera('pedestrian')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${cameraView === 'pedestrian' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white bg-slate-800/70'}`}
            >
              Vendor Head Height
            </button>
            <button
              onClick={() => setPresetCamera('side')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${cameraView === 'side' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white bg-slate-800/70'}`}
            >
              Cross-Section
            </button>
          </div>

          {/* AC Capacity Slider */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Chiller Load:</span>
              <span className="font-mono text-red-300 font-semibold tabular-nums">{acLoadPct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={acLoadPct}
              onChange={(e) => setAcLoadPct(Number(e.target.value))}
              className="w-28 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Restorative Mitigation Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMitigation}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                isMitigated
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white'
              }`}
            >
              {isMitigated ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Deflector Louvers Deployed (Plume Diverted to Sky)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Simulate Municipal Mitigation (Install Deflectors)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Legend Explainer Callout */}
        <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/50 flex items-center justify-between">
          <span>
            🔴 <strong className="text-red-400">Red Particle Stream</strong>: 53°C horizontal waste heat jet blasted from 64 AC outdoor units into the 7.2m alleyway.
          </span>
          <span>
            🟢 <strong className="text-emerald-400">Green Upward Louver</strong>: Mandated by Ushma-Netra to redirect exhaust above roofline, saving street workers.
          </span>
        </div>
      </div>
    </div>
  );
};
