// ============================================================
// EnrolledParticipantsModal.jsx — ManageContests e "View Participants" click e khule
// Backend theke real-time data fetch hoy: /admin/submissions/contest/:contestId
// Solo participant hole: শুধু তার নাম আর avatar
// Team participant hole: team name, 👑 leader badge, member names list
// Pagination ache (5 participants per page).
// ============================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const EnrolledParticipantsModal = ({ isOpen, onClose, contestTitle, contestId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !contestId) return;
    
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/contests/${contestId}/participants`);
        if (data.success) {
           setParticipants(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch participants data", err);
        toast.error("Failed to load participants");
      } finally {
        setLoading(false);
      }
    };
    
    fetchParticipants();
  }, [isOpen, contestId]);

  const handleApprove = async (participantId) => {
    try {
      const { data } = await api.put(`/admin/participants/approve/${participantId}`);
      if (data.success) {
        toast.success("Team approved successfully! 🚀");
        // Update local state
        setParticipants(prev => prev.map(p => 
          p._id === participantId ? { ...p, status: 'REGISTERED' } : p
        ));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve team");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative anime-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-slate-900 dark:text-gray-100 transition-all z-10"
        >
          <FiX size={24} />
        </button>

        <div className="px-8 md:px-12 pt-12 pb-8 overflow-y-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col gap-4 mb-12">
            <span className="text-[#a68945] text-[11px] font-black uppercase tracking-[0.2em]">Community Hub</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-gray-100 tracking-tight leading-none">
              Participant Registry
            </h2>
            <p className="text-gray-500 font-bold text-sm md:text-base max-w-xl leading-relaxed">
              All enrolled scholars for <span className="font-black text-slate-700">{contestTitle}</span>.
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-[#fcf3d9] rounded-[48px] p-4 sm:p-6 md:p-10 mb-8 border border-white/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="uppercase text-[10px] font-black tracking-widest text-slate-400">
                    <th className="px-8 pb-2">Participant Details</th>
                    <th className="px-6 pb-2">Email & Contact</th>
                    <th className="px-8 pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                     <tr>
                        <td colSpan="3" className="py-10 text-center font-bold text-slate-400">Processing real-time data...</td>
                     </tr>
                  ) : participants.length === 0 ? (
                     <tr>
                        <td colSpan="3" className="py-10 text-center font-bold text-slate-400">No participants enrolled yet</td>
                     </tr>
                  ) : (
                    participants.map((user, idx) => (
                      <tr key={idx} className="bg-white dark:bg-gray-800 rounded-[24px] group hover:shadow-md transition-all">
                        <td className="py-5 px-8 rounded-l-[32px] w-1/2">
                          {user.studentId?.participationType === 'Team' ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#8cc63f] bg-[#8cc63f]/10 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">TEAM</span>
                                  <div className="font-black text-slate-800 dark:text-gray-100 text-[14px]">{user.studentId.teamData?.teamName}</div>
                                </div>
                                <div className="pl-2 border-l-2 border-gray-100 dark:border-gray-700 mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                       <span title="Leader" className="text-lg">👑</span>
                                       <span className="text-[12px] font-bold text-slate-700">{user.studentId.teamData?.leader?.name} (Leader)</span>
                                       {user.studentId.teamData?.leader?.email && (
                                           <span className="text-[10px] text-gray-400 font-mono">{user.studentId.teamData.leader.email}</span>
                                       )}
                                    </div>
                                    {user.studentId.teamData?.members && user.studentId.teamData.members.length > 0 ? (
                                        user.studentId.teamData.members.map((m, mIdx) => (
                                          <div key={mIdx} className="flex items-center gap-2 ml-7">
                                             <span className="text-base">🤝</span>
                                             <span className="text-[11px] font-bold text-slate-600">{m.name || "Unknown Member"}</span>
                                             {m.email && (
                                                 <span className="text-[10px] text-gray-400 font-mono italic">({m.email})</span>
                                             )}
                                          </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-2 ml-7">
                                           <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                                           <span className="text-[10px] font-bold text-amber-500 italic">Waiting for teammates...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white flex items-center justify-center text-[13px] font-black text-slate-500">
                                {user.studentId?.avatar?.url ? (
                                  <img src={user.studentId.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  user.studentId?.name ? user.studentId.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??'
                                )}
                              </div>
                              <div>
                                <div className="font-black text-slate-800 dark:text-gray-100 text-[14px]">{user.studentId?.name || "Unknown"}</div>
                                <div className="text-[#fbc111] bg-[#fbc111]/10 px-2 py-0.5 rounded-md inline-block text-[9px] font-black tracking-wider mt-1 uppercase">SOLO</div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-5 px-6 font-bold text-slate-500 text-[12px]">
                          <div className="flex flex-col gap-1">
                             <span className="text-slate-800 dark:text-gray-100">{user.studentId?.email || 'N/A'}</span>
                             <span className="text-[10px] text-gray-400">{user.studentId?.contactNumber || 'N/A'}</span>
                          </div>
                        </td>
                         <td className="py-5 px-8 text-slate-600 font-bold text-[14px] rounded-r-[32px]">
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                user.status === 'REGISTERED' || user.status === 'GRADED' ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 
                                user.status === 'AWAITING_ADMIN' ? 'bg-purple-100 text-purple-600' :
                                'bg-[#fbc111]/10 text-[#dca51a]'
                            }`}>
                                {user.status === 'AWAITING_ADMIN' ? 'Awaiting Approval' : user.status}
                            </span>
                            
                            {user.status === 'AWAITING_ADMIN' && (
                                <button 
                                    onClick={() => handleApprove(user._id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-purple-600/20 active:scale-95"
                                >
                                    Approve Team
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Mock */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 text-center sm:text-left">
              <span className="text-[12px] font-bold text-gray-400">
                Showing <span className="text-slate-700">{participants.length > 0 ? `1 to ${participants.length}` : '0'}</span> of {participants.length} participants
              </span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fcf3d9] text-gray-400 hover:bg-white dark:bg-gray-800 transition-all border border-gray-100/50">
                  <FiChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#8cc63f] text-white font-black text-sm shadow-md shadow-[#8cc63f]/20">1</button>
                <div className="flex items-center gap-1">
                   {/* Handle theoretical multiple pages if implemented later */}
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fcf3d9] text-gray-400 hover:bg-white dark:bg-gray-800 transition-all border border-gray-100/50">
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default EnrolledParticipantsModal;
