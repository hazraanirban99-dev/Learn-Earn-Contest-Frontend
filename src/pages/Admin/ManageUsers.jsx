import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useUsers } from '../../context/UserContext';
import EditUserModal from '../../components/Admin/EditUserModal';
import AdminLayout from '../../layouts/AdminLayout';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiTrendingUp, FiCheckCircle, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { Loader } from '../../components/index';

const ManageUsers = () => {
  const { users, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedContest, setSelectedContest] = useState('All Contests');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerBatch = 10;

  // Infinite scroll sentinel ref
  const sentinelRef = useRef(null);

  const [contests, setContests] = useState([]);
  React.useEffect(() => {
    const fetchCompletedContests = async () => {
      try {
        const { data } = await api.get('/admin/contests/admin');
        if (data && data.success) {
          setContests(data.data.filter(c => c.status === 'COMPLETED').map(c => c.title));
        }
      } catch (err) {
        console.error("Failed to fetch contests in manage users", err);
      }
    };
    fetchCompletedContests();
  }, []);

  const userContests = React.useMemo(() => ({
    1: ['Eco-Urban Design 2024'],
    2: ['Visual Brand Identity', 'Eco-Urban Design 2024'],
    3: ['Fintech UI Redesign'],
    4: ['Sustainable Energy Hackathon', 'Visual Brand Identity']
  }), []);

  const suggestions = React.useMemo(() => {
    if (!searchTerm || selectedFilter) return [];
    const lowerSearch = searchTerm.toLowerCase();

    const userMatches = users
      .filter(u => u.name.toLowerCase().includes(lowerSearch))
      .map(u => ({ type: 'user', label: u.name, value: u.name, id: u.id }));

    const contestMatches = contests
      .filter(c => c.toLowerCase().includes(lowerSearch))
      .map(c => ({ type: 'contest', label: `Contest: ${c}`, value: c }));

    return [...userMatches, ...contestMatches].slice(0, 5);
  }, [searchTerm, users, selectedFilter]);

  const filteredUsers = React.useMemo(() => {
    let result = users;

    if (selectedDomain && selectedDomain !== 'All Domains') {
      const sanitizedSelected = selectedDomain.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      result = result.filter(u => u.domain && u.domain.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().includes(sanitizedSelected));
    }

    if (selectedContest && selectedContest !== 'All Contests') {
      result = result.filter(u => {
        if (u.contests && Array.isArray(u.contests)) {
          return u.contests.some(c => typeof c === 'string' ? c === selectedContest : c.title === selectedContest);
        }
        return userContests[u.id]?.includes(selectedContest);
      });
    }

    if (selectedFilter && selectedFilter.type === 'user') {
      return result.filter(u => u.id === selectedFilter.id);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    return result;
  }, [users, searchTerm, selectedFilter, selectedDomain, selectedContest, userContests]);

  // Visible users (infinite scroll slice)
  const visibleUsers = useMemo(() => {
    return filteredUsers.slice(0, visibleCount);
  }, [filteredUsers, visibleCount]);

  const hasMore = visibleCount < filteredUsers.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(itemsPerBatch);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedDomain, selectedContest, searchTerm, selectedFilter]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          setVisibleCount(prev => prev + itemsPerBatch);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const handleEditClick = React.useCallback((user) => {
    setEditingUser(user);
  }, []);

  const handleSaveUser = React.useCallback((updatedData) => {
    updateUser(updatedData.id, updatedData);
    setEditingUser(null);
    toast.success("Scholar profile updated successfully!");
  }, [updateUser]);

  const handleSuggestionClick = (suggestion) => {
    setSelectedFilter(suggestion);
    setSearchTerm(suggestion.label);
    setShowSuggestions(false);
  };

  const clearFilter = () => {
    setSelectedFilter(null);
    setSearchTerm('');
    setSelectedContest('All Contests');
    setSelectedDomain('All Domains');
  };

  const handleDeleteUser = React.useCallback((id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-sm font-black text-slate-800 dark:text-gray-100 mb-3 uppercase tracking-tight">Delete this participant?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              deleteUser(id);
              toast.success("Participant removed from registry.");
              closeToast();
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={closeToast}
            className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      theme: "light",
      className: "border-2 border-[#fbc111] !bg-[#f3f4f6] dark:!bg-gray-900 dark:!border-[#fbc111] shadow-2xl"
    });
  }, [deleteUser]);

  return (
    <AdminLayout>
      <div className="animate-in fade-in duration-500 max-w-[1440px] mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center bg-gradient-to-r from-green-300/30 to-yellow-300/30 dark:from-green-900/20 dark:to-yellow-900/20 rounded-full px-6 py-4 shadow-sm border border-[#8cc63f]/20 dark:border-gray-700 transition-all hover:shadow-md focus-within:shadow-md focus-within:border-[#8cc63f]/40 group">
            <FiSearch className="text-[#8cc63f] mr-3 group-focus-within:scale-110 transition-transform" size={20} />
            <input
              type="text"
              placeholder="Search by scholar name, @username, or contest title..."
              className="bg-transparent border-none outline-none w-full text-[15px] text-slate-700 font-bold placeholder:text-gray-400"
              value={searchTerm}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedFilter(null);
              }}
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-[#8cc63f]/10 mt-2 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-6 py-3 bg-[#f8faea]/30 dark:bg-gray-800/10 border-b border-gray-50 dark:border-gray-700">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Most Matched Results</span>
              </div>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => handleSuggestionClick(s)}
                  className="w-full text-left px-6 py-4 hover:bg-[#f8faea] dark:hover:bg-gray-700/50 flex items-center justify-between group border-b border-gray-50 dark:border-gray-700 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 dark:text-gray-100 tracking-tight">{s.label}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest transition-colors group-hover:text-[#5c8a14]">
                      {s.type === 'contest' ? `Filter by Contest` : `View Scholar Details`}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${s.type === 'contest' ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'bg-[#fbc111]/10 text-[#fbc111]'}`}>
                    <FiTrendingUp size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mt-6">
          <div className="space-y-4 max-w-2xl">
            <span className="bg-[#fcf3d9] dark:bg-[#fcf3d9]/10 text-[#dca51a] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
              Registry Management
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-gray-100 tracking-tight leading-[1.1]">
              Manage Scholars & Participants
            </h1>
            <p className="text-gray-500 font-bold text-sm lg:text-base max-w-xl leading-relaxed">
              Oversee the academic collective. Review registration data, manage domain assignments, and ensure participant integrity across the atelier.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-between gap-4 bg-[#f8faea]/60 dark:bg-gray-800/40 p-4 rounded-2xl border border-[#e8efe0] dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="relative w-full sm:flex-1 max-w-xl">
              <select
                value={selectedContest}
                onChange={(e) => {
                  setSelectedContest(e.target.value);
                }}
                className="appearance-none bg-white dark:bg-gray-800 border border-[#8cc63f]/30 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/40 w-full shadow-sm cursor-pointer pr-10 hover:border-[#8cc63f]/60 transition-all"
              >
                <option value="All Contests">All Contests</option>
                {contests.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-[#8cc63f]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                }}
                className="appearance-none bg-white dark:bg-gray-800 border border-[#fbc111]/40 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#fbc111]/40 w-full shadow-sm cursor-pointer pr-10 hover:border-[#fbc111]/80 transition-all"
              >
                <option value="All Domains">All Domains</option>
                <option value="MERN">MERN</option>
                <option value="UIUX">UI/UX</option>
                <option value="DIGITAL MARKETING">DIGITAL MARKETING</option>
              </select>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-[#fbc111]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#fcfdf8] dark:bg-gray-900 rounded-[24px] border border-[#e8efe0] dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
              <thead>
                <tr className="border-b border-[#e8efe0] dark:border-gray-700 uppercase text-[10px] font-black tracking-widest text-[#5c8a14]/70 bg-[#f8faea] dark:bg-gray-800/50">
                  <th className="py-5 px-8">Scholar Name</th>
                  <th className="py-5 px-6">Contact Info</th>
                  <th className="py-5 px-6">Domain Discipline</th>
                  <th className="py-5 px-6">Registration Date</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8efe0]/60">
                {visibleUsers.length > 0 ? (
                  visibleUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 group border-b border-gray-100 dark:border-gray-700">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-gray-100 shadow-sm" />
                          <div>
                            <div className="font-black text-slate-800 dark:text-gray-100 text-[15px]">{user.name}</div>
                            <div className="text-[9px] text-[#fbc111] font-black tracking-widest mt-0.5 uppercase">PARTICIPANT MEMBER</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-[13px] font-bold text-slate-600 dark:text-gray-300 mb-0.5">{user.email}</div>
                        <div className="text-[12px] text-gray-400 font-medium">{user.phone}</div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border uppercase inline-block shadow-sm 
                        ${(user.domain || '').toUpperCase().includes('UI/UX') ? 'bg-[#f4f8ec] dark:bg-[#f4f8ec]/5 text-[#8cc63f] border-[#8cc63f]/20' :
                            (user.domain || '').toUpperCase().includes('MERN') ? 'bg-purple-50 dark:bg-purple-900/10 text-purple-500 border-purple-200 dark:border-purple-800' :
                              (user.domain || '').toUpperCase().includes('DIGITAL MARKETING') ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-500 border-amber-200 dark:border-amber-800' :
                                'bg-blue-50 dark:bg-blue-900/10 text-blue-500 border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          {user.domain}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-[13px] font-bold text-slate-600 dark:text-gray-300 mb-0.5">
                          {formatDateDDMMYYYY(user.registrationDate)}
                        </div>
                        <div className="text-[11px] text-gray-400 font-bold uppercase">{user.registrationTime}</div>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-500 rounded-xl transition-colors shadow-sm"
                            title="Edit Profile"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2.5 bg-[#8cc63f]/10 dark:bg-[#8cc63f]/5 hover:bg-[#8cc63f]/20 dark:hover:bg-[#8cc63f]/15 text-[#8cc63f] rounded-xl transition-colors shadow-sm"
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

          {/* Infinite Scroll Sentinel & Footer */}
          <div ref={sentinelRef} className="py-1" />
          {hasMore && (
            <div className="flex items-center justify-center gap-4 px-6 sm:px-8 py-8 bg-[#f8faea]/30 dark:bg-gray-800/20 border-t border-[#e8efe0]/60 dark:border-gray-700">
              <Loader size="xs" text="Loading more scholars..." />
            </div>
          )}
          {!hasMore && filteredUsers.length > 0 && (
            <div className="flex items-center justify-center px-6 sm:px-8 py-6 bg-[#f8faea]/30 dark:bg-gray-800/20 border-t border-[#e8efe0]/60 dark:border-gray-700">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                Showing all {filteredUsers.length} participants
              </span>
            </div>
          )}
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
