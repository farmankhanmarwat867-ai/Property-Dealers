import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ListPropertyModal } from './ListPropertyModal';
import {
  Building,
  Heart,
  PlusCircle,
  Menu,
  X,
  User,
  ShieldCheck,
  PhoneCall,
  LayoutDashboard,
} from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { favorites, isAuthenticated, agencySettings } = useApp();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Buy', path: '/buy' },
    { name: 'Rent', path: '/rent' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top emergency / advisory ticker */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              Peshawar Real Estate Advisory: DHA Peshawar, Hayatabad, Regi Model Town & Warsak Road
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              {agencySettings.phone}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified KP Govt License #{agencySettings.registrationNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-slate-800 transition">
                <Building className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
                  KHYBER<span className="text-emerald-600">ESTATE</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-bold mt-1 block">
                  Peshawar Property Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right side CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Saved badge */}
              <Link
                to="/properties?filter=saved"
                className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                title="Saved Properties"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* List Your Property Button */}
              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 hover:border-slate-900 hover:bg-slate-50 transition shadow-2xs"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                List Your Property
              </button>

              {/* Admin Portal Button */}
              {isAuthenticated ? (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  Dealer CRM
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  Dealer Login
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/properties?filter=saved"
                className="relative p-2 text-slate-600"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute 0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    location.pathname === link.path
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsListModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                List Your Property
              </button>

              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                {isAuthenticated ? 'Go to Dealer CRM' : 'Property Dealer Login'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* List Property Modal */}
      <ListPropertyModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </>
  );
};
