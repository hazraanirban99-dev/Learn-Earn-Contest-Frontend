import React, { useState, useEffect } from 'react';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ContestCard from '../../components/Cards/ContestCard';
import { FiSearch, FiCode, FiLayout, FiTrendingUp, FiFilter, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AllContests = () => {
   const [loading, setLoading] = useState(true);
   const [allContests, setAllContests] = useState([]);
   const [carouselData, setCarouselData] = useState([]);

   // Filter states & Infinite Scroll
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedDomains, setSelectedDomains] = useState([]);
   const [selectedStatuses, setSelectedStatuses] = useState([]);
   const [visibleCount, setVisibleCount] = useState(6);

   // Infinite Scroll Listener
   useEffect(() => {
      const handleScroll = () => {
         // Check if user scrolled near the bottom of the page
         if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
            setVisibleCount(prev => prev + 6);
         }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   useEffect(() => {
      // Mock Fetching Data
      const fetchData = async () => {
         setLoading(true);
         try {
            await new Promise(res => setTimeout(res, 800));

            // Carousel 3 slides for this page to EXACTLY match dashboard
            setCarouselData([
               {
                  id: 101,
                  title: "Master the Art of Innovation",
                  subtitle: "Join a community of elite scholars and creators at Desun Academy. Transform your potential into mastery.",
                  thumbnailUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=1470&auto=format&fit=crop",
                  tag: "Enrolling Now",
                  buttonText: "Explore Programs"
               },
               {
                  id: 102,
                  title: "Global Code Sprint",
                  subtitle: "Compete globally in real-time algorithm challenges and win exclusive networking opportunities.",
                  thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop",
                  tag: "Enrolling Now",
                  buttonText: "Explore Programs"
               },
               {
                  id: 103,
                  title: "UX/UI Atelier Challenge",
                  subtitle: "Design the future interfaces of web3. Collaborative design sprints with industry veterans.",
                  thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1400&auto=format&fit=crop",
                  tag: "Enrolling Now",
                  buttonText: "Explore Programs"
               }
            ]);

            // Contest Data
            const baseContests = [
               {
                  id: 1,
                  title: "Algorithmic Odyssey",
                  desc: "Master complex data structures and solve real-world efficiency problems in this 48-hour sprint.",
                  domain: "Development",
                  status: "ONGOING",
                  icon: <FiCode />,
                  dateInfo: "ENDS IN",
                  dateValue: "12h"
               },
               {
                  id: 2,
                  title: "Python Pro Challenge",
                  desc: "A deep dive into backend optimization and clean code practices using Python frameworks.",
                  domain: "Development",
                  status: "UPCOMING",
                  icon: <FiCode />
               },
               {
                  id: 3,
                  title: "Visual Storytelling",
                  desc: "A design challenge focused on minimalist composition and emotional color theory application.",
                  domain: "UI/UX",
                  status: "ONGOING",
                  icon: <FiLayout />
               },
               {
                  id: 4,
                  title: "Accessibility Masterclass",
                  desc: "Designing inclusive interfaces that cater to users with diverse functional needs.",
                  domain: "UI/UX",
                  status: "UPCOMING",
                  icon: <FiLayout />
               },
               {
                  id: 5,
                  title: "Growth Hacking Summit",
                  desc: "Strategic campaign planning and data-driven optimization for scaling startups.",
                  domain: "Marketing",
                  status: "UPCOMING",
                  icon: <FiTrendingUp />
               },
               {
                  id: 6,
                  title: "SEO Performance Blast",
                  desc: "Master technical SEO and content clustering to dominate search engine results.",
                  domain: "Marketing",
                  status: "ONGOING",
                  icon: <FiTrendingUp />
               }
            ];

            // Duplicating base contests to provide enough data for infinite scrolling demo
            const expandedContests = [];
            for (let i = 0; i < 6; i++) {
               baseContests.forEach(bc => expandedContests.push({ ...bc, id: `${bc.id}-${i}` }));
            }

            setAllContests(expandedContests);

         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const domains = ['Development', 'UI/UX', 'Marketing'];
   const statuses = ['Ongoing', 'Upcoming', 'Completed'];

   const toggleFilter = (type, value) => {
      if (type === 'domain') {
         setSelectedDomains(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      } else {
         setSelectedStatuses(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      }
   };

   // Filter Logic
   const filteredContests = allContests.filter(contest => {
      const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         contest.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const domainMatch = selectedDomains.length === 0 || selectedDomains.includes(contest.domain);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(contest.status.charAt(0) + contest.status.slice(1).toLowerCase());
      return matchesSearch && domainMatch && statusMatch;
   });

   // Infinite scroll slice before grouping
   const visibleContests = filteredContests.slice(0, visibleCount);

   // Grouping Logic
   const groupedContests = domains.reduce((acc, domain) => {
      const contestsInDomain = visibleContests.filter(c => c.domain === domain);
      if (contestsInDomain.length > 0) acc[domain] = contestsInDomain;
      return acc;
   }, {});

   const getDomainColor = (domain) => {
      switch (domain) {
         case 'Development': return 'text-[#8cc63f]';
         case 'UI/UX': return 'text-[#3f8cc6]';
         case 'Marketing': return 'text-[#fbc111]';
         default: return 'text-gray-400';
      }
   };

   const getDomainIcon = (domain) => {
      switch (domain) {
         case 'Development': return <FiGlobe size={24} />;
         case 'UI/UX': return <FiLayout size={24} />;
         case 'Marketing': return <FiTrendingUp size={24} />;
         default: return <FiGlobe size={24} />;
      }
   };

   return (
      <div className="min-h-screen bg-[#f8faf2] font-sans">
         <UserNavbar />

         {/* Hero Carousel */}
         <HeroCarousel contests={carouselData} loading={loading} />

         {/* Search Bar (Below Carousel) */}
         <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mt-8">
            <div className="bg-white p-2 rounded-full shadow-lg border border-[#fbc111]/40 flex items-center max-w-2xl mx-auto">
               <div className="pl-6 pr-4 text-[#8cc63f]">
                  <FiSearch size={20} />
               </div>
               <input
                  type="text"
                  placeholder="Search contests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-gray-400 font-bold py-4"
               />
            </div>
         </div>

         <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 py-16 flex flex-col lg:flex-row gap-12">

            {/* LEFT SIDEBAR - FILTERS */}
            <aside className="w-full lg:w-64 shrink-0 space-y-8">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <FiFilter className="text-[#8cc63f]" size={18} /> Domain
                  </h3>
                  <div className="space-y-3">
                     {domains.map(domain => (
                        <label key={domain} onClick={() => toggleFilter('domain', domain)} className="flex items-center gap-3 cursor-pointer group">
                           <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedDomains.includes(domain) ? 'bg-[#8cc63f] border-[#8cc63f]' : 'border-gray-200 group-hover:border-[#8cc63f]'
                              }`}>
                              {selectedDomains.includes(domain) && (
                                 <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              )}
                           </div>
                           <span className={`text-sm font-bold ${selectedDomains.includes(domain) ? 'text-slate-800' : 'text-gray-500'}`}>{domain}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <FiFilter className="text-[#fbc111]" size={18} /> Status
                  </h3>
                  <div className="space-y-3">
                     {statuses.map(status => (
                        <label key={status} onClick={() => toggleFilter('status', status)} className="flex items-center gap-3 cursor-pointer group">
                           <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedStatuses.includes(status) ? 'bg-[#8cc63f] border-[#8cc63f]' : 'border-gray-200 group-hover:border-[#8cc63f]'
                              }`}>
                              {selectedStatuses.includes(status) && (
                                 <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              )}
                           </div>
                           <span className={`text-sm font-bold ${selectedStatuses.includes(status) ? 'text-slate-800' : 'text-gray-500'}`}>{status}</span>
                        </label>
                     ))}
                  </div>
               </div>
            </aside>

            {/* RIGHT CONTENT - GRID LISTINGS */}
            <div className="flex-1 space-y-16">
               {loading ? (
                  <div className="space-y-12">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                           <div className="w-48 h-6 bg-gray-200 rounded mb-6"></div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-64 bg-white rounded-[40px]"></div><div className="h-64 bg-white rounded-[40px]"></div></div>
                        </div>
                     ))}
                  </div>
               ) : Object.keys(groupedContests).length === 0 ? (
                  <div className="text-center py-20">
                     <div className="text-6xl mb-4">🔍</div>
                     <h3 className="text-2xl font-black text-slate-800 mb-2">No contests found</h3>
                     <p className="text-gray-500 font-bold">Try adjusting your filters to find what you're looking for.</p>
                  </div>
               ) : (
                  Object.entries(groupedContests).map(([domain, contests]) => (
                     <div key={domain}>
                     
                     <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-8">
                        <span className={getDomainColor(domain)}>
                           {getDomainIcon(domain)}
                        </span>
                        {domain}
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

         <Footer />
      </div>
   );
};

export default AllContests;
