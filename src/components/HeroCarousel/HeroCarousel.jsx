import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroCarousel = React.memo(({ contests, loading }) => {
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (!contests || contests.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % contests.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [contests]);

  return (
    <section className="w-full">
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[480px] overflow-hidden shadow-2xl group text-left">
        {loading ? (
          <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#8cc63f] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {contests.map((contest, idx) => (
              <div 
                key={contest.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Thumbnail from Backend */}
                {contest.thumbnailUrl ? (
                  <img src={contest.thumbnailUrl} alt={contest.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#4a7010] to-[#2e4a07]"></div> // Fallback background if no image
                )}
                
                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
                
                {/* Content inside Carousel */}
                <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 max-w-3xl">
                   {contest.tag && (
                     <span className="inline-block bg-[#fbc111] text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 w-max shadow-lg shadow-[#fbc111]/20">
                        {contest.tag}
                     </span>
                   )}
                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 animate-in slide-in-from-bottom-4 duration-700">
                      {contest.title}
                   </h1>
                   
                   {contest.subtitle && (
                     <p className="text-gray-300 font-bold text-sm md:text-base leading-relaxed mb-6 max-w-xl animate-in slide-in-from-bottom-6 duration-700 delay-100">
                        {contest.subtitle}
                     </p>
                   )}

                   
                   {/* Optional Button */}
                   {contest.buttonText && (
                     <Link 
                       to={`/student/contests/${contest.id}`}
                       className="bg-[#8cc63f] hover:bg-[#7ab332] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 w-max flex items-center gap-2 shadow-xl shadow-[#8cc63f]/30"
                     >
                        {contest.buttonText} <FiArrowRight size={16} />
                     </Link>
                   )}
                </div>
              </div>
            ))}

            {/* Dots indicator */}
            {contests.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {contests.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === heroIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
});

export default HeroCarousel;
