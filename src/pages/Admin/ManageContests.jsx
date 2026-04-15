// ============================================================
// ManageContests.jsx — Admin e contest manage korar page
// Backend theke sob contest fetch hoy, ar card akare dekhano hoy.
// Prottekta card e edit, delete, r "View Participants" option ache.
// Edit click korle URL e ?edit=id set hoy r EditContestModal open hoy.
// "View Participants" click korle real-time submissions fetch hoye
// EnrolledParticipantsModal e team/solo info dekhano hoy.
// Domain name (MERN/UIUX etc) contest title er upore dekhano hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import EditContestModal from '../../components/Admin/EditContestModal';
import EnrolledParticipantsModal from '../../components/Admin/EnrolledParticipantsModal';
import {
  FiUsers, FiClipboard, FiCheckCircle,
  FiCalendar, FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiZap, FiAward
} from 'react-icons/fi';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { FaTrophy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/Admin/StatCard';
import ContestListModal from '../../components/Admin/ContestListModal';
import { useAdminDashboard } from '../../context/AdminDashboardContext';
import { Loader } from '../../components';

const ManageContests = () => {
  const { user, loading: authLoading } = useAuth();
  const { fetchAllContests } = useAdminDashboard();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [loading, setLoading] = useState(true);
  const [viewParticipantsOpen, setViewParticipantsOpen] = useState(false);
  const [viewParticipantsContest, setViewParticipantsContest] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContests, setModalContests] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const [contests, setContests] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0
  });

  const handleCardClick = async (type) => {
    setModalTitle(type);
    setIsModalOpen(true);
    setModalLoading(true);

    // Instead of filtering the local 'contests' state which might be paginated or filtered,
    // we fetch freshly to ensure the report is complete.
    const all = await fetchAllContests();
    let filtered = [];

    if (type.includes('UPCOMING')) {
      filtered = all.filter(c => c.status === 'UPCOMING');
    } else if (type.includes('ACTIVE')) {
      filtered = all.filter(c => c.status === 'ONGOING');
    } else if (type.includes('COMPLETED')) {
      filtered = all.filter(c => c.status === 'COMPLETED');
    }

    setModalContests(filtered);
    setModalLoading(false);
  };

  const [domainFilter, setDomainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [domainFilter, statusFilter]);

  const filteredContests = React.useMemo(() => {
    return contests.filter(c => {
      if (domainFilter !== 'ALL' && c.domain !== domainFilter) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      return true;
    });
  }, [contests, domainFilter, statusFilter]);

  const totalPages = Math.ceil(filteredContests.length / itemsPerPage);
  const currentContests = filteredContests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Backend theke contests ebong stats fetch kora hocche
  const fetchData = async () => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') return;

    setLoading(true);
    try {
      const { data } = await api.get('/admin/contests/admin');
      if (data.success) {
        setContests(data.data);

        // Stats derive kora hocche
        const active = data.data.filter(c => c.status === 'ONGOING').length;
        const upcoming = data.data.filter(c => c.status === 'UPCOMING').length;
        const completed = data.data.filter(c => c.status === 'COMPLETED').length;

        setStats({ active, upcoming, completed });
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Fetch error:", error);
        toast.error("Failed to load contests");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.role, user?._id, authLoading]);

  const handleDelete = React.useCallback(async (id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-sm font-black text-slate-800 dark:text-gray-100 mb-3 uppercase tracking-tight">Delete this contest?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/admin/contests/${id}`);
                setContests(prev => prev.filter(c => c._id !== id));
                // Update stats locally
                setStats(prev => {
                  const deleted = contests.find(c => c._id === id);
                  if (!deleted) return prev;
                  return {
                    ...prev,
                    active: deleted.status === 'ONGOING' ? prev.active - 1 : prev.active,
                    upcoming: deleted.status === 'UPCOMING' ? prev.upcoming - 1 : prev.upcoming,
                    completed: deleted.status === 'COMPLETED' ? prev.completed - 1 : prev.completed
                  };
                });
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
          <button onClick={closeToast} className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-300 transition-colors">Cancel</button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, { autoClose: false, closeOnClick: false, draggable: false, theme: "light" });
  }, [contests]);

  const getStatusColor = React.useCallback((status) => {
    switch (status) {
      case 'ONGOING': return 'bg-[#8cc63f] text-white';
      case 'UPCOMING': return 'bg-[#fbc111] text-white';
      case 'COMPLETED': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  }, []);

  if (loading) return <AdminLayout><Loader text="Building Contest Inventory..." /></AdminLayout>;

  return (
    <>
      {editId && (
        <EditContestModal
          isOpen={!!editId}
          contestId={editId}
          onClose={() => {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('edit');
            setSearchParams(newParams);
            fetchData(); // Refetch data after edit
          }}
        />
      )}

      {viewParticipantsOpen && (
        <EnrolledParticipantsModal
          isOpen={viewParticipantsOpen}
          onClose={() => setViewParticipantsOpen(false)}
          contestTitle={viewParticipantsContest?.title}
          contestId={viewParticipantsContest?._id}
        />
      )}
      <AdminLayout>
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <h4 className="text-[#fbc111] text-[10px] sm:text-[12px] font-black tracking-[0.2em] uppercase">Academic Registry</h4>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-none">Scholastic <span className="text-[#8cc63f]">Contests</span></h1>
            </div>
            <button onClick={() => navigate('/admin/contests/create')} className="shrink-0 bg-[#bdcc16] hover:bg-[#a6b50e] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <FiPlus size={20} strokeWidth={3} /> Create New Contest
            </button>
          </div>

          {/* Stats Grid — 3 premium cards in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            <StatCard
              title="ACTIVE CONTESTS"
              value={stats.active.toString()}
              icon={FiZap}
              color="bg-purple-50"
              accentColor="text-purple-500"
              trend="LIVE"
              onClick={() => handleCardClick('ACTIVE CONTESTS')}
            />
            <StatCard
              title="UPCOMING CONTESTS"
              value={stats.upcoming.toString()}
              icon={FiCalendar}
              color="bg-blue-50"
              accentColor="text-blue-500"
              trend="SCHEDULED"
              onClick={() => handleCardClick('UPCOMING CONTESTS')}
            />
            <StatCard
              title="COMPLETED CONTESTS"
              value={stats.completed.toString()}
              icon={FaTrophy}
              color="bg-green-50"
              accentColor="text-green-600"
              trend="ARCHIVED"
              onClick={() => handleCardClick('COMPLETED CONTESTS')}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 mb-2">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border-2 border-[#fbc111] focus:border-[#fbc111] rounded-xl px-2 sm:px-4 py-2.5 text-[11px] sm:text-sm font-black text-[#8cc63f] outline-none w-1/2 sm:w-48 shadow-sm cursor-pointer appearance-none transition-all"
              >
                <option value="ALL">All Domains</option>
                <option value="MERN">MERN</option>
                <option value="UIUX">UI/UX</option>
                <option value="DIGITAL MARKETING">DIGITAL MARKETING</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border-2 border-[#8cc63f] focus:border-[#8cc63f] rounded-xl px-2 sm:px-4 py-2.5 text-[11px] sm:text-sm font-black text-[#fbc111] outline-none w-1/2 sm:w-40 shadow-sm cursor-pointer appearance-none transition-all"
              >
                <option value="ALL">All Status</option>
                <option value="ONGOING">Ongoing</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 mt-4">
            {currentContests.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-[40px] p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-sm shadow-sm border border-gray-100 dark:border-gray-700">
                No contests match your selected filters.
              </div>
            ) : (
              currentContests.map((contest) => (
                <div key={contest._id} className="bg-white dark:bg-gray-800 p-6 rounded-[40px] shadow-sm hover:shadow-lg transition-all flex flex-col lg:flex-row gap-8 group">
                  <div className="relative w-full lg:w-[360px] h-[220px] rounded-[24px] overflow-hidden shrink-0">
                    <img src={contest.thumbnail.url} alt={contest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4"><span className={`${getStatusColor(contest.status)} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md`}>{contest.status}</span></div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center py-2 relative w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex-1">
                        <h5 className="text-[#fbc111] font-black text-[10px] uppercase tracking-widest mb-2 sm:mb-3">{contest.domain}</h5>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-tight break-words">{contest.title}</h2>
                      </div>
                      <div className="inline-flex items-center shrink-0 gap-2 text-[#a68945] bg-[#fcf3d9]/50 border border-[#fbc111]/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl w-fit shadow-sm backdrop-blur-sm self-start">
                        <FiCalendar size={14} className="text-[#fbc111] shrink-0" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider whitespace-nowrap">Deadline: {formatDateDDMMYYYY(contest.endDate)}</span>
                      </div>
                    </div>

                    {/* Awards Highlight Section */}
                    <div className="flex flex-wrap gap-4 my-4">
                      {contest.cashPrize > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                          <FiAward className="text-green-600" size={14} />
                          <span className="text-[11px] font-black text-green-700 uppercase tracking-wider">Cash Prize: ₹{contest.cashPrize}</span>
                        </div>
                      )}
                      {contest.expertCertificate === 'Yes' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                          <FiAward className="text-green-600" size={14} />
                          <span className="text-[11px] font-black text-green-700 uppercase tracking-wider">Expert Certificate</span>
                        </div>
                      )}
                      {contest.internshipOffer === 'Yes' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                          <FiAward className="text-green-600" size={14} />
                          <span className="text-[11px] font-black text-green-700 uppercase tracking-wider">Internship Offer</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => { const newParams = new URLSearchParams(searchParams); newParams.set('edit', contest._id); setSearchParams(newParams); }}
                          className="flex-1 sm:w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#f1f8e8] text-gray-400 hover:text-[#8cc63f] flex items-center justify-center transition-all border border-transparent hover:border-[#8cc63f]/20 gap-2 sm:gap-0"
                        >
                          <FiEdit2 size={18} />
                          <span className="sm:hidden text-[10px] font-black uppercase">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(contest._id)}
                          className="flex-1 sm:w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20 gap-2 sm:gap-0"
                        >
                          <FiTrash2 size={18} />
                          <span className="sm:hidden text-[10px] font-black uppercase">Delete</span>
                        </button>
                      </div>
                      <button onClick={() => { setViewParticipantsContest(contest); setViewParticipantsOpen(true); }} className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#8cc63f] hover:bg-[#7eb533] text-white text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#8cc63f]/20 hover:shadow-xl active:scale-[0.98]"><FiUsers size={16} /> View Participants</button>
                    </div>
                  </div>
                </div>
              )))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 sm:gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 sm:p-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-[#fbc111] hover:border-[#fbc111] disabled:opacity-50 transition-all shadow-sm"
              >
                <FiChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all shadow-sm flex items-center justify-center ${currentPage === page
                        ? 'bg-[#8cc63f] text-white border-2 border-[#8cc63f] scale-[1.15]'
                        : 'bg-white dark:bg-gray-800 text-gray-500 border-2 border-gray-100 dark:border-gray-700 hover:border-[#8cc63f]/50 hover:text-[#8cc63f]'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-[#fbc111] hover:border-[#fbc111] disabled:opacity-50 transition-all shadow-sm"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </AdminLayout>

      {/* Report Modal */}
      <ContestListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        contests={modalContests}
        loading={modalLoading}
      />
    </>
  );
};

export default ManageContests;
