import { GoogleGenAI } from '@google/genai';
import { BuildingAudit, VendorTelemetry } from '../types';

// Read API key safely from environment
const apiKey =
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  '';

let aiClient: GoogleGenAI | null = null;
try {
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  } else {
    aiClient = new GoogleGenAI();
  }
} catch (e) {
  console.warn('GoogleGenAI client initialized in fallback mode', e);
}

export async function generateThermalAuditNotice(
  building: BuildingAudit,
  vendor: VendorTelemetry
): Promise<{
  legalNoticeTitle: string;
  executiveSummary: string;
  thermodynamicFindings: string;
  statutoryDirectives: string[];
  calculatedPenaltyBreakdown: string;
}> {
  const prompt = `You are the Lead Environmental Micro-Climate Officer for the Municipal Corporation in an Indian megacity implementing Ushma-Netra (Thermal Equity & AC Exhaust Regulation Framework).
Generate a formal Municipal Section 133 Environmental Notice for micro-thermal exhaust dumping.

Building Profile:
- Name: ${building.name}
- Location: ${building.location}, ${building.city}
- Detected AC Outdoor Units: ${building.detectedOutdoorUnits.splitUnits} Split ACs, ${building.detectedOutdoorUnits.vrfUnits} VRF units
- Total Rejected Heat: ${building.rejectedHeatKw} kW at ${building.exhaustAirTempCelsius}°C
- Street Canyon Width: ${building.canyonWidthMeters} meters
- Ambient Baseline: ${building.ambientBaselineTempCelsius}°C vs Measured Street Plume: ${building.streetPlumeTempCelsius}°C (+${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C delta)
- Most Affected Citizen: ${vendor.vendorName} (${vendor.trade}), located ${vendor.distanceToExhaustMeters}m from exhaust vent, enduring ${vendor.wetBulbGlobeTempCelsius}°C WBGT (Category: ${vendor.heatStressCategory})
- Monthly Exhaust Tax Assessment: ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')}

Return ONLY valid JSON matching this exact structure:
{
  "legalNoticeTitle": "Statutory Notice title with reference code",
  "executiveSummary": "2-3 concise sentences summarizing the artificial heat dumping violation",
  "thermodynamicFindings": "Clear explanation of how the ${building.rejectedHeatKw} kW waste heat creates an artificial death loop for neighboring workers",
  "statutoryDirectives": ["List of 3 concrete mandatory engineering interventions the building owner must complete within 14 days"],
  "calculatedPenaltyBreakdown": "Explanation of the ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')} monthly charge and how funds will be deployed for street-level hydration and shading"
}`;

  try {
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Gemini API call fell back to deterministic generator:', error);
  }

  // High-fidelity domain-grounded fallback
  return {
    legalNoticeTitle: `NOTICE UNDER SEC 133 CrPC / MUNICIPAL CORP ACT: UNLAWFUL ANTHROPOGENIC HEAT DUMPING (REF: UN/NDMC/${building.id.toUpperCase()}/2026)`,
    executiveSummary: `Inspection by Ushma-Netra autonomous sensors and street-view computer vision confirmed that ${building.name} is rejecting an unmitigated ${building.rejectedHeatKw} kW of sensible waste heat at ${building.exhaustAirTempCelsius}°C into the public alleyway, artificially inflating ambient pedestrian temperatures by +${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C.`,
    thermodynamicFindings: `The building operates ${building.detectedOutdoorUnits.splitUnits} split and ${building.detectedOutdoorUnits.vrfUnits} VRF outdoor condenser units facing horizontally into a narrow ${building.canyonWidthMeters}m street canyon. This creates an unventilated micro-thermal plume where local Wet Bulb Globe Temperature reaches ${vendor.wetBulbGlobeTempCelsius}°C, imposing physiological heat-stroke lethality on outdoor vendor ${vendor.vendorName} and 140+ neighboring residents.`,
    statutoryDirectives: [
      `Immediate Engineering Order: Install 45° upward aerodynamic deflector cowls on all outdoor units facing the alley within 14 calendar days.`,
      `Civic Restitution: Fund the installation and maintenance of 2 high-pressure evaporative misting cooling kiosks along the vendor corridor.`,
      `Façade Mitigation: Deploy an evaporative living vertical green wall covering at least 40% of the ground-level exhaust frontage to absorb radiant heat.`,
    ],
    calculatedPenaltyBreakdown: `Assessed Monthly Thermal Debt Surcharge: ₹${building.monthlyExhaustTaxInr.toLocaleString('en-IN')}/month. Surcharge proceeds are directly remitted to the Municipal Urban Shade & Vendor Health Protection Fund under the 2026 City Heat Action Plan.`,
  };
}
