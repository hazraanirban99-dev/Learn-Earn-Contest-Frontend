import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import EditContestModal from '../../components/Admin/EditContestModal';
import { 
  FiUsers, FiClipboard, FiCheckCircle, 
  FiCalendar, FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

const ManageContests = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [loading, setLoading] = useState(true);

  // =========================================================================
  // 🚀 BACKEND API INTEGRATION: FETCH CONTESTS
  // =========================================================================
  // You will replace this mock state with an empty array `[]`
  // and populate it from the backend via useEffect.
  const [contests, setContests] = useState([
    {
      id: 1,
      status: 'ONGOING',
      category: 'UI/UX DESIGN',
      title: 'The Future of EdTech Mobile Design',
      dateInfo: 'Oct 12 - Nov 05, 2023',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      participants: 124,
    },
    {
      id: 2,
      status: 'UPCOMING',
      category: 'FULLSTACK DEVELOPMENT',
      title: 'Sustainable Energy Analytics Hackathon',
      dateInfo: 'Nov 15 - Dec 10, 2023',
      subInfo: 'Registrations open in 3 days',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      participants: 0,
    },
    {
      id: 3,
      status: 'COMPLETED',
      category: 'GROWTH MARKETING',
      title: 'Viral Education Strategy 2023',
      dateInfo: 'Sept 01 - Sept 30, 2023',
      subInfo: 'Winners Declared',
      isWinnerDeclared: true,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      participants: 450,
    }
  ]);

  const [stats, setStats] = useState({
    active: 12,
    participants: 1402,
    upcoming: 4,
    completion: '88%'
  });

  // =========================================================================
  /*
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('http://YOUR_BACKEND_URL/api/v1/contests');
        const data = await response.json();
        
        if (response.ok) {
          setContests(data.contests);
          setStats(data.stats); // If stats come from backend
        } else {
          console.error("Failed to load contests:", data.message);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);
  */
  // =========================================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    
    // =========================================================================
    // 🚀 BACKEND API INTEGRATION: DELETE CONTEST
    // =========================================================================
    /*
    try {
      const response = await fetch(`http://YOUR_BACKEND_URL/api/v1/contests/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setContests(prev => prev.filter(c => c.id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("API error:", error);
    }
    */
    // =========================================================================
    
    // MOCK DELETE:
    setContests(prev => prev.filter(c => c.id !== id));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ONGOING': return 'bg-[#8cc63f] text-white';
      case 'UPCOMING': return 'bg-[#fbc111] text-white';
      case 'COMPLETED': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

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
          }} 
        />
      )}
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <h4 className="text-[#fbc111] text-[10px] sm:text-[12px] font-black tracking-[0.2em] uppercase">Academic Registry</h4>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Scholastic <span className="text-[#8cc63f]">Contests</span>
            </h1>
            <div className="border-l-4 border-[#fbc111] pl-4 sm:pl-6 py-1 bg-yellow-50/50 rounded-r-xl max-w-xl mt-4">
              <p className="text-gray-600 font-bold text-sm sm:text-base leading-relaxed opacity-90">
                Manage and curate high-stakes academic challenges. Monitor engagement levels and academic integrity across various artistic and technical domains.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/admin/contests/create')}
            className="shrink-0 bg-[#bdcc16] hover:bg-[#a6b50e] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <FiPlus size={20} strokeWidth={3} />
            Create New Contest
          </button>
        </div>

        {/* --- Stat Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {[
            { icon: FaTrophy, val: stats.active, label: 'ACTIVE CONTESTS', color: 'text-[#8cc63f]' },
            { icon: FiUsers, val: stats.participants, label: 'TOTAL PARTICIPANTS', color: 'text-purple-500' },
            { icon: FiClipboard, val: stats.upcoming, label: 'UPCOMING LAUNCH', color: 'text-[#fbc111]' },
            { icon: FiCheckCircle, val: stats.completion, label: 'COMPLETION RATE', color: 'text-emerald-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-6`} strokeWidth={2.5} />
              <div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.val}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Contests List --- */}
        <div className="space-y-6 mt-4">
          {contests.map((contest) => (
            <div key={contest.id} className="bg-white p-4 sm:p-6 rounded-[32px] sm:rounded-[40px] shadow-sm hover:shadow-lg transition-all flex flex-col lg:flex-row gap-6 sm:gap-8 group border border-transparent hover:border-gray-50">
              
              {/* Image Section */}
              <div className="relative w-full lg:w-[360px] h-48 sm:h-[220px] rounded-[24px] overflow-hidden shrink-0">
                <img 
                  src={contest.image} 
                  alt={contest.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                <div className="absolute top-4 left-4">
                  <span className={`${getStatusColor(contest.status)} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-2`}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    {contest.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-center py-2 relative">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h5 className="text-[#fbc111] font-black text-[10px] uppercase tracking-widest mb-3">
                      {contest.category}
                    </h5>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-xl">
                      {contest.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-xl shrink-0 h-fit">
                    <FiCalendar size={14} className="text-gray-400" />
                    <span className="text-[12px] font-bold">{contest.dateInfo}</span>
                  </div>
                </div>

                {contest.subInfo && (
                  <div className="mb-6 flex items-center gap-3">
                    {contest.isWinnerDeclared ? (
                      <div className="flex items-center gap-2 text-[#8cc63f] font-bold text-sm bg-[#8cc63f]/10 px-4 py-2 rounded-xl">
                        <FaTrophy size={16} /> Winners Declared
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-sm border border-gray-100 px-4 py-2 rounded-xl">
                        <FiUsers size={16} className="text-[#fbc111]" /> {contest.subInfo}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  {/* Right Bottom - Actions */}
                  <button 
                    onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('edit', contest.id);
                        setSearchParams(newParams);
                    }}
                    className="flex-1 sm:flex-none w-full sm:w-11 h-11 rounded-xl bg-gray-50 hover:bg-[#f1f8e8] text-gray-400 hover:text-[#8cc63f] flex items-center justify-center transition-colors shadow-sm"
                    title="Edit Contest"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(contest.id)}
                    className="flex-1 sm:flex-none w-full sm:w-11 h-11 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
                    title="Delete Contest"
                  >
                    <FiTrash2 size={18} />
                  </button>
                  
                  <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8cc63f] hover:bg-[#7eb533] text-white text-[12px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md">
                      <FiUsers size={16} /> View All Enrolled Participants
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* --- Pagination --- */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
           <button 
             onClick={() => console.log("Previous Page")}
             className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border-2 border-transparent hover:border-gray-100 flex items-center justify-center text-gray-400 transition-all cursor-pointer shadow-sm"
           >
             <FiChevronLeft size={20} />
           </button>
           {[1, 2, 3, '...', 12].map((page, i) => (
             <button 
               key={i}
               onClick={() => typeof page === 'number' && console.log(`Go to page ${page}`)}
               className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer ${
                 page === 1 
                  ? 'bg-[#8cc63f] text-white shadow-lg shadow-[#8cc63f]/30 ring-2 ring-[#8cc63f]/20' 
                  : 'bg-transparent text-gray-500 hover:bg-white hover:shadow-sm'
               } ${typeof page !== 'number' ? 'cursor-default hover:bg-transparent hover:shadow-none' : ''}`}
             >
               {page}
             </button>
           ))}
           <button 
             onClick={() => console.log("Next Page")}
             className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border-2 border-transparent hover:border-gray-100 flex items-center justify-center text-gray-400 transition-all cursor-pointer shadow-sm"
           >
             <FiChevronRight size={20} />
           </button>
        </div>

      </div>
    </AdminLayout>
    </>
  );
};

export default ManageContests;
