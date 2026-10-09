export interface BuildingAudit {
  id: string;
  name: string;
  location: string;
  city: string;
  canyonWidthMeters: number;
  facadeOrientation: string;
  detectedOutdoorUnits: {
    splitUnits: number;
    vrfUnits: number;
    chillerTowers: number;
  };
  totalCoolingTonnageTR: number;
  rejectedHeatKw: number;
  exhaustAirTempCelsius: number;
  ambientBaselineTempCelsius: number;
  streetPlumeTempCelsius: number;
  thermalDebtScore: number; // 0 - 100
  monthlyExhaustTaxInr: number;
  adjacentVulnerablePopulation: {
    vendorsCount: number;
    informalSettlementDwellers: number;
    dailyPedestrianFootfall: number;
  };
  mitigationStatus: 'unmitigated' | 'under_review' | 'compliant';
  recommendedInterventions: string[];
}

export interface VendorTelemetry {
  id: string;
  vendorName: string;
  trade: string; // e.g. "Chai & Snack Cart", "Vegetable Vendor", "Auto-Rickshaw Stand"
  location: string;
  distanceToExhaustMeters: number;
  dryBulbTempCelsius: number;
  relativeHumidityPct: number;
  wetBulbGlobeTempCelsius: number;
  heatStressCategory: 'Nominal' | 'Moderate' | 'High Risk' | 'Extreme Lethality';
  exhaustBlastDetected: boolean;
  batteryPct: number;
  lastPingTimestamp: string;
}

export type ActiveTab = '3d_twin' | 'cv_scanner' | 'thermal_debt' | 'vendor_iot' | 'aws_architecture';

export interface IncidentLog {
  id: string;
  timestamp: string;
  type: 'exhaust_spike' | 'cv_detection' | 'tax_issued' | 'vendor_alert' | 'mitigation_action';
  tier: 1 | 2 | 3;
  title: string;
  detail: string;
}
