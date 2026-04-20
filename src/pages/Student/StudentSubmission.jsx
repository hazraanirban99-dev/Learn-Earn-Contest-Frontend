// ============================================================
// StudentSubmission.jsx — Student er submission management page
// Ekhane 2 ta section ache:
//   1. "Currently Applied Contests" — jeguloy apply koreche kintu submit koreni
//   2. "Past Submissions" — age submit kora contests r tader score/status
// "Submit Project" click hole SubmitContestModal open hoy.
// Submit successful hole data auto refresh hoy (fetchSubmissionsData call).
// Domain name er mapping kora hoy UI friendly format e.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SubmitContestModal from '../../components/Modals/SubmitContestModal';
import { FiFileText, FiAward, FiClock, FiCheckCircle, FiMoreHorizontal, FiCode, FiLayout, FiTrendingUp, FiMessageSquare, FiX } from 'react-icons/fi';
import ContestCard from '../../components/Cards/ContestCard';
import PageTransition from '../../components/Common/PageTransition';
import api from '../../utils/api';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';

const StudentSubmission = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appliedContests, setAppliedContests] = useState([]);
    const [pastSubmissions, setPastSubmissions] = useState([]);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedContest, setSelectedContest] = useState(null);
    const [activeFeedbackId, setActiveFeedbackId] = useState(null);

    const domainMap = {
        'MERN': 'MERN',
        'UIUX': 'UI/UX',
        'DIGITAL MARKETING': 'Digital Marketing',
        'Development': 'MERN'
    };

    const fetchSubmissionsData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Past Submissions
            const submissionsRes = await api.get('/student/submissions/past');
            const submissions = submissionsRes.data.success ? submissionsRes.data.data : [];
            
            // Map Submissions to UI format
            const mappedSubmissions = submissions.map(sub => ({
                id: sub._id,
                contestId: sub.contestId?._id,
                name: sub.contestId?.title || "Unknown Contest",
                date: formatDateDDMMYYYY(sub.createdAt),
                domain: domainMap[sub.contestId?.domain] || sub.contestId?.domain || 'General',
                status: sub.status === 'REVIEWED' ? 'Evaluated' : 'Under Review',
                score: sub.score,
                feedback: sub.feedback || null,
                teamName: sub.participantId?.teamId?.name || null,
                icon: sub.status === 'REVIEWED' ? <FiCheckCircle /> : <FiMoreHorizontal />
            }));
            setPastSubmissions(mappedSubmissions);

            // 2. Fetch Enrolled Contests (Applied kintu submit kora hoyni emon contest)
            const enrolledRes = await api.get('/student/contests/enrolled');
            const enrolled = enrolledRes.data.success ? enrolledRes.data.data : [];

            // Filter kora hoche jাতে ek-i contest Applied r Past duto list-e na thake
            const submittedContestIds = mappedSubmissions.map(s => s.contestId);
            
            const filteredEnrolled = enrolled
                .filter(c => !submittedContestIds.includes(c._id))
                .map(c => ({
                    id: c._id,
                    title: c.title,
                    desc: c.description,
                    domain: domainMap[c.domain] || c.domain || 'General',
                    status: c.status,
                    enrollmentStatus: c.enrollmentStatus,
                    teamName: c.teamName || null,
                    teamStatus: c.teamStatus || null,
                    projectType: c.projectType || null,
                    dateInfo: c.status === 'ONGOING' ? "ENDS SOON" : "STARTS",
                    dateValue: formatDateDDMMYYYY(c.endDate),
                    thumbnail: c.thumbnail?.url || null,
                    participantsCount: c.participantsCount || 0
                }));

            setAppliedContests(filteredEnrolled);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load submission data");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSubmissionsData();
    }, []);

    const handleOpenSubmit = (contest) => {
        setSelectedContest(contest);
        setIsSubmitModalOpen(true);
    };

    const handleSubmissionSuccess = () => {
        setIsSubmitModalOpen(false);
        fetchSubmissionsData(); // Refresh data
    };

    return (
        <div className="min-h-screen bg-[#f8faf2] dark:bg-gray-900 font-sans selection:bg-[#8cc63f]/30">
            <PageTransition>
                {/* ── PAGE HEADER ─────────────────────────────────────── */}
                <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pt-32 pb-8">
                    <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                        Scholastic Atelier
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-[1.05] mb-4">
                        My Contests
                    </h1>
                    <p className="text-gray-500 font-medium text-sm max-w-2xl">
                        Monitor your competitive progress and active applications. Review past performances and track your journey through the Desun ecosystem.
                    </p>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pb-24">
                    
                    {/* ── CURRENTLY APPLIED CONTESTS ──────────────────────── */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-gray-100">Currently Applied Contests</h2>
                            <div className="w-20 h-2 bg-[#8cc63f] rounded-full hidden sm:block"></div>
                        </div>
                        
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-[40px] h-64 animate-pulse"></div>
                                ))}
                            </div>
                        ) : appliedContests.length === 0 ? (
                            <div className="bg-white/ dark:bg-gray-800/ border border-dashed border-gray-200 dark:border-gray-700 rounded-[40px] py-16 text-center">
                                <p className="text-gray-400 font-bold">No active applications found.</p>
                                <button onClick={() => navigate('/student/contests')} className="mt-4 text-[#8cc63f] font-black text-xs uppercase tracking-widest hover:underline">Explore Contests</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {appliedContests.map((contest, index) => (
                                    <ContestCard 
                                        key={contest.id}
                                        contest={contest}
                                        index={index}
                                        variant="submission"
                                        onAction={() => handleOpenSubmit(contest)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── PAST SUBMISSIONS ────────────────────────────────── */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-gray-100 mb-8">Past Submissions</h2>
                        
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-[32px] h-32 animate-pulse"></div>
                                ))}
                            </div>
                        ) : pastSubmissions.length === 0 ? (
                            <div className="text-center py-12 bg-white/ dark:bg-gray-800/ rounded-[32px] border border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-gray-400 font-bold">No past submissions found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pastSubmissions.map((sub, idx) => (
                                    <div key={sub.id} className="bg-[#f2f8e9]/50 dark:bg-gray-800 border border-[#8cc63f]/10 dark:border-gray-700/50 rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#f2f8e9] dark:hover:bg-gray-700/50 transition-all relative overflow-hidden group">
                                        {/* Left strip indicator for pending ones */}
                                        {sub.status === 'Under Review' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#fbc111]"></div>
                                        )}
                                        
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                                                sub.status === 'Evaluated' ? 'bg-[#8cc63f]/20 text-[#4a7010]' : 'bg-[#fbc111]/20 text-[#d9a50e]'
                                            }`}>
                                                {sub.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-800 dark:text-gray-100 mb-0.5">{sub.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{sub.date}</span>
                                                    {sub.teamName && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                            <span className="text-[10px] text-purple-600 dark:text-[#8cc63f] font-black uppercase tracking-wider">TEAM: {sub.teamName}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-700/40 px-4 py-2 rounded-xl">
                                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">STATUS:</span>
                                                <span className={`text-[11px] font-black ${
                                                    sub.status === 'Evaluated' 
                                                        ? 'text-[#4a7010] dark:text-[#8cc63f]' 
                                                        : 'text-[#d9a50e] dark:text-[#fbc111]'
                                                }`}>
                                                    {sub.status}
                                                </span>
                                            </div>

                                            {sub.status === 'Evaluated' ? (
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="bg-[#8cc63f]/10 px-4 py-2 rounded-xl flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-[#5c8a14] uppercase">SCORE:</span>
                                                        <span className="text-sm font-black text-slate-800 dark:text-gray-100">{sub.score || 0}</span>
                                                    </div>
                                                    {sub.feedback && (
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setActiveFeedbackId(activeFeedbackId === sub.id ? null : sub.id)}
                                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                                    activeFeedbackId === sub.id
                                                                        ? 'bg-[#fbc111] text-white border-[#fbc111]'
                                                                        : 'bg-[#fbc111]/10 text-[#d9a50e] border-[#fbc111]/20 hover:bg-[#fbc111]/20'
                                                                }`}
                                                            >
                                                                <FiMessageSquare size={11} />
                                                                Feedback
                                                            </button>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/student/leaderboard/${sub.contestId}`)}
                                                        className="px-4 py-2 text-xs font-black text-[#4a7010] dark:text-[#8cc63f] hover:underline transition-all"
                                                    >
                                                        Full Leaderboard
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    className="px-4 py-2 text-xs font-black text-gray-400 cursor-not-allowed transition-all"
                                                >
                                                    Review Locked
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>

            <SubmitContestModal 
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                contest={selectedContest}
                onSuccess={handleSubmissionSuccess}
            />

            {/* 
               FEEDBACK BUBBLE OVERLAY (Z-axis Portal-like logic) 
               Eta page level fixed position-e thake j jate kono container overflow hiden na hoy.
            */}
            {activeFeedbackId && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-start justify-end p-4 pointer-events-none"
                    onClick={() => setActiveFeedbackId(null)}
                >
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm pointer-events-auto" />
                    
                    <div 
                        className="relative mt-20 mr-4 w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-4 border-[#fbc111] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-[#fbc111] px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center font-black text-[#8cc63f]">
                                    FE
                                </div>
                                <span className="font-black text-slate-800 dark:text-gray-100 uppercase tracking-tighter">Evaluator Feedback</span>
                            </div>
                            <button 
                                onClick={() => setActiveFeedbackId(null)}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <FiX className="text-slate-800 dark:text-gray-100" size={20} />
                            </button>
                        </div>

                        {/* Message Body (SMS Style) */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-slate-50 dark:bg-gray-900/50">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tr-none shadow-sm border border-slate-100 dark:border-gray-700 relative">
                                <p className="text-slate-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                    {pastSubmissions.find(s => s.id === activeFeedbackId)?.feedback}
                                </p>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-bold block mt-2 text-right">
                                    {pastSubmissions.find(s => s.id === activeFeedbackId)?.date}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentSubmission;
