import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ApplyContestModal from '../Modals/ApplyContestModal';
import TeamDetailsModal from '../Modals/TeamDetailsModal';
// ============================================================
// ContestCard.jsx — Contest list er individual card component
// Contest er data (title, domain, dates, prize) prop hisebe receive kore.
// Status (ONGOING/UPCOMING/COMPLETED) onujayi badge color change hoy.
// Applied status logic ache jate "Applied" label show kore.
// Category icon selection logic dynamically domain onujayi kaj kore.
// Card click hole contest details page e navigate kore.
// ============================================================

import { toast } from 'react-toastify';
import { FiCheckCircle, FiAward, FiUsers } from 'react-icons/fi';
import { FaRupeeSign, FaGift } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ContestCard = React.memo(({ contest, index, variant = 'dashboard', onAction }) => {
    const { user } = useAuth();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const hasApplied = user?.enrolledContests?.some(id => id.toString() === contest.id?.toString()) || false;
    const hasSubmitted = user?.submittedContests?.some(id => id.toString() === contest.id?.toString()) || false;

    const isOngoing = contest.status === 'ONGOING';
    const isUpcoming = contest.status === 'UPCOMING';
    const isCompleted = contest.status === 'COMPLETED';

    const isTeamContest = contest.projectType === 'Team';

    const statusClasses = isOngoing 
        ? 'text-emerald-500 bg-emerald-50' 
        : isUpcoming 
            ? 'text-blue-500 bg-blue-50' 
            : 'text-gray-500 bg-gray-100';

    const statusDotColor = isOngoing 
        ? 'bg-emerald-500' 
        : isUpcoming 
            ? 'bg-blue-500' 
            : 'bg-gray-400';

    const handleAppliedClick = () => {
        toast.info("✅ You have already applied for this contest!", {
            position: "top-right",
            theme: "colored"
        });
    };

    return (
        <div 
            className="bg-white p-8 pt-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#8cc63f]/5 transition-all flex flex-col h-full group relative overflow-hidden"
        >
            {/* Alternating Top Line */}
            <div className={`absolute top-0 left-0 w-full h-2 ${index % 2 === 0 ? 'bg-[#8cc63f]' : 'bg-[#fbc111]'}`}></div>
            
            {/* Conditional Thumbnail */}
            {contest.thumbnail && (
                <div className="w-full h-40 mb-6 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow shrink-0">
                    <img src={contest.thumbnail} alt={contest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {/* Status Badge overlaying top right of thumbnail */}
                    <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2 shadow-lg backdrop-blur-md bg-opacity-95 ${statusClasses}`}>
                        <div className="relative flex h-2 w-2">
                            {isOngoing && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusDotColor} opacity-75`}></span>}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusDotColor}`}></span>
                        </div>
                        {contest.status}
                    </span>
                </div>
            )}

            {/* Card Header (Domain Text Badge & Prize) */}
            <div className={`flex items-start mb-6 ${!contest.thumbnail ? 'justify-between w-full' : ''}`}>
                <div className="flex gap-2 flex-wrap">
                    <div className="text-[#d4a017] bg-[#fbc111]/15 px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-lg border border-[#fbc111]/20">
                        {contest.domain || 'General'}
                    </div>
                    {contest.prize && (
                        <div className="text-[#5c8a14] bg-[#8cc63f]/15 px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-lg border border-[#8cc63f]/20 flex items-center gap-2">
                            <FaGift size={12} className="shrink-0" />
                            <div className="flex items-center gap-1">
                                <span>Prize Money : </span>
                                <div className="flex items-center gap-0.5 ml-1">
                                    <FaRupeeSign size={9} className="mb-0.5" />
                                    {contest.prize.toString().replace('₹', '')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Fallback status badge if no thumbnail exists */}
                {!contest.thumbnail && (
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2 ${statusClasses}`}>
                        <div className="relative flex h-2 w-2">
                            {isOngoing && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusDotColor} opacity-75`}></span>}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusDotColor}`}></span>
                        </div>
                        {contest.status}
                    </span>
                )}
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
                            
                            {contest.participantsCount !== undefined && (
                                <div className="mt-4">
                                    <p className="text-[10px] font-black text-[#5c8a14] tracking-widest uppercase mb-1">Enrolled Participants</p>
                                    <p className="text-sm font-black text-[#8cc63f]">{contest.participantsCount}</p>
                                </div>
                            )}
                        </div>
                        <Link 
                            to={`/student/contests/${contest.id}`}
                            className="bg-[#fbc111]/10 hover:bg-[#fbc111] text-[#d4a017] hover:text-slate-900 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all"
                        >
                            View Details
                        </Link>
                    </div>
                ) : variant === 'submission' ? (
                    <div className="flex flex-wrap gap-4 mt-auto">
                        <button 
                            onClick={() => onAction && onAction(contest)}
                            className="flex-1 bg-[#fbc111] hover:bg-[#ebaa00] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#fbc111]/20 active:scale-95 text-center"
                        >
                            Submit Your Response
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 mt-auto">
                        {isCompleted ? (
                            <div className="flex-1 bg-[#fbc111] py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-[#fbc111]/20 border border-[#fbc111] group">
                                <FiAward className="text-slate-900 group-hover:scale-125 transition-transform duration-300" size={16} />
                                <span className="text-slate-900 font-black text-[11px] uppercase tracking-wider text-center">
                                    Winner: {contest.winnerName || 'Announcing Soon'}
                                </span>
                            </div>
                        ) : hasApplied ? (
                            <div className="flex flex-col gap-2 flex-1">
                                {hasSubmitted && (
                                    <p className="text-[#fbc111] text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                                        * Response Submitted
                                    </p>
                                )}
                                <button 
                                    onClick={handleAppliedClick}
                                    className="w-full bg-[#8cc63f]/20 text-[#5c8a14] py-3 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest border border-[#8cc63f]/30 transition-all hover:bg-[#8cc63f]/30 cursor-pointer mb-2"
                                >
                                    ✅ Applied
                                </button>
                                {isTeamContest && (
                                    <button 
                                        onClick={() => setIsTeamOpen(true)}
                                        className="w-full bg-[#fbc111]/10 text-[#ebaa00] py-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border border-[#fbc111]/20 transition-all hover:bg-[#fbc111]/20 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <FiUsers size={14} /> View Team
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={() => {
                                    if (isUpcoming) {
                                        toast.warning("🔔 It's an upcoming contest. Please wait and apply when it gets active!", {
                                            position: "top-right",
                                            autoClose: 4000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            theme: "light",
                                            icon: false
                                        });
                                        return;
                                    }
                                    setIsApplyModalOpen(true);
                                }}
                                className={`flex-1 ${isUpcoming ? 'bg-amber-400 hover:bg-amber-500' : 'bg-[#8cc63f] hover:bg-[#7ab332]'} cursor-pointer text-white py-3 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 text-center`}
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
                contest={contest}
                onSuccess={() => {
                    setIsApplyModalOpen(false);
                    setHasApplied(true);
                }}
            />

            <TeamDetailsModal 
                isOpen={isTeamOpen}
                onClose={() => setIsTeamOpen(false)}
                contestId={contest.id}
                contestTitle={contest.title}
            />
        </div>
    );
});

export default ContestCard;
