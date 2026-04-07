import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiAward, FiPlusCircle, FiArrowRight, FiMinusCircle, FiSearch, FiUserPlus, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const ApplyContestModal = ({ isOpen, onClose, contestId, contest, onSuccess }) => {
    const { users } = useUsers();
    const { user: activeUser } = useAuth();

    const [mode, setMode] = useState(contest?.projectType?.toLowerCase() || 'individual');
    const [teamName, setTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!agreed) {
            toast.warning("You must agree to the Contest Rules before applying.");
            return;
        }

        setIsSubmitting(true);

        // Construct Backend Payload exactly as requested
        const payload = {
            contestId: contestId,
            userId: activeUser.id,
            participatingAs: mode,
            primaryUser: {
                name: activeUser.name,
                username: activeUser.username,
            }
        };

        if (mode === 'team') {
            if (!teamName.trim()) {
                toast.warning("Please provide a team name.");
                setIsSubmitting(false);
                return;
            }
            payload.teamData = {
                teamName: teamName,
                members: selectedMembers.map(m => ({ id: m.id, name: m.name, username: m.username })),
            };
        }

        // =========================================================================
        // 🚀 [BACKEND] SUBMIT CONTEST APPLICATION
        // =========================================================================
        // Endpoint: POST /api/v1/contests/apply
        // Headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        // Payload (already built above as `payload`):
        // {
        //   contestId,
        //   userId,
        //   participatingAs: 'individual' | 'team',
        //   primaryUser: { name, username },
        //   teamData?: { teamName, members: [{ name, username }] }  // only if team
        // }
        //
        // const res = await fetch('http://YOUR_BACKEND_URL/api/v1/contests/apply', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   },
        //   body: JSON.stringify(payload)
        // });
        //
        // if (res.ok) {
        //   onSuccess();
        // } else {
        //   const err = await res.json();
        //   toast.error(err.message || 'Application failed.');
        // }
        // =========================================================================
        try {
            console.log("Transmitting Application to Backend...", payload);
            // MOCK delay — DELETE when API is ready:
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitting(false);
            onSuccess();
        } catch(error) {
            console.error("Backend Error", error);
            setIsSubmitting(false);
        }
    };

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
                        {/* Only show toggle if not forced by admin */}
                        {/* Solo Mode Indicator (Optional, subtle) */}
                        {mode === 'individual' && (
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
                        )}

                        {mode === 'team' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-4">
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                        <div className="w-1.5 h-4 bg-[#8cc63f] rounded-full" />
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identify Your Team</label>
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="E.g. Pixel Pioneers" 
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-4 border-none outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/30 transition-all font-mono"
                                    />
                                </div>

                                {/* Teammate Selection Registry */}
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1 ml-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-[#fbc111] rounded-full" />
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Scholars</label>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 italic">
                                            This is a team project. You can add up to <span className="text-[#8cc63f] font-black">{contest?.maxTeamSize || 4}</span> members (including yourself).
                                        </p>
                                    </div>
                                    <div className="flex justify-end -mt-4">
                                        <span className="text-[10px] font-black text-[#8cc63f] uppercase bg-[#8cc63f]/5 px-2 py-1 rounded-md border border-[#8cc63f]/10">
                                            {selectedMembers.length + 1} / {contest?.maxTeamSize || 4} Members Added
                                        </span>
                                    </div>

                                    {/* Search Input */}
                                    <div className="relative">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input 
                                            type="text"
                                            placeholder={`Search ${contest?.domain || ''} scholars...`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-[#f8faf2] rounded-xl pl-12 pr-4 py-3.5 border-none outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#fbc111]/30 transition-all"
                                        />
                                    </div>

                                    {/* Filtered Scholars List */}
                                    {searchQuery.trim() && (
                                        <div className="max-h-48 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-lg p-2 space-y-1 custom-scrollbar">
                                            {users
                                                .filter(u => 
                                                    u.domain === (contest?.domain || 'Development') &&
                                                    u.username !== activeUser?.username &&
                                                    !selectedMembers.some(sm => sm.id === u.id) &&
                                                    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
                                                ).slice(0, 5).map(u => (
                                                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                                                                {u.name[0]}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-800">{u.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 font-mono">{u.username}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                if (selectedMembers.length + 1 >= (contest?.maxTeamSize || 4)) {
                                                                    toast.warning(`Maximum ${contest?.maxTeamSize || 4} members allowed.`);
                                                                    return;
                                                                }
                                                                setSelectedMembers([...selectedMembers, u]);
                                                                setSearchQuery('');
                                                            }}
                                                            className="p-2 text-[#8cc63f] hover:bg-[#8cc63f]/10 rounded-full transition-all"
                                                        >
                                                            <FiUserPlus size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            {users.filter(u => u.domain === (contest?.domain || 'Development') && u.username !== activeUser?.username && !selectedMembers.some(sm => sm.id === u.id) && (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))).length === 0 && (
                                                <div className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching scholars found</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Registrants Display */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Active User (Leader) */}
                                        <div className="p-4 bg-[#8cc63f]/5 border border-[#8cc63f]/20 rounded-2xl flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8cc63f] to-[#fbc111] p-[2px]">
                                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                                                    YOU
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[#8cc63f] uppercase leading-none mb-1">Scholar Leader</p>
                                                <p className="text-sm font-black text-slate-800 truncate">{activeUser?.name || 'Active Scholar'}</p>
                                            </div>
                                        </div>

                                        {/* Teammates */}
                                        {selectedMembers.map((member) => (
                                            <div key={member.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group animate-in fade-in slide-in-from-left-2 duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        {member.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Registrant</p>
                                                        <p className="text-sm font-black text-slate-800 truncate">{member.name}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedMembers(selectedMembers.filter(m => m.id !== member.id))}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all flex justify-center items-center gap-3 shadow-xl ${
                                isSubmitting 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-[#8cc63f] to-[#e6d013] hover:brightness-105 text-slate-900 shadow-[#8cc63f]/30 active:scale-95 cursor-pointer'
                            }`}
                        >
                            {isSubmitting ? 'Processing Payload...' : 'Apply Now'} {!isSubmitting && <FiArrowRight size={16} />}
                        </button>
                    </div>

                </div>
            </div>
            
            {/* CSS to ensure custom scrollbars inside modal don't look overly rugged */}
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
