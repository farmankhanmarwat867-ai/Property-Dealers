import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PropertyFilterSidebar } from '../../components/public/PropertyFilterSidebar';
import { PropertyCard } from '../../components/common/PropertyCard';
import { EmptyState } from '../../components/common/EmptyState';
import { FilterState, Property } from '../../types';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Home,
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const { properties, favorites } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(9);

  // Parse filters from URL or default
  const [filters, setFilters] = useState<FilterState>(() => {
    const purposeParam = searchParams.get('purpose') as any;
    const typeParam = searchParams.get('type') as any;
    const locationParam = searchParams.get('location') || '';
    const queryParam = searchParams.get('q') || '';
    const filterType = searchParams.get('filter');

    return {
      searchQuery: queryParam,
      purpose: purposeParam && ['sale', 'rent'].includes(purposeParam) ? purposeParam : 'all',
      type: typeParam && ['house', 'plot', 'apartment', 'commercial', 'portion'].includes(typeParam) ? typeParam : 'all',
      location: locationParam,
      minPrice: 0,
      maxPrice: Infinity,
      minArea: 0,
      maxArea: Infinity,
      bedrooms: 'all',
      bathrooms: 'all',
      verifiedOnly: false,
      sortBy: 'newest',
    };
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setVisibleCount(9);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      purpose: 'all',
      type: 'all',
      location: '',
      minPrice: 0,
      maxPrice: Infinity,
      minArea: 0,
      maxArea: Infinity,
      bedrooms: 'all',
      bathrooms: 'all',
      verifiedOnly: false,
      sortBy: 'newest',
    });
    setSearchParams({});
    setVisibleCount(9);
  };

  // Filter & Sort properties
  const filteredProperties = useMemo(() => {
    const isSavedOnly = searchParams.get('filter') === 'saved';

    return properties.filter((p) => {
      // Saved filter
      if (isSavedOnly && !favorites.includes(p.id)) return false;

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLocation = p.location.area.toLowerCase().includes(q) || p.location.address.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesDesc) return false;
      }

      // Purpose
      if (filters.purpose !== 'all' && p.purpose !== filters.purpose) return false;

      // Type
      if (filters.type !== 'all' && p.type !== filters.type) return false;

      // Location
      if (filters.location && !p.location.area.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Price
      if (p.price < filters.minPrice) return false;
      if (filters.maxPrice !== Infinity && p.price > filters.maxPrice) return false;

      // Area
      if (p.areaValue < filters.minArea) return false;
      if (filters.maxArea !== Infinity && p.areaValue > filters.maxArea) return false;

      // Bedrooms
      if (filters.bedrooms !== 'all') {
        if (!p.bedrooms || p.bedrooms < Number(filters.bedrooms)) return false;
      }

      // Verified
      if (filters.verifiedOnly && !p.verified) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'area-desc') return b.areaValue - a.areaValue;
      if (filters.sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    });
  }, [properties, filters, searchParams, favorites]);

  const displayedProperties = filteredProperties.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Peshawar Real Estate Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {searchParams.get('filter') === 'saved'
              ? 'Saved / Favorite Properties'
              : 'Properties for Sale & Rent in Peshawar'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredProperties.length} verified listings across Peshawar sectors.
          </p>
        </div>

        {/* Search input in banner */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords (e.g. 10 Marla, DHA)..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
            className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>
      </div>

      {/* Main Layout: Filters (Left) + Results (Right) */}
      <div className="flex items-start gap-8">
        {/* Desktop Filter Sidebar & Mobile Drawer */}
        <PropertyFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
          totalResultsCount={filteredProperties.length}
        />

        {/* Results Container */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Controls Bar (Mobile Filter Toggle, Sort, View Mode) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters ({Object.values(filters).filter(Boolean).length})
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
              <span>Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-hidden"
              >
                <option value="newest">Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Largest First</option>
                <option value="popular">Most Viewed</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Property Cards Grid */}
          {displayedProperties.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No Matching Properties Found"
              description="We couldn't find properties matching your exact criteria in Peshawar. Try resetting filters or adjusting budget."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {displayedProperties.length < filteredProperties.length && (
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Load More Properties ({filteredProperties.length - displayedProperties.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
