// ============================================================
// Navbar.jsx — Main public navigation bar
// Login state onujayi CTA buttons (Login/Dashboard) toggles kore.
// Scroll detection ache background transparency change korar jonno.
// Mobile menu (drawer) smooth animation with Framer Motion.
// Logo component r navigation links integrated.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Common/Logo';
import { FiMenu, FiX, FiBell, FiSettings, FiRefreshCw, FiCheck, FiXCircle, FiUser, FiLogOut, FiTrash2, FiEdit, FiHome, FiAward, FiFolder, FiMoreVertical, FiSun, FiMoon, FiGrid, FiMessageSquare, FiUsers, FiPieChart, FiDatabase, FiChevronLeft } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from '../Modals/ProfileModal';
import { useLayout } from '../../context/LayoutContext';

const Navbar = ({ showAuth = true }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSidebarOpen, openSidebar, closeSidebar } = useLayout();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showNotifInProfile, setShowNotifInProfile] = useState(false);

  const notifRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin' ? '/admin/notifications' : '/student/notifications';
      const res = await api.get(endpoint);
      if (res.data.success) {
        if (user.role === 'admin') {
          setNotifications(res.data.data.filter(n => (n.type === 'TEAM_CHANGE_REQUEST' || n.type === 'TEAM_CREATION_REQUEST') && n.status !== 'ACTIONED'));
        } else {
          setNotifications(res.data.data);
        }
      }
    } catch (err) {
      console.error("Notif fetch error in navbar:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotificationAction = async (notifId, action, type) => {
    try {
      if (user.role === 'admin') {
        const endpoint = type === 'TEAM_CREATION_REQUEST' ? '/admin/team/handle-creation' : '/admin/team/handle-change';
        const res = await api.post(endpoint, { notificationId: notifId, action });
        if (res.data.success) {
          setNotifications(prev => prev.filter(n => n._id !== notifId));
          toast.success(`Request ${action === 'ALLOW' ? 'Allowed! ✅' : 'Denied.'}`, { theme: "colored" });
          fetchNotifications();
        }
      } else {
        // Student Response
        const res = await api.post('/student/notifications/respond', { notificationId: notifId, status: action });
        if (res.data.success) {
          toast.success(`Invite ${action === 'ACCEPTED' ? 'Accepted! 🎉' : 'Declined.'}`, { theme: "colored" });
          if (action === 'ACCEPTED') {
            setTimeout(() => window.location.reload(), 1000);
          }
          fetchNotifications();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process request.");
    }
  };

  const handleDeleteAccount = async () => {
    const ConfirmAccountDelete = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-[12px] font-black text-slate-800 dark:text-gray-100 mb-3 uppercase tracking-tight leading-tight">Final Warning: Delete your account?</p>
        <div className="flex justify-end gap-2">
          <button onClick={closeToast} className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">Cancel</button>
          <button onClick={async () => {
            try {
              const response = await api.delete('/users/profile');
              if (response.data.success) {
                toast.success("Account deleted.");
                logout();
                navigate('/login');
              }
            } catch (error) { toast.error("Failed to delete account."); }
            closeToast();
          }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
          >Confirm Delete</button>
        </div>
      </div>
    );
    toast.info(<ConfirmAccountDelete />, { autoClose: false, closeOnClick: false });
  };

  const handleRefresh = () => {
    toast.info("Refreshing Scholastic System...", {
      className: "border-2 border-[#8cc63f] !bg-[#f8faf6] dark:!bg-gray-950 font-black text-[10px] tracking-tight uppercase",
      autoClose: 1000
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const navLinks = [
    { label: 'About Us', path: '/#aboutus', id: 'aboutus' },
    { label: 'Vision', path: '/#vision', id: 'vision' },
    { label: 'Courses', path: '/#courses', id: 'courses' },
    { label: 'Benefits', path: '/#benefits', id: 'benefits' },
    { label: 'Contact', path: '/#contact', id: 'contact' },
    ...(!isAuthPage ? [
      {
        label: user?.role === 'admin' ? 'Admin' : 'Participants',
        path: user?.role === 'admin' ? '/admin/dashboard' : (user?.role === 'student' ? '/student/dashboard' : '/participants'),
        id: 'participants'
      }
    ] : []),
  ];


  const sidebarLinks = user?.role === 'admin' ? [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { label: 'Manage Contests', path: '/admin/contests', icon: FaTrophy },
    { label: 'Review Submissions', path: '/admin/submissions', icon: FiMessageSquare },
    { label: 'Declare Winners', icon: FiAward, path: '/admin/winners' },
    { label: 'Manage Users', icon: FiUsers, path: '/admin/users' },
    { label: 'Contest Reports', path: '/admin/reports', icon: FiPieChart },
    { label: 'All Participants', path: '/admin/participants', icon: FiDatabase },
  ] : [
    { label: 'Home', path: '/student/dashboard', icon: FiHome },
    { label: 'All Contests', path: '/student/contests', icon: FiAward },
    { label: 'My Contests', path: '/student/submissions', icon: FiFolder },
  ];

  const handleNavClick = (_, link) => {
    setIsMobileMenuOpen(false);
    // Allow React Router to update the URL hash first, then programmatically scroll
    setTimeout(() => {
      const element = document.getElementById(link.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const isActive = (path) => {
    // Basic active state check for hash links
    return location.hash === path.split('/')[1] || (location.pathname === '/' && location.hash === '');
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-[100] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-8">

          {/* 1. BRANDING & SIDEBAR TRIGGER */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (user.role === 'student' || user.role === 'admin') && (
              <button
                onClick={openSidebar}
                className="p-2 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <FiMenu size={20} />
              </button>
            )}
            <Logo size="md" />
          </div>

          {/* 2. CENTER LINKS (Desktop) */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative py-1 text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-300 whitespace-nowrap hover:text-slate-900 dark:text-gray-100 dark:hover:text-white ${(location.pathname === link.path || (link.id === 'participants' && user?.role === 'student' && location.pathname === '/student/dashboard'))
                    ? 'text-[#8cc63f]' : 'text-gray-400 dark:text-gray-400'}`}
              >
                {link.label}
                {(location.pathname === link.path || (link.id === 'participants' && user?.role === 'student' && location.pathname === '/student/dashboard') || location.hash === `#${link.id}`) && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-[#8cc63f] rounded-full shadow-[0_2px_8px_rgba(140,198,63,0.4)]" />
                )}
              </Link>
            ))}
          </div>

          {/* 3. AUTH & ADMIN ACTIONS (Right) */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            {showAuth ? (
              user ? (
                <div className="flex items-center gap-3 sm:gap-6">
                  {/* Admin Tools (Hidden on Mobile top bar per user request) */}
                  {user?.role === 'admin' && (
                    <div className="hidden lg:flex items-center gap-4 border-r border-gray-100 dark:border-gray-700 pr-6 mr-2">
                      {/* Refresh */}
                      {user.role === 'admin' && (
                        <button
                          onClick={handleRefresh}
                          className="p-2 text-gray-400 hover:text-[#8cc63f] hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all group"
                          title="Refresh System"
                        >
                          <FiRefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                      )}

                      {/* Notifications */}
                      <div className="relative" ref={notifRef}>
                        <button
                          onClick={() => setIsNotifOpen(!isNotifOpen)}
                          className={`p-2 rounded-xl transition-all relative ${isNotifOpen ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'text-gray-400 hover:text-[#8cc63f] hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
                        >
                          <FiBell size={18} />
                          {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                          )}
                        </button>

                        {isNotifOpen && (
                          <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600 flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-gray-100">Notifications ({notifications.length})</span>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                              {notifications.length > 0 ? (
                                notifications.map((n, idx) => (
                                  <div key={idx} className="p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/ dark:bg-gray-800/ dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex gap-3">
                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${(n.type === 'TEAM_CREATION_REQUEST' || n.type === 'TEAM_INVITE') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-500'
                                        }`}>
                                        <FiUser size={16} />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-800 dark:text-gray-100 leading-tight mb-2">
                                          {user.role === 'admin' ? n.message : (
                                            n.type === 'TEAM_INVITE' ? `${n.sender?.name} invited you to team "${n.team?.name}"` : n.message
                                          )}
                                        </p>
                                        <div className="flex gap-2">
                                          {user.role === 'admin' ? (
                                            <>
                                              <button onClick={() => handleNotificationAction(n._id, 'ALLOW', n.type)} className="bg-[#8cc63f] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#7ab332]">Allow</button>
                                              <button onClick={() => handleNotificationAction(n._id, 'DENY', n.type)} className="bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-50 dark:bg-gray-8000">Deny</button>
                                            </>
                                          ) : (
                                            n.type === 'TEAM_INVITE' ? (
                                              <>
                                                <button onClick={() => handleNotificationAction(n._id, 'ACCEPTED', n.type)} className="bg-[#8cc63f] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#7ab332]">Accept</button>
                                                <button onClick={() => handleNotificationAction(n._id, 'DECLINED', n.type)} className="bg-red-50 dark:bg-red-900/30 text-red-500 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/50">Decline</button>
                                              </>
                                            ) : (
                                              <button onClick={() => handleNotificationAction(n._id, 'OK', n.type)} className="bg-slate-800 dark:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-gray-50 dark:bg-gray-8000">Understood</button>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest font-black italic">No requests</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Profile Section - Hidden on Mobile (Moved to 3-dots) */}
                  <div className="relative hidden lg:block" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-2xl transition-all ${isProfileOpen ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
                    >
                      <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#8cc63f]">
                          {user.role === 'admin' ? 'Admin' : `Hi ${user.name?.split(' ')[0]}`}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-gray-400">Scholastic</span>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#8cc63f] to-[#7ab332] flex items-center justify-center text-white shadow-lg overflow-hidden">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <FiUser className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                        )}
                      </div>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute top-full right-0 mt-3 w-[280px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
                        {showNotifInProfile ? (
                          <div className="flex flex-col max-h-[400px]">
                            <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/ dark:bg-gray-800/50">
                              <button 
                                onClick={() => setShowNotifInProfile(false)}
                                className="text-[10px] font-black uppercase tracking-widest text-[#8cc63f] flex items-center gap-1 hover:scale-105 transition-transform"
                              >
                                <FiChevronLeft size={16} /> Back
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</span>
                            </div>
                            <div className="overflow-y-auto p-2 space-y-2">
                                {notifications.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <FiBell className="mx-auto text-gray-200 mb-3" size={28} />
                                        <p className="text-[10px] font-black uppercase text-gray-400 italic">All caught up!</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif._id} className="p-4 rounded-2xl bg-gray-50/ dark:bg-gray-700/50 border border-gray-50 dark:border-gray-600">
                                            <p className="text-[11px] font-bold text-slate-700 dark:text-gray-200 leading-tight mb-3">
                                                {notif.type === 'TEAM_INVITE' ? (
                                                    <><span className="text-[#8cc63f]">@{notif.sender?.name}</span> invited you to <span className="font-black">"{notif.team?.name}"</span></>
                                                ) : notif.message}
                                            </p>
                                            {notif.type === 'TEAM_INVITE' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleNotificationAction(notif._id, 'ACCEPTED', notif.type)} className="flex-1 bg-[#8cc63f] text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#8cc63f]/10">Accept</button>
                                                    <button onClick={() => handleNotificationAction(notif._id, 'DECLINED', notif.type)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Deny</button>
                                                </div>
                                            ) : (
                                                <button 
                                                  onClick={() => handleNotificationAction(notif._id, 'OK', notif.type)}
                                                  className="w-full bg-slate-800 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-lg"
                                                >
                                                  OK, Understood
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="p-5 border-b border-gray-50 dark:border-gray-700 bg-gray-50/ dark:bg-gray-800/0 dark:bg-gray-700/50 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8cc63f] to-[#7ab332] flex items-center justify-center text-white shadow-lg shrink-0 overflow-hidden">
                                {user.avatar?.url ? (
                                  <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <FiUser size={20} />
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-gray-100 truncate">{user.name}</p>
                                <p className={`text-[9px] font-bold mt-0.5 uppercase tracking-tight ${user.role === 'admin' ? 'text-[#8cc63f]' : 'text-[#fbc111]'}`}>
                                  Active {user.role === 'admin' ? 'Admin' : 'Student'}
                                </p>
                              </div>
                            </div>
                            <div className="p-2 space-y-1">
                              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-gray-300 hover:bg-[#8cc63f]/5 dark:hover:bg-[#8cc63f]/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all group" onClick={() => setIsProfileOpen(false)}>
                                <FiGrid size={16} className="text-gray-400 group-hover:text-[#8cc63f] transition-colors" /> Dashboard
                              </Link>
                              
                              <button onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-gray-300 hover:bg-[#8cc63f]/5 dark:hover:bg-[#8cc63f]/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all group">
                                <FiUser size={16} className="text-gray-400 group-hover:text-[#8cc63f] transition-colors" /> View Profile
                              </button>

                              {user.role === 'student' && (
                                <button 
                                  onClick={() => setShowNotifInProfile(true)}
                                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-slate-600 dark:text-gray-300 hover:bg-[#fbc111]/5 dark:hover:bg-[#fbc111]/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all group"
                                >
                                  <div className="flex items-center gap-3">
                                    <FiBell size={16} className="text-gray-400 group-hover:text-[#fbc111] transition-colors" /> Notification
                                  </div>
                                  {notifications.length > 0 && (
                                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                      {notifications.length}
                                    </span>
                                  )}
                                </button>
                              )}

                              <div className="h-px bg-gray-50 dark:bg-gray-700 my-1 mx-2" />

                              {user.role === 'student' && (
                                <button onClick={() => { handleDeleteAccount(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all group">
                                  <FiTrash2 size={16} className="text-red-400 group-hover:text-red-600" /> Delete Account
                                </button>
                              )}

                              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-[#fbc111] hover:text-[#e0ad0c] hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all group">
                                <FiLogOut size={16} className="group-hover:rotate-12 transition-transform" /> Logout Account
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Theme Toggle Button - Desktop */}
                  <button
                    onClick={toggleTheme}
                    className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDark ? <FiSun size={16} className="text-yellow-400" /> : <FiMoon size={16} className="text-slate-600" />}
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-8">
                  <Link to="/login" className="text-[13px] font-black text-[#fbc111] hover:text-[#e0ad0c] transition-colors uppercase tracking-widest">Login</Link>
                  <Link to="/register" className="bg-[#8cc63f] hover:bg-[#7ab332] text-white text-[12px] font-black px-7 py-3.5 rounded-2xl transition-all shadow-lg uppercase tracking-widest">Sign Up</Link>
                  {/* Theme Toggle Button - Logged Out Desktop */}
                  <button
                    onClick={toggleTheme}
                    className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDark ? <FiSun size={16} className="text-yellow-400" /> : <FiMoon size={16} className="text-slate-600" />}
                  </button>
                </div>
              )
            ) : (
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8cc63f] animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online</span>
              </div>
            )}

            {/* Theme Toggle (when no auth) */}
            {!showAuth && (
              <button
                onClick={toggleTheme}
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <div className={`absolute transition-all duration-500 transform ${isMobileMenuOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                <FiMoreVertical size={24} />
              </div>
              <div className={`absolute transition-all duration-500 transform ${isMobileMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50'}`}>
                <FiX size={24} />
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE MENU (Slide Down) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 shadow-2xl p-5 flex flex-col gap-5 animate-in slide-in-from-top-2 duration-200 z-[99] max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-sm font-black uppercase tracking-widest py-2 ${(location.pathname === link.path || (link.id === 'participants' && user?.role === 'student' && location.pathname === '/student/dashboard'))
                      ? 'text-[#8cc63f]' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 py-2 text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />} {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>

            {showAuth && (
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {user ? (
                  <div className="flex flex-col gap-4">
                    {user.role === 'admin' && (
                      <div className="flex flex-col gap-3 mb-2">
                        {/* Quick Action Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={handleRefresh} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl flex flex-col items-center gap-2">
                            <FiRefreshCw className="text-gray-400" />
                            <span className="text-[9px] font-black uppercase text-gray-400">Refresh</span>
                          </button>
                          <button onClick={() => navigate('/admin/dashboard')} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl flex flex-col items-center gap-2">
                            <FiSettings className="text-gray-400" />
                            <span className="text-[9px] font-black uppercase text-gray-400">Tools</span>
                          </button>
                        </div>

                        {/* Mobile Notification Panel */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                          <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700">
                            <FiBell size={14} className="text-[#8cc63f]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-200">
                              Notifications ({notifications.length})
                            </span>
                            {notifications.length > 0 && (
                              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            )}
                          </div>
                          <div className="max-h-[240px] overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((n, idx) => (
                                <div key={idx} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                  <p className="text-[11px] font-bold text-slate-700 dark:text-gray-200 mb-2 leading-tight">{n.message}</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleNotificationAction(n._id, 'ALLOW', n.type)}
                                      className="flex-1 bg-[#8cc63f] text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                                    >
                                      <FiCheck size={10} /> Allow
                                    </button>
                                    <button
                                      onClick={() => handleNotificationAction(n._id, 'DENY', n.type)}
                                      className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1"
                                    >
                                      <FiXCircle size={10} /> Deny
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-6 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
                                No pending requests
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <Link
                      to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-[#8cc63f] text-white text-center py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mt-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-800 animate-pulse" />
                      {user?.role === 'admin' ? 'Open Admin Panel' : 'My Dashboard'}
                    </Link>

                    {/* Common Account Actions (For both Student & Admin on Mobile) */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                      <button 
                        onClick={() => { navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                      >
                        <FiGrid size={20} className="text-[#8cc63f]" /> Dashboard
                      </button>

                      {user.role === 'student' && (
                        <button onClick={() => { setIsProfileModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                          <FiUser size={20} className="text-slate-400" /> View Profile
                        </button>
                      )}

                      {user.role === 'student' && (
                        <button onClick={() => setShowNotifInProfile(true)} className="w-full flex items-center justify-between gap-4 px-4 py-3 text-slate-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                          <div className="flex items-center gap-4">
                            <FiBell size={20} className="text-slate-400" /> Notification
                          </div>
                          {notifications.length > 0 && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </button>
                      )}

                      <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
                      
                      {user.role === 'student' && (
                        <button onClick={() => { handleDeleteAccount(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 bg-red-50/50 dark:bg-red-900/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                          <FiTrash2 size={20} /> Delete Account
                        </button>
                      )}
                      
                      <button onClick={logout} className="w-full py-5 bg-yellow-500/10 hover:bg-yellow-500/20 dark:bg-yellow-500/5 dark:hover:bg-yellow-500/10 border border-[#fbc111]/30 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#fbc111] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#fbc111]/5">
                        <FiLogOut size={20} /> Logout Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* LEFT SIDEBAR (FOR STUDENTS) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000]"
            />
            <motion.aside
              ref={sidebarRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-900 z-[1001] shadow-2xl border-r border-gray-100 dark:border-gray-700 flex flex-col p-6 sm:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-12">
                <Logo size="md" />
                <button onClick={closeSidebar} className="p-2 text-gray-400 hover:text-slate-900 dark:text-gray-100 dark:hover:text-gray-100 transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8cc63f] opacity-80 px-1">Scholastic Navigator</p>
                <div className="flex flex-col gap-3">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={closeSidebar}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${location.pathname === link.path
                          ? 'bg-[#8cc63f] text-white shadow-lg shadow-[#8cc63f]/20 translate-x-1'
                          : 'text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-slate-800 dark:text-gray-100 dark:hover:text-gray-100'
                        }`}
                    >
                      <link.icon size={20} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {user?.role !== 'admin' && (
                <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5 border border-gray-100/50 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#8cc63f] flex items-center justify-center text-white font-black text-xs uppercase shadow-lg shadow-[#8cc63f]/20 overflow-hidden shrink-0">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0)
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-[#8cc63f] uppercase tracking-widest mb-1">Welcome Student</p>
                        <p className="text-[13px] font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight truncate">Hi {user.name}</p>
                      </div>
                    </div>

                    <button onClick={logout} className="w-full mt-6 py-4 bg-yellow-500/10 hover:bg-yellow-500/20 dark:bg-yellow-500/5 dark:hover:bg-yellow-500/10 border border-[#fbc111]/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#fbc111] transition-all flex items-center justify-center gap-2 shadow-sm">
                      <FiLogOut size={14} /> Exit Platform
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
