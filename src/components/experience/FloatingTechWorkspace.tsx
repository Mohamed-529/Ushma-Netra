import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Activity, Eye, Play, Sparkles, RefreshCw, Cpu, Database, Shield, Zap, Lock, Radio } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

export interface TechCardData {
  id: string;
  name: string;
  service: string;
  metric: string;
  subtext: string;
  category: 'satellite' | 'serverless' | 'ledger' | 'security' | 'cv_edge' | 'telemetry';
  color: string;
  baseColor: string;
  slotIndex: number;
  slotPos: [number, number, number];
  elevatedPos: [number, number, number];
}

const CARDS_DATA: TechCardData[] = [
  {
    id: 'card-1',
    name: 'LANDSAT-9 THERMAL LST',
    service: 'Satellite Thermal Anomaly',
    metric: '44.8°C (+6.2°C Delta)',
    subtext: 'Band 10 TIR 30m resolution',
    category: 'satellite',
    color: '#06b6d4', // cyan-500
    baseColor: '#083344',
    slotIndex: 0,
    slotPos: [-3.8, 0.28, -1.8],
    elevatedPos: [-3.8, 2.2, -1.8],
  },
  {
    id: 'card-2',
    name: 'AWS IOT CORE TELEMETRY',
    service: 'LoRaWAN Micro-Beacon',
    metric: '12,400 ev/min · QOS 1',
    subtext: 'BME280 + SHT35 Sensor Mesh',
    category: 'telemetry',
    color: '#0ea5e9', // sky-500
    baseColor: '#0c4a6e',
    slotIndex: 1,
    slotPos: [-1.3, 0.28, -1.8],
    elevatedPos: [-1.3, 2.5, -1.8],
  },
  {
    id: 'card-3',
    name: 'SAGEMAKER YOLO-V10',
    service: 'Facade Computer Vision',
    metric: '94.2% Conf · 240ms',
    subtext: '12 Condenser units flagged',
    category: 'cv_edge',
    color: '#f59e0b', // amber-500
    baseColor: '#451a03',
    slotIndex: 2,
    slotPos: [1.3, 0.28, -1.8],
    elevatedPos: [1.3, 2.1, -1.8],
  },
  {
    id: 'card-4',
    name: 'DYNAMODB THERMAL LEDGER',
    service: 'Single-Table Audit Store',
    metric: '₹2,64,000 / mo Accrual',
    subtext: 'Sub-4ms p99 latency',
    category: 'ledger',
    color: '#10b981', // emerald-500
    baseColor: '#064e3b',
    slotIndex: 3,
    slotPos: [3.8, 0.28, -1.8],
    elevatedPos: [3.8, 2.7, -1.8],
  },
  {
    id: 'card-5',
    name: 'AMAZON VERIFIED CEDAR',
    service: 'RBAC Environmental Policy',
    metric: 'Statutory Decree: PERMIT',
    subtext: 'Section 133 CrPC Rule Engine',
    category: 'security',
    color: '#8b5cf6', // violet-500
    baseColor: '#2e1065',
    slotIndex: 4,
    slotPos: [-2.5, 0.28, 1.8],
    elevatedPos: [-2.5, 2.4, 1.8],
  },
  {
    id: 'card-6',
    name: 'BEDROCK TITAN AGENT',
    service: 'Section 133 Legal Decree',
    metric: 'Automated Notice v2.4',
    subtext: '48hr municipal ultimatum',
    category: 'serverless',
    color: '#ec4899', // pink-500
    baseColor: '#500724',
    slotIndex: 5,
    slotPos: [0.0, 0.28, 1.8],
    elevatedPos: [0.0, 2.6, 1.8],
  },
  {
    id: 'card-7',
    name: 'COGNITO REVENUE DISBURSAL',
    service: 'Direct Vendor Benefit UPI',
    metric: '₹14,250 Distributed',
    subtext: 'Rameshwar Pal · Verified payout',
    category: 'telemetry',
    color: '#38bdf8', // sky-400
    baseColor: '#0369a1',
    slotIndex: 6,
    slotPos: [2.5, 0.28, 1.8],
    elevatedPos: [2.5, 2.3, 1.8],
  },
];

// Interactive 3D Card Mesh with Spring Damping and Realistic Hover Lift
const InteractiveTechCard: React.FC<{
  card: TechCardData;
  isDocked: boolean;
  isSelected: boolean;
  onSelect: (card: TechCardData) => void;
  onHover: (card: TechCardData | null) => void;
}> = ({ card, isDocked, isSelected, onSelect, onHover }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth lerp positions
  const currentPos = useRef(new THREE.Vector3(...card.elevatedPos));
  const currentRot = useRef(new THREE.Euler(-0.02, 0, 0));

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Target position calculation:
    // When docked: sits in slot at Y ~ 0.28, with slight hover lift if hovered or selected
    // When undocked: floats high in the air
    const targetY = isDocked
      ? card.slotPos[1] + (hovered ? 0.75 : isSelected ? 0.45 : 0)
      : card.elevatedPos[1] + (hovered ? 0.5 : Math.sin(Date.now() * 0.002 + card.slotIndex) * 0.15);

    const targetX = card.slotPos[0];
    const targetZ = card.slotPos[2];

    // Smooth spring-like lerping
    const lerpSpeed = Math.min(delta * 7.5, 1);
    currentPos.current.x += (targetX - currentPos.current.x) * lerpSpeed;
    currentPos.current.y += (targetY - currentPos.current.y) * lerpSpeed;
    currentPos.current.z += (targetZ - currentPos.current.z) * lerpSpeed;

    meshRef.current.position.copy(currentPos.current);

    // Subtle tilt when hovered or selected
    const targetRotX = hovered ? -0.08 : 0;
    const targetRotY = hovered ? 0.05 : 0;
    const targetRotZ = hovered ? (card.slotIndex % 2 === 0 ? 0.03 : -0.03) : 0;

    currentRot.current.x += (targetRotX - currentRot.current.x) * lerpSpeed;
    currentRot.current.y += (targetRotY - currentRot.current.y) * lerpSpeed;
    currentRot.current.z += (targetRotZ - currentRot.current.z) * lerpSpeed;

    meshRef.current.rotation.set(
      currentRot.current.x,
      currentRot.current.y,
      currentRot.current.z
    );
  });

  const cardWidth = 2.1;
  const cardHeight = 0.22;
  const cardDepth = 2.6;

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(card);
        soundEngine.playTone(520, 'sine', 0.08);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(card);
        soundEngine.playTone(340 + card.slotIndex * 40, 'triangle', 0.05);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      {/* Dynamic Base Body with crisp bevels & shadow casting */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial
          color={isSelected ? '#18181b' : hovered ? '#27272a' : '#0f1015'}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Glossy Top Glass Plate */}
      <mesh position={[0, cardHeight / 2 + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[cardWidth - 0.12, cardDepth - 0.12]} />
        <meshPhysicalMaterial
          color={card.baseColor}
          transmission={0.4}
          roughness={0.15}
          metalness={0.4}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Vivid Accent Header Ribbon */}
      <mesh position={[0, cardHeight / 2 + 0.02, -cardDepth / 2 + 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cardWidth - 0.2, 0.4]} />
        <meshBasicMaterial color={card.color} />
      </mesh>

      {/* Active Selection / Hover Neon Outline Wireframe */}
      {(hovered || isSelected) && (
        <lineSegments position={[0, cardHeight / 2 + 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(cardWidth, cardDepth)]} />
          <lineBasicMaterial color={card.color} linewidth={2} />
        </lineSegments>
      )}

      {/* 3D Dynamic Text / Monospace Data Layer */}
      <group position={[0, cardHeight / 2 + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Service Subtitle */}
        <Text
          position={[-cardWidth / 2 + 0.2, cardDepth / 2 - 0.35, 0]}
          fontSize={0.11}
          color="#000000"
          anchorX="left"
          anchorY="middle"
          fontWeight="bold"
        >
          {card.service.toUpperCase()}
        </Text>

        {/* Card Title */}
        <Text
          position={[-cardWidth / 2 + 0.2, cardDepth / 2 - 0.75, 0]}
          fontSize={0.13}
          color="#f4f4f5"
          anchorX="left"
          anchorY="middle"
          fontWeight="bold"
        >
          {card.name}
        </Text>

        {/* Primary Metric */}
        <Text
          position={[-cardWidth / 2 + 0.2, 0.1, 0]}
          fontSize={0.17}
          color={card.color}
          anchorX="left"
          anchorY="middle"
          fontWeight="bold"
        >
          {card.metric}
        </Text>

        {/* Subtext description */}
        <Text
          position={[-cardWidth / 2 + 0.2, -cardDepth / 2 + 0.5, 0]}
          fontSize={0.095}
          color="#a1a1aa"
          anchorX="left"
          anchorY="middle"
        >
          {card.subtext}
        </Text>

        {/* Micro LED Status Dot */}
        <mesh position={[cardWidth / 2 - 0.3, cardDepth / 2 - 0.35, 0]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color={hovered || isSelected ? '#10b981' : card.color} />
        </mesh>
      </group>

      {/* Sub-Card Contact Glow Light */}
      <pointLight
        position={[0, -0.1, 0]}
        intensity={hovered ? 0.6 : 0.15}
        distance={2.5}
        color={card.color}
      />
    </group>
  );
};

// Main Minimalist Matte Gray/White Deck Console Geometry
const MainDeckConsole: React.FC<{
  hoveredCard: TechCardData | null;
  selectedCard: TechCardData | null;
}> = () => {
  // Geometric plate dimensions
  const deckWidth = 11.0;
  const deckHeight = 0.5;
  const deckDepth = 7.6;

  // Structural notches & grid slots
  const slots = useMemo(() => {
    return CARDS_DATA.map((card) => ({
      id: card.id,
      pos: card.slotPos,
      w: 2.25,
      h: 0.12,
      d: 2.75,
      color: card.color,
    }));
  }, []);

  return (
    <group position={[0, -0.25, 0]}>
      {/* 1. Main Matte Gray/White Console Base Plate */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[deckWidth, deckHeight, deckDepth]} />
        <meshStandardMaterial
          color="#e4e4e7" // zinc-200 matte architectural white/gray
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Top Precision Architectural Grid Layer */}
      <mesh position={[0, deckHeight / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[deckWidth - 0.4, deckDepth - 0.4]} />
        <meshStandardMaterial
          color="#f4f4f5" // zinc-100 high-key clean architectural face
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>

      {/* Fine Monospace Grid Lines on the deck surface */}
      <gridHelper
        args={[10.0, 20, '#d4d4d8', '#e4e4e7']}
        position={[0, deckHeight / 2 + 0.005, 0]}
      />

      {/* 3. Recessed Modular Docking Slots with technical metallic bevels */}
      {slots.map((s, idx) => (
        <group key={s.id} position={[s.pos[0], deckHeight / 2 + 0.008, s.pos[2]]}>
          {/* Recessed well border */}
          <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(s.w, s.d)]} />
            <lineBasicMaterial color="#a1a1aa" linewidth={1} />
          </lineSegments>

          {/* Recessed Slot Floor with darker inset */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[s.w - 0.06, s.d - 0.06]} />
            <meshStandardMaterial
              color="#d4d4d8"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>

          {/* Micro Technical Corner Brackets */}
          <mesh position={[-s.w / 2 + 0.12, 0.01, -s.d / 2 + 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color="#71717a" />
          </mesh>
          <mesh position={[s.w / 2 - 0.12, 0.01, -s.d / 2 + 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color="#71717a" />
          </mesh>
          <mesh position={[-s.w / 2 + 0.12, 0.01, s.d / 2 - 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color="#71717a" />
          </mesh>
          <mesh position={[s.w / 2 - 0.12, 0.01, s.d / 2 - 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color="#71717a" />
          </mesh>

          {/* Monospace Slot Label */}
          <Text
            position={[-s.w / 2 + 0.25, 0.015, -s.d / 2 + 0.25]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.09}
            color="#71717a"
            anchorX="left"
            anchorY="middle"
          >
            {`BAY-0${idx + 1} // DOCK_BUS`}
          </Text>
        </group>
      ))}

      {/* 4. Peripheral Architectural Notches & Heat-Sink Exhaust Vents */}
      {/* Front Edge Chamfer Accent Strip */}
      <mesh position={[0, 0, deckDepth / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[deckWidth - 0.8, 0.18, 0.05]} />
        <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Status Markings on Front Bezel */}
      <Text
        position={[-deckWidth / 2 + 0.8, 0, deckDepth / 2 + 0.06]}
        fontSize={0.11}
        color="#a1a1aa"
        anchorX="left"
        anchorY="middle"
      >
        USHMA-NETRA · AUTONOMOUS THERMAL INFRASTRUCTURE BENCH v3.8 · SEC_133 COMPLIANT
      </Text>

      {/* LED Power / Bus Indicator */}
      <mesh position={[deckWidth / 2 - 0.8, 0, deckDepth / 2 + 0.06]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Rear Server Cable Conduit Trays */}
      {[-3.5, 0, 3.5].map((xPos, i) => (
        <group key={`conduit-${i}`} position={[xPos, -0.05, -deckDepth / 2 - 0.35]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.8, 16]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
        </group>
      ))}

      {/* 5. Infinite Soft Shadow Catching Ground Floor (Sub-surface) */}
      <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 24]} />
        <shadowMaterial opacity={0.28} />
      </mesh>
    </group>
  );
};

// Scene Hierarchy with Clean Orthographic/Near-Isometric Perspective & Lighting
const TechWorkspaceScene: React.FC<{
  isDocked: boolean;
  selectedCard: TechCardData | null;
  onSelectCard: (card: TechCardData) => void;
  hoveredCard: TechCardData | null;
  setHoveredCard: (card: TechCardData | null) => void;
}> = ({ isDocked, selectedCard, onSelectCard, hoveredCard, setHoveredCard }) => {
  const rootGroupRef = useRef<THREE.Group>(null);

  // Subtle breathing oscillation for the entire tilted platform
  useFrame((state) => {
    if (!rootGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    rootGroupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
  });

  return (
    <group ref={rootGroupRef} rotation={[0.48, -0.58, 0.28]}>
      {/* Structural Minimalist Matte White Console Tray */}
      <MainDeckConsole
        hoveredCard={hoveredCard}
        selectedCard={selectedCard}
      />

      {/* Floating / Dockable High-Density Infrastructure Cards */}
      {CARDS_DATA.map((card) => (
        <InteractiveTechCard
          key={card.id}
          card={card}
          isDocked={isDocked}
          isSelected={selectedCard?.id === card.id}
          onSelect={onSelectCard}
          onHover={setHoveredCard}
        />
      ))}
    </group>
  );
};

// Lighting Rig: Neutral high-key fill + Strong Directional Light for crisp architectural shadows
const TechnicalLightingRig: React.FC = () => {
  return (
    <>
      {/* 1. Neutral Ambient High-Key Fill */}
      <ambientLight intensity={1.1} />

      {/* 2. Strong Crisp Directional Key Light Casting Sharp Shadow Definition */}
      <directionalLight
        position={[14, 22, 12]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />

      {/* 3. Soft Opposite Secondary Fill Light to preserve depth without pitch-black crevices */}
      <directionalLight
        position={[-12, 10, -10]}
        intensity={0.65}
        color="#e0e7ff"
      />

      {/* 4. Top Rim Accent Light */}
      <pointLight
        position={[0, 16, 0]}
        intensity={0.9}
        color="#ffffff"
      />
    </>
  );
};

// Top-Level Component with Canvas & Kinetic Minimalist HUD Controls
export const FloatingTechWorkspace: React.FC = () => {
  const [isDocked, setIsDocked] = useState<boolean>(true);
  const [selectedCard, setSelectedCard] = useState<TechCardData | null>(CARDS_DATA[0]);
  const [hoveredCard, setHoveredCard] = useState<TechCardData | null>(null);
  const [cameraZoom, setCameraZoom] = useState<number>(44);

  const handleToggleDock = () => {
    setIsDocked((prev) => !prev);
    soundEngine.playSpikeAlert();
  };

  const activeCard = hoveredCard || selectedCard;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800/60 bg-[#08080a] shadow-2xl flex flex-col">
      {/* Top Telemetry Header & Interactive HUD Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 border-b border-zinc-800/40 bg-zinc-950/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-zinc-100 tracking-wide">
                FLOATING HARDWARE TEST-BENCH
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-950/60 text-sky-400 border border-sky-800/60">
                R3F ISOMETRIC CANVAS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-light">
              Interactive 3D docking console mapping satellite layers, serverless micro-services, and legal decree pipelines.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Dock / Undock Physics Trigger */}
          <button
            onClick={handleToggleDock}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
              isDocked
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 shadow-sm'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDocked ? 'EJECT / FLOAT CARDS' : 'DOCK CARDS INTO BENCH'}</span>
          </button>

          {/* Quick Select Cycle */}
          <button
            onClick={() => {
              const nextIndex = ((selectedCard?.slotIndex ?? 0) + 1) % CARDS_DATA.length;
              setSelectedCard(CARDS_DATA[nextIndex]);
              soundEngine.playTone(480, 'sine', 0.06);
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cycle next subsystem card"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CYCLE CARD</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative h-[480px] sm:h-[580px] lg:h-[640px] w-full bg-[#08080a] cursor-grab active:cursor-grabbing">
        {/* Subtle engineering background grid behind 3D render */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 3D Canvas Instance */}
        <Canvas
          shadows
          orthographic
          camera={{
            position: [18, 16, 20],
            zoom: cameraZoom,
            near: -40,
            far: 100,
          }}
          className="w-full h-full"
        >
          {/* Lighting Rig */}
          <TechnicalLightingRig />

          {/* Isometric Tech Deck with Cards */}
          <TechWorkspaceScene
            isDocked={isDocked}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
          />

          {/* Smooth Orbital Controls (Constrained for pristine isometric view) */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minZoom={28}
            maxZoom={70}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.06}
          />
        </Canvas>

        {/* Floating Active Inspector Card HUD Overlay */}
        {activeCard && (
          <div className="absolute top-4 left-4 max-w-sm w-full p-4 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 shadow-2xl pointer-events-none z-10 transition-all">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeCard.color }}
                />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  {activeCard.category} // BAY-0{activeCard.slotIndex + 1}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {isDocked ? 'DOCKED IN BENCH' : 'FLOATING STATE'}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-100 tracking-tight">
                {activeCard.name}
              </h4>
              <p className="text-xs text-zinc-300 font-mono">
                {activeCard.service}
              </p>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/60 space-y-1 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[11px]">Primary Telemetry:</span>
                <span className="font-bold" style={{ color: activeCard.color }}>
                  {activeCard.metric}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[11px]">Engine Spec:</span>
                <span className="text-zinc-300 text-[11px]">{activeCard.subtext}</span>
              </div>
            </div>

            <div className="mt-2 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
              <span>CLICK TO FOCUS</span>
              <span>ORBIT CANVAS TO INSPECT</span>
            </div>
          </div>
        )}

        {/* Micro Telemetry Legend in bottom-right */}
        <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 text-[10px] font-mono text-zinc-400 space-y-1 pointer-events-none">
          <div className="text-zinc-300 font-semibold mb-1 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-sky-400" />
            <span>DECK RECEPTION CHANNELS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
            <span>Landsat Satellite TIR Mesh</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
            <span>AWS IoT Core Micro-Beacons</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>SageMaker YOLO Condenser CV</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>DynamoDB Surcharge Ledger</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
            <span>Verified Cedar Environmental Auth</span>
          </div>
        </div>

        {/* Canvas interaction hints */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            DRAG TO ROTATE
          </span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            SCROLL TO ZOOM
          </span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            HOVER CARDS FOR LIFT & SHADOWS
          </span>
        </div>
      </div>

      {/* Quick Interactive Card Dock Selector Bar */}
      <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/40 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {CARDS_DATA.map((card) => {
          const isCurrent = selectedCard?.id === card.id;
          return (
            <button
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                soundEngine.playTone(520, 'sine', 0.08);
              }}
              onMouseEnter={() => setHoveredCard(card)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`p-2 rounded-lg text-left transition-all border font-mono text-[11px] cursor-pointer ${
                isCurrent
                  ? 'bg-zinc-900 border-zinc-600 text-zinc-100 shadow-md'
                  : 'bg-zinc-950/50 hover:bg-zinc-900/60 border-zinc-800/60 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate mb-1">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: card.color }}
                />
                <span className="truncate font-semibold text-zinc-300">
                  BAY-0{card.slotIndex + 1}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                {card.name.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
