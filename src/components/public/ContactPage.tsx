import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { agencySettings, submitPublicInquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    locationPreference: 'Hayatabad Phase 3',
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPublicInquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: `Preferred Area: ${formData.locationPreference}. Details: ${formData.message}`,
    });
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: '',
      locationPreference: 'Hayatabad Phase 3',
    });
  };

  const faqs = [
    {
      q: 'What is the procedure to transfer a plot in DHA Peshawar?',
      a: 'Plot transfer in DHA Peshawar requires an NDC (No Demand Certificate) from DHA Main Office on Nasir Bagh Road, verified allocation/intimation letter, CNIC copies of buyer and seller, and clearance of all official transfer taxes and membership fees.',
    },
    {
      q: 'How are property registration (Registry / Intiqal) fees calculated in Peshawar?',
      a: 'For registered registry in Peshawar, KP Revenue taxes include Stamp Duty (approx 2-3%), District Council / TMA tax (approx 1%), and FBR Advance Tax (under Section 236K for Filer: 3%, Non-Filer: 10.5%). We provide complete fee estimations before closing any deal.',
    },
    {
      q: 'Can Overseas Pakistanis buy or sell property in Peshawar remotely?',
      a: 'Yes, overseas Pakistanis can grant a Special Power of Attorney (SPA) attested by the Pakistan Embassy / High Commission in their country of residence. We coordinate video verification with authorities for seamless possession.',
    },
    {
      q: 'What makes Hayatabad properties retain high rental and capital value?',
      a: 'Hayatabad is Peshawar’s master-planned elite community with underground utilities in modern phases, renowned hospitals (KTH, Hayatabad Medical Complex), universities, parks, and direct access to Peshawar Ring Road and Motorway M-1.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Contact Khyber Estate
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Visit Our Peshawar Office or Message Us
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Have questions about a property or need instant documentation advice? Our senior brokers are ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Office Locations & Contacts (1 col) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Head Office</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Suite 304, Deans Trade Center, Saddar Cantt, Peshawar, KP</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono">{agencySettings.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{agencySettings.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mon-Sat: 9:00 AM – 8:30 PM (Friday break 12:30 - 2:30 PM)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Hayatabad Branch</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Shop 14, Ground Floor, Tatara Commercial Complex, Phase 3, Hayatabad, Peshawar</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-mono">+92 91 5812345</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Hotline */}
            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <h4 className="text-sm font-bold">Urgent WhatsApp Inquiry?</h4>
              </div>
              <p className="text-xs text-emerald-100">
                Chat directly with our DHA & Hayatabad desk coordinator on WhatsApp.
              </p>
              <a
                href={`https://wa.me/923009876543?text=Assalam-o-Alaikum%2C%20I%20need%20property%20consultation%20in%20Peshawar`}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full py-2.5 bg-white text-emerald-800 text-center text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-50 transition"
              >
                Open Official WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Contact Inquiry Form (2 cols) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Send an Inquiry</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tell us your requirement or question. A dedicated Peshawar property dealer will respond promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Area in Peshawar
                  </label>
                  <select
                    value={formData.locationPreference}
                    onChange={(e) =>
                      setFormData({ ...formData, locationPreference: e.target.value })
                    }
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
                  >
                    <option value="Hayatabad Phase 1-7">Hayatabad (All Phases)</option>
                    <option value="DHA Peshawar">DHA Peshawar (Sectors A-C)</option>
                    <option value="University Town">University Town & Roads</option>
                    <option value="Regi Model Town">Regi Model Town</option>
                    <option value="Warsak Road">Warsak Road Enclaves</option>
                    <option value="Saddar Cantt">Saddar Cantt & Ring Road</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Property Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your budget, required Marla size, or questions about a specific listing..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry to Peshawar Desk
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Peshawar Real Estate Legal & Transfer FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-slate-900' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
