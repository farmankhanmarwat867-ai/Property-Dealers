import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PropertyGallery } from './PropertyGallery';
import { PropertyCard } from '../common/PropertyCard';
import { formatArea, formatPKR } from '../../utils/formatters';
import { WhatsAppModal, CallModal } from '../common/CommunicationModals';
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Heart,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  Share2,
  Building,
  Shield,
  Layers,
  Compass,
  Phone,
  MessageSquare,
  Send,
  ArrowLeft,
  Flame,
  Zap,
  Droplet,
  Sun,
  ShieldCheck,
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, properties, submitPublicInquiry, isFavorite, toggleFavorite, showToast } = useApp();

  const property = getPropertyById(id || '');

  // Modals state
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);

  // Inquiry form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState(
    'Assalam-o-Alaikum, I am interested in this property and would like to schedule an on-site viewing. Please share documentation status and exact location.'
  );

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-slate-500 mt-2 text-sm">
          The property listing you are looking for may have been sold or removed.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Available Properties
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(property.id);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPublicInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      name: inquiryName,
      phone: inquiryPhone,
      email: inquiryEmail,
      message: inquiryMessage,
      budget: property.price,
    });
    setInquiryName('');
    setInquiryPhone('');
    setInquiryEmail('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} in Peshawar for ${property.priceFormatted}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Property URL copied to clipboard.');
    }
  };

  const similarProperties = properties
    .filter((p) => p.id !== property.id && (p.location.area === property.location.area || p.type === property.type))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
        <div className="flex items-center gap-2">
          <span>Peshawar</span>
          <span>/</span>
          <span>{property.location.area}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold uppercase">{property.purpose}</span>
        </div>
      </div>

      {/* Title & Price Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                property.purpose === 'sale'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white capitalize">
              {property.type}
            </span>
            {property.verified && (
              <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-sky-600" />
                100% Verified Title
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{property.location.address}, {property.location.area}, Peshawar</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block sm:text-right">
              Demand Price
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {property.priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              title="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(property.id)}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                favorite
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              {favorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Gallery */}
      <PropertyGallery images={property.images} title={property.title} />

      {/* 2-Column Content Layout: Details (Left) + Contact Agent Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Specs, Description, Amenities, Location (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Specs Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="border-r last:border-0 border-slate-100 pr-4">
              <span className="text-xs text-slate-500 font-semibold block">Total Area</span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {formatArea(property.areaValue, property.areaUnit)}
              </span>
            </div>
            {property.bedrooms && (
              <div className="border-r last:border-0 border-slate-100 pr-4">
                <span className="text-xs text-slate-500 font-semibold block">Bedrooms</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">
                  {property.bedrooms} Beds
                </span>
              </div>
            )}
            {property.bathrooms && (
              <div className="border-r last:border-0 border-slate-100 pr-4">
                <span className="text-xs text-slate-500 font-semibold block">Bathrooms</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">
                  {property.bathrooms} Baths
                </span>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Parking</span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {property.parkingSpaces || 1} Cars
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Property Overview</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Utilities & Technical Specs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Key Utilities & Infrastructure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Flame className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-slate-500 block">Sui Gas</span>
                  <span className="text-slate-900">
                    {property.features?.gasAvailable ? 'Installed & Operational' : 'Under Connection'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Zap className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-slate-500 block">Electricity Backup</span>
                  <span className="text-slate-900">{property.features?.electricityBackup || 'Standard Grid / UPS'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Droplet className="w-5 h-5 text-sky-500" />
                <div>
                  <span className="text-slate-500 block">Water Supply</span>
                  <span className="text-slate-900">
                    {property.features?.waterBoring ? 'Sweet Water Boring Available' : 'PDA Water Line'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Compass className="w-5 h-5 text-indigo-500" />
                <div>
                  <span className="text-slate-500 block">Facing & Orientation</span>
                  <span className="text-slate-900">{property.features?.facing || 'Standard'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Features & Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(property.amenities || ['Gas Connection', 'Electricity', 'Water Supply']).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-2.5 bg-slate-50 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peshawar Neighborhood Insights */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <MapPin className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Location Context ({property.location?.area || 'Peshawar'})</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Located in prime {property.location?.area || 'Peshawar'}. Landmark reference: {property.location?.landmark || 'Close to Main Boulevard & BRT Station'}. Surrounded by 24/7 security, shopping markets, and renowned educational institutions.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Contact Agent Card (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl sticky top-28 space-y-6">
            {/* Agent Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={property.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={property.agent?.name || 'Hamza Afridi'}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{property.agent?.name || 'Hamza Afridi'}</h4>
                <p className="text-xs text-slate-500 font-medium">{property.agent?.role || 'Senior Property Consultant'}</p>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                  ★ {property.agent?.rating || 4.9} (Peshawar Top Broker)
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Call & WhatsApp */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCallOpen(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Call Agent
              </button>
              <button
                type="button"
                onClick={() => setIsWhatsAppOpen(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
            </div>

            {/* Send Inquiry Form */}
            <form onSubmit={handleInquirySubmit} className="space-y-3 pt-2">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Schedule a Visit / Inquire
              </h5>

              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
              />

              <input
                type="tel"
                required
                placeholder="Mobile / WhatsApp Number (e.g. 0300 1234567)"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
              />

              <textarea
                rows={3}
                placeholder="Your message or preferred viewing time..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Inquiry to Dealer
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                🔒 Your contact details are shared strictly with our licensed Peshawar agents.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Similar Properties in Peshawar</h3>
              <p className="text-xs text-slate-500">More options in {property.location?.area || 'Peshawar'} and surrounding sectors</p>
            </div>
            <Link
              to="/properties"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Communication Modals */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        recipientName={property.agent?.name || 'Hamza Afridi'}
        phone={property.agent?.whatsapp || '+923009081234'}
        propertyTitle={property.title}
        defaultMessage={`Assalam-o-Alaikum ${property.agent?.name || 'Agent'}, I am inquiring about "${property.title}" in ${property.location?.area || 'Peshawar'} (Demand: ${property.priceFormatted}). Please share the exact location pin and viewing availability.`}
      />

      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        recipientName={property.agent?.name || 'Hamza Afridi'}
        phone={property.agent?.phone || '+92 300 9081234'}
      />
    </div>
  );
};
