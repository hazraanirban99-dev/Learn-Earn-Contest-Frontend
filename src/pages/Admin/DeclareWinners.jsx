import React, { useState, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FiInfo, FiDownload, FiSend } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ContestUserFilter from '../../components/ContestFilters/ContestUserFilter';
import { exportToCSV } from '../../utils/exportUtils';

export default function DeclareWinners() {
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({ totalEvaluated: 0 });
  const [visibleCount, setVisibleCount] = useState(5);

  const rankedParticipants = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    
    // Sort by score descending
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    
    // Assign ranks (Dense Ranking)
    let currentRank = 0;
    let lastScore = null;
    
    return sorted.map((p, index) => {
      if (p.score !== lastScore) {
        currentRank++;
        lastScore = p.score;
      }
      return { ...p, rank: currentRank };
    });
  }, [participants]);

  const topWinners = rankedParticipants.filter(p => p.rank <= 3);
  const leaderboard = rankedParticipants.filter(p => p.rank > 3);
  const visibleLeaderboard = leaderboard.slice(0, visibleCount);
  const hasMore = visibleCount < leaderboard.length;

  const handleFilterChange = React.useCallback((selection) => {
    if (selection.contestData) {
      setParticipants(selection.contestData.participants || []);
      setStats({ totalEvaluated: selection.contestData.participants?.length || 0 });
      setVisibleCount(5);
    }
  }, []);

  // Helper strings for rank display
  const getRankSuffix = (rank) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:gap-8 max-w-[1440px] mx-auto pb-10 animate-in fade-in duration-500 px-2 sm:px-0">
        
        {/* Integrated Header & Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 bg-white p-6 sm:p-7 rounded-[40px] shadow-sm border border-[#e8efe0] mt-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8cc63f]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
          
          {/* Left Column: Declare Winners Info (50%) */}
          <div className="space-y-2 z-10">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[2px] bg-[#dca51a]/30"></div>
                <h4 className="text-[#dca51a] text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">
                  Scholastic Atelier
                </h4>
             </div>
             <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
               Declare <span className="text-[#5c8a14]">Winners</span>
             </h1>
             <p className="text-gray-500 font-bold text-xs sm:text-sm leading-relaxed max-w-md">
               Review the final computed marks for the competition. These scores represent the cumulative evaluation of overall project excellence.
             </p>
          </div>

          {/* Right Column: Global Filter System (50%) */}
          <div className="flex flex-col z-10 lg:pl-6 lg:border-l border-gray-100">
             <ContestUserFilter showParticipant={false} onSelectionChange={handleFilterChange} />
          </div>
        </div>

        {/* Podium Layout - Unified same-sized cards for 1st, 2nd, 3rd */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full mt-4">
          {topWinners.length > 0 ? (
            topWinners.sort((a,b) => a.rank - b.rank).map((winner, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-[#e8efe0] relative overflow-hidden flex flex-col items-center text-center hover:shadow-lg transition-all duration-500 group border-b-4" style={{borderColor: winner.rank === 1 ? '#fbc111' : winner.rank === 2 ? '#8cc63f' : '#dca51a'}}>
                
                {/* Background Decoration */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none group-hover:scale-150 transition-transform duration-1000 ${winner.rank === 1 ? 'bg-[#fbc111]' : winner.rank === 2 ? 'bg-[#8cc63f]' : 'bg-[#dca51a]'}`}></div>

                {/* Rank Badge */}
                <div className={`mb-3 self-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.15em] uppercase shadow-sm border ${winner.rank === 1 ? 'bg-[#fbc111] text-white border-[#fbc111]' : winner.rank === 2 ? 'bg-[#f8faf6] text-[#5c8a14] border-[#8cc63f]/30' : 'bg-[#fffdfa] text-[#a68945] border-[#dca51a]/30'}`}>
                  {winner.rank === 1 ? '🥇 Gold' : winner.rank === 2 ? '🥈 Silver' : '🥉 Bronze'}
                </div>

                {/* Avatar with Ring */}
                <div className="relative mb-4">
                   <div className={`absolute -inset-1 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity ${winner.rank === 1 ? 'bg-[#fbc111]' : winner.rank === 2 ? 'bg-[#8cc63f]' : 'bg-[#dca51a]'}`}></div>
                   <div className={`relative p-1 rounded-full border-2 ${winner.rank === 1 ? 'border-[#fbc111]' : winner.rank === 2 ? 'border-[#8cc63f]' : 'border-[#dca51a]'}`}>
                      <img src={winner.avatar} alt={winner.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-inner" />
                      <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-black border-2 border-white shadow-md ${winner.rank === 1 ? 'bg-[#fbc111]' : winner.rank === 2 ? 'bg-[#8cc63f]' : 'bg-[#dca51a]'}`}>
                         {winner.rank}{getRankSuffix(winner.rank)}
                      </div>
                   </div>
                </div>

                {/* Info */}
                <div className="mb-4 w-full px-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight mb-0.5 group-hover:text-[#5c8a14] transition-colors truncate">{winner.name}</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{winner.school}</p>
                </div>

                {/* Score */}
                <div className="mt-auto w-full pt-4 border-t border-gray-100 flex flex-col items-center">
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Marks</span>
                   <div className="flex items-center gap-1.5">
                      <span className={`text-2xl font-black ${winner.rank === 1 ? 'text-[#dca51a]' : 'text-slate-800'}`}>{winner.score.toFixed(1)}</span>
                      
                   </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-[40px] p-20 border-2 border-dashed border-[#e8efe0] flex flex-col items-center justify-center text-gray-400 font-bold">
               <FiInfo size={40} className="mb-4 opacity-20" />
               <p>Select a contest with evaluated participants to announce winners</p>
            </div>
          )}
        </div>

        {/* Full Leaderboard Table Section */}
        <div className="bg-white rounded-[32px] border border-[#e8efe0] shadow-sm overflow-hidden mt-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 border-b border-[#e8efe0] gap-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Full Leaderboard</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => exportToCSV(rankedParticipants, `Full_Leaderboard_${new Date().toLocaleDateString()}`)}
                className="flex-1 sm:flex-none justify-center px-4 py-2 bg-[#f8faf6] hover:bg-[#e8efe0] text-[#5c8a14] text-xs font-black tracking-widest uppercase rounded-xl transition-colors flex items-center gap-2"
              >
                 <FiDownload size={14} /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="uppercase text-[9px] font-black tracking-[0.15em] text-gray-400 bg-[#fefdfa] border-b border-gray-100">
                  <th className="py-5 px-8 w-20 text-center">Rank</th>
                  <th className="py-5 px-6">Participant</th>
                  <th className="py-5 px-8 text-right">Final Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8efe0]/60">
                {visibleLeaderboard.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8faf6]/50 transition-colors duration-200">
                    <td className="py-5 px-8 font-black text-gray-400 text-sm text-center">#{item.rank}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 shadow-sm" />
                        <div>
                          <div className="font-black text-slate-800 text-sm">{item.name}</div>
                          <div className="text-[11px] font-bold text-gray-400 mt-0.5">{item.school}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 font-black text-[#5c8a14] text-right text-lg">{item.score.toFixed(1)}</td>
                  </tr>
                ))}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-10 text-center text-gray-400 font-bold">No additional participants found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="p-6 flex justify-center bg-[#fafdf8] border-t border-[#e8efe0]/60">
              <button 
                onClick={() => setVisibleCount(leaderboard.length)}
                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#5c8a14] transition-colors"
              >
                Load All Remaining Participants
              </button>
            </div>
          )}
        </div>

        {/* Finalize Section */}
        <div className="bg-[#f0f4e8] rounded-[32px] p-6 lg:p-10 border border-[#e8efe0] flex flex-col md:flex-row items-center justify-between gap-8 mt-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#8cc63f] rounded-full opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="space-y-3 z-10 flex-1 text-center md:text-left">
             <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Ready to crown the champions?</h2>
             <p className="text-sm font-bold text-gray-600 max-w-xl mx-auto md:mx-0 leading-relaxed">
               Once finalized, certificates will be auto-generated, winners will be publicly announced on the portal, and the top performers will receive their prize notifications immediately.
             </p>
          </div>

          <div className="flex flex-col items-center z-10 w-full md:w-auto shrink-0">
             <button 
                onClick={async () => {
                  // =========================================================================
                  // 🚀 [BACKEND] FINALIZE WINNERS & SEND NOTIFICATIONS
                  // =========================================================================
                  // Endpoint: POST /api/v1/contests/:contestId/finalize-winners
                  // Payload:
                  // {
                  //   contestId: <from ContestUserFilter>,
                  //   winners: rankedParticipants.filter(p => p.rank <= 3).map(p => ({
                  //     participantId: p.id,
                  //     rank: p.rank,
                  //     finalScore: p.score
                  //   }))
                  // }
                  //
                  // Side effects (handled by backend):
                  //   - Auto-generate certificates for top 3
                  //   - Send email notifications to all ranked participants
                  //   - Update contest status to 'COMPLETED'
                  //   - Publicly announce on portal
                  // =========================================================================

                  // MOCK — DELETE when API is ready:
                  toast.success("Winners Declared & Notifications Sent Successfully!");
                }}
                className="bg-[#5c8a14] hover:bg-[#4d7310] text-white px-8 py-5 rounded-[24px] font-black tracking-wide text-sm flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#5c8a14]/30 w-full md:w-auto h-full min-w-[200px]"
              >
               <div className="flex flex-col items-center">
                 <span>Finalize Winners &</span>
                 <span>Send Notifications</span>
               </div>
               <FiSend size={20} className="ml-2" />
             </button>
             <span className="text-[8px] font-black tracking-[0.2em] text-gray-400 uppercase mt-4">This action cannot be undone</span>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
