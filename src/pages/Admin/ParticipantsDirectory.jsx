import React, { useState, useMemo, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  FiSearch, FiFilter, FiDownload, FiChevronLeft, FiChevronRight, FiUser
} from 'react-icons/fi';
import { useUsers } from '../../context/UserContext';
import { exportToCSV } from '../../utils/exportUtils';

// Table Row Component - Memoized for performance
const ParticipantRow = React.memo(({ user, index }) => {

  return (
    <tr className="hover:bg-white transition-colors duration-200 group border-b border-[#e8efe0]/60">
      <td className="py-6 px-10">
        <span className="text-[14px] font-black text-gray-300">
           {index < 9 ? `0${index + 1}` : index + 1}
        </span>
      </td>
      <td className="py-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 p-[1px]">
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="font-black text-slate-800 text-[15px] tracking-tight">
            {user.name}
          </span>
        </div>
      </td>
      <td className="py-6 px-4">
        <span className="text-[14px] font-bold text-slate-500">
          {user.email}
        </span>
      </td>
      <td className="py-6 px-4">
        <span className="text-[14px] font-bold text-slate-500">
          {user.phone}
        </span>
      </td>
      <td className="py-6 px-4">
        <span className="text-[14px] font-bold text-slate-600 tracking-tight">
          {user.domain}
        </span>
      </td>
    </tr>
  );
});

const ParticipantsDirectory = () => {
  const { users } = useUsers();
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Derived unique domains
  const domains = useMemo(() => {
    return ['All Domains', ...new Set(users.map(u => u.domain))];
  }, [users]);

  // Handle Domain Filtering
  const filteredUsers = useMemo(() => {
    if (selectedDomain === 'All Domains') return users;
    return users.filter(u => u.domain === selectedDomain);
  }, [users, selectedDomain]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleExport = useCallback(() => {
    // Exporting the filtered users or all users? Usually all users in directory.
    exportToCSV(users, 'Participant_Directory_Export');
  }, [users]);

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1440px] mx-auto space-y-10 px-4 sm:px-0">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4 max-w-2xl">
             <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-[#8cc63f]"></div>
                <h4 className="text-[#8cc63f] text-[13px] font-black tracking-[0.3em] uppercase">Student Administration</h4>
             </div>
             <h1 className="text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-none">
               Participant <span className="text-[#fbc111]">Directory</span>
             </h1>
             <p className="text-gray-400 font-bold text-sm lg:text-base leading-relaxed">
               A curated view of all active participants within the Desun Academy ecosystem. Review credentials, track domain interests, and manage student communications.
             </p>
          </div>

          {/* Export Button (Premium Green/Yellow) */}
          <button 
            onClick={handleExport}
            className="group flex items-center gap-3 bg-[#8cc63f] hover:bg-[#7db534] text-white px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-[#8cc63f]/30 hover:-translate-y-1 active:scale-95 whitespace-nowrap w-full lg:w-auto justify-center"
          >
            <FiDownload size={18} className="group-hover:bounce" />
            <span>Export Registry List</span>
          </button>
        </div>

        {/* --- Filter Toolbar --- */}
        <div className="flex justify-start">
           <div className="relative flex items-center bg-[#fbc111] rounded-2xl px-6 py-1 shadow-md border border-[#fbc111]/20 hover:shadow-lg transition-all group w-full sm:w-max">
              <label className="text-[11px] font-black text-slate-900/40 uppercase tracking-widest mr-2 whitespace-nowrap">Domain:</label>
              <select 
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent border-none py-3 text-[13px] font-black text-slate-900 focus:outline-none w-full min-w-[160px] cursor-pointer pr-8 transition-all"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-900/30">
                 <FiFilter size={16} strokeWidth={3} />
              </div>
           </div>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-[#fbfcfa] rounded-[48px] border border-[#e8efe0] overflow-hidden shadow-2xl shadow-[#fbc111]/5">
           <div className="overflow-x-auto w-full scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[#f8faea]/50 border-b border-[#e8efe0]">
                    <th className="py-7 px-10 text-[11px] font-black tracking-widest text-slate-400 uppercase">#</th>
                    <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Participant Name</th>
                    <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Email Address</th>
                    <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Contact Number</th>
                    <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Interested Domain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, idx) => (
                      <ParticipantRow 
                        key={user.id} 
                        user={user} 
                        index={(currentPage - 1) * itemsPerPage + idx} 
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                         No participants found in this domain registry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>

           {/* --- Footer Pagination --- */}
           <div className="bg-[#fcfdf8] px-10 py-6 border-t border-[#e8efe0] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                   className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#fbc111] transition-colors disabled:opacity-20"
                 >
                   <FiChevronLeft size={24} strokeWidth={2.5} />
                 </button>

                 <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-2xl text-[14px] font-black transition-all duration-300 ${
                          currentPage === i + 1 
                          ? 'bg-[#fbc111] text-slate-900 shadow-lg shadow-[#fbc111]/30' 
                          : 'text-slate-400 hover:bg-gray-100 hover:text-slate-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                 </div>

                 <button 
                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                   disabled={currentPage === totalPages}
                   className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#fbc111] transition-colors disabled:opacity-20"
                 >
                   <FiChevronRight size={24} strokeWidth={2.5} />
                 </button>
              </div>

           </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default React.memo(ParticipantsDirectory);
