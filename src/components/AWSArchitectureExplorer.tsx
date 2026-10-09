import React, { useState } from 'react';
import { Cloud, Server, Database, Brain, Cpu, MessageSquare, Play, CheckCircle2, Shield, Radio, Layers } from 'lucide-react';

export const AWSArchitectureExplorer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

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
        voices: ['Kajal (Hindi)', 'Aditi (Indian English)'],
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

  const active = stages[activeStage];

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

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {isSimulating ? 'Simulating Pipeline Flow...' : 'Simulate End-to-End Pipeline'}
        </button>
      </div>

      {/* Interactive Architecture Flow Diagram */}
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
            <span className="text-xs font-semibold text-white">{active.service}</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Serverless (Zero Idle Cost)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              {active.description}
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
              {JSON.stringify(active.payload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
