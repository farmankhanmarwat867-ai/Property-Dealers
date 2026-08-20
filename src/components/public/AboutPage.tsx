import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { agencySettings } = useApp();

  const team = [
    {
      name: 'Hamza Khan Afridi',
      role: 'Principal Broker & Managing Director',
      bio: '15+ years managing high-value transactions across DHA Peshawar, Hayatabad, and Cantt areas.',
      phone: '+92 300 9876543',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bilal Ahmad Marwat',
      role: 'Head of Sales & DHA Peshawar Specialist',
      bio: 'Specialist in DHA Sector A/B/C plot transfers, possession files, and commercial plaza leasing.',
      phone: '+92 312 3456789',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Saad Khan Khattak',
      role: 'Senior Consultant - Hayatabad & Regi',
      bio: 'Expert in designer bungalows, architecture appraisal, and PDA registry clearance.',
      phone: '+92 333 5554433',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            About Khyber Estate Peshawar
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Setting the Gold Standard for Peshawar Real Estate
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Founded with a commitment to 100% legal clarity, dispute-free property transfers, and transparent dealer-client ethics.
          </p>
        </div>
      </section>

      {/* Story & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <h2 className="text-2xl font-black text-slate-900">
              Serving Peshawar’s Homeowners & Investors Since 2010
            </h2>
            <p>
              Khyber Estate was established in the historic city of Peshawar with a mission: to eliminate the uncertainty, fraudulent transfers, and undocumented token practices that plagued traditional property dealings.
            </p>
            <p>
              Over the last 15 years, our team has facilitated over <strong>Rs. 18+ Arab</strong> in closed real estate transactions, representing local business families, civil servants, armed forces personnel, and overseas Pakistanis based in UAE, UK, and the USA.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <h4 className="text-xs font-bold text-slate-900">KP Govt License</h4>
                <p className="text-[11px] text-slate-500">Reg # {agencySettings.registrationNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Award className="w-6 h-6 text-indigo-600 mb-1" />
                <h4 className="text-xs font-bold text-slate-900">DHA Authorized</h4>
                <p className="text-[11px] text-slate-500">Registered Consultant # DHA-PSH-940</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"
              alt="Peshawar Office"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Meet Our Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Peshawar Property Specialists
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition text-center space-y-4"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-emerald-500/30 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">{member.role}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{member.bio}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {member.phone}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
