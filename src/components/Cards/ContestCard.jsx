import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ApplyContestModal from '../Modals/ApplyContestModal';

const ContestCard = React.memo(({ contest, index, variant = 'dashboard' }) => {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const isOngoing = contest.status === 'ONGOING';
    const isUpcoming = contest.status === 'UPCOMING';
    const isCompleted = contest.status === 'COMPLETED';

    const statusClasses = isOngoing 
        ? 'text-emerald-500 bg-emerald-50' 
        : isUpcoming 
            ? 'text-blue-500 bg-blue-50' 
            : 'text-gray-500 bg-gray-100';

    const statusDotClasses = isOngoing 
        ? 'bg-emerald-500 animate-pulse' 
        : isUpcoming 
            ? 'bg-blue-500' 
            : 'bg-gray-400';

    return (
        <div 
            className="bg-white p-8 pt-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#8cc63f]/5 transition-all flex flex-col h-full group relative overflow-hidden"
        >
            {/* Alternating Top Line */}
            <div className={`absolute top-0 left-0 w-full h-2 ${index % 2 === 0 ? 'bg-[#8cc63f]' : 'bg-[#fbc111]'}`}></div>
            
            {/* Card Header (Icon & Tag) */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#f8faf2] rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50">
                    {contest.icon}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 ${statusClasses}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDotClasses}`}></div>
                    {contest.status}
                </span>
            </div>
            
            {/* Card Body */}
            <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-[#5c8a14] transition-colors line-clamp-2">
                    {contest.title}
                </h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed line-clamp-3 mb-6">
                    {contest.desc}
                </p>
            </div>

            {/* Card Footer (Date/Winner & CTA) */}
            <div className="mt-auto pt-6 border-t border-gray-50">
                {variant === 'dashboard' ? (
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">{contest.dateInfo}</p>
                            <p className="text-sm font-black text-slate-800">{contest.dateValue}</p>
                        </div>
                        <Link 
                            to={`/student/contests/${contest.id}`}
                            className="bg-[#fbc111]/10 hover:bg-[#fbc111] text-[#d4a017] hover:text-slate-900 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all"
                        >
                            View Details
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 mt-auto">
                        {hasApplied ? (
                            <button 
                                disabled 
                                className="flex-1 bg-gray-100 text-gray-400 py-3 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest cursor-not-allowed border border-gray-200"
                            >
                                ✅ Applied
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsApplyModalOpen(true)}
                                className="flex-1 bg-[#8cc63f] hover:bg-[#7ab332] cursor-pointer text-white py-3 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#8cc63f]/20 active:scale-95 text-center"
                            >
                                Apply Now
                            </button>
                        )}
                        <Link 
                            to={`/student/contests/${contest.id}`}
                            className="flex-1 bg-[#fbc111] hover:bg-[#e0ad0c] cursor-pointer text-white py-3 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#fbc111]/20 active:scale-95 text-center flex items-center justify-center font-bold"
                        >
                            View Details
                        </Link>
                    </div>
                )}
            </div>

            {/* Modal for Application */}
            <ApplyContestModal 
                isOpen={isApplyModalOpen} 
                onClose={() => setIsApplyModalOpen(false)} 
                contestId={contest.id} 
                onSuccess={() => {
                    setIsApplyModalOpen(false);
                    setHasApplied(true);
                }} 
            />
        </div>
    );
});

export default ContestCard;
