import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BuildingAudit, VendorTelemetry } from '../types';
import {
  Search,
  Filter,
  MapPin,
  Flame,
  AlertTriangle,
  ShieldCheck,
  Download,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Thermometer,
  Wind,
  FileSpreadsheet,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  Radio,
  FileText,
  ArrowLeft,
  Home
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
  vendors,
}) => {
  const { zoneId } = useParams<{ zoneId?: string }>();
  const navigate = useNavigate();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'map'>('grid');
  const [minHeatDebt, setMinHeatDebt] = useState<number>(0);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ushma_watchlist') || '["del-ln-vikas", "del-np-devika"]');
    } catch {
      return ['del-ln-vikas', 'del-np-devika'];
    }
  });

  // Toggle watchlist
  const toggleWatchlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlistIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
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

  // Cities list
  const cities = ['All', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Ahmedabad'];

  // Export GeoJSON
  const handleExportGeoJSON = () => {
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
          temperatureDeltaCelsius: (b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1),
          rejectedHeatKw: b.rejectedHeatKw,
          coolingTonnageTR: b.totalCoolingTonnageTR,
          monthlyExhaustTaxInr: b.monthlyExhaustTaxInr,
          vulnerableVendorsCount: b.adjacentVulnerablePopulation.vendorsCount,
          mitigationStatus: b.mitigationStatus,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ushma-netra-thermal-grid-${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
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
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ushma-netra-thermal-nodes-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Open detail
  const handleOpenDetail = (b: BuildingAudit) => {
    onSelectBuilding(b);
    navigate(`/grid/${b.id}`);
  };

  const handleCloseDetail = () => {
    navigate('/grid');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-750 text-xs font-mono font-medium transition-all cursor-pointer shadow-sm group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors"
            title="Return to Home Overview"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Overview</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-amber-400 font-semibold">Thermal Grid Registry</span>
          {activeDetailBuilding && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-zinc-200 truncate">{activeDetailBuilding.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* Hero Headline & Key Statistics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
              National Registry
            </span>
            <span className="text-zinc-500 text-xs font-mono">·</span>
            <span className="text-zinc-400 text-xs font-mono">
              Urban Street Canyon Heat Island Ingestion
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Thermal Grid & Exhaust Zone Registry
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Continuously tracking commercial HVAC outdoor condenser clusters dumping 45°C–56°C exhaust heat into narrow pedestrian right-of-ways across Indian metro urban canopies.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 shrink-0">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Monitored Nodes</div>
            <div className="text-lg font-black font-mono text-zinc-100">{buildings.length}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Total Rejection</div>
            <div className="text-lg font-black font-mono text-amber-400">
              {(buildings.reduce((sum, b) => sum + b.rejectedHeatKw, 0) / 1000).toFixed(2)} MW
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Vulnerable Vendors</div>
            <div className="text-lg font-black font-mono text-rose-400">
              {buildings.reduce((sum, b) => sum + b.adjacentVulnerablePopulation.vendorsCount, 0)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Monthly Tax</div>
            <div className="text-lg font-black font-mono text-emerald-400">
              ₹{(buildings.reduce((sum, b) => sum + b.monthlyExhaustTaxInr, 0) / 100000).toFixed(1)}L
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Export Buttons */}
      <div className="space-y-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by building name, market, street or ward (e.g. Nehru Place, Laxmi Nagar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle + Export Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-zinc-800 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-zinc-800 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-zinc-800 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Spatial Map
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={handleExportGeoJSON}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download open GeoJSON format"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>GeoJSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download CSV audit data"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Pills: City & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800/60 text-xs">
          {/* City Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 font-mono text-[11px] mr-1.5">City:</span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                  selectedCity === city
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 font-mono text-[11px] mr-1.5">Mitigation:</span>
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
                    ? 'bg-zinc-800 border border-zinc-700 text-white font-bold'
                    : 'bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Listing Viewport */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuildings.map((building) => {
            const tempDelta = (
              building.streetPlumeTempCelsius - building.ambientBaselineTempCelsius
            ).toFixed(1);
            const isWatchlisted = watchlistIds.includes(building.id);
            const isCritical = building.thermalDebtScore >= 85;

            return (
              <div
                key={building.id}
                onClick={() => handleOpenDetail(building)}
                className="group relative bg-[#0d0d12] hover:bg-[#12121a] rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 p-5 transition-all cursor-pointer shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                {/* Card Top: Badges & Watchlist Button */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                          {building.city}
                        </span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {building.district || building.location}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                        {building.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => toggleWatchlist(building.id, e)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isWatchlisted
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Temperature Anomaly Visual Tag */}
                  <div className="my-3.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">
                        Street Plume Temp
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black font-mono text-amber-400">
                          {building.streetPlumeTempCelsius}°C
                        </span>
                        <span className="text-xs font-mono text-red-400 font-bold">
                          (+{tempDelta}°C)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">
                        Thermal Debt
                      </div>
                      <div
                        className={`text-xl font-black font-mono ${
                          isCritical ? 'text-red-400' : 'text-amber-400'
                        }`}
                      >
                        {building.thermalDebtScore}
                        <span className="text-xs text-zinc-600 font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Spec Matrix */}
                  <div className="space-y-2 text-xs font-mono text-zinc-400 border-t border-zinc-900 pt-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Outdoor Units:</span>
                      <span className="text-zinc-200">
                        {building.detectedOutdoorUnits.splitUnits} Splits /{' '}
                        {building.detectedOutdoorUnits.vrfUnits} VRFs
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Rejected Heat:</span>
                      <span className="text-zinc-200 font-semibold">
                        {building.rejectedHeatKw} kW ({building.totalCoolingTonnageTR} TR)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Exposed Vendors:</span>
                      <span className="text-rose-400 font-bold">
                        {building.adjacentVulnerablePopulation.vendorsCount} workers
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Canyon Aspect:</span>
                      <span className="text-zinc-200">
                        {building.canyonWidthMeters}m narrow alley
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Status & Deep Dive Link */}
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        building.mitigationStatus === 'compliant'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : building.mitigationStatus === 'under_review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {building.mitigationStatus === 'compliant' && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {building.mitigationStatus === 'under_review' && (
                        <Activity className="w-3 h-3" />
                      )}
                      {building.mitigationStatus === 'unmitigated' && (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span className="capitalize">{building.mitigationStatus.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <span className="text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    <span>Audit File</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#0c0c12] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Node Name & Location</th>
                  <th className="py-3.5 px-4 font-bold">City / Ward</th>
                  <th className="py-3.5 px-4 font-bold text-right">Plume Temp</th>
                  <th className="py-3.5 px-4 font-bold text-right">Heat Rejection</th>
                  <th className="py-3.5 px-4 font-bold text-right">Thermal Debt</th>
                  <th className="py-3.5 px-4 font-bold text-right">Monthly Tax</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredBuildings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => handleOpenDetail(b)}
                    className="hover:bg-zinc-900/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-white">
                      <div>{b.name}</div>
                      <div className="text-[11px] font-mono text-zinc-500 font-normal">
                        {b.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      <div>{b.city}</div>
                      <div className="text-[10px] text-zinc-600">{b.district}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-amber-400">{b.streetPlumeTempCelsius}°C</span>
                      <span className="text-[10px] text-red-400 block font-semibold">
                        (+{(b.streetPlumeTempCelsius - b.ambientBaselineTempCelsius).toFixed(1)}°C)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-zinc-200">{b.rejectedHeatKw} kW</span>
                      <span className="text-[10px] text-zinc-500 block">{b.totalCoolingTonnageTR} TR</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-black ${
                          b.thermalDebtScore >= 85 ? 'text-red-400' : 'text-amber-400'
                        }`}
                      >
                        {b.thermalDebtScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      ₹{b.monthlyExhaustTaxInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.mitigationStatus === 'compliant'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : b.mitigationStatus === 'under_review'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {b.mitigationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(b);
                        }}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spatial Map View */}
      {viewMode === 'map' && (
        <div className="bg-[#0b0b10] rounded-2xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Spatial Urban Canopy Thermal Scatter</h3>
              <p className="text-xs text-zinc-400">
                Interactive spatial coordinates showing micro-canyon thermal traps across coordinates.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-zinc-400">Lethal &gt;50°C</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-zinc-400">Severe 45-50°C</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Mitigated &lt;42°C</span>
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full h-96 bg-zinc-950 rounded-xl border border-zinc-800/80 relative overflow-hidden flex items-center justify-center p-6">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full overflow-y-auto p-4 z-10">
              {filteredBuildings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleOpenDetail(b)}
                  className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{b.city}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        b.streetPlumeTempCelsius >= 50
                          ? 'bg-red-500 animate-ping'
                          : b.streetPlumeTempCelsius >= 45
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate">{b.name}</div>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                      {b.streetPlumeTempCelsius}°C
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 flex justify-between pt-1 border-t border-zinc-800">
                    <span>{b.adjacentVulnerablePopulation.vendorsCount} vendors</span>
                    <span>{b.canyonWidthMeters}m canyon</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deep-Dive Slide-Over Detail Drawer when zoneId is active (URL is /grid/:zoneId) */}
      {activeDetailBuilding && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-[#0d0d14] border-l border-zinc-800 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header & Close Button */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Audit File: {activeDetailBuilding.id}
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeDetailBuilding.city} ({activeDetailBuilding.district})
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{activeDetailBuilding.name}</h2>
                  <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeDetailBuilding.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseDetail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-700 text-xs font-mono font-medium transition-colors cursor-pointer shadow-sm"
                    title="Return to Grid list"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Grid</span>
                  </button>
                  <button
                    onClick={handleCloseDetail}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    title="Close Inspector"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Temperature Delta Hero Banner */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    Ambient Baseline
                  </div>
                  <div className="text-lg font-black font-mono text-zinc-300">
                    {activeDetailBuilding.ambientBaselineTempCelsius}°C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    Street Plume Temp
                  </div>
                  <div className="text-2xl font-black font-mono text-red-400">
                    {activeDetailBuilding.streetPlumeTempCelsius}°C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    Satellite Landsat TIR
                  </div>
                  <div className="text-lg font-black font-mono text-amber-300">
                    {activeDetailBuilding.satelliteTirTempCelsius || 43.5}°C
                  </div>
                </div>
              </div>

              {/* Detected AC Units & Power Rejection */}
              <div className="bg-zinc-950/80 p-5 rounded-xl border border-zinc-800/80 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Computer Vision Façade Ingestion</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Split Outdoor ACs</span>
                    <span className="text-base font-bold text-white">
                      {activeDetailBuilding.detectedOutdoorUnits.splitUnits} units
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">VRF Heat Exchangers</span>
                    <span className="text-base font-bold text-white">
                      {activeDetailBuilding.detectedOutdoorUnits.vrfUnits} banks
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Chiller Towers</span>
                    <span className="text-base font-bold text-white">
                      {activeDetailBuilding.detectedOutdoorUnits.chillerTowers} towers
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between text-xs font-mono text-zinc-300 border-t border-zinc-900">
                  <span className="text-zinc-500">Total Cooling Capacity:</span>
                  <span className="font-bold text-amber-400">
                    {activeDetailBuilding.totalCoolingTonnageTR} TR (~{activeDetailBuilding.rejectedHeatKw} kW waste heat)
                  </span>
                </div>
              </div>

              {/* Human Collateral & Street Vendors Impact */}
              <div className="bg-zinc-950/80 p-5 rounded-xl border border-zinc-800/80 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Human Collateral & Street Level Vulnerability</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Narrow street canyon width of {activeDetailBuilding.canyonWidthMeters} meters causes thermal trapping with H/W ratio exceeding threshold, reflecting heat between asphalt and masonry.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                  <div className="p-2 rounded bg-zinc-900 text-center">
                    <div className="text-[10px] text-zinc-500">Exposed Vendors</div>
                    <div className="text-base font-black text-rose-400">
                      {activeDetailBuilding.adjacentVulnerablePopulation.vendorsCount}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 text-center">
                    <div className="text-[10px] text-zinc-500">Informal Residents</div>
                    <div className="text-base font-black text-zinc-200">
                      {activeDetailBuilding.adjacentVulnerablePopulation.informalSettlementDwellers}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 text-center">
                    <div className="text-[10px] text-zinc-500">Daily Footfall</div>
                    <div className="text-base font-black text-zinc-200">
                      {activeDetailBuilding.adjacentVulnerablePopulation.dailyPedestrianFootfall}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Section 133 CrPC Municipal Surcharge */}
              <div className="bg-gradient-to-br from-emerald-950/20 to-zinc-950 p-5 rounded-xl border border-emerald-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                    Section 133 Thermal Surcharge Assessment
                  </span>
                  <span className="text-xs font-mono text-zinc-500">CrPC Public Nuisance</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-zinc-400">Calculated Monthly Exhaust Tax:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ₹{activeDetailBuilding.monthlyExhaustTaxInr.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 space-y-1 pt-2 border-t border-zinc-900">
                  <div className="font-semibold text-zinc-300">Prescribed Interventions:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-zinc-400">
                    {activeDetailBuilding.recommendedInterventions.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons to cross-navigate to other endpoints */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">
                  Connected Scientific & Digital Twin Views
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    onClick={() => navigate('/twin')}
                    className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Launch 3D CFD Twin</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => navigate('/scanner')}
                    className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>AI Façade Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => navigate('/ledger')}
                    className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Municipal Debt Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => navigate('/watchlist')}
                    className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Add to Watchlist</span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mitigation Action Button */}
            <div className="pt-6 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() =>
                  onApplyMitigation(
                    activeDetailBuilding.id,
                    '45° Upward Deflection Louvers + Pedestrian Mist Line'
                  )
                }
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 fill-current text-zinc-950" />
                <span>Enforce Municipal Mitigation</span>
              </button>
              <button
                onClick={handleCloseDetail}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
