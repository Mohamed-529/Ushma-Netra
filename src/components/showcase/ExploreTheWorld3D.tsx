import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, Compass, BookOpen, Cloud, CheckCircle2, Flame, Play, Volume2 } from 'lucide-react';

interface Props {
  onBackToMain: () => void;
  onOpenLiveCommand: () => void;
  onOpenArchitecture: () => void;
}

export const ExploreTheWorld3D: React.FC<Props> = ({
  onBackToMain,
  onOpenLiveCommand,
  onOpenArchitecture,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeQuest, setActiveQuest] = useState<number>(1);
  const [questModalOpen, setQuestModalOpen] = useState<boolean>(true);
  const [watchSimulationStep, setWatchSimulationStep] = useState<number>(0);

  // 3D Three.js scene setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb5cfb7); // Soft pastoral low-poly sky/fog
    scene.fog = new THREE.FogExp2(0xb5cfb7, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Directional Sun Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5db, 1.2);
    sun.position.set(10, 18, 8);
    sun.castShadow = true;
    scene.add(sun);

    // Low-poly terrain plane (soft hills)
    const groundGeo = new THREE.PlaneGeometry(60, 60, 20, 20);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.15) * Math.cos(y * 0.15) * 1.2);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x86a789,
      flatShading: true,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Stone pathway to cottage
    const pathGeo = new THREE.PlaneGeometry(4, 30);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xd2c4b5, flatShading: true });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.05, 2);
    scene.add(path);

    // Medieval / Rural Cottage / Timber building (like in video 02:49)
    const cottage = new THREE.Group();
    cottage.position.set(0, 0, -4);

    const wallsGeo = new THREE.BoxGeometry(6, 4, 6);
    const wallsMat = new THREE.MeshStandardMaterial({ color: 0xebd9b4, flatShading: true });
    const walls = new THREE.Mesh(wallsGeo, wallsMat);
    walls.position.y = 2;
    walls.castShadow = true;
    cottage.add(walls);

    // Roof
    const roofGeo = new THREE.ConeGeometry(5.2, 3, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, flatShading: true });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 5.2;
    roof.castShadow = true;
    cottage.add(roof);

    // Banner above entrance: "AWS ARCHITECTURE"
    const bannerGeo = new THREE.BoxGeometry(3, 0.6, 0.1);
    const bannerMat = new THREE.MeshStandardMaterial({ color: 0xd9381e });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 3.8, 3.06);
    cottage.add(banner);

    scene.add(cottage);

    // Low-poly trees around the world
    const createTree = (x: number, z: number) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.8, 6);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, flatShading: true });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.9;
      tree.add(trunk);

      const foliageGeo = new THREE.DodecahedronGeometry(1.2);
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x4f6f52, flatShading: true });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.4;
      tree.add(foliage);

      scene.add(tree);
    };

    createTree(-6, -2);
    createTree(-8, 3);
    createTree(7, -1);
    createTree(9, 4);
    createTree(5, -7);

    // Low-poly sheep / stones
    const stoneGeo = new THREE.DodecahedronGeometry(0.4);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xa9a9a9, flatShading: true });
    const stone1 = new THREE.Mesh(stoneGeo, stoneMat);
    stone1.position.set(2.5, 0.3, 3);
    scene.add(stone1);

    // Quest Waypoint Light Beam in front of door
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.35,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 6, -1);
    scene.add(beam);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle orbital pan
      camera.position.x = Math.sin(t * 0.15) * 3;
      camera.position.z = 12 + Math.cos(t * 0.15) * 1.5;
      camera.lookAt(0, 2, -2);

      beam.rotation.y = t * 0.5;

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

  return (
    <div className="relative w-full h-screen bg-[#b5cfb7] overflow-hidden font-sans select-none">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Floating HUD: Main Website Return + Compass */}
      <div className="relative z-10 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={onBackToMain}
            className="px-4 py-2 bg-white/90 backdrop-blur-md text-slate-900 rounded-full text-xs font-bold border border-slate-300 shadow-md flex items-center gap-2 hover:bg-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>MAIN WEBSITE</span>
          </button>
        </div>

        {/* Quest Tracker Pill (Top Left in Video 02:49) */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-300 shadow-xl max-w-sm space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>QUEST {activeQuest} OF 4</span>
            <Compass className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 font-serif">
            {activeQuest === 1 && 'MEET THE PURPOSE · STREET RESILIENCE'}
            {activeQuest === 2 && 'SEE WHAT IT RUNS ON · AWS ARCHITECTURE'}
            {activeQuest === 3 && 'READ THE TOME · THE POLICY CODE'}
            {activeQuest === 4 && 'WATCH IT HAPPEN · REAL CLOUD LOGS'}
          </div>
          <div className="text-xs text-slate-500">
            {activeQuest === 1 && 'Through the stone arch, by the cottage door'}
            {activeQuest === 2 && 'Enter the cloud sanctuary'}
            {activeQuest === 3 && 'The book on the table, in the middle of the room'}
            {activeQuest === 4 && 'Watch the thermal spike resolve on AWS in real time'}
          </div>
        </div>
      </div>

      {/* Bottom Floating Quest Action Menu */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-full border border-slate-300 shadow-2xl flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => {
              setActiveQuest(1);
              setQuestModalOpen(true);
            }}
            className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
              activeQuest === 1 ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quest 1: Purpose
          </button>

          <button
            onClick={() => {
              setActiveQuest(2);
              onOpenArchitecture();
            }}
            className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
              activeQuest === 2 ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quest 2: Architecture
          </button>

          <button
            onClick={() => {
              setActiveQuest(3);
              setQuestModalOpen(true);
            }}
            className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
              activeQuest === 3 ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quest 3: Read Tome
          </button>

          <button
            onClick={() => {
              setActiveQuest(4);
              setQuestModalOpen(true);
            }}
            className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
              activeQuest === 4 ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quest 4: Watch It Happen
          </button>
        </div>
      </div>

      {/* Quest Modal Dialogs (Matching Video 02:49 - 03:00) */}
      {questModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          {/* QUEST 1: MEET THE PURPOSE (Matching video 02:49) */}
          {activeQuest === 1 && (
            <div className="bg-[#fbf9f5] border border-slate-300 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-slate-900">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                QUEST 1 · WARD STONE
              </div>

              <h3 className="text-3xl font-extrabold font-serif text-slate-950 leading-tight">
                You hit the ground. <br />
                No one turned.
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                No lookout, no bell. In this street alley, a vendor collapse is private until someone walks past. The beacon on your cart woke up. It did not shout for help. It waited for you. When you're ready — the stone will walk with you.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveQuest(4);
                    setWatchSimulationStep(1);
                  }}
                  className="px-6 py-3 bg-[#d9381e] hover:bg-[#b82e17] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Show me the surge
                </button>
                <button
                  onClick={() => setQuestModalOpen(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Explore first
                </button>
              </div>
            </div>
          )}

          {/* QUEST 3: READ THE TOME (Matching parchment book in video 02:56) */}
          {activeQuest === 3 && (
            <div className="bg-[#ebd9b4] border-4 border-[#8b4513] rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 text-slate-900 font-serif relative">
              <div className="flex justify-between items-center border-b border-[#8b4513]/40 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b4513]">
                  THE PARCHMENT TOME · CEDAR LAW & BEDROCK AGENT
                </span>
                <button
                  onClick={() => setQuestModalOpen(false)}
                  className="text-xs font-mono bg-[#8b4513] text-white px-2 py-1 rounded cursor-pointer"
                >
                  Close Tome
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#8b4513]">I. SILENCE IS A SUPERPOWER</h4>
                  <p>
                    I am telling stories back, that was for someone to act. For hours and three days they didn't speak to me at all.
                  </p>
                  <div className="p-3 bg-[#f5ecd7] rounded-lg border border-[#8b4513]/30 font-mono text-[11px]">
                    <strong>GATE:</strong> CEDAR POLICY<br />
                    <strong>ALLOW:</strong> VENDOR CHECK-IN ONLY<br />
                    <strong>DENY:</strong> UNCONFIRMED CIVIC ALARMS
                  </div>
                  <p className="text-[11px] text-slate-600">
                    A pedestrian goes by their cart and would rather notice nothing than hear false alarms. Ushma-Netra is quiet until actual harm is certain.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#8b4513]">II. FINDING SOMEONE</h4>
                  <p>
                    Tiers are taken in a row, and the workflow waits for Suresh's phone with answer buttons. That could speak quite simply.
                  </p>
                  <div className="p-3 bg-[#f5ecd7] rounded-lg border border-[#8b4513]/30 font-mono text-[11px]">
                    <strong>AWS STEP FUNCTIONS:</strong><br />
                    WAIT_FOR_TASK_TOKEN<br />
                    PUSH NOTIFICATION → SURESH<br />
                    AUTO-FALLBACK: BUILDING SECURITY
                  </div>
                  <p className="text-[11px] text-slate-600">
                    If Suresh does not respond in 2 minutes, Step Functions seamlessly cascades to Building Facility and Ward Officer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QUEST 4: WATCH IT HAPPEN (Matching video 02:57 - 03:00) */}
          {activeQuest === 4 && (
            <div className="bg-[#fbf9f5] border border-slate-300 rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 text-slate-900">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  WHAT IS ACTUALLY HAPPENING ON AWS
                </div>
                <button
                  onClick={() => setQuestModalOpen(false)}
                  className="text-xs font-mono bg-slate-200 px-3 py-1 rounded-lg hover:bg-slate-300 cursor-pointer"
                >
                  Exit Demo
                </button>
              </div>

              {/* The Watch Dial + AWS Event Logs (Exact replica of video 02:57 - 03:00) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Watch Dial */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="w-56 h-56 rounded-full bg-slate-900 border-4 border-slate-700 p-3 shadow-xl flex flex-col items-center justify-center text-center text-white">
                    <div className="text-[10px] font-mono text-slate-400">GALAXY WEAR OS</div>
                    <div className="text-xl font-black font-mono text-red-500 my-2 animate-pulse">
                      Felt that
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">Simulated in the browser</div>
                    <div className="text-[10px] text-slate-500 mt-1">Real window: 2 min to answer</div>
                  </div>
                </div>

                {/* AWS Microservices Event Stack */}
                <div className="md:col-span-8 space-y-2.5 max-h-[360px] overflow-y-auto font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                    <div className="flex justify-between text-amber-800 font-bold text-[11px]">
                      <span>AWS LAMBDA 4</span>
                      <span>POST /ally/sensor</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans">
                      kind: "thermal_fall". Accelerometer and WBGT probe agreed it was a collapse. One request, one Lambda, running only for this moment.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-sky-200 space-y-1">
                    <div className="flex justify-between text-sky-800 font-bold text-[11px]">
                      <span>AMAZON POLLY</span>
                      <span>channel: post(speaker)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans">
                      A spike is never a direct blast or immediate panic to the family. He gets a moment to say he is fine.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-purple-200 space-y-1">
                    <div className="flex justify-between text-purple-800 font-bold text-[11px]">
                      <span>AMAZON BEDROCK NOVA</span>
                      <span>Judge: severity, confidence</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans">
                      The model informs the decision. It never makes it. Deterministic Cedar code makes it.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                    <div className="flex justify-between text-rose-800 font-bold text-[11px]">
                      <span>AWS STEP FUNCTIONS</span>
                      <span>waitForTaskToken</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans">
                      A push notice on Suresh's phone with answer buttons. The workflow waits — if 2 min passes, escalates to Building Facility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
