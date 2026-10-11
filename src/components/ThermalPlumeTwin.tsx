import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Flame, ShieldCheck, Sliders, RotateCcw, ArrowRight, ArrowUpRight } from 'lucide-react';

interface TwinProps {
  alleyWidth?: number; // 4m to 8m
  acUnitsCount?: number; // 10 to 100
  louversEngaged?: boolean; // Active toggle
  presetName?: string; // Synced to Canyon Presets
  onLouversChange?: (engaged: boolean) => void;
}

function createSoftParticleSprite(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
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

  // Sync external prop changes
  useEffect(() => {
    if (initialLouvers !== undefined) setLouversEngaged(initialLouvers);
  }, [initialLouvers]);

  useEffect(() => {
    if (initialAlleyWidth !== undefined) setAlleyWidth(initialAlleyWidth);
  }, [initialAlleyWidth]);

  useEffect(() => {
    if (initialAcUnits !== undefined) setAcUnitsCount(initialAcUnits);
  }, [initialAcUnits]);

  // Refs for live reactive updates inside the Three.js animation loop
  const louversRef = useRef<boolean>(louversEngaged);
  const alleyWidthRef = useRef<number>(alleyWidth);
  const acUnitsRef = useRef<number>(acUnitsCount);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const vendorCartGroupRef = useRef<THREE.Group | null>(null);
  const oppositeWallGroupRef = useRef<THREE.Group | null>(null);
  const louversGroupRef = useRef<THREE.Group | null>(null);
  const redArrowGroupRef = useRef<THREE.Group | null>(null);
  const greenArrowGroupRef = useRef<THREE.Group | null>(null);
  const dangerFloorMeshRef = useRef<THREE.Mesh | null>(null);
  const mistParticlesRef = useRef<THREE.Points | null>(null);
  const acFanRotorsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    louversRef.current = louversEngaged;
    if (louversGroupRef.current) {
      louversGroupRef.current.visible = louversEngaged;
    }
    if (redArrowGroupRef.current) {
      redArrowGroupRef.current.visible = !louversEngaged;
    }
    if (greenArrowGroupRef.current) {
      greenArrowGroupRef.current.visible = louversEngaged;
    }
    if (mistParticlesRef.current) {
      mistParticlesRef.current.visible = louversEngaged;
    }
    if (dangerFloorMeshRef.current) {
      const mat = dangerFloorMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHex(louversEngaged ? 0x10b981 : 0xef4444);
      mat.opacity = louversEngaged ? 0.22 : 0.38;
    }
  }, [louversEngaged]);

  useEffect(() => {
    alleyWidthRef.current = alleyWidth;
    // Map 4.0m..8.0m to scene X coordinate for the Vendor Cart & Right Building
    const cartX = -1.2 + alleyWidth * 0.72;
    if (vendorCartGroupRef.current) {
      vendorCartGroupRef.current.position.x = cartX;
    }
    if (oppositeWallGroupRef.current) {
      oppositeWallGroupRef.current.position.x = cartX + 3.4;
    }
  }, [alleyWidth]);

  useEffect(() => {
    acUnitsRef.current = acUnitsCount;
  }, [acUnitsCount]);

  // Setup crystal-clear Side-View Cross-Section 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 860;
    const height = container.clientHeight || 480;

    // 1. Bright, high-contrast blueprint slate scene (No muddy dark brown fog)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1528);
    scene.fog = new THREE.FogExp2(0x0b1528, 0.012);

    // 2. Clean Side-Profile / Slightly Angled Cross-Section Camera so Left->Right flow is obvious in 2 seconds
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 120);
    cameraRef.current = camera;
    camera.position.set(0.5, 5.2, 16.2);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.target.set(0.2, 3.1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 6;
    controls.maxDistance = 30;
    controls.update();

    // 4. Crisp Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 1.15);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // 5. Street Roadway + High-Visibility Blueprint Grid
    const roadGeo = new THREE.PlaneGeometry(32, 16);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x172236,
      roughness: 0.85,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    scene.add(road);

    const gridHelper = new THREE.GridHelper(28, 28, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Colored Street Floor Zone (Red when hot blast hits street, Green when cooled)
    const floorZoneGeo = new THREE.PlaneGeometry(8.5, 6.5);
    const floorZoneMat = new THREE.MeshBasicMaterial({
      color: louversRef.current ? 0x10b981 : 0xef4444,
      transparent: true,
      opacity: louversRef.current ? 0.22 : 0.38,
      side: THREE.DoubleSide,
    });
    const floorZone = new THREE.Mesh(floorZoneGeo, floorZoneMat);
    floorZone.rotation.x = -Math.PI / 2;
    floorZone.position.set(0.4, 0.03, 0);
    scene.add(floorZone);
    dangerFloorMeshRef.current = floorZone;

    // 6. LEFT SIDE: Commercial Tower with Glowing Windows & AC Condenser Wall
    const leftTowerGroup = new THREE.Group();
    const towerBody = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 11.5, 8.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 })
    );
    towerBody.position.set(-6.8, 5.75, 0);
    towerBody.castShadow = true;
    towerBody.receiveShadow = true;
    leftTowerGroup.add(towerBody);

    // Roof cap
    const roofCap = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.35, 8.8),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    roofCap.position.set(-6.8, 11.6, 0);
    leftTowerGroup.add(roofCap);

    // Glowing office windows on left building
    for (let floor = 1; floor <= 3; floor++) {
      for (let z = -2.8; z <= 2.8; z += 1.85) {
        const win = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 1.4, 1.2),
          new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.45,
          })
        );
        win.position.set(-4.02, floor * 2.6 + 1.2, z);
        leftTowerGroup.add(win);
      }
    }

    // Outdoor AC Condenser Units with Spinning Fans (Mounted on Right Face of Left Tower)
    const acFanRotors: THREE.Group[] = [];
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.35,
      roughness: 0.35,
    });
    const fanHousingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const hotGrillMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });

    const louversGroup = new THREE.Group();
    louversGroup.visible = louversRef.current;
    louversGroupRef.current = louversGroup;

    const louverMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.45,
      roughness: 0.2,
    });

    for (let row = 0; row < 3; row++) {
      for (let col = -2.4; col <= 2.4; col += 1.6) {
        const yPos = 1.6 + row * 1.35;
        const unit = new THREE.Group();
        unit.position.set(-3.65, yPos, col);

        const box = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 1.15), casingMat);
        box.castShadow = true;
        unit.add(box);

        const fanRing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.08, 20),
          fanHousingMat
        );
        fanRing.rotation.z = Math.PI / 2;
        fanRing.position.set(0.32, 0, 0);
        unit.add(fanRing);

        const rotor = new THREE.Group();
        rotor.position.set(0.36, 0, 0);
        for (let b = 0; b < 3; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.24, 0.08), hotGrillMat);
          blade.rotation.x = (b * Math.PI * 2) / 3;
          rotor.add(blade);
        }
        unit.add(rotor);
        acFanRotors.push(rotor);

        // Bright Green 45° Upward Louver Hood
        const hood = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 1.15), louverMat);
        hood.position.set(-3.2, yPos + 0.35, col);
        hood.rotation.z = Math.PI / 4; // 45° upward tilt
        louversGroup.add(hood);

        leftTowerGroup.add(unit);
      }
    }
    acFanRotorsRef.current = acFanRotors;
    scene.add(leftTowerGroup);
    scene.add(louversGroup);

    // 7. RIGHT SIDE: Street Vendor Pushcart, Orange Umbrella, Vendor Figure & Cooling Mist Arch
    const initialCartX = -1.2 + alleyWidthRef.current * 0.72;
    const vendorGroup = new THREE.Group();
    vendorGroup.position.set(initialCartX, 0, 0);
    vendorCartGroupRef.current = vendorGroup;

    // Sidewalk Curb under Cart
    const curb = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.24, 8.5),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    curb.position.set(0.4, 0.12, 0);
    vendorGroup.add(curb);

    // Wooden Vendor Cart Body
    const cartBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.9, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 })
    );
    cartBody.position.set(0, 0.78, 0);
    cartBody.castShadow = true;
    vendorGroup.add(cartBody);

    // Cart Countertop
    const cartTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.88, 0.08, 2.3),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.3 })
    );
    cartTop.position.set(0, 1.26, 0);
    vendorGroup.add(cartTop);

    // Cart Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.1, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    [
      [-0.65, 0.36, 0.85],
      [0.65, 0.36, 0.85],
      [-0.65, 0.36, -0.85],
      [0.65, 0.36, -0.85],
    ].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      vendorGroup.add(wheel);
    });

    // Bright Market Umbrella over Cart
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 2.1, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
    );
    pole.position.set(0, 2.25, 0);
    vendorGroup.add(pole);

    const umbrella = new THREE.Mesh(
      new THREE.ConeGeometry(1.95, 0.75, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45 })
    );
    umbrella.position.set(0, 3.35, 0);
    umbrella.castShadow = true;
    vendorGroup.add(umbrella);

    // Street Vendor Human Figure standing beside Cart
    const humanTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.22, 1.15, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 })
    );
    humanTorso.position.set(0, 1.05, 1.55);
    vendorGroup.add(humanTorso);

    const humanHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 })
    );
    humanHead.position.set(0, 1.85, 1.55);
    vendorGroup.add(humanHead);

    // Glowing ESP32 Sensor Beacon on Cart Corner
    const beaconSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    beaconSphere.position.set(-0.82, 1.48, 0.95);
    vendorGroup.add(beaconSphere);

    // Blue Cooling Mist Arch Frame in front of Cart
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 12), archMat);
    postL.position.set(-1.25, 1.8, -1.35);
    vendorGroup.add(postL);
    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 12), archMat);
    postR.position.set(-1.25, 1.8, 1.85);
    vendorGroup.add(postR);
    const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.3, 12), archMat);
    topBar.rotation.x = Math.PI / 2;
    topBar.position.set(-1.25, 3.6, 0.25);
    vendorGroup.add(topBar);

    scene.add(vendorGroup);

    // Low Opposite Shop Wall behind Vendor Sidewalk (Kept low so camera is NEVER blocked)
    const oppWallGroup = new THREE.Group();
    oppWallGroup.position.set(initialCartX + 3.4, 0, 0);
    oppositeWallGroupRef.current = oppWallGroup;
    const oppWall = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 5.2, 8.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
    );
    oppWall.position.set(0, 2.6, 0);
    oppWallGroup.add(oppWall);
    scene.add(oppWallGroup);

    // 8. ULTRA-CLEAR 3D DIRECTIONAL ARROWS (Understandable in < 2 Seconds)
    // A) RED HORIZONTAL BLAST ARROWS (AC Wall -> Straight into Vendor Cart)
    const redArrowGroup = new THREE.Group();
    redArrowGroup.visible = !louversRef.current;
    redArrowGroupRef.current = redArrowGroup;

    const redArrowMat = new THREE.MeshBasicMaterial({
      color: 0xff3b1f,
      transparent: true,
      opacity: 0.9,
    });

    for (const zOffset of [-1.2, 0, 1.2]) {
      const arrowWrapper = new THREE.Group();
      arrowWrapper.position.set(-2.5, 2.4, zOffset);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.6, 12), redArrowMat);
      shaft.rotation.z = -Math.PI / 2;
      shaft.position.set(1.8, 0, 0);
      arrowWrapper.add(shaft);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.65, 16), redArrowMat);
      head.rotation.z = -Math.PI / 2;
      head.position.set(3.8, 0, 0);
      arrowWrapper.add(head);

      redArrowGroup.add(arrowWrapper);
    }
    scene.add(redArrowGroup);

    // B) GREEN 45° UPWARD DEFLECTION ARROWS (AC Wall -> Safely Up to Sky above Roof)
    const greenArrowGroup = new THREE.Group();
    greenArrowGroup.visible = louversRef.current;
    greenArrowGroupRef.current = greenArrowGroup;

    const greenArrowMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.92,
    });

    for (const zOffset of [-1.2, 0, 1.2]) {
      const upArrowWrapper = new THREE.Group();
      upArrowWrapper.position.set(-2.9, 3.2, zOffset);
      upArrowWrapper.rotation.z = Math.PI / 4; // 45° upward angle

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.4, 12), greenArrowMat);
      shaft.rotation.z = -Math.PI / 2;
      shaft.position.set(2.2, 0, 0);
      upArrowWrapper.add(shaft);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.65, 16), greenArrowMat);
      head.rotation.z = -Math.PI / 2;
      head.position.set(4.6, 0, 0);
      upArrowWrapper.add(head);

      greenArrowGroup.add(upArrowWrapper);
    }
    scene.add(greenArrowGroup);

    // 9. Soft Glowing Heat Stream Particles
    const spriteTex = createSoftParticleSprite();
    const particleCount = 650;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const resetParticle = (i: number) => {
      positions[i * 3] = -3.1;
      positions[i * 3 + 1] = 1.4 + Math.random() * 2.9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5.2;

      const isUpward = louversRef.current;
      const speedScale = 0.7 + (acUnitsRef.current / 100) * 0.65;

      if (isUpward) {
        velocities[i * 3] = (0.045 + Math.random() * 0.03) * speedScale;
        velocities[i * 3 + 1] = (0.065 + Math.random() * 0.045) * speedScale; // 45°+ upward sky lift
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.012;

        colors[i * 3] = 0.08;
        colors[i * 3 + 1] = 0.92;
        colors[i * 3 + 2] = 0.68;
      } else {
        velocities[i * 3] = (0.095 + Math.random() * 0.045) * speedScale;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.012; // Straight horizontal street blast
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.32;
        colors[i * 3 + 2] = 0.06;
      }
    };

    for (let i = 0; i < particleCount; i++) {
      resetParticle(i);
      positions[i * 3] += Math.random() * 5.5;
      if (louversRef.current) {
        positions[i * 3 + 1] += Math.random() * 3.5;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.52,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 10. Cool Blue Mist Spray Curtain around Vendor Cart when Louvers/Cooling ON
    const mistCount = 220;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      mistPositions[i * 3] = initialCartX - 1.2 + (Math.random() - 0.5) * 0.6;
      mistPositions[i * 3 + 1] = 0.5 + Math.random() * 3.0;
      mistPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 0.42,
      map: spriteTex,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mistSystem = new THREE.Points(mistGeo, mistMat);
    mistSystem.visible = louversRef.current;
    scene.add(mistSystem);
    mistParticlesRef.current = mistSystem;

    // 11. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin AC fans
      const fanSpeed = 0.16 + (acUnitsRef.current / 100) * 0.2;
      acFanRotorsRef.current.forEach((r) => {
        r.rotation.x += fanSpeed;
      });

      // Subtle animated pulse on 3D arrows so eye immediately tracks flow direction
      const arrowOffset = (elapsed * 1.4) % 0.6;
      if (redArrowGroupRef.current && !louversRef.current) {
        redArrowGroupRef.current.position.x = arrowOffset;
      }
      if (greenArrowGroupRef.current && louversRef.current) {
        greenArrowGroupRef.current.position.x = arrowOffset * 0.6;
        greenArrowGroupRef.current.position.y = arrowOffset * 0.6;
      }

      // Beacon status color
      (beaconSphere.material as THREE.MeshBasicMaterial).color.setHex(
        louversRef.current ? 0x10b981 : 0xef4444
      );
      beaconSphere.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.22);

      // Update thermal stream particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = particleGeo.attributes.color as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const col = colAttr.array as Float32Array;
      const isUpward = louversRef.current;
      const targetCartX = -1.2 + alleyWidthRef.current * 0.72;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        if (isUpward) {
          col[i * 3] = 0.08;
          col[i * 3 + 1] = 0.92;
          col[i * 3 + 2] = 0.68;
          if (pos[i * 3 + 1] > 9.8 || pos[i * 3] > targetCartX + 1.5) {
            resetParticle(i);
          }
        } else {
          col[i * 3] = 1.0;
          col[i * 3 + 1] = Math.max(0.12, 0.55 - (pos[i * 3] + 3.1) * 0.07);
          col[i * 3 + 2] = 0.05;
          if (pos[i * 3] > targetCartX + 0.6) {
            resetParticle(i);
          }
        }
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Update cool mist curtain
      if (isUpward) {
        const mAttr = mistGeo.attributes.position as THREE.BufferAttribute;
        const mPos = mAttr.array as Float32Array;
        for (let i = 0; i < mistCount; i++) {
          mPos[i * 3] = targetCartX - 1.2 + Math.sin(elapsed * 2 + i) * 0.15;
          mPos[i * 3 + 1] -= 0.03;
          if (mPos[i * 3 + 1] < 0.35) {
            mPos[i * 3 + 1] = 3.5;
          }
        }
        mAttr.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      spriteTex.dispose();
      scene.traverse((obj) => {
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
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const toggleLouvers = () => {
    const next = !louversEngaged;
    setLouversEngaged(next);
    if (onLouversChange) onLouversChange(next);
  };

  const resetCameraView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0.5, 5.2, 16.2);
    controlsRef.current.target.set(0.2, 3.1, 0);
    controlsRef.current.update();
  };

  // Dynamic Vendor Cart Temperature based on AC Count, Alley Width & Louvers
  const vendorCartTemp = louversEngaged
    ? (30.2).toFixed(1)
    : (38.5 + (acUnitsCount / 100) * 6.2 + (8 - alleyWidth) * 0.8).toFixed(1);

  return (
    <div className="w-full space-y-4">
      {/* 2-Second Instant Comprehension 3D Cross-Section Viewport */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-[#0b1528] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
        {/* WebGL Canvas */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* TOP-CENTER: Bold 1-Second Visual Story Banner */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div
            className={`px-4 py-2 rounded-xl font-mono text-xs sm:text-sm font-black tracking-wide flex items-center gap-2.5 shadow-lg border backdrop-blur-md ${
              louversEngaged
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80'
                : 'bg-rose-950/90 text-rose-100 border-rose-500/80'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                louversEngaged ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
              }`}
            />
            {louversEngaged ? (
              <span className="flex items-center gap-1.5">
                <span>SAFE: 45° Louvers Send Heat UP to Sky</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>DANGER: AC Heat Blasts Straight at Vendor Cart</span>
                <ArrowRight className="w-4 h-4 text-rose-400 shrink-0" />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={resetCameraView}
            className="pointer-events-auto px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5 pointer-events-none" />
            <span className="pointer-events-none">Reset View</span>
          </button>
        </div>

        {/* CLEAR 3-POINT DIAGRAM CALLOUTS (Left Building -> Middle Airflow -> Right Vendor Cart) */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 grid grid-cols-3 gap-2 sm:gap-3 pointer-events-none">
          {/* 1. LEFT: Building AC Wall */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 sm:p-3 text-left">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              1. Left: Tower AC Wall
            </div>
            <div className="text-xs sm:text-sm font-black text-white mt-0.5">
              {acUnitsCount} Outdoor ACs (53.6°C)
            </div>
          </div>

          {/* 2. CENTER: Street Canyon Path */}
          <div
            className={`backdrop-blur-md border rounded-xl p-2.5 sm:p-3 text-center ${
              louversEngaged
                ? 'bg-emerald-950/85 border-emerald-500/70'
                : 'bg-rose-950/85 border-rose-500/70'
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-bold">
              2. Middle: {alleyWidth.toFixed(1)}m Street
            </div>
            <div
              className={`text-xs sm:text-sm font-black mt-0.5 ${
                louversEngaged ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {louversEngaged ? '↗ Heat Sent Up to Roof' : '→ Hot Air Hits Street'}
            </div>
          </div>

          {/* 3. RIGHT: Street Vendor Cart */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 sm:p-3 text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">
              3. Right: Vendor Cart
            </div>
            <div
              className={`text-xs sm:text-sm font-black mt-0.5 ${
                louversEngaged ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              Cart Temp: {vendorCartTemp}°C {louversEngaged ? '(Safe)' : '(Hot)'}
            </div>
          </div>
        </div>
      </div>

      {/* External Control Strip Outside the 3D Canvas */}
      <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Alley Width Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              Street Width
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
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* AC Units Count Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Outdoor AC Units
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
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Louver Mitigation Toggle */}
        <button
          type="button"
          onClick={toggleLouvers}
          className={`w-full py-2.5 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            louversEngaged
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-[#a8321a] hover:bg-[#8e2915] text-white'
          }`}
        >
          {louversEngaged ? (
            <>
              <ShieldCheck className="w-4 h-4 pointer-events-none" />
              <span className="pointer-events-none">45° Skyward Louvers ON (Safe)</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 fill-current pointer-events-none" />
              <span className="pointer-events-none">Turn ON 45° Skyward Louvers</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
