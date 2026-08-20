import React from 'react';
import { FilterState } from '../../types';
import { PESHAWAR_LOCATIONS } from '../../data/mockData';
import { Filter, X, RotateCcw, Check } from 'lucide-react';

interface PropertyFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalResultsCount: number;
}

export const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
  totalResultsCount,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-900" />
          <h3 className="text-sm font-bold text-slate-900">Filter Properties</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Purpose
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['all', 'sale', 'rent'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onFilterChange({ purpose: p })}
              className={`py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                filters.purpose === p
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === 'all' ? 'All' : p === 'sale' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Property Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'house', label: 'House / Bungalow' },
            { id: 'plot', label: 'Plot / Land' },
            { id: 'apartment', label: 'Apartment' },
            { id: 'commercial', label: 'Commercial' },
            { id: 'portion', label: 'Portion' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange({ type: item.id as any })}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition ${
                filters.type === item.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Peshawar Location */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Peshawar Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
        >
          <option value="">All Locations in Peshawar</option>
          {PESHAWAR_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Price Range (PKR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">Min Price</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) || 0 })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-hidden"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">Max Price</span>
            <input
              type="number"
              placeholder="Any"
              value={filters.maxPrice === Infinity ? '' : filters.maxPrice}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : Infinity,
                })
              }
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Area in Marla */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Area Size (Marla)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Marla"
            value={filters.minArea || ''}
            onChange={(e) => onFilterChange({ minArea: Number(e.target.value) || 0 })}
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-hidden"
          />
          <input
            type="number"
            placeholder="Max Marla"
            value={filters.maxArea === Infinity ? '' : filters.maxArea}
            onChange={(e) =>
              onFilterChange({
                maxArea: e.target.value ? Number(e.target.value) : Infinity,
              })
            }
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-hidden"
          />
        </div>
      </div>

      {/* Bedrooms */}
      {filters.type !== 'plot' && filters.type !== 'commercial' && (
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Bedrooms
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 2, 3, 4, 5, 6] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onFilterChange({ bedrooms: b })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                  filters.bedrooms === b
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {b === 'all' ? 'Any' : `${b}+`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verified Only Toggle */}
      <div className="pt-2 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-800">Verified Listings Only</span>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
            className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Panel */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit sticky top-28">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Filters</h3>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Show {totalResultsCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
