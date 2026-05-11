// ============================================================
// Leaderboard.jsx — Contest specific real-time ranking page
// ------------------------------------------------------------
// Ekhane contest er winner r top performers der list dekhano hoy.
// 
// Functioanlity Highlights:
//   - Team-Based Display: Team hole leader (with crown icon) baki members list stacked hoye thake.
//   - Initials Fallback: Avatar na thakle student er namer initials generate hoy.
//   - Auto-refresh: Proti set interval e data refresh korar logic handle kora jay.
//   - Dynamic Columns: Solo vs Team based layout grid handle kora hoy.
// ============================================================

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiAward, FiArrowLeft, FiUser, FiUsers, FiStar, FiRefreshCw } from 'react-icons/fi';
import PageTransition from '../../components/Common/PageTransition';
import api from '../../utils/api';
import { Loader } from '../../components/index';

// Helper: Get initials from name
const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

// Helper: Capitalize first letter of each word
const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Avatar component — shows image or initials fallback
const Avatar = ({ src, name, size = 'md' }) => {
    const sizeClass = size === 'lg' ? 'w-20 h-20 text-lg' : 'w-11 h-11 text-sm';
    return (
        <div className={`${sizeClass} rounded-xl overflow-hidden border-2 border-white shadow-md bg-[#8cc63f]/10 flex items-center justify-center font-black text-[#5c8a14] flex-shrink-0`}>
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
};

const RANK_CONFIG = [
    { badge: 'bg-yellow-400', border: 'border-yellow-300', glow: 'shadow-yellow-100', scale: 'md:scale-105', text: 'text-yellow-500', emoji: '🥇' },
    { badge: 'bg-slate-300', border: 'border-slate-200', glow: 'shadow-slate-100', scale: '', text: 'text-slate-400', emoji: '🥈' },
    { badge: 'bg-orange-300', border: 'border-orange-200', glow: 'shadow-orange-100', scale: '', text: 'text-orange-400', emoji: '🥉' },
];

const Leaderboard = () => {
    const { id } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const [contestRes, leaderRes] = await Promise.all([
                api.get(`/contests/${id}`),
                api.get(`/student/leaderboard/${id}`)
            ]);
            if (contestRes.data.success) setContest(contestRes.data.data);
            if (leaderRes.data.success) setLeaderboard(leaderRes.data.data);
        } catch (error) {
            console.error("Leaderboard fetch error:", error);
            toast.error("Failed to load leaderboard");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        window.scrollTo(0, 0);
    }, [id]);

    // Participant info extract korar dynamic logic (Solo r Team duto-i handle kore)
    const getParticipantInfo = (item) => {
        const p = item.participantId;
        const isTeam = p?.participationType === 'Team';
        if (isTeam && p?.teamId) {
            const team = p.teamId;
            const leader = team.leader;
            const members = team.members?.map(m => m.user).filter(Boolean) || [];
            // Leader ke list er prothome rakha hoche (Crown icon er jonno)
            const allMembers = [leader, ...members].filter(Boolean);
            return {
                isTeam: true,
                displayName: toTitleCase(team.name),
                avatar: leader?.avatar?.url || null,
                avatarName: leader?.name || team.name,
                members: allMembers // Array of members for the "TEAM" column
            };
        }
        const student = p?.studentId;
        return {
            isTeam: false,
            displayName: toTitleCase(student?.name || 'Anonymous'),
            avatar: student?.avatar?.url || null,
            avatarName: student?.name || '',
            domain: student?.domain || null,
            members: []
        };
    };

    if (loading) {
        return <Loader fullPage text="Loading Leaderboard..." />;
    }

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-[#f8faf2] dark:bg-gray-900 selection:bg-[#8cc63f]/20 pt-14 sm:pt-16">
            <PageTransition>
                <section className="max-w-6xl mx-auto px-6 py-8 lg:py-12">

                    {/* ── PAGE HEADER ─────────────────────────── */}
                    <div className="mb-10">
                        <Link to="/student/submissions" className="inline-flex items-center gap-2 text-[#8cc63f] font-black text-xs uppercase tracking-widest hover:-translate-x-1 transition-transform mb-8">
                            <FiArrowLeft size={14} /> Back to Submissions
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="text-[#fbc111] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Scholastic Atelier</span>
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-gray-100 tracking-tighter leading-tight">
                                    {toTitleCase(contest?.title || 'Contest')} <br />
                                    <span className="text-[#8cc63f]">Leaderboard</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                    <div className="p-3 bg-emerald-50 rounded-xl">
                                        <FiAward className="text-[#8cc63f]" size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reviewed</p>
                                        <p className="text-2xl font-black text-slate-800 dark:text-gray-100">{leaderboard.length}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => fetchLeaderboard(true)}
                                    disabled={refreshing}
                                    className="p-4 bg-white dark:bg-gray-800 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-sm hover:border-[#8cc63f]/30 hover:bg-[#8cc63f]/5 transition-all text-gray-400 hover:text-[#8cc63f] disabled:opacity-50"
                                >
                                    <FiRefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {leaderboard.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-[40px] py-24 text-center border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <FiAward className="text-slate-300" size={36} />
                            </div>
                            <h3 className="text-slate-900 dark:text-gray-100 font-black text-xl mb-2">No Results Yet</h3>
                            <p className="text-gray-400 font-medium">The leaderboard will appear once the admin reviews submissions.</p>
                        </div>
                    ) : (
                        <>
                            {/* ── TOP 3 PODIUM ───────────────────── */}
                            {top3.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                                    {top3.map((item, index) => {
                                        const info = getParticipantInfo(item);
                                        const cfg = RANK_CONFIG[index];
                                        return (
                                            <div
                                                key={item._id}
                                                className={`relative bg-white dark:bg-gray-800 p-7 rounded-[40px] border-2 ${cfg.border} transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden shadow-lg ${cfg.glow} ${cfg.scale}`}
                                            >
                                                {/* Rank Crown */}
                                                <div className={`absolute top-0 right-0 px-5 py-2.5 rounded-bl-[30px] font-black text-[11px] uppercase tracking-widest text-white ${cfg.badge}`}>
                                                    {cfg.emoji} Rank #{index + 1}
                                                </div>

                                                <div className="flex flex-col items-center text-center pt-4">
                                                    <Avatar src={info.avatar} name={info.avatarName} size="lg" />
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-gray-100 mt-4 mb-1 leading-tight">{info.displayName}</h3>

                                                    {info.isTeam ? (
                                                        <div className="flex flex-wrap justify-center gap-1 mb-3">
                                                            {info.members.map((m, i) => (
                                                                <span key={i} className="text-[9px] bg-[#8cc63f]/10 text-[#8cc63f] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                                                    {toTitleCase(m.name)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${cfg.text}`}>
                                                            {info.domain || 'Solo'}
                                                        </p>
                                                    )}

                                                    <div className="w-full h-px bg-gray-100 my-4" />
                                                    <div className="flex justify-between w-full items-center">
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Score</p>
                                                            <p className="text-3xl font-black text-[#8cc63f]">{item.score || 0}</p>
                                                        </div>
                                                        <div className={`p-3 rounded-2xl ${cfg.badge} bg-opacity-10`}>
                                                            {info.isTeam ? <FiUsers className={cfg.text} size={20} /> : <FiUser className={cfg.text} size={20} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── FULL STANDINGS TABLE ──────────── */}
                            <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 bg-slate-50/ dark:bg-gray-800/ flex items-center justify-between">
                                    <h2 className="text-lg font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">Full Standings</h2>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{leaderboard.length} entries</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-gray-50 dark:border-gray-700">
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Rank</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Team / Solo</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {leaderboard.map((item, index) => {
                                                const info = getParticipantInfo(item);
                                                return (
                                                    <tr key={item._id} className="hover:bg-slate-50/ dark:bg-gray-800/ transition-colors group">
                                                        {/* Rank */}
                                                        <td className="px-8 py-5">
                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                                                                index === 0 ? 'bg-yellow-400 text-white' :
                                                                index === 1 ? 'bg-slate-300 text-white' :
                                                                index === 2 ? 'bg-orange-300 text-white' :
                                                                'bg-slate-100 text-slate-500'
                                                            }`}>
                                                                {index + 1}
                                                            </div>
                                                        </td>

                                                        {/* Participant */}
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar src={info.avatar} name={info.avatarName} />
                                                                <div>
                                                                    <p className="font-black text-slate-800 dark:text-gray-100 text-sm group-hover:text-[#8cc63f] transition-colors">
                                                                        {info.displayName}
                                                                    </p>
                                                                    <div className="flex items-center gap-1 mt-0.5">
                                                                        {info.isTeam ? <FiUsers size={10} className="text-gray-400" /> : <FiUser size={10} className="text-gray-400" />}
                                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                                                                            {info.isTeam ? 'Team' : 'Solo'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Team Members or Domain */}
                                                        <td className="px-8 py-5">
                                                            {info.isTeam ? (
                                                                <div className="flex flex-col gap-1">
                                                                    {info.members.map((m, i) => (
                                                                        <div key={i} className="flex items-center gap-1.5">
                                                                            <span className="text-[9px] text-[#fbc111] font-black">{i === 0 ? '👑' : '·'}</span>
                                                                            <span className="text-[11px] font-bold text-slate-700 dark:text-[#8cc63f] leading-tight">
                                                                                {toTitleCase(m.name)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="px-3 py-1.5 bg-slate-50 dark:bg-gray-800 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-gray-700">
                                                                    {info.domain || 'General'}
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Score */}
                                                        <td className="px-8 py-5 text-center">
                                                            <span className="text-2xl font-black text-slate-800 dark:text-gray-100">{item.score || 0}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </PageTransition>

        </div>
    );
};

export default Leaderboard;
