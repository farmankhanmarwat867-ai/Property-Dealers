import React, { useState } from 'react';
import { CustomerRequirement, Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculatePropertyMatch, PropertyMatchResult } from '../../utils/formatters';
import { WhatsAppModal, CallModal } from '../common/CommunicationModals';
import { Sparkles, CheckCircle, AlertCircle, Share2, Eye, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyMatchingWidgetProps {
  requirement: CustomerRequirement;
  customerName: string;
  customerPhone: string;
  customerId: string;
}

export const PropertyMatchingWidget: React.FC<PropertyMatchingWidgetProps> = ({
  requirement,
  customerName,
  customerPhone,
  customerId,
}) => {
  const { properties, addFollowUp } = useApp();
  const [selectedPropForWhatsApp, setSelectedPropForWhatsApp] = useState<Property | null>(null);

  // Compute matches
  const matchResults: PropertyMatchResult[] = properties
    .filter((p) => p.status === 'available')
    .map((p) => calculatePropertyMatch(requirement, p))
    .filter((r) => r.score >= 40)
    .sort((a, b) => b.score - a.score);

  const handleScheduleViewing = (prop: Property) => {
    addFollowUp({
      customerId,
      customerName,
      phone: customerPhone,
      propertyId: prop.id,
      propertyTitle: prop.title,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '16:30',
      type: 'Site Visit',
      priority: 'high',
      notes: `Scheduled site visit with ${customerName} for ${prop.title} (${prop.location.area}).`,
      status: 'pending',
      assignedAgent: prop.agent.name,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Inventory Match</h4>
            <p className="text-xs text-slate-400">
              Found {matchResults.length} matching properties for {customerName}’s criteria
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          Auto-Scoring Active
        </span>
      </div>

      {matchResults.length === 0 ? (
        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-300">No Direct Matches Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try broadening customer locations or adjusting budget range in their requirement profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {matchResults.slice(0, 4).map(({ property, score, matchedCriteria, unmatchedCriteria }) => (
            <div
              key={property.id}
              className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      score >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : score >= 60
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {score}% Match
                  </span>
                  <span className="text-xs font-bold text-white">
                    {property.priceFormatted}
                  </span>
                </div>

                <div className="flex gap-3">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-700 bg-slate-900"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                      {property.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {property.location.area} • {property.areaValue} {property.areaUnit}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {matchedCriteria.slice(0, 2).map((crit, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5"
                        >
                          <CheckCircle className="w-2.5 h-2.5" />
                          {crit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800 text-xs">
                <Link
                  to={`/properties/${property.slug || property.id}`}
                  target="_blank"
                  className="text-slate-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPropForWhatsApp(property)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/30 flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    Share WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScheduleViewing(property)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-200 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-slate-700 flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp Modal for Selected Property */}
      {selectedPropForWhatsApp && (
        <WhatsAppModal
          isOpen={true}
          onClose={() => setSelectedPropForWhatsApp(null)}
          recipientName={customerName}
          phone={customerPhone}
          propertyTitle={selectedPropForWhatsApp.title}
          customerId={customerId}
          defaultMessage={`Assalam-o-Alaikum ${customerName}, based on your requirement for Peshawar property, here is an exact match: ${selectedPropForWhatsApp.title} in ${selectedPropForWhatsApp.location.area} (Demand: ${selectedPropForWhatsApp.priceFormatted}). Let me know if you would like to inspect the site!`}
        />
      )}
    </div>
  );
};
