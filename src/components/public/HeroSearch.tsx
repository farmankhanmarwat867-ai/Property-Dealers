import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PESHAWAR_LOCATIONS } from '../../data/mockData';
import { Search, MapPin, Home, Tag } from 'lucide-react';

interface HeroSearchProps {
  initialPurpose?: 'sale' | 'rent';
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ initialPurpose = 'sale' }) => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<'sale' | 'rent'>(initialPurpose);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('purpose', purpose);
    if (location) params.set('location', location);
    if (propertyType !== 'all') params.set('type', propertyType);
    if (priceRange !== 'all') params.set('priceRange', priceRange);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div
      id="hero-search-box"
      className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 max-w-4xl w-full mx-auto"
    >
      {/* Purpose Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setPurpose('sale')}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            purpose === 'sale'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Buy Property
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            purpose === 'rent'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Rent Property
        </button>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Location */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Location in Peshawar
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden appearance-none"
            >
              <option value="">All Peshawar Locations</option>
              {PESHAWAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Property Type
          </label>
          <div className="relative">
            <Home className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden appearance-none"
            >
              <option value="all">All Types</option>
              <option value="house">Houses & Bungalows</option>
              <option value="plot">Residential Plots</option>
              <option value="apartment">Luxury Apartments</option>
              <option value="commercial">Commercial Plazas / Shops</option>
              <option value="portion">Upper / Lower Portions</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Budget (PKR)
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden appearance-none"
            >
              <option value="all">Any Budget</option>
              {purpose === 'sale' ? (
                <>
                  <option value="under-1cr">Under Rs. 1 Crore</option>
                  <option value="1cr-2.5cr">Rs. 1.0 - 2.5 Crore</option>
                  <option value="2.5cr-5cr">Rs. 2.5 - 5.0 Crore</option>
                  <option value="5cr-plus">Rs. 5.0 Crore & Above</option>
                </>
              ) : (
                <>
                  <option value="under-50k">Under Rs. 50,000 / mo</option>
                  <option value="50k-100k">Rs. 50,000 - 1.0 Lac / mo</option>
                  <option value="100k-200k">Rs. 1.0 - 2.0 Lac / mo</option>
                  <option value="200k-plus">Rs. 2.0 Lac & Above</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
};
