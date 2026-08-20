import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building,
  LayoutDashboard,
  Home,
  Users,
  GitPullRequest,
  CalendarClock,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { logout, currentUser, leads, followUps } = useApp();
  const navigate = useNavigate();

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const pendingFollowUpsCount = followUps.filter((f) => f.status === 'pending').length;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Properties',
      path: '/admin/properties',
      icon: Home,
    },
    {
      name: 'Customers CRM',
      path: '/admin/customers',
      icon: Users,
    },
    {
      name: 'Lead Pipeline',
      path: '/admin/leads',
      icon: GitPullRequest,
      badge: newLeadsCount > 0 ? newLeadsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      name: 'Follow-ups',
      path: '/admin/followups',
      icon: CalendarClock,
      badge: pendingFollowUpsCount > 0 ? pendingFollowUpsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      name: 'Deals & Sales',
      path: '/admin/deals',
      icon: Briefcase,
    },
    {
      name: 'Market Reports',
      path: '/admin/reports',
      icon: BarChart3,
    },
    {
      name: 'Agency Settings',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900/50 text-slate-200 border-r border-slate-800 w-64 select-none backdrop-blur-md">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            KP
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-tight">
              Khyber<span className="text-blue-500">Pro</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block">
              Peshawar Dealer CRM
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Add CTA */}
      <div className="p-4 border-b border-slate-800">
        <Link
          to="/admin/properties/new"
          onClick={onCloseMobile}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          + Add Property
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Switch to Public Portal & Profile */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Public Website Portal
          </span>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">Live</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800/60">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
