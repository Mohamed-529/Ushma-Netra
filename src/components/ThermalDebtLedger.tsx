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
      <div className="bg-[#efe8dc] p-5 rounded-2xl border border-[#d6cebe] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#a8321a] font-mono mb-1 font-bold">
            <Scale className="w-4 h-4" />
            <span>Autonomous Thermal Equity Protocol</span>
            <span>·</span>
            <span>Section 133 CrPC / Municipal Air Act Compliance</span>
          </div>
          <h2 className="text-xl font-bold text-[#0b1b2d] tracking-tight">
            Micro-Thermal Exhaust Debt &amp; Municipal Surcharge Ledger
          </h2>
          <p className="text-xs text-[#1f3044] mt-1 max-w-3xl leading-relaxed">
            Every 1 kW of indoor cooling rejects 1.35 kW of superheated exhaust outdoors. This ledger quantifies the unconsented heat dumped on public rights-of-way and informal workers, assessing a monthly restorative surcharge to fund street-level hydration and heat shields.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-[#f5efe6] px-4 py-2.5 rounded-xl border border-[#d6cebe] shrink-0 shadow-xs">
          <div>
            <div className="text-[10px] text-[#526071] font-mono uppercase font-bold">Total Monitored Rejection</div>
            <div className="text-base font-bold font-mono text-red-700">2,130 kW</div>
          </div>
          <div className="h-8 w-px bg-[#d6cebe]" />
          <div>
            <div className="text-[10px] text-[#526071] font-mono uppercase font-bold">Monthly Restitution Fund</div>
            <div className="text-base font-bold font-mono text-emerald-800">₹6,16,500</div>
          </div>
        </div>
      </div>

      {/* Buildings Table & Comparative Grid */}
      <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#d6cebe] flex items-center justify-between bg-[#f5efe6]">
          <h3 className="text-sm font-bold text-[#0b1b2d] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#a8321a]" />
            Monitored High-Density Commercial Complexes
          </h3>
          <span className="text-xs text-[#0b1b2d]/70 font-mono font-semibold">
            {buildings.length} Active Ward Entities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0b1b2d]">
            <thead className="bg-[#dfd7c9] text-[#0b1b2d] uppercase font-mono text-[10px] border-b border-[#d6cebe] font-bold">
              <tr>
                <th className="px-4 py-3">Building &amp; Ward Location</th>
                <th className="px-4 py-3">AC Condenser Count</th>
                <th className="px-4 py-3">Rejected Heat (kW)</th>
                <th className="px-4 py-3">Street Delta</th>
                <th className="px-4 py-3">Thermal Debt Score</th>
                <th className="px-4 py-3">Monthly Surcharge</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d6cebe] bg-[#f7f2ea]">
              {buildings.map((b) => {
                const isSelected = b.id === selectedBuilding.id;
                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelectBuilding(b)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#e4dcce] hover:bg-[#ded5c6]' : 'hover:bg-[#efe8dc]'
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-[#0b1b2d]">
                      <div>{b.name}</div>
                      <div className="text-[11px] text-[#526071] font-normal">{b.location}, {b.city}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#0b1b2d]">
                      {b.detectedOutdoorUnits.splitUnits} Split + {b.detectedOutdoorUnits.vrfUnits} VRF
                    </td>
                    <td className="px-4 py-3 font-mono text-red-700 font-bold tabular-nums">
                      {b.rejectedHeatKw} kW
                    </td>
                    <td className="px-4 py-3 font-mono text-[#a8321a] font-bold tabular-nums">
                      +{(b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1)}°C
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        b.thermalDebtScore >= 80 ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {b.thermalDebtScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-black text-[#0b1b2d] tabular-nums">
                      ₹{b.monthlyExhaustTaxInr.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {b.mitigationStatus === 'compliant' ? (
                        <span className="text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Compliant
                        </span>
                      ) : b.mitigationStatus === 'under_review' ? (
                        <span className="text-amber-800 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Under Review
                        </span>
                      ) : (
                        <span className="text-red-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Unmitigated
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBuilding(b);
                        }}
                        className={`px-3 py-1 text-xs rounded-xl transition-colors font-mono font-bold cursor-pointer ${
                          isSelected ? 'bg-[#0b1b2d] text-white shadow-xs' : 'bg-[#efe8dc] border border-[#d6cebe] text-[#0b1b2d] hover:bg-[#e4dcce]'
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
        <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#d6cebe] pb-3">
            <h3 className="text-sm font-bold text-[#0b1b2d] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Restorative Engineering Interventions ({selectedBuilding.name})
            </h3>
            <span className="text-xs text-[#0b1b2d]/70 font-mono font-semibold">
              Mitigation Sandbox
            </span>
          </div>

          <p className="text-xs text-[#1f3044] leading-relaxed">
            Building owners can eliminate or reduce their monthly exhaust surcharge by implementing approved thermal deflection and public shade infrastructure:
          </p>

          <div className="space-y-3">
            {/* Action 1: Deflector Louvers */}
            <div className="p-3.5 bg-[#f5efe6] rounded-xl border border-[#d6cebe] flex items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="text-xs font-bold text-[#0b1b2d]">45° Aerodynamic Upward Deflectors</div>
                <div className="text-[11px] text-[#1f3044] mt-0.5 leading-relaxed">
                  Directs exhaust jet vertically towards the roofline, eliminating street-level thermal plume (-3.8°C reduction).
                </div>
                <div className="text-[11px] text-emerald-800 font-mono font-bold mt-1">
                  Surcharge Reduction: 65% (Saves ₹{(selectedBuilding.monthlyExhaustTaxInr * 0.65).toLocaleString('en-IN')}/mo)
                </div>
              </div>
              <button
                onClick={() => onApplyMitigation(selectedBuilding.id, 'Upward Deflector Cowls Installed')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold rounded-xl shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Deploy Deflectors
              </button>
            </div>

            {/* Action 2: Vendor Misting Kiosk */}
            <div className="p-3.5 bg-[#f5efe6] rounded-xl border border-[#d6cebe] flex items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="text-xs font-bold text-[#0b1b2d]">Fund 2 Solar Misting Hydration Kiosks</div>
                <div className="text-[11px] text-[#1f3044] mt-0.5 leading-relaxed">
                  Direct civic restitution providing cool evaporative relief for {vendor.vendorName} and 28 adjacent vendors.
                </div>
                <div className="text-[11px] text-emerald-800 font-mono font-bold mt-1">
                  Grants Immediate Civic Compliance Waiver
                </div>
              </div>
              <button
                onClick={() => onApplyMitigation(selectedBuilding.id, 'Vendor Misting Station Funded')}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-mono font-bold rounded-xl shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Sponsor Kiosks
              </button>
            </div>

            {/* Action 3: Vertical Ivy / Moss Wall */}
            <div className="p-3.5 bg-[#f5efe6] rounded-xl border border-[#d6cebe] flex items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="text-xs font-bold text-[#0b1b2d]">Vertical Living Façade (Green Moss &amp; Ivy)</div>
                <div className="text-[11px] text-[#1f3044] mt-0.5 leading-relaxed">
                  Natural bio-evapotranspiration wall absorbing up to 50 kW of radiant heat before hitting the street.
                </div>
                <div className="text-[11px] text-emerald-800 font-mono font-bold mt-1">
                  Surcharge Reduction: 50%
                </div>
              </div>
              <button
                onClick={() => onApplyMitigation(selectedBuilding.id, 'Vertical Living Green Wall Deployed')}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-mono font-bold rounded-xl shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Deploy Green Wall
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Statutory Notice Generator */}
        <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[#d6cebe] pb-3 mb-3">
              <h3 className="text-sm font-bold text-[#0b1b2d] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#a8321a]" />
                Statutory Municipal Notice Generator (Amazon Bedrock — Nova Pro / Claude 3.5)
              </h3>
              <button
                onClick={handleGenerateNotice}
                disabled={generatingNotice}
                className="px-3 py-1.5 bg-[#0b1b2d] hover:bg-[#1a2d42] text-amber-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {generatingNotice ? 'Synthesizing...' : 'Draft Section 133 Order'}
              </button>
            </div>

            {generatedNotice ? (
              <div className="p-4 bg-[#fbf9f5] rounded-xl border border-[#d6cebe] text-xs space-y-3 font-sans max-h-[380px] overflow-y-auto text-[#0b1b2d]">
                <div className="font-mono text-[11px] font-bold text-[#a8321a] border-b border-[#d6cebe] pb-2">
                  {generatedNotice.legalNoticeTitle}
                </div>

                <div>
                  <div className="text-[#526071] text-[10px] uppercase font-mono tracking-wider font-bold">Executive Summary</div>
                  <p className="text-[#1f3044] mt-0.5 leading-relaxed">{generatedNotice.executiveSummary}</p>
                </div>

                <div>
                  <div className="text-[#526071] text-[10px] uppercase font-mono tracking-wider font-bold">Thermodynamic Findings</div>
                  <p className="text-[#1f3044] mt-0.5 leading-relaxed">{generatedNotice.thermodynamicFindings}</p>
                </div>

                <div>
                  <div className="text-[#526071] text-[10px] uppercase font-mono tracking-wider font-bold">Statutory Directives (14 Days)</div>
                  <ul className="list-disc list-inside text-[#1f3044] space-y-1 mt-1 leading-relaxed">
                    {generatedNotice.statutoryDirectives.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-amber-100 rounded-lg border border-amber-300 text-amber-950 text-[11px] font-medium">
                  <strong className="font-bold text-amber-900">Penalty Mandate:</strong> {generatedNotice.calculatedPenaltyBreakdown}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#f5efe6] rounded-xl border border-dashed border-[#d6cebe] text-center flex flex-col items-center justify-center space-y-2">
                <FileText className="w-8 h-8 text-[#526071]" />
                <div className="text-xs text-[#0b1b2d] font-bold">
                  No notice drafted yet for {selectedBuilding.name}.
                </div>
                <div className="text-[11px] text-[#1f3044] max-w-sm leading-relaxed">
                  Click &quot;Draft Section 133 Order&quot; to invoke Amazon Bedrock (Nova Pro / Claude 3.5) to automatically assemble the legal thermodynamic notice with statutory citations.
                </div>
              </div>
            )}
          </div>

          {generatedNotice && (
            <div className="pt-2 border-t border-[#d6cebe] flex justify-between items-center text-xs">
              <span className="text-[#526071] font-mono font-medium">Reference: UN/MUNICIPAL/2026</span>
              <button
                onClick={() => alert(`Notice for ${selectedBuilding.name} dispatched to Municipal Enforcement Queue.`)}
                className="px-3.5 py-1.5 bg-[#0b1b2d] hover:bg-[#1a2d42] text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
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
