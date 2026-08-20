import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/formatters';
import {
  exportDealsToCSV,
  exportPropertiesToCSV,
  exportLeadsToCSV,
  exportCustomersToCSV,
  exportExecutiveSummaryCSV,
  generatePrintableReport,
} from '../../utils/exportUtils';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  Users,
  Building,
  Award,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { properties, leads, deals, customers } = useApp();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const totalVolume = deals.reduce((acc, d) => acc + (d.dealValue || 0), 0);
  const totalCommission = deals.reduce((acc, d) => acc + (d.commissionValue || 0), 0);

  // Sector breakdown
  const localities = [
    { name: 'Hayatabad (Phases 1-7)', share: 45, volume: 'Rs. 9.5 Crore', count: 12 },
    { name: 'DHA Peshawar', share: 25, volume: 'Rs. 5.2 Crore', count: 8 },
    { name: 'University Town', share: 15, volume: 'Rs. 2.8 Crore', count: 4 },
    { name: 'Regi Model Town', share: 10, volume: 'Rs. 1.8 Crore', count: 6 },
    { name: 'Warsak & Cantt', share: 5, volume: 'Rs. 85 Lac', count: 3 },
  ];

  const agentLeaderboard = [
    {
      name: 'Hamza Khan Afridi',
      role: 'Principal Broker',
      deals: 5,
      volume: 'Rs. 14.8 Crore',
      commission: 'Rs. 29.6 Lac',
      rating: '4.95 ★',
    },
    {
      name: 'Bilal Ahmad Marwat',
      role: 'DHA Specialist',
      deals: 4,
      volume: 'Rs. 8.2 Crore',
      commission: 'Rs. 16.4 Lac',
      rating: '4.90 ★',
    },
    {
      name: 'Saad Khan Khattak',
      role: 'Hayatabad Consultant',
      deals: 3,
      volume: 'Rs. 5.5 Crore',
      commission: 'Rs. 11.0 Lac',
      rating: '4.85 ★',
    },
  ];

  const handlePrintPDF = () => {
    generatePrintableReport({
      totalVolume,
      totalCommission,
      propertiesCount: properties.length,
      leadsCount: leads.length,
      customersCount: customers.length,
      deals,
      localities,
      agentLeaderboard,
    });
  };

  const handleExportExecutiveCSV = () => {
    exportExecutiveSummaryCSV({
      totalVolume,
      totalCommission,
      dealsCount: deals.length,
      propertiesCount: properties.length,
      activeLeadsCount: leads.length,
      customersCount: customers.length,
      localities,
      agentLeaderboard,
    });
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Peshawar Market Intelligence & Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Locality demand patterns, transaction volumes, and agent commission performance.
          </p>
        </div>

        {/* Action / Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* PDF Print Button */}
          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-xs"
            title="Generate executive PDF report for printing or saving"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Export / Print PDF</span>
          </button>

          {/* CSV Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 py-2 divide-y divide-slate-800 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Data Export
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleExportExecutiveCSV}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <div>
                        <span className="font-semibold block">Full Executive Summary</span>
                        <span className="text-[10px] text-slate-400">KPIs, localities & agents</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportDealsToCSV(deals);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <span className="font-semibold block">Deals & Commission CSV</span>
                        <span className="text-[10px] text-slate-400">{deals.length} Closed & Active Deals</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportPropertiesToCSV(properties);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Building className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <span className="font-semibold block">Property Inventory CSV</span>
                        <span className="text-[10px] text-slate-400">{properties.length} Peshawar Listings</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportLeadsToCSV(leads);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <div>
                        <span className="font-semibold block">Leads Pipeline CSV</span>
                        <span className="text-[10px] text-slate-400">{leads.length} Inquiries & Prospects</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportCustomersToCSV(customers);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <div>
                        <span className="font-semibold block">Customer CRM Records CSV</span>
                        <span className="text-[10px] text-slate-400">{customers.length} Registered Clients</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Gross Sales Value</span>
          <p className="text-2xl font-bold text-white mt-2">{formatPKR(totalVolume)}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            ↑ +18.4% vs last quarter
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Agency Net</span>
          <p className="text-2xl font-bold text-blue-400 mt-2">{formatPKR(totalCommission)}</p>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Direct broker commission
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Customers</span>
          <p className="text-2xl font-bold text-white mt-2">{customers.length}</p>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            {leads.length} Active leads
          </span>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Deal Turnaround</span>
          <p className="text-2xl font-bold text-white mt-2">14 Days</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            Fast token-to-registry speed
          </span>
        </div>
      </div>

      {/* Quick Export Hub Panel */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Manager Data Export Hub</h3>
            <p className="text-xs text-slate-400">
              Download clean spreadsheet reports (Excel/Google Sheets compatible) or export formal PDF printouts.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportExecutiveCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            Executive CSV
          </button>
          <button
            type="button"
            onClick={() => exportDealsToCSV(deals)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            Deals CSV
          </button>
          <button
            type="button"
            onClick={() => exportPropertiesToCSV(properties)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-amber-400" />
            Listings CSV
          </button>
          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            PDF Report
          </button>
        </div>
      </div>

      {/* 2-Column Visual Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Locality Market Share */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                Peshawar Locality Demand & Volume
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-400">Market Share</span>
          </div>

          <div className="space-y-4 pt-2">
            {localities.map((loc) => (
              <div key={loc.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-200 font-semibold">{loc.name}</span>
                  <span className="text-slate-400">
                    {loc.volume} ({loc.share}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${loc.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Asset Type Breakdown</h3>
            </div>
            <span className="text-xs font-medium text-slate-400">Inventory Distribution</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Luxury Houses</span>
              <span className="text-xl font-bold text-white mt-1 block">52%</span>
              <span className="text-[10px] text-slate-500">Hayatabad & Regi Bungalows</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Residential Plots</span>
              <span className="text-xl font-bold text-white mt-1 block">28%</span>
              <span className="text-[10px] text-slate-500">DHA & Regi Sectors</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Commercial Plazas</span>
              <span className="text-xl font-bold text-white mt-1 block">12%</span>
              <span className="text-[10px] text-slate-500">Ring Road & Saddar Shops</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Rental Portions</span>
              <span className="text-xl font-bold text-white mt-1 block">8%</span>
              <span className="text-[10px] text-slate-500">Family Rentals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance Leaderboard */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Staff & Broker Performance Leaderboard
            </h3>
          </div>
          <span className="text-xs text-slate-400">Peshawar Branch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Dealer Specialist</th>
                <th className="px-6 py-4">Closed Deals</th>
                <th className="px-6 py-4">Closed Volume</th>
                <th className="px-6 py-4">Commission Generated</th>
                <th className="px-6 py-4">Client Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
              {agentLeaderboard.map((agent) => (
                <tr key={agent.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    {agent.name}
                    <span className="text-[10px] text-slate-500 block font-normal">
                      {agent.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{agent.deals} Deals</td>
                  <td className="px-6 py-4 font-bold text-white">{agent.volume}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-400">{agent.commission}</td>
                  <td className="px-6 py-4 text-amber-400 font-bold">{agent.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

