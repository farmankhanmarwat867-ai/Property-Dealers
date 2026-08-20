import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Property, PropertyStatus } from '../../types';
import { PESHAWAR_LOCATIONS } from '../../data/mockData';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Tag,
  Building,
  CheckCircle,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

export const PropertiesListPage: React.FC = () => {
  const { properties, deleteProperty, updatePropertyStatus } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.location.area.toLowerCase().includes(q);
        const matchesOwner = p.ownerName.toLowerCase().includes(q) || p.ownerPhone.includes(q);
        if (!matchesTitle && !matchesLoc && !matchesOwner) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (purposeFilter !== 'all' && p.purpose !== purposeFilter) return false;
      if (locationFilter && !p.location.area.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      return true;
    });
  }, [properties, searchQuery, statusFilter, purposeFilter, locationFilter]);

  // Inventory stats
  const availableCount = properties.filter((p) => p.status === 'available').length;
  const underTokenCount = properties.filter((p) => p.status === 'under_token').length;
  const soldCount = properties.filter((p) => p.status === 'sold').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Peshawar Property Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, verify, and update real estate listings across Peshawar sectors.
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {/* Inventory Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            statusFilter === 'all'
              ? 'bg-blue-600/10 text-white border-blue-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-medium block text-slate-400">Total Listings</span>
          <span className="text-xl font-bold text-white mt-1 block">{properties.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('available')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            statusFilter === 'available'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-medium block text-slate-400">Available / Active</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{availableCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('under_token')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            statusFilter === 'under_token'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-medium block text-slate-400">Under Token</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{underTokenCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('sold')}
          className={`p-4 rounded-xl border text-left transition-colors ${
            statusFilter === 'sold'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs font-medium block text-slate-400">Sold / Closed</span>
          <span className="text-xl font-bold text-blue-400 mt-1 block">{soldCount}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, owner, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Purpose Filter */}
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Purposes</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* Locality Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Peshawar Locations</option>
            {PESHAWAR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'table' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table / Grid Listing */}
      {filteredProperties.length === 0 ? (
        <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center">
          <Building className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">No Properties Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting search filters or add a new property.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price & Demand</th>
                  <th className="px-6 py-4">Status & Status Toggle</th>
                  <th className="px-6 py-4">Owner Contact</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Property info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-700 bg-slate-950"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/properties/${prop.slug || prop.id}`}
                            target="_blank"
                            className="font-bold text-white hover:text-blue-400 block line-clamp-1 transition-colors"
                          >
                            {prop.title}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="capitalize font-semibold">{prop.type}</span>
                            <span>•</span>
                            <span>
                              {prop.areaValue} {prop.areaUnit}
                            </span>
                            <span>•</span>
                            <span className="uppercase text-blue-400 font-bold">
                              {prop.purpose}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-white font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{prop.location.area}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {prop.location.address}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-white block">
                        {prop.priceFormatted}
                      </span>
                      {prop.purpose === 'sale' && (
                        <span className="text-[10px] text-slate-400">
                          ~Rs. {Math.round(prop.price / prop.areaValue / 100000)} Lac / Marla
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={prop.status}
                        onChange={(e) =>
                          updatePropertyStatus(prop.id, e.target.value as PropertyStatus)
                        }
                        className="text-[11px] font-bold p-1.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="under_token">Under Token</option>
                        <option value="sold">Sold / Closed</option>
                        <option value="rented">Rented</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Owner Info */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-white block">{prop.ownerName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {prop.ownerPhone}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/properties/${prop.slug || prop.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/properties/edit/${prop.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPropertyToDelete(prop)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-full h-full object-cover bg-slate-950"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <StatusBadge status={prop.status} />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                    {prop.priceFormatted}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{prop.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {prop.location.area}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                <select
                  value={prop.status}
                  onChange={(e) =>
                    updatePropertyStatus(prop.id, e.target.value as PropertyStatus)
                  }
                  className="text-[11px] font-bold p-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none"
                >
                  <option value="available">Available</option>
                  <option value="under_token">Under Token</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/properties/edit/${prop.id}`}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPropertyToDelete(prop)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {propertyToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setPropertyToDelete(null)}
          onConfirm={() => {
            deleteProperty(propertyToDelete.id);
            setPropertyToDelete(null);
          }}
          title="Delete Property Listing"
          message={`Are you sure you want to remove "${propertyToDelete.title}" from the Peshawar catalog? This action cannot be undone.`}
          confirmText="Yes, Delete Property"
          type="danger"
        />
      )}
    </div>
  );
};
