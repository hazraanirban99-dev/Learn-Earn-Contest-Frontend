// ============================================================
// AdminLayout.jsx — Admin panel er wrapper layout component
// Sob admin page ei layout wrap kore.
// Sidebar: Desktop e left side fixed, mobile e slide-in drawer.
// Mobile overlay: Sidebar er baaire click korle sidebar close hoy.
// Header: Top sticky — hamburger menu + page name + actions.
// PageTransition: Route change hole smooth fade/slide animation.
// Footer: Page er niche scroll kore dekhano hoy.
// ============================================================

import Sidebar from '../components/Admin/Sidebar';
import { useLocation } from 'react-router-dom';
import PageTransition from '../components/Common/PageTransition';
import { useLayout } from '../context/LayoutContext';

const AdminLayout = ({ children }) => {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fbfcfa] dark:bg-gray-950 font-sans text-slate-900 dark:text-gray-100 relative">
      {/* Persistent Sidebar removed per user request - Admin now uses Navbar hamburger */}

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}
      
      {/* 2. Main Content Area - Full width */}
      <div className="flex flex-col min-h-screen">
        {/* Balanced top padding across all Admin pages */}
        <main className="flex-grow px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-10 w-full overflow-x-hidden">
          <PageTransition key={location.pathname} className="max-w-[1440px] mx-auto min-h-[calc(100vh-250px)]">
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
