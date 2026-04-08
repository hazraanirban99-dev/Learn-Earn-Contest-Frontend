import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import SubmitContestModal from '../../components/Modals/SubmitContestModal';
import { FiFileText, FiAward, FiClock, FiCheckCircle, FiMoreHorizontal, FiCode, FiLayout, FiTrendingUp } from 'react-icons/fi';
import ContestCard from '../../components/Cards/ContestCard';

const MOCK_APPLIED_CONTESTS = [
    {
        id: '1',
        title: 'Algorithmic Geometry Challenge 2024',
        desc: 'Explore the intersection of Euclidean geometry and computational complexity in this advanced challenge.',
        domain: 'Development',
        status: 'ONGOING',
        icon: <FiCode />,
        dateInfo: 'ENDS IN',
        dateValue: '2 Days',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Kinematics & Fluid Dynamics Symposium',
        desc: 'Solve complex fluid simulation problems and optimize solver performance for real-time applications.',
        domain: 'Physics',
        status: 'ONGOING',
        icon: <FiCode />,
        dateInfo: 'ENDS IN',
        dateValue: '5 Days',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Secure Systems Architecture Hackathon',
        desc: 'Build resilient systems that withstand adversarial attacks while maintaining high throughput.',
        domain: 'Development',
        status: 'ONGOING',
        icon: <FiCode />,
        dateInfo: 'ENDS IN',
        dateValue: '12 Hours',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'
    }
];

const MOCK_PAST_SUBMISSIONS = [
    { 
        id: '101', 
        name: 'Quantum Mechanics Mid-Year Invitational', 
        date: 'Oct 24, 2023',
        domain: 'Physics Division',
        status: 'Evaluated',
        rank: '#12 / 450',
        actionText: 'View Feedback',
        icon: <FiCheckCircle />
    },
    { 
        id: '102', 
        name: 'Data Science & Ethics Symposium', 
        date: 'Nov 02, 2023',
        domain: 'Data Science',
        status: 'Under Review',
        rank: 'Pending',
        actionText: 'Review Locked',
        icon: <FiMoreHorizontal />
    },
    { 
        id: '103', 
        name: 'Global Economics Case Study Competition', 
        date: 'Sept 15, 2023',
        domain: 'Humanities',
        status: 'Evaluated',
        rank: '#3 / 1,200',
        actionText: 'Download Certificate',
        icon: <FiAward />
    }
];

const StudentSubmission = () => {
    const navigate = useNavigate();
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedContest, setSelectedContest] = useState(null);

    const handleOpenSubmit = (contest) => {
        setSelectedContest(contest);
        setIsSubmitModalOpen(true);
    };

    const handleActionClick = (sub) => {
        if (sub.status === 'Under Review') {
            toast.info('Review is locked until evaluation is complete.');
            return;
        }
        if (sub.actionText === 'View Feedback') {
            navigate(`/student/leaderboard/${sub.id}`);
        } else {
            toast.success('Certificate Downloaded!');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf2] font-sans selection:bg-[#8cc63f]/30">
            <UserNavbar />

            {/* ── PAGE HEADER ─────────────────────────────────────── */}
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pt-16 pb-8">
                <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                    Scholastic Atelier
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.05] mb-4">
                    My Submissions
                </h1>
                <p className="text-gray-500 font-medium text-sm max-w-2xl">
                    Track your academic progress through competitive challenges. Manage active contest entries and review your performance history within the Desun ecosystem.
                </p>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pb-24">
                
                {/* ── CURRENTLY APPLIED CONTESTS ──────────────────────── */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-800">Currently Applied Contests</h2>
                        <div className="w-20 h-2 bg-[#8cc63f] rounded-full hidden sm:block"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_APPLIED_CONTESTS.map((contest, index) => (
                            <ContestCard 
                                key={contest.id}
                                contest={contest}
                                index={index}
                                variant="submission"
                                onAction={() => handleOpenSubmit(contest)}
                            />
                        ))}
                    </div>
                </div>

                {/* ── PAST SUBMISSIONS ────────────────────────────────── */}
                <div className="mb-12">
                    <h2 className="text-2xl font-black text-slate-800 mb-8">Past Submissions</h2>
                    
                    <div className="space-y-4">
                        {MOCK_PAST_SUBMISSIONS.map((sub, idx) => (
                            <div key={sub.id} className="bg-[#f2f8e9]/50 border border-[#8cc63f]/10 rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#f2f8e9] transition-all relative overflow-hidden">
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
                                        <h3 className="text-lg font-black text-slate-900 mb-1">{sub.name}</h3>
                                        <p className="text-sm font-medium text-gray-500">
                                            Submitted on {sub.date} • {sub.domain}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-2 rounded-xl">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">STATUS:</span>
                                        <span className={`text-[11px] font-black ${
                                            sub.status === 'Evaluated' ? 'text-[#4a7010]' : 'text-[#d9a50e]'
                                        }`}>
                                            {sub.status}
                                        </span>
                                    </div>

                                    {sub.status === 'Evaluated' ? (
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button 
                                                onClick={() => navigate(`/student/leaderboard/${sub.id}`)}
                                                className="px-4 py-2 text-xs font-black text-[#4a7010] hover:underline transition-all"
                                            >
                                                View Feedback
                                            </button>
                                            <button 
                                                onClick={() => toast.success('Certificate Downloaded!')}
                                                className="px-4 py-2 text-xs font-black text-[#4a7010] hover:underline transition-all"
                                            >
                                                Download Certificate
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/leaderboard/${sub.id}`)}
                                                className="px-4 py-2 text-xs font-black text-[#4a7010] hover:underline transition-all"
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
                </div>
            </div>

            <Footer />

            <SubmitContestModal 
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                contest={selectedContest}
                onSuccess={() => setIsSubmitModalOpen(false)}
            />
        </div>
    );
};

export default StudentSubmission;
