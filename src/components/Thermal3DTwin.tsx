import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BuildingAudit, VendorTelemetry } from '../types';
import { Flame, ShieldCheck, Eye, AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  building: BuildingAudit;
  vendor: VendorTelemetry;
  isMitigated?: boolean;
  onMitigationToggle?: (mitigated: boolean) => void;
  meshView?: boolean;
  thermalOverlay?: boolean;
  airflowVectors?: boolean;
}

// Procedural radial glow sprite for volumetric heat & mist particles
function createRadialGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 230, 180, 0.75)');
    grad.addColorStop(0.7, 'rgba(255, 120, 40, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Procedural asphalt road texture with subtle grain & weathering
function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1b2230';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3200; i++) {
      const v = 22 + Math.floor(Math.random() * 24);
      ctx.fillStyle = `rgb(${v}, ${v + 4}, ${v + 12})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 4);
  return tex;
}

export const Thermal3DTwin: React.FC<Props> = ({
  building,
  vendor,
  isMitigated: externalIsMitigated,
  onMitigationToggle,
  meshView = false,
  thermalOverlay = true,
  airflowVectors = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [acLoadPct, setAcLoadPct] = useState<number>(95);
  const effectiveMitigatedInitial = externalIsMitigated ?? (building.mitigationStatus === 'compliant');
  const [isMitigated, setIsMitigated] = useState<boolean>(effectiveMitigatedInitial);

  useEffect(() => {
    const target = externalIsMitigated ?? (building.mitigationStatus === 'compliant');
    setIsMitigated(Boolean(target));
  }, [externalIsMitigated, building.id, building.mitigationStatus]);

  const [flirMode, setFlirMode] = useState<boolean>(thermalOverlay);
  const [activeProbe, setActiveProbe] = useState<'grill' | 'breathing_zone' | 'cart' | 'roof'>('breathing_zone');
  const [cameraView, setCameraView] = useState<'pedestrian' | 'side' | 'isometric'>('isometric');

  // Animation & Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const particleVelocitiesRef = useRef<Float32Array | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const mistGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const mistParticlesRef = useRef<THREE.Points | null>(null);
  const deflectorMeshesRef = useRef<THREE.Mesh[]>([]);
  const fanRotorsRef = useRef<THREE.Group[]>([]);
  const groundHeatOverlayRef = useRef<THREE.Mesh | null>(null);

  // Dynamic reactive refs so slider/toggle updates don't destroy OrbitControls camera state
  const isMitigatedRef = useRef<boolean>(isMitigated);
  const flirModeRef = useRef<boolean>(flirMode);
  const acLoadPctRef = useRef<number>(acLoadPct);

  useEffect(() => {
    isMitigatedRef.current = isMitigated;
    deflectorMeshesRef.current.forEach((m) => {
      m.visible = isMitigated;
    });
    if (mistParticlesRef.current) {
      mistParticlesRef.current.visible = isMitigated && airflowVectors;
    }
    if (groundHeatOverlayRef.current) {
      const mat = groundHeatOverlayRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHex(isMitigated ? 0x10b981 : 0xef4444);
      mat.opacity = isMitigated ? 0.16 : 0.34;
      groundHeatOverlayRef.current.visible = flirMode;
    }
  }, [isMitigated, airflowVectors, flirMode]);

  useEffect(() => {
    setFlirMode(thermalOverlay);
  }, [thermalOverlay]);

  useEffect(() => {
    flirModeRef.current = flirMode;
    if (groundHeatOverlayRef.current) {
      groundHeatOverlayRef.current.visible = flirMode;
    }
  }, [flirMode]);

  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.visible = airflowVectors;
    }
    if (mistParticlesRef.current) {
      mistParticlesRef.current.visible = isMitigatedRef.current && airflowVectors;
    }
  }, [airflowVectors]);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj !== groundHeatOverlayRef.current) {
        const mat = obj.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.wireframe = meshView;
        }
      }
    });
  }, [meshView]);

  useEffect(() => {
    acLoadPctRef.current = acLoadPct;
  }, [acLoadPct]);

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
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 580;

    // 1. Scene setup with realistic urban twilight haze
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x09111e);
    scene.fog = new THREE.FogExp2(0x09111e, 0.018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    cameraRef.current = camera;
    camera.position.set(14.5, 10.5, 16.5);

    // 3. Renderer setup with ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Interactive OrbitControls (Drag to Rotate, Scroll to Zoom, Right-Click to Pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.target.set(0, 2.8, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent going underground
    controls.minDistance = 4;
    controls.maxDistance = 36;
    controls.update();

    // 5. Realistic Multi-Layer Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.85);
    hemiLight.position.set(0, 25, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.45);
    sunLight.position.set(16, 24, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Incandescent thermal glow from the condenser bank
    const exhaustGlow = new THREE.PointLight(0xff3b00, 3.2, 15);
    exhaustGlow.position.set(-3.2, 3.0, 0);
    scene.add(exhaustGlow);

    // Warm streetlamp illumination over vendor sidewalk
    const streetLampLight = new THREE.PointLight(0xfbbf24, 2.2, 14);
    streetLampLight.position.set(3.2, 5.6, -4.2);
    streetLampLight.castShadow = true;
    scene.add(streetLampLight);

    // 6. Realistic Street Canyon Ground, Curbs & Sidewalks
    const asphaltTex = createAsphaltTexture();
    const roadGeo = new THREE.PlaneGeometry(38, 22);
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.82,
      metalness: 0.08,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    // Thermal Ground Footprint Heatmap Plane on the Asphalt
    const heatFootprintGeo = new THREE.PlaneGeometry(8.5, 12.5);
    const heatFootprintMat = new THREE.MeshBasicMaterial({
      color: isMitigatedRef.current ? 0x10b981 : 0xef4444,
      transparent: true,
      opacity: isMitigatedRef.current ? 0.16 : 0.34,
      side: THREE.DoubleSide,
    });
    const heatFootprint = new THREE.Mesh(heatFootprintGeo, heatFootprintMat);
    heatFootprint.rotation.x = -Math.PI / 2;
    heatFootprint.position.set(0.2, 0.02, 0);
    scene.add(heatFootprint);
    groundHeatOverlayRef.current = heatFootprint;

    // Concrete Sidewalk (Building Side)
    const sidewalkGeo = new THREE.BoxGeometry(4.2, 0.28, 22);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.88 });
    const sidewalkBuilding = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalkBuilding.position.set(-3.2, 0.14, 0);
    sidewalkBuilding.receiveShadow = true;
    scene.add(sidewalkBuilding);

    // Concrete Sidewalk (Vendor Side)
    const sidewalkVendor = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalkVendor.position.set(4.8, 0.14, 0);
    sidewalkVendor.receiveShadow = true;
    scene.add(sidewalkVendor);

    // Dashed Road Centerline Markings
    const dashGeo = new THREE.PlaneGeometry(0.18, 1.8);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    for (let z = -8; z <= 8; z += 3.2) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0.8, 0.03, z);
      scene.add(dash);
    }

    // 7. Detailed Commercial Tower Facade (Left Side of Canyon)
    const buildingGroup = new THREE.Group();
    const mainFacadeGeo = new THREE.BoxGeometry(7.2, 15.5, 20);
    const mainFacadeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.15,
    });
    const buildingMesh = new THREE.Mesh(mainFacadeGeo, mainFacadeMat);
    buildingMesh.position.set(-8.6, 7.75, 0);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    buildingGroup.add(buildingMesh);

    // Architectural Floor Ledges & Vertical Mullions
    const ledgeMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.3 });
    for (let f = 1; f <= 5; f++) {
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 20.2), ledgeMat);
      ledge.position.set(-4.95, f * 2.9, 0);
      buildingGroup.add(ledge);
    }

    // Illuminated Glass Curtain Windows with Interior Glow
    for (let floor = 1; floor <= 4; floor++) {
      for (let w = -7.5; w <= 7.5; w += 2.5) {
        const isLit = (Math.abs(Math.round(w * floor)) % 3) !== 0;
        const windowGeo = new THREE.BoxGeometry(0.12, 1.9, 1.8);
        const windowMat = new THREE.MeshStandardMaterial({
          color: isLit ? 0x38bdf8 : 0x0f172a,
          emissive: isLit ? 0x0284c7 : 0x000000,
          emissiveIntensity: isLit ? 0.45 : 0,
          roughness: 0.12,
          metalness: 0.85,
        });
        const windowMesh = new THREE.Mesh(windowGeo, windowMat);
        windowMesh.position.set(-4.98, floor * 2.9 + 1.35, w);
        buildingGroup.add(windowMesh);
      }
    }

    // Ground-Floor Commercial Shopfront Awning & Signage
    const awningGeo = new THREE.BoxGeometry(1.4, 0.15, 18.5);
    const awningMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(-4.4, 1.15, 0);
    awning.rotation.z = -0.18;
    buildingGroup.add(awning);

    scene.add(buildingGroup);

    // 8. Detailed Outdoor AC Condenser Bank with Spinning Fan Blades & Copper Piping
    const acUnitsGroup = new THREE.Group();
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.45, roughness: 0.35 });
    const darkGrillMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });

    deflectorMeshesRef.current = [];
    fanRotorsRef.current = [];

    for (let row = 0; row < 3; row++) {
      for (let col = -4.5; col <= 4.5; col += 2.25) {
        const unitWrapper = new THREE.Group();
        unitWrapper.position.set(-4.55, 1.85 + row * 1.25, col);

        // Condenser Sheet-Metal Housing
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.82, 1.18), casingMat);
        housing.castShadow = true;
        housing.receiveShadow = true;
        unitWrapper.add(housing);

        // Wall Mounting L-Brackets
        const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.06, 0.08), bracketMat);
        bracketL.position.set(-0.02, -0.44, -0.45);
        unitWrapper.add(bracketL);
        const bracketR = bracketL.clone();
        bracketR.position.z = 0.45;
        unitWrapper.add(bracketR);

        // Shroud & Fan Cavity
        const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 24), darkGrillMat);
        shroud.rotation.z = Math.PI / 2;
        shroud.position.set(0.33, 0, -0.12);
        unitWrapper.add(shroud);

        // Spinning Fan Rotor Group (3 Blades)
        const rotorGroup = new THREE.Group();
        rotorGroup.position.set(0.36, 0, -0.12);
        for (let b = 0; b < 3; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.26, 0.09), bladeMat);
          blade.rotation.x = (b * Math.PI * 2) / 3;
          rotorGroup.add(blade);
        }
        unitWrapper.add(rotorGroup);
        fanRotorsRef.current.push(rotorGroup);

        // Green Skyward Aerodynamic Louver Hood (Toggled with Mitigation)
        const deflectorGeo = new THREE.BoxGeometry(0.55, 0.08, 1.12);
        const deflectorMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.25,
          metalness: 0.4,
          roughness: 0.25,
        });
        const deflector = new THREE.Mesh(deflectorGeo, deflectorMat);
        deflector.position.set(0.46, 0.34, 0);
        deflector.rotation.z = Math.PI / 4; // 45° upward deflection angle
        deflector.visible = isMitigatedRef.current;
        unitWrapper.add(deflector);
        deflectorMeshesRef.current.push(deflector);

        acUnitsGroup.add(unitWrapper);
      }
    }
    scene.add(acUnitsGroup);

    // 9. Realistic Street Vendor Cart, Umbrella, Tea Kettle, Streetlamp & Misting Arch (Right Sidewalk)
    const vendorGroup = new THREE.Group();
    vendorGroup.position.set(4.5, 0.28, 0);

    // Wooden Pushcart Chassis
    const cartBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.88, 1.45),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.82 })
    );
    cartBody.position.y = 0.52;
    cartBody.castShadow = true;
    cartBody.receiveShadow = true;
    vendorGroup.add(cartBody);

    // Stainless Steel Countertop
    const counterTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.38, 0.06, 1.52),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.75, roughness: 0.25 })
    );
    counterTop.position.y = 0.98;
    vendorGroup.add(counterTop);

    // Brass / Aluminum Tea Vessels on Cart
    const kettle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.34, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 })
    );
    kettle.position.set(-0.45, 1.18, -0.2);
    vendorGroup.add(kettle);

    // Spoked Cart Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.09, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    [
      [-0.82, 0.36, 0.76],
      [0.82, 0.36, 0.76],
      [-0.82, 0.36, -0.76],
      [0.82, 0.36, -0.76],
    ].forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, wy, wz);
      vendorGroup.add(w);
    });

    // Multi-Panel Market Umbrella
    const umbrellaPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.85, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 })
    );
    umbrellaPole.position.set(0, 1.85, 0);
    vendorGroup.add(umbrellaPole);

    const umbrellaCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.85, 0.68, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 })
    );
    umbrellaCone.position.set(0, 2.75, 0);
    umbrellaCone.castShadow = true;
    vendorGroup.add(umbrellaCone);

    // ESP32 Wearable / Cart WBGT Beacon Node (Glowing Status Sphere)
    const beaconSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    beaconSphere.position.set(-0.95, 1.25, 0.65);
    vendorGroup.add(beaconSphere);

    // Street Worker Figure (Rameshwar Pal)
    const workerTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.21, 1.05, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.7 })
    );
    workerTorso.position.set(0, 0.85, 1.25);
    workerTorso.castShadow = true;
    vendorGroup.add(workerTorso);

    const workerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 })
    );
    workerHead.position.set(0, 1.56, 1.25);
    vendorGroup.add(workerHead);

    // Municipal 70-Bar High-Pressure Cooling Mist Arch next to Cart
    const archMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.6, roughness: 0.3 });
    const archPostL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.1, 12), archMat);
    archPostL.position.set(-1.55, 1.55, -1.2);
    vendorGroup.add(archPostL);
    const archPostR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.1, 12), archMat);
    archPostR.position.set(-1.55, 1.55, 1.8);
    vendorGroup.add(archPostR);
    const archHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.1, 12), archMat);
    archHeader.rotation.x = Math.PI / 2;
    archHeader.position.set(-1.55, 3.05, 0.3);
    vendorGroup.add(archHeader);

    scene.add(vendorGroup);

    // Streetlamp Post on Sidewalk
    const lampPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.1, 5.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 })
    );
    lampPole.position.set(3.4, 2.8, -4.5);
    scene.add(lampPole);
    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfde68a })
    );
    lampBulb.position.set(3.2, 5.6, -4.2);
    scene.add(lampBulb);

    // 10. Volumetric Thermal Plume Particle System (Soft Radial Glow Sprites)
    const glowSprite = createRadialGlowTexture();
    const particleCount = 1100;
    const particleGeo = new THREE.BufferGeometry();
    particleGeoRef.current = particleGeo;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    particleVelocitiesRef.current = velocities;

    const resetParticle = (i: number) => {
      const zSpawn = (Math.random() - 0.5) * 9.5;
      const ySpawn = 1.65 + Math.random() * 2.9;
      positions[i * 3] = -4.1;
      positions[i * 3 + 1] = ySpawn;
      positions[i * 3 + 2] = zSpawn;

      const mitigatedNow = isMitigatedRef.current;
      const loadFactor = acLoadPctRef.current / 100;

      if (mitigatedNow) {
        velocities[i * 3] = 0.035 + Math.random() * 0.035;
        velocities[i * 3 + 1] = 0.085 + Math.random() * 0.065; // 45°+ upward lift
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      } else {
        velocities[i * 3] = 0.085 + loadFactor * 0.085 + Math.random() * 0.04;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.018;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.028;
      }

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = mitigatedNow ? 0.75 : 0.35;
      colors[i * 3 + 2] = 0.08;
    };

    for (let i = 0; i < particleCount; i++) {
      resetParticle(i);
      positions[i * 3] += Math.random() * 8.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.65,
      map: glowSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 11. Evaporative Cooling Mist Spray Particles from Misting Arch (Visible when Mitigated)
    const mistCount = 350;
    const mistGeo = new THREE.BufferGeometry();
    mistGeoRef.current = mistGeo;
    const mistPos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      mistPos[i * 3] = 2.95 + (Math.random() - 0.5) * 0.5;
      mistPos[i * 3 + 1] = 0.5 + Math.random() * 2.7;
      mistPos[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 0.42,
      map: glowSprite,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    mistPoints.visible = isMitigatedRef.current;
    scene.add(mistPoints);
    mistParticlesRef.current = mistPoints;

    // 12. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Spin all 15 outdoor AC condenser fan rotors continuously
      const spinSpeed = 0.18 + (acLoadPctRef.current / 100) * 0.22;
      fanRotorsRef.current.forEach((rotor) => {
        rotor.rotation.x += spinSpeed;
      });

      // Pulse IoT WBGT beacon
      beaconSphere.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.22);

      // Update thermal plume particles
      if (particleGeoRef.current && particleVelocitiesRef.current) {
        const posAttr = particleGeoRef.current.attributes.position as THREE.BufferAttribute;
        const colAttr = particleGeoRef.current.attributes.color as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;
        const col = colAttr.array as Float32Array;
        const vel = particleVelocitiesRef.current;
        const mitigatedNow = isMitigatedRef.current;
        const flirNow = flirModeRef.current;

        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += vel[i * 3];
          pos[i * 3 + 1] += vel[i * 3 + 1] + Math.sin(elapsed * 2.5 + i) * 0.003;
          pos[i * 3 + 2] += vel[i * 3 + 2];

          const distanceTraveled = pos[i * 3] - -4.1;

          if (mitigatedNow) {
            col[i * 3] = Math.max(0.08, 0.35 - distanceTraveled * 0.06);
            col[i * 3 + 1] = Math.min(0.95, 0.65 + distanceTraveled * 0.05);
            col[i * 3 + 2] = 0.88;
          } else if (flirNow) {
            col[i * 3] = 1.0;
            col[i * 3 + 1] = Math.max(0.06, 0.85 - distanceTraveled * 0.11);
            col[i * 3 + 2] = Math.max(0.08, 0.55 - distanceTraveled * 0.09);
          } else {
            col[i * 3] = 1.0;
            col[i * 3 + 1] = Math.max(0.18, 0.45 - distanceTraveled * 0.03);
            col[i * 3 + 2] = 0.06;
          }

          if (mitigatedNow) {
            if (pos[i * 3 + 1] > 10.5 || pos[i * 3] > 6.5) {
              resetParticle(i);
            }
          } else {
            if (pos[i * 3] > 7.2) {
              resetParticle(i);
            }
          }
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }

      // Animate evaporative mist curtain falling gently when mitigated
      if (mistGeoRef.current && isMitigatedRef.current) {
        const mPosAttr = mistGeoRef.current.attributes.position as THREE.BufferAttribute;
        const mPos = mPosAttr.array as Float32Array;
        for (let i = 0; i < mistCount; i++) {
          mPos[i * 3 + 1] -= 0.025;
          mPos[i * 3] += Math.sin(elapsed * 3 + i) * 0.004;
          if (mPos[i * 3 + 1] < 0.4) {
            mPos[i * 3 + 1] = 3.1;
          }
        }
        mPosAttr.needsUpdate = true;
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
      controls.dispose();
      glowSprite.dispose();
      asphaltTex.dispose();
      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
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
      }
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle Camera switch
  const setPresetCamera = (preset: 'pedestrian' | 'side' | 'isometric') => {
    setCameraView(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (preset === 'pedestrian') {
      cam.position.set(4.1, 1.85, 4.2);
      ctrl.target.set(-4.2, 2.4, 0);
    } else if (preset === 'side') {
      cam.position.set(0, 5.2, 15.5);
      ctrl.target.set(0, 2.6, 0);
    } else {
      cam.position.set(14.5, 10.5, 16.5);
      ctrl.target.set(0, 2.8, 0);
    }
    ctrl.update();
  };

  const toggleMitigation = () => {
    const next = !isMitigated;
    setIsMitigated(next);
    if (onMitigationToggle) {
      onMitigationToggle(next);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Unobstructed 3D WebGL Viewport (Only minimal floating pills on corners) */}
      <div className="relative w-full h-[540px] sm:h-[600px] bg-[#09111e] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* 3D WebGL Canvas with Interactive OrbitControls */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Minimal Top-Left Camera Angle Switcher */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setPresetCamera('isometric')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              cameraView === 'isometric'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Street View
          </button>
          <button
            type="button"
            onClick={() => setPresetCamera('pedestrian')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              cameraView === 'pedestrian'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Vendor View
          </button>
          <button
            type="button"
            onClick={() => setPresetCamera('side')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              cameraView === 'side'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Side View
          </button>
          <button
            type="button"
            onClick={() => setPresetCamera('isometric')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minimal Top-Right Live Heat Pill */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Street Temp:</span>
          <span
            className={`font-black text-sm ${
              isMitigated ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isMitigated ? '33.5°C (Cooled)' : `${currentPlumeTemp}°C (Hot)`}
          </span>
        </div>
      </div>

      {/* External Controls & Simple Temperature Probes Bar (Outside the 3D Canvas so 3D is never hidden) */}
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
        {/* Left: Thermal Camera Mode + AC Heat Load Slider */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setFlirMode(!flirMode)}
            className={`px-3.5 py-2 font-bold rounded-xl border transition-all cursor-pointer ${
              flirMode
                ? 'bg-rose-950 text-rose-200 border-rose-500'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
            }`}
          >
            {flirMode ? 'Thermal Camera: ON' : 'Thermal Camera: OFF'}
          </button>

          <div className="flex items-center gap-2.5 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-300 font-semibold">AC Power:</span>
            <span className="font-mono text-amber-300 font-bold w-9">{acLoadPct}%</span>
            <input
              type="range"
              min="20"
              max="100"
              value={acLoadPct}
              onChange={(e) => setAcLoadPct(Number(e.target.value))}
              className="w-24 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Center: 3 Simple Spot Temperatures */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            type="button"
            onClick={() => setActiveProbe('grill')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              activeProbe === 'grill'
                ? 'bg-rose-950/80 text-rose-200 border-rose-600'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            AC Vent: <strong className="text-rose-400">{effectiveExhaustTemp}°C</strong>
          </button>
          <button
            type="button"
            onClick={() => setActiveProbe('cart')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              activeProbe === 'cart'
                ? 'bg-amber-950/80 text-amber-200 border-amber-600'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            Vendor Cart:{' '}
            <strong className="text-amber-300">
              {isMitigated ? '30.2°C' : `${vendor.wetBulbGlobeTempCelsius}°C`}
            </strong>
          </button>
          <button
            type="button"
            onClick={() => setActiveProbe('roof')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              activeProbe === 'roof'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-600'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            Roof Air: <strong className="text-emerald-400">34.0°C</strong>
          </button>
        </div>

        {/* Right: Single Primary Cooling Toggle */}
        <button
          type="button"
          onClick={toggleMitigation}
          className={`px-4 py-2 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            isMitigated
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-[#a8321a] hover:bg-[#8e2915] text-white'
          }`}
        >
          {isMitigated ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Cooling Mist + 45° Louvers ON</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>Turn ON 45° Louvers &amp; Mist</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
