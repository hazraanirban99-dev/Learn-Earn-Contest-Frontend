import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import PageTransition from '../components/Common/PageTransition';
import { FiSearch, FiFilter, FiUser, FiGlobe, FiAward } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ParticipantCard = React.memo(({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8cc63f]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 p-[1px] shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#8cc63f]/10 text-[#5c8a14] font-black text-xl">
              {user.name?.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-gray-100 text-lg leading-tight group-hover:text-[#8cc63f] transition-colors">{user.name}</h3>
          <p className="text-[10px] font-black text-[#fbc111] uppercase tracking-[0.2em] mt-1">{user.domain || 'Scholar'}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between relative z-10">
         <div className="flex items-center gap-2">
            <FiGlobe className="text-gray-300" size={14} />
            <span className="text-[11px] font-bold text-gray-400 capitalize">{user.address?.split(',')?.pop()?.trim() || 'Global'}</span>
         </div>
         <div className="flex items-center gap-1 bg-[#8cc63f]/10 px-3 py-1 rounded-full">
            <FiAward className="text-[#8cc63f]" size={12} />
            <span className="text-[9px] font-black text-[#5c8a14] uppercase tracking-tighter">Verified</span>
         </div>
      </div>
    </div>
  );
});

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 12;

  const domains = ['All Domains', 'MERN', 'UI/UX', 'Digital Marketing'];
  const sentinelRef = useRef(null);

  const fetchParticipants = useCallback(async (page, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    if (isLoadMore) setLoadingMore(true);
    try {
      // Reuse the same endpoint but filtered for public view (only name/avatar/domain/city)
      const { data } = await api.get('/admin/users/students', {
        params: {
          page,
          limit: itemsPerPage,
          domain: selectedDomain === 'All Domains' ? '' : selectedDomain,
          query: searchQuery
        }
      });

      if (data.success) {
        const newParticipants = data.data.participants;
        if (isLoadMore) {
          setParticipants(prev => [...prev, ...newParticipants]);
        } else {
          setParticipants(newParticipants);
        }
        setHasMore(page < data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync participant gallery.");
    } finally {
      if (!isLoadMore) setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedDomain, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setHasMore(true);
      fetchParticipants(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedDomain, searchQuery, fetchParticipants]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchParticipants(nextPage, true);
      }
    }, { threshold: 0.1 });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, currentPage, fetchParticipants]);

  return (
    <div className="min-h-screen bg-[#f8faf2] dark:bg-gray-900 font-sans pt-32">
      <Navbar />
      <PageTransition>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
          
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.3em] block">Desun Scholars</span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-gray-100 tracking-tighter leading-none">
              The <span className="text-[#fbc111]">Champions</span> Gallery
            </h1>
            <p className="text-gray-400 font-bold text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
              Meet the bright minds shaping the future of technology through the Scholastic Atelier ecosystem.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
            <div className="relative w-full md:max-w-md">
               <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
               <input 
                 type="text" 
                 placeholder="Search scholars..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#8cc63f]/10 transition-all"
               />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {domains.map(domain => (
                 <button 
                   key={domain}
                   onClick={() => setSelectedDomain(domain)}
                   className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     selectedDomain === domain 
                     ? 'bg-[#8cc63f] text-white shadow-lg shadow-[#8cc63f]/20' 
                     : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                   }`}
                 >
                   {domain}
                 </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-24">
            {loading ? (
               [1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="bg-white dark:bg-gray-800 rounded-[32px] h-64 animate-pulse border border-gray-50 dark:border-gray-700"></div>
               ))
            ) : participants.length > 0 ? (
              participants.map((user, idx) => (
                <ParticipantCard key={user._id || idx} user={user} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                 <p className="text-gray-400 font-black uppercase tracking-widest italic">No scholars found in this circle.</p>
              </div>
            )}
          </div>

          <div ref={sentinelRef} className="h-10" />
          {loadingMore && (
            <div className="flex justify-center pb-20">
               <div className="w-8 h-8 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Participants;
