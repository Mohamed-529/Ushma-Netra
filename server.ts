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

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
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
- Detected AC Outdoor Units: ${building.detectedOutdoorUnits.splitUnits} Split ACs, ${building.detectedOutdoorUnits.vrfUnits} VRF units
- Total Rejected Heat: ${building.rejectedHeatKw} kW at ${building.exhaustAirTempCelsius}°C
- Street Canyon Width: ${building.canyonWidthMeters} meters
- Ambient Baseline: ${building.ambientBaselineTempCelsius}°C vs Measured Street Plume: ${building.streetPlumeTempCelsius}°C (+${(building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius).toFixed(1)}°C delta)
- Most Affected Citizen: ${vendor.vendorName} (${vendor.trade}), located ${vendor.distanceToExhaustMeters}m from exhaust vent, enduring ${vendor.wetBulbGlobeTempCelsius}°C WBGT (Category: ${vendor.heatStressCategory})
- Monthly Exhaust Tax Assessment: ₹${Number(building.monthlyExhaustTaxInr).toLocaleString('en-IN')}

Return ONLY valid JSON matching this exact structure:
{
  "legalNoticeTitle": "Statutory Notice title with reference code",
  "executiveSummary": "2-3 concise sentences summarizing the artificial heat dumping violation",
  "thermodynamicFindings": "Clear explanation of how the ${building.rejectedHeatKw} kW waste heat creates an artificial death loop for neighboring workers",
  "statutoryDirectives": ["List of 3 concrete mandatory engineering interventions the building owner must complete within 14 days"],
  "calculatedPenaltyBreakdown": "Explanation of the ₹${Number(building.monthlyExhaustTaxInr).toLocaleString('en-IN')} monthly charge and how funds will be deployed for street-level hydration and shading"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
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

      res.status(500).json({ error: 'Empty response from Gemini API' });
    } catch (error) {
      console.error('Gemini API error:', error);
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
