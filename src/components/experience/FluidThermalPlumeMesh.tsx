import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { ShieldCheck, Flame, RotateCcw, Wind, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';

// Custom Vertex Shader for Dynamic 3D Fluid Plume Morphing
const vertexShader = `
  uniform float uTime;
  uniform float uLouverFactor; // 0.0 = Ground blast (unmitigated), 1.0 = Skyward diversion (mitigated)
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Classic Simplex-style Perlin pseudo-noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;

    // Base wave flow
    float flowSpeed = mix(2.4, 1.1, uLouverFactor);
    float t = uTime * flowSpeed;

    // UNMITIGATED STATE: High turbulence, downward exhaust dumping onto street
    float noiseTurbulence = snoise(pos.xy * 0.8 + vec2(t * 0.4, t * 0.2)) * 0.45;
    float downwardBlast = -0.55 * (1.0 - uLouverFactor) * sin(pos.x * 2.0 + t);

    // MITIGATED STATE: Smooth laminar wave curving skyward (away from sidewalk)
    float upwardDiversion = 0.85 * uLouverFactor * (pos.x * 0.6 + 0.4) * cos(pos.y * 1.5 + t * 0.5);
    float smoothLaminar = sin(pos.x * 3.0 + t) * 0.2 * uLouverFactor;

    // Blend physics vectors
    float elevation = noiseTurbulence * (1.0 - uLouverFactor) + downwardBlast + upwardDiversion + smoothLaminar;
    pos.z += elevation;

    vElevation = elevation;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Custom Fragment Shader for Heat-Map Chromatic Thermodynamics
const fragmentShader = `
  uniform float uTime;
  uniform float uLouverFactor;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Scorching Hot Palette (Unmitigated: 54°C Crimson & Intense Amber)
    vec3 colorCoreScorching = vec3(0.96, 0.18, 0.12); // #f52e1f Deep crimson
    vec3 colorHotPlume = vec3(0.98, 0.55, 0.15);      // #fa8c26 Intense amber
    vec3 colorCharEdge = vec3(0.20, 0.05, 0.03);      // Smoldering boundary

    // Restorative Cooling Palette (Mitigated: 21°C Cyan, Emerald & Skyward Teal)
    vec3 colorLaminarCool = vec3(0.05, 0.72, 0.65);   // #0db8a6 Cool teal
    vec3 colorSkywardBlue = vec3(0.12, 0.52, 0.95);   // #1f85f3 Safe atmosphere
    vec3 colorCleanAir = vec3(0.85, 0.95, 0.98);      // Clean ambient sheen

    // Normalized height factor for gradient
    float h = clamp((vElevation + 0.5) * 0.8, 0.0, 1.0);

    vec3 unmitigatedColor = mix(colorCharEdge, mix(colorCoreScorching, colorHotPlume, h), vUv.x);
    vec3 mitigatedColor = mix(colorSkywardBlue, mix(colorLaminarCool, colorCleanAir, h), vUv.y);

    // Dynamically morph color spectrum based on louver factor
    vec3 finalColor = mix(unmitigatedColor, mitigatedColor, uLouverFactor);

    // Subtle technical wireframe grid overlay
    vec2 grid = abs(fract(vPosition.xy * 6.0 - 0.5) - 0.5) / fwidth(vPosition.xy * 6.0);
    float line = min(grid.x, grid.y);
    float gridAlpha = 1.0 - min(line, 1.0);

    finalColor += vec3(gridAlpha * 0.18);

    // Vignette / Rim fade
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                     smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

    gl_FragColor = vec4(finalColor, 0.92 * edgeFade);
  }
`;

function PlumeWaveMesh({ isMitigated }: { isMitigated: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const currentLouverFactor = useRef(0);

  // High-density parametric grid geometry (120x80 divisions for buttery continuous fluid)
  const geometry = useMemo(() => new THREE.PlaneGeometry(5.2, 3.4, 96, 64), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLouverFactor: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    // Time increment
    materialRef.current.uniforms.uTime.value += delta;

    // Smoothly interpolate louver factor between 0.0 and 1.0
    const targetFactor = isMitigated ? 1.0 : 0.0;
    currentLouverFactor.current = THREE.MathUtils.lerp(
      currentLouverFactor.current,
      targetFactor,
      delta * 3.5
    );
    materialRef.current.uniforms.uLouverFactor.value = currentLouverFactor.current;

    // Subtle gentle camera breathing rotation
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
      meshRef.current.rotation.x = -0.35 + Math.cos(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -0.1, 0]} rotation={[-0.35, 0.2, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface FluidThermalPlumeMeshProps {
  className?: string;
  initialMitigated?: boolean;
}

export const FluidThermalPlumeMesh: React.FC<FluidThermalPlumeMeshProps> = ({
  className = '',
  initialMitigated = false,
}) => {
  const [isMitigated, setIsMitigated] = useState<boolean>(initialMitigated);

  const toggleLouvers = () => {
    const nextState = !isMitigated;
    setIsMitigated(nextState);
    if (nextState) {
      soundEngine.playMitigation();
    } else {
      soundEngine.playSpikeAlert();
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-[#efe8dc] border border-[#d6cebe] shadow-[0_8px_32px_rgba(11,27,45,0.08)] overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}
    >
      {/* Top HUD Status & Live Telemetry Strip */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-3 border-b border-[#d6cebe]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isMitigated ? 'bg-emerald-600' : 'bg-red-600 animate-ping'
            }`}
          />
          <span className="text-xs font-mono font-bold tracking-wider text-[#0b1b2d] uppercase">
            {isMitigated ? 'LOUVERS SKYWARD ACTIVE' : 'UNMITIGATED 54°C JET'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span
            className={`px-2 py-0.5 rounded font-bold ${
              isMitigated
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {isMitigated ? '21.4°C CANOPY' : '54.2°C SIDEWALK'}
          </span>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden bg-[#e4dcce]/70 my-3">
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 48 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.9} />
          <PlumeWaveMesh isMitigated={isMitigated} />
        </Canvas>

        {/* Floating Physical Vector Indicators */}
        <div className="absolute top-3 left-3 bg-[#f5efe6]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#d6cebe] text-[10px] font-mono text-[#0b1b2d] space-y-0.5 shadow-sm">
          <div className="text-[#0b1b2d]/60 font-semibold uppercase">Exhaust Vector</div>
          <div className="font-bold flex items-center gap-1.5">
            {isMitigated ? (
              <>
                <span className="text-emerald-700 font-black">↑ +78°</span>
                <span>Skyward Convection</span>
              </>
            ) : (
              <>
                <span className="text-red-700 font-black">↓ -12°</span>
                <span>Pedestrian Canyon Blast</span>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 bg-[#f5efe6]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#d6cebe] text-[10px] font-mono text-[#0b1b2d] text-right shadow-sm">
          <div className="text-[#0b1b2d]/60 font-semibold uppercase">Rejection Power</div>
          <div className="font-bold text-[#0b1b2d]">
            {isMitigated ? '638.4 kW Dispersed' : '638.4 kW Trapped'}
          </div>
        </div>
      </div>

      {/* Bottom Interactive Actuation Bar */}
      <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="text-[11px] text-[#0b1b2d]/70 font-sans">
          {isMitigated
            ? 'Pneumatic deflection active: Exhaust routed safely into upper troposphere.'
            : 'Unconsented AC dumping: 54°C blast trapped at vendor breathing height.'}
        </div>

        {/* Actuation Morph Toggle Button */}
        <button
          onClick={toggleLouvers}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            isMitigated
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-[#0b1b2d] hover:bg-[#1b2f47] text-white'
          }`}
        >
          {isMitigated ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
              <span>Reset to Ground Blast</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Engage Skyward Louvers</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
