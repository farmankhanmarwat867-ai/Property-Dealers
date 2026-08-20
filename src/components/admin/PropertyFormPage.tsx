import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../../types';
import { PESHAWAR_LOCATIONS } from '../../data/mockData';
import { formatPKR } from '../../utils/formatters';
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  Tag,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';

export const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty, currentUser } = useApp();

  const isEditing = Boolean(id);
  const existingProperty = isEditing ? properties.find((p) => p.id === id) : null;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    purpose: 'sale' as PropertyPurpose,
    type: 'house' as PropertyType,
    status: 'available' as PropertyStatus,
    price: 25000000,
    areaValue: 10,
    areaUnit: 'Marla' as 'Marla' | 'Kanal' | 'Sq. Ft.',
    locationArea: 'Hayatabad Phase 3',
    address: '',
    landmark: '',
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    totalFloors: 2,
    yearBuilt: 2023,
    description: '',
    ownerName: '',
    ownerPhone: '',
    featured: false,
    verified: true,
    facing: 'North-East / Corner',
    gasAvailable: true,
    electricityBackup: '10kW Hybrid Solar System',
    waterBoring: true,
    amenities: [
      'Gas Connection',
      'Sweet Water Boring',
      'Solar System (10kW)',
      'Ashwood Wardrobes',
      'Spanish Tile Flooring',
      'CCTV Camera Security',
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    ],
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');

  useEffect(() => {
    if (isEditing && existingProperty) {
      setFormData({
        title: existingProperty.title,
        purpose: existingProperty.purpose,
        type: existingProperty.type,
        status: existingProperty.status,
        price: existingProperty.price,
        areaValue: existingProperty.areaValue,
        areaUnit: existingProperty.areaUnit,
        locationArea: existingProperty.location.area,
        address: existingProperty.location.address,
        landmark: existingProperty.location.landmark || '',
        bedrooms: existingProperty.bedrooms || 0,
        bathrooms: existingProperty.bathrooms || 0,
        parkingSpaces: existingProperty.parkingSpaces || 1,
        totalFloors: existingProperty.totalFloors || 2,
        yearBuilt: existingProperty.yearBuilt || 2023,
        description: existingProperty.description,
        ownerName: existingProperty.ownerName,
        ownerPhone: existingProperty.ownerPhone,
        featured: existingProperty.featured,
        verified: existingProperty.verified,
        facing: existingProperty.features.facing || 'Corner',
        gasAvailable: existingProperty.features.gasAvailable,
        electricityBackup: existingProperty.features.electricityBackup,
        waterBoring: existingProperty.features.waterBoring,
        amenities: existingProperty.amenities,
        images: existingProperty.images,
      });
    }
  }, [isEditing, existingProperty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<Property> = {
      title: formData.title,
      purpose: formData.purpose,
      type: formData.type,
      status: formData.status,
      price: Number(formData.price),
      priceFormatted: formatPKR(Number(formData.price)),
      areaValue: Number(formData.areaValue),
      areaUnit: formData.areaUnit,
      location: {
        city: 'Peshawar',
        area: formData.locationArea,
        address: formData.address || `${formData.locationArea}, Peshawar`,
        landmark: formData.landmark,
      },
      bedrooms: Number(formData.bedrooms) || undefined,
      bathrooms: Number(formData.bathrooms) || undefined,
      parkingSpaces: Number(formData.parkingSpaces) || 1,
      totalFloors: Number(formData.totalFloors) || 2,
      yearBuilt: Number(formData.yearBuilt) || 2023,
      description: formData.description,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      featured: formData.featured,
      verified: formData.verified,
      features: {
        gasAvailable: formData.gasAvailable,
        electricityBackup: formData.electricityBackup,
        waterBoring: formData.waterBoring,
        facing: formData.facing,
      },
      amenities: formData.amenities,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
    };

    if (isEditing && id) {
      updateProperty(id, payload);
    } else {
      addProperty(payload as any);
    }

    navigate('/admin/properties');
  };

  const handleAddImage = () => {
    if (!newImageUrl) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl] }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddAmenity = () => {
    if (!customAmenity) return;
    if (!formData.amenities.includes(customAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, customAmenity] }));
    }
    setCustomAmenity('');
  };

  const handleRemoveAmenity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== name),
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties List
        </Link>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {isEditing ? 'Edit Listing' : 'New Listing'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Property Details */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Property Overview & Demand</h3>
              <p className="text-xs text-slate-400">Core listing classification and pricing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Purpose *</label>
              <select
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value as PropertyPurpose })
                }
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Property Type *</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as PropertyType })
                }
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="house">House / Bungalow</option>
                <option value="plot">Plot / Residential Land</option>
                <option value="apartment">Luxury Apartment</option>
                <option value="commercial">Commercial Building / Shop</option>
                <option value="portion">Upper / Lower Portion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as PropertyStatus })
                }
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="available">Available (Active)</option>
                <option value="under_token">Under Token Deposit</option>
                <option value="sold">Sold / Closed</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Property Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10 Marla Brand New Spanish Corner House in Hayatabad Phase 3"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Demand Price (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">
                Preview: {formatPKR(formData.price)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Area Size *</label>
              <input
                type="number"
                required
                value={formData.areaValue}
                onChange={(e) => setFormData({ ...formData, areaValue: Number(e.target.value) })}
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Area Unit *</label>
              <select
                value={formData.areaUnit}
                onChange={(e) =>
                  setFormData({ ...formData, areaUnit: e.target.value as any })
                }
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="Marla">Marla</option>
                <option value="Kanal">Kanal</option>
                <option value="Sq. Ft.">Sq. Ft.</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Peshawar Location */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Peshawar Location & Landmark</h3>
              <p className="text-xs text-slate-400">Sector classification for search indexing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Peshawar Locality / Sector *
              </label>
              <select
                value={formData.locationArea}
                onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                {PESHAWAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nearby Landmark / Reference
              </label>
              <input
                type="text"
                placeholder="e.g. Near Tatara Park & BRT Feeder Route"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Complete Street Address / House Number
            </label>
            <input
              type="text"
              placeholder="e.g. Street 14, Sector F-2, House # 29"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Card 3: Specs & Utilities */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Specifications & Utilities</h3>
              <p className="text-xs text-slate-400">Rooms, utilities, and infrastructure details</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Car Parking</label>
              <input
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) =>
                  setFormData({ ...formData, parkingSpaces: Number(e.target.value) })
                }
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Floors</label>
              <input
                type="number"
                value={formData.totalFloors}
                onChange={(e) =>
                  setFormData({ ...formData, totalFloors: Number(e.target.value) })
                }
                className="w-full text-xs font-medium p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Facing & Orientation
              </label>
              <input
                type="text"
                value={formData.facing}
                onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Electricity Backup
              </label>
              <input
                type="text"
                value={formData.electricityBackup}
                onChange={(e) =>
                  setFormData({ ...formData, electricityBackup: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={formData.gasAvailable}
                onChange={(e) => setFormData({ ...formData, gasAvailable: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              Sui Gas Meter Installed
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={formData.waterBoring}
                onChange={(e) => setFormData({ ...formData, waterBoring: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              Sweet Water Boring Active
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              100% Title Verified with PDA/DHA
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              Featured on Home Page
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Detailed Property Description
            </label>
            <textarea
              rows={4}
              required
              placeholder="Highlight construction quality, woodwork, neighborhood highlights, and sale conditions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Card 4: Owner & Dealer Confidential Info */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Owner & Agency Confidential</h3>
              <p className="text-xs text-slate-400">Only visible to authenticated dealer staff</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Owner / Landlord Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Haji Farman Khan"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Owner Mobile / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/properties"
            className="px-5 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            {isEditing ? 'Update Property Listing' : 'Publish Property to Live Catalog'}
          </button>
        </div>
      </form>
    </div>
  );
};
