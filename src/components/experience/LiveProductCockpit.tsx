import React, { useState, useRef, useEffect } from 'react';
import { BuildingAudit, VendorTelemetry } from '../../types';
import { Thermal3DTwin } from '../Thermal3DTwin';
import { ThermalPlumeTwin } from '../ThermalPlumeTwin';
import { VendorIoTBeacon } from '../VendorIoTBeacon';
import { LiveHardwareControl } from '../LiveHardwareControl';
import {
  Box,
  Radio,
  ShieldCheck,
  Sliders,
  Terminal,
  MapPin,
  ChevronDown,
  Flame,
  Wind,
  Grid,
  Check,
  Snowflake,
  Sparkles,
  Zap,
  Cloud,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';
import {
  publishMqttEventBridgeTelemetry,
  MqttEventBridgeResponse,
} from '../../services/gemini';

interface Props {
  building: BuildingAudit;
  allBuildings: BuildingAudit[];
  onSelectBuilding: (b: BuildingAudit) => void;
  vendor: VendorTelemetry;
  allVendors: VendorTelemetry[];
  onSelectVendor: (v: VendorTelemetry) => void;
  isMitigated: boolean;
  onMitigationToggle: (mitigated: boolean) => void;
  onApplyMitigation: (buildingId: string, intervention: string) => void;
  onSimulateSurge: () => void;
}

export const LiveProductCockpit: React.FC<Props> = ({
  building,
  allBuildings,
  onSelectBuilding,
  vendor,
  allVendors,
  onSelectVendor,
  isMitigated,
  onMitigationToggle,
}) => {
  const [twinMode, setTwinMode] = useState<'facade_twin' | 'parametric_canyon'>('facade_twin');
  const [hardwareTab, setHardwareTab] = useState<'vendor_iot' | 'hardware_serial'>('vendor_iot');

  // Micro-sidebar interactive 3D layer states
  const [meshView, setMeshView] = useState<boolean>(false);
  const [thermalOverlay, setThermalOverlay] = useState<boolean>(true);
  const [airflowVectors, setAirflowVectors] = useState<boolean>(true);

  // Custom Absolute Layout Popover Selector Card state
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Ripple micro-interaction state for the cooling toggle button
  const [rippleKey, setRippleKey] = useState<number>(0);

  // AWS IoT Core MQTT + EventBridge Custom Bus live state
  const [liveExhaustTemp, setLiveExhaustTemp] = useState<number>(building.exhaustAirTempCelsius);
  const [liveWindVelocity, setLiveWindVelocity] = useState<number>(4.2);
  const [liveWbgt, setLiveWbgt] = useState<number>(vendor.wetBulbGlobeTempCelsius);
  const [isPublishingMqtt, setIsPublishingMqtt] = useState<boolean>(false);
  const [eventBridgeReceipt, setEventBridgeReceipt] = useState<MqttEventBridgeResponse | null>(
    null
  );

  useEffect(() => {
    setLiveExhaustTemp(building.exhaustAirTempCelsius);
  }, [building.id, building.exhaustAirTempCelsius]);

  useEffect(() => {
    setLiveWbgt(vendor.wetBulbGlobeTempCelsius);
  }, [vendor.id, vendor.wetBulbGlobeTempCelsius]);

  const handlePublishMqttSpike = async (mode: 'spike' | 'nominal') => {
    setIsPublishingMqtt(true);
    soundEngine.playTone(mode === 'spike' ? 880 : 520, 'sine', 0.14);

    const nextExhaust =
      mode === 'spike'
        ? +(Math.max(53.6, building.exhaustAirTempCelsius) + 2.6).toFixed(1)
        : +Math.max(44.2, building.exhaustAirTempCelsius - 6.4).toFixed(1);
    const nextWbgt =
      mode === 'spike'
        ? +(Math.max(36.8, vendor.wetBulbGlobeTempCelsius) + 1.8).toFixed(1)
        : 31.2;
    const nextWind = mode === 'spike' ? 4.8 : 3.6;

    const receipt = await publishMqttEventBridgeTelemetry({
      sensorId: `ESP32-${building.id.toUpperCase().slice(0, 10)}-01`,
      buildingId: building.id,
      exhaustTemp: nextExhaust,
      wbgt: nextWbgt,
      windVelocity: nextWind,
      mqttTopic: `ushma/${building.id}/canyon/telemetry`,
    });

    setLiveExhaustTemp(nextExhaust);
    setLiveWbgt(nextWbgt);
    setLiveWindVelocity(nextWind);
    setEventBridgeReceipt(receipt);

    if (mode === 'spike' && isMitigated) {
      onMitigationToggle(false);
    }
    setIsPublishingMqtt(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsLocationPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section id="live_cockpit" className="relative w-full py-4 bg-transparent">
      {/* Generous space-y-12 vertical separation so the #12161A dark charcoal background frames each pure white #FFFFFF card */}
      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* FLOATING CARD 1: Hyper-Interactive "3D Street Digital Twin" Simulation Dashboard Panel */}
        <div
          className="relative rounded-3xl bg-[#FFFFFF] text-[#111827] border border-[#E5E7EB] transition-all duration-300"
          style={{
            boxShadow:
              '0 25px 70px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Ambient Top Edge Accent Bar */}
          <div
            className={`h-1.5 w-full rounded-t-3xl transition-colors duration-500 ${
              isMitigated
                ? 'bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-600'
                : 'bg-gradient-to-r from-[#a8321a] via-rose-600 to-amber-500'
            }`}
          />

          <div className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* 1. Vertical Interactive Micro-Sidebar Track inside the Left Edge of the White Card */}
            <aside
              aria-label="3D Viewport Layer Controls"
              className="flex md:flex-col items-center justify-between md:justify-start gap-2.5 p-2 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] shrink-0 self-start"
            >
              {/* Button 1: Mesh View */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(620, 'sine', 0.08);
                  setMeshView((prev) => !prev);
                }}
                title="Toggle 3D Wireframe Mesh View"
                className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 cursor-pointer ${
                  meshView
                    ? 'bg-[#111827] text-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.55)] ring-2 ring-sky-400/50 scale-105'
                    : 'bg-white text-slate-600 hover:text-[#111827] hover:bg-white/90 border border-[#E5E7EB]'
                }`}
              >
                <Grid className="w-5 h-5 transition-transform group-hover:scale-110" />
                {meshView && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-white animate-pulse" />
                )}
                <span className="sr-only">Mesh View</span>
              </button>

              {/* Button 2: Thermal Overlay */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(740, 'sine', 0.08);
                  setThermalOverlay((prev) => !prev);
                }}
                title="Toggle FLIR Thermal Overlay"
                className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 cursor-pointer ${
                  thermalOverlay
                    ? 'bg-[#111827] text-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.55)] ring-2 ring-rose-500/50 scale-105'
                    : 'bg-white text-slate-600 hover:text-[#111827] hover:bg-white/90 border border-[#E5E7EB]'
                }`}
              >
                <Flame className="w-5 h-5 transition-transform group-hover:scale-110" />
                {thermalOverlay && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
                <span className="sr-only">Thermal Overlay</span>
              </button>

              {/* Button 3: Airflow Vectors */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(860, 'sine', 0.08);
                  setAirflowVectors((prev) => !prev);
                }}
                title="Toggle CFD Airflow Vectors"
                className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 cursor-pointer ${
                  airflowVectors
                    ? 'bg-[#111827] text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.55)] ring-2 ring-emerald-400/50 scale-105'
                    : 'bg-white text-slate-600 hover:text-[#111827] hover:bg-white/90 border border-[#E5E7EB]'
                }`}
              >
                <Wind className="w-5 h-5 transition-transform group-hover:scale-110" />
                {airflowVectors && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
                )}
                <span className="sr-only">Airflow Vectors</span>
              </button>
            </aside>

            {/* Main Inner Content Column */}
            <div className="flex-1 min-w-0">
              {/* 2. Visual Hierarchy, Status Pill & Primary Description */}
              <div className="space-y-3">
                {/* Tiny Pulsing Live Status Pill Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-2xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  </span>
                  <span className="text-[11px] font-mono font-extrabold tracking-wider text-emerald-950 uppercase">
                    3D Digital Twin Status: ACTIVE SIMULATION
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight font-sans">
                    3D Street Digital Twin
                  </h1>

                  {/* Active Layer Status Readout */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-semibold text-slate-500">
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        meshView
                          ? 'bg-sky-50 text-sky-800 border-sky-200 font-bold'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      Mesh: {meshView ? 'ON' : 'OFF'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        thermalOverlay
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      Thermal: {thermalOverlay ? 'ON' : 'OFF'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        airflowVectors
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      Vectors: {airflowVectors ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-medium leading-relaxed">
                  See how upward 45° louvers and cool mist stop commercial AC heat from hitting
                  street vendors. Toggle mesh geometry, FLIR thermal overlays, and CFD airflow
                  vectors using the left control rail.
                </p>
              </div>

              {/* Horizontal Grid Row of Three Mini Technical Telemetry Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-6">
                {/* Metric 1: Exhaust Intake -> Live MQTT Value with Warning Red Indicator Strip */}
                <div className="relative overflow-hidden rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] p-5 shadow-2xs group hover:border-red-300 transition-colors">
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-red-600" />
                  <div className="pl-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        Exhaust Intake
                      </div>
                      <div className="text-3xl sm:text-4xl font-black font-mono text-[#111827] tracking-tight mt-1">
                        {liveExhaustTemp.toFixed(1)}°C
                      </div>
                      <div className="text-xs font-medium text-red-700 mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span>
                          {building.detectedOutdoorUnits.splitUnits +
                            building.detectedOutdoorUnits.vrfUnits}{' '}
                          Active Condenser Units ({building.rejectedHeatKw} kW)
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">
                      <Flame className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Metric 2: Target Mitigation -> 29.8°C with Soothing Cooling-Blue Indicator Strip */}
                <div className="relative overflow-hidden rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] p-5 shadow-2xs group hover:border-sky-300 transition-colors">
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-sky-500" />
                  <div className="pl-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        Target Mitigation
                      </div>
                      <div className="text-3xl sm:text-4xl font-black font-mono text-[#111827] tracking-tight mt-1">
                        29.8°C
                      </div>
                      <div className="text-xs font-medium text-sky-700 mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        <span>
                          {isMitigated
                            ? '45° Skyward Louvers + Mist Active'
                            : `Cart WBGT: ${liveWbgt.toFixed(1)}°C → 29.8°C Target`}
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                      <Snowflake className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Metric 3: Wind Velocity -> Live m/s with Active Flow Icon */}
                <div className="relative overflow-hidden rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] p-5 shadow-2xs group hover:border-emerald-300 transition-colors">
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500" />
                  <div className="pl-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        Wind Velocity
                      </div>
                      <div className="text-3xl sm:text-4xl font-black font-mono text-[#111827] tracking-tight mt-1">
                        {liveWindVelocity.toFixed(1)} m/s
                      </div>
                      <div className="text-xs font-medium text-emerald-700 mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>
                          {building.canyonWidthMeters}m Street Canyon · {vendor.distanceToExhaustMeters}m to Cart
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Wind className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* AWS IoT Core Sub-Second MQTT + EventBridge Custom Event Bus Live Strip */}
              <div className="mt-5 rounded-2xl bg-slate-900 text-white p-4 sm:p-5 border border-slate-800 space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5" />
                        <span>AWS IoT Core MQTT → EventBridge</span>
                      </span>
                      <code className="text-sky-300 font-bold">ushma-netra-thermal-bus</code>
                      <span className="text-emerald-400 font-bold">
                        {eventBridgeReceipt ? `${eventBridgeReceipt.latencyMs}ms Fan-Out` : '~36ms Sub-Second Stream'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Streams live ESP32 sensor packets to the 3D Twin and Watchlist Alert API in ~36ms.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isPublishingMqtt}
                      onClick={() => void handlePublishMqttSpike('spike')}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-200" />
                      <span>
                        {isPublishingMqtt ? 'Routing PutEvents...' : 'Fire MQTT Spike (>50°C)'}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={isPublishingMqtt}
                      onClick={() => void handlePublishMqttSpike('nominal')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
                    >
                      Nominal Heartbeat
                    </button>
                  </div>
                </div>

                {eventBridgeReceipt && (
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">EventBridge EventId</span>
                      <span className="text-amber-300 font-bold">{eventBridgeReceipt.eventId}</span>
                      <span className="block text-slate-400 text-[10px] mt-0.5">
                        Source: {eventBridgeReceipt.source}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">DetailType &amp; State</span>
                      <span
                        className={`font-bold ${
                          eventBridgeReceipt.dispatchedState === 'CRITICAL_EMERGENCY'
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {eventBridgeReceipt.detailType} ({eventBridgeReceipt.dispatchedState})
                      </span>
                      <span className="block text-slate-400 text-[10px] mt-0.5">
                        Topic: {eventBridgeReceipt.envelope.mqttTopic}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Async Fan-Out Targets</span>
                      <span className="text-sky-300 font-bold block truncate">
                        {eventBridgeReceipt.targetsDispatched.join(' + ')}
                      </span>
                      <span className="block text-emerald-400 text-[10px] mt-0.5">
                        Dispatched in {eventBridgeReceipt.latencyMs}ms
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Lower Action Bar Container with Split Flexbox Layout */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full mt-8 pt-6 border-t border-gray-100">
                {/* Left: Absolute Layout Popover Selector Card ("Vikas Surya Commercial Plaza") */}
                <div className="relative" ref={popoverRef}>
                  <button
                    type="button"
                    onClick={() => setIsLocationPopoverOpen((prev) => !prev)}
                    aria-expanded={isLocationPopoverOpen}
                    aria-haspopup="listbox"
                    className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#F3F4F6] hover:bg-slate-200/75 border border-[#E5E7EB] text-[#111827] text-xs font-mono font-bold shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-slate-200 text-[#a8321a] shadow-2xs">
                        <MapPin className="w-4 h-4 shrink-0" />
                      </span>
                      <div className="text-left">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                          Active Canyon Sector
                        </div>
                        <div className="text-xs sm:text-sm font-sans font-extrabold text-[#111827] flex items-center gap-1.5">
                          <span>{building.name}</span>
                          <span className="text-slate-400 font-mono text-xs">
                            ({building.city} · {building.canyonWidthMeters}m)
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isLocationPopoverOpen ? 'rotate-180 text-[#111827]' : ''
                      }`}
                    />
                  </button>

                  {/* Absolute Layout Popover Selector Card */}
                  {isLocationPopoverOpen && (
                    <div
                      role="listbox"
                      className="absolute left-0 bottom-full mb-2.5 sm:bottom-auto sm:top-full sm:mt-2.5 w-full sm:w-[400px] rounded-2xl bg-white border border-slate-200 p-2 z-50 transition-all origin-top-left"
                      style={{
                        boxShadow:
                          '0 20px 50px -10px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(15, 23, 42, 0.06)',
                      }}
                    >
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Select Audited Street Canyon ({allBuildings.length})
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">
                          Live Telemetry
                        </span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 my-1">
                        {allBuildings.map((b) => {
                          const isSelected = b.id === building.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                soundEngine.playTone(540, 'sine', 0.07);
                                onSelectBuilding(b);
                                setIsLocationPopoverOpen(false);
                              }}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-900 text-white'
                                  : 'hover:bg-slate-100 text-[#111827]'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">{b.name}</div>
                                <div
                                  className={`text-[11px] font-mono mt-0.5 ${
                                    isSelected ? 'text-slate-300' : 'text-slate-500'
                                  }`}
                                >
                                  {b.city} · {b.canyonWidthMeters}m street · {b.rejectedHeatKw} kW
                                  exhaust
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                                    isSelected
                                      ? 'bg-white/15 text-amber-300'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {b.exhaustAirTempCelsius.toFixed(1)}°C
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Interactive "Turn ON Street Cooling" Toggle Button with Shimmer & Active Ripple */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(isMitigated ? 420 : 880, 'sine', 0.15);
                    setRippleKey((prev) => prev + 1);
                    onMitigationToggle(!isMitigated);
                  }}
                  className={`group relative overflow-hidden px-6 py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                    isMitigated
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-[0_12px_30px_-6px_rgba(16,185,129,0.55)] ring-2 ring-emerald-400/50'
                      : 'bg-gradient-to-r from-[#b91c1c] via-[#a8321a] to-[#dc2626] text-white shadow-[0_12px_30px_-6px_rgba(220,38,38,0.5)] hover:shadow-[0_16px_36px_-6px_rgba(220,38,38,0.68)] ring-1 ring-red-500/40'
                  }`}
                >
                  {/* Shimmering Subtle Hover Transition Mask Layer */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />

                  {/* Active Ripple Micro-Interaction Ring */}
                  {rippleKey > 0 && (
                    <span
                      key={rippleKey}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl ring-4 ring-white/60 animate-ping"
                      style={{ animationIterationCount: 1, animationDuration: '550ms' }}
                    />
                  )}

                  {isMitigated ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-90" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                      </span>
                      <span className="relative z-10 tracking-wide">
                        ✕ System Active: Misting Enabled
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-200 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                      <span className="relative z-10 tracking-wide">
                        Turn ON Street Cooling
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200/90 relative z-10" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING CARD 2: Dedicated 3D Digital Twin Workspace in Pure White (#FFFFFF) Frame */}
        <div
          className="w-full rounded-3xl bg-[#FFFFFF] text-[#111827] p-6 sm:p-8 space-y-5 border border-[#E5E7EB]"
          style={{
            boxShadow:
              '0 25px 70px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between bg-[#F3F4F6] px-4 py-3 rounded-2xl border border-[#E5E7EB] text-xs gap-3">
            <div className="flex items-center gap-2 text-[#111827] font-bold">
              <Box className="w-4 h-4 text-[#a8321a]" />
              <span>{building.name} · 3D Street View</span>
              <span className="text-[#111827]/70 font-normal hidden sm:inline">
                (Drag to rotate · Scroll to zoom)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTwinMode('facade_twin')}
                className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer ${
                  twinMode === 'facade_twin'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#E5E7EB] bg-[#FFFFFF] border border-[#E5E7EB]'
                }`}
              >
                3D Building &amp; Cart View
              </button>
              <button
                type="button"
                onClick={() => setTwinMode('parametric_canyon')}
                className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  twinMode === 'parametric_canyon'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#E5E7EB] bg-[#FFFFFF] border border-[#E5E7EB]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">Custom Street Width Lab</span>
              </button>
            </div>
          </div>

          {twinMode === 'facade_twin' ? (
            <Thermal3DTwin
              building={building}
              vendor={vendor}
              isMitigated={isMitigated}
              onMitigationToggle={onMitigationToggle}
              meshView={meshView}
              thermalOverlay={thermalOverlay}
              airflowVectors={airflowVectors}
            />
          ) : (
            <ThermalPlumeTwin
              alleyWidth={building.canyonWidthMeters}
              acUnitsCount={
                building.detectedOutdoorUnits.splitUnits +
                building.detectedOutdoorUnits.vrfUnits
              }
              louversEngaged={isMitigated}
              presetName={building.name}
              onLouversChange={onMitigationToggle}
            />
          )}
        </div>

        {/* FLOATING CARD 3: Connected Street Cart Sensor & ESP32 Hardware Section */}
        <div className="space-y-6">
          {/* Section Switcher Bar on the #12161A Dark Canvas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                GROUND-LEVEL HARDWARE CONNECTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                Vendor Cart Sensor &amp; Live ESP32 Hardware
              </h2>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-xl self-start">
              <button
                type="button"
                onClick={() => setHardwareTab('vendor_iot')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  hardwareTab === 'vendor_iot'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#F3F4F6] bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                <Radio className="w-4 h-4 text-amber-400 pointer-events-none" />
                <span className="pointer-events-none">Vendor Cart Voice Alert</span>
              </button>
              <button
                type="button"
                onClick={() => setHardwareTab('hardware_serial')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  hardwareTab === 'hardware_serial'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#111827] hover:bg-[#F3F4F6] bg-[#F3F4F6] border border-[#E5E7EB]'
                }`}
              >
                <Terminal className="w-4 h-4 text-[#a8321a] pointer-events-none" />
                <span className="pointer-events-none">ESP32 USB Sensor</span>
              </button>
            </div>
          </div>

          <div className="w-full">
            {hardwareTab === 'vendor_iot' ? (
              <VendorIoTBeacon
                vendor={vendor}
                allVendors={allVendors}
                onSelectVendor={onSelectVendor}
                isMitigated={isMitigated}
              />
            ) : (
              <LiveHardwareControl />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
