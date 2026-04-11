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

const ManageContests = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [loading, setLoading] = useState(true);
  const [viewParticipantsOpen, setViewParticipantsOpen] = useState(false);
  const [viewParticipantsContest, setViewParticipantsContest] = useState(null);

  const [contests, setContests] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0
  });

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
        <p className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tight">Delete this contest?</p>
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
    switch(status) {
      case 'ONGOING': return 'bg-[#8cc63f] text-white';
      case 'UPCOMING': return 'bg-[#fbc111] text-white';
      case 'COMPLETED': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  }, []);

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

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
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Scholastic <span className="text-[#8cc63f]">Contests</span></h1>
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
          />
          <StatCard 
            title="UPCOMING CONTESTS" 
            value={stats.upcoming.toString()} 
            icon={FiCalendar} 
            color="bg-blue-50" 
            accentColor="text-blue-500" 
            trend="SCHEDULED" 
          />
          <StatCard 
            title="COMPLETED CONTESTS" 
            value={stats.completed.toString()} 
            icon={FaTrophy} 
            color="bg-green-50" 
            accentColor="text-green-600" 
            trend="ARCHIVED" 
          />
        </div>

        <div className="space-y-6 mt-4">
          {contests.map((contest) => (
            <div key={contest._id} className="bg-white p-6 rounded-[40px] shadow-sm hover:shadow-lg transition-all flex flex-col lg:flex-row gap-8 group">
              <div className="relative w-full lg:w-[360px] h-[220px] rounded-[24px] overflow-hidden shrink-0">
                <img src={contest.thumbnail.url} alt={contest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4"><span className={`${getStatusColor(contest.status)} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md`}>{contest.status}</span></div>
              </div>

              <div className="flex-1 flex flex-col justify-center py-2 relative">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h5 className="text-[#fbc111] font-black text-[10px] uppercase tracking-widest mb-3">{contest.domain}</h5>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{contest.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[#a68945] bg-[#fcf3d9]/50 border border-[#fbc111]/20 px-4 py-2 rounded-2xl h-fit shadow-sm backdrop-blur-sm">
                    <FiCalendar size={14} className="text-[#fbc111]" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Deadline: {formatDateDDMMYYYY(contest.endDate)}</span>
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

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => { const newParams = new URLSearchParams(searchParams); newParams.set('edit', contest._id); setSearchParams(newParams); }} 
                      className="flex-1 sm:w-11 h-11 rounded-xl bg-gray-50 hover:bg-[#f1f8e8] text-gray-400 hover:text-[#8cc63f] flex items-center justify-center transition-all border border-transparent hover:border-[#8cc63f]/20 gap-2 sm:gap-0"
                    >
                      <FiEdit2 size={18} />
                      <span className="sm:hidden text-[10px] font-black uppercase">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(contest._id)} 
                      className="flex-1 sm:w-11 h-11 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20 gap-2 sm:gap-0"
                    >
                      <FiTrash2 size={18} />
                      <span className="sm:hidden text-[10px] font-black uppercase">Delete</span>
                    </button>
                  </div>
                  <button onClick={() => { setViewParticipantsContest(contest); setViewParticipantsOpen(true); }} className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#8cc63f] hover:bg-[#7eb533] text-white text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#8cc63f]/20 hover:shadow-xl active:scale-[0.98]"><FiUsers size={16} /> View Participants</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
    </>
  );
};

export default ManageContests;
