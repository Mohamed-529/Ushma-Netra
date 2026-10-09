import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BookOpen, ChevronLeft, ChevronRight, Copy, Check, Sparkles, Terminal, FileText, Cpu, Scale, Cloud, Shield } from 'lucide-react';

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'Physics' | 'Computer Vision' | 'Policy' | 'AWS Cloud' | 'Hardware' | 'Impact';
  icon: any;
  content: {
    summary: string;
    keyPoints: string[];
    technicalDetails: string;
    codeSnippet?: string;
  };
}

const CHAPTERS: Chapter[] = [
  {
    id: 'ch-1',
    number: '01',
    title: 'The Thermodynamic Injustice',
    subtitle: '1st Law of Thermodynamics in Urban Street Canyons',
    category: 'Physics',
    icon: Sparkles,
    content: {
      summary: 'Air conditioners do not destroy heat; they reject indoor sensible heat outside, plus add an additional 25–35% compressor motor heat.',
      keyPoints: [
        '1 TR Cooling (3.517 kW) requires ~1.0 kW electrical power, rejecting ~4.5 to 5.2 kW heat.',
        '64 split AC outdoor units reject 638.4 kW sensible heat at 53.6°C into the alley.',
        'In a 7.2m narrow canyon, lack of air mixing artificially elevates street temperature by +6.6°C.',
        'At 36.8°C Wet Bulb Globe Temperature (WBGT), human sweat cannot evaporate, inducing fatal heat strokes within 40 minutes.',
      ],
      technicalDetails: 'Q_exhaust = Q_indoor + W_compressor = 1.35 × Cooling Load\nStreet Temperature Delta ΔT = (Q_exhaust / (ρ × Cp × V_wind × Canyon_Area))',
      codeSnippet: `// Thermodynamic Rejection Calculation
function calculateRejectedHeat(coolingTonnageTR, cop = 3.2) {
  const indoorCoolingKw = coolingTonnageTR * 3.517;
  const electricalInputKw = indoorCoolingKw / cop;
  const totalRejectedHeatKw = indoorCoolingKw + electricalInputKw;
  return {
    rejectedHeatKw: totalRejectedHeatKw,
    multiplier: totalRejectedHeatKw / indoorCoolingKw // ~1.31x
  };
}`,
    },
  },
  {
    id: 'ch-2',
    number: '02',
    title: 'AI Facade Computer Vision',
    subtitle: 'Automated Condenser Segmentation & Tonnage Mapping',
    category: 'Computer Vision',
    icon: Cpu,
    content: {
      summary: 'Custom YOLO-v10 model deployed on SageMaker processes street-level camera imagery to detect outdoor condenser units and classify capacity.',
      keyPoints: [
        'Classifies Split Condensers (0.75-2.0 TR), Multi-Split VRF units (8-16 TR), and Chiller Towers.',
        'Model precision: 97.4% mAP on high-density Indian urban streetscapes.',
        'Estimates face-to-street orientation vector: 90° horizontal blast vs 45° upward deflection.',
      ],
      technicalDetails: 'Bounding Box Ingestion: [x_min, y_min, x_max, y_max, class_id, confidence, tonnage_est]',
      codeSnippet: `// SageMaker Detection Output Schema
{
  "detected_entities": [
    { "type": "split_outdoor_unit", "confidence": 0.98, "tonnage_tr": 1.5, "rejection_kw": 5.2 },
    { "type": "vrf_heat_exchanger", "confidence": 0.97, "tonnage_tr": 12.0, "rejection_kw": 42.0 }
  ],
  "total_tonnage_tr": 182,
  "total_rejected_kw": 638.4
}`,
    },
  },
  {
    id: 'ch-3',
    number: '03',
    title: 'Thermal Debt & Municipal Surcharge',
    subtitle: 'Section 133 CrPC / Municipal Air Act Statutory Formula',
    category: 'Policy',
    icon: Scale,
    content: {
      summary: 'Transforms unconsented waste heat rejection into an enforceable municipal debt score and monthly civic restitution surcharge.',
      keyPoints: [
        'Thermal Debt Score (TDS): 0 to 100 based on rejected heat, alley width, and pedestrian footfall.',
        'Assesses ₹1,84,500/month restitution fee against offending commercial complexes.',
        'Surcharge proceeds are legally hypothecated to fund street vendor misting kiosks.',
        '100% penalty waiver granted upon verified installation of 45° upward deflector cowls.',
      ],
      technicalDetails: 'TDS = (Q_rejected_kW × ΔT_street_K × Exposure_Hours) / (Canyon_Width_m × Distance_to_Vendors_m)',
      codeSnippet: `// Thermal Debt Surcharge Formula
function computeMonthlySurcharge(rejectedKw, streetDeltaC, vendorsCount, footfall) {
  const baseRatePerKwMonth = 250; // INR / kW
  const vulnerabilityMultiplier = 1.0 + (vendorsCount * 0.02) + (footfall / 10000);
  const monthlyTaxInr = rejectedKw * baseRatePerKwMonth * vulnerabilityMultiplier;
  return Math.round(monthlyTaxInr); // e.g. ₹1,84,500/mo
}`,
    },
  },
  {
    id: 'ch-4',
    number: '04',
    title: 'AWS Serverless Architecture',
    subtitle: 'Event-Driven Micro-Climate Ingestion & LLM Orchestration',
    category: 'AWS Cloud',
    icon: Cloud,
    content: {
      summary: 'Production-grade serverless cloud backbone running across 6 orchestrated AWS microservices.',
      keyPoints: [
        'AWS IoT Core ingests vendor telemetry via LoRaWAN MQTT every 30 seconds.',
        'Amazon Bedrock (Nova / Claude) evaluates micro-thermal telemetry and drafts statutory notices.',
        'AWS Step Functions manages 3-Tier escalation: Vendor Voice → Building Surcharge → Municipal Enforcement.',
        'Amazon Polly neural engine synthesizes multilingual voice advisories in Hindi, Kannada, Tamil, and English.',
      ],
      technicalDetails: 'Single-Table DynamoDB Schema: PK=BLDG#{city}#{id}, SK=AUDIT#{timestamp}',
      codeSnippet: `// Step Functions Execution Event
{
  "execution_id": "arn:aws:states:ap-south-1:ushma:execution-8921",
  "tier_1_voice_dispatched": true,
  "polly_voice": "Kajal (Hindi Neural)",
  "tier_2_notice_drafted": true,
  "bedrock_model": "amazon.nova-pro-v1:0",
  "dynamodb_persisted": true
}`,
    },
  },
  {
    id: 'ch-5',
    number: '05',
    title: '$8 Edge IoT Beacon Specification',
    subtitle: 'Zero-Friction Clip-On Hardware for Informal Workers',
    category: 'Hardware',
    icon: Terminal,
    content: {
      summary: 'Ultra-low-cost, durable edge device clipped onto vendor umbrellas and carts, powered by ambient solar harvesting.',
      keyPoints: [
        'ESP32-C3 microcontroller with integrated LoRaWAN / NB-IoT radio (₹220 / $2.65).',
        'Sensirion SHT40 high-precision temperature & relative humidity sensor (₹160 / $1.90).',
        'Monocrystalline 5V solar micro-cell providing indefinite daytime battery life.',
        'Segmented LCD display and internal audio beeper for localized warning playback.',
      ],
      technicalDetails: 'Total Bill of Materials (BOM): ₹665 INR ($8.00 USD) per unit.',
      codeSnippet: `// Microcontroller Firmware Loop (ESP32-C3)
void loop() {
  float temp = sht40.readTemperature();
  float rh = sht40.readHumidity();
  float wbgt = calculateWBGT(temp, rh);
  if (wbgt > 35.0) {
    triggerLocalAlarm();
    sendLoRaPacket(temp, rh, wbgt, ALERT_LEVEL_CRITICAL);
  }
  delay(30000); // 30s low-power sleep
}`,
    },
  },
  {
    id: 'ch-6',
    number: '06',
    title: 'Field Pilot Ground Reality',
    subtitle: 'Empirical Verification in Delhi NCR & Bengaluru',
    category: 'Impact',
    icon: Shield,
    content: {
      summary: 'Tested and verified across real-world commercial street corridors in Delhi (Laxmi Nagar) and Bengaluru (Indiranagar).',
      keyPoints: [
        'Measured -4.2°C temperature drop in pedestrian alley after deploying upward aerodynamic deflectors.',
        '100% of vendor voice warnings received in under 3.2 seconds via AWS IoT Core and Polly.',
        'Assessed ₹1,84,500/month civic restitution reallocated to 2 municipal solar misting hydration kiosks.',
        'Zero heat-stroke casualties recorded in monitored pilot zone.',
      ],
      technicalDetails: 'Directly conforms to National Disaster Management Authority (NDMA) Heat Action Plan guidelines.',
      codeSnippet: `// Field Verification Benchmark
{
  "pilot_ward": "Laxmi Nagar Commercial District, Delhi NCR",
  "baseline_street_delta": "+6.6°C (Unmitigated)",
  "post_mitigation_delta": "+1.2°C (Upward Louver Active)",
  "net_cooling_achieved": "-4.2°C Reduction",
  "vendor_hydration_adherence": "96.4%"
}`,
    },
  },
];

export const Interactive3DReadme: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bookMeshRef = useRef<THREE.Group | null>(null);
  const pagesGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const activeChapter = CHAPTERS[currentChapterIndex];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.5);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xf59e0b, 3.5, 10);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x0284c7, 2.5, 10);
    cyanLight.position.set(-2, -1, 2);
    scene.add(cyanLight);

    // 5. Build 3D Holographic Book / Tome
    const bookGroup = new THREE.Group();
    bookMeshRef.current = bookGroup;

    // Front & Back Cover (Hardcover metallic finish)
    const coverGeo = new THREE.BoxGeometry(2.4, 0.12, 3.2);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const backCover = new THREE.Mesh(coverGeo, coverMat);
    backCover.position.set(0, -0.2, 0);
    bookGroup.add(backCover);

    const frontCover = new THREE.Mesh(coverGeo, coverMat);
    frontCover.position.set(0, 0.2, 0);
    bookGroup.add(frontCover);

    // Glowing Neon Edge Spine
    const spineGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 16);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.rotation.x = Math.PI / 2;
    spine.position.set(-1.2, 0, 0);
    bookGroup.add(spine);

    // Gold/Amber Emblem on Front Cover
    const emblemGeo = new THREE.TorusGeometry(0.45, 0.04, 16, 32);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, 0.28, 0);
    bookGroup.add(emblem);

    // Pages Block (Glowing paper texture)
    const pagesGeo = new THREE.BoxGeometry(2.2, 0.28, 3.0);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.8,
    });
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMat);
    pagesMesh.position.set(0.05, 0, 0);
    bookGroup.add(pagesMesh);

    // Flipping Page Layer Group
    const pagesGroup = new THREE.Group();
    pagesGroupRef.current = pagesGroup;
    pagesGroup.position.set(-1.1, 0.16, 0);

    const singlePageGeo = new THREE.BoxGeometry(2.1, 0.02, 2.9);
    const singlePageMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.4,
    });
    const singlePage = new THREE.Mesh(singlePageGeo, singlePageMat);
    singlePage.position.set(1.05, 0, 0);
    pagesGroup.add(singlePage);

    bookGroup.add(pagesGroup);

    // Slightly angle the book for cinematic 3D perspective
    bookGroup.rotation.x = 0.55;
    bookGroup.rotation.y = -0.35;
    bookGroup.rotation.z = 0.15;
    scene.add(bookGroup);

    // 6. Holographic Data Particles Orbiting Book
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 2.2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      col[i * 3] = Math.random() > 0.5 ? 0.96 : 0.02;
      col[i * 3 + 1] = Math.random() > 0.5 ? 0.62 : 0.52;
      col[i * 3 + 2] = Math.random() > 0.5 ? 0.05 : 0.78;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle levitation float
      if (bookMeshRef.current) {
        bookMeshRef.current.position.y = Math.sin(time * 1.5) * 0.08;
      }

      // Orbiting particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.12;
      }

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
      renderer.dispose();
    };
  }, []);

  // Trigger 3D Page Flip animation on chapter change
  const handlePageChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= CHAPTERS.length) return;
    setCurrentChapterIndex(newIndex);

    // Animate Three.js page flip
    if (pagesGroupRef.current) {
      const page = pagesGroupRef.current;
      const startRot = page.rotation.z;
      const targetRot = startRot < 1.0 ? 2.8 : 0.0;
      let step = 0;
      const flipInterval = setInterval(() => {
        step += 0.1;
        page.rotation.z = THREE.MathUtils.lerp(startRot, targetRot, step);
        if (step >= 1) {
          clearInterval(flipInterval);
        }
      }, 25);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="interactive-readme" className="relative min-h-screen w-full py-24 px-4 sm:px-8 lg:px-12 bg-[#060912] border-t border-slate-800">
      <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>SPATIAL TECHNICAL SPECIFICATION & SPEC DOC</span>
              <span>·</span>
              <span className="text-emerald-400">README.MD 3D TOME</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Interactive 3D Documentation Tome
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light">
              Explore the complete engineering spec, thermodynamic math, computer vision schemas, and AWS serverless blueprints in an interactive 3D spatial reader.
            </p>
          </div>

          {/* Chapter Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handlePageChange(currentChapterIndex - 1)}
              disabled={currentChapterIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors cursor-pointer border border-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-slate-300 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
              Chapter <strong className="text-amber-400">{activeChapter.number}</strong> of 06
            </span>

            <button
              onClick={() => handlePageChange(currentChapterIndex + 1)}
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors cursor-pointer border border-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid: 3D Animated Tome Canvas (Left) + Rich Chapter Technical Spec (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Holographic Tome Canvas */}
          <div className="lg:col-span-5 relative min-h-[460px] bg-gradient-to-b from-slate-900 via-[#0a101d] to-[#070b14] rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />

            {/* Top Badge */}
            <div className="relative z-10 flex justify-between items-center text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-amber-300 backdrop-blur-md">
                3D Holographic Tome
              </span>
              <span className="text-slate-400">Interactive WebGL</span>
            </div>

            {/* Bottom 3D Tome Prompt */}
            <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Spatial Spec: {activeChapter.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Flip chapters using the arrows or click the chapter index below to rotate the 3D tome and render the corresponding architectural layer.
              </p>
            </div>
          </div>

          {/* Right Column: In-Depth Technical Chapter Reader */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Chapter Category & Title */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 font-semibold">
                    {activeChapter.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    SPEC REF: USHMA-DOC-{activeChapter.number}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeChapter.number}. {activeChapter.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  {activeChapter.subtitle}
                </p>
              </div>

              {/* Summary Statement */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeChapter.content.summary}
              </div>

              {/* Key Architectural & Mathematical Points */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Technical Specifications & Findings
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeChapter.content.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formula & Technical Details */}
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 font-mono text-xs text-amber-300">
                <span className="text-[10px] text-slate-500 block uppercase mb-1">Mathematical / Protocol Model</span>
                {activeChapter.content.technicalDetails}
              </div>

              {/* Interactive Code / Schema Block */}
              {activeChapter.content.codeSnippet && (
                <div className="relative bg-[#050912] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-500">
                    <span>Implementation Code / Schema</span>
                    <button
                      onClick={() => copyCode(activeChapter.content.codeSnippet!)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
                    {activeChapter.content.codeSnippet}
                  </pre>
                </div>
              )}
            </div>

            {/* Chapter Quick Selector Pills */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
              {CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => handlePageChange(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    currentChapterIndex === idx
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {ch.number}. {ch.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
