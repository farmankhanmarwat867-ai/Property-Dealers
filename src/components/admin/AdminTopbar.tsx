import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Plus,
  Menu,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Clock,
  User,
} from 'lucide-react';

interface AdminTopbarProps {
  onOpenMobileMenu: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileMenu }) => {
  const { leads, followUps, resetToDemoData, properties, customers, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? {
        properties: properties.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.area.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
        customers: customers.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
        ).slice(0, 3),
        leads: leads.filter(
          (l) =>
            l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.phone.includes(searchQuery)
        ).slice(0, 3),
      }
    : null;

  const newLeads = leads.filter((l) => l.status === 'new').slice(0, 4);

  return (
    <header className="h-16 bg-slate-900/40 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box with Live Results Dropdown */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search listings, customers, or leads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full text-xs font-medium pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
          />

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults && (
            <div
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-3 z-50 space-y-3 max-h-96 overflow-y-auto"
              onMouseLeave={() => setIsSearchOpen(false)}
            >
              {searchResults.properties.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">
                    Properties
                  </p>
                  {searchResults.properties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        navigate(`/properties/${p.slug || p.id}`);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-800/60 rounded-lg text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium text-white truncate">{p.title}</span>
                      <span className="text-[11px] font-semibold text-blue-400 shrink-0 ml-2">
                        {p.priceFormatted}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.customers.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">
                    Customers
                  </p>
                  {searchResults.customers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigate('/admin/customers');
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-800/60 rounded-lg text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium text-white">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.properties.length === 0 && searchResults.customers.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-2">No matching records found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={resetToDemoData}
          title="Reset database to initial demo values"
          className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-800/60 hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          Reset Demo
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Add Property</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isQuickAddOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-1.5 z-50 text-xs font-medium"
              onMouseLeave={() => setIsQuickAddOpen(false)}
            >
              <Link
                to="/admin/properties/new"
                onClick={() => setIsQuickAddOpen(false)}
                className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                + Add Property
              </Link>
              <Link
                to="/admin/leads"
                onClick={() => setIsQuickAddOpen(false)}
                className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                + Record Lead
              </Link>
              <Link
                to="/admin/customers"
                onClick={() => setIsQuickAddOpen(false)}
                className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                + New Customer
              </Link>
              <Link
                to="/admin/followups"
                onClick={() => setIsQuickAddOpen(false)}
                className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                + Schedule Follow-up
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {newLeads.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-4 z-50"
              onMouseLeave={() => setIsNotificationsOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <h4 className="text-xs font-bold text-white">Recent Inquiries</h4>
                <span className="text-[10px] bg-red-500/10 text-red-400 font-bold px-2 py-0.5 rounded-full">
                  {newLeads.length} Uncontacted
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {newLeads.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No new notifications.</p>
                ) : (
                  newLeads.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        navigate('/admin/leads');
                        setIsNotificationsOpen(false);
                      }}
                      className="p-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-800"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{l.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Just now</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {l.propertyTitle || 'General Website Inquiry'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Live Site Link */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
};
