// ============================================================
// TeamDetailsModal.jsx — Student er team details dekhার r change request er modal
// Team er name, leader, members r tader status (ACCEPTED/PENDING) dekhano hoy.
// "Change Team Request" button click korle reason textarea show hoy.
// Reason diye submit korle admin ke request pathano hoy.
// Contest e already apply kora thakle team change r possible na — tai admin authorize korbe.
// isOpen + contestId diye mount hole API call kore team fetch kora hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiUsers, FiUser, FiShield, FiAlertTriangle, FiArrowRight, FiCheckCircle, FiSearch, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const TeamDetailsModal = ({ isOpen, onClose, contestId, contestTitle }) => {
    const { user } = useAuth();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequestingChange, setIsRequestingChange] = useState(false);
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // Add member states
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pendingInvites, setPendingInvites] = useState([]);

    const fetchTeamDetails = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/student/team-status/${contestId}`);
            if (res.data.success) {
                setTeam(res.data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch team details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && contestId) {
            fetchTeamDetails();
            setIsAddingMember(false);
            setSearchQuery('');
            setSearchResults([]);
        }
    }, [isOpen, contestId]);

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

    const handleTeamChangeRequest = async () => {
        if (!reason.trim()) {
            toast.warning("Please provide a reason for the team change.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/student/team/request-change', { contestId, reason });
            if (res.data.success) {
                toast.success("Request sent to Admin successfully! 🚀", { theme: "colored" });
                setIsRequestingChange(false);
                setReason('');
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendInvite = async (member) => {
        try {
            setPendingInvites(prev => [...prev, member._id]);
            const res = await api.post('/student/team/invite', {
                contestId,
                teamName: team.name,
                memberId: member._id
            });
            if (res.data.success) {
                toast.success(`Invite sent successfully to ${member.name}!`, { theme: "colored" });
                setTeam(res.data.data);
                setSearchQuery('');
                setSearchResults([]);
                setIsAddingMember(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send invite.");
        } finally {
            setPendingInvites(prev => prev.filter(id => id !== member._id));
        }
    };

    const isLeader = team && user && team.leader?._id === user._id;
    const maxTeamSize = team?.contest?.maxTeamSize || Infinity;
    const currentMemberCount = 1 + (team?.members?.length || 0);
    const canAddMore = team?.participationType === 'Team' && isLeader && currentMemberCount < maxTeamSize;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-[#f8faf2]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#8cc63f] flex items-center justify-center text-white shadow-lg shadow-[#8cc63f]/20 shrink-0">
                            <FiUsers size={18} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[11px] md:text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1 truncate">Squad Directory</h3>
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 truncate max-w-[150px] md:max-w-[200px]">{contestTitle}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-all shrink-0"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-transparent border-t-[#8cc63f] border-b-[#fbc111] rounded-full mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Team Intel...</p>
                        </div>
                    ) : team ? (
                        <div className="space-y-6">
                            {/* Team Identity / Solo Status */}
                            <div className={`rounded-2xl p-5 border ${team.participationType === 'Solo' ? 'bg-[#fbc111]/5 border-[#fbc111]/10' : 'bg-[#8cc63f]/5 border-[#8cc63f]/10'}`}>
                                <h4 className={`text-[9px] font-black uppercase tracking-widest mb-1 ${team.participationType === 'Solo' ? 'text-[#d4a017]' : 'text-[#8cc63f]'}`}>
                                    {team.participationType === 'Solo' ? 'Deployment Type' : 'Squad Callsign'}
                                </h4>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                                    {team.participationType === 'Solo' ? 'Solo Mission' : team.name}
                                </h2>
                            </div>

                            {/* Members List / Registry */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {team.participationType === 'Solo' ? 'Individual Registry' : 'Member Registry'}
                                </p>
                                
                                {/* Leader/Self */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white relative shrink-0 ${team.participationType === 'Solo' ? 'bg-[#fbc111]' : 'bg-slate-800'}`}>
                                            {team.leader?.name?.[0] || '?'}
                                            {team.participationType !== 'Solo' && (
                                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#fbc111] rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Leader">
                                                    <FiShield size={7} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] md:text-xs font-black text-slate-800 truncate">{team.leader?.name}</p>
                                            <p className="text-[8px] md:text-[9px] font-black text-[#8cc63f] uppercase tracking-tighter">
                                                {team.participationType === 'Solo' ? 'Participant' : 'Leader / Captain'}
                                            </p>
                                        </div>
                                        <span className={`sm:hidden text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${team.enrollmentStatus === 'REGISTERED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                            {team.enrollmentStatus}
                                        </span>
                                    </div>
                                    <span className={`hidden sm:block text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${team.enrollmentStatus === 'REGISTERED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                        {team.enrollmentStatus}
                                    </span>
                                </div>

                                {/* Others (Only if Team) */}
                                {team.participationType === 'Team' && team.members?.map((m, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                                                {m.user?.name?.[0] || '?'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[11px] md:text-xs font-black text-slate-800 truncate">{m.user?.name}</p>
                                                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate">Teammate / Scholar</p>
                                            </div>
                                            <span className={`sm:hidden text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'ACCEPTED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                                {m.status}
                                            </span>
                                        </div>
                                        <span className={`hidden sm:block text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'ACCEPTED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                            {m.status}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!isRequestingChange && !isAddingMember ? (
                                <div className="space-y-3 pt-2">
                                    {canAddMore && (
                                        <button 
                                            onClick={() => setIsAddingMember(true)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#8cc63f]/10 text-[#8cc63f] hover:bg-[#8cc63f]/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors mb-2"
                                        >
                                            <FiUserPlus size={14} /> Invite New Teammate ({currentMemberCount}/{maxTeamSize})
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setIsRequestingChange(true)}
                                        className="w-full flex items-center justify-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors pt-2 group"
                                    >
                                        <FiAlertTriangle className="group-hover:animate-bounce" /> Change Team Request
                                    </button>
                                </div>
                            ) : isAddingMember ? (
                                <div className="space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <label className="text-[10px] font-black text-[#8cc63f] uppercase tracking-widest ml-1 mb-2 block">Search for Scholars</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiSearch className="text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Search by name or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] outline-none transition-all"
                                            />
                                            {isSearching && (
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#8cc63f] rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {searchResults.length > 0 && (
                                        <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50 bg-white shadow-inner">
                                            {searchResults.map(m => (
                                                <div key={m._id} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3 w-full min-w-0">
                                                        <div className="w-8 h-8 rounded-full bg-[#fbc111] flex items-center justify-center text-[10px] font-black text-slate-800 shrink-0">
                                                            {m.name?.[0] || '?'}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[11px] md:text-xs font-black text-slate-800 truncate">{m.name}</p>
                                                            <p className="text-[9px] font-bold text-gray-400 font-mono truncate">{m.email}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleSendInvite(m)}
                                                        disabled={pendingInvites.includes(m._id)}
                                                        className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pendingInvites.includes(m._id) ? 'bg-gray-100 text-gray-400' : 'bg-[#8cc63f] text-white hover:bg-[#7ab332]'}`}
                                                    >
                                                        {pendingInvites.includes(m._id) ? 'Inviting...' : 'Add'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-2">
                                        <button 
                                            onClick={() => {
                                                setIsAddingMember(false);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                            className="px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mb-2 block">Reason for Departure</label>
                                        <textarea 
                                            placeholder="Explain why you wish to leave this squad..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[11px] md:text-xs font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button 
                                            onClick={() => setIsRequestingChange(false)}
                                            className="w-full sm:flex-1 py-3 md:py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all order-2 sm:order-1"
                                        >
                                            Abort
                                        </button>
                                        <button 
                                            onClick={handleTeamChangeRequest}
                                            disabled={submitting}
                                            className="w-full sm:flex-[2] py-3 md:py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                                        >
                                            {submitting ? 'Transmitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <FiUsers className="mx-auto text-gray-200 mb-4" size={48} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No active squad detected.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 text-center">
                    <p className="text-[10px] font-bold text-gray-400">All squad modifications require administrative authorization.</p>
                </div>

            </div>
        </div>
    );
};

export default TeamDetailsModal;
