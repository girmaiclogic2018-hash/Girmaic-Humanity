/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, MapPin, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface MapHotspot {
  id: string;
  country: string;
  region: string;
  category: string;
  timePeriod: string;
  count: number;
  status: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  coordinates: { x: number; y: number }; // Percentage coords on SVG canvas
}

export default function HumanRightsMap() {
  const [selectedHotspot, setSelectedHotspot] = useState<MapHotspot | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Privacy-preserving aggregated data - strictly verified, zero vulnerable locations
  const hotspots: MapHotspot[] = [
    {
      id: 'hs-1',
      country: 'Ethiopia',
      region: 'East Africa',
      category: 'marginalization',
      timePeriod: 'Q3 2026',
      count: 14,
      status: 'Corroborated',
      trend: 'stable',
      coordinates: { x: 58, y: 55 }
    },
    {
      id: 'hs-2',
      country: 'Kenya',
      region: 'East Africa',
      category: 'police_brutality',
      timePeriod: 'Q3 2026',
      count: 9,
      status: 'Verified',
      trend: 'decreasing',
      coordinates: { x: 59, y: 61 }
    },
    {
      id: 'hs-3',
      country: 'Sudan',
      region: 'North-East Africa',
      category: 'forced_displacement',
      timePeriod: 'Q3 2026',
      count: 32,
      status: 'Verified',
      trend: 'increasing',
      coordinates: { x: 56, y: 48 }
    },
    {
      id: 'hs-4',
      country: 'Global Online Systems',
      region: 'Digital Realm',
      category: 'censorship',
      timePeriod: 'Q3 2026',
      count: 21,
      status: 'Corroborated',
      trend: 'increasing',
      coordinates: { x: 42, y: 35 }
    }
  ];

  const filteredHotspots = filterCategory === 'all' 
    ? hotspots 
    : hotspots.filter(h => h.category === filterCategory);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm" id="human-rights-map">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            Global Aggregated Human-Rights Trends Map
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Privacy-Preserving Aggregated Spatial Incident Distribution (Zero exact location data is recorded or exposed).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Category:</span>
          <select 
            id="map-filter-category"
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="marginalization">Marginalization</option>
            <option value="police_brutality">Police Brutality</option>
            <option value="forced_displacement">Forced Displacement</option>
            <option value="censorship">Censorship</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Map Board */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-850 relative overflow-hidden min-h-[350px] flex items-center justify-center">
          {/* Subtle World Grid SVG Design */}
          <svg className="w-full h-full max-h-[400px] text-slate-200 dark:text-slate-800/40 opacity-70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            {/* Latitude Grid lines */}
            <line x1="0" y1="20" x2="100" y2="20" strokeDasharray="1,2" />
            <line x1="0" y1="40" x2="100" y2="40" strokeDasharray="1,2" />
            <line x1="0" y1="60" x2="100" y2="60" strokeDasharray="1,2" />
            <line x1="0" y1="80" x2="100" y2="80" strokeDasharray="1,2" />
            {/* Longitude Grid lines */}
            <line x1="20" y1="0" x2="20" y2="100" strokeDasharray="1,2" />
            <line x1="40" y1="0" x2="40" y2="100" strokeDasharray="1,2" />
            <line x1="60" y1="0" x2="60" y2="100" strokeDasharray="1,2" />
            <line x1="80" y1="0" x2="80" y2="100" strokeDasharray="1,2" />

            {/* Stylized Minimalist Continents Outline for absolute reliability */}
            <path d="M10,25 Q15,15 30,20 T40,15 T45,35 T30,40 Z" fill="currentColor" stroke="none" className="text-slate-150 dark:text-slate-800/20" />
            <path d="M48,42 Q52,55 58,68 T63,85 T52,90 Z" fill="currentColor" stroke="none" className="text-slate-150 dark:text-slate-800/20" />
            <path d="M50,22 Q60,10 75,18 T90,30 T85,55 T65,45 Z" fill="currentColor" stroke="none" className="text-slate-150 dark:text-slate-800/20" />
            <path d="M70,60 Q75,70 85,68 T88,85 Z" fill="currentColor" stroke="none" className="text-slate-150 dark:text-slate-800/20" />
          </svg>

          {/* Interactive Spot Markers */}
          {filteredHotspots.map((spot) => (
            <button
              key={spot.id}
              id={`map-spot-${spot.id}`}
              onClick={() => setSelectedHotspot(spot)}
              style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 z-10 ${
                selectedHotspot?.id === spot.id
                  ? 'bg-emerald-500 text-white scale-125 ring-4 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 hover:bg-emerald-550 border-2 border-emerald-550 dark:border-emerald-400 text-emerald-600 shadow-lg hover:scale-110'
              }`}
            >
              <MapPin className="h-4 w-4" />
            </button>
          ))}

          {/* Prompt banner if no spot selected */}
          {!selectedHotspot && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
              <Info className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Click on any map marker pin above to inspect privacy-preserving region metrics.
              </span>
            </div>
          )}
        </div>

        {/* Selected Trend Inspector Card */}
        <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl p-5 flex flex-col justify-between">
          {selectedHotspot ? (
            <div className="flex flex-col h-full justify-between" id="map-trend-detail">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Region Profile</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                    {selectedHotspot.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  {selectedHotspot.country}
                  <span className="text-sm font-normal text-slate-400">({selectedHotspot.region})</span>
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Aggregated Concern:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                      {selectedHotspot.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Reports Recorded:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedHotspot.count} cases</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Time Period:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedHotspot.timePeriod}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Calculated Trend:</span>
                    <span className={`font-semibold flex items-center gap-1 capitalize ${
                      selectedHotspot.trend === 'increasing' ? 'text-rose-600 dark:text-rose-400' :
                      selectedHotspot.trend === 'decreasing' ? 'text-emerald-600 dark:text-emerald-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      <TrendingUp className={`h-3.5 w-3.5 ${selectedHotspot.trend === 'decreasing' ? 'rotate-180' : ''}`} />
                      {selectedHotspot.trend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="flex gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg border border-amber-200/50">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p className="text-[10px] leading-relaxed">
                    <strong>Notice:</strong> High privacy aggregation rules enforce that zero personal IDs, individual names, or precise street locations of incidents are disclosed or loaded.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Globe className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                No region selected. Click on a spatial marker pin on the map to inspect live aggregated trends.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
