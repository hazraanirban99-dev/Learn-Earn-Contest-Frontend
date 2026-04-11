// ============================================================
// TeamDetailsModal.jsx — Student er team details dekhার r change request er modal
// Team er name, leader, members r tader status (ACCEPTED/PENDING) dekhano hoy.
// "Change Team Request" button click korle reason textarea show hoy.
// Reason diye submit korle admin ke request pathano hoy.
// Contest e already apply kora thakle team change r possible na — tai admin authorize korbe.
// isOpen + contestId diye mount hole API call kore team fetch kora hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiUsers, FiUser, FiShield, FiAlertTriangle, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const TeamDetailsModal = ({ isOpen, onClose, contestId, contestTitle }) => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequestingChange, setIsRequestingChange] = useState(false);
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTeamDetails = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/student/team/status/${contestId}`);
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
        }
    }, [isOpen, contestId]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-[#f8faf2]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8cc63f] flex items-center justify-center text-white shadow-lg shadow-[#8cc63f]/20">
                            <FiUsers size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Squad Directory</h3>
                            <p className="text-[10px] font-bold text-gray-400 truncate max-w-[200px]">{contestTitle}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-[#8cc63f] border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Team Intel...</p>
                        </div>
                    ) : team ? (
                        <div className="space-y-6">
                            {/* Team Identity */}
                            <div className="bg-[#8cc63f]/5 rounded-2xl p-5 border border-[#8cc63f]/10">
                                <h4 className="text-[9px] font-black text-[#8cc63f] uppercase tracking-widest mb-1">Squad Callsign</h4>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{team.name}</h2>
                            </div>

                            {/* Members List */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Registry</p>
                                
                                {/* Leader */}
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white relative">
                                            {team.leader?.name[0]}
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#fbc111] rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Leader">
                                                <FiShield size={8} className="text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800">{team.leader?.name}</p>
                                            <p className="text-[9px] font-black text-[#8cc63f] uppercase tracking-tighter">Leader / Captain</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-[#8cc63f] uppercase tracking-widest bg-[#8cc63f]/10 px-2 py-1 rounded">Active</span>
                                </div>

                                {/* Others */}
                                {team.members?.map((m, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                {m.user?.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800">{m.user?.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Teammate / Scholar</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'ACCEPTED' ? 'text-[#8cc63f] bg-[#8cc63f]/10' : 'text-amber-500 bg-amber-50'}`}>
                                            {m.status}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!isRequestingChange ? (
                                <button 
                                    onClick={() => setIsRequestingChange(true)}
                                    className="w-full flex items-center justify-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors pt-4 group"
                                >
                                    <FiAlertTriangle className="group-hover:animate-bounce" /> Change Team Request
                                </button>
                            ) : (
                                <div className="space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mb-2 block">Reason for Departure</label>
                                        <textarea 
                                            placeholder="Explain why you wish to leave this squad..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold text-slate-800 placeholder-gray-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setIsRequestingChange(false)}
                                            className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                                        >
                                            Abort
                                        </button>
                                        <button 
                                            onClick={handleTeamChangeRequest}
                                            disabled={submitting}
                                            className="flex-[2] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {submitting ? 'Transmitting...' : 'Submit Request to Admin'}
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
