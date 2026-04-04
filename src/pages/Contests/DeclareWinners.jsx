import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FiSearch, FiChevronDown, FiInfo, FiDownload, FiPrinter, FiSend } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

export default function DeclareWinners() {
  const topWinners = [
    { rank: 1, name: 'Elena Rodriguez', project: 'The Vertical Mycelium Habitat', avatar: 'https://i.pravatar.cc/150?img=47', innovation: 9.8, execution: 9.5, total: 29.1 },
    { rank: 2, name: 'Liam Chen', project: 'Hydro-Kinetic Plaza Concept', avatar: 'https://i.pravatar.cc/150?img=12', total: 28.4, percentage: 95 },
    { rank: 3, name: 'Amara Okafor', project: 'Solar Loom Textiles', avatar: 'https://i.pravatar.cc/150?img=33', total: 27.9, percentage: 92 },
  ];

  const leaderboard = [
    { rank: '04', name: 'Tobias Mueller', school: 'Berlin University', avatar: 'https://i.pravatar.cc/150?img=11', innovation: 8.9, technical: 9.2, presentation: 8.7, total: 26.8 },
    { rank: '05', name: 'Suki Watanabe', school: 'Kyoto Institute of Tech', avatar: 'https://i.pravatar.cc/150?img=20', innovation: 8.5, technical: 8.8, presentation: 9.3, total: 26.6 },
    { rank: '06', name: 'Marcus Thorne', school: 'Royal Academy of Arts', avatar: 'https://i.pravatar.cc/150?img=60', innovation: 8.2, technical: 9.0, presentation: 8.5, total: 25.7 },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:gap-8 max-w-[1440px] mx-auto pb-10 animate-in fade-in duration-500 px-2 sm:px-0">
        
        {/* Top Search Bar (Appears in mock) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-transparent mt-4 mb-4">
          <div className="flex items-center w-full sm:w-72 bg-gray-50/80 rounded-full px-6 py-3 shadow-sm border border-gray-100">
            <FiSearch className="text-gray-400 mr-3 shrink-0" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none w-full text-sm text-slate-700 font-medium"
            />
          </div>
          <div className="relative w-full sm:flex-1 bg-white rounded-full border border-gray-100 shadow-sm cursor-pointer overflow-hidden">
            <select className="appearance-none bg-transparent pl-6 pr-12 py-3 text-sm font-bold text-slate-700 outline-none w-full cursor-pointer">
              <optgroup label="Active Contests">
                <option>Eco-Urban Design 2024</option>
                <option>Visual Brand Identity</option>
                <option>Sustainable Energy Analytics Hackathon</option>
              </optgroup>
            </select>
            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-2">
          <div className="space-y-2">
            <h4 className="text-[#dca51a] text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">
              Scholastic Atelier
            </h4>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight flex flex-wrap items-center gap-x-3">
              Declare <span className="text-[#5c8a14]">Winners</span>
            </h1>
            <p className="text-gray-600 font-bold text-sm sm:text-base leading-relaxed max-w-lg mt-2 sm:mt-3">
              Review the final computed marks for the competition. These scores represent the cumulative evaluation of overall project excellence.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#f8faf6] px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-[#8cc63f]/20 w-full sm:w-fit">
            <FiInfo className="text-[#5c8a14] shrink-0" />
            <span className="text-[10px] sm:text-xs font-black text-slate-800 tracking-tight">142 Final Submissions Evaluated</span>
          </div>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
          
          {/* Gold Medalist */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#e8efe0] relative overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-20 pointer-events-none">
               <svg width="80" height="100" viewBox="0 0 40 50" fill="none" className="text-[#fbc111]">
                 <path d="M20 0l5 15h15l-12 9 5 15-13-10-13 10 5-15-12-9h15z" fill="currentColor"/>
               </svg>
            </div>
            
            <div className="bg-[#fbc111] text-[#fff] px-3 py-1.5 rounded-md text-[9px] font-black tracking-widest uppercase w-fit mb-6 flex items-center gap-1.5 shadow-sm">
              <FaStar size={10} /> GOLD MEDALIST
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
               <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fbc111] to-[#ffda66] rounded-full blur opacity-40"></div>
                  <img src={topWinners[0].avatar} alt={topWinners[0].name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover relative border-4 border-white shadow-sm" />
               </div>
               <div>
                 <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">{topWinners[0].name}</h2>
                 <p className="text-sm font-bold text-gray-500">"{topWinners[0].project}"</p>
               </div>
            </div>

            <div className="mt-auto grid grid-cols-1 gap-4 border-t border-gray-100 pt-6">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Final Marks</span>
                 <span className="text-4xl sm:text-5xl font-black text-[#dca51a]">{topWinners[0].total}</span>
               </div>
            </div>
          </div>

          {/* 2nd and 3rd Place */}
          <div className="flex flex-col gap-6 h-full">
            
            {/* 2nd Place */}
            <div className="bg-[#fcfdf8] rounded-[32px] p-6 shadow-sm border border-[#e8efe0] flex flex-col sm:flex-row items-center sm:items-stretch gap-5 hover:bg-white transition-colors h-full">
              <div className="relative shrink-0 flex items-center justify-center">
                 <img src={topWinners[1].avatar} alt={topWinners[1].name} className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl object-cover shadow-sm bg-gray-100" />
                 <div className="absolute -top-2 -right-2 bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">2nd</div>
              </div>
              <div className="flex-1 flex flex-col justify-center w-full text-center sm:text-left">
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{topWinners[1].name}</h3>
                <p className="text-xs font-bold text-gray-500 truncate max-w-[200px] mx-auto sm:mx-0">{topWinners[1].project}</p>
              </div>
              <div className="flex flex-col justify-center items-center sm:items-end w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Weighted Score</span>
                 <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-28 h-2 bg-gray-100 rounded-full hidden sm:block">
                       <div className="h-full bg-[#8cc63f] rounded-full" style={{width: `${topWinners[1].percentage}%`}}></div>
                    </div>
                    <span className="text-xl font-black text-slate-800">{topWinners[1].total}</span>
                 </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-[#fcfdf8] rounded-[32px] p-6 shadow-sm border border-[#e8efe0] flex flex-col sm:flex-row items-center sm:items-stretch gap-5 hover:bg-white transition-colors h-full">
              <div className="relative shrink-0 flex items-center justify-center">
                 <img src={topWinners[2].avatar} alt={topWinners[2].name} className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl object-cover shadow-sm bg-gray-100" />
                 <div className="absolute -top-2 -right-2 bg-[#dca51a] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">3rd</div>
              </div>
              <div className="flex-1 flex flex-col justify-center w-full text-center sm:text-left">
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{topWinners[2].name}</h3>
                <p className="text-xs font-bold text-gray-500 truncate max-w-[200px] mx-auto sm:mx-0">{topWinners[2].project}</p>
              </div>
              <div className="flex flex-col justify-center items-center sm:items-end w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Final Marks</span>
                 <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-28 h-2 bg-gray-100 rounded-full hidden sm:block">
                       <div className="h-full bg-[#8cc63f] rounded-full" style={{width: `${topWinners[2].percentage}%`}}></div>
                    </div>
                    <span className="text-xl font-black text-slate-800">{topWinners[2].total}</span>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Full Leaderboard Table Section */}
        <div className="bg-white rounded-[32px] border border-[#e8efe0] shadow-sm overflow-hidden mt-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 border-b border-[#e8efe0] gap-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Full Leaderboard</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-[#f8faf6] hover:bg-[#e8efe0] text-[#5c8a14] text-xs font-black tracking-widest uppercase rounded-xl transition-colors flex items-center gap-2">
                 <FiDownload size={14} /> Export CSV
              </button>
              <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-[#f8faf6] hover:bg-[#e8efe0] text-[#5c8a14] text-xs font-black tracking-widest uppercase rounded-xl transition-colors flex items-center gap-2">
                 <FiPrinter size={14} /> Print Report
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
                {leaderboard.map((item, idx) => (
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
                    <td className="py-5 px-8 font-black text-[#5c8a14] text-right text-lg">{item.total.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 flex justify-center bg-[#fafdf8] border-t border-[#e8efe0]/60">
            <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#5c8a14] transition-colors">
              Load More Participants (136 remaining)
            </button>
          </div>
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
             <button className="bg-[#5c8a14] hover:bg-[#4d7310] text-white px-8 py-5 rounded-[24px] font-black tracking-wide text-sm flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#5c8a14]/30 w-full md:w-auto h-full min-w-[200px]">
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
