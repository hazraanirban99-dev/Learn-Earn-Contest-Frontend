// ============================================================
// StudentDashboard.jsx — Student er main landing page (after login)
// Ekhane Hero Carousel, Popular Contests, Ratings section dekhano hoy.
// Backend theke UPCOMING contests fetch kore hero carousel e rakha hoy (max 5).
// ONGOING contests fetch kore "Popular Contests" section e rakha hoy (max 3).
// Contest card e click korle ContestDetails page e navigate hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ContestCard from '../../components/Cards/ContestCard';
import Ratings from '../../components/Ratings/Ratings';
import { FiArrowRight } from 'react-icons/fi';
import { FaStar, FaShieldAlt, FaUsers, FaRocket } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import PageTransition from '../../components/Common/PageTransition';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { getActualStatus } from '../../utils/statusUtils';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [heroContests, setHeroContests] = useState([]);
  const [popularContests, setPopularContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(' ')[0] || 'Scholar';
  const welcomeData = [
    ...("Welcome ".split('').map(char => ({ char, style: "" }))),
    ...(firstName.toUpperCase().split('').map(char => ({ char, style: "text-[#fbc111]" }))),
    ...(" to the contest world, where you can learn and earn. Let's start your journey, just click the cards.".split('').map(char => ({ char, style: "" })))
  ];

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 30000); 
    return () => clearInterval(timer);
  }, []);

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8 },
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Backend theke data fetch korar logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Upcoming & Ongoing Contests (Hero Carousel er jonno)
        const contestsRes = await api.get('/contests');
        if (contestsRes.data.success) {
           const processedContests = contestsRes.data.data.map(c => ({
              ...c,
              realStatus: getActualStatus(c)
           }));

           const featuredContests = processedContests
              .filter(c => c.realStatus === 'UPCOMING' || c.realStatus === 'ONGOING')
              .sort((a, b) => {
                  if (a.realStatus === 'ONGOING' && b.realStatus !== 'ONGOING') return -1;
                  if (a.realStatus !== 'ONGOING' && b.realStatus === 'ONGOING') return 1;
                  return new Date(b.createdAt) - new Date(a.createdAt);
              });

           const mappedHero = featuredContests.map(c => ({
              id: c._id,
              title: c.title,
              subtitle: c.description.substring(0, 100) + "...",
              thumbnailUrl: c.thumbnail?.url,
              tag: c.realStatus === 'ONGOING' ? "Live Now" : "Coming Soon",
              buttonText: c.realStatus === 'ONGOING' ? "Join Now" : "View Details"
           }));
           setHeroContests(mappedHero.slice(0, 5));

           // 2. Popular Contests (ONGOING contests jeguloy sobcheye beshi participant)
           const activeContests = processedContests.filter(c => c.realStatus === 'ONGOING');
           const sortedPop = activeContests.sort((a,b) => (b.participantsCount || 0) - (a.participantsCount || 0));
           const mappedPop = sortedPop.slice(0, 3).map(c => ({
              id: c._id,
              title: c.title,
              desc: c.description,
              status: c.realStatus,
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
    <div className="min-h-screen pt-16 sm:pt-20 bg-[#f8faf2] dark:bg-gray-900 font-sans selection:bg-[#8cc63f]/30">
      <PageTransition>
        <HeroCarousel contests={heroContests} loading={loading} showSearchBar={false} />

        {/* --- Animated Welcome Message --- */}
        <section className="pt-8 px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div 
                key={animationKey}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/ dark:bg-gray-800/0 dark:bg-gray-800/60 backdrop-blur-sm border border-[#8cc63f]/20 dark:border-[#8cc63f]/30 rounded-[32px] p-6 md:p-8 shadow-sm flex items-center gap-4 md:gap-6 flex-wrap md:flex-nowrap min-h-[100px]"
             >
                <div className="w-12 h-12 rounded-2xl bg-[#8cc63f] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#8cc63f]/20">
                   <FaRocket className="text-xl" />
                </div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-gray-100 tracking-tight leading-tight">
                  {welcomeData.map((item, index) => (
                    <motion.span key={index} variants={letterVariants} className={item.style}>
                      {item.char}
                    </motion.span>
                  ))}
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1.5 h-6 bg-[#8cc63f] ml-1 align-middle"
                  />
                </h1>
             </motion.div>
           </AnimatePresence>
        </section>

        <section className="py-12 px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto">
           <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-gray-100 tracking-tight mb-2">Popular Contests</h2>
                 <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">Challenge your skills and win prestigious certifications.</p>
              </div>
              <Link to="/student/contests" className="text-[#5c8a14] hover:text-[#8cc63f] font-black text-sm transition-colors flex items-center gap-1 uppercase tracking-widest">
                 View All Contests <FiArrowRight />
              </Link>
           </div>

           {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                 {[1, 2, 3].map(i => <div key={i} className="bg-white dark:bg-gray-800 rounded-[40px] h-[350px]"></div>)}
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {popularContests.map((contest, idx) => (
                    <ContestCard key={contest.id} contest={contest} index={idx} variant="dashboard" />
                 ))}
              </div>
           )}
        </section>

        {/* --- Enrolled Contests CTA Banner --- */}
        <section className="px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto mb-16">
           <div className="bg-gradient-to-r from-[#4a7010] to-[#5c8a14] rounded-[48px] p-8 md:p-12 shadow-2xl shadow-[#8cc63f]/20 relative overflow-hidden group">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/ dark:bg-gray-800/ rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/ dark:bg-gray-800/ transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fbc111]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                 <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-[#fbc111] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                       <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                       Active Scholars
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                       Your growth is measured by the challenges you <span className="text-[#fbc111]">conquer</span>. Stay ahead of the curve.
                    </h3>
                 </div>

                 <Link 
                    to="/student/submissions" 
                    className="bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 dark:bg-gray-800 dark:text-gray-100 px-8 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#fbc111] hover:text-black dark:hover:text-black transition-all flex items-center gap-3 shrink-0 group/btn"
                 >
                    See Your Enrolled Contest
                    <FiArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>
        </section>

        <section className="py-16 md:py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
           <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
                 <div className="lg:col-span-5 pr-0 lg:pr-8">
                    <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">The Desun Advantage</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-[1] mb-6">
                       Crafting the next generation of <br/> <span className="text-[#5c8a14]">Master Thinkers</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-sm md:text-base leading-relaxed mb-10 max-w-md">
                       Our atelier approach combines academic rigor with professional mentorship, creating a unique environment where theory meets execution.
                    </p>
                 </div>

                 <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fbc111]/10 rounded-full blur-3xl -z-10"></div>
                    <div className="space-y-6 sm:mt-12">
                       <div className="bg-[#f8faf2] dark:bg-gray-800 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-[#8cc63f]/10 dark:border-[#8cc63f]/20 group">
                          <FaStar className="text-2xl text-[#8cc63f] mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="text-lg font-black text-slate-900 dark:text-gray-100 mb-2">Expert Mentors</h4>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">Learn directly from industry giants and academic veterans.</p>
                       </div>
                       <div className="bg-[#fbc111] p-8 rounded-[40px] shadow-lg shadow-[#fbc111]/20 hover:-translate-y-1 transition-all group">
                          <FaUsers className="text-2xl text-slate-800 dark:text-gray-100 mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="text-lg font-black text-slate-900 dark:text-gray-100 mb-2">Peer Network</h4>
                          <p className="text-xs font-bold text-slate-800 dark:text-gray-100/80 dark:text-gray-100/80 leading-relaxed">Collaborate with the brightest minds in our exclusive circles.</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="bg-[#4a7010] p-8 rounded-[40px] shadow-xl text-white hover:-translate-y-1 transition-all relative overflow-hidden group">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/ dark:bg-gray-800/ rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                          <FaShieldAlt className="text-2xl text-white mb-6 animate-pulse relative z-10" />
                          <h4 className="text-lg font-black text-white mb-2 relative z-10">Global Certs</h4>
                          <p className="text-xs font-bold text-white/80 leading-relaxed relative z-10">Get accredited by leading institutions across the globe.</p>
                       </div>
                       <div className="bg-[#f8faf2] dark:bg-gray-800 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-[#8cc63f]/10 dark:border-[#8cc63f]/20 group">
                          <FaRocket className="text-2xl text-[#c73ea8] mb-6 group-hover:-translate-y-1 transition-transform" />
                          <h4 className="text-lg font-black text-slate-900 dark:text-gray-100 mb-2">Career Launch</h4>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">Accelerate your professional journey with our talent pipeline.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
        <Ratings />
      </PageTransition>
    </div>
  );
};

export default StudentDashboard;
