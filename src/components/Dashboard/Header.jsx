import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiBell, FiSettings, FiUser, FiMoreVertical } from 'react-icons/fi';
import logo from '../../assets/desun-logo.png';

const Header = ({ onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('Analytics');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const tabs = ['Analytics', 'Reports', 'Logs'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close only if the click is OUTSIDE both the dropdown AND the toggle button
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideToggle = toggleRef.current && !toggleRef.current.contains(event.target);
      
      if (isOutsideDropdown && isOutsideToggle) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-[#8cc63f]/10 hover:text-[#8cc63f] rounded-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2">
          <img src={logo} alt="Desun Logo" className="w-8 h-8 object-contain" />
          <div className="flex flex-col">
            <span className="font-black text-slate-800 text-xs tracking-tighter uppercase whitespace-nowrap leading-tight">Desun Academy</span>
            <span className="bg-[#fbc111] text-black text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm leading-none uppercase tracking-widest border border-yellow-400/20 whitespace-nowrap mt-0.5">
              Get Placed by Skills
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Section - Desktop Only */}
      <nav className="hidden lg:flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-1 text-[15px] font-black uppercase tracking-widest transition-colors ${
              activeTab === tab ? 'text-[#8cc63f]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-[#8cc63f] rounded-full shadow-[0_2px_10px_rgba(140,198,63,0.4)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Profile & Settings Section */}
      <div className="flex items-center gap-2 sm:gap-5 relative">
        <div className="hidden lg:flex items-center gap-4 mr-2">
           <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors relative group">
            <FiBell size={20} className="group-hover:text-[#8cc63f] transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors group">
            <FiSettings size={20} className="group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
        
        {/* 3-Dot Mobile More Menu Toggle */}
        <button 
          ref={toggleRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`lg:hidden p-2 rounded-full transition-all ${isMenuOpen ? 'bg-[#8cc63f] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          <FiMoreVertical size={20} className="pointer-events-none" />
        </button>

        {/* --- MOBILE DROPDOWN MENU --- */}
        {isMenuOpen && (
          <div ref={dropdownRef} className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 p-6 flex flex-col gap-6 lg:hidden animate-in slide-in-from-top-2 duration-200 z-[100]">
            {/* User Profile Section in Dropdown */}
            <div className="flex items-center gap-4 bg-[#8cc63f]/5 p-3 rounded-2xl border border-[#8cc63f]/10">
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold font-black">
                  <FiUser size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-tight">Admin User</p>
                <p className="text-[10px] font-bold text-gray-400 truncate">admin@academy.com</p>
              </div>
            </div>

            {/* Nav Links in Dropdown */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-2">Navigation</p>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setIsMenuOpen(false); }}
                  className={`text-left text-sm font-black uppercase tracking-tight py-1 transition-colors ${
                    activeTab === tab ? 'text-[#8cc63f]' : 'text-gray-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Profile Actions in Dropdown */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-2">Quick Actions</p>
              <button className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] transition-all">
                <FiBell size={18} />
                <span>Notifications</span>
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] transition-all">
                <FiSettings size={18} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* User Profile Avatar - Desktop Only */}
        <div className="hidden lg:block w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 p-[2px] cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold font-black">
            <FiUser size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
