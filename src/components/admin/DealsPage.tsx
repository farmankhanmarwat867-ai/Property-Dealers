import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, DealStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatPKR } from '../../utils/formatters';
import {
  Briefcase,
  Plus,
  DollarSign,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  TrendingUp,
  Search,
} from 'lucide-react';

export const DealsPage: React.FC = () => {
  const { deals, addDeal, currentUser, properties } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add deal form
  const [formData, setFormData] = useState({
    propertyTitle: '10 Marla Luxury House, Sector F-3, Hayatabad',
    buyerName: 'Haji Gulzar Khan',
    buyerPhone: '+92 300 9998877',
    sellerName: 'Malik Jahangir',
    sellerPhone: '+92 333 4445566',
    finalPrice: '38000000',
    commissionEarned: '760000', // 2% default
    status: 'token_deposited' as DealStatus,
    closingDate: new Date().toISOString().split('T')[0],
    notes: 'Token of Rs. 10 Lac deposited. Registry scheduled with Sub-Registrar Peshawar.',
  });

  const completedDeals = deals.filter((d) => d.status === 'completed');
  const activeDeals = deals.filter((d) => d.status !== 'completed' && d.status !== 'cancelled');

  const totalVolume = completedDeals.reduce((acc, d) => acc + d.finalPrice, 0);
  const totalCommission = completedDeals.reduce((acc, d) => acc + d.commissionEarned, 0);

  const filteredDeals = deals.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.propertyTitle.toLowerCase().includes(q) ||
        d.buyerName.toLowerCase().includes(q) ||
        d.sellerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      propertyTitle: formData.propertyTitle,
      buyerName: formData.buyerName,
      buyerPhone: formData.buyerPhone,
      sellerName: formData.sellerName,
      sellerPhone: formData.sellerPhone,
      finalPrice: Number(formData.finalPrice),
      commissionEarned: Number(formData.commissionEarned),
      status: formData.status,
      closingDate: formData.closingDate,
      assignedAgent: currentUser.name,
      notes: formData.notes,
    });
    setIsAddModalOpen(false);
  };

  const handlePriceChange = (val: string) => {
    const price = Number(val) || 0;
    const defaultComm = Math.round(price * 0.02); // standard 2% dealer commission
    setFormData((prev) => ({
      ...prev,
      finalPrice: val,
      commissionEarned: String(defaultComm),
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Peshawar Deal Pipeline & Sales Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor buyer-seller transactions, tokens, registry progress, and agency commissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Record New Deal
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Closed Volume</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{formatPKR(totalVolume)}</p>
          <p className="text-xs text-slate-400 mt-1">{completedDeals.length} completed transactions</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Commission Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">{formatPKR(totalCommission)}</p>
          <p className="text-xs text-slate-400 mt-1">Average 2% (Buyer 1% + Seller 1%)</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Deals in Pipeline</span>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{activeDeals.length} Active</p>
          <p className="text-xs text-slate-400 mt-1">Under token & registry verification</p>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Transaction History</h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2 pl-9 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Property & Date</th>
                <th className="px-6 py-4">Buyer Details</th>
                <th className="px-6 py-4">Seller Details</th>
                <th className="px-6 py-4">Agreed Deal Price</th>
                <th className="px-6 py-4">Commission</th>
                <th className="px-6 py-4">Deal Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-white block">{deal.propertyTitle}</span>
                    <span className="text-[10px] text-slate-500">Date: {deal.closingDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-white block">{deal.buyerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{deal.buyerPhone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-white block">{deal.sellerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{deal.sellerPhone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-white block">
                      {formatPKR(deal.finalPrice)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-emerald-400 block">
                      {formatPKR(deal.commissionEarned)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={deal.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Deal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Closed Property Deal"
        subtitle="Log transaction figures, buyer/seller contacts, and agency commission"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDeal} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Property Title *</label>
            <input
              type="text"
              required
              value={formData.propertyTitle}
              onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Buyer Name *</label>
              <input
                type="text"
                required
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Buyer Mobile *</label>
              <input
                type="tel"
                required
                value={formData.buyerPhone}
                onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Seller Name *</label>
              <input
                type="text"
                required
                value={formData.sellerName}
                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Seller Mobile *</label>
              <input
                type="tel"
                required
                value={formData.sellerPhone}
                onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Agreed Final Price (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.finalPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">
                {formatPKR(Number(formData.finalPrice))}
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Commission Earned (PKR)
              </label>
              <input
                type="number"
                value={formData.commissionEarned}
                onChange={(e) =>
                  setFormData({ ...formData, commissionEarned: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <span className="text-[11px] font-semibold text-blue-400 mt-1 block">
                {formatPKR(Number(formData.commissionEarned))}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Deal Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as DealStatus })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="token_deposited">Token Deposited</option>
                <option value="agreement_signed">Agreement Signed</option>
                <option value="registry_in_progress">Registry in Progress</option>
                <option value="completed">Completed / Keys Handed Over</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Closing Date</label>
              <input
                type="date"
                value={formData.closingDate}
                onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
            >
              Save to Deal Ledger
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
