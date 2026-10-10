import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Layers,
  Activity,
  Sparkles,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Sun,
  Moon,
  Sparkle,
  Radio,
  Cpu,
  Database,
  Shield,
  Zap,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

export type WorkspaceTheme = 'pure_white' | 'multicolor' | 'dark_noir';

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
  themeMode: WorkspaceTheme;
}> = ({ card, isDocked, isSelected, onSelect, onHover, themeMode }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth lerp positions
  const currentPos = useRef(new THREE.Vector3(...card.elevatedPos));
  const currentRot = useRef(new THREE.Euler(-0.02, 0, 0));

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Target position calculation:
    const targetY = isDocked
      ? card.slotPos[1] + (hovered ? 0.75 : isSelected ? 0.45 : 0)
      : card.elevatedPos[1] + (hovered ? 0.5 : Math.sin(Date.now() * 0.002 + card.slotIndex) * 0.15);

    const targetX = card.slotPos[0];
    const targetZ = card.slotPos[2];

    const lerpSpeed = Math.min(delta * 7.5, 1);
    currentPos.current.x += (targetX - currentPos.current.x) * lerpSpeed;
    currentPos.current.y += (targetY - currentPos.current.y) * lerpSpeed;
    currentPos.current.z += (targetZ - currentPos.current.z) * lerpSpeed;

    meshRef.current.position.copy(currentPos.current);

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

  // Adapt card chassis color based on theme
  const cardChassisColor = useMemo(() => {
    if (themeMode === 'pure_white') {
      return isSelected ? '#18181b' : hovered ? '#27272a' : '#1f2937';
    }
    return isSelected ? '#18181b' : hovered ? '#27272a' : '#0f1015';
  }, [themeMode, isSelected, hovered]);

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
          color={cardChassisColor}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Glossy Top Plate */}
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

      {/* Vivid Multicolor Accent Header Ribbon */}
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

      {/* 3D Dynamic Monospace Data Layer */}
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

        {/* Primary Metric in Vivid Vibrant Color */}
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
  themeMode: WorkspaceTheme;
}> = ({ themeMode }) => {
  const deckWidth = 11.0;
  const deckHeight = 0.5;
  const deckDepth = 7.6;

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

  const isWhite = themeMode === 'pure_white';

  return (
    <group position={[0, -0.25, 0]}>
      {/* 1. Main Matte Architectural Console Base Plate */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[deckWidth, deckHeight, deckDepth]} />
        <meshStandardMaterial
          color={isWhite ? '#f4f4f5' : '#e4e4e7'}
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Top Precision Face Plate */}
      <mesh position={[0, deckHeight / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[deckWidth - 0.4, deckDepth - 0.4]} />
        <meshStandardMaterial
          color={isWhite ? '#ffffff' : '#f4f4f5'}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Fine Monospace Grid Lines on the deck surface */}
      <gridHelper
        args={[10.0, 20, isWhite ? '#e2e8f0' : '#d4d4d8', isWhite ? '#f1f5f9' : '#e4e4e7']}
        position={[0, deckHeight / 2 + 0.005, 0]}
      />

      {/* 3. Recessed Modular Docking Slots */}
      {slots.map((s, idx) => (
        <group key={s.id} position={[s.pos[0], deckHeight / 2 + 0.008, s.pos[2]]}>
          <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(s.w, s.d)]} />
            <lineBasicMaterial color={isWhite ? '#cbd5e1' : '#a1a1aa'} linewidth={1} />
          </lineSegments>

          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[s.w - 0.06, s.d - 0.06]} />
            <meshStandardMaterial
              color={isWhite ? '#e2e8f0' : '#d4d4d8'}
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>

          {/* Micro Corner Brackets */}
          <mesh position={[-s.w / 2 + 0.12, 0.01, -s.d / 2 + 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color={isWhite ? '#94a3b8' : '#71717a'} />
          </mesh>
          <mesh position={[s.w / 2 - 0.12, 0.01, -s.d / 2 + 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color={isWhite ? '#94a3b8' : '#71717a'} />
          </mesh>
          <mesh position={[-s.w / 2 + 0.12, 0.01, s.d / 2 - 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color={isWhite ? '#94a3b8' : '#71717a'} />
          </mesh>
          <mesh position={[s.w / 2 - 0.12, 0.01, s.d / 2 - 0.12]}>
            <boxGeometry args={[0.16, 0.02, 0.04]} />
            <meshStandardMaterial color={isWhite ? '#94a3b8' : '#71717a'} />
          </mesh>

          {/* Monospace Slot Label */}
          <Text
            position={[-s.w / 2 + 0.25, 0.015, -s.d / 2 + 0.25]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.09}
            color={isWhite ? '#64748b' : '#71717a'}
            anchorX="left"
            anchorY="middle"
          >
            {`BAY-0${idx + 1} // DOCK_BUS`}
          </Text>
        </group>
      ))}

      {/* 4. Peripheral Architectural Notches & Heat-Sink Exhaust Vents */}
      <mesh position={[0, 0, deckDepth / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[deckWidth - 0.8, 0.18, 0.05]} />
        <meshStandardMaterial color={isWhite ? '#1e293b' : '#27272a'} metalness={0.8} roughness={0.3} />
      </mesh>

      <Text
        position={[-deckWidth / 2 + 0.8, 0, deckDepth / 2 + 0.06]}
        fontSize={0.11}
        color={isWhite ? '#94a3b8' : '#a1a1aa'}
        anchorX="left"
        anchorY="middle"
      >
        USHMA-NETRA · AUTONOMOUS THERMAL INFRASTRUCTURE BENCH v3.8 · SEC_133 COMPLIANT
      </Text>

      <mesh position={[deckWidth / 2 - 0.8, 0, deckDepth / 2 + 0.06]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Rear Server Cable Conduit Trays */}
      {[-3.5, 0, 3.5].map((xPos, i) => (
        <group key={`conduit-${i}`} position={[xPos, -0.05, -deckDepth / 2 - 0.35]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.8, 16]} />
            <meshStandardMaterial color={isWhite ? '#475569' : '#3f3f46'} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
            <meshStandardMaterial color={isWhite ? '#0f172a' : '#18181b'} />
          </mesh>
        </group>
      ))}

      {/* 5. Infinite Soft Shadow Catching Ground Floor (Sub-surface) */}
      <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 28]} />
        <shadowMaterial opacity={isWhite ? 0.16 : 0.28} />
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
  themeMode: WorkspaceTheme;
}> = ({ isDocked, selectedCard, onSelectCard, hoveredCard, setHoveredCard, themeMode }) => {
  const rootGroupRef = useRef<THREE.Group>(null);

  // Subtle breathing oscillation for the platform
  useFrame((state) => {
    if (!rootGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    rootGroupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
  });

  return (
    <group ref={rootGroupRef} rotation={[0.48, -0.58, 0.28]}>
      {/* Structural Minimalist Matte White Console Tray */}
      <MainDeckConsole themeMode={themeMode} />

      {/* Floating / Dockable High-Density Infrastructure Cards */}
      {CARDS_DATA.map((card) => (
        <InteractiveTechCard
          key={card.id}
          card={card}
          isDocked={isDocked}
          isSelected={selectedCard?.id === card.id}
          onSelect={onSelectCard}
          onHover={setHoveredCard}
          themeMode={themeMode}
        />
      ))}
    </group>
  );
};

// Lighting Rig: Neutral high-key fill + Strong Directional Light for crisp architectural shadows
const TechnicalLightingRig: React.FC<{ themeMode: WorkspaceTheme }> = ({ themeMode }) => {
  const isWhite = themeMode === 'pure_white';

  return (
    <>
      {/* 1. Neutral Ambient High-Key Fill */}
      <ambientLight intensity={isWhite ? 1.35 : 1.1} />

      {/* 2. Strong Crisp Directional Key Light Casting Sharp Shadow Definition */}
      <directionalLight
        position={[14, 22, 12]}
        intensity={isWhite ? 3.0 : 2.8}
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
        intensity={isWhite ? 0.85 : 0.65}
        color={isWhite ? '#f8fafc' : '#e0e7ff'}
      />

      {/* 4. Top Rim Accent Light */}
      <pointLight
        position={[0, 16, 0]}
        intensity={isWhite ? 1.1 : 0.9}
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
  // Default to pure_white as requested by user!
  const [themeMode, setThemeMode] = useState<WorkspaceTheme>('pure_white');
  const [orbitResetTrigger, setOrbitResetTrigger] = useState<number>(0);

  const handleToggleDock = () => {
    setIsDocked((prev) => !prev);
    soundEngine.playSpikeAlert();
  };

  const handleZoomIn = () => {
    setCameraZoom((prev) => Math.min(prev + 5, 68));
    soundEngine.playTone(600, 'sine', 0.05);
  };

  const handleZoomOut = () => {
    setCameraZoom((prev) => Math.max(prev - 5, 28));
    soundEngine.playTone(450, 'sine', 0.05);
  };

  const handleResetCamera = () => {
    setCameraZoom(44);
    setOrbitResetTrigger((prev) => prev + 1);
    soundEngine.playTone(520, 'triangle', 0.08);
  };

  const activeCard = hoveredCard || selectedCard;
  const isWhite = themeMode === 'pure_white';
  const isMulticolor = themeMode === 'multicolor';

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl flex flex-col ${
        isWhite
          ? 'bg-white border-zinc-200/90 text-zinc-900 shadow-zinc-200/60'
          : isMulticolor
          ? 'bg-gradient-to-br from-slate-50 via-sky-50/70 to-indigo-50/60 border-sky-200/80 text-zinc-900'
          : 'bg-[#08080a] border-zinc-800/80 text-zinc-100 shadow-black/80'
      }`}
    >
      {/* Top Telemetry Header & Interactive HUD Ribbon */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 border-b backdrop-blur-md z-10 transition-colors ${
          isWhite
            ? 'bg-white/95 border-zinc-200/80 text-zinc-900'
            : isMulticolor
            ? 'bg-white/90 border-sky-100 text-zinc-900'
            : 'bg-zinc-950/80 border-zinc-800/50 text-zinc-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isWhite
                ? 'bg-sky-50 text-sky-600 border border-sky-200'
                : isMulticolor
                ? 'bg-gradient-to-br from-sky-100 to-indigo-100 text-indigo-600 border border-indigo-200'
                : 'bg-zinc-900 border border-zinc-800 text-sky-400'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider">
                FLOATING HARDWARE TEST-BENCH
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isWhite
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : isMulticolor
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-sky-950/60 text-sky-400 border-sky-800/60'
                }`}
              >
                R3F ISOMETRIC CANVAS
              </span>
            </div>
            <p className={`text-[11px] font-light ${isWhite || isMulticolor ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Interactive 3D docking console mapping satellite layers, serverless micro-services, and legal decree pipelines.
            </p>
          </div>
        </div>

        {/* Action Controls & Aesthetic Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Aesthetic Theme Switcher (Pure White / Multicolor / Dark Noir) */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs font-mono ${
              isWhite
                ? 'bg-zinc-100 border-zinc-200'
                : isMulticolor
                ? 'bg-white/80 border-sky-200'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <button
              onClick={() => {
                setThemeMode('pure_white');
                soundEngine.playTone(550, 'sine', 0.05);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                themeMode === 'pure_white'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Pure White Architectural Lab Deck (Requested)"
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span>PURE WHITE</span>
            </button>
            <button
              onClick={() => {
                setThemeMode('multicolor');
                soundEngine.playTone(600, 'sine', 0.05);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                themeMode === 'multicolor'
                  ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Multicolor Spectrum Deck"
            >
              <Palette className="w-3 h-3 text-indigo-500" />
              <span>MULTICOLOR</span>
            </button>
            <button
              onClick={() => {
                setThemeMode('dark_noir');
                soundEngine.playTone(450, 'sine', 0.05);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                themeMode === 'dark_noir'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              title="Neo-Noir Dark Matrix Deck"
            >
              <Moon className="w-3 h-3 text-sky-400" />
              <span>DARK NOIR</span>
            </button>
          </div>

          {/* Camera Zoom In / Out HUD Buttons (Replaces wheel so scroll is never hijacked) */}
          <div
            className={`flex items-center rounded-lg border text-xs font-mono overflow-hidden ${
              isWhite
                ? 'bg-zinc-100 border-zinc-200'
                : isMulticolor
                ? 'bg-white border-sky-200'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Zoom In 3D View"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Zoom Out 3D View"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetCamera}
              className="px-2 py-1 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] border-l border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
              title="Reset Isometric Angle"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          </div>

          {/* Dock / Undock Physics Trigger */}
          <button
            onClick={handleToggleDock}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              isDocked
                ? isWhite
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60'
                : 'bg-amber-500 text-zinc-950 border border-amber-400 shadow-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDocked ? 'EJECT / FLOAT' : 'DOCK INTO BENCH'}</span>
          </button>

          {/* Quick Select Cycle */}
          <button
            onClick={() => {
              const nextIndex = ((selectedCard?.slotIndex ?? 0) + 1) % CARDS_DATA.length;
              setSelectedCard(CARDS_DATA[nextIndex]);
              soundEngine.playTone(480, 'sine', 0.06);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isWhite
                ? 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 text-zinc-700'
                : isMulticolor
                ? 'bg-white hover:bg-sky-50 border-sky-200 text-sky-800'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
            title="Cycle next subsystem card"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CYCLE</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport (Free-flowing scroll: enableZoom=false, touchAction: pan-y, transparent pass-through wheel) */}
      <div
        className={`relative h-[480px] sm:h-[580px] lg:h-[640px] w-full cursor-grab active:cursor-grabbing transition-colors duration-300 overflow-hidden ${
          isWhite
            ? 'bg-[#ffffff]'
            : isMulticolor
            ? 'bg-gradient-to-b from-[#f8fafc] via-[#f0f9ff] to-[#f5f3ff]'
            : 'bg-[#08080a]'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Subtle engineering background grid behind 3D render */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity ${
            isWhite
              ? 'opacity-40'
              : isMulticolor
              ? 'opacity-30'
              : 'opacity-20'
          }`}
          style={{
            backgroundImage: isWhite
              ? `
                linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `
              : `
                linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
              `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 3D Canvas Instance */}
        <Canvas
          key={`canvas-reset-${orbitResetTrigger}`}
          shadows
          orthographic
          camera={{
            position: [18, 16, 20],
            zoom: cameraZoom,
            near: -40,
            far: 100,
          }}
          className="w-full h-full"
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting Rig tailored to theme */}
          <TechnicalLightingRig themeMode={themeMode} />

          {/* Isometric Tech Deck with Cards */}
          <TechWorkspaceScene
            isDocked={isDocked}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            themeMode={themeMode}
          />

          {/* Smooth Orbital Controls: enableZoom=FALSE SO MOUSE WHEEL SCROLLS FREELY! */}
          <OrbitControls
            enablePan={false}
            enableZoom={false} // CRITICAL: NEVER block page scroll wheel!
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.06}
          />
        </Canvas>

        {/* Floating Active Inspector Card HUD Overlay */}
        {activeCard && (
          <div
            className={`absolute top-4 left-4 max-w-sm w-full p-4 rounded-2xl backdrop-blur-xl border shadow-2xl pointer-events-none z-10 transition-all ${
              isWhite
                ? 'bg-white/95 border-zinc-200/90 text-zinc-900 shadow-zinc-300/50'
                : isMulticolor
                ? 'bg-white/95 border-sky-200 text-zinc-900 shadow-sky-200/50'
                : 'bg-zinc-950/85 border-zinc-800/80 text-zinc-100 shadow-black/80'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isWhite || isMulticolor ? 'border-zinc-200' : 'border-zinc-800/60'}`}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full ring-2 ring-white/50"
                  style={{ backgroundColor: activeCard.color }}
                />
                <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${isWhite || isMulticolor ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {activeCard.category} // BAY-0{activeCard.slotIndex + 1}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {isDocked ? 'DOCKED IN BENCH' : 'FLOATING STATE'}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold tracking-tight">
                {activeCard.name}
              </h4>
              <p className={`text-xs font-mono ${isWhite || isMulticolor ? 'text-zinc-600' : 'text-zinc-300'}`}>
                {activeCard.service}
              </p>
            </div>

            <div
              className={`mt-3 p-2.5 rounded-xl border space-y-1 font-mono text-xs ${
                isWhite
                  ? 'bg-zinc-50 border-zinc-200'
                  : isMulticolor
                  ? 'bg-sky-50/60 border-sky-200'
                  : 'bg-zinc-900/80 border-zinc-800/60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[11px] ${isWhite || isMulticolor ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Primary Telemetry:
                </span>
                <span className="font-bold text-sm" style={{ color: activeCard.color }}>
                  {activeCard.metric}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-[11px] ${isWhite || isMulticolor ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Engine Spec:
                </span>
                <span className={`text-[11px] font-medium ${isWhite || isMulticolor ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {activeCard.subtext}
                </span>
              </div>
            </div>

            <div className={`mt-2 text-[10px] font-mono flex items-center justify-between ${isWhite || isMulticolor ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <span>CLICK CARD TO FOCUS</span>
              <span>DRAG TRAY TO ROTATE</span>
            </div>
          </div>
        )}

        {/* Micro Telemetry Legend in bottom-right */}
        <div
          className={`absolute bottom-4 right-4 p-3 rounded-xl backdrop-blur-md border text-[10px] font-mono space-y-1 pointer-events-none hidden sm:block ${
            isWhite
              ? 'bg-white/90 border-zinc-200/90 text-zinc-700 shadow-md'
              : isMulticolor
              ? 'bg-white/90 border-sky-200 text-zinc-700 shadow-md'
              : 'bg-zinc-950/80 border-zinc-800/60 text-zinc-400 shadow-black/80'
          }`}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-sky-500" />
            <span>MULTICOLOR DECK CHANNELS</span>
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

        {/* Free-flow Scroll & Gesture Guidance in bottom-left */}
        <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 text-[10px] font-mono pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded-md border font-semibold ${
              isWhite
                ? 'bg-white/90 border-zinc-300 text-zinc-800 shadow-xs'
                : isMulticolor
                ? 'bg-white/90 border-sky-300 text-sky-900 shadow-xs'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            }`}
          >
            👆 DRAG TO ROTATE 3D TRAY
          </span>
          <span
            className={`px-2 py-0.5 rounded-md border font-semibold ${
              isWhite
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                : isMulticolor
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-xs'
                : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
            }`}
          >
            ✓ MOUSE WHEEL SCROLLS PAGE FREELY
          </span>
          <span
            className={`hidden md:inline-block px-2 py-0.5 rounded-md border ${
              isWhite
                ? 'bg-white/90 border-zinc-300 text-zinc-600'
                : isMulticolor
                ? 'bg-white/90 border-sky-300 text-sky-800'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            HOVER CARDS FOR RAYCASTER LIFT
          </span>
        </div>
      </div>

      {/* Quick Interactive Card Dock Selector Bar */}
      <div
        className={`p-3 border-t grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 transition-colors ${
          isWhite
            ? 'bg-zinc-50 border-zinc-200 text-zinc-900'
            : isMulticolor
            ? 'bg-sky-50/50 border-sky-200 text-zinc-900'
            : 'bg-zinc-950/80 border-zinc-800/40 text-zinc-100'
        }`}
      >
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
              className={`p-2 rounded-xl text-left transition-all border font-mono text-[11px] cursor-pointer ${
                isCurrent
                  ? isWhite
                    ? 'bg-white border-zinc-400 text-zinc-950 shadow-md ring-2 ring-sky-500/20'
                    : isMulticolor
                    ? 'bg-white border-indigo-400 text-zinc-950 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-zinc-900 border-zinc-600 text-zinc-100 shadow-md'
                  : isWhite
                  ? 'bg-white/60 hover:bg-white border-zinc-200 text-zinc-600'
                  : isMulticolor
                  ? 'bg-white/60 hover:bg-white border-sky-200 text-sky-900'
                  : 'bg-zinc-950/50 hover:bg-zinc-900/60 border-zinc-800/60 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate mb-1">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: card.color }}
                />
                <span className={`truncate font-bold ${isWhite || isMulticolor ? 'text-zinc-800' : 'text-zinc-200'}`}>
                  BAY-0{card.slotIndex + 1}
                </span>
              </div>
              <div className={`text-[10px] truncate ${isWhite || isMulticolor ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {card.name.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
