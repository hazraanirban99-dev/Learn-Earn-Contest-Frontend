// ============================================================
// ApplyContestModal.jsx — Contest apply korar modal (Student)
// Contest er projectType "Team" hole team creation flow show hoy.
// "Team" type contest hole:
//   - Prothome team status check kora hoy (already kono team e ache kina)
//   - Jodi na thake, nai naam diye teammate search kore invite pathano jay
//   - Team confirmed hole apply kora jay
// "Solo" type contest hole shudhu rules agree kore apply kora jay.
// Apply button click hole /student/contests/apply endpoint e POST ra hoy.
// Success hole onSuccess() callback call hoy (parent re-sync korbe).
// ============================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAward, FiPlusCircle, FiArrowRight, FiMinusCircle, FiSearch, FiUserPlus, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ApplyContestModal = ({ isOpen, onClose, contestId, contest, onSuccess }) => {
    const { user: activeUser, updateUser } = useAuth();

    const isBoth = contest?.projectType === 'Both';
    const [choice, setChoice] = useState(isBoth ? null : (contest?.projectType === 'Team' ? 'Team' : 'Solo'));
    const isTeamContest = choice === 'Team';
    const [teamData, setTeamData] = useState(null);
    const [checkingTeam, setCheckingTeam] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    const [teamName, setTeamName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pendingInvites, setPendingInvites] = useState([]);

    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name[0].toUpperCase();
    };

    const renderSearchResults = () => {
        if (!searchResults.length) return null;
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden divide-y divide-gray-50 max-h-60 overflow-y-auto mt-2">
                {searchResults.map(m => (
                    <div key={m._id} className="p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#8cc63f] to-[#7ab332] text-white flex items-center justify-center font-black text-[10px] md:text-xs overflow-hidden shadow-inner shrink-0">
                                {m.avatar?.url ? (
                                    <img src={m.avatar.url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    getInitials(m.name)
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs md:text-sm font-black text-slate-800 dark:text-gray-100 truncate">{m.name}</p>
                                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 font-mono truncate">{m.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSendInvite(m)}
                            disabled={pendingInvites.includes(m._id)}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${pendingInvites.includes(m._id) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#8cc63f] text-white hover:bg-[#7ab332] shadow-lg shadow-[#8cc63f]/20'}`}
                        >
                            {pendingInvites.includes(m._id) ? 'Requesting...' : 'Request for Add'}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    // Initial check for team status if it's a team contest
    const checkStatus = async () => {
        setCheckingTeam(true);
        try {
            const res = await api.get(`/student/team-status/${contestId}`);
            if (res.data.success && res.data.data) {
                setTeamData(res.data.data);
                setTeamName(res.data.data.name);
            }
            setHasChecked(true);
            toast.success("Team status verified!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to verify team status.");
        } finally {
            setCheckingTeam(false);
        }
    };

    // Real-time teammate search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const res = await api.get(`/student/teammates/search?query=${searchQuery}&contestId=${contestId}`);
                    if (res.data.success) {
                        setSearchResults(res.data.data);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, contestId]);

    const handleSendInvite = async (member) => {
        if (!teamName.trim()) {
            toast.warning("Please enter a team name first!");
            return;
        }

        try {
            setPendingInvites(prev => [...prev, member._id]);
            const res = await api.post('/student/team/invite', {
                contestId,
                teamName,
                memberId: member._id
            });
            if (res.data.success) {
                toast.success(`Request for a team sent to ${member.name}`, { theme: "colored" });
                // Always sync the latest team state from backend (includes new member)
                setTeamData(res.data.data);
                setSearchQuery(''); // Clear search after invite
                setSearchResults([]);

                // Sync profile so "View Team Status" button appears on parent page
                try {
                    const profRes = await api.get('/users/me');
                    if (profRes.data.success) {
                        updateUser(profRes.data.data);
                    }
                } catch (profErr) {
                    console.error("Profile sync error after team creation:", profErr);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send invite.");
            setPendingInvites(prev => prev.filter(id => id !== member._id));
        }
    };

    const handleSubmit = async () => {
        if (!agreed && !isTeamContest) {
            toast.warning("You must agree to the Contest Rules before applying.");
            return;
        }

        if (isTeamContest) {
            if (!teamData) {
                toast.error("Please create your team and invite members first!");
                return;
            }
            
            const filledSlots = 1 + (teamData.members?.length || 0);
            if (filledSlots < contest.maxTeamSize) {
                toast.warning(`Wait! Your team needs ${contest.maxTeamSize} members. Current: ${filledSlots}/${contest.maxTeamSize}. Add more scholars first.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/student/contests/apply', { 
                contestId,
                isTeam: isTeamContest,
                teamId: teamData?._id
            });
            if (response.data.success) {
                // Refetch user profile to sync across global context
                try {
                    const userRes = await api.get('/users/me');
                    if (userRes.data.success) {
                        updateUser(userRes.data.data);
                    }
                } catch (profErr) {
                    console.error("Error updating user profile after apply:", profErr);
                }

                toast.success(isTeamContest ? "Team Application Transmitted! Awaiting Squad Completion... 🕒" : "Successfully applied for the contest! 🚀");
                setIsSubmitting(false);
                onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply for the contest.");
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 overflow-y-auto pt-32 pb-10 bg-slate-900/40 backdrop-blur-sm">

            {/* Dark Frosted Background Overlay */}
            <div
                className="fixed inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 h-auto md:h-[min(700px,95vh)]">

                {/* Left Sidebar (Dark Green Design) */}
                <div className="hidden md:flex w-2/5 bg-[#4a7010] p-10 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-white text-sm font-black tracking-widest uppercase mb-12">Desun Academy</h2>
                        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mt-12 mb-6">
                            Ready to prove your skills?
                        </h1>
                    </div>

                    <div className="space-y-6 relative z-10 mt-12">
                        <div className="flex items-center gap-4">
                            <FiAward className="text-[#fbc111]" size={24} />
                            <span className="text-white font-bold text-sm">Official Certificate</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <FiCheckCircle className="text-[#fbc111]" size={24} />
                            <span className="text-white font-bold text-sm">Expert Mentorship</span>
                        </div>
                    </div>

                    {/* Subtle aesthetic gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Right Form Container */}
                <div className="w-full md:w-3/5 relative flex flex-col h-full bg-white dark:bg-gray-800">

                    {/* Fixed Header */}
                    <div className="p-6 md:p-8 lg:p-12 pb-4 shrink-0 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-slate-800 dark:text-gray-100 transition-colors p-2 rounded-full hover:bg-gray-100 z-20"
                        >
                            <FiX size={20} className="md:hidden" />
                            <FiX size={24} className="hidden md:block" />
                        </button>

                        <div className="pr-8">
                            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-gray-100 mb-1 md:mb-2">Apply for Contest</h2>
                            <p className="text-gray-500 font-medium text-[11px] md:text-sm">Fill in the details to register your participation.</p>
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-12 custom-scrollbar pb-8">

                        {isBoth && !choice ? (
                            <div className="h-full flex flex-col justify-center items-center py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-gray-100">Choose Your Path</h3>
                                    <p className="text-gray-500 text-sm font-medium">How would you like to participate in this contest?</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
                                    <button
                                        onClick={() => setChoice('Solo')}
                                        className="group p-6 bg-[#8cc63f]/5 border-2 border-[#8cc63f]/20 hover:border-[#8cc63f] rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center gap-4 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-[#8cc63f] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            <FiUserPlus size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">Solo Entry</h4>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Work independently and prove your skills.</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setChoice('Team')}
                                        className="group p-6 bg-[#fbc111]/5 border-2 border-[#fbc111]/20 hover:border-[#fbc111] rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center gap-4 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-[#fbc111] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            <FiUsers size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">Team Squad</h4>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Collaborate with fellow scholars.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isBoth && (
                                    <button 
                                        onClick={() => {
                                            setChoice(null);
                                            setHasChecked(false);
                                            setTeamData(null);
                                        }}
                                        className="mb-6 flex items-center gap-2 text-[10px] font-black text-[#8cc63f] uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                                    >
                                        <span>← Change Participation Type</span>
                                    </button>
                                )}
                                {!isTeamContest ? (
                            <div className="mb-10 animate-in fade-in duration-500">
                                <div className="bg-[#8cc63f]/5 border border-[#8cc63f]/20 rounded-2xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#8cc63f] flex items-center justify-center text-white shadow-lg">
                                        <FiUserPlus size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">Individual Entry</h4>
                                        <p className="text-[11px] font-bold text-gray-400 font-sans mt-0.5">You are applying for this scholastic challenge as a solo contestant.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-4">
                                {/* Step 0: High visibility warning */}
                                {!hasChecked ? (
                                    <div className="text-center py-10">
                                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6">
                                            <FiUsers className="mx-auto text-red-500 mb-4" size={40} />
                                            <h3 className="text-sm font-black text-red-600 uppercase tracking-widest mb-2">Its a team project select your team</h3>
                                            <p className="text-[10px] font-bold text-slate-600 dark:text-gray-300">Please verify if you are already part of a squad or create a new one.</p>
                                        </div>
                                        <button
                                            onClick={checkStatus}
                                            disabled={checkingTeam}
                                            className="bg-[#8cc63f] hover:bg-[#7ab332] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-[#8cc63f]/20 active:scale-95 flex items-center gap-2 mx-auto"
                                        >
                                            {checkingTeam ? 'Checking...' : 'Check if you are already added in any group'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {teamData ? (
                                            <div className="space-y-6">
                                                <div className="bg-[#8cc63f]/5 border border-[#8cc63f]/20 rounded-2xl p-6">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-black text-[#8cc63f] uppercase tracking-[0.2em] mb-1">Your Squad</h4>
                                                            <h3 className="text-2xl font-black text-slate-800 dark:text-gray-100 tracking-tight">{teamData.name}</h3>
                                                        </div>
                                                        <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-[#8cc63f]/20 shadow-sm text-[10px] font-black text-slate-800 dark:text-gray-100 uppercase tracking-widest">
                                                            Team Confirmed
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center ml-1 mb-3">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Members Registry</p>
                                                            <span className="text-[10px] font-black text-[#8cc63f] uppercase tracking-widest bg-[#8cc63f]/10 px-2.5 py-1 rounded-full border border-[#8cc63f]/20 shrink-0">
                                                                {1 + (teamData.members?.length || 0)} / {contest?.maxTeamSize || 1} Slots
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Leader */}
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-50 dark:border-gray-700 gap-3">
                                                            <div className="flex items-center gap-3 w-full">
                                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white uppercase overflow-hidden shadow-inner shrink-0">
                                                                    {teamData.leader?.avatar?.url ? (
                                                                        <img src={teamData.leader.avatar.url} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        getInitials(teamData.leader?.name)
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-black text-slate-800 dark:text-gray-100 truncate">{teamData.leader?.name}</p>
                                                                    <p className="text-[10px] font-bold text-[#8cc63f] uppercase tracking-tighter">Leader</p>
                                                                </div>
                                                                <span className="sm:hidden text-[9px] font-black text-[#8cc63f] uppercase tracking-widest bg-[#8cc63f]/10 px-2 py-1 rounded">Creator</span>
                                                            </div>
                                                            <span className="hidden sm:block text-[9px] font-black text-[#8cc63f] uppercase tracking-widest bg-[#8cc63f]/10 px-2 py-1 rounded">Creator</span>
                                                        </div>

                                                        {/* Multi Members */}
                                                        {teamData.members && teamData.members.map((m, idx) => (
                                                            <div key={m.user?._id || idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-50 dark:border-gray-700 gap-3">
                                                                <div className="flex items-center gap-3 w-full">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700 shrink-0">
                                                                        {m.user?.avatar?.url ? (
                                                                            <img src={m.user.avatar.url} className="w-full h-full object-cover" alt="" />
                                                                        ) : (
                                                                            getInitials(m.user?.name)
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-black text-slate-800 dark:text-gray-100 truncate">{m.user?.name}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 font-mono italic truncate">{m.user?.email}</p>
                                                                    </div>
                                                                    <span className={`sm:hidden text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'ACCEPTED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                                                        {m.status}
                                                                    </span>
                                                                </div>
                                                                <span className={`hidden sm:block text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'ACCEPTED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                                                    {m.status}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Invite More Section (If team exists but not full) */}
                                                {(teamData.members?.length || 0) + 1 < (contest?.maxTeamSize || 0) && (
                                                    <div className="pt-6 border-t border-dashed border-gray-100 dark:border-gray-700 mt-6">
                                                        <div className="flex items-center gap-2 mb-4 ml-1">
                                                            <div className="w-1.5 h-4 bg-[#fbc111] rounded-full" />
                                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Invite More Teammates</label>
                                                        </div>
                                                        <div className="relative">
                                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                            <input
                                                                type="text"
                                                                placeholder={`Find more scholars for your squad...`}
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                className="w-full bg-[#f8faf2] dark:bg-gray-900 rounded-xl pl-12 pr-4 py-4 border-none outline-none text-sm font-bold text-slate-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#fbc111]/30 transition-all shadow-sm"
                                                            />
                                                        </div>
                                                        {renderSearchResults()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                                                <div className="text-center pb-2">
                                                    <span className="bg-red-500 text-white px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">NO, Create your team</span>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                                        <div className="w-1 h-3 md:w-1.5 md:h-4 bg-[#8cc63f] rounded-full" />
                                                        <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Team Name</label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="E.g. Full Stack Wizards"
                                                        value={teamName}
                                                        onChange={(e) => setTeamName(e.target.value)}
                                                        className="w-full bg-[#f8faf2] dark:bg-gray-900 rounded-xl px-4 py-3 md:py-4 border-none outline-none text-xs md:text-sm font-bold text-slate-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/30 transition-all font-mono"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                                        <div className="w-1 h-3 md:w-1.5 md:h-4 bg-[#fbc111] rounded-full" />
                                                        <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Add Teammates</label>
                                                    </div>
                                                    <div className="relative">
                                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                        <input
                                                            type="text"
                                                            placeholder={`Search for scholars...`}
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="w-full bg-[#f8faf2] dark:bg-gray-900 rounded-xl pl-10 md:pl-12 pr-4 py-3 md:py-4 border-none outline-none text-xs md:text-sm font-bold text-slate-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#fbc111]/30 transition-all shadow-sm"
                                                        />
                                                    </div>
                                                    {renderSearchResults()}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        </>
                        )}
                    </div>

                    {/* Fixed Footer */}
                    {(choice || !isBoth) && (
                        <div className="px-6 md:px-8 lg:px-12 py-4 md:py-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
                        {!isTeamContest && (
                            <label className="flex items-start gap-4 p-4 bg-[#f8faf2] dark:bg-gray-900 rounded-2xl cursor-pointer hover:bg-[#ecf0e6] dark:hover:bg-gray-700/50 transition-colors mb-4 md:mb-6">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-[#8cc63f] bg-white dark:bg-gray-800 border-gray-300 rounded focus:ring-[#8cc63f] shrink-0"
                                />
                                <span className="text-[10px] md:text-xs font-medium text-gray-600 leading-relaxed text-left">
                                    I agree to the <span className="font-bold text-[#8cc63f] underline">Contest Rules</span> and confirm that all members are currently enrolled in Desun Academy.
                                </span>
                            </label>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || (isTeamContest && (!hasChecked || (teamData && (1 + (teamData.members?.length || 0)) < contest?.maxTeamSize)))}
                            className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all flex justify-center items-center gap-2 md:gap-3 shadow-xl ${(isSubmitting || (isTeamContest && (!hasChecked || (teamData && (1 + (teamData.members?.length || 0)) < contest?.maxTeamSize))))
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-[#8cc63f] to-[#fbc111] hover:brightness-105 text-slate-900 dark:text-gray-100 shadow-[#8cc63f]/30 active:scale-95 cursor-pointer'
                                }`}
                        >
                            <span className="truncate">
                                {isSubmitting ? 'Processing...' : (isTeamContest && teamData && (1 + (teamData.members?.length || 0)) < contest?.maxTeamSize) ? 'Waiting for Full Squad' : 'Apply Now'}
                            </span>
                            {!isSubmitting && <FiArrowRight size={16} className="shrink-0" />}
                        </button>
                    </div>
                    )}

                </div>
            </div>

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ecf0e6;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default ApplyContestModal;
