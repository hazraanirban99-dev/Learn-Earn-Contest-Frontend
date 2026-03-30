import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../index';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ showAuth = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '#' },
    { label: 'Contests', path: '#' },
    { label: 'Courses', path: '#' },
    { label: 'About Us', path: '#' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-8">
        
        {/* 1. BRANDING (Left) */}
        <Logo size="md" />

        {/* 2. CENTER LINKS (Desktop) */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`relative py-1 text-[14px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                isActive(link.path) 
                ? 'text-[#8cc63f]' 
                : 'text-gray-400 hover:text-slate-900'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-[#8cc63f] rounded-full shadow-[0_2px_8px_rgba(140,198,63,0.4)]" />
              )}
            </Link>
          ))}
        </div>

        {/* 3. AUTH BUTTONS (Right - Desktop Only) */}
        <div className="flex items-center gap-4 sm:gap-8 shrink-0">
          {showAuth ? (
            <div className="hidden lg:flex items-center gap-8">
              <Link 
                to="/login" 
                className="text-[14px] font-black text-[#fbc111] hover:text-[#e0ad0c] transition-colors uppercase tracking-widest"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-[#8cc63f] hover:bg-[#7ab332] text-white text-[13px] font-black px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#8cc63f]/20 hover:shadow-[#8cc63f]/30 active:scale-95 uppercase tracking-widest"
              >
                Sign Up
              </Link>
            </div>
          ) : (
             <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8cc63f] animate-pulse" />
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Academy Active</span>
             </div>
          )}

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
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-black uppercase tracking-widest py-2 ${
                  isActive(link.path) ? 'text-[#8cc63f]' : 'text-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {showAuth && (
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-50">
              <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-black text-gray-500 uppercase tracking-widest text-center"
              >
                Login
              </Link>
              <Link 
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#8cc63f] text-white text-center py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
