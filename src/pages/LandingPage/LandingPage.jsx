// ============================================================
// LandingPage.jsx — Application er main homepage
// Ekhane HeroCarousel, Features, Statistics, Categories, r Testimonials ache.
// Navbar r Footer common component use kora hoyeche.
// PageTransition wrap kora ache smooth loading er jonno.
// Typing animation r dynamic search filter implementation ache niche.
// Featured categories grid e hover effects r link navigation dewa ache.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useCarousel } from '../../hooks/useCarousel';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCheck, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaGraduationCap, FaNetworkWired, FaCertificate, FaRocket, FaTrophy, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/index';
import Ratings from '../../components/Ratings/Ratings';
import LiveStats from '../../components/LiveStats/LiveStats';
import NewsletterCTA from '../../components/Newsletter/NewsletterCTA';
import PageTransition from '../../components/Common/PageTransition';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import api from '../../utils/api';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';

import { getOptimizedUrl, CLOUDINARY_ASSETS } from '../../utils/cloudinary';

const buildingHero = getOptimizedUrl(CLOUDINARY_ASSETS["building.jpg.png"]);
const award1 = getOptimizedUrl(CLOUDINARY_ASSETS["award1.jpg"]);
const award2 = getOptimizedUrl(CLOUDINARY_ASSETS["award2.jpg"]);
const slide3 = getOptimizedUrl(CLOUDINARY_ASSETS["slide3.jpg"]);
const slide4 = getOptimizedUrl(CLOUDINARY_ASSETS["slide4.jpg"]);
const slide5 = getOptimizedUrl(CLOUDINARY_ASSETS["slide5.jpg"]);
const slide6 = getOptimizedUrl(CLOUDINARY_ASSETS["slide6.jpg"]);
const slide7 = getOptimizedUrl(CLOUDINARY_ASSETS["slide7.jpg"]);
const slide8 = getOptimizedUrl(CLOUDINARY_ASSETS["slide8.jpg"]);
const slide9 = getOptimizedUrl(CLOUDINARY_ASSETS["slide9.jpg"]);
const ceoHero = getOptimizedUrl(CLOUDINARY_ASSETS["ceo.png"]);

const catMern = getOptimizedUrl(CLOUDINARY_ASSETS["cat_mern.png.png"]);
const catUiux = getOptimizedUrl(CLOUDINARY_ASSETS["cat_uiux.png.png"]);
const catMarketing = getOptimizedUrl(CLOUDINARY_ASSETS["cat_marketing.png.jpg"]);

const heroImages = [buildingHero, award1, award2, slide3, slide4, slide5, slide6, slide7, slide8, slide9];

const initialContests = [
   { id: 1, title: 'Visual Ethics Olympiad', category: 'DESIGN', date: 'Deadline: 24.10.2024', image: 'https://images.unsplash.com/photo-1541462608141-802f39682641?q=80&w=1470&auto=format&fit=crop' },
   { id: 2, title: 'Sustainability Hackathon', category: 'INNOVATION', date: 'Starts: 12.11.2024', image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1287&auto=format&fit=crop' },
   { id: 3, title: 'AI Ethics Challenge', category: 'ETHICS', date: '05.01.2025', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1332&auto=format&fit=crop' },
   { id: 4, title: 'Quantum Computing Sprint', category: 'QUANTUM', date: '10.02.2025', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop' }
];

const courses = [
   { title: 'MERN STACK', desc: 'Master full-stack development with MongoDB, Express, React, and Node.js.' },
   { title: 'WEB DESIGN', desc: 'Crafting beautiful, responsive, and user-centric web experiences.' },
   { title: 'UI/UX DESIGN', desc: 'The art of creating intuitive interfaces and delightful user journeys.' },
   { title: 'DIGITAL MARKETING', desc: 'Strategic growth through modern marketing and data-driven insights.' },
   { title: 'HR MANAGEMENT', desc: 'Building organizational excellence through human capital management.' },
   { title: 'GENERATIVE AI', desc: 'Exploring the frontier of AI-driven creativity and automation.' }
];

const TypewriterHeader = () => {
   const [text, setText] = useState('');
   const [isDeleting, setIsDeleting] = useState(false);
   const [loopNum, setLoopNum] = useState(0);
   const [typingSpeed, setTypingSpeed] = useState(150);

   const fullText = "Welcome to the CONTEST WORLD";

   useEffect(() => {
      // Typewriter effect ekti infinite loop-e cholbe
      let handleType = setTimeout(() => {
         const i = loopNum % fullText.length;
         const updatedText = isDeleting 
            ? fullText.substring(0, text.length - 1) 
            : fullText.substring(0, text.length + 1);

         setText(updatedText);

         // Jodi puro text-ta typing hoye jay, tobe kichu khon wait kora hoche
         if (!isDeleting && updatedText === fullText) {
            setTypingSpeed(2000); // Wait at end
            setIsDeleting(true);
         } else if (isDeleting && updatedText === '') {
            // Puro delete hoye gele abar typing start hobe
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setTypingSpeed(500);
         } else {
            setTypingSpeed(isDeleting ? 100 : 150);
         }
      }, typingSpeed);

      return () => clearTimeout(handleType);
   }, [text, isDeleting, loopNum, typingSpeed]);

   return (
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight flex flex-wrap items-center justify-center gap-x-2 gap-y-0 text-center leading-[1.2]">
         <span className="text-slate-900 dark:text-gray-100">{text.substring(0, 15)}</span>
         <span className="text-[#8cc63f]">{text.substring(15, 23)}</span>
         <span className="text-[#fbc111]">{text.substring(23)}</span>
         <span className="w-1 h-8 sm:h-12 bg-[#8cc63f] animate-pulse ml-1 rounded-full shrink-0"></span>
      </h2>
   );
};

const LandingPage = () => {
   const [contests, setContests] = useState([]);
   const [liveContests, setLiveContests] = useState([]);
   const [marqueeContests, setMarqueeContests] = useState([]);
   const [loading, setLoading] = useState(true);
   const [liveLoading, setLiveLoading] = useState(true);
   const [error, setError] = useState(null);

   const { user } = useAuth();
   const navigate = useNavigate();

   const handleCategoryClick = (domain) => {
      if (!user) {
         navigate('/login', { state: { returnTo: '/student/contests', filterDomain: domain } });
      } else if (user.role === 'admin') {
         toast.error("You are not authorized to perform this action right now");
         navigate('/admin/dashboard');
      } else {
         navigate('/student/contests', { state: { filterDomain: domain } });
      }
   };

   const handleContestClick = (contestId) => {
      if (!contestId) return;
      if (!user) {
         navigate('/login', { state: { returnTo: `/student/contests/${contestId}` } });
      } else if (user.role === 'admin') {
         toast.error("You are not authorized to perform this action right now");
         navigate('/admin/dashboard');
      } else {
         navigate(`/student/contests/${contestId}`);
      }
   };

   // --- CAROUSEL LOGIC VIA CUSTOM HOOKS ---
   const { currentIndex: heroIndex, setIndex: setHeroIndex } = useCarousel(heroImages.length, 2500);
   const { currentIndex, next: handleNext, prev: handlePrev } = useCarousel(contests.length > 0 ? contests.length : 1, 3000);

   // --- DYNAMIC BACKEND FETCH PREPARATION ---
   useEffect(() => {
      const fetchContests = async () => {
         setLoading(true);
         setLiveLoading(true);
         setError(null);
         try {
            const res = await api.get('/contests');
            if (res.data.success) {
               const allData = res.data.data;

               // 1. Live Contests for Top Carousel
               const ongoing = allData
                  .filter(c => c.status === 'ONGOING')
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const mappedLive = ongoing.map(c => ({
                   id: c._id,
                   title: c.title,
                   subtitle: c.description.substring(0, 120) + "...",
                   thumbnailUrl: c.thumbnail?.url,
                   tag: "Live Contest",
                   domain: c.domain,
                   buttonText: "Join Now"
                }));
               setLiveContests(mappedLive.slice(0, 5));

               // 2. Marquee Contests (Shuffled all non-completed)
               const marqueeData = allData
                  .filter(c => c.status !== 'COMPLETED')
                  .sort(() => Math.random() - 0.5)
                  .map(c => ({
                     title: c.title,
                     desc: c.description.substring(0, 100) + "...",
                     domain: c.domain || "General"
                  }));
               
               // Ensure enough items for an infinite marquee (minimum 10)
               let finalMarquee = [...marqueeData];
               while (finalMarquee.length > 0 && finalMarquee.length < 10) {
                  finalMarquee = [...finalMarquee, ...marqueeData];
               }
               setMarqueeContests(finalMarquee);

               // 3. Featured section (using real data instead of initialContests)
               const featured = allData.slice(0, 4).map(c => ({
                  id: c._id,
                  title: c.title,
                  category: c.domain || "ACADEMIC",
                  date: `End: ${formatDateDDMMYYYY(c.endDate)}`,
                  image: c.thumbnail?.url || 'https://images.unsplash.com/photo-1541462608141-802f39682641?q=80&w=1470&auto=format&fit=crop'
               }));
               setContests(featured);
            }
            setLiveLoading(false);
         } catch (err) {
            console.error("Error fetching contests:", err);
            setError("Failed to load contests. Please try again later.");
            setLiveLoading(false);
         } finally {
            setLoading(false);
         }
      };
      fetchContests();
   }, []);

   // Handle smooth scroll when landing with a hash
   useEffect(() => {
      if (window.location.hash) {
         const id = window.location.hash.substring(1);
         const element = document.getElementById(id);
         if (element) {
            setTimeout(() => {
               element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
         }
      }
   }, []);

   const getCardIndex = (offset) => {
      if (!contests || contests.length === 0) return 0;
      return (currentIndex + offset + contests.length) % contests.length;
   };

   return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-[#f8faf2] dark:bg-gray-900 overflow-x-hidden selection:bg-[#8cc63f]/30">
         <style dangerouslySetInnerHTML={{
            __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
         <HeroCarousel contests={liveContests} loading={liveLoading} />
         
         {/* Typing Animation Section */}
         <div className="bg-[#f8faf2] dark:bg-gray-900 py-6 sm:py-8 border-b border-gray-100/50 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 text-center">
               <div className="inline-flex items-center justify-center gap-2 mb-2">
                  <div className="h-[2px] w-8 bg-[#8cc63f] rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5c8a14]">Experience The Thrill</span>
                  <div className="h-[2px] w-8 bg-[#fbc111] rounded-full"></div>
               </div>
               <TypewriterHeader />
            </div>
         </div>

         <PageTransition>
         {/* Hero Section - WITH AUTO-SLIDING CAROUSEL */}
         <section className="relative overflow-hidden pt-12 pb-12 md:pt-16 md:pb-20 px-6 sm:px-12 lg:px-24">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
               <div className="space-y-6 animate-in slide-in-from-left duration-1000">
                  <span className="inline-block bg-[#fbc111]/10 text-[#d4a017] px-4 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase">Est. 2019</span>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-gray-100 leading-[1] tracking-tight">
                     The Future of <br />
                     <span className="text-[#8cc63f]">Scholastic <br /> Excellence.</span>
                  </h1>
                  <p className="text-gray-500 font-bold text-base max-w-xl leading-relaxed">
                     Welcome to the Scholastic Atelier—where tradition meets digital innovation. We cultivate minds for the modern world.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <a 
                        href="https://www.desunacademy.in/?utm_source=Google_Ads&utm_medium=cpc&utm_campaign=General_Search_Campaign&utm_content=Ad_Group_2&gad_source=1&gad_campaignid=23217970928&gbraid=0AAAAAqQrhGxNXHDyVQLRoeP-ZuurKHd3A&gclid=Cj0KCQjw7cLOBhDmARIsAGsuA0nKkGyKauNtuuQ_9X_KiBKcpRDbAFU_PefBTWZNUCPdzKMlsZl9lD4aAmkHEALw_wcB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#8cc63f] hover:bg-[#7ab332] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#8cc63f]/20 hover:-translate-y-1 active:scale-95 block text-center"
                     >
                        Explore Courses
                     </a>
                  </div>
               </div>
               
               {/* Hero Image Carousel */}
               <div className="relative animate-in zoom-in duration-1000">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 rounded-[48px] blur-3xl opacity-50"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-3 rounded-[40px] shadow-2xl border border-white/50 overflow-hidden group">
                     {/* The Sliding Images Container */}
                     <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-[32px]">
                        {heroImages.map((img, idx) => (
                           <img
                              key={idx}
                              src={img}
                              loading={idx === 0 ? "eager" : "lazy"}
                              alt={`Scholastic Slide ${idx}`}
                              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform-gpu ${
                                 idx === heroIndex ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-110 translate-x-full'
                              }`}
                           />
                        ))}
                     </div>

                     {/* Right-to-Left Sliding Dots */}
                     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2.5 bg-black/5 backdrop-blur-md rounded-full border border-white/20 z-10">
                        {heroImages.map((_, i) => (
                           <button
                              key={i}
                              onClick={() => setHeroIndex(i)}
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                 i === heroIndex 
                                    ? 'w-6 bg-[#fbc111] shadow-[0_0_12px_rgba(251,193,17,0.5)]' 
                                    : 'w-2.5 bg-[#8cc63f] hover:bg-[#a3d957]'
                              }`}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Institutional Pillars - COMPACT REFINED */}
         <section id="aboutus" className="py-10 bg-white/ dark:bg-gray-800/ scroll-mt-28">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
               <div className="mb-10 text-center sm:text-left">
                  <span className="text-[#a68945] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Institutional Pillars</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-gray-100 tracking-tight">The Foundation of Desun</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
                     <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#8cc63f]/10 transition-colors">
                        <span className="text-xl">🏛️</span>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-gray-100 mb-4">History of Foundation</h3>
                     <p className="text-gray-500 font-bold text-sm leading-relaxed">
                        Founded with a vision to bridge the gap between traditional academic rigor and technological demands.
                     </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-6 mb-8">
                           <img 
                              src={ceoHero} 
                              className="w-24 h-24 rounded-full border-4 border-yellow-50 shadow-md object-cover" 
                              alt="Dr. Artis Thorne" 
                           />
                           <div>
                              <h4 className="font-black text-slate-900 dark:text-gray-100 text-lg">ARGHYA DUTTA</h4>
                              <p className="text-[12px] text-gray-400 font-black uppercase tracking-widest leading-none mt-1">Chief Executive Officer (CEO) </p>
                           </div>
                        </div>
                        <p className="text-slate-700 dark:text-gray-300 italic font-bold text-lg leading-relaxed opacity-80">
                           "Our mission is to inspire the next generation of architects of the digital landscape."
                        </p>
                     </div>
                     <div className="mt-8 h-1.5 w-16 bg-[#fbc111] rounded-full shadow-sm"></div>
                  </div>

                  <div id="vision" className="bg-[#5c8a14] p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden group scroll-mt-28">
                     <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/ dark:bg-gray-800/ rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                     <h3 className="text-xl font-black mb-4 relative z-10">The Vision</h3>
                     <p className="text-white/80 font-bold text-sm leading-relaxed mb-8 relative z-10">
                        To become the global standard for interdisciplinary excellence, fostering a community of logic and creativity.
                     </p>
                     <a 
                        href="https://www.desunacademy.in/about-us?_gl=1*aysjd*_up*MQ..*_gs*MQ..&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-engF8Lml228IhCROms_ppLFnslJEpHZRFs3V1yJdlkF5PHXJcyLbRoCuDYQAvD_BwE&gbraid=0AAAAAqQrhGxEHvs_bW4QgZ8Klr0F8pCto" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group relative z-10 w-max"
                     >
                        Learn More <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                     </a>
                     <div className="absolute bottom-4 right-8 text-7xl font-black text-white/5 pointer-events-none uppercase italic">Vision</div>
                  </div>
               </div>
            </div>
         </section>

         {/* Premium Course Tracks - INFINITE SLIDER COMPACT */}
         <section id="courses" className="py-10 overflow-hidden scroll-mt-28">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mb-8">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Premium Course Tracks</h2>
                  <span className="bg-[#8cc63f] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Continuous Enrollment</span>
               </div>
            </div>

            <div className="relative">
               {/* Gradient Overlays for smooth edges */}
               <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f8faf2] dark:from-gray-900 to-transparent z-10"></div>
               <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f8faf2] dark:from-gray-900 to-transparent z-10"></div>

               <div className="animate-marquee gap-6 px-6 transform-gpu">
                  {[...courses, ...courses].map((course, idx) => (
                     <div 
                        key={idx} 
                        className={`w-[280px] bg-white/ dark:bg-gray-800/ border-2 ${idx % 2 === 0 ? 'border-[#8cc63f]' : 'border-[#fbc111]'} p-8 rounded-[36px] hover:bg-white dark:bg-gray-800 hover:shadow-xl transition-all cursor-pointer shrink-0 will-change-transform transform-gpu group`}
                     >
                        <h3 className="text-lg font-black text-[#5c8a14] mb-3 group-hover:translate-x-1 transition-transform">{course.title}</h3>
                        <p className="text-gray-400 font-bold text-[11px] leading-relaxed line-clamp-2">{course.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Benefits & Contact - COMPACT REFINED */}
         <section id="benefits" className="py-2 bg-white/ dark:bg-gray-800/ scroll-mt-28">
            <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-[#8cc63f] p-4 sm:p-5 rounded-[24px] shadow-lg space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/ dark:bg-gray-800/ rounded-full blur-xl"></div>
                  <h2 className="text-lg md:text-xl font-black text-white leading-tight">Student Benefits</h2>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                     {[
                        'Industry Mentorship',
                        'Portfolio Access',
                        'Alumni Network',
                        'Career Pathways',
                        'Placement Assistance',
                        'Learning Modules'
                     ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 group">
                           <div className="w-4 h-4 bg-white/ dark:bg-gray-800/ rounded flex items-center justify-center group-hover:bg-white dark:bg-gray-800 transition-colors shrink-0">
                              <FiCheck size={8} className="text-white group-hover:text-[#8cc63f] transition-colors" />
                           </div>
                           <span className="text-white font-black text-[9px] uppercase tracking-wide opacity-90 truncate">{benefit}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div id="contact" className="bg-[#fbc111] p-4 sm:p-5 rounded-[24px] shadow-lg space-y-3 scroll-mt-28">
                  <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-gray-100 leading-tight">Contact Us</h2>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
                        <FiMail className="shrink-0 text-slate-900 dark:text-gray-100" size={14} />
                        <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wide break-all">contact@desunacademy.in</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
                        <FiPhone className="shrink-0 text-slate-900 dark:text-gray-100" size={14} />
                        <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wide">+91 91470 61005</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
                        <FiMapPin className="shrink-0 text-slate-900 dark:text-gray-100" size={14} />
                        <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wide">Kolkata, WB</span>
                     </div>
                  </div>
                  <a
                     href="mailto:contact@desunacademy.in"
                     className="block w-full bg-slate-900 hover:bg-[#8cc63f] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center transition-all shadow-lg mt-2 active:scale-95"
                  >
                     Send Message
                  </a>
               </div>
            </div>
         </section>

         {/* How it Works - COMPACT REFINED */}
         <section className="py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
               <div className="text-center mb-12 space-y-2">
                  <span className="text-[#a68945] text-[10px] font-black uppercase tracking-[0.3em]">The Scholastic Journey</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-gray-100 tracking-tight">How it Works</h2>
               </div>

               <div className="relative">
                  <div className="absolute top-10 left-0 w-full h-[6px] bg-[#e1edcf] hidden md:block rounded-full overflow-hidden">
                     <div className="h-full bg-[#fbc111] w-[100%] rounded-full opacity-60 animate-pulse"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                     {[
                        { icon: FaGraduationCap, step: 1, title: 'Create Account', desc: 'Register with interest.' },
                        { icon: FaNetworkWired, step: 2, title: 'Find and Enroll', desc: 'Join suitable contests.' },
                        { icon: FaRocket, step: 3, title: "Submit Work", desc: "Submit by deadline." },
                        { icon: FaCertificate, step: 4, title: "Get Award", desc: "Receive recognition." }
                     ].map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center group">
                           <div className="mb-6 relative">
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black border-4 border-[#f8faf2] z-20 shadow-lg">
                                 {step.step}
                              </div>
                              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-[28px] flex items-center justify-center text-[#8cc63f] text-3xl shadow-xl group-hover:scale-110 transition-transform group-hover:bg-[#8cc63f] group-hover:text-white border-2 border-transparent group-hover:border-white transform-gpu">
                                 <step.icon />
                              </div>
                           </div>
                           <h4 className="text-lg font-black text-slate-900 dark:text-gray-100 mb-2">{step.title}</h4>
                           <p className="text-gray-400 font-bold text-[11px] leading-relaxed px-4">{step.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
         {/* Explore Categories - PREMIUM CARD GRID */}
         <section className="py-12 md:py-16 bg-[#f8faf2] dark:bg-gray-900">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
               <div className="text-center mb-12 space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-gray-100">
                     EXPLORE <span className="text-[#8cc63f]">CATEGORIES</span>
                  </h2>
                  <p className="text-gray-400 font-bold text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                     Filter challenges by your expertise. Deep dive into specialized contests and showcase your mastery in specific domains.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { 
                        title: 'MERN', 
                        desc: 'Click to view all MERN contests.', 
                        image: catMern, 
                        domain: 'MERN' 
                     },
                     { 
                        title: 'UI/UX DESIGN', 
                        desc: 'Click to view all UI/UX DESIGN contests.', 
                        image: catUiux, 
                        domain: 'UI/UX' 
                     },
                     { 
                        title: 'DIGITAL MARKETING', 
                        desc: 'Click to view all DIGITAL MARKETING contests.', 
                        image: catMarketing, 
                        domain: 'Digital Marketing' 
                     }
                  ].map((cat, idx) => (
                     <div 
                        key={idx} 
                        className="bg-white dark:bg-gray-800 rounded-[48px] p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                     >
                        <div className="w-full h-[220px] rounded-[36px] overflow-hidden mb-6 relative">
                           <img 
                              src={cat.image} 
                              alt={cat.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                           />
                           {/* Soft Fade Effect from Screenshot */}
                           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-100"></div>
                        </div>
                        
                        <h3 className="text-xl font-black text-slate-900 dark:text-gray-100 mb-3">{cat.title}</h3>
                        <p className="text-gray-400 font-bold text-[11px] leading-relaxed mb-6 px-4">
                           {cat.desc}
                        </p>
                        
                        <button 
                           onClick={() => handleCategoryClick(cat.domain)}
                           className="flex items-center gap-2 text-[#8cc63f] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                        >
                           Explore Now <FiArrowRight className="text-lg" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Academic Contests Section with Loading/Error Handling */}
         <section className="py-12 bg-white/ dark:bg-gray-800/ overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                  <span className="text-[#a68945] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Engage & Compete</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-gray-100 tracking-tight">Academic Contests</h2>
               </div>
               {!loading && contests.length > 0 && (
                  <div className="flex gap-4">
                     <button
                        onClick={handlePrev}
                        className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#8cc63f] shadow-lg hover:shadow-[#8cc63f]/20 transition-all active:scale-90"
                     >
                        <FiChevronLeft size={24} />
                     </button>
                     <button
                        onClick={handleNext}
                        className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#8cc63f] shadow-lg hover:shadow-[#8cc63f]/20 transition-all active:scale-90"
                     >
                        <FiChevronRight size={24} />
                     </button>
                  </div>
               )}
            </div>

            {loading ? (
               <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <Loader size="sm" text="Fetching Contests..." />
               </div>
            ) : error ? (
               <div className="text-center py-24">
                  <p className="text-red-500 font-bold mb-4">{error}</p>
                  <button 
                     onClick={() => window.location.reload()}
                     className="bg-[#8cc63f] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                     Try Again
                  </button>
               </div>
            ) : contests.length === 0 ? (
               <div className="text-center py-24 text-gray-400">No active contests found.</div>
            ) : (
               <div className="relative h-[420px] md:h-[480px] max-w-[1440px] mx-auto flex items-center justify-center pt-8">
                  {/* LEFT CARD */}
                  <div
                     className="absolute left-[5%] xl:left-[15%] w-[250px] md:w-[350px] transform scale-[0.7] opacity-10 md:opacity-20 blur-[4px] transition-all duration-1000 select-none z-10 pointer-events-none hidden lg:block transform-gpu"
                     style={{ transform: 'translateX(-50%)' }}
                  >
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-[48px] shadow-sm flex flex-col gap-4">
                        <img loading="lazy" src={contests[getCardIndex(-1)]?.image} className="w-full h-[180px] object-cover rounded-[36px] grayscale" alt="Contest" />
                        <div className="py-2"><h3 className="text-xl font-black text-slate-200">{contests[getCardIndex(-1)]?.title}</h3></div>
                     </div>
                  </div>

                  {/* CENTER CARD (ACTIVE) */}
                  <div 
                     onClick={() => handleContestClick(contests[currentIndex]?.id)}
                     className="relative w-full max-w-[90%] md:max-w-[300px] lg:max-w-[330px] transform-gpu scale-100 z-30 transition-all duration-1000 px-4 select-none touch-pan-y cursor-pointer group"
                  >
                     <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[48px] shadow-2xl border-[8px] border-transparent bg-clip-padding relative h-[380px] md:h-[420px] flex flex-col items-center justify-between">
                        {/* Mixed border effect */}
                        <div className="absolute -inset-[8px] rounded-[48px] bg-gradient-to-tr from-[#8cc63f] via-[#fbc111] to-[#8cc63f] -z-10 opacity-70"></div>
                        <div className="bg-white dark:bg-gray-800 rounded-[40px] absolute inset-0 -z-10"></div>
                        
                        <div className="w-full h-[180px] md:h-[200px] rounded-[36px] overflow-hidden shrink-0 transform-gpu shadow-xl relative">
                           <img
                              loading="lazy"
                              src={contests[currentIndex]?.image}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 transform-gpu"
                              alt="Active Contest"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                        <div className="flex-1 space-y-3 text-center mt-4">
                           <div className="flex items-center justify-center gap-3">
                              <span className="text-[9px] font-black text-[#5c8a14] uppercase tracking-widest py-1 px-3 bg-[#8cc63f]/10 rounded-lg">
                                 {contests[currentIndex]?.category}
                              </span>
                              <FaTrophy className="text-[#fbc111] animate-bounce" size={16} />
                           </div>
                           <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-tight px-2">
                              {contests[currentIndex]?.title}
                           </h3>
                           <div className="flex items-center justify-center gap-2 py-2 border-t border-gray-50 dark:border-gray-700 mt-3">
                              <FiMapPin className="text-[#8cc63f]" size={14} />
                              <span className="text-[10px] font-black text-slate-900 dark:text-gray-100 uppercase tracking-widest leading-none">{contests[currentIndex]?.date}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* RIGHT CARD */}
                  <div
                     className="absolute right-[5%] xl:right-[15%] w-[250px] md:w-[350px] transform scale-[0.7] opacity-10 md:opacity-20 blur-[4px] transition-all duration-1000 select-none z-10 pointer-events-none hidden lg:block transform-gpu"
                     style={{ transform: 'translateX(50%)' }}
                  >
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-[48px] shadow-sm flex flex-col gap-4">
                        <img loading="lazy" src={contests[getCardIndex(1)]?.image} className="w-full h-[180px] object-cover rounded-[36px] grayscale" alt="Contest" />
                        <div className="py-2"><h3 className="text-xl font-black text-slate-200">{contests[getCardIndex(1)]?.title}</h3></div>
                     </div>
                  </div>
               </div>
            )}
         </section>

         <Ratings />
         <LiveStats />
         <NewsletterCTA />
         </PageTransition>
      </div>
   );
};

export default LandingPage;
