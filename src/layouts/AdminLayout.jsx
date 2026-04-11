// ============================================================
// AdminLayout.jsx — Admin panel er wrapper layout component
// Sob admin page ei layout wrap kore.
// Sidebar: Desktop e left side fixed, mobile e slide-in drawer.
// Mobile overlay: Sidebar er baaire click korle sidebar close hoy.
// Header: Top sticky — hamburger menu + page name + actions.
// PageTransition: Route change hole smooth fade/slide animation.
// Footer: Page er niche scroll kore dekhano hoy.
// ============================================================

import React, { useState } from 'react';
import Header from '../components/Admin/Header';
import Sidebar from '../components/Admin/Sidebar';
import { Footer } from '../components';
import { useLocation } from 'react-router-dom';
import PageTransition from '../components/Common/PageTransition';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fbfcfa] font-sans text-slate-900 relative">
      {/* 1. Sidebar - Fixed (Always visible on desktop, slide-in on mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-[60] transform lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white border-r border-gray-100 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 2. Main Content Area - Shifted by sidebar width on desktop */}
      <div className="flex flex-col min-h-screen lg:pl-[300px]">
        {/* TOP STICKY HEADER */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content + Footer scroll together naturally */}
        <main className="flex-grow px-4 sm:px-6 lg:px-10 pt-[73px] pb-10 w-full overflow-x-hidden">
          <PageTransition key={location.pathname} className="max-w-[1440px] mx-auto min-h-[calc(100vh-250px)]">
            {children}
          </PageTransition>
        </main>
        
        {/* Footer at the very bottom of the page flow */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
