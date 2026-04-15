// ============================================================
// ReviewSubmissions.jsx — Admin e submission review korar page
// Ekhane ContestUserFilter diye contest select korle oi contest er
// sob participant submission list e dekha jay.
// "Review Now" click korle real-time backend theke submission fetch hoy,
// tapar ReviewDetailModal open hoy jeta te score dewa jay.
// Team submission hole leader badge r member names show hoy.
// ============================================================

import React, { useState } from 'react';
import { FiUsers, FiSearch, FiEye, FiCheckCircle, FiClock } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import ContestUserFilter from '../../components/ContestFilters/ContestUserFilter';
import ReviewDetailModal from '../../components/Modals/ReviewDetailModal';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function ReviewSubmissions() {
  const [selectedContest, setSelectedContest] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedContestId, setSelectedContestId] = useState(null);

  // Filter change hole backend theke map kora data receive kora hoche
  // selection parameter e month, year, contest details thake
  const handleFilterChange = React.useCallback((selection) => {
    setSelectedContest(selection.contest);
    setSelectedContestId(selection.contestId);
    if (selection.contestData && selection.contestData.participants) {
      // Participant list data ContestUserFilter component fetch kore direct pathaye dey
      setParticipants(selection.contestData.participants);
    } else {
      setParticipants([]);
    }
  }, []);

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewSubmission = (participant) => {
    // All data is already present from the ContestUserFilter fetch
    setActiveParticipant(participant);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
          <div className="space-y-2">
            <h4 className="text-[#fbc111] text-[10px] sm:text-[12px] font-black tracking-[0.2em] uppercase">Scholastic Atelier</h4>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-none">Review Submissions</h1>
          </div>
          <ContestUserFilter showParticipant={false} onSelectionChange={handleFilterChange} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search participants by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-[#8cc63f]/20 rounded-xl pl-12 pr-4 py-2.5 text-sm font-semibold outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-6 px-4">
            <div className="flex flex-col items-end px-4 border-r border-gray-100 dark:border-gray-700">
              <span className="text-[10px] font-black text-gray-400 uppercase">Total Entries</span>
              <span className="text-base font-black text-[#fbc111]">{participants.length}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase">Active Contest</span>
              <span className="text-base font-black text-[#8cc63f] truncate max-w-[150px]">{selectedContest || 'Select Below'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
          {participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/ dark:bg-gray-800/ border-b border-gray-50 dark:border-gray-700">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredParticipants.map((p) => {
                    const isTeam = p.studentId?.participationType === 'Team';
                    const teamData = p.studentId?.teamData;
                    
                    return (
                    <tr key={p.id} className="group hover:bg-[#f8faf2]/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={p.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="avatar" />
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-800 dark:text-gray-100 group-hover:text-[#fbc111] transition-colors">{p.name}</p>
                            
                            {isTeam && teamData && (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1 bg-[#fbc111]/10 text-[#fbc111] px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase">
                                  👑 Leader: {teamData.leader.name}
                                </span>
                                {teamData.member && (
                                  <span className="inline-block bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[9px] font-bold">
                                    {teamData.member.name}
                                  </span>
                                )}
                              </div>
                            )}

                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">Project URL: {p.projectUrl?.substring(0, 30)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex justify-center">
                          {p.status === 'REVIEWED' ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full">
                              <FiCheckCircle size={10} /><span className="text-[9px] font-black uppercase tracking-wider">Score: {p.score}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full">
                              <FiClock size={10} /><span className="text-[9px] font-black uppercase tracking-wider">Pending</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleViewSubmission(p)}
                          className="px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-gray-700 hover:border-[#8cc63f]/20 hover:bg-[#8cc63f]/5 rounded-xl text-[11px] font-black text-slate-600 hover:text-[#8cc63f] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ml-auto"
                        >
                          <FiEye /> Review Now
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[32px] flex items-center justify-center mx-auto mb-6"><FiUsers className="text-gray-300 text-3xl" /></div>
              <h3 className="text-xl font-black text-slate-800 dark:text-gray-100 mb-2">No Submissions Found</h3>
              <p className="text-sm font-bold text-gray-400 max-w-xs mx-auto">Please select a contest from the filter to view submissions.</p>
            </div>
          )}
        </div>
      </div>

      {activeParticipant && (
        <ReviewDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          participant={activeParticipant}
          onReviewSubmit={(updatedParticipant) => {
              setIsModalOpen(false);
              setParticipants(prev => prev.map(p => 
                p.id === updatedParticipant.id ? { ...p, ...updatedParticipant } : p
              ));
              toast.success(`Review finalized for ${updatedParticipant.name}!`);
          }}
        />
      )}
    </AdminLayout>
  );
}
