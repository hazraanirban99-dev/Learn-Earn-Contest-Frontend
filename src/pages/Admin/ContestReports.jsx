// ============================================================
// ContestReports.jsx — Admin e sob contest er status r report dekhar page
// Backend theke all contests fetch hoy (admin endpoint).
// Domain filter dropdown diye specific domain er contest filter korte para jay.
// Infinite scrolling ache — scroll korle aro contests load hobe.
// StatusUpdateMenu diye UPCOMING → ONGOING → COMPLETED status change kora jay,
// setar API call o ekhane handle kora hoy.
// ContestRow component React.memo diye wrapped — performance er jonno.
// ============================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  FiSearch, FiFilter, FiTrendingUp, FiDownload, FiPlus
} from 'react-icons/fi';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import StatusUpdateMenu from '../../components/Admin/StatusUpdateMenu';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Table Row Component - Memoized for performance
const ContestRow = React.memo(({ contest, index, onStatusUpdate }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-[#fcf3d9] text-[#dca51a] border-[#fce7a8]/50';
      case 'ONGOING':
        return 'bg-[#f4f8ec] text-[#8cc63f] border-[#e2edd3]/50';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-400 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700';
    }
  };

  const getDomainStyle = (domain) => {
    const d = domain.toLowerCase();
    if (d.includes('mern') || d.includes('dev')) return 'bg-blue-50 text-blue-500 border-blue-200';
    if (d.includes('ui') || d.includes('ux')) return 'bg-violet-50 text-violet-600 border-violet-200';
    if (d.includes('marketing') || d.includes('digital')) return 'bg-orange-50 text-orange-500 border-orange-200';
    if (d.includes('analytics')) return 'bg-teal-50 text-teal-600 border-teal-200';
    return 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700';
  };

  return (
    <tr className="hover:bg-white dark:bg-gray-800 transition-colors duration-200 group border-b border-[#e8efe0]/60">
      <td className="py-6 px-10">
        <span className="text-[14px] font-black text-gray-300">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
      </td>
      <td className="py-6 px-4">
        <div className="flex flex-col">
          <span className="font-black text-slate-800 dark:text-gray-100 text-[16px] tracking-tight leading-tight">
            {contest.title}
          </span>
        </div>
      </td>
      <td className="py-6 px-4">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border uppercase inline-block shadow-sm ${getDomainStyle(contest.domain)}`}>
          {contest.domain}
        </span>
      </td>
      <td className="py-6 px-4">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border uppercase inline-block shadow-sm ${getStatusStyle(contest.status)}`}>
          {contest.status}
        </span>
      </td>
      <td className="py-6 px-4">
        <span className="text-[16px] font-black text-slate-800 dark:text-gray-100">
          {contest.participants.toLocaleString()}
        </span>
      </td>
      <td className="py-6 px-10 text-right">
        <StatusUpdateMenu
          currentStatus={contest.status}
          onStatusUpdate={(newStatus) => onStatusUpdate(contest.id, newStatus)}
        />
      </td>
    </tr>
  );
});

const ContestReports = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [contests, setContests] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerBatch = 10;

  // Infinite scroll sentinel ref
  const sentinelRef = useRef(null);

  // Backend theke contests fetch kora hocche
  useEffect(() => {
    const fetchContests = async () => {
      if (authLoading) return;
      if (!user || user.role !== 'admin') return;
      setLoading(true);
      try {
        const { data } = await api.get('/admin/contests/admin');
        if (data.success) {
          const mapped = data.data.map(c => ({
            id: c._id,
            title: c.title,
            domain: c.domain || 'General',
            status: c.status,
            participants: c.participantsCount || 0,
            dateInfo: formatDateDDMMYYYY(c.startDate)
          }));
          setContests(mapped);
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          toast.error('Failed to load contest reports');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [user?.role, user?._id, authLoading]);

  // Derived unique domains
  const domains = useMemo(() => {
    return ['All Domains', ...new Set(contests.map(c => c.domain))];
  }, [contests]);

  // Handle Domain Filtering
  const filteredContests = useMemo(() => {
    if (selectedDomain === 'All Domains') return contests;
    return contests.filter(c => c.domain === selectedDomain);
  }, [contests, selectedDomain]);

  // Visible contests (infinite scroll slice)
  const visibleContests = useMemo(() => {
    return filteredContests.slice(0, visibleCount);
  }, [filteredContests, visibleCount]);

  const hasMore = visibleCount < filteredContests.length;

  // Reset visible count when domain filter changes
  useEffect(() => {
    setVisibleCount(itemsPerBatch);
  }, [selectedDomain]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          setVisibleCount(prev => prev + itemsPerBatch);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  // Status Update Handler - Backend e connected
  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/admin/contests/status/${id}`, { status: newStatus });
      setContests(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`Contest status updated to ${newStatus.toLowerCase()}!`);
    } catch (error) {
      toast.error(error.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1440px] mx-auto space-y-12">

        {/* --- Header & Filter Toolbar --- */}
        <div className="flex flex-col gap-10">
          {/* Section Title Group */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-[#fbc111]"></div>
                <h4 className="text-[#fbc111] text-[13px] font-black tracking-[0.3em] uppercase">Academic Dashboard</h4>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-slate-800 dark:text-gray-100 tracking-tighter leading-none">
                Contest <span className="text-[#5c8a14]">Archives</span>
              </h1>
            </div>

            {/* Controls Toolbar */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Domain Filter Dropdown */}
              <div className="relative flex-1 sm:flex-none flex items-center bg-[#fbc111] rounded-2xl px-6 py-1 shadow-md border border-[#fbc111]/20 hover:shadow-lg transition-all group">
                <label className="text-[11px] font-black text-slate-900 dark:text-gray-100/40 uppercase tracking-widest mr-2 whitespace-nowrap">Domain:</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                  }}
                  className="appearance-none bg-transparent border-none py-3 text-[13px] font-black text-slate-900 dark:text-gray-100 focus:outline-none w-full min-w-[140px] cursor-pointer pr-8 transition-all"
                >
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-900 dark:text-gray-100/30">
                  <FiFilter size={16} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Main Table Container --- */}
        <div className="bg-[#fbfcfa] rounded-[48px] border border-[#e8efe0] overflow-hidden shadow-2xl shadow-[#8cc63f]/5">
          <div className="overflow-x-auto w-full scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#f8faea]/50 border-b border-[#e8efe0]">
                  <th className="py-7 px-10 text-[11px] font-black tracking-widest text-slate-400 uppercase">#</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Contest Name</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Domain</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Status</th>
                  <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Total Enrolled</th>
                  <th className="py-7 px-10 text-right text-[11px] font-black tracking-widest text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 text-[#8cc63f] rounded-full spinner-dual"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading contests...</span>
                      </div>
                    </td>
                  </tr>
                ) : visibleContests.length > 0 ? (
                  visibleContests.map((contest, idx) => (
                    <ContestRow
                      key={contest.id}
                      contest={contest}
                      index={idx}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                      No contests found in this domain.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- Infinite Scroll Sentinel & Footer --- */}
          <div ref={sentinelRef} className="py-1" />
          {hasMore && !loading && (
            <div className="bg-[#f8faea]/40 px-10 py-8 border-t border-[#e8efe0] flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-3 text-[#8cc63f] rounded-full spinner-dual"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading more contests...</span>
            </div>
          )}
          {!hasMore && filteredContests.length > 0 && !loading && (
            <div className="bg-[#f8faea]/40 px-10 py-6 border-t border-[#e8efe0] flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                Showing all {filteredContests.length} contests
              </span>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default React.memo(ContestReports);
