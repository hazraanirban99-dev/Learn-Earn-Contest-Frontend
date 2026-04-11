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
    const { user: activeUser } = useAuth();

    const [isTeamContest] = useState(contest?.projectType === 'Team');
    const [teamData, setTeamData] = useState(null);
    const [checkingTeam, setCheckingTeam] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);
    
    const [teamName, setTeamName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pendingInvites, setPendingInvites] = useState([]); // Array of member IDs being requested

    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial check for team status if it's a team contest
    const checkStatus = async () => {
        setCheckingTeam(true);
        try {
            const res = await api.get(`/student/team/status/${contestId}`);
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
                // We don't need to do much here, the status will update on next "check" or poll
                // But let's refresh local team data if we just created it
                if (!teamData) {
                    setTeamData(res.data.data);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send invite.");
            setPendingInvites(prev => prev.filter(id => id !== member._id));
        }
    };

    const handleSubmit = async () => {
        if (!agreed) {
            toast.warning("You must agree to the Contest Rules before applying.");
            return;
        }

        if (isTeamContest) {
            if (!teamData) {
                toast.error("Properly create your team as per rule before applying.");
                return;
            }
            const acceptedMembers = teamData.members?.filter(m => m.status === 'ACCEPTED') || [];
            if (acceptedMembers.length + 1 < (contest.minTeamSize || 1)) {
                toast.error(`At least ${contest.minTeamSize || 1} members must accept before you can apply.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/student/contests/apply', { contestId });
            if (response.data.success) {
                toast.success("Successfully applied for the contest! 🚀");
                setIsSubmitting(false);
                onSuccess();
            }
        } catch(error) {
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
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 h-auto md:h-[min(700px,90vh)]">
                
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
                <div className="w-full md:w-3/5 relative flex flex-col h-full bg-white">
                    
                    {/* Fixed Header */}
                    <div className="p-8 lg:p-12 pb-4 shrink-0 relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-gray-100 z-20"
                        >
                            <FiX size={24} />
                        </button>

                        <div className="pr-8">
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Apply for Contest</h2>
                            <p className="text-gray-500 font-medium text-sm">Fill in the details to register your participation.</p>
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-8 lg:px-12 custom-scrollbar pb-8">
                        
                        {!isTeamContest ? (
                            <div className="mb-10 animate-in fade-in duration-500">
                                <div className="bg-[#8cc63f]/5 border border-[#8cc63f]/20 rounded-2xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#8cc63f] flex items-center justify-center text-white shadow-lg">
                                        <FiUserPlus size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Individual Entry</h4>
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
                                            <p className="text-[10px] font-bold text-gray-400">Please verify if you are already part of a squad or create a new one.</p>
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
                                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{teamData.name}</h3>
                                                        </div>
                                                        <div className="px-4 py-2 bg-white rounded-xl border border-[#8cc63f]/20 shadow-sm text-[10px] font-black text-slate-800 uppercase tracking-widest">
                                                            Team Confirmed
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3">Members Registry</p>
                                                        {/* Leader */}
                                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-50">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                                                                    {teamData.leader?.name[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black text-slate-800">{teamData.leader?.name}</p>
                                                                    <p className="text-[10px] font-bold text-[#8cc63f] uppercase tracking-tighter">Leader</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[9px] font-black text-[#8cc63f] uppercase tracking-widest bg-[#8cc63f]/10 px-2 py-1 rounded">Accepted</span>
                                                        </div>
                                                        {/* Other Members */}
                                                        {teamData.members?.map(m => (
                                                            <div key={m.user?._id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-50">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                                        {m.user?.name[0]}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-black text-slate-800">{m.user?.name}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 font-mono italic">{m.user?.email}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'ACCEPTED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : m.status === 'PENDING' ? 'text-amber-500 bg-amber-50' : 'text-red-500 bg-red-50'}`}>
                                                                    {m.status}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8 animate-in fade-in duration-500">
                                                <div className="text-center pb-4">
                                                    <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">NO, Create your team</span>
                                                </div>
                                                
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                                        <div className="w-1.5 h-4 bg-[#8cc63f] rounded-full" />
                                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Team Name</label>
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        placeholder="E.g. Full Stack Wizards" 
                                                        value={teamName}
                                                        onChange={(e) => setTeamName(e.target.value)}
                                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-4 border-none outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/30 transition-all font-mono"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                                        <div className="w-1.5 h-4 bg-[#fbc111] rounded-full" />
                                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Add Teammates</label>
                                                    </div>
                                                    <div className="relative">
                                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input 
                                                            type="text"
                                                            placeholder={`Search for ${contest?.domain || 'Development'} scholars...`}
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="w-full bg-[#f8faf2] rounded-xl pl-12 pr-4 py-4 border-none outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#fbc111]/30 transition-all"
                                                        />
                                                    </div>

                                                    {/* Search Results */}
                                                    {searchResults.length > 0 && (
                                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden divide-y divide-gray-50 max-h-60 overflow-y-auto">
                                                            {searchResults.map(m => (
                                                                <div key={m._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-[#8cc63f] text-white flex items-center justify-center font-black text-xs overflow-hidden">
                                                                            {m.avatar?.url ? <img src={m.avatar.url} className="w-full h-full object-cover" /> : m.name[0]}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-black text-slate-800">{m.name}</p>
                                                                            <p className="text-[10px] font-bold text-gray-400 font-mono">{m.email}</p>
                                                                        </div>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => handleSendInvite(m)}
                                                                        disabled={pendingInvites.includes(m._id)}
                                                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pendingInvites.includes(m._id) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#8cc63f] text-white hover:bg-[#7ab332] shadow-lg shadow-[#8cc63f]/20'}`}
                                                                    >
                                                                        {pendingInvites.includes(m._id) ? 'Requesting...' : 'Request for Add'}
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fixed Footer */}
                    <div className="px-8 lg:px-12 py-6 border-t border-gray-100 bg-white shrink-0">
                        <label className="flex items-start gap-4 p-4 bg-[#f8faf2] rounded-2xl cursor-pointer hover:bg-[#ecf0e6] transition-colors mb-6">
                            <input 
                                type="checkbox" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#8cc63f] bg-white border-gray-300 rounded focus:ring-[#8cc63f] shrink-0" 
                            />
                            <span className="text-xs font-medium text-gray-600 leading-relaxed text-left">
                                I agree to the <span className="font-bold text-[#8cc63f] underline">Contest Rules</span> and confirm that all members are currently enrolled in Desun Academy.
                            </span>
                        </label>

                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting || (isTeamContest && !hasChecked)}
                            className={`w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all flex justify-center items-center gap-3 shadow-xl ${
                                (isSubmitting || (isTeamContest && !hasChecked))
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-[#8cc63f] to-[#fbc111] hover:brightness-105 text-slate-900 shadow-[#8cc63f]/30 active:scale-95 cursor-pointer'
                            }`}
                        >
                            {isSubmitting ? 'Processing...' : 'Apply Now'} {!isSubmitting && <FiArrowRight size={16} />}
                        </button>
                    </div>

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
