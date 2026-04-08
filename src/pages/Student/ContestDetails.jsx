import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import ApplyContestModal from '../../components/Modals/ApplyContestModal';
import { Logo } from '../../components/index';
import ContestCard from '../../components/Cards/ContestCard';
import { FiBookOpen, FiDownload, FiCheckCircle, FiCalendar, FiDollarSign, FiAward, FiBriefcase, FiCode, FiLayout, FiTrendingUp, FiGlobe } from 'react-icons/fi';

// MOCK Contest Data
const MOCK_CONTEST_DATA = {
    id: 1,
    title: "The Algorithmic Grand Prix 2024",
    status: "ONGOING",
    domain: "DEVELOPMENT",
    difficulty: "MEDIUM",
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 59 * 60 * 1000).toISOString(),
    syllabusUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
};

// Related Contests Logic (Mock data from AllContests.jsx)
const BASE_CONTESTS = [
    {
        id: 1,
        title: "Algorithmic Odyssey",
        desc: "Master complex data structures and solve real-world efficiency problems in this 48-hour sprint.",
        domain: "Development",
        status: "ONGOING",
        icon: <FiCode />,
        dateInfo: "ENDS IN",
        dateValue: "12h"
    },
    {
        id: 2,
        title: "Python Pro Challenge",
        desc: "A deep dive into backend optimization and clean code practices using Python frameworks.",
        domain: "Development",
        status: "UPCOMING",
        icon: <FiCode />
    },
    {
        id: 3,
        title: "Visual Storytelling",
        desc: "A design challenge focused on minimalist composition and emotional color theory application.",
        domain: "UI/UX",
        status: "ONGOING",
        icon: <FiLayout />
    },
    {
        id: 4,
        title: "Accessibility Masterclass",
        desc: "Designing inclusive interfaces that cater to users with diverse functional needs.",
        domain: "UI/UX",
        status: "UPCOMING",
        icon: <FiLayout />
    },
    {
        id: 5,
        title: "Growth Hacking Summit",
        desc: "Strategic campaign planning and data-driven optimization for scaling startups.",
        domain: "Marketing",
        status: "UPCOMING",
        icon: <FiTrendingUp />
    },
    {
        id: 6,
        title: "SEO Performance Blast",
        desc: "Master technical SEO and content clustering to dominate search engine results.",
        domain: "Marketing",
        status: "ONGOING",
        icon: <FiTrendingUp />
    }
];

const getDomainIcon = (domain) => {
    switch (domain?.toLowerCase()) {
        case 'development': return <FiCode />;
        case 'ui/ux': return <FiLayout />;
        case 'marketing': return <FiTrendingUp />;
        default: return <FiGlobe />;
    }
};

const ContestDetails = () => {
    const { id } = useParams();
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
    const [hasApplied, setHasApplied] = React.useState(false);

    // =========================================================================
    // 🚀 [BACKEND] FETCH CONTEST DETAILS BY ID
    // =========================================================================
    // Endpoint: GET /api/v1/contests/:id
    // Use the `id` from useParams() above to fetch specific contest.
    //
    // useEffect(() => {
    //   const fetchContest = async () => {
    //     const res = await fetch(`http://YOUR_BACKEND_URL/api/v1/contests/${id}`);
    //     const data = await res.json();
    //     if (res.ok) setContestData(data.contest);
    //     // Expected shape: { title, status, domain, difficulty, endDate,
    //     //   syllabusUrl, thumbnailUrl, description, prizes, rules }
    //   };
    //   fetchContest();
    // }, [id]); // Re-fetch when route id changes
    //
    // Also replace the hardcoded contestImage URL below with data.contest.thumbnailUrl
    // =========================================================================

    // MOCK Contest Data — DELETE this when API is ready:




    const relatedContests = React.useMemo(() => {
        return BASE_CONTESTS
            .filter(c => 
                c.domain.toLowerCase() === MOCK_CONTEST_DATA.domain.toLowerCase() && 
                String(c.id) !== String(id) // Exclude current contest
            )
            .map(c => ({
                ...c,
                icon: getDomainIcon(c.domain)
            }))
            .slice(0, 4); // Limit to 4
    }, [id]);

    const handleDownload = () => {
        if (MOCK_CONTEST_DATA.syllabusUrl) {
            window.open(MOCK_CONTEST_DATA.syllabusUrl, '_blank');
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(MOCK_CONTEST_DATA.endDate) - +new Date();
            let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8faf2] font-sans selection:bg-[#8cc63f]/30 overflow-x-hidden">
            <UserNavbar />

            {/* --- SPLIT HEADER SECTION (50/50 Text/Image) --- */}
            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pt-24 pb-12 flex flex-col md:flex-row gap-8 lg:gap-16 items-center">

                {/* Left Header - Text (50%) */}
                <div className="flex-1 lg:w-1/2">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-[#8cc63f] text-slate-900 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {MOCK_CONTEST_DATA.status}
                        </span>
                        <span className="bg-[#ecf0e6] text-gray-500 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {MOCK_CONTEST_DATA.domain}
                        </span>
                        <span className="bg-[#fbc111] text-slate-900 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {MOCK_CONTEST_DATA.difficulty}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight mb-8">
                        The Algorithmic Grand Prix <br /> 2024
                    </h1>

                    {/* Standard Text Formatting (Moves from below) */}
                    <div className="text-gray-500 space-y-6 text-sm lg:text-base leading-relaxed mb-6 font-medium">
                        <p>
                            In this edition of the Grand Prix, participants are challenged to architect a decentralized routing algorithm capable of handling 10 million concurrent requests across a simulated fragmented network with 35% packet loss.
                        </p>
                        <p>
                            The solution must optimize for <strong className="text-slate-800">Latency, Reliability</strong>, and <strong className="text-slate-800">Resource Footprint</strong>. Unlike standard contests, we are not just looking for the fastest code, but the most resilient system architecture.
                        </p>
                        <ul className="list-none space-y-4 pt-2">
                            <li className="flex items-start gap-3">
                                <span className="text-gray-300 font-bold mt-0.5">•</span>
                                Implement a Custom Mesh Protocol
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gray-300 font-bold mt-0.5">•</span>
                                Optimize memory overhead below 256MB per node
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gray-300 font-bold mt-0.5">•</span>
                                Handle dynamic topology shifts in real-time
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Header - Thumbnail (50%) */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="w-full h-[300px] md:h-[400px] rounded-[40px] overflow-hidden shadow-2xl relative border-[6px] border-white ring-1 ring-slate-100">
                        <img
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                            alt="The Algorithmic Grand Prix 2024"
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
                            <p className="text-sm font-bold text-gray-500">Comprehensive guidelines, dataset specs, and submission API documentation.</p>
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
                    <div className="bg-gradient-to-br from-[#4a7010] to-[#2e4a07] p-8 lg:p-10 rounded-[40px] text-white overflow-hidden relative shadow-2xl shadow-[#4a7010]/20 min-h-[300px] flex flex-col justify-between">
                        <FiAward className="absolute -bottom-8 -right-8 text-white/[0.04]" size={250} strokeWidth={1} />
                        <h3 className="text-xl font-black text-white relative z-10 mb-6">Grand Prizes</h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { icon: FiDollarSign, title: "$15,000 Cash Prize", text: "Awarded to the top 3 overall finishers" },
                                { icon: FiCheckCircle, title: "Expert Certification", text: "Verified by the Grand Prix Panel" },
                                { icon: FiBriefcase, title: "Internship Offer", text: "Priority screening with Desun Labs" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[15px] mb-1">{item.title}</h4>
                                        <p className="text-xs text-white/70 font-medium">{item.text}</p>
                                    </div>
                                </div>
                            ))}
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
                                <h4 className="text-base font-black text-slate-800 ml-2">Oct 24, 2024</h4>
                                <p className="text-xs text-gray-500 font-bold ml-2 mt-1">Registration & Brief release</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[22.5px] top-1 w-[13px] h-[13px] rounded-full border-2 border-[#fbc111] bg-[#fbc111] z-10 shadow-[0_0_8px_rgba(251,193,17,0.3)]"></div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">End Date</p>
                                <h4 className="text-base font-black text-slate-800 ml-2">Dec 15, 2024</h4>
                                <p className="text-xs text-gray-500 font-bold ml-2 mt-1">Final submission deadline</p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Timer Widget (Apply Now) */}
                    <div className="bg-white p-8 lg:p-10 rounded-[40px] text-center border-[3px] border-[#fbc111]/90 shadow-2xl shadow-[#fbc111]/10 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Registration Closes In</p>
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
                        {hasApplied ? (
                            <button disabled className="bg-gray-200 text-gray-500 border border-gray-300 px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest w-full mb-6 cursor-not-allowed">✅ Applied</button>
                        ) : (
                            <button onClick={() => setIsApplyModalOpen(true)} className="bg-[#fbc111] hover:bg-[#ebaa00] cursor-pointer text-white px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all shadow-xl shadow-[#fbc111]/30 active:scale-95 w-full mb-6 uppercase">Apply for this Contest</button>
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
                                "Teams of up to 3 members are allowed. No cross-team collaboration is permitted.",
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
                                    More opportunities in the <span className="font-bold text-[#8cc63f]">{MOCK_CONTEST_DATA.domain}</span> domain to showcase your skills.
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

            <Footer />

            <ApplyContestModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                contest={MOCK_CONTEST_DATA}
                contestId={id}
                onSuccess={() => {
                    toast.success("Application Transmitted Successfully!");
                    setIsApplyModalOpen(false);
                    setHasApplied(true);
                }}
            />
        </div>
    );
};

export default ContestDetails;
