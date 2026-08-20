import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { PESHAWAR_LOCATIONS } from '../../data/mockData';
import { Building2, UploadCloud, Check } from 'lucide-react';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({ isOpen, onClose }) => {
  const { submitListProperty } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    purpose: 'sale',
    type: 'house',
    price: '',
    areaValue: '10',
    areaUnit: 'Marla',
    locationArea: 'Hayatabad Phase 3',
    address: '',
    bedrooms: '4',
    bathrooms: '4',
    parkingSpaces: '2',
    description: '',
    ownerName: '',
    ownerPhone: '',
    amenities: ['Gas Connection', 'Electricity', 'Water Boring'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitListProperty({
      ...formData,
      price: Number(formData.price) || 25000000,
      areaValue: Number(formData.areaValue) || 10,
      bedrooms: Number(formData.bedrooms) || 4,
      bathrooms: Number(formData.bathrooms) || 4,
      parkingSpaces: Number(formData.parkingSpaces) || 2,
    });
    onClose();
  };

  const toggleAmenity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List Your Property in Peshawar"
      subtitle="Reach 10,000+ verified buyers & tenants with zero listing charges"
      maxWidth="2xl"
      id="list-property-modal"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
              Property Specs
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
              Owner & Contact
            </span>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="house">House / Bungalow</option>
                  <option value="plot">Plot / Land</option>
                  <option value="apartment">Apartment / Flat</option>
                  <option value="commercial">Commercial Building / Shop</option>
                  <option value="portion">Upper / Lower Portion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Title / Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Marla Corner House with Solar System"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location in Peshawar
                </label>
                <select
                  value={formData.locationArea}
                  onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  {PESHAWAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Demand Price (PKR)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 28500000 for 2.85 Crore"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Area Size</label>
                <input
                  type="number"
                  required
                  value={formData.areaValue}
                  onChange={(e) => setFormData({ ...formData, areaValue: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                <select
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="Marla">Marla</option>
                  <option value="Kanal">Kanal</option>
                  <option value="Sq. Ft.">Sq. Ft.</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gas Connection',
                  '3-Phase Electricity',
                  'Water Boring',
                  'Solar Backup',
                  'CCTV Security',
                  'Lawn / Garden',
                  'Servant Quarter',
                ].map((amenity) => (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      formData.amenities.includes(amenity)
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
              >
                Continue to Owner Info →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address / House #
              </label>
              <input
                type="text"
                placeholder="e.g. Street 12, Sector F-3, Near Tatara Park"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner / Contact Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haji Farman Khan"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Description & Highlights
              </label>
              <textarea
                rows={3}
                placeholder="Describe woodwork, flooring, neighborhood highlights, or urgent sale notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-hidden"
              />
            </div>

            {/* Image placeholder area */}
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">Property Photos</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard architectural photos will be assigned automatically by our photography team.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
              >
                Submit Listing for Verification
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
