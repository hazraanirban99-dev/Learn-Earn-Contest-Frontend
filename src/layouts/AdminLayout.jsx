import React, { useState } from 'react';
import Header from '../components/Admin/Header';
import Sidebar from '../components/Admin/Sidebar';
import { Footer } from '../components';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfcfa] font-sans text-slate-900">
      <div className="flex-1 flex overflow-hidden lg:overflow-visible">
        {/* 1. Left Sidebar - Responsive */}
        <div className={`fixed inset-y-0 left-0 z-[60] transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* 2. Main Area (Header + Scrollable Content) */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Main Content Area */}
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-10">
            <div className="max-w-[1440px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
