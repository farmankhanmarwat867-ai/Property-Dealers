import React, { useState } from 'react';
import { Modal } from './Modal';
import { Phone, MessageSquare, Copy, Check, ExternalLink, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  phone: string;
  propertyTitle?: string;
  defaultMessage?: string;
  customerId?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  phone,
  propertyTitle,
  defaultMessage,
  customerId,
}) => {
  const { addCustomerTimelineEvent, showToast } = useApp();
  const [message, setMessage] = useState(
    defaultMessage ||
      `Assalam-o-Alaikum ${recipientName}, this is regarding your inquiry for "${propertyTitle || 'Property in Peshawar'}". When would be a good time for a brief call or site visit?`
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    showToast('Message Copied to Clipboard', 'You can now paste it directly into WhatsApp.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulated = () => {
    if (customerId) {
      addCustomerTimelineEvent(customerId, {
        type: 'whatsapp',
        title: 'WhatsApp Message Sent',
        description: `Sent message: "${message.slice(0, 80)}..."`,
      });
    }
    showToast('WhatsApp Dispatched (Simulated)', `Message sent to ${recipientName} (${phone})`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Conversation"
      subtitle={`Direct chat with ${recipientName}`}
      maxWidth="md"
      id="whatsapp-simulator-modal"
    >
      <div className="space-y-4">
        <div className="p-3 bg-slate-950 rounded-xl border-l-4 border-emerald-500 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-white">{recipientName}</p>
              <p className="text-xs text-slate-400">{phone}</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
            Active
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Pre-Drafted Message (Urdu / English)
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-sm p-3 border border-slate-700 bg-slate-950 text-slate-200 rounded-xl focus:border-blue-500 focus:outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (customerId) {
                  addCustomerTimelineEvent(customerId, {
                    type: 'whatsapp',
                    title: 'Opened Real WhatsApp Web',
                    description: `Launched WhatsApp Web for ${recipientName}`,
                  });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open WhatsApp Web
            </a>
            <button
              type="button"
              onClick={handleSendSimulated}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Send & Log
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  phone: string;
  customerId?: string;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  phone,
  customerId,
}) => {
  const { addCustomerTimelineEvent, showToast } = useApp();
  const [callNotes, setCallNotes] = useState('');
  const [outcome, setOutcome] = useState('Interested - Follow-up required');

  const handleLogCall = () => {
    if (customerId) {
      addCustomerTimelineEvent(customerId, {
        type: 'call',
        title: `Phone Call Logged (${outcome})`,
        description: callNotes || 'Call completed with client.',
      });
    }
    showToast('Call Logged to CRM', `Activity saved for ${recipientName}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direct Call Dialing"
      subtitle={`Connecting to ${recipientName}`}
      maxWidth="md"
      id="call-simulator-modal"
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-950 rounded-xl border-l-4 border-blue-500 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center animate-pulse">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{recipientName}</h4>
              <p className="text-xs font-mono text-slate-400">{phone}</p>
            </div>
          </div>
          <a
            href={`tel:${phone}`}
            className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-lg transition-colors"
          >
            Dial Phone
          </a>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Call Outcome</label>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="w-full text-sm p-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-200 focus:border-blue-500 focus:outline-none mb-3"
          >
            <option>Interested - Scheduled Site Visit</option>
            <option>Interested - Price negotiation required</option>
            <option>Busy - Requested callback tomorrow</option>
            <option>Not Answering / Ringing</option>
            <option>Not Interested / Requirement Changed</option>
          </select>

          <label className="block text-xs font-medium text-slate-300 mb-1">Discussion Notes</label>
          <textarea
            rows={3}
            placeholder="e.g. Client agreed to meet at DHA Sector A plot tomorrow at 4 PM..."
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            className="w-full text-sm p-2.5 border border-slate-700 bg-slate-950 text-slate-200 rounded-xl focus:border-blue-500 focus:outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogCall}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
          >
            Save Call Log
          </button>
        </div>
      </div>
    </Modal>
  );
};
