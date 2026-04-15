// ============================================================
// Sidebar.jsx — Admin layout er left sidebar navigation
// Prottekta nav item e icon + label + active indicator ache.
// Active route == green text + right side colored bar indicator.
// /admin/contests/create te thakleo "Manage Contests" active dekhabe.
// Mobile e isOpen prop diye slide-in sidebar hoy (AdminLayout handle kore).
// onClose prop diye mobile sidebar er X button close hoy.
// ============================================================

import React from 'react';
import { Logo } from '../index';
import { 
  FiGrid, 
  FiClipboard, 
  FiMessageSquare, 
  FiAward, 
  FiUsers,
  FiPieChart,
  FiDatabase
} from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainItems = [
    { label: 'Admin Dashboard', icon: FiGrid, path: '/admin/dashboard' },
    { label: 'Manage Contests', icon: FaTrophy, path: '/admin/contests' },
    { label: 'Review Submissions', icon: FiMessageSquare, path: '/admin/submissions' },
    { label: 'Declare Winners', icon: FiAward, path: '/admin/winners' },
    { label: 'Manage Users', icon: FiUsers, path: '/admin/users' },
  ];

  const analyticsItems = [
    { label: 'Contest Reports', icon: FiPieChart, path: '/admin/reports' },
    { label: 'All Participants', icon: FiDatabase, path: '/admin/participants' },
  ];

  const renderNavItem = (item, idx) => {
    const isActive = location.pathname === item.path || 
                    (location.pathname.startsWith('/admin/contests') && item.path === '/admin/contests');
                    
    return (
      <button
        key={idx}
        onClick={() => {
          if(item.path !== '#') {
             navigate(item.path);
          }
        }}
        className={`flex items-center justify-between group transition-all relative py-1.5 ${
          isActive ? 'text-[#8cc63f]' : 'text-gray-400 hover:text-slate-900 dark:text-gray-100'
        }`}
      >
        <div className="flex items-center gap-4.5">
          <item.icon size={22} className={`transition-all duration-300 ${isActive ? 'text-[#8cc63f] scale-110' : 'text-gray-400 group-hover:text-[#8cc63f]'}`} />
          <span className={`text-[15px] tracking-tight transition-all ${isActive ? 'font-black' : 'font-bold group-hover:translate-x-1'}`}>
            {item.label}
          </span>
        </div>

        {/* Active Link Indicator */}
        {isActive && (
          <div className="absolute right-[-32px] w-[5px] h-9 bg-[#8cc63f] rounded-l-full shadow-[0_0_20px_rgba(140,198,63,0.5)]" />
        )}
      </button>
    );
  };

  return (
    <aside className="w-[280px] lg:w-[300px] h-screen bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col py-10 px-8 sticky top-0 overflow-y-auto relative shadow-2xl lg:shadow-none">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-2 left-2 p-3 text-gray-400 lg:hidden transition-all z-10 hover:text-slate-900 dark:text-gray-100"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 1. Full Branding Section */}
      <Logo size="md" className="mb-16 px-1" />

      {/* 2. Navigation Section */}
      <nav className="flex-1 flex flex-col gap-6">
        {/* Main Section */}
        <div className="flex flex-col gap-6">
          {mainItems.map((item, idx) => renderNavItem(item, idx))}
        </div>

        {/* Analytics Section */}
        <div className="mt-8 mb-2 flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60 px-1">Analytics</p>
          <div className="flex flex-col gap-6">
            {analyticsItems.map((item, idx) => renderNavItem(item, idx + mainItems.length))}
          </div>
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;
