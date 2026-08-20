import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  RotateCcw,
  Shield,
  Percent,
  CheckCircle,
  Database,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, resetDemoData, showToast } = useApp();

  const [agencyData, setAgencyData] = useState({
    name: 'Khyber Estate & Property Advisor',
    registrationNo: 'PDA-KP-2024-8841',
    principalDealer: 'Hamza Khan Afridi',
    phone: '+92 300 9012345',
    whatsapp: '+92 300 9012345',
    email: 'info@khyberestate.pk',
    headOffice: 'Suite 402, Deans Trade Center, Saddar, Peshawar, KP',
    branchOffice: 'Office #12, Block B-3, Hayatabad Phase 3, Peshawar',
    salesCommission: '2.0',
    rentCommission: '1.0',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    showToast('Agency settings saved successfully!', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the CRM data to default Peshawar inventory and demo leads?'
      )
    ) {
      resetDemoData();
      showToast('Demo data restored to initial state.', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Agency Configuration & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Peshawar branch details, default broker commissions, and CRM data.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Agency Profile */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agency & Licensing Profile</h3>
              <p className="text-xs text-slate-400">Official Peshawar commercial registration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Agency Name</label>
              <input
                type="text"
                value={agencyData.name}
                onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                PDA / Excise Reg Number
              </label>
              <input
                type="text"
                value={agencyData.registrationNo}
                onChange={(e) =>
                  setAgencyData({ ...agencyData, registrationNo: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Principal Dealer
              </label>
              <input
                type="text"
                value={agencyData.principalDealer}
                onChange={(e) =>
                  setAgencyData({ ...agencyData, principalDealer: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Mobile</label>
              <input
                type="tel"
                value={agencyData.phone}
                onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official WhatsApp
              </label>
              <input
                type="tel"
                value={agencyData.whatsapp}
                onChange={(e) => setAgencyData({ ...agencyData, whatsapp: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Head Office Address (Saddar / Cantt)
              </label>
              <input
                type="text"
                value={agencyData.headOffice}
                onChange={(e) => setAgencyData({ ...agencyData, headOffice: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Branch Office (Hayatabad)
              </label>
              <input
                type="text"
                value={agencyData.branchOffice}
                onChange={(e) => setAgencyData({ ...agencyData, branchOffice: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Commission & Market Policies */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Standard Peshawar Brokerage</h3>
              <p className="text-xs text-slate-400">Peshawar Real Estate Association rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sale Commission Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={agencyData.salesCommission}
                onChange={(e) =>
                  setAgencyData({ ...agencyData, salesCommission: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard: 2% (1% from Buyer + 1% from Seller)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Rent Commission Standard
              </label>
              <input
                type="text"
                value="1 Month Rent Equivalent"
                disabled
                className="w-full text-xs p-2.5 bg-slate-950/50 text-slate-500 border border-slate-800 rounded-lg cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard: 1 Month's Rent on tenancy agreements
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            Save Agency Settings
          </button>

          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              Settings updated!
            </span>
          )}
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="bg-rose-500/10 rounded-xl border border-rose-500/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-rose-300">Reset Peshawar CRM Data</h4>
          </div>
          <p className="text-xs text-rose-400/80">
            Re-populate localStorage with pristine mock Peshawar properties (Hayatabad, DHA, Regi),
            leads, customers, and deals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
