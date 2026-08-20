import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../common/PropertyCard';
import { HeroSearch } from './HeroSearch';
import { ShieldCheck, FileCheck, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

export const BuyPage: React.FC = () => {
  const { properties } = useApp();

  const saleProperties = properties.filter((p) => p.purpose === 'sale');

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Invest in Peshawar Real Estate
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Houses, Plots & Commercial for Sale in Peshawar
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            100% verified registry, Patwari record clearance, and direct owner transactions across DHA, Hayatabad, Regi Model Town & Warsak Road.
          </p>

          <div className="pt-6">
            <HeroSearch initialPurpose="sale" />
          </div>
        </div>
      </section>

      {/* Guide Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">PDA & DHA Verification</h4>
              <p className="text-xs text-slate-500 mt-1">
                Complete title verification before you deposit any token or advance money.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Capital Appreciation</h4>
              <p className="text-xs text-slate-500 mt-1">
                Expert market predictions for high-yield plots in DHA Peshawar & Regi Sectors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Overseas Investor Care</h4>
              <p className="text-xs text-slate-500 mt-1">
                Power of Attorney (POA) and video walkthrough support for overseas Pakistanis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Latest Properties for Sale</h2>
            <p className="text-xs text-slate-500">{saleProperties.length} active listings in Peshawar</p>
          </div>
          <Link
            to="/properties?purpose=sale"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Apply Filters <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saleProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>
    </div>
  );
};
