import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const Ratings = () => {
   const ratingsData = [
      { label: 'Student Ratings', score: '4', total: '5', color: '#8cc63f' },
      { label: 'Participant Rating', score: '4.5', total: '5', color: '#fbc111' },
      { label: 'Contest Rating', score: '5', total: '5', color: '#8cc63f' },
      { label: 'Reward Rating', score: '4', total: '5', color: '#fbc111' }
   ];

   return (
      <section className="py-16 bg-[#f8faf2] dark:bg-gray-900">
         <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
            <div className="text-center mb-12">
               <span className="text-[#a68945] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Our Performance</span>
               <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-gray-100 tracking-tight">Ratings</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {ratingsData.map((rating, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all text-center group relative overflow-hidden">
                     <div className="relative z-10">
                        <div className="text-4xl font-black mb-2" style={{ color: rating.color }}>
                           {rating.score}
                           <span className="text-lg text-gray-300 ml-1">/ {rating.total}</span>
                        </div>
                        <div className="flex justify-center gap-1 mb-4">
                           {[...Array(5)].map((_, i) => {
                              const fullStars = Math.floor(parseFloat(rating.score));
                              const hasHalfStar = parseFloat(rating.score) % 1 !== 0;

                              if (i < fullStars) return <FaStar key={i} className="text-[#fbc111]" size={16} />;
                              if (i === fullStars && hasHalfStar) return <FaStarHalfAlt key={i} className="text-[#fbc111]" size={16} />;
                              return <FaRegStar key={i} className="text-gray-200" size={16} />;
                           })}
                        </div>
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">{rating.label}</h4>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default Ratings;
