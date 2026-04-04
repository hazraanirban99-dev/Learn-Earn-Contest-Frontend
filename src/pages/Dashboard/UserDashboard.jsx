import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import Ratings from '../../components/Ratings/Ratings';
import { FiArrowRight } from 'react-icons/fi';
import { FaStar, FaShieldAlt, FaUsers, FaRocket } from 'react-icons/fa';

const UserDashboard = () => {
  const [heroContests, setHeroContests] = useState([]);
  const [popularContests, setPopularContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MOCK BACKEND DATA FETCHING ---
  // Replace this with actual backend API calls later.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulated network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Thumbnails coming from recently added backend contests
        const recentContests = [
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
        ];

        // Mock Popular Contests List
        const popContests = [
          {
            id: 1,
            title: "The Algorithmic Grand Prix 2024",
            desc: "Solve complex data structure problems in record time. Compete against top developers worldwide.",
            status: "ONGOING",
            statusColor: "text-emerald-500 bg-emerald-50",
            icon: "💻",
            dateInfo: "ENDS IN",
            dateValue: "02d : 14h : 45m"
          },
          {
            id: 2,
            title: "Digital Atelier Design Sprint",
            desc: "An intensive 48-hour challenge focusing on UI/UX Excellence and creative problem-solving.",
            status: "UPCOMING",
            statusColor: "text-blue-500 bg-blue-50",
            icon: "🎨",
            dateInfo: "STARTS ON",
            dateValue: "Oct 24, 2024"
          },
          {
            id: 3,
            title: "Architectural Visionary '24",
            desc: "Sustainable urban planning competition. Review the winning designs and community highlights.",
            status: "COMPLETED",
            statusColor: "text-gray-500 bg-gray-100",
            icon: "🏛️",
            dateInfo: "WINNER",
            dateValue: "Alex Rivera"
          }
        ];

        setHeroContests(recentContests);
        setPopularContests(popContests);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf2] font-sans selection:bg-[#8cc63f]/30">
      <UserNavbar />

      {/* --- HERO CAROUSEL SECTION --- */}
      <HeroCarousel contests={heroContests} loading={loading} showSearchBar={false} />

      {/* --- POPULAR CONTESTS SECTION --- */}
      <section className="py-12 px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto">
         <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Popular Contests</h2>
               <p className="text-gray-500 font-bold text-sm">Challenge your skills and win prestigious certifications.</p>
            </div>
            <Link to="/student/contests" className="text-[#5c8a14] hover:text-[#8cc63f] font-black text-sm transition-colors flex items-center gap-1 uppercase tracking-widest">
               View All Contests <FiArrowRight />
            </Link>
         </div>

         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
               {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-[40px] h-[350px]"></div>)}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {popularContests.map((contest, idx) => (
                  <div key={contest.id} className="bg-white p-8 pt-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#8cc63f]/5 transition-all flex flex-col h-full group relative overflow-hidden">
                     {/* Alternating Top Line */}
                     <div className={`absolute top-0 left-0 w-full h-2 ${idx % 2 === 0 ? 'bg-[#8cc63f]' : 'bg-[#fbc111]'}`}></div>
                     
                     {/* Card Header (Icon & Tag) */}
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-[#f8faf2] rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50">
                           {contest.icon}
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 ${contest.statusColor}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${contest.status === 'ONGOING' ? 'bg-emerald-500 animate-pulse' : contest.status === 'UPCOMING' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                           {contest.status}
                        </span>
                     </div>
                     
                     {/* Card Body */}
                     <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-[#5c8a14] transition-colors line-clamp-2">
                           {contest.title}
                        </h3>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed line-clamp-3">
                           {contest.desc}
                        </p>
                     </div>

                     {/* Card Footer (Date/Winner & CTA) */}
                     <div className="mt-8 pt-6 border-t border-gray-50 flex items-end justify-between">
                        <div>
                           <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">{contest.dateInfo}</p>
                           <p className="text-sm font-black text-slate-800">{contest.dateValue}</p>
                        </div>
                        <button className="bg-[#fbc111]/10 hover:bg-[#fbc111] text-[#d4a017] hover:text-slate-900 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all">
                           View Details
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </section>

      {/* --- THE DESUN ADVANTAGE SECTION --- */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
         <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
               
               {/* Left Text Block */}
               <div className="lg:col-span-5 pr-0 lg:pr-8">
                  <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">The Desun Advantage</span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1] mb-6">
                     Crafting the next generation of <br/> <span className="text-[#5c8a14]">Master Thinkers</span>
                  </h2>
                  <p className="text-gray-500 font-bold text-sm md:text-base leading-relaxed mb-10 max-w-md">
                     Our atelier approach combines academic rigor with professional mentorship, creating a unique environment where theory meets execution.
                  </p>
                  

               </div>

               {/* Right Grids Block */}
               <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full relative">
                  {/* Decorative background blur */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fbc111]/10 rounded-full blur-3xl -z-10"></div>
                  
                  {/* Grid Layout mimicking the image */}
                  <div className="space-y-6 sm:mt-12">
                     <div className="bg-[#f8faf2] p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-[#8cc63f]/10 group">
                        <FaStar className="text-2xl text-[#8cc63f] mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-black text-slate-900 mb-2">Expert Mentors</h4>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">Learn directly from industry giants and academic veterans.</p>
                     </div>
                     <div className="bg-[#fbc111] p-8 rounded-[40px] shadow-lg shadow-[#fbc111]/20 hover:-translate-y-1 transition-all group">
                        <FaUsers className="text-2xl text-slate-800 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-black text-slate-900 mb-2">Peer Network</h4>
                        <p className="text-xs font-bold text-slate-800/80 leading-relaxed">Collaborate with the brightest minds in our exclusive circles.</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-[#4a7010] p-8 rounded-[40px] shadow-xl text-white hover:-translate-y-1 transition-all relative overflow-hidden group">
                        {/* Decorative circle */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <FaShieldAlt className="text-2xl text-white mb-6 animate-pulse relative z-10" />
                        <h4 className="text-lg font-black text-white mb-2 relative z-10">Global Certs</h4>
                        <p className="text-xs font-bold text-white/80 leading-relaxed relative z-10">Get accredited by leading institutions across the globe.</p>
                     </div>
                     <div className="bg-[#f8faf2] p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-[#8cc63f]/10 group">
                        <FaRocket className="text-2xl text-[#c73ea8] mb-6 group-hover:-translate-y-1 transition-transform" />
                        <h4 className="text-lg font-black text-slate-900 mb-2">Career Launch</h4>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">Accelerate your professional journey with our talent pipeline.</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      <Ratings />

      <Footer />
    </div>
  );
};

export default UserDashboard;
