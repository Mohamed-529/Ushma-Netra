import React from 'react';
import { ActiveTab } from '../types';
import { Flame, Play } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onSimulateSurge: () => void;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onSimulateSurge,
}) => {
  return (
    <header className="w-full bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Flame className="w-4 h-4 text-slate-950 fill-current" />
          </div>
          <button
            onClick={() => onTabChange('3d_twin')}
            className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ushma-Netra
          </button>
        </div>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => onTabChange('3d_twin')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === '3d_twin'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Thermal Twin
          </button>

          <button
            onClick={() => onTabChange('cv_scanner')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'cv_scanner'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Facade Scanner
          </button>

          <button
            onClick={() => onTabChange('thermal_debt')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'thermal_debt'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Thermal Debt Ledger
          </button>

          <button
            onClick={() => onTabChange('vendor_iot')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'vendor_iot'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vendor IoT Beacon
          </button>

          <button
            onClick={() => onTabChange('aws_architecture')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'aws_architecture'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AWS Architecture
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSimulateSurge}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-sm shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Peak Surge</span>
          </button>
        </div>
      </div>
    </header>
  );
};
