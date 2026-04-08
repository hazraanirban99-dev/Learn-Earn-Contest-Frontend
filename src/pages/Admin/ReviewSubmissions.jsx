import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiEye, FiCheckCircle, FiClock } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import ContestUserFilter from '../../components/ContestFilters/ContestUserFilter';
import ReviewDetailModal from '../../components/Modals/ReviewDetailModal';

export default function ReviewSubmissions() {
  const [selectedContest, setSelectedContest] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = React.useCallback((selection) => {
    setSelectedContest(selection.contest);
    if (selection.contestData && selection.contestData.participants) {
      setParticipants(selection.contestData.participants);
    } else {
      setParticipants([]);
    }
  }, []);

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewSubmission = (participant) => {
    setActiveParticipant(participant);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
          <div className="space-y-2">
            <h4 className="text-[#fbc111] text-[10px] sm:text-[12px] font-black tracking-[0.2em] uppercase">
              Scholastic Atelier
            </h4>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Review <br className="hidden md:block"/> Submissions
            </h1>
            <p className="text-gray-600 font-bold text-sm sm:text-base leading-relaxed max-w-lg mt-3">
              Browse through participants and evaluate their design projects.
            </p>
          </div>
          
          <ContestUserFilter 
            showParticipant={false} 
            onSelectionChange={handleFilterChange} 
          />
        </div>

        {/* Search and Stats Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search participants by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8cc63f]/20 rounded-xl pl-12 pr-4 py-2.5 text-sm font-semibold outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-6 px-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase">Total Entries</span>
              <span className="text-sm font-black text-slate-800">{participants.length}</span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase">Selected Contest</span>
              <span className="text-sm font-black text-[#8cc63f] truncate max-w-[150px]">{selectedContest || '---'}</span>
            </div>
          </div>
        </div>

        {/* Participant List (Table View) */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          {participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="group hover:bg-[#f8faf2]/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={p.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="avatar" />
                          <div>
                            <p className="text-sm font-black text-slate-800 group-hover:text-[#8cc63f] transition-colors">{p.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          {p.score ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full">
                              <FiCheckCircle size={10} />
                              <span className="text-[9px] font-black uppercase tracking-wider">Reviewed</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full">
                              <FiClock size={10} />
                              <span className="text-[9px] font-black uppercase tracking-wider">Pending</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleViewSubmission(p)}
                          className="px-5 py-2.5 bg-white border-2 border-slate-100 hover:border-[#8cc63f]/20 hover:bg-[#8cc63f]/5 rounded-xl text-[11px] font-black text-slate-600 hover:text-[#8cc63f] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ml-auto"
                        >
                          <FiEye /> View Submission
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredParticipants.length === 0 && (
                <div className="p-20 text-center">
                   <FiUsers className="mx-auto text-gray-200 mb-4" size={48} />
                   <p className="text-gray-400 font-bold">No participants match your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <FiUsers className="text-gray-300 text-3xl" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No Project Selected</h3>
              <p className="text-sm font-bold text-gray-400 max-w-xs mx-auto">Please select a year, month, and contest from the filters above to view submissions.</p>
            </div>
          )}
        </div>
      </div>

      {activeParticipant && (
        <ReviewDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          participant={activeParticipant}
        />
      )}
    </AdminLayout>
  );
}

