import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatPKR } from '../../utils/formatters';
import { WhatsAppModal, CallModal } from '../common/CommunicationModals';
import {
  GitPullRequest,
  Plus,
  Phone,
  MessageSquare,
  Calendar,
  MoreVertical,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const LeadPipelinePage: React.FC = () => {
  const { leads, updateLeadStage, addLead, currentUser, addFollowUp } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Communication Modals
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

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    propertyTitle: '',
    budget: '25000000',
    source: 'Website Inquiry',
    status: 'new' as LeadStatus,
    notes: 'Inquired for 10 Marla property in Hayatabad.',
  });

  const columns: { id: LeadStatus; title: string; color: string; badge: string }[] = [
    { id: 'new', title: 'New Inquiries', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
    { id: 'contacted', title: 'Initial Contact', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { id: 'qualified', title: 'Requirement Qualified', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
    { id: 'site_visit_scheduled', title: 'Site Visit Scheduled', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    { id: 'negotiation', title: 'Token & Negotiation', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
    { id: 'won', title: 'Closed Won', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { id: 'lost', title: 'Lost / Inactive', color: 'border-slate-800 bg-slate-900/60', badge: 'bg-slate-800 text-slate-400 border border-slate-700' },
  ];

  const filteredLeads = leads.filter((l) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.customerName.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.propertyTitle && l.propertyTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      customerName: newLeadForm.customerName,
      phone: newLeadForm.phone,
      email: newLeadForm.email,
      propertyTitle: newLeadForm.propertyTitle,
      budget: Number(newLeadForm.budget),
      source: newLeadForm.source,
      status: newLeadForm.status,
      notes: newLeadForm.notes,
      assignedAgent: currentUser.name,
    });
    setIsAddLeadOpen(false);
  };

  const handleScheduleVisit = (lead: Lead) => {
    addFollowUp({
      customerName: lead.customerName,
      phone: lead.phone,
      customerId: lead.customerId,
      propertyId: lead.propertyId,
      propertyTitle: lead.propertyTitle,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '16:00',
      type: 'Site Visit',
      priority: 'high',
      notes: `Scheduled site inspection for ${lead.propertyTitle || 'Peshawar property'}.`,
      status: 'pending',
      assignedAgent: lead.assignedAgent,
    });
    updateLeadStage(lead.id, 'site_visit_scheduled');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Peshawar Lead Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track inquiries from initial web contact to on-site inspections and closed sales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2 pl-9 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddLeadOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[600px]">
        {columns.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.status === col.id);
          return (
            <div
              key={col.id}
              className={`w-72 shrink-0 rounded-xl border ${col.color} p-3 flex flex-col max-h-[750px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${col.badge}`}>
                    {colLeads.length}
                  </span>
                </div>
              </div>

              {/* Column Cards Container */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 shadow-sm hover:border-slate-700 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="text-xs font-bold text-white">{lead.customerName}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                        {lead.source}
                      </span>
                    </div>

                    {lead.propertyTitle && (
                      <p className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20 line-clamp-2">
                        {lead.propertyTitle}
                      </p>
                    )}

                    {lead.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">{lead.notes}</p>
                    )}

                    {lead.budget && (
                      <div className="text-[11px] font-bold text-white flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-normal">Budget</span>
                        <span>{formatPKR(lead.budget)}</span>
                      </div>
                    )}

                    {/* Stage Selector Dropdown */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStage(lead.id, e.target.value as LeadStatus)
                        }
                        className="text-[10px] font-bold py-1 px-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 outline-none w-32"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="site_visit_scheduled">Site Visit</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Closed Won</option>
                        <option value="lost">Lost</option>
                      </select>

                      {/* Action icons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCall({
                              isOpen: true,
                              name: lead.customerName,
                              phone: lead.phone,
                              customerId: lead.customerId,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Call Lead"
                        >
                          <Phone className="w-3 h-3 text-blue-400" />
                        </button>
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
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="WhatsApp Lead"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScheduleVisit(lead)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Schedule Site Visit"
                        >
                          <Calendar className="w-3 h-3 text-purple-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        title="Record New Property Lead"
        subtitle="Add prospective buyer or tenant to the Peshawar deal pipeline"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sardar Ali Khan"
                value={newLeadForm.customerName}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, customerName: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={newLeadForm.phone}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Property / Area</label>
              <input
                type="text"
                placeholder="e.g. 10 Marla House in Hayatabad Phase 3"
                value={newLeadForm.propertyTitle}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, propertyTitle: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Budget (PKR)</label>
              <input
                type="number"
                value={newLeadForm.budget}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lead Source</label>
              <select
                value={newLeadForm.source}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="Website Inquiry">Website Inquiry</option>
                <option value="WhatsApp Direct">WhatsApp Direct</option>
                <option value="Office Walk-in">Office Walk-in (Saddar/Hayatabad)</option>
                <option value="Referral">Client Referral</option>
                <option value="Zameen/OLX Ad">Property Portal Ad</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Initial Stage</label>
              <select
                value={newLeadForm.status}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, status: e.target.value as LeadStatus })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="new">New Inquiries</option>
                <option value="contacted">Initial Contact</option>
                <option value="qualified">Requirement Qualified</option>
                <option value="site_visit_scheduled">Site Visit Scheduled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Inquiry Notes</label>
            <textarea
              rows={2}
              value={newLeadForm.notes}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
            >
              Add to Pipeline
            </button>
          </div>
        </form>
      </Modal>

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
