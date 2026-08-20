import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { PropertyMatchingWidget } from './PropertyMatchingWidget';
import { WhatsAppModal, CallModal } from '../common/CommunicationModals';
import { formatPKR } from '../../utils/formatters';
import { PESHAWAR_LOCATIONS } from '../../data/mockData';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const CustomersCRMPage: React.FC = () => {
  const {
    customers,
    addCustomer,
    addCustomerTimelineEvent,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Timeline note state
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'call' | 'whatsapp' | 'visit'>('note');

  // Communication Modals
  const [activeWhatsApp, setActiveWhatsApp] = useState<{
    isOpen: boolean;
    name: string;
    phone: string;
    customerId?: string;
  }>({ isOpen: false, name: '', phone: '' });

  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    name: string;
    phone: string;
    customerId?: string;
  }>({ isOpen: false, name: '', phone: '' });

  // Add Customer Form
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'buyer' as CustomerType,
    locations: ['Hayatabad Phase 3'],
    purpose: 'sale' as 'sale' | 'rent',
    propertyType: 'house' as any,
    minBudget: '20000000',
    maxBudget: '35000000',
    minArea: '10',
    maxArea: '10',
    areaUnit: 'Marla' as any,
    notes: 'Looking for ready possession with underground gas in Peshawar.',
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesPhone = c.phone?.includes(q);
        const locations = c.requirement?.preferredLocations || (c.requirement as any)?.locations || [];
        const matchesLoc = Array.isArray(locations) && locations.some((l: string) => l?.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesLoc) return false;
      }
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      return true;
    });
  }, [customers, searchQuery, typeFilter]);

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: newCustomerData.name,
      phone: newCustomerData.phone,
      email: newCustomerData.email,
      city: 'Peshawar',
      type: newCustomerData.type,
      status: 'new',
      budget: Number(newCustomerData.maxBudget) || 0,
      budgetFormatted: formatPKR(Number(newCustomerData.maxBudget) || 0),
      interestedPropertyIds: [],
      lastContact: new Date().toISOString().split('T')[0],
      notes: newCustomerData.notes,
      assignedAgent: currentUser.name,
      requirement: {
        purpose: newCustomerData.purpose,
        propertyType: [newCustomerData.propertyType],
        preferredLocations: newCustomerData.locations,
        minBudget: Number(newCustomerData.minBudget) || 0,
        maxBudget: Number(newCustomerData.maxBudget) || 0,
        minArea: Number(newCustomerData.minArea) || 0,
        maxArea: Number(newCustomerData.maxArea) || 0,
        areaUnit: newCustomerData.areaUnit,
        minBedrooms: 4,
        notes: newCustomerData.notes,
      },
    });
    setIsAddCustomerOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;
    addCustomerTimelineEvent(selectedCustomer.id, {
      type: noteType,
      title: `${noteType.toUpperCase()} Logged`,
      description: newNote,
      agentName: currentUser.name,
    });
    setNewNote('');
    // Refresh selected customer state
    const updated = customers.find((c) => c.id === selectedCustomer.id);
    if (updated) setSelectedCustomer(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Peshawar Customer CRM & Matching
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage buyers, sellers, investors, and automated property inventory matching.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {/* Main 2-Pane CRM Layout: Customer List (Left) + Detailed Profile & Matcher (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Customer Directory (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-[750px]">
          {/* Search & Segment Tabs */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, phone, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {['all', 'buyer', 'seller', 'investor', 'tenant'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-lg capitalize shrink-0 transition-colors ${
                    typeFilter === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredCustomers.map((customer) => {
              const isSelected = selectedCustomer?.id === customer.id;
              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-4 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-blue-600/10 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{customer.name}</h4>
                      <StatusBadge status={customer.type} />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{customer.phone}</p>
                    {customer.requirement && (
                      <p className="text-[11px] text-slate-300 font-medium truncate">
                        {customer.requirement.minArea || 5}-{customer.requirement.maxArea || 20}{' '}
                        {customer.requirement.areaUnit || 'Marla'} in{' '}
                        {customer.requirement.preferredLocations?.[0] || (customer.requirement as any).locations?.[0] || 'Peshawar'}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {customer.requirement && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md block mb-1">
                        {formatPKR(customer.requirement.maxBudget)}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 ml-auto text-slate-500 ${
                        isSelected ? 'text-blue-400' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Selected Customer Profile, AI Matching, Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCustomer ? (
            <>
              {/* Customer Header Card */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedCustomer.name}</h2>
                      <StatusBadge status={selectedCustomer.type} />
                    </div>
                    <p className="text-xs text-slate-400">
                      Assigned Agent: {selectedCustomer.assignedAgent} • Registered on{' '}
                      {selectedCustomer.createdDate}
                    </p>
                  </div>

                  {/* Call & WhatsApp buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCall({
                          isOpen: true,
                          name: selectedCustomer.name,
                          phone: selectedCustomer.phone,
                          customerId: selectedCustomer.id,
                        })
                      }
                      className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      Call
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveWhatsApp({
                          isOpen: true,
                          name: selectedCustomer.name,
                          phone: selectedCustomer.phone,
                          customerId: selectedCustomer.id,
                        })
                      }
                      className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  </div>
                </div>

                {/* Requirement Overview */}
                {selectedCustomer.requirement && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Target Locations
                      </span>
                      <span className="font-bold text-slate-200 block truncate">
                        {(selectedCustomer.requirement.preferredLocations || (selectedCustomer.requirement as any).locations || ['All Peshawar']).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Budget Range
                      </span>
                      <span className="font-bold text-white block">
                        {formatPKR(selectedCustomer.requirement.minBudget || 0)} –{' '}
                        {formatPKR(selectedCustomer.requirement.maxBudget || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Area / Type
                      </span>
                      <span className="font-bold text-slate-200 block capitalize">
                        {selectedCustomer.requirement.minArea || 5}{' '}
                        {selectedCustomer.requirement.areaUnit || 'Marla'} (
                        {Array.isArray(selectedCustomer.requirement.propertyType)
                          ? selectedCustomer.requirement.propertyType.join(', ')
                          : (selectedCustomer.requirement as any).type || 'All'}
                        )
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* AUTOMATED INVENTORY MATCHING WIDGET */}
              {selectedCustomer.requirement && (
                <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
                  <PropertyMatchingWidget
                    requirement={selectedCustomer.requirement}
                    customerName={selectedCustomer.name}
                    customerPhone={selectedCustomer.phone}
                    customerId={selectedCustomer.id}
                  />
                </div>
              )}

              {/* Communication Timeline & Interaction Log */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Communication & Activity Log</h3>
                  <span className="text-xs text-slate-400">
                    {selectedCustomer.timeline.length} Interactions
                  </span>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as any)}
                      className="text-xs font-semibold p-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none shrink-0"
                    >
                      <option value="note">📝 General Note</option>
                      <option value="call">📞 Phone Call</option>
                      <option value="whatsapp">💬 WhatsApp Message</option>
                      <option value="visit">🚗 Site Visit Inspection</option>
                    </select>

                    <input
                      type="text"
                      required
                      placeholder="Add summary note or client feedback..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </form>

                {/* Timeline Items */}
                <div className="space-y-3 pt-2">
                  {selectedCustomer.timeline.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-300 font-bold">
                        {event.type === 'call'
                          ? '📞'
                          : event.type === 'whatsapp'
                          ? '💬'
                          : event.type === 'visit'
                          ? '🚗'
                          : '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-bold text-white">{event.title}</h5>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{event.description}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Logged by: {event.agentName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center">
              <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Select a customer from the left to view profile.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        title="Add New Customer to Peshawar CRM"
        subtitle="Record contact details & property requirements for automated matching"
        maxWidth="xl"
      >
        <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Major (R) Tariq Khattak"
                value={newCustomerData.name}
                onChange={(e) =>
                  setNewCustomerData({ ...newCustomerData, name: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mobile / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={newCustomerData.phone}
                onChange={(e) =>
                  setNewCustomerData({ ...newCustomerData, phone: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Type</label>
              <select
                value={newCustomerData.type}
                onChange={(e) =>
                  setNewCustomerData({
                    ...newCustomerData,
                    type: e.target.value as CustomerType,
                  })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="buyer">Buyer (Purchaser)</option>
                <option value="seller">Seller (Owner)</option>
                <option value="investor">Investor (Plots/Commercial)</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Sector</label>
              <select
                value={newCustomerData.locations?.[0] || 'Hayatabad Phase 3'}
                onChange={(e) =>
                  setNewCustomerData({ ...newCustomerData, locations: [e.target.value] })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                {PESHAWAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max Budget (PKR)
              </label>
              <input
                type="number"
                value={newCustomerData.maxBudget}
                onChange={(e) =>
                  setNewCustomerData({ ...newCustomerData, maxBudget: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Area Size (Marla)
              </label>
              <input
                type="number"
                value={newCustomerData.maxArea}
                onChange={(e) =>
                  setNewCustomerData({ ...newCustomerData, maxArea: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Client Notes</label>
            <textarea
              rows={2}
              value={newCustomerData.notes}
              onChange={(e) =>
                setNewCustomerData({ ...newCustomerData, notes: e.target.value })
              }
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddCustomerOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
            >
              Save Customer & Find Matches
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
