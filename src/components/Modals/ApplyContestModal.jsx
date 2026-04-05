import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiAward, FiPlusCircle, FiArrowRight, FiMinusCircle } from 'react-icons/fi';

const ApplyContestModal = ({ isOpen, onClose, contestId, onSuccess }) => {
    const [mode, setMode] = useState('individual'); // 'individual' or 'team'
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState([{ name: '', username: '' }]);
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    // Simulated Active User Context
    const activeUser = { id: 'USR_4091', username: '@alex_dev', name: 'Alex Rivera' };

    const handleAddMember = () => {
        if (members.length < 3) {
            setMembers([...members, { name: '', username: '' }]);
        }
    };

    const handleRemoveMember = (index) => {
        if (members.length > 1) {
            const newMembers = members.filter((_, i) => i !== index);
            setMembers(newMembers);
        }
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async () => {
        if (!agreed) {
            alert("You must agree to the Contest Rules before applying.");
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
                alert("Please provide a team name.");
                setIsSubmitting(false);
                return;
            }
            payload.teamData = {
                teamName: teamName,
                members: members.filter(m => m.name.trim() !== '' && m.username.trim() !== ''),
            };
        }

        // Simulate API Transmission Delay
        try {
            console.log("Transmitting Application to Backend...", payload);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Backend Response Success Route
            setIsSubmitting(false);
            onSuccess(); // Triggers parent state tracking
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
                        {/* Togglable Slider for Mode */}
                        <div className="bg-[#ecf0e6] p-1 rounded-2xl flex mb-10 shrink-0">
                            <button 
                                onClick={() => setMode('individual')}
                                className={`flex-1 py-3.5 text-sm font-black rounded-xl transition-all duration-300 cursor-pointer ${
                                    mode === 'individual' 
                                    ? 'bg-white text-[#4a7010] shadow-sm' 
                                    : 'text-gray-500 hover:text-slate-800'
                                }`}
                            >
                                Individual
                            </button>
                            <button 
                                onClick={() => setMode('team')}
                                className={`flex-1 py-3.5 text-sm font-black rounded-xl transition-all duration-300 cursor-pointer ${
                                    mode === 'team' 
                                    ? 'bg-white text-[#4a7010] shadow-sm' 
                                    : 'text-gray-500 hover:text-slate-800'
                                }`}
                            >
                                Team
                            </button>
                        </div>

                        {mode === 'team' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-4">
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Team Name</label>
                                    <input 
                                        type="text"
                                        placeholder="E.g. Pixel Pioneers" 
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-4 border-none outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/30 transition-all font-mono"
                                    />
                                </div>

                                <div className="space-y-8">
                                    {members.map((member, index) => (
                                        <div key={index} className="relative p-6 bg-[#f8faf2] rounded-2xl border border-gray-100">
                                            <div className="flex justify-between items-center mb-6">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                    Member {index + 1} Details
                                                </label>
                                                {index > 0 && (
                                                    <button 
                                                        onClick={() => handleRemoveMember(index)}
                                                        className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        <FiMinusCircle size={14} /> Remove
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                <div className="flex-1 w-full text-left">
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                                        Full Name
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Full name"
                                                        value={member.name}
                                                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                        className="w-full bg-white rounded-xl px-4 py-3.5 border border-gray-100 outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/30 transition-all"
                                                    />
                                                </div>
                                                <div className="flex-1 w-full text-left">
                                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                                        Username
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="@handle"
                                                        value={member.username}
                                                        onChange={(e) => handleMemberChange(index, 'username', e.target.value)}
                                                        className="w-full bg-white rounded-xl px-4 py-3.5 border border-gray-100 outline-none text-sm font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8cc63f]/30 transition-all font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    {members.length < 3 && (
                                        <button 
                                            onClick={handleAddMember}
                                            className="text-[#5c8a14] hover:text-[#8cc63f] flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                                        >
                                            <FiPlusCircle size={16} /> Add another member
                                        </button>
                                    )}
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
