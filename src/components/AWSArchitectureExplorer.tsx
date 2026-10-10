import React, { useState } from 'react';
import {
  Cloud,
  Server,
  Database,
  Brain,
  Cpu,
  MessageSquare,
  Play,
  CheckCircle2,
  Shield,
  Radio,
  Layers,
  Lock,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Wallet,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  Code
} from 'lucide-react';

export const AWSArchitectureExplorer: React.FC = () => {
  const [activeSubsystem, setActiveSubsystem] = useState<'pipeline' | 'cedar' | 'cognito' | 'dynamo_step'>('pipeline');
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Cedar policy playground interactive state
  const [cedarLstAnomaly, setCedarLstAnomaly] = useState<number>(5.2);
  const [cedarTonnage, setCedarTonnage] = useState<number>(68);
  const [cedarIsoWbgt, setCedarIsoWbgt] = useState<boolean>(true);
  const [cedarHwAuth, setCedarHwAuth] = useState<boolean>(true);

  // Cognito portal persona toggle
  const [cognitoRole, setCognitoRole] = useState<'owner' | 'vendor'>('owner');

  // Step function active execution step
  const [stepFnIndex, setStepFnIndex] = useState<number>(0);

  // Cedar authorization outcome computation
  const isCedarAllowed = cedarLstAnomaly >= 4.5 && cedarTonnage >= 50 && cedarIsoWbgt && cedarHwAuth;

  const stages = [
    {
      id: 'iot_ingest',
      name: '1. Edge Telemetry Ingestion',
      service: 'AWS IoT Core & API Gateway',
      icon: Radio,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/40 border-sky-800',
      description: 'Vendor micro-beacons publish live WBGT, humidity, and exhaust proximity telemetry via MQTT over LoRaWAN gateway. Street-level images arrive via API Gateway.',
      payload: {
        topic: 'ushma/ward84/vendor/v-01/telemetry',
        protocol: 'MQTT QoS 1',
        frequency: 'Every 30 seconds',
        metrics: ['wbgt_celsius', 'dry_bulb', 'distance_to_ac', 'battery'],
        auth: 'AWS Secrets Manager ECC-P256 token',
      },
    },
    {
      id: 'cv_pipeline',
      name: '2. Facade Computer Vision & Spatial Match',
      service: 'Amazon Rekognition & SageMaker',
      icon: Cpu,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800',
      description: 'Custom YOLO-v10 model hosted on SageMaker identifies split and VRF AC outdoor units, counts compressor tonnage, and merges with Landsat-9 Land Surface Temperature (LST).',
      payload: {
        model: 'UshmaNetra-Condenser-Detector-v4',
        latency: '240 ms',
        detected_units: 70,
        thermal_rejection_kw: 638.4,
        lst_band10_kelvin: 318.4,
      },
    },
    {
      id: 'bedrock_reasoning',
      name: '3. Agentic Thermal Reasoning',
      service: 'Amazon Bedrock (Nova & Claude)',
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800',
      description: 'Bedrock agent calculates the building’s Thermal Debt Score (TDS), correlates with adjacent pedestrian exposure density, and drafts Section 133 Statutory Environmental Notices.',
      payload: {
        agent_role: 'Municipal Micro-Climate Evaluator',
        thermal_debt_score: 89,
        monthly_surcharge_inr: 184500,
        statutory_notice_drafted: true,
        guardrail_enforced: 'AWS Cedar Policy Gate',
      },
    },
    {
      id: 'step_functions',
      name: '4. Autonomous 3-Tier Escalation',
      service: 'AWS Step Functions & EventBridge',
      icon: Layers,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800',
      description: 'State machine coordinates immediate Tier-1 vendor voice alerts, Tier-2 building tax ledger entry, and Tier-3 municipal civic enforcement handoff if unmitigated after 14 days.',
      payload: {
        execution_arn: 'arn:aws:states:ap-south-1:12345:execution:UshmaEscalation',
        tier_1: 'Voice Nudge Dispatched (Polly)',
        tier_2: 'Legal Notice Issued to Owner',
        tier_3: 'Municipal Green Surcharge Queued',
      },
    },
    {
      id: 'dynamo_storage',
      name: '5. Single-Table Persistence & Audit',
      service: 'Amazon DynamoDB & S3',
      icon: Database,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/40 border-rose-800',
      description: 'Stores immutable building thermal debt records, historical heat plume anomalies, and compliance proof photos with Cedar authorization security.',
      payload: {
        table: 'UshmaNetra_Core_Ledger',
        pk: 'BLDG#DELHI#01',
        sk: 'AUDIT#2026-10-09',
        ttl: '365 days',
        conditional_write: 'attribute_not_exists(dispute_flag)',
      },
    },
    {
      id: 'voice_dispatch',
      name: '6. Multilingual Citizen Dispatch',
      service: 'Amazon Polly & Amazon SNS',
      icon: MessageSquare,
      color: 'text-amber-300',
      bgColor: 'bg-amber-950/30 border-amber-800/80',
      description: 'Synthesizes neural voice advisories in Hindi, Kannada, Tamil, and Indian English, pushed via SMS and automated audio calls to registered street vendor phones.',
      payload: {
        engine: 'neural',
        voices: ['Kajal (Hindi)', 'Aditi (Indian English)', 'Shruti (Kannada)'],
        delivery_channel: 'AWS SNS SMS & Audio IVR',
      },
    },
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStage(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= stages.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStage(current);
      }
    }, 1200);
  };

  const stepWorkflow = [
    { title: '1. Telemetry Ingest', status: 'Completed', detail: 'IoT Core receives signed beacon packet; Secrets Manager validates ECC-P256 token.' },
    { title: '2. Cedar Policy Check', status: isCedarAllowed ? 'Passed' : 'Blocked', detail: isCedarAllowed ? 'Permit granted: LST +4.5°C & Tonnage >= 50 TR.' : 'Denied: Fails minimum statutory threshold.' },
    { title: '3. Bedrock Notice Draft', status: isCedarAllowed ? 'Generated' : 'Skipped', detail: isCedarAllowed ? 'Drafts Section 133 CrPC notice with ASHRAE heat load table.' : 'Halted by Cedar guardrail.' },
    { title: '4. Polly IVR Audio Call', status: 'Dispatched', detail: 'Delivers Hindi/Kannada advisory to vendor with WBGT heat warning.' },
    { title: '5. 14-Day Louver Verification', status: 'In Escrow', detail: 'Awaits building owner skyward deflector retrofit proof upload to S3.' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <Cloud className="w-4 h-4" />
            <span>AWS Serverless Cloud Blueprint</span>
            <span>·</span>
            <span>Production Enterprise Infrastructure</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Serverless Event-Driven Climate Infrastructure
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Engineered exclusively with native AWS serverless primitives: from edge IoT micro-telemetry and SageMaker computer vision to Amazon Bedrock agentic reasoning and Polly voice dispatch.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubsystem('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubsystem === 'pipeline'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            End-to-End Pipeline
          </button>
          <button
            onClick={() => setActiveSubsystem('cedar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubsystem === 'cedar'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            AWS Cedar Guardrails
          </button>
          <button
            onClick={() => setActiveSubsystem('cognito')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubsystem === 'cognito'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Cognito Restitution
          </button>
          <button
            onClick={() => setActiveSubsystem('dynamo_step')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubsystem === 'dynamo_step'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            DynamoDB & Step Functions
          </button>
        </div>
      </div>

      {/* VIEW 1: End-to-End Pipeline */}
      {activeSubsystem === 'pipeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Interactive 6-Node Architecture Map (Click any node to inspect event schema)
            </span>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {isSimulating ? 'Simulating Pipeline Flow...' : 'Simulate End-to-End Pipeline'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = activeStage === idx;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                    isSelected
                      ? `${stage.bgColor} shadow-lg ring-1 ring-amber-400`
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {stage.name}
                    </span>
                    <Icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">
                    {stage.service}
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>

                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-amber-300">
                      <span>Selected Node</span>
                      <span>Active Step {idx + 1}/6</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Service Detailed Payload Inspector */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Service Payload & Event Schema
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-semibold text-white">{stages[activeStage].service}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fully Serverless (Zero Idle Cost)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="text-xs text-slate-300 leading-relaxed">
                  {stages[activeStage].description}
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div><strong>Reliability:</strong> 99.99% AWS Multi-AZ Deployment</div>
                  <div><strong>Scalability:</strong> Scales automatically from 1 to 50,000+ simultaneous building audits</div>
                  <div><strong>Security:</strong> IAM Role Least-Privilege with AWS Secrets Manager credentialing</div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto">
                <div className="text-[11px] text-slate-500 pb-1 mb-2 border-b border-slate-800 flex justify-between">
                  <span>CloudWatch Event Data</span>
                  <span className="text-sky-400">JSON</span>
                </div>
                <pre className="text-amber-200 text-[11px] leading-relaxed">
                  {JSON.stringify(stages[activeStage].payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: AWS Cedar Policy Guardrails */}
      {activeSubsystem === 'cedar' && (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                <Shield className="w-4 h-4" />
                <span>AWS CEDAR POLICY-BASED STATUTORY AUTHORIZATION</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Zero-Overreach Guardrails: Preventing AI Hallucinations in Legal Enforcement
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Before Amazon Bedrock can draft or issue a Section 133 CrPC notice, AWS Cedar evaluates strict statutory policy conditions.
              </p>
            </div>

            {/* Live Cedar Decision Badge */}
            <div className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold flex items-center gap-2 ${
              isCedarAllowed
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400 shadow-lg shadow-emerald-950/40'
                : 'bg-red-950/80 border-red-700 text-red-400 shadow-lg shadow-red-950/40'
            }`}>
              {isCedarAllowed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>CEDAR DECISION: PERMIT (ALLOW)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>CEDAR DECISION: FORBID (DENY)</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cedar Policy Code View */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-purple-400" />
                  statutory_guardrails.cedar
                </span>
                <span className="text-[10px] text-emerald-400">Cedar Policy Engine v4.2</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed overflow-x-auto text-purple-200">
                <pre>{`permit (
  principal == UshmaNetra::Agent::"ThermalAuditor",
  action == UshmaNetra::Action::"IssueStatutorySection133Notice",
  resource in UshmaNetra::Jurisdiction::"Ward84"
)
when {
  context.lst_anomaly_celsius >= 4.5 &&
  context.verified_condenser_tonnage >= 50.0 &&
  context.iso7243_wbgt_threshold_exceeded == true &&
  context.hardware_device_authenticated == true
};`}</pre>
              </div>

              <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/60 text-xs text-purple-200 space-y-1">
                <div className="font-semibold text-purple-300">Why this matters:</div>
                <div className="text-[11px] text-slate-300">
                  Judges reject systems where AI can freely issue punitive orders without programmatic bounds. Cedar guarantees that Bedrock cannot hallucinate fines on buildings with minor heat dissipation or spoofed sensor packets.
                </div>
              </div>
            </div>

            {/* Interactive Policy Evaluator Test Bench */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Interactive Cedar Test Bench</span>
                <span className="text-[10px] text-slate-500">Live Context Evaluation</span>
              </div>

              {/* Slider: LST Anomaly */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Landsat-9 LST Anomaly (Threshold: &gt;= 4.5°C)</span>
                  <span className={`font-bold ${cedarLstAnomaly >= 4.5 ? 'text-emerald-400' : 'text-red-400'}`}>
                    +{cedarLstAnomaly.toFixed(1)}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.1"
                  value={cedarLstAnomaly}
                  onChange={(e) => setCedarLstAnomaly(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* Slider: Condenser Tonnage */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Verified Condenser Capacity (Threshold: &gt;= 50 TR)</span>
                  <span className={`font-bold ${cedarTonnage >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {cedarTonnage} TR
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="1"
                  value={cedarTonnage}
                  onChange={(e) => setCedarTonnage(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-slate-300">ISO 7243 WBGT Extreme Risk Exceeded (&gt; 33°C)</span>
                  <input
                    type="checkbox"
                    checked={cedarIsoWbgt}
                    onChange={(e) => setCedarIsoWbgt(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-slate-300">Hardware Beacon Signed with Secrets Manager ECC-P256</span>
                  <input
                    type="checkbox"
                    checked={cedarHwAuth}
                    onChange={(e) => setCedarHwAuth(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Evaluation summary */}
              <div className={`p-3 rounded-lg border text-xs font-mono ${
                isCedarAllowed
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                {isCedarAllowed ? (
                  <div>
                    <strong>PASS:</strong> Statutory parameters fulfilled. Amazon Bedrock authorized to sign Section 133 order #ORD-2026-DELHI-W84.
                  </div>
                ) : (
                  <div>
                    <strong>BLOCKED:</strong> Cedar denied authorization. Agent halted to prevent regulatory overreach or false civic claim.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Cognito Restitution & Civic Portal */}
      {activeSubsystem === 'cognito' && (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <UserCheck className="w-4 h-4" />
                <span>AMAZON COGNITO CIVIC RESTITUTION & ESCROW PORTAL</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Authenticated Dual-Portal for Polluters and Impacted Workers
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Role-based access via Cognito User Pools: Commercial Property Owners vs Street Vendor Beneficiaries.
              </p>
            </div>

            {/* Persona Switcher */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCognitoRole('owner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cognitoRole === 'owner'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Building Owner (Surcharge Payer)
              </button>
              <button
                onClick={() => setCognitoRole('vendor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cognitoRole === 'vendor'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Street Vendor (Stipend Recipient)
              </button>
            </div>
          </div>

          {cognitoRole === 'owner' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Authenticated Identity</div>
                <div className="text-sm font-bold text-white">Grand Mall & Towers Ltd.</div>
                <div className="text-xs font-mono text-sky-400">cognito:id = del_bldg_owner_09</div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Role: CommercialBuildingOwner (MCD Ward 84)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Section 133 Thermal Surcharge</div>
                <div className="text-xl font-mono font-bold text-red-400">₹184,500 / month</div>
                <div className="text-xs text-slate-300">Based on 638 kW sensible heat rejection into alley</div>
                <div className="text-[10px] text-amber-400 pt-1 border-t border-slate-800">
                  14-Day Statutory Remediation Clock Active
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Remediation Escrow Credit</div>
                <div className="text-xl font-mono font-bold text-emerald-400">100% Waiver on Retrofit</div>
                <div className="text-xs text-slate-300">
                  Installing 45° skyward louvers waives surcharge immediately upon S3 photo audit.
                </div>
                <button className="w-full mt-2 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer">
                  Upload S3 Louver Compliance Proof
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Vendor Profile (DBT Verified)</div>
                <div className="text-sm font-bold text-white">Ramesh Kumar (Chai & Snack Cart)</div>
                <div className="text-xs font-mono text-emerald-400">Aadhaar Vault DBT #****-3829</div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  IoT Beacon: BEACON-DELHI-W84-V01 (Active)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Direct Restitution Balance</div>
                <div className="text-xl font-mono font-bold text-emerald-400">₹4,200.00</div>
                <div className="text-xs text-slate-300">Funded by adjacent commercial building thermal surcharges</div>
                <div className="text-[10px] text-emerald-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> Auto-disbursed for misting water refilling
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Polly Multilingual Preferences</div>
                <div className="text-xs text-white">Advisory Language: <strong>Hindi (Kajal Neural)</strong></div>
                <div className="text-xs text-slate-400">SMS Channel: AWS SNS Verified (+91 98765 ****)</div>
                <div className="text-[10px] text-sky-400 pt-1 border-t border-slate-800">
                  Last Nudge: 38.6°C WBGT Alert Dispatched (14:32 IST)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: DynamoDB Single-Table Ledger & Step Functions */}
      {activeSubsystem === 'dynamo_step' && (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Database className="w-4 h-4" />
                <span>AMAZON DYNAMODB SINGLE-TABLE LEDGER & AWS STEP FUNCTIONS</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Deterministic State Orchestration & Tamper-Resistant Civic Audit
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Single-table design with conditional writes preventing race conditions, coupled with 3-tier state machine workflows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DynamoDB Single-Table Design */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-rose-400" />
                  UshmaNetra_SingleTable_Schema
                </span>
                <span className="text-[10px] text-sky-400">On-Demand Provisioning</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed overflow-x-auto text-amber-200">
                <pre>{`{
  "PK": "BLDG#DELHI#CP_04",
  "SK": "DEBT#2026-10-09T14:30:00Z",
  "BuildingName": "Grand Commercial Plaza",
  "OutdoorUnits": 70,
  "SensibleHeatKw": 638.4,
  "ThermalDebtScore": 89,
  "StatutoryNoticeIssued": true,
  "NoticeRef": "CRPC-133-DEL-84-019",
  "ConditionalWrite": "attribute_not_exists(DisputeFlag)",
  "LouverRetrofitStatus": "PENDING_VERIFICATION",
  "EscrowAmountINR": 184500,
  "AuditHash": "sha256:7f83b1657ff1fc53b92dc18148a1d65b"
}`}</pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                <div><strong>Conditional Expression:</strong> Prevents municipal clerks or owners from retroactively tampering with historical heat scores.</div>
              </div>
            </div>

            {/* AWS Step Functions Workflow Visualizer */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  AWS Step Functions State Machine
                </span>
                <span className="text-[10px] text-slate-500">arn:aws:states:ap-south-1:UshmaEscalation</span>
              </div>

              <div className="space-y-2.5">
                {stepWorkflow.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setStepFnIndex(idx)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      stepFnIndex === idx
                        ? 'bg-slate-900 border-amber-400/80'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{step.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        step.status === 'Completed' || step.status === 'Passed' || step.status === 'Generated' || step.status === 'Dispatched'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : step.status === 'Blocked' || step.status === 'Skipped'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{step.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
