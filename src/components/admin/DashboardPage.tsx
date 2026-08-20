import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { formatPKR, calculatePropertyMatch } from '../../utils/formatters';
import { WhatsAppModal, CallModal } from '../common/CommunicationModals';
import {
  Home,
  Users,
  GitPullRequest,
  CalendarClock,
  Briefcase,
  TrendingUp,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { FollowUp, Lead } from '../../types';

export const DashboardPage: React.FC = () => {
  const {
    properties,
    leads,
    customers,
    followUps,
    deals,
    currentUser,
    updateFollowUpStatus,
    updateLeadStage,
  } = useApp();

  const navigate = useNavigate();

  // Communication modal states
  const [activeWhatsApp, setActiveWhatsApp] = useState<{
    isOpen: boolean;
    name: string;
    phone: string;
    propertyTitle?: string;
    customerId?: string;
  }>({ isOpen: false, name: '', phone: '' });

  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    name: string;
    phone: string;
    customerId?: string;
  }>({ isOpen: false, name: '', phone: '' });

  // Calculations
  const activePropertiesCount = properties.filter((p) => p.status === 'available').length;
  const underTokenCount = properties.filter((p) => p.status === 'under_token').length;
  const newLeads = leads.filter((l) => l.status === 'new');
  const pendingFollowUps = followUps.filter((f) => f.status === 'pending');
  const totalClosedDealsValue = deals
    .filter((d) => d.status === 'completed')
    .reduce((acc, d) => acc + d.finalPrice, 0);
  const totalCommissionEarned = deals
    .filter((d) => d.status === 'completed')
    .reduce((acc, d) => acc + d.commissionEarned, 0);

  // Today's Follow-ups
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysFollowUps = followUps.filter((f) => f.status === 'pending');

  // Peshawar Area distribution
  const areaCounts = {
    Hayatabad: properties.filter((p) => p.location?.area?.includes('Hayatabad')).length,
    'DHA Peshawar': properties.filter((p) => p.location?.area?.includes('DHA')).length,
    'University Town': properties.filter((p) => p.location?.area?.includes('University')).length,
    'Regi Model Town': properties.filter((p) => p.location?.area?.includes('Regi')).length,
    'Warsak / Ring Road': properties.filter(
      (p) => p.location?.area?.includes('Warsak') || p.location?.area?.includes('Ring')
    ).length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Assalam-o-Alaikum, {currentUser.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Peshawar Property Desk • {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Link>
          <Link
            to="/admin/leads"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <GitPullRequest className="w-4 h-4 text-blue-400" />
            Lead Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Inventory"
          value={activePropertiesCount}
          subtitle={`${underTokenCount} under token deposit`}
          icon={Home}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-400"
          trend={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title="Leads Pipeline"
          value={leads.length}
          subtitle={`${newLeads.length} urgent new inquiries`}
          icon={GitPullRequest}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-400"
          trend={{ value: `${newLeads.length} new`, isPositive: true }}
        />
        <StatCard
          title="Pending Follow-ups"
          value={pendingFollowUps.length}
          subtitle="Site visits & calls queued"
          icon={CalendarClock}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-400"
        />
        <StatCard
          title="Closed Sales Volume"
          value={formatPKR(totalClosedDealsValue)}
          subtitle={`Commission: ${formatPKR(totalCommissionEarned)}`}
          icon={Briefcase}
          iconBgColor="bg-purple-500/10"
          iconColor="text-purple-400"
          trend={{ value: '18%', isPositive: true }}
        />
      </div>

      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Follow-ups & Peshawar Locality Breakdown (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Priority Follow-ups Widget */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Today’s Follow-ups & Site Visits
                  </h3>
                  <p className="text-xs text-slate-400">
                    {todaysFollowUps.length} tasks scheduled with Peshawar buyers & sellers
                  </p>
                </div>
              </div>
              <Link
                to="/admin/followups"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {todaysFollowUps.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No pending follow-ups for today. Great job!
                </p>
              ) : (
                todaysFollowUps.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    className="p-3.5 bg-slate-950/60 hover:bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{f.customerName}</span>
                        <StatusBadge status={f.type} />
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {f.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {f.propertyTitle ? `Regarding: ${f.propertyTitle}` : f.notes}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCall({
                            isOpen: true,
                            name: f.customerName,
                            phone: f.phone,
                            customerId: f.customerId,
                          })
                        }
                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition-colors"
                        title="Call Client"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveWhatsApp({
                            isOpen: true,
                            name: f.customerName,
                            phone: f.phone,
                            propertyTitle: f.propertyTitle,
                            customerId: f.customerId,
                          })
                        }
                        className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
                        title="WhatsApp Client"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateFollowUpStatus(f.id, 'completed')}
                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 text-xs font-bold transition-colors"
                        title="Mark Complete"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Peshawar Locality Inventory Distribution */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Peshawar Sector Inventory Distribution
                  </h3>
                  <p className="text-xs text-slate-400">Live active listings by locality</p>
                </div>
              </div>
              <Link to="/admin/properties" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Manage Stock →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(areaCounts).map(([area, count]) => (
                <div key={area} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block truncate">
                    {area}
                  </span>
                  <span className="text-lg font-bold text-white mt-1 block">
                    {count} Units
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Inquiries & Fast Action Stream (1 col) */}
        <div className="space-y-6">
          {/* New Leads Box */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recent Inquiries</h3>
                  <p className="text-xs text-slate-400">New leads from web portal</p>
                </div>
              </div>
              <Link to="/admin/leads" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                View Pipeline →
              </Link>
            </div>

            <div className="space-y-2.5">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{lead.customerName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1">
                    {lead.propertyTitle || lead.notes}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Budget: {lead.budget ? formatPKR(lead.budget) : 'Flexible'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveWhatsApp({
                            isOpen: true,
                            name: lead.customerName,
                            phone: lead.phone,
                            propertyTitle: lead.propertyTitle,
                            customerId: lead.customerId,
                          })
                        }
                        className="text-emerald-400 hover:text-emerald-300 p-1 font-semibold flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Dealer Quick Tools
            </span>
            <h4 className="text-sm font-bold text-white">Need to match a client quickly?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the Customer CRM to run real-time matching algorithms on Hayatabad & DHA Peshawar plots.
            </p>
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Open Customer Matching
            </Link>
          </div>
        </div>
      </div>

      {/* Communication Modals */}
      {activeWhatsApp.isOpen && (
        <WhatsAppModal
          isOpen={true}
          onClose={() => setActiveWhatsApp({ isOpen: false, name: '', phone: '' })}
          recipientName={activeWhatsApp.name}
          phone={activeWhatsApp.phone}
          propertyTitle={activeWhatsApp.propertyTitle}
          customerId={activeWhatsApp.customerId}
        />
      )}

      {activeCall.isOpen && (
        <CallModal
          isOpen={true}
          onClose={() => setActiveCall({ isOpen: false, name: '', phone: '' })}
          recipientName={activeCall.name}
          phone={activeCall.phone}
          customerId={activeCall.customerId}
        />
      )}
    </div>
  );
};
