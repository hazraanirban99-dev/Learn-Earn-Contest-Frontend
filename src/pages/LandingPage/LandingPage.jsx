import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCheck, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaGraduationCap, FaNetworkWired, FaCertificate, FaRocket, FaTrophy } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import buildingHero from '../../assets/building.jpg.png';
import award1 from '../../assets/award1.jpg';
import award2 from '../../assets/award2.jpg';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';
import slide5 from '../../assets/slide5.jpg';
import slide6 from '../../assets/slide6.jpg';
import slide7 from '../../assets/slide7.jpg';
import slide8 from '../../assets/slide8.jpg';
import slide9 from '../../assets/slide9.jpg';
import ceoHero from '../../assets/ceo.jpg';

const LandingPage = () => {
   // --- HERO CAROUSEL LOGIC ---
   const heroImages = [buildingHero, award1, award2, slide3, slide4, slide5, slide6, slide7, slide8, slide9];
   const [heroIndex, setHeroIndex] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => {
         setHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 2000);
      return () => clearInterval(timer);
   }, [heroImages.length]);

   // --- CONTEST CAROUSEL LOGIC ---
   const initialContests = [
      { id: 1, title: 'Visual Ethics Olympiad', category: 'DESIGN', date: 'Deadline: Oct 24, 2024', image: 'https://images.unsplash.com/photo-1541462608141-802f39682641?q=80&w=1470&auto=format&fit=crop' },
      { id: 2, title: 'Sustainability Hackathon', category: 'INNOVATION', date: 'Starts: Nov 12, 2024', image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1287&auto=format&fit=crop' },
      { id: 3, title: 'AI Ethics Challenge', category: 'ETHICS', date: 'Jan 05, 2025', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1332&auto=format&fit=crop' },
      { id: 4, title: 'Quantum Computing Sprint', category: 'QUANTUM', date: 'Feb 10, 2025', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop' }
   ];

   const [contests, setContests] = useState(initialContests);
   const [currentIndex, setCurrentIndex] = useState(0);

   // --- SIMULATED DYNAMIC BACKEND FETCH ---
   useEffect(() => {
      const fetchContests = async () => {
         try {
            setTimeout(() => {
               setContests(initialContests);
            }, 800);
         } catch (error) {
            console.error("Error fetching contests:", error);
         }
      };
      fetchContests();
   }, []);

   // Auto-slide every 2 seconds for contests
   useEffect(() => {
      const timer = setInterval(() => {
         handleNext();
      }, 2000);
      return () => clearInterval(timer);
   }, [currentIndex, contests.length]);

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

   const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % contests.length);
   };

   const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + contests.length) % contests.length);
   };

   const getCardIndex = (offset) => {
      return (currentIndex + offset + contests.length) % contests.length;
   };

   const courses = [
      { title: 'MERN STACK', desc: 'Master full-stack development with MongoDB, Express, React, and Node.js.' },
      { title: 'WEB DESIGN', desc: 'Crafting beautiful, responsive, and user-centric web experiences.' },
      { title: 'UI/UX DESIGN', desc: 'The art of creating intuitive interfaces and delightful user journeys.' },
      { title: 'DIGITAL MARKETING', desc: 'Strategic growth through modern marketing and data-driven insights.' },
      { title: 'HR MANAGEMENT', desc: 'Building organizational excellence through human capital management.' },
      { title: 'GENERATIVE AI', desc: 'Exploring the frontier of AI-driven creativity and automation.' }
   ];

   return (
      <div className="min-h-screen bg-[#f8faf2] overflow-x-hidden selection:bg-[#8cc63f]/30">
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
         <Navbar showAuth={true} />

         {/* Hero Section - WITH AUTO-SLIDING CAROUSEL */}
         <section className="relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-20 px-6 sm:px-12 lg:px-24">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
               <div className="space-y-6 animate-in slide-in-from-left duration-1000">
                  <span className="inline-block bg-[#fbc111]/10 text-[#d4a017] px-4 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase">Est. 2024</span>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1] tracking-tight">
                     The Future of <br />
                     <span className="text-[#8cc63f]">Scholastic <br /> Excellence.</span>
                  </h1>
                  <p className="text-gray-500 font-bold text-base max-w-xl leading-relaxed">
                     Welcome to the Scholastic Atelier—where tradition meets digital innovation. We cultivate minds for the modern world.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <button className="bg-[#8cc63f] hover:bg-[#7ab332] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#8cc63f]/20 hover:-translate-y-1 active:scale-95">
                        Explore Courses
                     </button>
                     <button className="bg-white hover:bg-gray-50 text-gray-500 border-2 border-gray-100 px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95">
                        Our Vision
                     </button>
                  </div>
               </div>
               
               {/* Hero Image Carousel */}
               <div className="relative animate-in zoom-in duration-1000">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#8cc63f]/20 to-[#fbc111]/20 rounded-[48px] blur-3xl opacity-50"></div>
                  <div className="relative bg-white p-3 rounded-[40px] shadow-2xl border border-white/50 overflow-hidden group">
                     {/* The Sliding Images Container */}
                     <div className="relative w-full h-[280px] md:h-[400px] overflow-hidden rounded-[32px]">
                        {heroImages.map((img, idx) => (
                           <img
                              key={idx}
                              src={img}
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
         <section id="history" className="py-10 bg-white/50">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
               <div className="mb-10 text-center sm:text-left">
                  <span className="text-[#a68945] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Institutional Pillars</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">The Foundation of Desun</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                     <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#8cc63f]/10 transition-colors">
                        <span className="text-xl">🏛️</span>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-4">History of Foundation</h3>
                     <p className="text-gray-500 font-bold text-sm leading-relaxed">
                        Founded with a vision to bridge the gap between traditional academic rigor and technological demands.
                     </p>
                  </div>

                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-6 mb-8">
                           <img 
                              src={ceoHero} 
                              className="w-24 h-24 rounded-full border-4 border-yellow-50 shadow-md object-cover" 
                              alt="Dr. Artis Thorne" 
                           />
                           <div>
                              <h4 className="font-black text-slate-900 text-lg">Dr. Artis Thorne</h4>
                              <p className="text-[12px] text-gray-400 font-black uppercase tracking-widest leading-none mt-1">Chief Academic Officer</p>
                           </div>
                        </div>
                        <p className="text-slate-700 italic font-bold text-lg leading-relaxed opacity-80">
                           "Our mission is to inspire the next generation of architects of the digital landscape."
                        </p>
                     </div>
                     <div className="mt-8 h-1.5 w-16 bg-[#fbc111] rounded-full shadow-sm"></div>
                  </div>

                  <div id="vision" className="bg-[#5c8a14] p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden group">
                     <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                     <h3 className="text-xl font-black mb-4 relative z-10">The Vision</h3>
                     <p className="text-white/80 font-bold text-sm leading-relaxed mb-8 relative z-10">
                        To become the global standard for interdisciplinary excellence, fostering a community of logic and creativity.
                     </p>
                     <button className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group relative z-10">
                        Learn More <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                     </button>
                     <div className="absolute bottom-4 right-8 text-7xl font-black text-white/5 pointer-events-none uppercase italic">Vision</div>
                  </div>
               </div>
            </div>
         </section>

         {/* Premium Course Tracks - INFINITE SLIDER COMPACT */}
         <section id="courses" className="py-10 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mb-8">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Premium Course Tracks</h2>
                  <span className="bg-[#8cc63f] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Continuous Enrollment</span>
               </div>
            </div>

            <div className="relative">
               {/* Gradient Overlays for smooth edges */}
               <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f8faf2] to-transparent z-10"></div>
               <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f8faf2] to-transparent z-10"></div>

               <div className="animate-marquee gap-6 px-6 transform-gpu">
                  {[...courses, ...courses].map((course, idx) => (
                     <div key={idx} className="w-[280px] bg-white/60 border border-gray-100 p-8 rounded-[36px] hover:bg-white hover:shadow-xl transition-all cursor-pointer shrink-0 will-change-transform transform-gpu group">
                        <h3 className="text-lg font-black text-[#5c8a14] mb-3 group-hover:translate-x-1 transition-transform">{course.title}</h3>
                        <p className="text-gray-400 font-bold text-[11px] leading-relaxed line-clamp-2">{course.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Benefits & Contact - COMPACT REFINED */}
         <section id="benefits" className="py-8 bg-white/30">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-[#8cc63f] p-8 md:p-10 rounded-[48px] shadow-2xl space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">Student Benefits</h2>
                  <div className="space-y-4">
                     {[
                        'Industry-Leading Mentorship',
                        'Lifetime Portfolio Access',
                        'Global Alumni Network',
                        'Accredited Career Pathways'
                     ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                           <div className="w-6 h-6 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                              <FiCheck size={12} className="text-white group-hover:text-[#8cc63f] transition-colors" />
                           </div>
                           <span className="text-white font-black text-xs uppercase tracking-wide opacity-90">{benefit}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div id="contact" className="bg-[#fbc111] p-8 md:p-10 rounded-[48px] shadow-2xl space-y-8">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">Contact Us</h2>
                  <div className="space-y-6">
                     <div className="flex items-center gap-5 text-slate-800">
                        <FiMail className="w-6 h-6 opacity-60" />
                        <span className="font-black text-sm uppercase tracking-wide">admissions@desunacademy.edu</span>
                     </div>
                     <div className="flex items-center gap-5 text-slate-800">
                        <FiPhone className="w-6 h-6 opacity-60" />
                        <span className="font-black text-sm uppercase tracking-wide">+1 (800) 555-DESUN</span>
                     </div>
                     <div className="flex items-center gap-5 text-slate-800">
                        <FiMapPin className="w-6 h-6 opacity-60" />
                        <span className="font-black text-sm uppercase tracking-wide">Scholar Way, Austin, TX</span>
                     </div>
                  </div>
                  <a
                     href="mailto:admin@desun.com"
                     className="block w-full bg-slate-900 hover:bg-[#8cc63f] text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-widest text-center transition-all shadow-xl mt-4 active:scale-95"
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
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">How it Works</h2>
               </div>

               <div className="relative">
                  <div className="absolute top-10 left-0 w-full h-[6px] bg-[#e1edcf] hidden md:block rounded-full overflow-hidden">
                     <div className="h-full bg-[#8cc63f] w-[100%] rounded-full opacity-60 animate-pulse"></div>
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
                              <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-[#8cc63f] text-3xl shadow-xl group-hover:scale-110 transition-transform group-hover:bg-[#8cc63f] group-hover:text-white border-2 border-transparent group-hover:border-white transform-gpu">
                                 <step.icon />
                              </div>
                           </div>
                           <h4 className="text-lg font-black text-slate-900 mb-2">{step.title}</h4>
                           <p className="text-gray-400 font-bold text-[11px] leading-relaxed px-4">{step.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* Upcoming Academic Contests Carousel - COMPACT VERTICAL CARDS */}
         <section className="py-12 bg-white/40 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                  <span className="text-[#a68945] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Engage & Compete</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Academic Contests</h2>
               </div>
               <div className="flex gap-4">
                  <button
                     onClick={handlePrev}
                     className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#8cc63f] shadow-lg hover:shadow-[#8cc63f]/20 transition-all active:scale-90"
                  >
                     <FiChevronLeft size={24} />
                  </button>
                  <button
                     onClick={handleNext}
                     className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#8cc63f] shadow-lg hover:shadow-[#8cc63f]/20 transition-all active:scale-90"
                  >
                     <FiChevronRight size={24} />
                  </button>
               </div>
            </div>

            <div className="relative h-[550px] max-w-[1440px] mx-auto flex items-center justify-center pt-8">
               {/* LEFT CARD */}
               <div
                  className="absolute left-[5%] xl:left-[15%] w-[250px] md:w-[350px] transform scale-[0.7] opacity-10 md:opacity-20 blur-[4px] transition-all duration-1000 select-none z-10 pointer-events-none hidden lg:block transform-gpu"
                  style={{ transform: 'translateX(-50%)' }}
               >
                  <div className="bg-white p-6 rounded-[48px] shadow-sm flex flex-col gap-6">
                     <img src={contests[getCardIndex(-1)].image} className="w-full h-[250px] object-cover rounded-[36px] grayscale" alt="Contest" />
                     <div className="py-2"><h3 className="text-xl font-black text-slate-200">{contests[getCardIndex(-1)].title}</h3></div>
                  </div>
               </div>

               {/* CENTER CARD (ACTIVE) */}
               <div className="relative w-full max-w-[90%] md:max-w-[300px] lg:max-w-[330px] transform-gpu scale-100 z-30 transition-all duration-1000 px-4 select-none touch-pan-y">
                  <div className="bg-white p-6 md:p-8 rounded-[48px] shadow-2xl border border-[#8cc63f]/10 flex flex-col items-center group">
                     <div className="w-full h-[250px] md:h-[280px] rounded-[36px] overflow-hidden shrink-0 transform-gpu shadow-xl relative">
                        <img
                           src={contests[currentIndex].image}
                           className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 transform-gpu"
                           alt="Active Contest"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     </div>
                     <div className="flex-1 space-y-4 text-center mt-6">
                        <div className="flex items-center justify-center gap-3">
                           <span className="text-[9px] font-black text-[#5c8a14] uppercase tracking-widest py-1 px-3 bg-[#8cc63f]/10 rounded-lg">
                              {contests[currentIndex].category}
                           </span>
                           <FaTrophy className="text-[#fbc111] animate-bounce" size={18} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                           {contests[currentIndex].title}
                        </h3>
                        <div className="flex items-center justify-center gap-3 py-3 border-t border-gray-50 mt-4">
                           <FiMapPin className="text-[#8cc63f] size={14}" />
                           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{contests[currentIndex].date}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* RIGHT CARD */}
               <div
                  className="absolute right-[5%] xl:right-[15%] w-[250px] md:w-[350px] transform scale-[0.7] opacity-10 md:opacity-20 blur-[4px] transition-all duration-1000 select-none z-10 pointer-events-none hidden lg:block transform-gpu"
                  style={{ transform: 'translateX(50%)' }}
               >
                  <div className="bg-white p-6 rounded-[48px] shadow-sm flex flex-col gap-6">
                     <img src={contests[getCardIndex(1)].image} className="w-full h-[250px] object-cover rounded-[36px] grayscale" alt="Contest" />
                     <div className="py-2"><h3 className="text-xl font-black text-slate-200">{contests[getCardIndex(1)].title}</h3></div>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </div>
   );
};

export default LandingPage;
