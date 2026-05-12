// ============================================================
// Header.jsx — Admin layout er top navigation bar
// Mobile e hamburger menu button ache (onMenuClick prop diye sidebar toggle hoy).
// Current page er naam dynamically dekhano hoy URL theke.
// Bell icon e notification badge ache (unread count).
// 3 dot (more) menu te profile edit, logout, r delete account option ache.
// Mobile view e sob option smooth dropdown e khule.
// Logout click hole AuthContext er logout() call hoy.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiBell, FiSettings, FiUser, FiMoreVertical, FiEdit, FiLogOut, FiTrash2, FiRefreshCw, FiCheck, FiXCircle, FiChevronLeft, FiSun, FiMoon } from 'react-icons/fi';
import { Logo } from '../index';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showMobileNotifs, setShowMobileNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const profileToggleRef = useRef(null);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.filter(n => (n.type === 'TEAM_CHANGE_REQUEST' || n.type === 'TEAM_CREATION_REQUEST') && n.status !== 'ACTIONED'));
      }
    } catch (err) {
      console.error("Notif fetch error:", err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleNotificationAction = async (notifId, action, type) => {
    try {
      const endpoint = type === 'TEAM_CREATION_REQUEST' ? '/admin/team/handle-creation' : '/admin/team/handle-change';
      const res = await api.post(endpoint, { notificationId: notifId, action });
      if (res.data.success) {
        setNotifications(prev => prev.filter(n => n._id !== notifId));
        toast.success(`Team Request ${action === 'ALLOW' ? 'Allowed! ✅' : 'Denied.'}`, {
            theme: "colored"
        });
        fetchNotifications();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process request.");
    }
  };

  const handleRefresh = () => {
    toast.info("Refreshing Scholastic System...", { 
      className: "border-2 border-[#8cc63f] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase",
      autoClose: 1000
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const navLinks = [
    { name: 'About Us', path: '/#aboutus' },
    { name: 'Vision', path: '/#vision' },
    { name: 'Courses', path: '/#courses' },
    { name: 'Benefits', path: '/#benefits' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Admin', path: '/admin/dashboard' }
  ];

  // Since we are in the Admin panel, the 'Admin' tab should be active by default
  const activeTab = 'Admin';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideToggle = toggleRef.current && !toggleRef.current.contains(event.target);
      if (isOutsideDropdown && isOutsideToggle) {
        setIsMenuOpen(false);
        setShowMobileNotifs(false);
      }

      const isOutsideProfile = profileDropdownRef.current && !profileDropdownRef.current.contains(event.target);
      const isOutsideProfileToggle = profileToggleRef.current && !profileToggleRef.current.contains(event.target);
      if (isOutsideProfile && isOutsideProfileToggle) {
        setIsProfileOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close all menus on route change or mount
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setShowMobileNotifs(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[300px] z-50 bg-white/ dark:bg-gray-800/0 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-6 lg:px-8 py-3 flex items-center justify-between">
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

        <div className="lg:hidden">
          <Logo size="xs" to="/" />
        </div>
      </div>

      {/* Nav Section - Desktop Only */}
      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          link.path.startsWith('/#') ? (
            <a
              key={link.name}
              href={link.path}
              className={`relative py-1 text-[15px] font-black uppercase tracking-widest transition-colors ${
                activeTab === link.name ? 'text-[#8cc63f]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {link.name}
              {activeTab === link.name && (
                <span className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-[#8cc63f] rounded-full shadow-[0_2px_10px_rgba(140,198,63,0.4)]" />
              )}
            </a>
          ) : (
            <Link
              key={link.name}
              to={link.path}
              className={`relative py-1 text-[15px] font-black uppercase tracking-widest transition-colors ${
                activeTab === link.name ? 'text-[#8cc63f]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {link.name}
              {activeTab === link.name && (
                <span className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-[#8cc63f] rounded-full shadow-[0_2px_10px_rgba(140,198,63,0.4)]" />
              )}
            </Link>
          )
        ))}
      </nav>

      {/* Profile & Settings Section */}
      <div className="flex items-center gap-2 sm:gap-5 relative">
        <div className="hidden lg:flex items-center gap-4 mr-2">
           <button 
            onClick={handleRefresh}
            className="p-2 hover:bg-[#f1f8e8] rounded-full text-gray-400 transition-all group relative"
            title="Refresh System"
           >
            <FiRefreshCw size={20} className="group-hover:text-[#8cc63f] group-active:rotate-180 transition-all duration-500" />
          </button>
          
          <button 
            onClick={() => toast.info("You can't do the operation right now", { className: "border-2 border-[#fbc111] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase" })}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors group"
          >
            <FiSettings size={20} className="group-hover:translate-x-0.5 transition-all" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-yellow-400 transition-all shadow-sm"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-slate-600" />}
          </button>
          
          {/* Admin Notifications Bell - Desktop Only */}
          <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 rounded-full transition-all relative group ${isNotifOpen ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'hover:bg-gray-100 text-gray-400'}`}
                title="Authorization Requests"
            >
                <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
                {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {notifications.length}
                </span>
                )}
            </button>

            {isNotifOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-gray-50/ dark:bg-gray-800/ border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-gray-100">Admin Alerts</h3>
                        <div className="flex items-center gap-3">
                           {notifications.length > 0 && <span className="text-[10px] font-bold text-red-500">{notifications.length} Requests</span>}
                           <button 
                              onClick={() => setIsNotifOpen(false)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                           >
                              <FiXCircle size={18} />
                           </button>
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <FiBell className="mx-auto text-gray-200 mb-4" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Pending Authorizations</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(notif => (
                                    <div key={notif._id} className="p-4 hover:bg-gray-50/ dark:bg-gray-800/ transition-colors">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                                    <FiUser className="text-amber-600" size={14} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-medium text-slate-700 leading-tight">
                                                        {notif.type === 'TEAM_CREATION_REQUEST' ? (
                                                            <><span className="font-black">{notif.sender?.name}</span> created team <span className="font-black text-[#8cc63f]">"{notif.team?.name || 'Unknown'}"</span> for <span className="font-black">"{notif.contest?.title}"</span></>
                                                        ) : (
                                                            <><span className="font-black">{notif.sender?.name}</span> requested to change team for <span className="font-black">"{notif.contest?.title}"</span></>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {notif.type === 'TEAM_CHANGE_REQUEST' && notif.reason && (
                                              <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                                                  <p className="text-[10px] font-bold text-amber-700 italic">" {notif.reason} "</p>
                                              </div>
                                            )}
                                            <div className="flex gap-2 mt-1">
                                                <button 
                                                    onClick={() => handleNotificationAction(notif._id, 'ALLOW', notif.type)}
                                                    className="flex-1 bg-[#8cc63f] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#7ab332] transition-colors flex items-center justify-center gap-1 shadow-lg shadow-[#8cc63f]/20"
                                                >
                                                    <FiCheck size={12} /> Allow
                                                </button>
                                                <button 
                                                    onClick={() => handleNotificationAction(notif._id, 'DENY', notif.type)}
                                                    className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <FiXCircle size={12} /> Deny
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
        
        {/* 3-Dot Mobile More Menu Toggle */}
        <button 
          ref={toggleRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`lg:hidden p-2 rounded-full transition-all ${isMenuOpen ? 'bg-[#8cc63f] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          <FiMoreVertical size={20} className="pointer-events-none" />
        </button>

          <div 
            ref={dropdownRef} 
            className={`absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-6 lg:hidden z-[100] max-h-[80vh] overflow-y-auto scrollbar-hide origin-top transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isMenuOpen 
                ? 'opacity-100 scale-y-100 translate-y-0 visible' 
                : 'opacity-0 scale-y-95 -translate-y-4 invisible pointer-events-none'
            }`}
          >
            {showMobileNotifs ? (
               <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-50 dark:border-gray-700 pb-4">
                     <button 
                        onClick={() => setShowMobileNotifs(false)}
                        className="flex items-center gap-1 text-[#8cc63f] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                     >
                        <FiChevronLeft size={16} /> Back
                     </button>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-gray-100">Admin Alerts</p>
                  </div>
                  
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                     {notifications.length === 0 ? (
                        <div className="py-10 text-center">
                           <FiBell className="mx-auto text-gray-200 mb-4" size={32} />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Pending Requests</p>
                        </div>
                     ) : (
                        notifications.map(notif => (
                           <div key={notif._id} className="bg-gray-50/ dark:bg-gray-800/ p-4 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 font-bold text-[10px]">
                                    {notif.sender?.name?.charAt(0)}
                                 </div>
                                 <p className="text-[10px] font-medium text-slate-700 leading-tight">
                                    <span className="font-black">{notif.sender?.name}</span> created team for <span className="font-black">"{notif.contest?.title}"</span>
                                 </p>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-amber-50 italic text-[10px] font-bold text-amber-700">
                                 "{notif.reason}"
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => handleNotificationAction(notif._id, 'ALLOW', notif.type)} className="flex-1 bg-[#8cc63f] text-white py-2 rounded-lg text-[9px] font-black uppercase">Allow</button>
                                 <button onClick={() => handleNotificationAction(notif._id, 'DENY', notif.type)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-[9px] font-black uppercase">Deny</button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            ) : (
               <>
                  {/* User Profile Section in Dropdown */}
                  <div className="flex items-center gap-4 bg-[#8cc63f]/5 p-3 rounded-2xl border border-[#8cc63f]/10">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold font-black">
                        <FiUser size={20} />
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-black text-slate-900 dark:text-gray-100 uppercase tracking-tighter leading-tight">System Admin</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate">{currentUser?.email || 'admin@academy.com'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-gray-700 pb-2">Navigation</p>
                    {navLinks.map((link) => (
                      link.path.startsWith('/#') ? (
                        <a
                          key={link.name}
                          href={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`text-left text-sm font-black uppercase tracking-tight py-1 transition-colors ${
                            activeTab === link.name ? 'text-[#8cc63f]' : 'text-gray-500 hover:text-slate-900 dark:text-gray-100'
                          }`}
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`text-left text-sm font-black uppercase tracking-tight py-1 transition-colors ${
                            activeTab === link.name ? 'text-[#8cc63f]' : 'text-gray-500 hover:text-slate-900 dark:text-gray-100'
                          }`}
                        >
                          {link.name}
                        </Link>
                      )
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-gray-700 pb-2">Quick Actions</p>
                    <button 
                      onClick={handleRefresh}
                      className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] transition-all"
                    >
                      <FiRefreshCw size={18} />
                      <span>Refresh System</span>
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMobileNotifs(true);
                      }}
                      className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] transition-all cursor-pointer bg-transparent border-0 w-full text-left active:scale-95"
                    >
                      <FiBell size={18} className="pointer-events-none" />
                      <span className="pointer-events-none">Notifications</span>
                      {notifications.length > 0 && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse pointer-events-none" />}
                    </button>
                    <button 
                      onClick={() => toast.info("You can't do the operation right now", { className: "border-2 border-[#fbc111] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase" })}
                      className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] transition-all"
                    >
                      <FiSettings size={18} />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 dark:border-gray-700 pb-2">Account</p>
                    <button 
                      onClick={() => toast.info("You can't do the operation right now", { className: "border-2 border-[#fbc111] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase" })}
                      className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] transition-all"
                    >
                      <FiEdit size={18} />
                      <span>Edit Profile</span>
                    </button>
                    <button 
                      onClick={() => { setIsMenuOpen(false); logout(); navigate('/login', { replace: true }); }}
                      className="flex items-center gap-3 text-sm font-bold text-[#fbc111] hover:text-[#e0ad0c] transition-all"
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                    <button 
                      onClick={() => toast.info("You can't do the operation right now", { className: "border-2 border-red-500 !bg-[#fff5f5] font-black text-[10px] tracking-tight uppercase" })}
                      className="flex items-center gap-3 text-sm font-bold text-red-400 hover:text-red-600 transition-all"
                    >
                      <FiTrash2 size={18} />
                      <span>Delete Account</span>
                    </button>
                  </div>
               </>
            )}
          </div>

        {/* User Profile Avatar - Desktop Only (with dropdown) */}
        <div className="hidden lg:flex items-center gap-3 relative">
          <span className="text-[14px] font-black text-[#fbc111] tracking-tight">Hi! Admin</span>
          <button
            ref={profileToggleRef}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 p-[2px] cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold font-black">
              <FiUser size={18} />
            </div>
          </button>

          {/* Desktop Profile Dropdown */}
          {isProfileOpen && (
            <div ref={profileDropdownRef} className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-2 z-[100]">
              <button 
                onClick={() => { setIsProfileOpen(false); toast.info("You can't do the operation right now", { className: "border-2 border-[#fbc111] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase" }); }}
                className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#8cc63f] hover:bg-gray-50 dark:bg-gray-800 px-3 py-2.5 rounded-xl transition-all w-full"
              >
                <FiEdit size={18} />
                <span>Edit Profile</span>
              </button>
              <button 
                onClick={() => { setIsProfileOpen(false); logout(); navigate('/login', { replace: true }); }}
                className="flex items-center gap-3 text-sm font-bold text-[#fbc111] hover:text-[#e0ad0c] hover:bg-yellow-50 px-3 py-2.5 rounded-xl transition-all w-full"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button 
                onClick={() => { setIsProfileOpen(false); toast.info("You can't do the operation right now", { className: "border-2 border-red-500 !bg-[#fff5f5] font-black text-[10px] tracking-tight uppercase" }); }}
                className="flex items-center gap-3 text-sm font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-all w-full"
              >
                <FiTrash2 size={18} />
                <span>Delete Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
