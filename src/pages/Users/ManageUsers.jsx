import React, { useState } from 'react';
import { useUsers } from '../../context/UserContext';
import EditUserModal from '../../components/Admin/EditUserModal';
import AdminLayout from '../../layouts/AdminLayout';
import { FiSearch, FiDownload, FiFilter, FiEdit2, FiTrash2, FiTrendingUp, FiCheckCircle, FiShield } from 'react-icons/fi';

const ManageUsers = () => {
  const { users, updateUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = React.useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.regId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = React.useMemo(() => {
    return Math.ceil(filteredUsers.length / itemsPerPage);
  }, [filteredUsers.length, itemsPerPage]);

  const currentUsers = React.useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleEditClick = React.useCallback((user) => {
    setEditingUser(user);
  }, []);

  const handleSaveUser = React.useCallback((updatedData) => {
    updateUser(updatedData.id, updatedData);
    setEditingUser(null);
  }, [updateUser]);

  return (
    <AdminLayout>
      <div className="animate-in fade-in duration-500 max-w-[1440px] mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Top Search Bar (Mocking the exact header from design) */}
      <div className="mt-8 flex items-center bg-gray-50/80 rounded-full px-6 py-3 shadow-sm border border-gray-100">
        <FiSearch className="text-gray-400 mr-3" size={18} />
        <input 
          type="text" 
          placeholder="Search scholars, contests, or registration IDs..." 
          className="bg-transparent border-none outline-none w-full text-sm text-slate-700 font-medium disabled:opacity-50"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mt-10">
        <div className="space-y-4 max-w-2xl">
          <span className="bg-[#fcf3d9] text-[#dca51a] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
            Registry Management
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-[1.1]">
            Manage Scholars & Participants
          </h1>
          <p className="text-gray-500 font-bold text-sm lg:text-base max-w-xl leading-relaxed">
            Oversee the academic collective. Review registration data, manage domain assignments, and ensure participant integrity across the atelier.
          </p>
        </div>

        <button className="bg-[#8cc63f] hover:bg-[#7db534] text-white px-6 py-3.5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#8cc63f]/20 h-fit whitespace-nowrap w-full lg:w-auto">
          <FiDownload size={18} />
          <span>Export User List</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-between gap-4 bg-[#f8faea]/60 p-4 rounded-2xl border border-[#e8efe0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
           <span className="text-xs font-black tracking-widest text-slate-500 uppercase ml-2 sm:ml-0">Filter By Contest:</span>
           <div className="relative w-full sm:flex-1 mb-2 sm:mb-0 max-w-xl">
             <select className="appearance-none bg-white border border-gray-100 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] w-full shadow-sm cursor-pointer pr-10">
                <option>Eco-Urban Design 2024</option>
                <option>Visual Brand Identity</option>
                <option>Fintech UI Redesign</option>
             </select>
             <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
             </div>
           </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#fcfdf8] rounded-[24px] border border-[#e8efe0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
            <thead>
              <tr className="border-b border-[#e8efe0] uppercase text-[10px] font-black tracking-widest text-[#5c8a14]/70 bg-[#f8faea]">
                <th className="py-5 px-8">Scholar Name</th>
                <th className="py-5 px-6">Contact Info</th>
                <th className="py-5 px-6">Domain Discipline</th>
                <th className="py-5 px-6">Registration Date</th>
                <th className="py-5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8efe0]/60">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white transition-colors duration-200 group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-gray-100 shadow-sm" />
                        <div>
                          <div className="font-black text-slate-800 text-[15px]">{user.name}</div>
                          <div className="text-[11px] text-gray-400 font-bold tracking-wider mt-0.5">ID: {user.regId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-[13px] font-bold text-slate-600 mb-0.5">{user.email}</div>
                      <div className="text-[12px] text-gray-400 font-medium">{user.phone}</div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border uppercase inline-block shadow-sm 
                        ${user.domain.includes('UI/UX') ? 'bg-[#f4f8ec] text-[#8cc63f] border-[#8cc63f]/20' : 
                          user.domain.includes('Development') ? 'bg-purple-50 text-purple-500 border-purple-200' : 
                          user.domain.includes('Marketing') ? 'bg-amber-50 text-amber-500 border-amber-200' :
                          'bg-blue-50 text-blue-500 border-blue-200'
                        }`}
                      >
                        {user.domain}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-[13px] font-bold text-slate-600 mb-0.5">
                        {user.registrationDate.includes('/') ? new Date(user.registrationDate).toLocaleDateString('end-US', { month: 'short', day: 'numeric', year: 'numeric' }) : user.registrationDate}
                      </div>
                      <div className="text-[11px] text-gray-400 font-bold uppercase">{user.registrationTime}</div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-500 rounded-xl transition-colors shadow-sm"
                          title="Edit Profile"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          className="p-2.5 bg-[#8cc63f]/10 hover:bg-[#8cc63f]/20 text-[#8cc63f] rounded-xl transition-colors shadow-sm"
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400 font-bold">
                    No participants found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-[#f8faea]/30 border-t border-[#e8efe0]/60 text-center sm:text-left">
           <span className="text-[10px] sm:text-xs font-bold text-gray-400">Showing <span className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of {filteredUsers.length} participants</span>
           <div className="flex items-center gap-1">
             <button 
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
               disabled={currentPage === 1}
               className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-slate-700 disabled:opacity-30"
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
             </button>
             
             {Array.from({ length: totalPages }).map((_, i) => (
               <button 
                 key={i}
                 onClick={() => setCurrentPage(i + 1)}
                 className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-[#5c8a14] text-white' : 'hover:bg-gray-100 text-slate-600'}`}
               >
                 {i + 1}
               </button>
             ))}

             <button 
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
               disabled={currentPage === totalPages}
               className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-slate-700 disabled:opacity-30"
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </button>
           </div>
        </div>
      </div>



      {/* Render Modal if active */}
      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSave={handleSaveUser} 
        />
      )}

      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
