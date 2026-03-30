import React from 'react';
import { Logo } from '../index';
import { 
  FiGrid, 
  FiClipboard, 
  FiMessageSquare, 
  FiAward, 
  FiUsers 
} from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
  const [activeTab, setActiveTab] = React.useState('Admin Dashboard');

  const navItems = [
    { label: 'Admin Dashboard', icon: FiGrid },
    { label: 'Manage Contests', icon: FaTrophy },
    { label: 'Assign Projects', icon: FiClipboard },
    { label: 'Review Submissions', icon: FiMessageSquare },
    { label: 'Declare Winners', icon: FiAward },
    { label: 'Manage Users', icon: FiUsers },
  ];

  return (
    <aside className="w-[280px] lg:w-[300px] h-screen bg-white border-r border-gray-100 flex flex-col py-10 px-8 sticky top-0 overflow-y-auto relative shadow-2xl lg:shadow-none">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-2 left-2 p-3 text-gray-400 lg:hidden transition-all z-10 hover:text-slate-900"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 1. Full Branding Section */}
      <Logo size="md" className="mb-16 px-1" />

      {/* 2. Navigation Section */}
      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center justify-between group transition-all relative py-1.5 ${
                isActive ? 'text-[#8cc63f]' : 'text-gray-400 hover:text-slate-900'
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
        })}
      </nav>

    </aside>
  );
};

export default Sidebar;
