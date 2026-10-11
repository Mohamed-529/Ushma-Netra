import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import {
  Search,
  MapPin,
  Flame,
  AlertTriangle,
  ShieldCheck,
  Download,
  ChevronRight,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Home,
  Compass,
  Navigation,
  Crosshair,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface Props {
  buildings: BuildingAudit[];
  selectedBuilding: BuildingAudit;
  onSelectBuilding: (b: BuildingAudit) => void;
  onApplyMitigation: (buildingId: string, intervention: string) => void;
  vendors: VendorTelemetry[];
}

export const ThermalGridPage: React.FC<Props> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  onApplyMitigation,
}) => {
  const { zoneId } = useParams<{ zoneId?: string }>();
  const navigate = useNavigate();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'scrolly' | 'table' | 'map'>('scrolly');
  const [minHeatDebt] = useState<number>(0);

  // Scrollytelling Active Building State (driven by IntersectionObserver + manual click)
  const [activeScrollBuildingId, setActiveScrollBuildingId] = useState<string>(
    buildings[0]?.id || 'del-ln-vikas'
  );
  const [mapZoomMultiplier, setMapZoomMultiplier] = useState<number>(1);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Amazon Location Service Dynamic Geofencing State
  const [vendorCoords, setVendorCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6284,
    lng: 77.1325,
  });
  const [proximityReport, setProximityReport] = useState<{
    success: boolean;
    status: 'CRITICAL_VIOLATION' | 'SAFE_ZONE';
    geofenceId?: string;
    message: string;
    distanceToExhaustMeters: number;
  } | null>({
    success: true,
    status: 'CRITICAL_VIOLATION',
    geofenceId: 'GF-VIKAS-SURYA-AC-02',
    message:
      'ALERT: Device breached high-heat boundary envelope [GF-VIKAS-SURYA-AC-02]. Ambient exhaust risk level high.',
    distanceToExhaustMeters: 2.4,
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const simulateScrollMovement = async (mode: 'SAFE' | 'HAZARD') => {
    setIsValidating(true);
    soundEngine.playTone(mode === 'HAZARD' ? 440 : 680, 'sine', 0.1);

    // Coordinates targeting stable ambient rows or shifting directly into the exhaust center point
    const activePayload =
      mode === 'HAZARD'
        ? {
            deviceId: 'VN-DEL-084',
            latitude: 28.6291,
            longitude: 77.1332,
            currentWbgt: 38.2,
            buildingId: selectedBuilding.id,
          }
        : {
            deviceId: 'VN-DEL-084',
            latitude: 28.625,
            longitude: 77.1301,
            currentWbgt: 29.4,
            buildingId: selectedBuilding.id,
          };

    setVendorCoords({ lat: activePayload.latitude, lng: activePayload.longitude });

    try {
      const response = await fetch('/api/grid/evaluate-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePayload),
      });
      if (response.ok) {
        const report = await response.json();
        setProximityReport(report);
      }
    } catch {
      setProximityReport({
        success: true,
        status: mode === 'HAZARD' ? 'CRITICAL_VIOLATION' : 'SAFE_ZONE',
        geofenceId: 'GF-VIKAS-SURYA-AC-02',
        message:
          mode === 'HAZARD'
            ? 'ALERT: Device breached high-heat boundary envelope [GF-VIKAS-SURYA-AC-02]. Ambient exhaust risk level high.'
            : 'Device position verified outside critical commercial exhaust sectors.',
        distanceToExhaustMeters: mode === 'HAZARD' ? 2.4 : 14.8,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('ushma_watchlist') || '["del-ln-vikas", "del-np-devika"]'
      );
    } catch {
      return ['del-ln-vikas', 'del-np-devika'];
    }
  });

  // Toggle watchlist
  const toggleWatchlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('ushma_watchlist', JSON.stringify(next));
      return next;
    });
  };

  // If zoneId route param is present, sync with selectedBuilding
  const activeDetailBuilding = useMemo(() => {
    if (zoneId) {
      return buildings.find((b) => b.id === zoneId) || selectedBuilding;
    }
    return null;
  }, [zoneId, buildings, selectedBuilding]);

  // Filtered buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.district && b.district.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCity = selectedCity === 'All' || b.city === selectedCity;

      const matchesStatus =
        selectedStatus === 'all' || b.mitigationStatus === selectedStatus;

      const matchesDebt = b.thermalDebtScore >= minHeatDebt;

      return matchesSearch && matchesCity && matchesStatus && matchesDebt;
    });
  }, [buildings, searchQuery, selectedCity, selectedStatus, minHeatDebt]);

  // Keep activeScrollBuildingId valid when filters change
  useEffect(() => {
    if (
      filteredBuildings.length > 0 &&
      !filteredBuildings.some((b) => b.id === activeScrollBuildingId)
    ) {
      setActiveScrollBuildingId(filteredBuildings[0].id);
    }
  }, [filteredBuildings, activeScrollBuildingId]);

  // Performance-friendly IntersectionObserver to track which building card is in the center viewport threshold
  useEffect(() => {
    if (viewMode !== 'scrolly' || filteredBuildings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the card with the highest intersection ratio inside the center band
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          const buildingId = (bestEntry.target as HTMLElement).dataset.buildingId;
          if (buildingId) {
            setActiveScrollBuildingId(buildingId);
          }
        }
      },
      {
        // Trigger when a card crosses the middle 30% band of the viewport
        root: null,
        rootMargin: '-32% 0px -32% 0px',
        threshold: [0.15, 0.35, 0.6, 0.85],
      }
    );

    filteredBuildings.forEach((b) => {
      const el = cardRefs.current[b.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredBuildings, viewMode]);

  // Safely sync activeScrollBuildingId with parent selectedBuilding inside an effect
  useEffect(() => {
    const found = filteredBuildings.find((b) => b.id === activeScrollBuildingId);
    if (found && found.id !== selectedBuilding.id) {
      onSelectBuilding(found);
    }
  }, [activeScrollBuildingId, filteredBuildings, selectedBuilding.id, onSelectBuilding]);

  const activeMapBuilding = useMemo(() => {
    return (
      filteredBuildings.find((b) => b.id === activeScrollBuildingId) ||
      filteredBuildings[0] ||
      selectedBuilding
    );
  }, [filteredBuildings, activeScrollBuildingId, selectedBuilding]);

  // Normalize building coordinates onto a 1000x700 spatial SVG coordinate plane with smooth local neighborhood offsets
  const spatialNodes = useMemo(() => {
    return filteredBuildings.map((b, idx) => {
      // Create deterministic, well-spaced urban coordinates so every building has a clear micro-canyon footprint
      const angle = idx * 1.18 + 0.4;
      const ringRadius = 110 + (idx % 4) * 58;
      const x = Math.round(500 + Math.cos(angle) * ringRadius * 1.25);
      const y = Math.round(350 + Math.sin(angle) * ringRadius * 0.82);
      return {
        building: b,
        x: Math.max(140, Math.min(860, x)),
        y: Math.max(120, Math.min(580, y)),
      };
    });
  }, [filteredBuildings]);

  const activeSpatialNode = useMemo(() => {
    return (
      spatialNodes.find((n) => n.building.id === activeMapBuilding?.id) ||
      spatialNodes[0] || {
        building: selectedBuilding,
        x: 500,
        y: 350,
      }
    );
  }, [spatialNodes, activeMapBuilding, selectedBuilding]);

  // Smoothly scroll to a specific building card when a map marker is clicked
  const scrollToBuildingCard = (building: BuildingAudit) => {
    soundEngine.playTone(520, 'sine', 0.08);
    setActiveScrollBuildingId(building.id);
    onSelectBuilding(building);
    const el = cardRefs.current[building.id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Cities list
  const cities = ['All', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Ahmedabad'];

  const [exportStatusMessage, setExportStatusMessage] = useState<string | null>(null);

  // Trigger reliable file download inside sandboxed iframe + show visual confirmation
  const triggerFileDownload = (content: string, filename: string, mimeType: string, label: string) => {
    soundEngine.playTone(620, 'sine', 0.1);
    try {
      const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, 250);
      setExportStatusMessage(`Downloaded ${label} (${filteredBuildings.length} zones)`);
      window.setTimeout(() => setExportStatusMessage(null), 3200);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content);
      }
      setExportStatusMessage(`Copied ${label} data to clipboard (${filteredBuildings.length} zones)`);
      window.setTimeout(() => setExportStatusMessage(null), 3200);
    }
  };

  // Export GeoJSON
  const handleExportGeoJSON = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        title: 'Ushma-Netra Thermal Equity Grid Monitored Nodes',
        generatedAt: new Date().toISOString(),
        totalFeatures: filteredBuildings.length,
      },
      features: filteredBuildings.map((b) => ({
        type: 'Feature',
        id: b.id,
        geometry: {
          type: 'Point',
          coordinates: [b.coordinates?.lng || 77.209, b.coordinates?.lat || 28.6139],
        },
        properties: {
          name: b.name,
          location: b.location,
          city: b.city,
          district: b.district,
          thermalDebtScore: b.thermalDebtScore,
          streetPlumeTempCelsius: b.streetPlumeTempCelsius,
          ambientBaselineTempCelsius: b.ambientBaselineTempCelsius,
          temperatureDeltaCelsius: (
            b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius
          ).toFixed(1),
          rejectedHeatKw: b.rejectedHeatKw,
          coolingTonnageTR: b.totalCoolingTonnageTR,
          monthlyExhaustTaxInr: b.monthlyExhaustTaxInr,
          vulnerableVendorsCount: b.adjacentVulnerablePopulation.vendorsCount,
          mitigationStatus: b.mitigationStatus,
        },
      })),
    };

    triggerFileDownload(
      JSON.stringify(geojson, null, 2),
      `ushma-netra-thermal-grid-${Date.now()}.geojson`,
      'application/geo+json',
      'GeoJSON'
    );
  };

  // Export CSV
  const handleExportCSV = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const headers = [
      'ID',
      'Name',
      'City',
      'District',
      'Street Plume (°C)',
      'Baseline (°C)',
      'Delta (°C)',
      'Rejected Heat (kW)',
      'Cooling Tonnage (TR)',
      'Thermal Debt Score',
      'Monthly Surcharge (INR)',
      'Vulnerable Vendors',
      'Mitigation Status',
    ];

    const rows = filteredBuildings.map((b) => [
      b.id,
      `"${b.name}"`,
      `"${b.city}"`,
      `"${b.district || ''}"`,
      b.streetPlumeTempCelsius,
      b.ambientBaselineTempCelsius,
      (b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1),
      b.rejectedHeatKw,
      b.totalCoolingTonnageTR,
      b.thermalDebtScore,
      b.monthlyExhaustTaxInr,
      b.adjacentVulnerablePopulation.vendorsCount,
      b.mitigationStatus,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerFileDownload(
      csvContent,
      `ushma-netra-thermal-nodes-${Date.now()}.csv`,
      'text/csv',
      'CSV'
    );
  };

  // Open detail drawer
  const handleOpenDetail = (b: BuildingAudit) => {
    onSelectBuilding(b);
    navigate(`/grid/${b.id}`);
  };

  const handleCloseDetail = () => {
    navigate('/grid');
  };

  // Compute dynamic camera transform & heat radius ring for the active building
  const zoomScale = (1.75 + (activeMapBuilding.thermalDebtScore - 70) * 0.012) * mapZoomMultiplier;
  const heatRadiusPx = Math.max(58, Math.round(activeMapBuilding.thermalDebtScore * 1.18));
  const activeDelta = (
    activeMapBuilding.streetPlumeTempCelsius - activeMapBuilding.ambientBaselineTempCelsius
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs Bar on #12161A Dark Canvas */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] shadow-md text-xs font-mono font-bold transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5 text-[#a8321a]" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Link to="/" className="text-white hover:text-amber-400 transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-amber-400 font-bold">Thermal Grid Registry</span>
          {activeDetailBuilding && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white font-bold truncate">
                {activeDetailBuilding.name}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Hero Headline & Key Statistics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
              National Registry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Thermal Grid &amp; Exhaust Zone Registry
          </h1>
        </div>

        {/* Global Summary Stats in Pure White #FFFFFF Floating Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E7EB] shrink-0 shadow-xl text-[#111827]">
          <div>
            <div className="text-[10px] font-mono text-[#111827]/60 uppercase font-semibold">
              Monitored Nodes
            </div>
            <div className="text-lg font-black font-mono text-[#111827]">
              {buildings.length}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#111827]/60 uppercase font-semibold">
              Total Rejection
            </div>
            <div className="text-lg font-black font-mono text-[#a8321a]">
              {(buildings.reduce((sum, b) => sum + b.rejectedHeatKw, 0) / 1000).toFixed(2)} MW
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#111827]/60 uppercase font-semibold">
              Vulnerable Vendors
            </div>
            <div className="text-lg font-black font-mono text-[#9e2a14]">
              {buildings.reduce(
                (sum, b) => sum + b.adjacentVulnerablePopulation.vendorsCount,
                0
              )}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#111827]/60 uppercase font-semibold">
              Monthly Tax
            </div>
            <div className="text-lg font-black font-mono text-[#047857]">
              ₹
              {(
                buildings.reduce((sum, b) => sum + b.monthlyExhaustTaxInr, 0) / 100000
              ).toFixed(1)}
              L
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Export Buttons inside Pure White #FFFFFF Card */}
      <div className="space-y-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E5E7EB] shadow-xl text-[#111827]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#111827]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by building name, market, street or ward (e.g. Vikas Surya, Devika Tower, Statesman House)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] placeholder-[#111827]/50 focus:outline-none focus:border-[#111827] transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111827]/50 hover:text-[#111827]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle + Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('scrolly')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'scrolly'
                    ? 'bg-[#111827] text-white font-bold shadow-sm'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                Split Scrollytelling
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#111827] text-white font-bold shadow-sm'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#111827] text-white font-bold shadow-sm'
                    : 'text-[#111827]/70 hover:text-[#111827]'
                }`}
              >
                Overview Grid
              </button>
            </div>

            {/* Export Buttons */}
            <button
              type="button"
              onClick={handleExportGeoJSON}
              className="px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-[#1f2937] active:scale-95 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Download open GeoJSON format"
            >
              <Download className="w-3.5 h-3.5 text-amber-400 pointer-events-none" />
              <span className="pointer-events-none">GeoJSON</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] active:scale-95 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Download CSV audit data"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200 pointer-events-none" />
              <span className="pointer-events-none">CSV</span>
            </button>
          </div>
        </div>

        {/* Visual Export Confirmation Banner */}
        {exportStatusMessage && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{exportStatusMessage}</span>
            </span>
            <button
              type="button"
              onClick={() => setExportStatusMessage(null)}
              className="text-emerald-300/70 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Pills: City & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E5E7EB] text-xs">
          {/* City Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#111827]/70 font-mono text-[11px] mr-1.5 font-bold">
              City:
            </span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#111827] text-white font-bold shadow-sm'
                    : 'bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] hover:bg-[#E5E7EB]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#111827]/70 font-mono text-[11px] mr-1.5 font-bold">
              Mitigation:
            </span>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'unmitigated', label: 'Unmitigated (Critical)' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'compliant', label: 'Compliant' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-[#111827] text-white font-bold shadow-sm'
                    : 'bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] hover:bg-[#E5E7EB]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* AMAZON LOCATION SERVICE: LIVE SPATIAL CONTEXT & GEOFENCE MATRIX       */}
      {/* ===================================================================== */}
      <div
        className="p-6 sm:p-8 bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] text-[#111827]"
        style={{
          boxShadow:
            '0 25px 70px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
              🗺️ Amazon Location Service · 5.0m Exhaust Geofence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tracks vendor carts entering 5m AC exhaust zones in real time (<code className="font-mono font-bold text-[#a8321a]">BatchEvaluateGeofencesCommand</code>).
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold rounded-full tracking-wide">
            ● 5m GEOFENCE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Simulation Control Panel */}
          <div className="space-y-4 lg:col-span-1">
            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
              <h3 className="text-xs font-mono font-bold text-slate-700 tracking-wider uppercase mb-3">
                Geofence Traversal Sandbox (Device: VN-DEL-084)
              </h3>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => simulateScrollMovement('SAFE')}
                  className="w-full px-4 py-2.5 bg-[#111827] text-white text-xs font-mono font-bold rounded-xl hover:bg-slate-800 transition-all tracking-wider uppercase cursor-pointer shadow-xs"
                >
                  1. Position Cart in Public Shaded Way
                </button>
                <button
                  type="button"
                  onClick={() => simulateScrollMovement('HAZARD')}
                  className="w-full px-4 py-2.5 bg-red-700 text-white text-xs font-mono font-bold rounded-xl hover:bg-red-800 transition-all tracking-wider uppercase cursor-pointer shadow-xs"
                >
                  2. Shift Cart Into 5m AC Exhaust Jet
                </button>
              </div>
            </div>

            {/* Real-Time Telemetry Readout */}
            {proximityReport && (
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  proximityReport.status === 'CRITICAL_VIOLATION'
                    ? 'bg-red-50/80 border-red-200'
                    : 'bg-emerald-50/80 border-emerald-200'
                }`}
              >
                <div
                  className={`text-xs font-mono font-extrabold tracking-wider uppercase mb-1.5 ${
                    proximityReport.status === 'CRITICAL_VIOLATION'
                      ? 'text-red-700'
                      : 'text-emerald-800'
                  }`}
                >
                  {proximityReport.status === 'CRITICAL_VIOLATION'
                    ? '⚠️ DANGER BOUNDARY BREACHED'
                    : '✅ SECURE TRACKING STATUS'}
                </div>
                <div className="text-3xl font-black font-mono text-[#111827] mb-1">
                  {proximityReport.distanceToExhaustMeters} meters
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {proximityReport.message}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Map Framework Graphic Display */}
          <div className="lg:col-span-2 relative min-h-[350px] bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden flex items-center justify-center p-4">
            {/* Subtle Technical Backdrop Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

            {/* Simulated Building Envelope Vector */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-2xl border border-stone-700 bg-stone-800/40 flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-stone-300 tracking-widest uppercase mb-2">
                {activeMapBuilding.name}
              </span>

              {/* Active 5-Meter Geofence Boundary Visual Ring */}
              <div
                className={`w-40 h-40 rounded-full border-2 border-dashed transition-all flex flex-col items-center justify-center animate-[spin_40s_linear_infinite] ${
                  proximityReport?.status === 'CRITICAL_VIOLATION'
                    ? 'border-red-500 bg-red-900/25 shadow-[0_0_35px_rgba(239,68,68,0.3)]'
                    : 'border-sky-400/50 bg-sky-900/10'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
              </div>
              <span className="text-[10px] font-mono text-amber-300/90 mt-2">
                5.0m Exhaust Geofence ({proximityReport?.geofenceId || 'GF-VIKAS-SURYA-AC-02'})
              </span>
            </div>

            {/* Dynamic Floating Live Vendor Tracking Node */}
            <div
              className="absolute w-5 h-5 transition-all duration-700 ease-out flex items-center justify-center z-20"
              style={{
                top: proximityReport?.status === 'CRITICAL_VIOLATION' ? '52%' : '20%',
                left: proximityReport?.status === 'CRITICAL_VIOLATION' ? '54%' : '24%',
              }}
            >
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                  proximityReport?.status === 'CRITICAL_VIOLATION' ? 'bg-red-500' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3.5 w-3.5 shadow-md ring-2 ring-white ${
                  proximityReport?.status === 'CRITICAL_VIOLATION' ? 'bg-red-600' : 'bg-emerald-500'
                }`}
              />
            </div>

            {/* Real-time telemetry log feed display layer */}
            <div className="absolute bottom-3 left-3 right-3 bg-stone-950/90 border border-stone-800 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-stone-300 flex flex-wrap justify-between gap-2">
              <span>
                Position [Lng, Lat]: [{vendorCoords.lng.toFixed(4)}, {vendorCoords.lat.toFixed(4)}]
              </span>
              <span
                className={
                  proximityReport?.status === 'CRITICAL_VIOLATION'
                    ? 'text-red-400 font-bold'
                    : 'text-emerald-400 font-bold'
                }
              >
                {isValidating
                  ? 'COMPUTING AWS PROXIMITY...'
                  : `RESPONSE: ${proximityReport?.status || 'WAITING_STREAM'}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SPLIT-SCREEN SCROLLYTELLING INTERFACE (Left Sticky Map + Right Stream) */}
      {/* ===================================================================== */}
      {viewMode === 'scrolly' && (
        <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-8 items-start min-h-screen">
          {/* LEFT COLUMN: Full-Viewport Sticky Spatial Thermal Map Window */}
          <div className="w-full lg:w-[58%] xl:w-[60%] lg:sticky lg:top-[88px] h-[540px] lg:h-[calc(100vh-104px)] rounded-3xl overflow-hidden border-2 border-[#0b1b2d]/25 bg-[#08101d] shadow-[0_24px_60px_rgba(11,27,45,0.24)] flex flex-col justify-between relative shrink-0">
            {/* Compact Top Spatial HUD Bar (Does not hide the spatial map) */}
            <div className="relative z-20 px-4 py-3 bg-[#08101d]/90 border-b border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Compass className="w-4 h-4 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                      LIVE SPATIAL LOCK · {activeMapBuilding.city}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                      Debt {activeMapBuilding.thermalDebtScore}/100
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white truncate">
                    {activeMapBuilding.name}
                  </h2>
                </div>
              </div>

              {/* Coordinates + Zoom Controls */}
              <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f1b2e] border border-slate-700 text-sky-300 text-[11px]">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {activeMapBuilding.coordinates?.lat.toFixed(4)}°N,{' '}
                    {activeMapBuilding.coordinates?.lng.toFixed(4)}°E
                  </span>
                </div>

                <div className="flex items-center rounded-lg bg-[#0f1b2e] border border-slate-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setMapZoomMultiplier((z) =>
                        Math.min(1.8, Number((z + 0.2).toFixed(2)))
                      )
                    }
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMapZoomMultiplier((z) =>
                        Math.max(0.7, Number((z - 0.2).toFixed(2)))
                      )
                    }
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer border-l border-slate-700"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Bleed Unobstructed Vector Spatial Map Viewport */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <svg
                viewBox="0 0 1000 700"
                className="w-full h-full select-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Radial Heat Island Gradient Scaled by Thermal Debt */}
                  <radialGradient id="activeHeatIslandGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.68" />
                    <stop offset="45%" stopColor="#f97316" stopOpacity="0.34" />
                    <stop offset="78%" stopColor="#f59e0b" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="secondaryHeatGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>

                  <pattern
                    id="urbanCanyonGrid"
                    width="50"
                    height="50"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="rgba(148, 163, 184, 0.13)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                {/* Smoothly Animated Camera Group that Flies & Zooms to Active Building Coordinates */}
                <g
                  style={{
                    transform: `translate(500px, 350px) scale(${zoomScale.toFixed(
                      3
                    )}) translate(${-activeSpatialNode.x}px, ${-activeSpatialNode.y}px)`,
                    transition: 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {/* Base Coordinate Grid */}
                  <rect x="-500" y="-500" width="2000" height="2000" fill="#08101d" />
                  <rect
                    x="-500"
                    y="-500"
                    width="2000"
                    height="2000"
                    fill="url(#urbanCanyonGrid)"
                  />

                  {/* Stylized Urban Arterial Roads & Street Canyons */}
                  <g stroke="rgba(56, 189, 248, 0.15)" strokeWidth="2.5" fill="none">
                    <path d="M 50 180 L 950 520" />
                    <path d="M 120 580 L 890 130" />
                    <path d="M 500 20 L 500 680" strokeDasharray="6 6" />
                    <path d="M 60 350 L 940 350" strokeDasharray="6 6" />
                    <circle cx="500" cy="350" r="240" stroke="rgba(148,163,184,0.12)" />
                    <circle cx="500" cy="350" r="390" stroke="rgba(148,163,184,0.08)" />
                  </g>

                  {/* Surrounding Urban Building Footprints */}
                  {spatialNodes.map((node, idx) => {
                    const isCurrent = node.building.id === activeMapBuilding.id;
                    const b = node.building;
                    const nodeHeatRadius = Math.max(
                      44,
                      Math.round(b.thermalDebtScore * 1.15)
                    );

                    return (
                      <g
                        key={b.id}
                        onClick={() => scrollToBuildingCard(b)}
                        className="cursor-pointer"
                      >
                        {/* Secondary Heat Aura for Non-Active Nodes */}
                        {!isCurrent && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={nodeHeatRadius * 0.65}
                            fill="url(#secondaryHeatGradient)"
                          />
                        )}

                        {/* ACTIVE BUILDING: Dynamic Thermal Heat Island Radius Ring Scaled by Thermal Debt Score */}
                        {isCurrent && (
                          <>
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={heatRadiusPx * 1.35}
                              fill="url(#activeHeatIslandGradient)"
                            />
                            {/* Outer Dashed Thermal Debt Boundary Ring */}
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={heatRadiusPx}
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="1.8"
                              strokeDasharray="6 4"
                            />
                            {/* Inner Micro-Canyon Plume Ring */}
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={heatRadiusPx * 0.58}
                              fill="rgba(239, 68, 68, 0.16)"
                              stroke="#f59e0b"
                              strokeWidth="1.4"
                            />
                            {/* Radius Label Tag on Ring */}
                            <g
                              transform={`translate(${node.x + heatRadiusPx * 0.68}, ${
                                node.y - heatRadiusPx * 0.68
                              })`}
                            >
                              <rect
                                x="-4"
                                y="-12"
                                width="124"
                                height="20"
                                rx="5"
                                fill="#0b1b2d"
                                stroke="#f59e0b"
                                strokeWidth="1"
                              />
                              <text
                                x="4"
                                y="1"
                                fill="#fde68a"
                                fontSize="8.5"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {b.canyonWidthMeters}m Canyon · +{activeDelta}°C
                              </text>
                            </g>
                          </>
                        )}

                        {/* Architectural Commercial Block Footprint */}
                        <rect
                          x={node.x - (isCurrent ? 16 : 11)}
                          y={node.y - (isCurrent ? 16 : 11)}
                          width={isCurrent ? 32 : 22}
                          height={isCurrent ? 32 : 22}
                          rx="4"
                          fill={isCurrent ? '#ef4444' : '#1e293b'}
                          stroke={isCurrent ? '#fde68a' : '#64748b'}
                          strokeWidth={isCurrent ? '2.2' : '1.2'}
                        />

                        {/* Node Index & Plume Temperature Label */}
                        <text
                          x={node.x}
                          y={node.y + 3}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={isCurrent ? '9.5' : '8'}
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </text>

                        <text
                          x={node.x}
                          y={node.y + (isCurrent ? 30 : 22)}
                          textAnchor="middle"
                          fill={isCurrent ? '#fde68a' : '#cbd5e1'}
                          fontSize={isCurrent ? '9.5' : '7.5'}
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {b.streetPlumeTempCelsius}°C
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Compact Single-Line Bottom Bar (Zero Map Obstruction) */}
            <div className="relative z-20 px-4 py-2.5 bg-[#0b1b2d]/95 border-t border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeMapBuilding.location}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-rose-400 font-bold">
                  Plume {activeMapBuilding.streetPlumeTempCelsius}°C (+{activeDelta}°C)
                </span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-emerald-400 font-bold hidden sm:inline">
                  {activeMapBuilding.adjacentVulnerablePopulation.vendorsCount} Vendors Exposed
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDetail(activeMapBuilding)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <span>Inspect Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Single Vertical Scrolling Stream of Building Registry Cards */}
          <div className="w-full lg:w-[42%] xl:w-[40%] space-y-6 pb-[32vh]">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#a8321a]">
                Scrolling Building Stream ({filteredBuildings.length} Zones)
              </span>
              <span className="text-xs font-mono text-[#0b1b2d]/60">
                Scroll to fly map →
              </span>
            </div>

            {filteredBuildings.map((building, index) => {
              const tempDelta = (
                building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius
              ).toFixed(1);
              const isWatchlisted = watchlistIds.includes(building.id);
              const isActiveCard = building.id === activeMapBuilding.id;

              return (
                <div
                  key={building.id}
                  data-building-id={building.id}
                  ref={(el) => {
                    cardRefs.current[building.id] = el;
                  }}
                  onClick={() => {
                    setActiveScrollBuildingId(building.id);
                    onSelectBuilding(building);
                  }}
                  className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer ${
                    isActiveCard
                      ? 'bg-[#fbf7f0] border-2 border-[#a8321a] ring-4 ring-[#a8321a]/15 shadow-[0_20px_50px_rgba(168,50,26,0.16)] -translate-y-0.5'
                      : 'bg-[#efe8dc]/90 hover:bg-[#f5efe6] border border-[#d6cebe] opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Card Top: Node Index, Active Radar Lock Badge & Watchlist Button */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isActiveCard
                              ? 'bg-[#a8321a] text-white'
                              : 'bg-[#dfd7c9] text-[#0b1b2d]/70'
                          }`}
                        >
                          NODE #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#0b1b2d]/70 font-bold">
                          {building.city}
                        </span>
                        <span className="text-[#0b1b2d]/30 font-bold">·</span>
                        <span className="text-[11px] font-mono text-[#0b1b2d]/70">
                          {building.coordinates?.lat.toFixed(4)}°N,{' '}
                          {building.coordinates?.lng.toFixed(4)}°E
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-[#0b1b2d] group-hover:text-[#a8321a] transition-colors leading-snug pt-0.5">
                        {building.name}
                      </h3>
                      <p className="text-xs font-mono text-[#1f3044] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#a8321a]" />
                        <span>
                          {building.location} · {building.district}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => toggleWatchlist(building.id, e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        isWatchlisted
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-[#f5efe6] border-[#d6cebe] text-[#0b1b2d]/50 hover:text-[#0b1b2d]'
                      }`}
                      title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary Plume Temperature & Thermal Debt Score Highlight */}
                  <div className="my-4 p-4 rounded-2xl bg-[#f5efe6] border border-[#d6cebe] grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#0b1b2d]/60 uppercase font-semibold">
                        Street Plume Temp
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-black font-mono text-[#a8321a]">
                          {building.streetPlumeTempCelsius}°C
                        </span>
                        <span className="text-xs font-mono text-[#9e2a14] font-bold">
                          (+{tempDelta}°C)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-[#0b1b2d]/60 uppercase font-semibold">
                        Thermal Debt Score
                      </div>
                      <div className="text-2xl font-black font-mono text-[#0b1b2d] mt-0.5">
                        {building.thermalDebtScore}
                        <span className="text-xs text-[#0b1b2d]/50 font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Concise 4-Point Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono text-[#1f3044] pt-1">
                    <div className="p-2.5 rounded-xl bg-[#efe8dc]/70 border border-[#d6cebe]/80 flex justify-between">
                      <span className="text-[#0b1b2d]/60">AC Units:</span>
                      <span className="font-bold text-[#0b1b2d]">
                        {building.detectedOutdoorUnits.splitUnits} Split /{' '}
                        {building.detectedOutdoorUnits.vrfUnits} VRF
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#efe8dc]/70 border border-[#d6cebe]/80 flex justify-between">
                      <span className="text-[#0b1b2d]/60">Heat Load:</span>
                      <span className="font-bold text-[#0b1b2d]">
                        {building.rejectedHeatKw} kW
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#efe8dc]/70 border border-[#d6cebe]/80 flex justify-between">
                      <span className="text-[#0b1b2d]/60">Vendors:</span>
                      <span className="font-bold text-[#9e2a14]">
                        {building.adjacentVulnerablePopulation.vendorsCount} workers
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#efe8dc]/70 border border-[#d6cebe]/80 flex justify-between">
                      <span className="text-[#0b1b2d]/60">Alley Width:</span>
                      <span className="font-bold text-[#0b1b2d]">
                        {building.canyonWidthMeters}m canyon
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Mitigation Status + Deep Dive Audit Action */}
                  <div className="mt-5 pt-3.5 border-t border-[#d6cebe] flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                        building.mitigationStatus === 'compliant'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : building.mitigationStatus === 'under_review'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {building.mitigationStatus === 'compliant' && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {building.mitigationStatus === 'under_review' && (
                        <Activity className="w-3.5 h-3.5" />
                      )}
                      {building.mitigationStatus === 'unmitigated' && (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span className="capitalize">
                        {building.mitigationStatus.replace('_', ' ')}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(building);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0b1b2d] hover:bg-[#1a2f47] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        <span>Open Audit File</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#efe8dc] rounded-2xl border border-[#d6cebe] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#dfd7c9] border-b border-[#d6cebe] text-[#0b1b2d] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Node Name &amp; Location</th>
                  <th className="py-3.5 px-4 font-bold">City / Ward</th>
                  <th className="py-3.5 px-4 font-bold text-right">Plume Temp</th>
                  <th className="py-3.5 px-4 font-bold text-right">Heat Rejection</th>
                  <th className="py-3.5 px-4 font-bold text-right">Thermal Debt</th>
                  <th className="py-3.5 px-4 font-bold text-right">Monthly Tax</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d6cebe] text-[#0b1b2d]">
                {filteredBuildings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => handleOpenDetail(b)}
                    className="hover:bg-[#f5efe6] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-[#0b1b2d]">
                      <div>{b.name}</div>
                      <div className="text-[11px] font-mono text-[#0b1b2d]/60 font-normal">
                        {b.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1f3044]">
                      <div className="font-semibold">{b.city}</div>
                      <div className="text-[10px] text-[#0b1b2d]/60">{b.district}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-[#a8321a]">
                        {b.streetPlumeTempCelsius}°C
                      </span>
                      <span className="text-[10px] text-[#9e2a14] block font-semibold">
                        (+
                        {(
                          b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius
                        ).toFixed(1)}
                        °C)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold">
                      {b.rejectedHeatKw} kW
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#a8321a]">
                      {b.thermalDebtScore}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#047857]">
                      ₹{b.monthlyExhaustTaxInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        {b.mitigationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#a8321a]">
                      Inspect →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overview Grid View */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuildings.map((b) => (
            <div
              key={b.id}
              onClick={() => handleOpenDetail(b)}
              className="bg-[#efe8dc] hover:bg-[#f5efe6] border border-[#d6cebe] hover:border-[#b8ad9d] rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-[#0b1b2d]/60 font-bold uppercase">
                  {b.city} · {b.district}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                  Debt {b.thermalDebtScore}/100
                </span>
              </div>
              <div className="my-3">
                <div className="text-base font-bold text-[#0b1b2d]">{b.name}</div>
                <div className="text-xl font-mono font-black text-[#a8321a] mt-1">
                  {b.streetPlumeTempCelsius}°C Plume
                </div>
              </div>
              <div className="text-xs font-mono text-[#0b1b2d]/70 flex justify-between pt-2 border-t border-[#d6cebe]">
                <span>{b.adjacentVulnerablePopulation.vendorsCount} vendors</span>
                <span>{b.canyonWidthMeters}m canyon</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deep-Dive Slide-Over Detail Drawer when zoneId is active (URL is /grid/:zoneId) */}
      {activeDetailBuilding && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-[#f5efe6] border-l border-[#d6cebe] h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between text-[#0b1b2d]">
            <div className="space-y-6">
              {/* Header & Close Button */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#d6cebe]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                      Audit File: {activeDetailBuilding.id}
                    </span>
                    <span className="text-[#0b1b2d]/40 font-bold">·</span>
                    <span className="text-xs font-mono text-[#0b1b2d]/70">
                      {activeDetailBuilding.city} ({activeDetailBuilding.district})
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#0b1b2d]">
                    {activeDetailBuilding.name}
                  </h2>
                  <p className="text-xs text-[#1f3044] font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#a8321a]" />
                    <span>{activeDetailBuilding.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseDetail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] text-xs font-mono font-bold transition-colors cursor-pointer shadow-sm"
                    title="Return to Grid list"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#a8321a]" />
                    <span>Return to Grid</span>
                  </button>
                  <button
                    onClick={handleCloseDetail}
                    className="p-2 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] text-[#0b1b2d] border border-[#d6cebe] transition-colors cursor-pointer"
                    title="Close Inspector"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Temperature Delta Hero Banner */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#efe8dc] border border-[#d6cebe]">
                <div>
                  <div className="text-[10px] font-mono text-[#0b1b2d]/60 uppercase font-semibold">
                    Ambient Baseline
                  </div>
                  <div className="text-lg font-black font-mono text-[#0b1b2d]">
                    {activeDetailBuilding.ambientBaselineTempCelsius}°C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#0b1b2d]/60 uppercase font-semibold">
                    Street Plume Temp
                  </div>
                  <div className="text-2xl font-black font-mono text-[#a8321a]">
                    {activeDetailBuilding.streetPlumeTempCelsius}°C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#0b1b2d]/60 uppercase font-semibold">
                    Satellite Landsat TIR
                  </div>
                  <div className="text-lg font-black font-mono text-[#a8321a]">
                    {activeDetailBuilding.satelliteTirTempCelsius || 43.5}°C
                  </div>
                </div>
              </div>

              {/* Detected AC Units & Power Rejection */}
              <div className="bg-[#efe8dc] p-5 rounded-xl border border-[#d6cebe] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0b1b2d] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#a8321a]" />
                  <span>Computer Vision Façade Ingestion</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#f5efe6] border border-[#d6cebe]">
                    <span className="text-[#0b1b2d]/60 block text-[10px] font-semibold">
                      Split Outdoor ACs
                    </span>
                    <span className="text-base font-bold text-[#0b1b2d]">
                      {activeDetailBuilding.detectedOutdoorUnits.splitUnits} units
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5efe6] border border-[#d6cebe]">
                    <span className="text-[#0b1b2d]/60 block text-[10px] font-semibold">
                      VRF Heat Exchangers
                    </span>
                    <span className="text-base font-bold text-[#0b1b2d]">
                      {activeDetailBuilding.detectedOutdoorUnits.vrfUnits} banks
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5efe6] border border-[#d6cebe]">
                    <span className="text-[#0b1b2d]/60 block text-[10px] font-semibold">
                      Chiller Towers
                    </span>
                    <span className="text-base font-bold text-[#0b1b2d]">
                      {activeDetailBuilding.detectedOutdoorUnits.chillerTowers} towers
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between text-xs font-mono text-[#0b1b2d] border-t border-[#d6cebe]">
                  <span className="text-[#0b1b2d]/70 font-semibold">
                    Total Cooling Capacity:
                  </span>
                  <span className="font-bold text-[#a8321a]">
                    {activeDetailBuilding.totalCoolingTonnageTR} TR (~
                    {activeDetailBuilding.rejectedHeatKw} kW waste heat)
                  </span>
                </div>
              </div>

              {/* Human Collateral & Street Vendors Impact */}
              <div className="bg-[#efe8dc] p-5 rounded-xl border border-[#d6cebe] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9e2a14] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#9e2a14]" />
                  <span>Human Collateral &amp; Street Level Vulnerability</span>
                </h4>
                <p className="text-xs text-[#1f3044] leading-relaxed">
                  Narrow street canyon width of {activeDetailBuilding.canyonWidthMeters}{' '}
                  meters causes thermal trapping with H/W ratio exceeding threshold,
                  reflecting heat between asphalt and masonry.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-lg bg-[#f5efe6] border border-[#d6cebe] text-center">
                    <div className="text-[10px] text-[#0b1b2d]/60 font-semibold">
                      Exposed Vendors
                    </div>
                    <div className="text-base font-black text-[#9e2a14]">
                      {activeDetailBuilding.adjacentVulnerablePopulation.vendorsCount}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5efe6] border border-[#d6cebe] text-center">
                    <div className="text-[10px] text-[#0b1b2d]/60 font-semibold">
                      Informal Residents
                    </div>
                    <div className="text-base font-black text-[#0b1b2d]">
                      {
                        activeDetailBuilding.adjacentVulnerablePopulation
                          .informalSettlementDwellers
                      }
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5efe6] border border-[#d6cebe] text-center">
                    <div className="text-[10px] text-[#0b1b2d]/60 font-semibold">
                      Daily Footfall
                    </div>
                    <div className="text-base font-black text-[#0b1b2d]">
                      {
                        activeDetailBuilding.adjacentVulnerablePopulation
                          .dailyPedestrianFootfall
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Section 133 CrPC Municipal Surcharge */}
              <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-900 font-bold uppercase">
                    Section 133 Thermal Surcharge Assessment
                  </span>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">
                    CrPC Public Nuisance
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-[#1f3044]">
                    Calculated Monthly Exhaust Tax:
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-800">
                    ₹{activeDetailBuilding.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="text-[11px] text-[#1f3044] space-y-1 pt-2 border-t border-emerald-200">
                  <div className="font-bold text-[#0b1b2d]">Prescribed Interventions:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#1f3044]">
                    {activeDetailBuilding.recommendedInterventions.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons to cross-navigate to other endpoints */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono text-[#0b1b2d]/60 uppercase font-bold">
                  Connected Scientific &amp; Digital Twin Views
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                  <button
                    onClick={() => navigate('/twin')}
                    className="p-3 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Launch 3D CFD Twin</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#a8321a]" />
                  </button>
                  <button
                    onClick={() => navigate('/scanner')}
                    className="p-3 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>AI Façade Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#a8321a]" />
                  </button>
                  <button
                    onClick={() => navigate('/ledger')}
                    className="p-3 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Municipal Debt Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                  </button>
                  <button
                    onClick={() => navigate('/watchlist')}
                    className="p-3 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Add to Watchlist</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9e2a14]" />
                  </button>
                </div>
              </div>

              {/* Mitigation Action Button */}
              <div className="pt-6 border-t border-[#d6cebe] flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    onApplyMitigation(
                      activeDetailBuilding.id,
                      '45° Upward Deflection Louvers + Pedestrian Mist Line'
                    )
                  }
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Enforce Municipal Mitigation</span>
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="py-3 px-4 rounded-xl bg-[#efe8dc] hover:bg-[#e4dcce] border border-[#d6cebe] text-[#0b1b2d] text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
