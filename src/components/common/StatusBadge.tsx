import React from 'react';
import { PropertyStatus, LeadStatus, LeadPriority, FollowUpStatus, DealStatus, CustomerStatus } from '../../types';

interface StatusBadgeProps {
  status: PropertyStatus | LeadStatus | LeadPriority | FollowUpStatus | DealStatus | CustomerStatus | string;
  type?: 'property' | 'lead' | 'priority' | 'followup' | 'deal' | 'customer';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'property', size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold uppercase tracking-tight rounded',
    md: 'text-xs px-2.5 py-1 font-semibold rounded',
    lg: 'text-sm px-3 py-1.5 font-semibold rounded-md',
  }[size];

  const getStyle = () => {
    const s = String(status).toLowerCase();

    // Property Status
    if (s === 'available') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (s === 'reserved') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (s === 'sold') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (s === 'rented') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

    // Lead Priority
    if (s === 'hot') return 'bg-red-500/15 text-red-400 border border-red-500/30';
    if (s === 'warm') return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
    if (s === 'cold') return 'bg-slate-500/15 text-slate-400 border border-slate-700';

    // Lead Status
    if (s === 'new') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    if (s === 'contacted') return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    if (s === 'qualified') return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
    if (s === 'site_visit_scheduled' || s === 'viewing') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    if (s === 'negotiation') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (s === 'won') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold';
    if (s === 'lost') return 'bg-slate-800 text-slate-400 border border-slate-700';

    // Follow-up Status
    if (s === 'pending') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    if (s === 'completed') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (s === 'overdue') return 'bg-red-500/15 text-red-400 border border-red-500/30';
    if (s === 'cancelled') return 'bg-slate-800 text-slate-500 border border-slate-700';

    // Deal Status
    if (s === 'agreement') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';

    // Customer Status
    if (s === 'interested') return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    if (s === 'converted') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';

    return 'bg-slate-800 text-slate-300 border border-slate-700';
  };

  const formatText = (text: string) => {
    if (text === 'won') return 'Deal Won';
    if (text === 'hot') return 'Hot Lead';
    if (text === 'warm') return 'Warm';
    if (text === 'cold') return 'Cold';
    if (text === 'site_visit_scheduled') return 'Site Visit';
    return text.replace(/_/g, ' ');
  };

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses} ${getStyle()}`}>
      {formatText(String(status))}
    </span>
  );
};
