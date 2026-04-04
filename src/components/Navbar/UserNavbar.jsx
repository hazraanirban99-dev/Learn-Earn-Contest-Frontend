import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../index';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiTrash2 } from 'react-icons/fi';

const UserNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/student/dashboard' },
    { label: 'Contests', path: '/student/contests' },
    { label: 'Submissions', path: '/student/submissions' },
  ];

  // Dummy user mimicking backend data
  const currentUser = { 
    name: 'Alex', 
    avatar: null // if null, shows standard icon
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Backend logout logic placeholder
    navigate('/login');
  };

  const handleDelete = () => {
    // Delete logic placeholder
    alert("Delete Profile Clicked!");
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#f8faf2] border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 h-20 flex items-center justify-between">
        
        {/* 1. BRANDING (Left) */}
        <div className="flex-shrink-0">
          <Logo size="md" />
        </div>

        {/* 2. CENTER LINKS (Desktop) */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`relative py-1 text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                  isActive ? 'text-[#8cc63f]' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-[#8cc63f] rounded-full shadow-[0_2px_8px_rgba(140,198,63,0.4)]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* 3. USER PROFILE (Right) */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-white/50 p-1.5 pr-4 rounded-full transition-all border border-transparent hover:border-gray-200"
            >
              <div className="w-10 h-10 bg-[#8cc63f] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#8cc63f]/30">
                 {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                 ) : (
                    <FiUser size={18} />
                 )}
              </div>
              <span className="text-sm font-black text-slate-800 tracking-wide">Hi, {currentUser.name}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                     <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <FiUser size={14} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 leading-none">{currentUser.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Student</span>
                     </div>
                  </div>
                  
                  <Link to="/student/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#8cc63f] hover:bg-gray-50 transition-colors">
                     <FiSettings size={16} /> View Profile
                  </Link>
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                     <FiTrash2 size={16} /> Delete Account
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#fbc111] hover:bg-gray-50 transition-colors border-t border-gray-50">
                     <FiLogOut size={16} /> Logout
                  </button>
               </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Slide Down) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200 z-[99]">
          
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
             <div className="w-12 h-12 bg-[#8cc63f] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#8cc63f]/30">
                <FiUser size={20} />
             </div>
             <div>
                <p className="text-lg font-black text-slate-800">Hi, {currentUser.name}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Student Portal</p>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-black uppercase tracking-widest py-2 ${
                  location.pathname === link.path ? 'text-[#8cc63f]' : 'text-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-50">
            <Link 
              to="/student/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-black text-gray-500 uppercase tracking-widest"
            >
              <FiSettings size={18} /> View Profile
            </Link>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-3 text-sm font-black text-red-500 uppercase tracking-widest text-left"
            >
              <FiTrash2 size={18} /> Delete Account
            </button>
            <button 
               onClick={handleLogout}
              className="flex items-center gap-3 text-sm font-black text-gray-500 hover:text-[#fbc111] uppercase tracking-widest text-left"
            >
              <FiLogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
