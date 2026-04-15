import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../index';
import ProfileModal from '../Modals/ProfileModal';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiTrash2, FiRefreshCw, FiBell, FiCheck, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const UserNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuth();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/student/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Notif fetch error:", err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); 
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleNotificationAction = async (notifId, status) => {
    try {
      const res = await api.post('/student/notifications/respond', { notificationId: notifId, status });
      if (res.data.success) {
        if (status !== 'OK') {
            toast.success(`Team Invite ${status === 'ACCEPTED' ? 'Accepted! 🎉' : 'Declined.'}`, {
                theme: "colored",
                position: "top-right"
            });
            if (status === 'ACCEPTED') {
                toast.info("Squad accepted! Getting dashboard ready...", { position: "top-right" });
                setTimeout(() => window.location.reload(), 1500);
            }
        }
        fetchNotifications();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to respond to notification.");
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navLinks = [
    { label: 'Home', path: '/student/dashboard' },
    { label: 'Contests', path: '/student/contests' },
    { label: 'Submissions', path: '/student/submissions' },
  ];

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
         setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDelete = async () => {
    const ConfirmAccountDelete = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-[12px] font-black text-slate-800 dark:text-gray-100 mb-3 uppercase tracking-tight leading-tight">
           Final Warning: Are you sure you want to delete your account? 
        </p>
        <div className="flex justify-end gap-2 px-2 pb-1">
          <button 
            onClick={closeToast} 
            className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              try {
                const response = await api.delete('/users/profile');
                if (response.data.success) {
                  toast.success("Account deleted successfully. We're sorry to see you go.");
                  logout();
                  navigate('/login', { replace: true });
                }
              } catch (error) {
                console.error("Delete account error:", error);
                toast.error("Failed to delete account.");
              }
              closeToast();
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    );

    toast.info(<ConfirmAccountDelete />, { 
        autoClose: false, 
        closeOnClick: false, 
        draggable: false, 
        theme: "light",
        position: "top-right",
        icon: false // Remove default info icon to keep it clean
    });
  };

  return (
    <>
      {/* Spacer to prevent layout collapse since nav is fixed */}
      <div className="h-20 w-full bg-[#f8faf2] dark:bg-gray-900"></div>

      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#f8faf2] dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 shadow-sm">
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
                  isActive ? 'text-[#8cc63f]' : 'text-slate-500 hover:text-slate-900 dark:text-gray-100'
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

        {/* 3. USER ACTIONS (Right) */}
        <div className="flex items-center gap-1 sm:gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="hidden sm:flex p-2.5 text-slate-500 hover:text-[#8cc63f] hover:bg-[#8cc63f]/10 rounded-xl transition-all group"
            title="Refresh Page"
          >
            <FiRefreshCw size={18} className="transition-transform duration-500 group-hover:rotate-180 group-active:scale-95" />
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
             <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 text-slate-500 hover:text-[#fbc111] hover:bg-[#fbc111]/10 rounded-xl transition-all relative group"
                title="Notifications"
             >
                <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
                {notifications.length > 0 && (
                   <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#f8faf2] animate-bounce">
                      {notifications.length}
                   </span>
                )}
             </button>

             {isNotifOpen && (
                <div className="fixed sm:absolute top-20 sm:top-full left-4 sm:left-auto right-4 sm:right-0 mt-3 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-gray-50/ dark:bg-gray-800/ border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-gray-100">Notifications</h3>
                        {notifications.length > 0 && <span className="text-[10px] font-bold text-[#8cc63f]">{notifications.length} Pending</span>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <FiBell className="mx-auto text-gray-200 mb-4" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No new alerts</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(notif => (
                                    <div key={notif._id} className="p-4 hover:bg-gray-50/ dark:bg-gray-800/ transition-colors">
                                        <div className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'TEAM_INVITE' ? 'bg-[#fbc111]/20' : 'bg-[#8cc63f]/20'}`}>
                                                {notif.type === 'TEAM_INVITE' ? <FiUser className="text-[#ebaa00]" size={14} /> : <FiCheck className="text-[#8cc63f]" size={14} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[11px] font-medium text-slate-700 leading-tight">
                                                    {notif.type === 'TEAM_INVITE' ? (
                                                        <>
                                                            <span className="font-black">{notif.sender?.name}</span> invited you to join team <span className="font-black">"{notif.team?.name}"</span> for contest <span className="font-black">"{notif.contest?.title}"</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold">{notif.message}</span>
                                                    )}
                                                </p>
                                                <div className="flex gap-2 mt-3">
                                                    {notif.type === 'TEAM_INVITE' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handleNotificationAction(notif._id, 'ACCEPTED')}
                                                                className="flex-1 bg-[#8cc63f] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#7ab332] transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <FiCheck size={12} /> Accept
                                                            </button>
                                                            <button 
                                                                onClick={() => handleNotificationAction(notif._id, 'DECLINED')}
                                                                className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                                            >
                                                                <FiXCircle size={12} /> Deny
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleNotificationAction(notif._id, 'OK')}
                                                            className="w-full bg-slate-800 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors flex items-center justify-center gap-1 shadow-lg shadow-slate-800/10"
                                                        >
                                                            OK, Understood
                                                        </button>
                                                    )}
                                                </div>
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

          <div className="hidden lg:flex items-center gap-3 relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-white/ dark:bg-gray-800/ p-1.5 pr-4 rounded-full transition-all border border-transparent hover:border-gray-200 dark:border-gray-700"
            >
              <div className="w-10 h-10 bg-[#8cc63f] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#8cc63f]/30 font-black text-xs">
                 {currentUser.avatar?.url ? (
                    <img src={currentUser.avatar.url} alt="User" className="w-full h-full rounded-full object-cover" />
                 ) : (
                    getInitials(currentUser.name)
                 )}
              </div>
              <span className="text-sm font-black text-slate-800 dark:text-gray-100 tracking-wide">Hi, {currentUser.name}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                     <div className="w-8 h-8 bg-[#8cc63f] text-white rounded-full flex items-center justify-center font-black text-[10px]">
                        {currentUser.avatar?.url ? (
                            <img src={currentUser.avatar.url} alt="User" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            getInitials(currentUser.name)
                        )}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 dark:text-gray-100 leading-none">{currentUser.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Student</span>
                     </div>
                  </div>
                  
                  <button 
                     onClick={() => {
                         setIsDropdownOpen(false);
                         setIsProfileModalOpen(true);
                     }} 
                     className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#8cc63f] hover:bg-gray-50 dark:bg-gray-800 transition-colors"
                  >
                     <FiSettings size={16} /> View Profile
                  </button>
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                     <FiTrash2 size={16} /> Delete Account
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#fbc111] hover:bg-gray-50 dark:bg-gray-800 transition-colors border-t border-gray-50 dark:border-gray-700">
                     <FiLogOut size={16} /> Logout
                  </button>
               </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-800 dark:text-gray-100 hover:bg-gray-100 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Slide Down) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200 z-[99]">
          
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
             <div className="w-12 h-12 bg-[#8cc63f] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#8cc63f]/30 font-black">
                {currentUser.avatar?.url ? (
                    <img src={currentUser.avatar.url} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                    getInitials(currentUser.name)
                )}
             </div>
             <div>
                <p className="text-lg font-black text-slate-800 dark:text-gray-100">Hi, {currentUser.name}</p>
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
          
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
            <button 
              onClick={() => window.location.reload()}
              className="flex sm:hidden items-center gap-3 text-sm font-black text-gray-500 hover:text-[#8cc63f] uppercase tracking-widest text-left"
            >
              <FiRefreshCw size={18} /> Refresh Page
            </button>
            <button 
              onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsProfileModalOpen(true);
              }}
              className="flex items-center gap-3 text-sm font-black text-gray-500 uppercase tracking-widest text-left"
            >
              <FiSettings size={18} /> View Profile
            </button>
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

      <ProfileModal 
         isOpen={isProfileModalOpen} 
         onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  );
};

export default UserNavbar;
