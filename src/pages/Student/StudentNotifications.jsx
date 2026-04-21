// ============================================================
// StudentNotifications.jsx — Student er dedicated notifications page
// TEAM_INVITE type e Accept/Decline button dekhano hoy.
// GENERAL type e "OK, Understood" button thake.
// Page load hole fetch hoy, ar Accept/Decline action er pore re-fetch hoy.
// Empty state dekhano hoy jodi kono notification na thake.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FiBell, FiCheck, FiXCircle, FiUser, FiRefreshCw, FiUsers, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import PageTransition from '../../components/Common/PageTransition';
import { Loader } from '../../components/index';

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/student/notifications');
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (err) {
            console.error('Notifications fetch error:', err);
            toast.error('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleAction = async (notifId, status) => {
        setActioningId(notifId);
        try {
            const res = await api.post('/student/notifications/respond', {
                notificationId: notifId,
                status,
            });
            if (res.data.success) {
                if (status !== 'OK') {
                    toast.success(
                        `Team Invite ${status === 'ACCEPTED' ? 'Accepted! 🎉' : 'Declined.'}`,
                        { theme: 'colored', position: 'top-right' }
                    );
                    if (status === 'ACCEPTED') {
                        toast.info('Squad accepted! Refreshing your profile...', {
                            position: 'top-right',
                        });
                        setTimeout(() => window.location.reload(), 1500);
                    }
                }
                // Remove actioned notification from list
                setNotifications(prev => prev.filter(n => n._id !== notifId));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to respond to notification.');
        } finally {
            setActioningId(null);
        }
    };

    const getTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="min-h-screen pt-16 sm:pt-20 bg-[#f8faf2] dark:bg-gray-900 font-sans selection:bg-[#8cc63f]/30">
            <PageTransition>
                <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 py-12">

                    {/* --- Page Header --- */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-[#fbc111] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fbc111]/30">
                                    <FiBell className="text-white" size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8cc63f]">
                                    Alert Center
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-gray-100 tracking-tight leading-tight">
                                Notifications
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2">
                                Pending team invites and alerts from the system.
                            </p>
                        </div>
                        <button
                            onClick={fetchNotifications}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-300 hover:text-[#8cc63f] hover:border-[#8cc63f]/30 transition-all shadow-sm group"
                        >
                            <FiRefreshCw size={14} className={`transition-transform ${loading ? 'animate-spin' : 'group-hover:rotate-180 duration-500'}`} />
                            Refresh
                        </button>
                    </div>

                    {/* --- Content --- */}
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <Loader size="sm" text="Loading your alerts..." />
                        </div>
                    ) : notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mb-6 border border-gray-50 dark:border-gray-700">
                                <FiBell className="text-gray-200 dark:text-gray-600" size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-gray-100 mb-2 tracking-tight">
                                All Clear!
                            </h3>
                            <p className="text-sm font-medium text-gray-400 max-w-xs">
                                You have no pending notifications. Team invites and system alerts will appear here.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <AnimatePresence>
                                {notifications.map((notif, idx) => (
                                    <motion.div
                                        key={notif._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                                    >
                                        {/* Card Top Border Accent */}
                                        <div className={`h-1 w-full ${notif.type === 'TEAM_INVITE' ? 'bg-[#fbc111]' : 'bg-[#8cc63f]'}`} />

                                        <div className="p-6">
                                            {/* Sender & Type */}
                                            <div className="flex items-start gap-4 mb-5">
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${notif.type === 'TEAM_INVITE' ? 'bg-[#fbc111]/20 text-[#c9920a]' : 'bg-[#8cc63f]/20 text-[#5c8a14]'}`}>
                                                    {notif.type === 'TEAM_INVITE' ? <FiUsers size={18} /> : <FiInfo size={18} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${notif.type === 'TEAM_INVITE' ? 'bg-[#fbc111]/10 text-[#c9920a]' : 'bg-[#8cc63f]/10 text-[#5c8a14]'}`}>
                                                            {notif.type === 'TEAM_INVITE' ? 'Team Invite' : 'System Alert'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 shrink-0">
                                                            {getTimeAgo(notif.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-gray-200 leading-snug">
                                                        {notif.type === 'TEAM_INVITE' ? (
                                                            <>
                                                                <span className="font-black">{notif.sender?.name}</span> invited you to join team{' '}
                                                                <span className="font-black text-[#8cc63f]">"{notif.team?.name}"</span> for contest{' '}
                                                                <span className="font-black">"{notif.contest?.title}"</span>
                                                            </>
                                                        ) : (
                                                            <span className="font-bold">{notif.message}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* --- Action Buttons --- */}
                                            <div className="flex gap-3">
                                                {notif.type === 'TEAM_INVITE' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(notif._id, 'ACCEPTED')}
                                                            disabled={actioningId === notif._id}
                                                            className="flex-1 bg-[#8cc63f] hover:bg-[#7ab332] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8cc63f]/20 active:scale-95 disabled:opacity-60"
                                                        >
                                                            {actioningId === notif._id ? (
                                                                <span className="flex items-center gap-1"><FiRefreshCw className="animate-spin" size={12} /> Processing...</span>
                                                            ) : (
                                                                <><FiCheck size={13} /> Accept</>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(notif._id, 'DECLINED')}
                                                            disabled={actioningId === notif._id}
                                                            className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                                                        >
                                                            <FiXCircle size={13} /> Decline
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(notif._id, 'OK')}
                                                        disabled={actioningId === notif._id}
                                                        className="w-full bg-slate-800 dark:bg-gray-700 hover:bg-slate-900 dark:hover:bg-gray-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-800/10 active:scale-95 disabled:opacity-60"
                                                    >
                                                        {actioningId === notif._id ? (
                                                            <span className="flex items-center gap-1"><FiRefreshCw className="animate-spin" size={12} /> Processing...</span>
                                                        ) : (
                                                            'OK, Understood'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </PageTransition>
        </div>
    );
};

export default StudentNotifications;
