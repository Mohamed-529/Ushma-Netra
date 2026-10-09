import React, { useState } from 'react';
import { BuildingAudit, VendorTelemetry } from '../types';
import { generateThermalAuditNotice } from '../services/gemini';
import { Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, Sparkles, Building2, IndianRupee } from 'lucide-react';

interface Props {
  buildings: BuildingAudit[];
  selectedBuilding: BuildingAudit;
  onSelectBuilding: (building: BuildingAudit) => void;
  vendor: VendorTelemetry;
  onApplyMitigation: (buildingId: string, intervention: string) => void;
}

export const ThermalDebtLedger: React.FC<Props> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  vendor,
  onApplyMitigation,
}) => {
  const [generatingNotice, setGeneratingNotice] = useState<boolean>(false);
  const [generatedNotice, setGeneratedNotice] = useState<{
    legalNoticeTitle: string;
    executiveSummary: string;
    thermodynamicFindings: string;
    statutoryDirectives: string[];
    calculatedPenaltyBreakdown: string;
  } | null>(null);

  const handleGenerateNotice = async () => {
    setGeneratingNotice(true);
    try {
      const notice = await generateThermalAuditNotice(selectedBuilding, vendor);
      setGeneratedNotice(notice);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingNotice(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner explaining the World-First Concept */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-5 rounded-xl border border-amber-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <Scale className="w-4 h-4" />
            <span>Autonomous Thermal Equity Protocol</span>
            <span>·</span>
            <span>Section 133 CrPC / Municipal Air Act Compliance</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Micro-Thermal Exhaust Debt & Municipal Surcharge Ledger
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Every 1 kW of indoor cooling rejects 1.35 kW of superheated exhaust outdoors. This ledger quantifies the unconsented heat dumped on public rights-of-way and informal workers, assessing a monthly restorative surcharge to fund street-level hydration and heat shields.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-800 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400">Total Monitored Rejection</div>
            <div className="text-base font-bold font-mono text-red-400">2,130 kW</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400">Monthly Restitution Fund</div>
            <div className="text-base font-bold font-mono text-emerald-400">₹6,16,500</div>
          </div>
        </div>
      </div>

      {/* Buildings Table & Comparative Grid */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Monitored High-Density Commercial Complexes
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {buildings.length} Active Ward Entities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Building & Ward Location</th>
                <th className="px-4 py-3">AC Condenser Count</th>
                <th className="px-4 py-3">Rejected Heat (kW)</th>
                <th className="px-4 py-3">Street Delta</th>
                <th className="px-4 py-3">Thermal Debt Score</th>
                <th className="px-4 py-3">Monthly Surcharge</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {buildings.map((b) => {
                const isSelected = b.id === selectedBuilding.id;
                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelectBuilding(b)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-500/10 hover:bg-amber-500/15' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      <div>{b.name}</div>
                      <div className="text-[11px] text-slate-400">{b.location}, {b.city}</div>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {b.detectedOutdoorUnits.splitUnits} Split + {b.detectedOutdoorUnits.vrfUnits} VRF
                    </td>
                    <td className="px-4 py-3 font-mono text-red-400 font-semibold tabular-nums">
                      {b.rejectedHeatKw} kW
                    </td>
                    <td className="px-4 py-3 font-mono text-amber-400 tabular-nums">
                      +{(b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1)}°C
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        b.thermalDebtScore >= 80 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {b.thermalDebtScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white tabular-nums">
                      ₹{b.monthlyExhaustTaxInr.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {b.mitigationStatus === 'compliant' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
                        </span>
                      ) : b.mitigationStatus === 'under_review' ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Under Review
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Unmitigated
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBuilding(b);
                        }}
                        className={`px-2.5 py-1 text-xs rounded transition-colors font-medium ${
                          isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Building Deep-Dive & Restorative Enforcement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Restorative Mitigation Actions */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Restorative Engineering Interventions ({selectedBuilding.name})
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Mitigation Sandbox
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Building owners can eliminate or reduce their monthly exhaust surcharge by implementing approved thermal deflection and public shade infrastructure:
          </p>

          <div className="space-y-3">
            {/* Action 1: Deflector Louvers */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white">45° Aerodynamic Upward Deflectors</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Directs exhaust jet vertically towards the roofline, eliminating street-level thermal plume (-3.8°C reduction).
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  Surcharge Reduction: 65% (Saves ₹{(selectedBuilding.monthlyExhaustTaxInr * 0.65).toLocaleString('en-IN')}/mo)
                </div>
              </div>
              <button
                onClick={() => onApplyMitigation(selectedBuilding.id, 'Upward Deflector Cowls Installed')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Deploy Deflectors
              </button>
            </div>

            {/* Action 2: Vendor Misting Kiosk */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white">Fund 2 Solar Misting Hydration Kiosks</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Direct civic restitution providing cool evaporative relief for {vendor.vendorName} and 28 adjacent vendors.
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  Grants Immediate Civic Compliance Waiver
                </div>
              </div>
              <button
                onClick={() => onApplyMitigation(selectedBuilding.id, 'Vendor Misting Station Funded')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Sponsor Kiosks
              </button>
            </div>

            {/* Action 3: Vertical Ivy / Moss Wall */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white">Vertical Living Façade (Green Moss & Ivy)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Natural bio-evapotranspiration wall absorbing up to 50 kW of radiant heat before hitting the street.
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  Surcharge Reduction: 50%
                </div>
              </div>
              <button
                onClick={() => onApplyMitigation(selectedBuilding.id, 'Vertical Living Green Wall Deployed')}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Deploy Green Wall
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Statutory Notice Generator */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Statutory Municipal Notice Generator (Gemini 2.5)
              </h3>
              <button
                onClick={handleGenerateNotice}
                disabled={generatingNotice}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {generatingNotice ? 'Synthesizing...' : 'Draft Section 133 Order'}
              </button>
            </div>

            {generatedNotice ? (
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-3 font-sans max-h-[380px] overflow-y-auto">
                <div className="font-mono text-[11px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                  {generatedNotice.legalNoticeTitle}
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Executive Summary</div>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{generatedNotice.executiveSummary}</p>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Thermodynamic Findings</div>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{generatedNotice.thermodynamicFindings}</p>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Statutory Directives (14 Days)</div>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 mt-1">
                    {generatedNotice.statutoryDirectives.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-amber-950/40 rounded border border-amber-900/50 text-amber-200 text-[11px]">
                  <strong>Penalty Mandate:</strong> {generatedNotice.calculatedPenaltyBreakdown}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-slate-950/60 rounded-lg border border-dashed border-slate-800 text-center flex flex-col items-center justify-center space-y-2">
                <FileText className="w-8 h-8 text-slate-600" />
                <div className="text-xs text-slate-400 font-medium">
                  No notice drafted yet for {selectedBuilding.name}.
                </div>
                <div className="text-[11px] text-slate-500 max-w-sm">
                  Click "Draft Section 133 Order" to invoke Gemini 2.5 Flash to automatically assemble the legal thermodynamic notice with statutory citations.
                </div>
              </div>
            )}
          </div>

          {generatedNotice && (
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Reference: UN/MUNICIPAL/2026</span>
              <button
                onClick={() => alert(`Notice for ${selectedBuilding.name} dispatched to Municipal Enforcement Queue.`)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Dispatch to Ward Registrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
