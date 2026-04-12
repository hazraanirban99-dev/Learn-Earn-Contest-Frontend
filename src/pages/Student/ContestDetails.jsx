// ============================================================
// ContestDetails.jsx — Ekta specific contest er detail page (Student)
// URL param :id theke contest fetch kora hoy.
// Contest info, prizes, timeline, countdown timer dekhano hoy.
// hasApplied — AuthContext er enrolledContests theke check hoy.
// hasSubmitted — user ar submittedContests theke check kora hoy.
// Apply button click korle ApplyContestModal open hoy.
// Same domain er related contests show kora hoy niche.
// Syllabus PDF download korar option ache.
// ============================================================

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import ApplyContestModal from '../../components/Modals/ApplyContestModal';
import TeamDetailsModal from '../../components/Modals/TeamDetailsModal';
import { Logo } from '../../components/index';
import ContestCard from '../../components/Cards/ContestCard';
import { FiBookOpen, FiDownload, FiCheckCircle, FiClock, FiCalendar, FiDollarSign, FiAward, FiBriefcase, FiCode, FiLayout, FiTrendingUp, FiGlobe, FiUsers } from 'react-icons/fi';
import PageTransition from '../../components/Common/PageTransition';
import api from '../../utils/api';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';

import { useAuth } from '../../context/AuthContext';

const getDomainIcon = (domain) => {
    switch (domain?.toLowerCase()) {
        case 'development': return <FiCode />;
        case 'ui/ux': return <FiLayout />;
        case 'marketing': return <FiTrendingUp />;
        default: return <FiGlobe />;
    }
};

const ContestDetails = () => {
    const { user, updateUser } = useAuth();
    const { id } = useParams();
    const [contest, setContest] = React.useState(null);
    const [relatedContests, setRelatedContests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = React.useState(false);
    const [withdrawLoading, setWithdrawLoading] = React.useState(false);
    const [teamData, setTeamData] = React.useState(null); // holds entire team object
    const [enrollmentStatus, setEnrollmentStatus] = React.useState('REGISTERED'); // Solo participant status
    
    // Derived states for real-time sync with AuthContext
    const hasApplied = user?.enrolledContests?.some(cid => cid.toString() === id?.toString()) || false;
    const hasSubmitted = user?.submittedContests?.some(cid => cid.toString() === id?.toString()) || false;

    useEffect(() => {
        const fetchContestData = async () => {
            setLoading(true);
            try {
                // 1. Specific Contest Details
                const res = await api.get(`/contests/${id}`);
                if (res.data.success) {
                    setContest(res.data.data);
                }

                // 2. Fetch all contests to find related ones
                const allRes = await api.get('/contests');
                if (allRes.data.success) {
                    const domainMatch = res.data.data.domain;
                    const related = allRes.data.data
                        .filter(c => c.domain === domainMatch && c._id !== id)
                        .slice(0, 4)
                        .map(c => ({
                            id: c._id,
                            title: c.title,
                            desc: c.description,
                            status: c.status,
                            icon: getDomainIcon(c.domain),
                            dateInfo: "End Date",
                            dateValue: formatDateDDMMYYYY(c.endDate),
                            thumbnail: c.thumbnail?.url || null,
                            participantsCount: c.participantsCount || 0,
                            prize: c.cashPrize && c.cashPrize > 0 ? `₹${c.cashPrize}` : null,
                            domain: c.domain
                        }));
                    setRelatedContests(related);
                }
            } catch (error) {
                console.error("Error fetching contest details:", error);
                toast.error("Failed to load contest details");
            } finally {
                setLoading(false);
            }
        };

        fetchContestData();

        // 3. Fetch enrollment status if applied (Team status r individual registry check kora hoy)
        let statusInterval;
        const fetchStatus = async () => {
            if (hasApplied) {
                try {
                    const res = await api.get(`/student/team-status/${id}`);
                    if (res.data.success && res.data.data) {
                        setTeamData(res.data.data);
                        setEnrollmentStatus(res.data.data.enrollmentStatus); // Individual status (REGISTERED / SUBMITTED etc)
                    }
                } catch (error) {
                    console.log("Not in a team or enrollment status fetch failed");
                }
            }
        };

        fetchStatus();
        if (hasApplied) {
            statusInterval = setInterval(fetchStatus, 10000); // Poll every 10s
        }

        return () => {
            if (statusInterval) clearInterval(statusInterval);
        };
    }, [id, hasApplied]);

    const handleDownload = () => {
        if (contest?.syllabus?.url) {
            window.open(contest.syllabus.url, '_blank');
        } else {
            toast.info("No syllabus available for this contest.");
        }
    };

    const handleAppliedClick = () => {
        toast.info("✅ You have already applied for this contest!", {
            position: "top-right",
            theme: "colored"
        });
    };

    const handleWithdrawAction = async (toastId) => {
        toast.dismiss(toastId);
        setWithdrawLoading(true);
        try {
            const res = await api.post('/student/contests/withdraw', { contestId: id });
            if (res.data.success) {
                // Refetch user profile to sync across global context
                const userRes = await api.get('/users/me');
                if (userRes.data.success) {
                    updateUser(userRes.data.data);
                }
                toast.success("Withdrawn from contest successfully.");
                
                // Update local contest data to show updated participantsCount
                setContest(prev => ({
                    ...prev,
                    participantsCount: Math.max(0, (prev.participantsCount || 1) - 1)
                }));
            }
        } catch (error) {
            console.error("Withdrawal error:", error);
            toast.error(error.response?.data?.message || "Failed to withdraw from contest.");
        } finally {
            setWithdrawLoading(false);
        }
    };

    const handleWithdraw = () => {
        const confirmToast = toast.info(
            <div className="p-1">
                <p className="text-xs font-black uppercase tracking-wider mb-3 text-slate-800">Withdraw from this contest?</p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleWithdrawAction(confirmToast)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors cursor-pointer"
                    >
                        Confirm
                    </button>
                    <button 
                        onClick={() => toast.dismiss(confirmToast)}
                        className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                icon: false
            }
        );
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!contest) return;

        const calculateTimeLeft = () => {
            const targetDate = contest.status === 'UPCOMING' ? contest.startDate : contest.endDate;
            if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    expired: false
                };
            } else {
                timeLeft.expired = true;
            }
            return timeLeft;
        };

        const timer = setInterval(() => {
            const newTime = calculateTimeLeft();
            
            // Auto-switch status if countdown ends for UPCOMING
            if (newTime.expired && contest.status === 'UPCOMING') {
                setContest(prev => ({ ...prev, status: 'ONGOING' }));
            } else {
                setTimeLeft(newTime);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [contest]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8faf2] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-transparent border-t-[#8cc63f] border-b-[#fbc111] rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Loading Contest Atelier...</p>
                </div>
            </div>
        );
    }

    if (!contest) {
        return (
            <div className="min-h-screen bg-[#f8faf2] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800 mb-4">Contest Not Found</h2>
                    <Link to="/student/contests" className="text-[#8cc63f] font-bold hover:underline">Return to All Contests</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8faf2] font-sans selection:bg-[#8cc63f]/30 overflow-x-hidden">
            <UserNavbar />
            <PageTransition>
                {/* --- SPLIT HEADER SECTION (50/50 Text/Image) --- */}
                <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pt-12 pb-12 flex flex-col md:flex-row gap-8 lg:gap-16 items-center">

                    {/* Left Header - Text (50%) */}
                    <div className="flex-1 lg:w-1/2">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="bg-[#8cc63f] text-slate-900 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                                {contest.status}
                            </span>
                            <span className="bg-[#ecf0e6] text-gray-500 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                                {contest.domain}
                            </span>
                            <span className="bg-[#fbc111] text-slate-900 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                                {contest.rigor || 'Medium'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
                            {contest.title}
                        </h1>

                        {/* Standard Text Formatting */}
                        <div className="text-gray-500 space-y-6 text-sm lg:text-base leading-relaxed mb-6 font-medium">
                            <p>
                                {contest.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Header - Thumbnail (50%) */}
                    <div className="w-full md:w-1/2 flex items-center justify-center">
                        <div className="w-full h-[300px] md:h-[400px] rounded-[40px] overflow-hidden shadow-2xl relative border-[6px] border-white ring-1 ring-slate-100">
                            <img
                                src={contest.thumbnail?.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"}
                                alt={contest.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                        </div>
                    </div>

                </div>

                {/* --- PROJECT SYLLABUS SECTION (Right after Thumbnail) --- */}
                <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 mb-16">
                    <div className="bg-[#ecf0e6] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-[#8cc63f]/10">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#e1e6d8] rounded-2xl flex items-center justify-center text-2xl text-[#6b8f36] shrink-0">
                                <FiBookOpen />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 mb-1 font-sans">Project Syllabus</h3>
                                <p className="text-sm font-bold text-gray-500">Comprehensive guidelines, dataset specs, and submission documentation.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="bg-[#8cc63f] hover:bg-[#7ab332] cursor-pointer text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[#8cc63f]/30 active:scale-95 flex items-center gap-2 shrink-0 w-full md:w-auto justify-center"
                        >
                            Download PDF <FiDownload size={14} />
                        </button>
                    </div>
                </div>

                {/* --- MAIN CONTENT OVERHAUL: ROW 1 (WIDGETS) & ROW 2 (RULES/LOGO) --- */}
                <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pb-24">

                    {/* --- ROW 1: PRIZES, TIMELINE, APPLY NOW (SIDE-BY-SIDE) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch mb-16">

                        {/* Grand Prizes Widget */}
                        <div className="bg-gradient-to-br from-[#4a7010] to-[#2e4a07] p-8 lg:p-10 rounded-[40px] text-white overflow-hidden relative shadow-2xl shadow-[#4a7010]/20 min-h-[300px] flex flex-col justify-center">
                            <FiAward className="absolute -bottom-8 -right-8 text-white/[0.04]" size={250} strokeWidth={1} />
                            <h3 className="text-xl font-black text-white relative z-10 mb-8 border-b border-white/10 pb-4">Grand Prizes</h3>
                            <div className="space-y-8 relative z-10">
                                {/* Cash Prize - Always Visible */}
                                <div className={`flex items-start gap-4 ${contest.cashPrize > 0 ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                                        <FiDollarSign size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[15px] mb-1">
                                            {contest.cashPrize > 0 ? `₹${contest.cashPrize} Cash Prize` : 'No Cash Prize'}
                                        </h4>
                                        <p className="text-xs text-white/70 font-medium">
                                            {contest.cashPrize > 0 ? 'Awarded to top performers' : 'Certificate only contest'}
                                        </p>
                                    </div>
                                </div>

                                {/* Expert Certification - Always Visible */}
                                <div className={`flex items-start gap-4 ${contest.expertCertificate === 'Yes' ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                                        <FiCheckCircle size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[15px] mb-1">
                                            Expert Certification: <span className={contest.expertCertificate === 'Yes' ? 'text-white' : 'text-white/60'}>{contest.expertCertificate === 'Yes' ? 'Included' : 'No'}</span>
                                        </h4>
                                        <p className="text-xs text-white/70 font-medium">Professional accreditation</p>
                                    </div>
                                </div>

                                {/* Internship Offer - Always Visible */}
                                <div className={`flex items-start gap-4 ${contest.internshipOffer === 'Yes' ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                                        <FiBriefcase size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[15px] mb-1">
                                            Internship Offer: <span className={contest.internshipOffer === 'Yes' ? 'text-white' : 'text-white/60'}>{contest.internshipOffer === 'Yes' ? 'Included' : 'No'}</span>
                                        </h4>
                                        <p className="text-xs text-white/70 font-medium">Industry partner placement</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Widget */}
                        <div className="bg-[#f2f8e9] p-8 lg:p-10 rounded-[40px] border border-[#8cc63f]/20 shadow-sm flex flex-col">
                            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <FiCalendar className="text-[#8cc63f]" /> Timeline
                            </h3>
                            <div className="relative pl-6 flex-1 flex flex-col justify-center">
                                <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-300/60 rounded"></div>
                                <div className="relative mb-10">
                                    <div className="absolute -left-6 top-1 w-4 h-4 bg-[#8cc63f] rounded-full border-[3px] border-[#ecf0e6] shadow-[0_0_8px_rgba(140,198,63,0.3)]"></div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Start Date</p>
                                    <h4 className="text-base font-black text-slate-800 ml-2">{formatDateDDMMYYYY(contest.startDate)}</h4>
                                    <p className="text-xs text-gray-500 font-bold ml-2 mt-1">Registration & Brief release</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[22.5px] top-1 w-[13px] h-[13px] rounded-full border-2 border-[#fbc111] bg-[#fbc111] z-10 shadow-[0_0_8px_rgba(251,193,17,0.3)]"></div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">End Date</p>
                                    <h4 className="text-base font-black text-slate-800 ml-2">{formatDateDDMMYYYY(contest.endDate)}</h4>
                                    <p className="text-xs text-gray-500 font-bold ml-2 mt-1">Final submission deadline</p>
                                </div>
                            </div>
                        </div>

                        {/* Registration Timer Widget (Apply Now) */}
                        <div className="bg-white p-8 lg:p-10 rounded-[40px] text-center border-[3px] border-[#fbc111]/90 shadow-2xl shadow-[#fbc111]/10 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                                {contest.status === 'UPCOMING' ? 'Registration Starts In' : 'Registration Closes In'}
                            </p>
                            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 font-mono tracking-tighter mb-4">
                                <span>{String(timeLeft.days || 0).padStart(2, '0')}</span>
                                <span className="text-[#fbc111] -mt-1">:</span>
                                <span>{String(timeLeft.hours || 0).padStart(2, '0')}</span>
                                <span className="text-[#fbc111] -mt-1">:</span>
                                <span>{String(timeLeft.minutes || 0).padStart(2, '0')}</span>
                                <span className="text-[#fbc111] -mt-1">:</span>
                                <span>{String(timeLeft.seconds || 0).padStart(2, '0')}</span>
                            </div>
                            <div className="flex items-center justify-center gap-[18px] sm:gap-[24px] lg:gap-[30px] text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-10">
                                <span>Days</span><span>Hrs</span><span>Min</span><span>Sec</span>
                            </div>
                            {hasApplied || teamData ? (
                                <div className="space-y-4 w-full">
                                    {hasSubmitted && (
                                        <p className="text-[#fbc111] text-xs font-black uppercase tracking-[0.2em] animate-pulse mb-4 text-center">
                                            * Response Submitted
                                        </p>
                                    )}

                                    <button 
                                        onClick={() => setIsTeamModalOpen(true)}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-lg shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    >
                                        <FiUsers size={18} /> View Team Status
                                    </button>

                                    {contest.projectType === 'Team' && teamData?.status === 'pending_member' && (
                                        <p className="text-[9px] text-[#ebaa00] font-black uppercase tracking-widest text-center animate-pulse mt-2">
                                            * Pending Member Acceptance - Submission Locked
                                        </p>
                                    )}

                                    {contest.projectType === 'Team' && teamData?.status === 'pending_admin' && (
                                        <p className="text-[9px] text-purple-500 font-black uppercase tracking-widest text-center animate-pulse mt-2">
                                            * Awaiting Admin Approval - Submission Locked
                                        </p>
                                    )}
                                    
                                    {/* Unsubscribe Option (Only if not submitted) */}
                                    {!hasSubmitted && (
                                        <button 
                                            onClick={handleWithdraw}
                                            disabled={withdrawLoading}
                                            className="w-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all py-3.5 px-4 rounded-xl border border-slate-100 hover:border-red-100 flex items-center justify-center gap-2 group shadow-sm active:scale-95 mt-4"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors" />
                                            {withdrawLoading ? 'Withdrawing...' : 'Unsubscribe'}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => {
                                        if (contest?.status === 'UPCOMING') {
                                            toast.warning("🔔 It's an upcoming contest. Please wait and apply when it gets active!", {
                                                position: "top-right",
                                                autoClose: 4000,
                                                theme: "light",
                                            });
                                            return;
                                        }
                                        setIsApplyModalOpen(true);
                                    }} 
                                    className="bg-[#fbc111] hover:bg-[#8cc63f] cursor-pointer text-white px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all shadow-xl shadow-[#fbc111]/30 hover:shadow-[#8cc63f]/30 active:scale-95 w-full mb-6"
                                >
                                    Apply for this Contest
                                </button>
                            )}
                            <p className="text-[10px] text-gray-400 font-medium max-w-[250px] mx-auto leading-relaxed">By applying, you agree to the official Desun Academy participation limits.</p>
                        </div>

                    </div>

                    {/* --- ROW 2: GENERAL CONTEST RULES (LEFT) & LOGO BRANDING (RIGHT) --- */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

                        {/* General Contest Rules Block (Left 2/3) */}
                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 flex-1 lg:flex-[2]">
                            <h3 className="text-2xl font-black text-slate-800 mb-8">General Contest Rules</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    "Submissions must be original and written specifically for this contest cycle.",
                                    "Team members are allowed. No cross-team collaboration is permitted.",
                                    "Use of standard libraries is permitted; third-party frameworks are restricted unless specified.",
                                    "All code will be subjected to automated plagiarism detection and expert review."
                                ].map((rule, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <FiCheckCircle className="text-[#8cc63f] shrink-0 mt-1" size={20} strokeWidth={2.5} />
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Logo Branding (Right 1/3) - Original Color, Higher Opacity */}
                        <div className="flex-1 flex items-center justify-center p-12 opacity-100 lg:opacity-15 pointer-events-none select-none">
                            <div className="scale-[3] lg:scale-[5] transform-gpu">
                                <Logo size="lg" showText={false} showTagline={false} />
                            </div>
                        </div>

                    </div>

                    {/* --- ROW 3: RELATED CONTESTS --- */}
                    {relatedContests.length > 0 && (
                        <div className="mt-24 border-t border-gray-200 pt-16">
                            <div className="flex justify-between items-end mb-8 lg:mb-12">
                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight mb-4">
                                        Related Contests
                                    </h2>
                                    <p className="text-gray-500 font-medium text-sm lg:text-base max-w-xl">
                                        More opportunities in the <span className="font-bold text-[#8cc63f]">{contest.domain}</span> domain to showcase your skills.
                                    </p>
                                </div>
                                <Link to="/student/contests" className="hidden md:flex text-[#8cc63f] hover:text-[#7ab332] font-black text-sm uppercase tracking-widest items-center gap-2 transition-colors">
                                    View All 
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                {relatedContests.map((contest, index) => (
                                    <ContestCard 
                                        key={contest.id} 
                                        contest={contest} 
                                        index={index} 
                                        variant="all" 
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </section>
            </PageTransition>

            <Footer />

            <ApplyContestModal
                isOpen={isApplyModalOpen}
                onClose={() => {
                    setIsApplyModalOpen(false);
                }}
                contest={contest}
                contestId={id}
                onSuccess={async () => {
                    // Refetch user profile to sync across global context
                    const res = await api.get('/users/me');
                    if (res.data.success) {
                        updateUser(res.data.data);
                    }
                    toast.success("Application Transmitted Successfully!");
                    setIsApplyModalOpen(false);
                }}
            />
            <TeamDetailsModal 
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                contestId={id}
                contestTitle={contest.title}
            />
        </div>
    );
};

export default ContestDetails;
