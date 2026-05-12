// ============================================================
// ContestReports.jsx — Admin e sob contest er status r report dekhar page
// Backend theke all contests fetch hoy (admin endpoint).
// Side domain filter dropdown diye specific domain er contest filter korte para jay.
// Export CSV feature ache — filtered data download kora jay.
// ============================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  FiSearch, FiFilter, FiTrendingUp, FiDownload, FiPlus, FiChevronRight, FiGrid, FiFileText
} from 'react-icons/fi';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import StatusUpdateMenu from '../../components/Admin/StatusUpdateMenu';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/index';
import { getActualStatus } from '../../utils/statusUtils';
import EditContestModal from '../../components/Admin/EditContestModal';

// Table Row Component - Memoized for performance
const ContestRow = React.memo(({ contest, index, onStatusUpdate, onEdit, onDelete }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-[#fcf3d9] dark:bg-[#fcf3d9]/10 text-[#dca51a] border-[#fce7a8]/50 dark:border-[#dca51a]/20';
      case 'ONGOING':
        return 'bg-[#f4f8ec] dark:bg-[#f4f8ec]/10 text-[#8cc63f] border-[#e2edd3]/50 dark:border-[#8cc63f]/20';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-400 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700';
    }
  };

  const getDomainStyle = (domain) => {
    const d = domain.toLowerCase();
    if (d.includes('mern') || d.includes('dev')) return 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
    if (d.includes('ui') || d.includes('ux')) return 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40';
    if (d.includes('marketing') || d.includes('digital')) return 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-800/40';
    if (d.includes('analytics')) return 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/40';
    return 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700';
  };

  return (
    <tr className="hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 group border-b border-[#e8efe0]/60 dark:border-gray-700">
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
        <div className="flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${contest.projectType === 'Solo' ? 'bg-indigo-500' : contest.projectType === 'Team' ? 'bg-[#8cc63f]' : 'bg-[#fbc111]'}`}></span>
           <span className="text-[13px] font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">
             {contest.projectType}
           </span>
        </div>
      </td>
      <td className="py-6 px-4">
        <span className="text-[16px] font-black text-slate-800 dark:text-gray-100">
          {contest.participants.toLocaleString()}
        </span>
      </td>
      <td className="py-6 px-10 text-right">
        <StatusUpdateMenu
          onEdit={() => onEdit(contest.id)}
          onDelete={() => onDelete(contest.id)}
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

  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  // Infinite scroll sentinel ref
  const sentinelRef = useRef(null);

  const fetchContests = useCallback(async () => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const { data } = await api.get('/admin/contests/admin');
      if (data.success) {
        const mapped = data.data.map(c => {
          const actualStatus = getActualStatus(c);
          return {
            id: c._id,
            title: c.title,
            domain: c.domain || 'General',
            status: actualStatus,
            projectType: c.projectType || 'Solo',
            participants: c.participantsCount || 0,
            dateInfo: formatDateDDMMYYYY(c.startDate)
          };
        });
        setContests(mapped);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error('Failed to load contest reports');
      }
    } finally {
      setLoading(false);
    }
  }, [authLoading, user?.role, user?._id]);

  // Backend theke contests fetch kora hocche
  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

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
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  const handleDelete = useCallback(async (id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-sm font-black text-slate-800 dark:text-gray-100 mb-3 uppercase tracking-tight">Delete this contest?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/admin/contests/${id}`);
                setContests(prev => prev.filter(c => c.id !== id));
                toast.success("Contest deleted successfully!");
              } catch (err) {
                toast.error("Deletion failed");
              }
              closeToast();
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button onClick={closeToast} className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
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
  }, []);

  const handleEdit = useCallback((id) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('edit', id);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // --- Export to CSV Logic ---
  const handleExportCSV = () => {
    if (filteredContests.length === 0) {
      toast.warn("No data available to export.");
      return;
    }

    const headers = ["ID", "Contest Title", "Domain", "Status", "Type", "Total Enrolled", "Start Date"];
    const csvRows = filteredContests.map((c, i) => [
      i + 1,
      `"${c.title.replace(/"/g, '""')}"`,
      c.domain,
      c.status,
      c.projectType,
      c.participants,
      c.dateInfo
    ]);

    const csvContent = [headers, ...csvRows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Contest_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Report exported successfully!");
  };

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1440px] mx-auto space-y-12">

        {/* --- Header & Title --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-[#fbc111]"></div>
              <h4 className="text-[#fbc111] text-[13px] font-black tracking-[0.3em] uppercase">Academic Archives</h4>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 dark:text-gray-100 tracking-tighter leading-none">
              Contest <span className="text-[#5c8a14]">Reports</span>
            </h1>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-3 bg-[#5c8a14] hover:bg-[#8cc63f] text-white px-8 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#8cc63f]/20 transition-all group"
          >
            <FiDownload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Export CSV
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* --- LEFT SIDEBAR: Domain Filter --- */}
          <aside className="w-full lg:w-72 shrink-0">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-[#e8efe0] dark:border-gray-700 shadow-sm sticky top-24">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-8 h-8 rounded-xl bg-[#fbc111]/10 flex items-center justify-center text-[#fbc111]">
                      <FiFilter size={18} strokeWidth={3} />
                   </div>
                   <h3 className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-widest">Filters</h3>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Select Domain</p>
                   {domains.map(domain => (
                      <button
                         key={domain}
                         onClick={() => setSelectedDomain(domain)}
                         className={`w-full text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-between group ${
                            selectedDomain === domain 
                               ? 'bg-[#8cc63f] text-white shadow-lg shadow-[#8cc63f]/20' 
                               : 'bg-gray-50 dark:bg-gray-900/50 text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                         }`}
                      >
                         {domain}
                         {selectedDomain === domain && <FiChevronRight size={16} />}
                      </button>
                   ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-700">
                   <div className="bg-[#fbc111]/5 p-6 rounded-[32px] border border-[#fbc111]/10">
                      <FiGrid className="text-[#fbc111] mb-4" size={24} />
                      <h4 className="text-xs font-black text-slate-800 dark:text-gray-100 uppercase mb-2">Total Contests</h4>
                      <p className="text-3xl font-black text-[#5c8a14]">{filteredContests.length}</p>
                   </div>
                </div>
             </div>
          </aside>

          {/* --- MAIN CONTENT: Table --- */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-900 rounded-[48px] border border-[#e8efe0] dark:border-gray-700 overflow-hidden shadow-2xl shadow-[#8cc63f]/5">
              <div className="overflow-x-auto w-full scrollbar-hide">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#f8faea]/50 dark:bg-gray-800/50 border-b border-[#e8efe0] dark:border-gray-700">
                      <th className="py-7 px-10 text-[11px] font-black tracking-widest text-slate-400 uppercase">#</th>
                      <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Contest Name</th>
                      <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Domain</th>
                      <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Status</th>
                      <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Type</th>
                      <th className="py-7 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">Participants</th>
                      <th className="py-7 px-10 text-right text-[11px] font-black tracking-widest text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="py-24 text-center">
                          <Loader size="sm" text="Loading contests..." />
                        </td>
                      </tr>
                    ) : visibleContests.length > 0 ? (
                      visibleContests.map((contest, idx) => (
                        <ContestRow
                          key={contest.id}
                          contest={contest}
                          index={idx}
                          onStatusUpdate={handleStatusUpdate}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
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
                <div className="bg-[#f8faea]/40 dark:bg-gray-800/30 px-10 py-8 border-t border-[#e8efe0] dark:border-gray-700 flex flex-col items-center justify-center gap-4">
                  <Loader size="xs" text="Loading more contests..." />
                </div>
              )}
              {!hasMore && filteredContests.length > 0 && !loading && (
                <div className="bg-[#f8faea]/40 dark:bg-gray-800/30 px-10 py-6 border-t border-[#e8efe0] dark:border-gray-700 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    Showing all {filteredContests.length} contests
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {editId && (
        <EditContestModal
          isOpen={!!editId}
          contestId={editId}
          onClose={() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('edit');
            setSearchParams(newParams);
            fetchContests(); // Refetch data after edit
          }}
        />
      )}
    </AdminLayout>
  );
};

export default React.memo(ContestReports);
