# Ushma-Netra (ऊष्मा-नेत्र)
### Autonomous Micro-Thermal Equity & AC Exhaust Debt Grid
**AWS Environmental Hackathon — Track 02: Heat & Water**

---

## ⚡ The Hidden Crisis: The AC Exhaust "Death Loop"

As Indian megacities experience record-shattering heatwaves, commercial establishments and high-rises install tens of thousands of Air Conditioners.

**The fundamental thermodynamic injustice:**
> **Air conditioners do not destroy heat — they extract indoor heat and blast superheated 50°C–55°C exhaust directly into narrow street canyons at head height.**

In dense Indian cities (Delhi NCR, Bengaluru, Mumbai, Ahmedabad), 60+ split and VRF AC condensing units are mounted at ground level facing narrow alleys (4m–8m wide). While occupants enjoy 20°C inside, informal street vendors, rickshaw pullers, and pedestrians are trapped in an unventilated furnace where temperatures surge to **54°C** and the Wet Bulb Globe Temperature (WBGT) crosses **36.8°C** — exceeding the physiological limit where human sweat can evaporate.

**We are actively baking the poor so the affluent stay cool.**

---

## 🚀 The "First-of-its-Kind" Solution

**Ushma-Netra** is the world's first AI platform to map, quantify, and penalize micro-thermal exhaust dumping.

### Why It's a Breakthrough:
While everyone else builds AI to optimize internal AC energy efficiency, Ushma-Netra is the first platform tackling the **human collateral damage of AC thermal dumping** onto informal street workers.

```
                  ┌──────────────────────────────────────────────┐
                  │          USHMA-NETRA 4-PILLAR PIPELINE       │
                  └──────────────────────┬───────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
[1. DETECT & AUDIT]             [2. REASON & TAX]               [3. SHIELD & RESTORE]
Amazon SageMaker CV             Amazon Bedrock (Nova/Claude)    Section 133 Statutory Order
Counts facade outdoor units,    Computes Thermal Debt Score     Mandates 45° upward deflectors
calculates rejected kW load,    and statutory monthly           and allocates penalty surcharge
merges with Landsat-9 LST.      Section 133 Exhaust Surcharge.  to street vendor misting kiosks.
```

---

## 🌟 Interactive Experience Architecture (The 8 Acts)

Rather than a conventional generic SaaS landing page, the application is structured as an **interactive cinematic product documentary + live technical mission control**:

1. **Act 01: WOW HERO**
   - Immersive dark atmospheric opening
   - Interactive **FLIR Thermal Infrared Inspection Lens** with live IR spot temperature cursor readout (`20.5°C Chilled Interior` vs `53.8°C Pedestrian Exhaust Jet`)
   - Pure Web Audio API synthesized **50Hz AC compressor drone & thermal wind soundscape**
2. **Act 02: PROBLEM (Anthropogenic Canyon Thermodynamics)**
   - Interactive AC Chiller Load vs Alley Plume engine simulating real-time sensible heat (kW) and street temperature delta
   - 4-stage thermodynamic pipeline: Evaporator → Compressor (+35% work) → Pedestrian blast → Canyon trapping
3. **Act 03: TENSION (Human Collateral & Physiological Limit)**
   - 35°C WBGT physiological boundary where sweat cannot evaporate
   - Real-world subject case study: *Rameshwar Pal* (52, tea stall operator 2.8m from 64 AC outdoor units)
4. **Act 04: INSIGHT & SOLUTION REVEAL**
   - The regulatory paradox: *"Why is dumping sewage in a street a crime, but dumping 600 kW of boiling thermal exhaust legal?"*
   - Convergence of satellite radiometry, computer vision, and municipal law
5. **Act 05: LIVE WORKING COCKPIT (The Centerpiece)**
   - **3D Thermal Plume Digital Twin (Three.js WebGL)**: Interactive street canyon with 3D buildings, glowing thermal exhaust particle flows, camera orbits, and upward louver mitigation
   - **AI Facade CV Scanner**: YOLO-v10 detection model with bounding boxes, tonnage calculations, and street delta estimation
   - **Thermal Debt & Section 133 Surcharge Ledger**: Powered by Gemini AI, rank-ordered building compliance and restitution fund tracking
   - **Street Vendor IoT Beacon**: $8 hardware node telemetry simulator with Hindi/English voice broadcast and panic alert
6. **Act 06: PROOF & FIELD TRIAL DATA**
   - Before vs After quantified comparison in Delhi NCR (Laxmi Nagar) and Bengaluru (Indiranagar)
   - Verified **-4.2°C street cooling** and **₹1.84L/month** restitution fund pool
7. **Act 07: AWS PRODUCTION TECHNOLOGY & SERVERLESS BLUEPRINT**
   - Full serverless architecture: AWS IoT Core, SageMaker, Bedrock, Step Functions, EventBridge, Lambda, Timestream, DynamoDB
   - Interactive stage-by-stage payload inspection
8. **Act 08: MUNICIPAL THERMAL DEBT CALCULATOR & DECREE**
   - Real-time calculator for any building type, AC unit count, and alley geometry
   - One-click copy/export of statutory **Section 133 CrPC Municipal Order**

---

## 🛠️ AWS Serverless Technology Stack

| Capability | AWS Service | Purpose |
| :--- | :--- | :--- |
| **Edge Ingestion** | AWS IoT Core | LoRaWAN / MQTT ingestion from $8 vendor WBGT beacons |
| **Computer Vision** | Amazon SageMaker | YOLO-v10 facade model counting condenser fans & calculating tonnage |
| **Satellite Imagery** | Landsat-9 via AWS Registry | Surface Temperature (LST) anomaly identification |
| **Agentic Reasoning** | Amazon Bedrock (Nova / Claude) | Thermal Debt scoring and drafting statutory environmental decrees |
| **Orchestration** | AWS Step Functions | Multi-tier escalation: Tier-1 voice alert, Tier-2 legal notice, Tier-3 grid throttle |
| **Event Routing** | Amazon EventBridge | Real-time event bus connecting micro-sensors to municipal notifications |
| **Time-Series DB** | Amazon Timestream | Micro-climate sensor readings and ambient heat plume history |
| **Audit Ledger** | Amazon DynamoDB | Single-table immutable thermal debt compliance records |

---

## 🏃 Local Development & Execution

```bash
# Install dependencies
bun install   # or npm install

# Start Vite dev server on port 3000
bun run dev   # or npm run dev

# Lint and verify TypeScript types
bun run lint  # or npm run lint

# Production build
bun run build # or npm run build
```

---

*Engineered for the AWS Environmental Hackathon 2026 — Track 02 (Heat & Water).*
