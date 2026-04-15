// ============================================================
// ParticipantsDirectory.jsx — Sob participant er directory page (Admin only)
// UserContext theke sob student fetch hoy.
// Domain filter diye specific domain er student dekhano jay.
// Infinite scrolling ache — scroll korle aro participants load hobe.
// Export button click korle sob participant er CSV download hobe.
// React.memo use kora hoyeche unnecessary re-render avoid korar jonno.
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  FiSearch, FiFilter, FiDownload
} from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { exportToCSV } from '../../utils/exportUtils';

// Table Row Component - Memoized for performance
const ParticipantRow = React.memo(({ user, index }) => {
  return (
    <tr className="hover:bg-white dark:bg-gray-800 transition-colors duration-200 group border-b border-[#e8efe0]/60">
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
          <span className="font-black text-slate-800 dark:text-gray-100 text-[15px] tracking-tight">
            {user.name}
          </span>
        </div>
      </td>
      <td className="py-6 px-4">
        <span className="text-[14px] font-bold text-slate-500">
          {user.email}
        </span>
      </td>
      <td className="py-6 px-4 text-center">
        <span className="text-[14px] font-bold text-slate-500 italic">
          {user.gender}
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
      <td className="py-6 px-4 max-w-[200px]">
        <span className="text-[12px] font-medium text-slate-400 leading-tight block">
          {user.address}
        </span>
      </td>
    </tr>
  );
});

const ParticipantsDirectory = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const itemsPerPage = 8;

  const domains = ['All Domains', 'MERN', 'UI/UX', 'Digital Marketing'];

  // Infinite scroll sentinel ref
  const sentinelRef = useRef(null);

  const fetchParticipants = useCallback(async (page, isExport = false, isLoadMore = false) => {
    if (!isExport && !isLoadMore) setLoading(true);
    if (isLoadMore) setLoadingMore(true);
    try {
      const { data } = await api.get('/admin/users/students', {
        params: {
          page: isExport ? 1 : page,
          limit: isExport ? 1000 : itemsPerPage,
          domain: selectedDomain,
          query: searchQuery
        }
      });

      if (data.success) {
        if (isExport) {
          exportToCSV(data.data.participants, `Participants_${selectedDomain}_Export`);
        } else {
          const newParticipants = data.data.participants;
          if (isLoadMore) {
            setParticipants(prev => [...prev, ...newParticipants]);
          } else {
            setParticipants(newParticipants);
          }
          // Check if there are more pages
          const totalPages = data.data.pagination.totalPages;
          setHasMore(page < totalPages);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch participants library.");
      console.error(error);
    } finally {
      if (!isExport) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [selectedDomain, searchQuery]);

  // Reset and fetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setHasMore(true);
      fetchParticipants(1);
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [selectedDomain, searchQuery, fetchParticipants]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchParticipants(nextPage, false, true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, currentPage, fetchParticipants]);

  const handleExport = async () => {
    setExportLoading(true);
    await fetchParticipants(1, true);
    setExportLoading(false);
  };

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
            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 dark:text-gray-100 tracking-tighter leading-none">
              Participant <span className="text-[#fbc111]">Directory</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm lg:text-base leading-relaxed">
              A curated view of all active participants within the Desun Academy ecosystem. Real-time data synchronization directly from the secure student registry.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="group flex items-center gap-3 bg-[#8cc63f] hover:bg-[#7db534] text-white px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-[#8cc63f]/30 hover:-translate-y-1 active:scale-95 disabled:opacity-50 whitespace-nowrap w-full lg:w-auto justify-center"
          >
            <FiDownload size={18} className={exportLoading ? 'animate-bounce' : 'group-hover:bounce'} />
            <span>{exportLoading ? 'Generating File...' : 'Export Registry List'}</span>
          </button>
        </div>

        {/* --- Filter Toolbar --- */}
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="relative flex items-center bg-[#fbc111] rounded-2xl px-6 py-1 shadow-md border border-[#fbc111]/20 hover:shadow-lg transition-all group w-full sm:w-max">
            <label className="text-[11px] font-black text-slate-900 dark:text-gray-100/40 uppercase tracking-widest mr-2 whitespace-nowrap">Domain:</label>
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
              }}
              className="appearance-none bg-transparent border-none py-3 text-[13px] font-black text-slate-900 dark:text-gray-100 focus:outline-none w-full min-w-[160px] cursor-pointer pr-8 transition-all"
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-900 dark:text-gray-100/30">
              <FiFilter size={16} strokeWidth={3} />
            </div>
          </div>

          {/* New Search Input */}
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8cc63f] transition-colors">
              <FiSearch size={20} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#8cc63f]/10 focus:border-[#8cc63f]/30 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-[#fbfcfa] rounded-[48px] border border-[#e8efe0] overflow-hidden shadow-2xl shadow-[#fbc111]/5">
          <div className="overflow-x-auto w-full scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#f8faea]/50 border-b border-[#e8efe0]">
                  <th className="py-7 px-10 text-[11px] font-black tracking-widest text-slate-400 uppercase">#</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Participant Name</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Email Address</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase text-center">Gender</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Contact Number</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Interested Domain</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 text-[#8cc63f] rounded-full spinner-dual"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Syncing Library...</span>
                      </div>
                    </td>
                  </tr>
                ) : participants.length > 0 ? (
                  participants.map((user, idx) => (
                    <ParticipantRow
                      key={user.id || idx}
                      user={user}
                      index={idx}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                      No participants found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- Infinite Scroll Sentinel & Loading Indicator --- */}
          <div ref={sentinelRef} className="py-1" />
          {loadingMore && (
            <div className="bg-[#fcfdf8] px-10 py-8 border-t border-[#e8efe0] flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-3 text-[#8cc63f] rounded-full spinner-dual"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading more participants...</span>
            </div>
          )}
          {!hasMore && participants.length > 0 && !loading && (
            <div className="bg-[#fcfdf8] px-10 py-6 border-t border-[#e8efe0] flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                All {participants.length} participants loaded
              </span>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default React.memo(ParticipantsDirectory);
