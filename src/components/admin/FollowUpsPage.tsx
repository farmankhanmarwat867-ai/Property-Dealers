import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUp, FollowUpStatus, FollowUpType, PriorityLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { WhatsAppModal, CallModal } from '../common/CommunicationModals';
import {
  CalendarClock,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Search,
} from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const { followUps, addFollowUp, updateFollowUpStatus, currentUser, properties } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  // Add Follow-up form
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    propertyTitle: '',
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    type: 'Site Visit' as FollowUpType,
    priority: 'high' as PriorityLevel,
    notes: 'Coordinate physical visit with owner and key handover.',
  });

  const filteredFollowUps = followUps.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.customerName.toLowerCase().includes(q) ||
        f.phone.includes(q) ||
        (f.propertyTitle && f.propertyTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addFollowUp({
      customerName: formData.customerName,
      phone: formData.phone,
      propertyTitle: formData.propertyTitle,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      priority: formData.priority,
      notes: formData.notes,
      status: 'pending',
      assignedAgent: currentUser.name,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Peshawar Follow-up & Site Visit Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Keep track of client calls, on-site walkthroughs, token negotiations, and registry visits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'pending', label: 'Pending / Due' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'all', label: 'All Tasks' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search follow-ups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 pl-9 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm divide-y divide-slate-800 overflow-hidden">
        {filteredFollowUps.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CalendarClock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">No follow-ups found for this filter.</p>
          </div>
        ) : (
          filteredFollowUps.map((f) => (
            <div
              key={f.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
            >
              {/* Task Details */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white">{f.customerName}</h3>
                  <span className="text-xs text-slate-400 font-mono">({f.phone})</span>
                  <StatusBadge status={f.type} />
                  <StatusBadge status={f.priority} />
                  <StatusBadge status={f.status} />
                </div>

                {f.propertyTitle && (
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    🏠 {f.propertyTitle}
                  </p>
                )}

                <p className="text-xs text-slate-300">{f.notes}</p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {f.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {f.time}
                  </span>
                  <span>• Assigned: {f.assignedAgent}</span>
                </div>
              </div>

              {/* Actions */}
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
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  Call
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
                  className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </button>

                {f.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => updateFollowUpStatus(f.id, 'completed')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Done
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Follow-up Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Follow-up or Site Visit"
        subtitle="Set reminders for property inspections, client calls, and negotiations"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Salman Afridi"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Regarding Property</label>
            <input
              type="text"
              placeholder="e.g. 1 Kanal Designer Bungalow, Hayatabad Phase 2"
              value={formData.propertyTitle}
              onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as FollowUpType })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="Site Visit">Site Visit</option>
                <option value="Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Meeting">Office Meeting</option>
                <option value="Document Collection">Document Collection</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as PriorityLevel })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
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
              Schedule Follow-up
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
