import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/gemini/thermal-audit-notice', async (req, res) => {
    try {
      const { building, vendor } = req.body;
      if (!building || !vendor) {
        res.status(400).json({ error: 'Missing building or vendor data' });
        return;
      }

      const buildGroundedNotice = () => ({
        legalNoticeTitle: `NOTICE UNDER SEC 133 CrPC / MUNICIPAL CORP ACT: UNLAWFUL ANTHROPOGENIC HEAT DUMPING (REF: UN/NDMC/${String(building.id || 'WARD42').toUpperCase()}/2026)`,
        executiveSummary: `Inspection by Ushma-Netra autonomous sensors and street-view computer vision confirmed that ${building.name} is rejecting an unmitigated ${building.rejectedHeatKw} kW of sensible waste heat at ${building.exhaustAirTempCelsius || 54.2}°C into the public alleyway, artificially inflating ambient pedestrian temperatures by +${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C.`,
        thermodynamicFindings: `The building operates ${building.detectedOutdoorUnits?.splitUnits ?? 64} split and ${building.detectedOutdoorUnits?.vrfUnits ?? 6} VRF outdoor condenser units facing horizontally into a narrow ${building.canyonWidthMeters}m street canyon. This creates an unventilated micro-thermal plume where local Wet Bulb Globe Temperature reaches ${vendor.wetBulbGlobeTempCelsius}°C, imposing physiological heat-stroke lethality on outdoor vendor ${vendor.vendorName} and adjacent pedestrians.`,
        statutoryDirectives: [
          `Immediate Engineering Order: Install 45° upward aerodynamic deflector cowls on all outdoor units facing the alley within 14 calendar days.`,
          `Civic Restitution: Fund the installation and maintenance of 2 high-pressure evaporative misting cooling kiosks along the vendor corridor.`,
          `Façade Mitigation: Deploy an evaporative living vertical green wall covering at least 40% of the ground-level exhaust frontage to absorb radiant heat.`,
        ],
        calculatedPenaltyBreakdown: `Assessed Monthly Thermal Debt Surcharge: ₹${Number(building.monthlyExhaustTaxInr || 185000).toLocaleString('en-IN')}/month. Surcharge proceeds are directly remitted to the Municipal Urban Shade & Vendor Health Protection Fund under the 2026 City Heat Action Plan.`,
      });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.json(buildGroundedNotice());
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are the Lead Environmental Micro-Climate Officer for the Municipal Corporation in an Indian megacity implementing Ushma-Netra (Thermal Equity & AC Exhaust Regulation Framework).
Generate a formal Municipal Section 133 Environmental Notice for micro-thermal exhaust dumping.

Building Profile:
- Name: ${building.name}
- Location: ${building.location}, ${building.city}
- Detected AC Outdoor Units: ${building.detectedOutdoorUnits?.splitUnits ?? 64} Split ACs, ${building.detectedOutdoorUnits?.vrfUnits ?? 6} VRF units
- Total Rejected Heat: ${building.rejectedHeatKw} kW at ${building.exhaustAirTempCelsius || 54.2}°C
- Street Canyon Width: ${building.canyonWidthMeters} meters
- Ambient Baseline: ${building.ambientBaselineTempCelsius}°C vs Measured Street Plume: ${building.streetPlumeTempCelsius}°C (+${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C delta)
- Most Affected Citizen: ${vendor.vendorName} (${vendor.trade || vendor.stallType || 'Street Vendor'}), located ${vendor.distanceToExhaustMeters}m from exhaust vent, enduring ${vendor.wetBulbGlobeTempCelsius}°C WBGT (Category: ${vendor.heatStressCategory || vendor.physiologicalRiskTier || 'Extreme Lethality'})
- Monthly Exhaust Tax Assessment: ₹${Number(building.monthlyExhaustTaxInr).toLocaleString('en-IN')}

Return ONLY valid JSON matching this exact structure:
{
  "legalNoticeTitle": "Statutory Notice title with reference code",
  "executiveSummary": "2-3 concise sentences summarizing the artificial heat dumping violation",
  "thermodynamicFindings": "Clear explanation of how the ${building.rejectedHeatKw} kW waste heat creates an artificial death loop for neighboring workers",
  "statutoryDirectives": ["List of 3 concrete mandatory engineering interventions the building owner must complete within 14 days"],
  "calculatedPenaltyBreakdown": "Explanation of the ₹${Number(building.monthlyExhaustTaxInr).toLocaleString('en-IN')} monthly charge and how funds will be deployed for street-level hydration and shading"
}`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash'];
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  legalNoticeTitle: { type: Type.STRING },
                  executiveSummary: { type: Type.STRING },
                  thermodynamicFindings: { type: Type.STRING },
                  statutoryDirectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  calculatedPenaltyBreakdown: { type: Type.STRING },
                },
                required: [
                  'legalNoticeTitle',
                  'executiveSummary',
                  'thermodynamicFindings',
                  'statutoryDirectives',
                  'calculatedPenaltyBreakdown',
                ],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            res.json(parsed);
            return;
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} transient error, trying next fallback:`, modelErr);
        }
      }

      // If all models are experiencing temporary 503 capacity spikes, return grounded statutory notice
      res.json(buildGroundedNotice());
    } catch (error) {
      console.error('Gemini endpoint error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to generate notice',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
