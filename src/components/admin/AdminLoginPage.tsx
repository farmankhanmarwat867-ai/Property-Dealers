import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Building, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('hamza@khyberestate.pk');
  const [password, setPassword] = useState('peshawar123');

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPassword = 'peshawar123') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const success = login(demoEmail, demoPassword);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow & accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          KHYBER<span className="text-blue-500">ESTATE</span> CRM
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-widest">
          Peshawar Property Dealer Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Dealer Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-blue-500 outline-none placeholder-slate-500"
                  placeholder="agent@khyberestate.pk"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-blue-500 outline-none placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Sign In to CRM Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Fast Login Presets for Demo */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase text-center tracking-wider">
              1-Click Demo Profiles (Peshawar Staff)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('hamza@khyberestate.pk')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-blue-400 block truncate">Hamza Khan</span>
                <span className="text-[10px] text-slate-400">Principal Director</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('bilal@khyberestate.pk')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-blue-400 block truncate">Bilal Marwat</span>
                <span className="text-[10px] text-slate-400">DHA Specialist</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white transition-colors font-medium"
            >
              ← Back to Public Real Estate Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
