// ============================================================
// StudentDashboard.jsx — Student er main landing page (after login)
// Ekhane Hero Carousel, Popular Contests, Ratings section dekhano hoy.
// Backend theke UPCOMING contests fetch kore hero carousel e rakha hoy (max 5).
// ONGOING contests fetch kore "Popular Contests" section e rakha hoy (max 3).
// Contest card e click korle ContestDetails page e navigate hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ContestCard from '../../components/Cards/ContestCard';
import Ratings from '../../components/Ratings/Ratings';
import { FiArrowRight } from 'react-icons/fi';
import { FaStar, FaShieldAlt, FaUsers, FaRocket } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import PageTransition from '../../components/Common/PageTransition';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';

const StudentDashboard = () => {
  const [heroContests, setHeroContests] = useState([]);
  const [popularContests, setPopularContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend theke data fetch korar logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Upcoming Contests (Hero)
        const contestsRes = await api.get('/contests');
        if (contestsRes.data.success) {
           const upcomingContests = contestsRes.data.data
              .filter(c => c.status === 'UPCOMING')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
           const mappedHero = upcomingContests.map(c => ({
              id: c._id,
              title: c.title,
              subtitle: c.description.substring(0, 100) + "...",
              thumbnailUrl: c.thumbnail?.url,
              tag: "Coming Soon",
              buttonText: "View Details"
           }));
           setHeroContests(mappedHero.slice(0, 5)); // Limit to 5
        }

        // 2. Popular Contests
        if (contestsRes.data.success) {
           const activeContests = contestsRes.data.data.filter(c => c.status === 'ONGOING');
           const sortedPop = activeContests.sort((a,b) => (b.participantsCount || 0) - (a.participantsCount || 0));
           const mappedPop = sortedPop.slice(0, 3).map(c => ({
              id: c._id,
              title: c.title,
              desc: c.description,
              status: c.status,
              domain: c.domain || "General",
              prize: c.cashPrize && c.cashPrize > 0 ? `₹${c.cashPrize}` : null,
              icon: c.domain === 'MERN' || c.domain === 'Development' ? "💻" : c.domain === 'UI/UX' ? "🎨" : "🏛️",
              dateInfo: "End Date",
              dateValue: formatDateDDMMYYYY(c.endDate),
              thumbnail: c.thumbnail?.url || null,
              participantsCount: c.participantsCount || 0,
              projectType: c.projectType,
              minTeamSize: c.minTeamSize,
              maxTeamSize: c.maxTeamSize
           }));
           setPopularContests(mappedPop);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf2] font-sans selection:bg-[#8cc63f]/30">
      <UserNavbar />
      <PageTransition>
        <HeroCarousel contests={heroContests} loading={loading} showSearchBar={false} />

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
                    <ContestCard key={contest.id} contest={contest} index={idx} variant="dashboard" />
                 ))}
              </div>
           )}
        </section>

        <section className="py-16 md:py-24 bg-white border-t border-gray-100">
           <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
                 <div className="lg:col-span-5 pr-0 lg:pr-8">
                    <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">The Desun Advantage</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1] mb-6">
                       Crafting the next generation of <br/> <span className="text-[#5c8a14]">Master Thinkers</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-sm md:text-base leading-relaxed mb-10 max-w-md">
                       Our atelier approach combines academic rigor with professional mentorship, creating a unique environment where theory meets execution.
                    </p>
                 </div>

                 <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fbc111]/10 rounded-full blur-3xl -z-10"></div>
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
      </PageTransition>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
