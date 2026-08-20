import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatArea } from '../../utils/formatters';
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Heart,
  BadgeCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite(property.id);

  return (
    <div
      id={`property-card-${property.id}`}
      className="group bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 shadow-sm transition-all duration-300 flex flex-col h-full text-slate-200"
    >
      {/* Image container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
          alt={property.title || 'Property in Peshawar'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-tight shadow-xs ${
              property.purpose === 'sale'
                ? 'bg-blue-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}
          >
            {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-900/90 text-slate-300 backdrop-blur-xs capitalize border border-slate-700/50 shadow-xs">
            {property.type}
          </span>
          {property.verified && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-md z-10 ${
            favorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-900 hover:text-red-400 border border-slate-700'
          }`}
          aria-label={favorite ? 'Remove from favorites' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Demand</p>
            <p className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              {property.priceFormatted}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
            {formatArea(property.areaValue, property.areaUnit)}
          </span>
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{property.location?.area || 'Peshawar'}, {property.location?.city || 'Peshawar'}</span>
          </div>

          {/* Title */}
          <Link
            to={`/properties/${property.slug || property.id}`}
            className="block group-hover:text-blue-400 transition-colors"
          >
            <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
              {property.title}
            </h3>
          </Link>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-800 text-slate-400 text-xs font-medium">
            {property.type !== 'plot' && property.type !== 'commercial' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-slate-500" />
                  <span>{property.bedrooms || 0} Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-slate-500" />
                  <span>{property.bathrooms || 0} Baths</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-slate-500" />
                  <span>{property.parkingSpaces || 1} Car</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>{property.type === 'plot' ? 'Residential Land' : 'Commercial Unit'}</span>
                </div>
                <div className="flex items-center justify-end font-semibold text-emerald-400 text-[11px]">
                  Direct Owner
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <img
              src={property.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={property.agent?.name || 'Khyber Agent'}
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <span className="text-xs text-slate-400 font-medium truncate max-w-[120px]">
              {property.agent?.name || 'Hamza Afridi'}
            </span>
          </div>

          <Link
            to={`/properties/${property.slug || property.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
