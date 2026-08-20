import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Send,
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { agencySettings, submitPublicInquiry } = useApp();
  const [quickPhone, setQuickPhone] = React.useState('');

  const handleQuickCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone) return;
    submitPublicInquiry({
      name: 'Quick Callback Request',
      phone: quickPhone,
      message: 'Client requested an urgent callback via footer widget.',
    });
    setQuickPhone('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900">
      {/* Upper newsletter / callback bar */}
      <div className="border-b border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Instant Advisory
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Need free property valuation or consultation in Peshawar?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Drop your mobile number. Our senior property dealer will call you back within 15 minutes.
            </p>
          </div>
          <form onSubmit={handleQuickCallback} className="flex w-full md:w-auto gap-2">
            <input
              type="tel"
              required
              placeholder="e.g. 0300 1234567"
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden w-full md:w-64"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              Request Call
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                KHYBER<span className="text-emerald-500">ESTATE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {agencySettings.tagline}. Leading the transformation of Peshawar’s real estate market through 100% verified documentation, transparent pricing, and zero dispute guarantees.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400 pt-2 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>KP Real Estate Authority Certified #{agencySettings.registrationNumber}</span>
            </div>
          </div>

          {/* Col 2: Top Localities */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Top Peshawar Areas
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/properties?location=Hayatabad" className="hover:text-white transition">
                  Hayatabad (Phases 1 - 7)
                </Link>
              </li>
              <li>
                <Link to="/properties?location=DHA" className="hover:text-white transition">
                  DHA Peshawar (Sectors A-C)
                </Link>
              </li>
              <li>
                <Link to="/properties?location=University" className="hover:text-white transition">
                  University Town & Roads
                </Link>
              </li>
              <li>
                <Link to="/properties?location=Regi" className="hover:text-white transition">
                  Regi Model Town (Zones 1-4)
                </Link>
              </li>
              <li>
                <Link to="/properties?location=Warsak" className="hover:text-white transition">
                  Warsak Road Enclaves
                </Link>
              </li>
              <li>
                <Link to="/properties?location=Ring" className="hover:text-white transition">
                  Main Ring Road Plazas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/properties" className="hover:text-white transition">
                  Browse All Properties
                </Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-white transition">
                  Houses & Plots for Sale
                </Link>
              </li>
              <li>
                <Link to="/rent" className="hover:text-white transition">
                  Rental Houses & Flats
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Our Peshawar Office & Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact & Map Directions
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition">
                  Dealer Portal CRM
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Branches & Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Peshawar Offices
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Suite 304, Deans Trade Center, Saddar Cantt, Peshawar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{agencySettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{agencySettings.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Mon-Sat: 9:00 AM – 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Khyber Estate & Property Advisors Peshawar. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500">Built for Peshawar Real Estate Market</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-white transition">
              Staff Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
