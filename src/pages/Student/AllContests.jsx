// ============================================================
// AllContests.jsx — Student er sob contest dekhার page
// Backend theke sob contest fetch hoy ekhane.
// Domain filter (MERN, UI/UX etc) diye filter korte para jay.
// Search bar e contest title diye khuja jay.
// ContestCard component diye prottekta contest dekhano hoy.
// Card e click korle ContestDetails page e navigate hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ContestCard from '../../components/Cards/ContestCard';
import { toast } from 'react-toastify';
import PageTransition from '../../components/Common/PageTransition';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiCode, FiLayout, FiTrendingUp, FiFilter, FiGlobe, FiCheckCircle, FiPlusCircle } from 'react-icons/fi';

const AllContests = () => {
   const [loading, setLoading] = useState(true);
   const [allContests, setAllContests] = useState([]);
   const [carouselData, setCarouselData] = useState([]);

   // Filter states & Infinite Scroll
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedDomains, setSelectedDomains] = useState([]);
   const [selectedStatuses, setSelectedStatuses] = useState([]);
   const [selectedEnrollment, setSelectedEnrollment] = useState([]);
   const [visibleCount, setVisibleCount] = useState(6);

   // Mobile Dropdown states
   const [isDomainOpen, setIsDomainOpen] = useState(false);
   const [isStatusOpen, setIsStatusOpen] = useState(false);
   const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
   const domainRef = React.useRef(null);
   const statusRef = React.useRef(null);
   const enrollmentRef = React.useRef(null);
   
   const { user } = useAuth();

   // Logic: Only enable infinite scroll when filters are active
   const isFilterActive = searchQuery.trim() !== '' || selectedDomains.length > 0 || selectedStatuses.length > 0 || selectedEnrollment.length > 0;

   // Infinite Scroll Listener
   useEffect(() => {
      if (!isFilterActive) {
         setVisibleCount(6);
         return;
      }

      const handleScroll = () => {
         if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
            setVisibleCount(prev => prev + 6);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [isFilterActive]);

   // Click away for dropdowns
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (domainRef.current && !domainRef.current.contains(event.target)) setIsDomainOpen(false);
         if (statusRef.current && !statusRef.current.contains(event.target)) setIsStatusOpen(false);
         if (enrollmentRef.current && !enrollmentRef.current.contains(event.target)) setIsEnrollmentOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   useEffect(() => {
      // Backend theke data fetch korar logic
      const fetchAllData = async () => {
         setLoading(true);
         try {
            // Fetch All Contests Data first
            const contestsRes = await api.get('/contests');
            if (contestsRes.data.success) {
               const allData = contestsRes.data.data;

               // 1. Carousel Data (Latest 5 UPCOMING)
               const upcomingContests = allData
                  .filter(c => c.status === 'UPCOMING')
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
               
               const mappedCarousel = upcomingContests.slice(0, 5).map(c => ({
                  id: c._id,
                  title: c.title,
                  subtitle: c.description.substring(0, 100) + "...",
                  thumbnailUrl: c.thumbnail?.url,
                  tag: "Coming Soon",
                  buttonText: "Join Contest"
               }));
               setCarouselData(mappedCarousel);

               // 2. All Contests List Data
               const domainMap = {
                  'MERN': 'MERN',
                  'UIUX': 'UI/UX',
                  'DIGITAL MARKETING': 'Digital Marketing',
                  'Development': 'MERN'
               };

               const mappedContests = allData.map(c => ({
                  id: c._id,
                  title: c.title,
                  desc: c.description,
                  domain: domainMap[c.domain] || c.domain || 'General',
                  status: c.status,
                  prize: c.cashPrize && c.cashPrize > 0 ? `₹${c.cashPrize}` : null,
                  dateInfo: c.status === 'ONGOING' ? "ENDS SOON" : c.status === 'UPCOMING' ? "STARTS" : "COMPLETED ON",
                  dateValue: formatDateDDMMYYYY(c.endDate),
                  thumbnail: c.thumbnail?.url || null,
                  winnerName: c.isWinnerDeclared ? (c.winner?.name || "TBA") : null,
                  participantsCount: c.participantsCount || 0,
                  projectType: c.projectType,
                  minTeamSize: c.minTeamSize,
                  maxTeamSize: c.maxTeamSize
               }));
               setAllContests(mappedContests);
            }
         } catch (err) {
            console.error(err);
            toast.error("Failed to load contests from server.");
         } finally {
            setLoading(false);
         }
      };

      fetchAllData();
   }, []);

   const domains = ['MERN', 'UI/UX', 'Digital Marketing'];
   const statuses = ['Ongoing', 'Upcoming', 'Completed'];
   const enrollmentOptions = ['Applied', 'Not Applied'];

   const toggleFilter = React.useCallback((type, value) => {
      if (type === 'domain') {
         setSelectedDomains(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      } else if (type === 'status') {
         setSelectedStatuses(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      } else {
         setSelectedEnrollment(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      }
   }, []);

   const filteredContests = React.useMemo(() => {
      return allContests.filter(contest => {
         const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contest.desc.toLowerCase().includes(searchQuery.toLowerCase());
         const domainMatch = selectedDomains.length === 0 || selectedDomains.includes(contest.domain);
         
         // Map backend status to filter status label
         const displayStatus = contest.status.charAt(0) + contest.status.slice(1).toLowerCase();
         const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(displayStatus);
         
         // Participation Check
         const isEnrolled = user?.enrolledContests?.some(enId => enId.toString() === contest.id.toString());
         const enrollmentMatch = selectedEnrollment.length === 0 || 
            (selectedEnrollment.includes('Applied') && isEnrolled) ||
            (selectedEnrollment.includes('Not Applied') && !isEnrolled);
         
         return matchesSearch && domainMatch && statusMatch && enrollmentMatch;
      });
   }, [allContests, searchQuery, selectedDomains, selectedStatuses, selectedEnrollment, user]);

   // Reset Scroll to Top when filters change to prevent "jump to footer"
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }, [selectedDomains, selectedStatuses, selectedEnrollment]);

   const visibleContests = React.useMemo(() => {
      return filteredContests.slice(0, visibleCount);
   }, [filteredContests, visibleCount]);

   const groupedContests = React.useMemo(() => {
      if (!isFilterActive) {
         // DEFAULT VIEW: Show 4 contests each for every domain (Ongoing + Upcoming)
         return domains.reduce((acc, domain) => {
            const contestsInDomain = allContests
               .filter(c => c.domain === domain && (c.status === 'ONGOING' || c.status === 'UPCOMING'))
               .slice(0, 4);
            if (contestsInDomain.length > 0) acc[domain] = contestsInDomain;
            return acc;
         }, {});
      } else {
         // FILTERED VIEW: Regular sequential grouping by domain headers
         return domains.reduce((acc, domain) => {
            const contestsInDomain = visibleContests.filter(c => c.domain === domain);
            if (contestsInDomain.length > 0) acc[domain] = contestsInDomain;
            return acc;
         }, {});
      }
   }, [allContests, visibleContests, domains, isFilterActive]);

   const getDomainColor = React.useCallback((domain) => {
      switch (domain) {
         case 'MERN': return 'text-[#8cc63f]';
         case 'UI/UX': return 'text-[#3f8cc6]';
         case 'Digital Marketing': return 'text-[#fbc111]';
         default: return 'text-gray-400';
      }
   }, []);

   const getDomainIcon = React.useCallback((domain) => {
      switch (domain) {
         case 'MERN': 
         case 'Web Development': return <FiGlobe size={24} />;
         case 'UI/UX': 
         case 'UIUX': return <FiLayout size={24} />;
         case 'Digital Marketing': 
         case 'DIGITAL MARKETING': return <FiTrendingUp size={24} />;
         default: return <FiGlobe size={24} />;
      }
   }, []);

   const FilterSection = ({ type, data, selected, toggle }) => (
      <div className="space-y-3">
         {data.map(val => (
            <div key={val} onClick={() => toggle(type, val)} className="flex items-center gap-3 cursor-pointer group select-none">
               <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selected.includes(val) ? 'bg-[#8cc63f] border-[#8cc63f]' : 'border-gray-200 dark:border-gray-700 group-hover:border-[#8cc63f]'}`}>
                  {selected.includes(val) && (
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
               </div>
               <span className={`text-sm font-bold truncate ${selected.includes(val) ? 'text-slate-800 dark:text-gray-100' : 'text-gray-500 group-hover:text-slate-700'}`}>{val}</span>
            </div>
         ))}
      </div>
   );

   return (
      <div className="min-h-screen bg-[#f8faf2] dark:bg-gray-900 font-sans pt-20">
         <Navbar />
         <PageTransition>
            <HeroCarousel contests={carouselData} loading={loading} />
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mt-8">
               <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-[#fbc111]/40 flex items-center max-w-2xl mx-auto">
                  <div className="pl-6 pr-4 text-[#8cc63f]">
                     <FiSearch size={20} />
                  </div>
                  <input
                     type="text"
                     placeholder="Search contests..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-bold py-4"
                  />
               </div>
            </div>

            {/* MOBILE VIEW FILTER BAR (Visible only on mobile/tablet) */}
            <div className="lg:hidden max-w-[1440px] mx-auto px-4 mt-6 grid grid-cols-3 gap-2 pb-2 relative z-50">
               {/* Domain Dropdown */}
               <div className="relative" ref={domainRef}>
                  <button 
                     onClick={() => setIsDomainOpen(!isDomainOpen)}
                     className={`w-full flex items-center justify-center gap-2 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${selectedDomains.length > 0 ? 'bg-[#8cc63f] border-[#8cc63f] text-white shadow-lg shadow-[#8cc63f]/20' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-600 text-slate-800 dark:text-gray-200'}`}
                  >
                     <FiFilter size={14} className="shrink-0" />
                     <span className="truncate">Domain {selectedDomains.length > 0 && `(${selectedDomains.length})`}</span>
                  </button>
                  {isDomainOpen && (
                     <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-50 dark:border-gray-700 p-4 z-[50] animate-in fade-in zoom-in-95 duration-200">
                        <FilterSection type="domain" data={domains} selected={selectedDomains} toggle={toggleFilter} />
                     </div>
                  )}
               </div>

               {/* Status Dropdown */}
               <div className="relative" ref={statusRef}>
                  <button 
                      onClick={() => setIsStatusOpen(!isStatusOpen)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${selectedStatuses.length > 0 ? 'bg-[#fbc111] border-[#fbc111] text-slate-900 dark:text-gray-100 shadow-lg shadow-[#fbc111]/20' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-600 text-slate-800 dark:text-gray-200'}`}
                  >
                     <FiTrendingUp size={14} className="shrink-0" />
                     <span className="truncate">Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}</span>
                  </button>
                  {isStatusOpen && (
                     <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-50 dark:border-gray-700 p-4 z-[50] animate-in fade-in zoom-in-95 duration-200">
                        <FilterSection type="status" data={statuses} selected={selectedStatuses} toggle={toggleFilter} />
                     </div>
                  )}
               </div>

               {/* Participation Dropdown */}
               <div className="relative" ref={enrollmentRef}>
                  <button 
                      onClick={() => setIsEnrollmentOpen(!isEnrollmentOpen)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${selectedEnrollment.length > 0 ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-600 text-slate-800 dark:text-gray-200'}`}
                  >
                     <FiCheckCircle size={14} className="shrink-0" />
                     <span className="truncate">My Status {selectedEnrollment.length > 0 && `(${selectedEnrollment.length})`}</span>
                  </button>
                  {isEnrollmentOpen && (
                     <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-50 dark:border-gray-700 p-4 z-[50] animate-in fade-in zoom-in-95 duration-200">
                        <FilterSection type="participation" data={enrollmentOptions} selected={selectedEnrollment} toggle={toggleFilter} />
                     </div>
                  )}
               </div>
            </div>

            <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 py-12 lg:py-16 flex flex-col lg:flex-row gap-12">
               {/* DESKTOP SIDEBAR (Visible only on large screens) */}
               <aside className="hidden lg:block w-64 shrink-0 space-y-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                     <h3 className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FiFilter className="text-[#8cc63f]" size={18} /> Domain
                     </h3>
                     <FilterSection type="domain" data={domains} selected={selectedDomains} toggle={toggleFilter} />
                     
                     <div className="my-8 border-t border-gray-50 dark:border-gray-700"></div>

                     <h3 className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FiTrendingUp className="text-[#fbc111]" size={18} /> Status
                     </h3>
                     <FilterSection type="status" data={statuses} selected={selectedStatuses} toggle={toggleFilter} />

                     <div className="my-8 border-t border-gray-50 dark:border-gray-700"></div>

                     <h3 className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FiCheckCircle className="text-indigo-500" size={18} /> Participation
                     </h3>
                     <FilterSection type="participation" data={enrollmentOptions} selected={selectedEnrollment} toggle={toggleFilter} />
                  </div>
               </aside>
               <div className="flex-1 space-y-16">
                  {loading ? (
                     <div className="space-y-12">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="animate-pulse">
                              <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="h-64 bg-white dark:bg-gray-800 rounded-[40px]"></div>
                                 <div className="h-64 bg-white dark:bg-gray-800 rounded-[40px]"></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : Object.keys(groupedContests).length === 0 ? (
                     <div className="text-center py-20"><h3 className="text-2xl font-black text-slate-800 dark:text-gray-100 mb-2">No contests found</h3></div>
                  ) : (
                     Object.entries(groupedContests).map(([domain, contests]) => (
                        <div key={domain}>
                           <h2 className="text-2xl font-black text-slate-800 dark:text-gray-100 tracking-tight flex items-center gap-3 mb-8">
                              <span className={getDomainColor(domain)}>{getDomainIcon(domain)}</span>{domain}
                           </h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {contests.map((contest, idx) => (
                                 <ContestCard key={contest.id} contest={contest} index={idx} variant="full" />
                              ))}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </section>
         </PageTransition>
         <Footer />
      </div>
   );
};

export default AllContests;
