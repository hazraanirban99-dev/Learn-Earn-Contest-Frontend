// ============================================================
// HeroCarousel.jsx — Landing page er main auto-sliding carousel
// 10 ta modular image use kore transition animations handle kore.
// useCarousel hook use kora hoyeche timer logic er jonno.
// Pagination dots click korle specific slide e scroll hoy.
// Premium backdrop filters r overlay text styling ekhane ache.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const HeroCarousel = React.memo(({ contests, loading }) => {
  const { user } = useAuth();
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
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden shadow-2xl group text-left">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes blink-float {
            0%, 100% { opacity: 1; transform: translateY(0) scale(1); }
            50% { opacity: 0.5; transform: translateY(-4px) scale(0.85); }
          }
          @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3.5); opacity: 0; }
          }
          @keyframes fade-status {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .animate-status-blink {
            animation: blink-float 1.2s ease-in-out infinite;
          }
          .animate-ripple {
            animation: ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-fade-status {
            animation: fade-status 2s ease-in-out infinite;
          }
        `}} />
        {loading ? (
          <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 rounded-full spinner-dual"></div>
          </div>
        ) : (
          <>
            {contests.map((contest, idx) => {
              const isLive = contest.tag?.toLowerCase().includes('live');
              const isJoinNow = contest.buttonText?.toLowerCase().includes('join');

              return (
                <div
                  key={contest.id || idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                  {/* Thumbnail from Backend */}
                  {contest.thumbnailUrl ? (
                    <img src={contest.thumbnailUrl} alt={contest.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#4a7010] to-[#2e4a07]"></div>
                  )}

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent"></div>

                  {/* Content inside Carousel */}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-20 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {contest.tag && (
                        <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-lg ${isLive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-[#fbc111] text-slate-900 dark:text-gray-100 shadow-[#fbc111]/20'
                          }`}>
                          <div className="flex items-center gap-2">
                            {isLive && (
                              <div className="relative flex items-center justify-center">
                                <span className="absolute w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ripple" />
                                <span className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              </div>
                            )}
                            {contest.tag}
                          </div>
                        </div>
                      )}

                      {contest.domain && (
                        <div className="bg-[#fbc111]/10 text-[#fbc111] border border-[#fbc111]/20 px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-lg flex items-center">
                          <span className="animate-fade-status">{contest.domain}</span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4 sm:mb-6 animate-in slide-in-from-bottom-4 duration-700">
                      {contest.title}
                    </h1>

                    {contest.subtitle && (
                      <p className="text-gray-300 font-bold text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl animate-in slide-in-from-bottom-6 duration-700 delay-100 line-clamp-3 sm:line-clamp-none">
                        {contest.subtitle}
                      </p>
                    )}

                    {/* Optional Button */}
                    {contest.buttonText && (
                      <Link
                        to={isJoinNow ? (user ? `/student/contests/${contest.id}` : `/login?redirect=/student/contests/${contest.id}`) : `/student/contests/${contest.id}`}
                        className={`${isJoinNow
                            ? 'bg-[#8cc63f]/20 hover:bg-[#8cc63f]/30 text-[#8cc63f] border border-[#8cc63f]/40 backdrop-blur-sm shadow-emerald-500/10'
                            : 'bg-[#8cc63f] hover:bg-[#7ab332] text-white shadow-[#8cc63f]/30'
                          } px-8 sm:px-10 py-3.5 sm:py-4 rounded-[20px] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 w-max flex items-center gap-2 shadow-xl`}
                      >
                        {contest.buttonText} <FiArrowRight size={14} sm:size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Dots indicator */}
            {contests.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {contests.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 shadow-sm ${idx === heroIndex ? 'w-10 bg-[#fbc111] shadow-[0_0_15px_rgba(251,193,17,0.4)]' : 'w-2 bg-[#8cc63f]/60 hover:bg-[#8cc63f]'
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
