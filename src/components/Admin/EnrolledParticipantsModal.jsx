import React from 'react';
import { FiX, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const EnrolledParticipantsModal = ({ isOpen, onClose, contestTitle }) => {
  if (!isOpen) return null;

  const participants = [
    { id: 'DES-2024-001', name: 'Sarah Jenkins', email: 's.jenkins@academy.edu', date: 'Oct 12, 2023', avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: 'DES-2024-002', name: 'Marcus Chen', email: 'm.chen@dev.studio', date: 'Nov 04, 2023', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 'DES-2024-003', name: 'Elena Rodriguez', email: 'elena.r@growth.ly', date: 'Dec 15, 2023', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 'DES-2024-004', name: 'Julian Thorne', email: 'j.thorne@atelier.com', date: 'Jan 08, 2024', avatar: 'https://i.pravatar.cc/150?img=11' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative anime-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-slate-900 transition-all z-10"
        >
          <FiX size={24} />
        </button>

        <div className="px-8 md:px-12 pt-12 pb-8 overflow-y-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-[#a68945] text-[11px] font-black uppercase tracking-[0.2em]">Community Hub</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
                Participant Registry
              </h2>
              <p className="text-gray-500 font-bold text-sm md:text-base max-w-xl leading-relaxed mt-4">
                A comprehensive overview of our current scholars and creative practitioners within the atelier ecosystem.
              </p>
            </div>
            
            <button className="flex items-center gap-2 bg-[#e8efe0]/40 hover:bg-[#e8efe0]/80 text-slate-700 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-gray-100/50 shadow-sm">
              <FiDownload size={18} className="text-slate-500" />
              <span>Export List</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-[#fcf3d9] rounded-[48px] p-4 sm:p-6 md:p-10 mb-8 border border-white/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="uppercase text-[10px] font-black tracking-widest text-slate-400">
                    <th className="px-8 pb-2">Participant Name</th>
                    <th className="px-6 pb-2">Email Address</th>
                    <th className="px-8 pb-2">Registration</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((user, idx) => (
                    <tr key={idx} className="bg-white rounded-[24px] group hover:shadow-md transition-all">
                      <td className="py-5 px-8 rounded-l-[32px]">
                        <div className="flex items-center gap-5">
                          <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover shadow-sm bg-gray-50 border-2 border-white" />
                          <div>
                            <div className="font-black text-slate-800 text-[16px]">{user.name}</div>
                            <div className="text-[11px] text-gray-400 font-bold tracking-wider mt-0.5 uppercase">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 font-bold text-slate-500 text-[14px]">
                        {user.email}
                      </td>
                      <td className="py-5 px-8 text-slate-600 font-bold text-[14px] rounded-r-[32px]">
                        {user.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Mock */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 text-center sm:text-left">
              <span className="text-[12px] font-bold text-gray-400">
                Showing <span className="text-slate-700">1 to 4</span> of 248 participants
              </span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fcf3d9] text-gray-400 hover:bg-white transition-all border border-gray-100/50">
                  <FiChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#8cc63f] text-white font-black text-sm shadow-md shadow-[#8cc63f]/20">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fcf3d9] text-slate-600 font-black text-sm hover:bg-white transition-all border border-gray-100/50">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fcf3d9] text-slate-600 font-black text-sm hover:bg-white transition-all border border-gray-100/50">3</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#fcf3d9] text-gray-400 hover:bg-white transition-all border border-gray-100/50">
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-gray-100 gap-4">
             <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none">
               The Scholastic Atelier © 2024
             </span>
             <div className="flex items-center gap-8">
               <button className="text-[11px] font-black text-[#a68945] uppercase tracking-widest hover:text-[#8cc63f] transition-all">Privacy Policy</button>
               <button className="text-[11px] font-black text-[#a68945] uppercase tracking-widest hover:text-[#8cc63f] transition-all">Terms of Study</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledParticipantsModal;
