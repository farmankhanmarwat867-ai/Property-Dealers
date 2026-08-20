import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HeroSearch } from '../../components/public/HeroSearch';
import { PropertyCard } from '../../components/common/PropertyCard';
import { ListPropertyModal } from '../../components/public/ListPropertyModal';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { properties, agencySettings } = useApp();
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const featuredProperties = properties
    .filter((p) => p.featured || p.viewsCount > 400)
    .slice(0, 6);

  const categories = [
    {
      title: 'Luxury Houses',
      type: 'house',
      count: properties.filter((p) => p.type === 'house').length,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      description: 'Designer bungalows in Hayatabad, Regi & University Town',
    },
    {
      title: 'Residential Plots',
      type: 'plot',
      count: properties.filter((p) => p.type === 'plot').length,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      description: 'DHA Peshawar, Regi Zones & Warsak Road plots',
    },
    {
      title: 'Modern Apartments',
      type: 'apartment',
      count: properties.filter((p) => p.type === 'apartment').length,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      description: 'High-rise luxury flats in Saddar & University Road',
    },
    {
      title: 'Commercial Plazas',
      type: 'commercial',
      count: properties.filter((p) => p.type === 'commercial').length,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      description: 'Shops, halls and buildings on Ring Road & Board Bazaar',
    },
    {
      title: 'Rental Portions',
      type: 'portion',
      count: properties.filter((p) => p.purpose === 'rent').length,
      image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?w=600&auto=format&fit=crop&q=80',
      description: 'Upper/lower portions for families and professionals',
    },
  ];

  const localities = [
    { name: 'Hayatabad (Phases 1-7)', count: '140+ Listings', tag: 'High Demand' },
    { name: 'DHA Peshawar', count: '95+ Plots', tag: 'Fast Appreciation' },
    { name: 'University Town', count: '45+ Mansions', tag: 'VIP Elite' },
    { name: 'Regi Model Town', count: '80+ Properties', tag: 'Affordable Luxury' },
    { name: 'Warsak Road', count: '60+ Houses', tag: 'Family Enclaves' },
    { name: 'Saddar Cantt', count: '35+ Commercial', tag: 'Prime Center' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&auto=format&fit=crop&q=80"
            alt="Peshawar Real Estate"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Properties in Peshawar, KP
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Find Your Next Property in <span className="text-emerald-400">Peshawar</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Discover verified houses, residential plots, modern apartments and commercial buildings across Hayatabad, DHA Peshawar, University Town, and Regi Model Town.
          </p>

          {/* Hero Search Box */}
          <div className="pt-4">
            <HeroSearch initialPurpose="sale" />
          </div>
        </div>
      </section>

      {/* 2. STATS TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="border-r last:border-0 border-slate-100 pr-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">1,250+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Verified Peshawar Listings</p>
          </div>
          <div className="border-r last:border-0 border-slate-100 pr-4">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">Rs. 18+ Arab</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Closed Property Deals</p>
          </div>
          <div className="border-r last:border-0 border-slate-100 pr-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">15+ Years</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Market Trust & Leadership</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600">100%</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Dispute-Free Guarantee</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Handpicked Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Featured Properties in Peshawar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Prime verified houses and plots with direct owner authorizations.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 transition"
          >
            Browse All {properties.length} Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 4. PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Property Types
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Explore by Property Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find the ideal residential or commercial asset suited to your lifestyle and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={`/properties?type=${cat.type}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-900 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-end p-5"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-50 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md mb-2 inline-block">
                  {cat.count} Available
                </span>
                <h3 className="text-base font-bold text-white leading-tight">{cat.title}</h3>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TOP PESHAWAR LOCALITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 py-12 rounded-3xl border border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Neighborhood Guide
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Prime Real Estate Sectors in Peshawar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {localities.map((loc) => (
            <Link
              key={loc.name}
              to={`/properties?location=${encodeURIComponent(loc.name.split(' ')[0])}`}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {loc.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">{loc.count}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                {loc.tag}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Professional Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Why Peshawar Dealers & Families Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transparent registry verification, legal guidance, and real-time dealer coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">100% Verified Titles</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every plot and house is verified with PDA, DHA Peshawar authorities, and Revenue Patwari records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Accurate Market Valuation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              No artificial inflation. Get real prevailing market rates for Hayatabad, DHA, and Regi sectors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dedicated Area Specialists</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Licensed senior agents living and working inside Peshawar’s prime residential sectors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Fast Viewing & WhatsApp</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Immediate on-site property walkthroughs with video tours shared directly via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER: LIST YOUR PROPERTY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              For Property Owners & Landlords
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Looking to Sell or Rent Your Property in Peshawar?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              List your house, plot, or commercial property with Peshawar’s premier real estate network. Reach genuine qualified buyers with zero upfront listing charges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsListModalOpen(true)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition"
            >
              List Your Property Free
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition"
            >
              Talk to Our Dealer
            </Link>
          </div>
        </div>
      </section>

      <ListPropertyModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </div>
  );
};
