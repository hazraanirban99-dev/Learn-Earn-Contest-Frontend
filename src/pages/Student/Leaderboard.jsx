import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiAward, FiArrowLeft, FiUser, FiUsers, FiStar } from 'react-icons/fi';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import PageTransition from '../../components/Common/PageTransition';
import api from '../../utils/api';

const Leaderboard = () => {
    const { id } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                // 1. Fetch Contest Info for the title
                const contestRes = await api.get(`/contests/${id}`);
                if (contestRes.data.success) {
                    setContest(contestRes.data.data);
                }

                // 2. Fetch Leaderboard Data
                const res = await api.get(`/student/leaderboard/${id}`);
                if (res.data.success) {
                    setLeaderboard(res.data.data);
                }
            } catch (error) {
                console.error("Leaderboard fetch error:", error);
                toast.error("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8faf2] flex items-center justify-center">
                <div className="w-12 h-12 border-4 text-[#8cc63f] rounded-full spinner-dual"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8faf2] selection:bg-[#8cc63f]/20">
            <UserNavbar />
            
            <PageTransition>
                <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                    {/* Header Section */}
                    <div className="mb-12">
                        <Link to="/student/contests" className="flex items-center gap-2 text-[#8cc63f] font-black text-xs uppercase tracking-widest hover:translate-x-[-10px] transition-transform w-max mb-8">
                            <FiArrowLeft size={16} /> Back to Contests
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                                    Contest <span className="text-[#8cc63f]">Leaderboard</span>
                                </h1>
                                <p className="text-gray-500 font-bold text-lg max-w-2xl">
                                    {contest?.title || 'Contest Results'} — Celebrating the top performers and their exceptional project submissions.
                                </p>
                            </div>
                            <div className="bg-white px-8 py-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl">
                                    <FiAward className="text-[#8cc63f]" size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Submissions</p>
                                    <p className="text-2xl font-black text-slate-800">{leaderboard.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rankings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Top 3 Podium Cards */}
                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {leaderboard.slice(0, 3).map((item, index) => (
                                <div 
                                    key={item._id} 
                                    className={`relative bg-white p-8 rounded-[45px] border-2 transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${
                                        index === 0 ? 'border-yellow-400 scale-105 z-10 shadow-xl shadow-yellow-100' : 'border-gray-100 shadow-sm'
                                    }`}
                                >
                                    {/* Rank Badge */}
                                    <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[35px] font-black text-sm uppercase tracking-widest text-white ${
                                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-300'
                                    }`}>
                                        Rank #{index + 1}
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-6">
                                            <div className={`w-24 h-24 rounded-full p-1 border-4 ${
                                                index === 0 ? 'border-yellow-400' : index === 1 ? 'border-slate-200' : 'border-orange-100'
                                            }`}>
                                                <img 
                                                    src={item.participantId?.studentId?.avatar?.url || 'https://via.placeholder.com/150'} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div className={`absolute -bottom-2 -right-2 p-2 rounded-full text-white shadow-lg ${
                                                index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-400' : 'bg-orange-400'
                                            }`}>
                                                {index === 0 ? <FiStar fill="white" size={16} /> : <FiAward size={16} />}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 mb-2 truncate max-w-full">
                                            {item.participantId?.studentId?.name || item.participantId?.teamId?.name || 'Anonymous'}
                                        </h3>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                            {item.participantId?.studentId?.domain || 'Participant'}
                                        </p>

                                        <div className="w-full h-px bg-gray-100 mb-6"></div>

                                        <div className="flex justify-between w-full">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Score</p>
                                                <p className="text-2xl font-black text-[#8cc63f]">{item.score || 0}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                <p className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg uppercase">Reviewed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Other Participants Table */}
                        <div className="lg:col-span-12">
                            <div className="bg-white rounded-[45px] border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-gray-50 bg-slate-50/50">
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Full Standings</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-50">
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rank</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Participant</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Domain</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboard.length > 0 ? (
                                                leaderboard.map((item, index) => (
                                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                                                                index < 3 ? 'bg-[#8cc63f] text-white' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                                                                    <img 
                                                                        src={item.participantId?.studentId?.avatar?.url || 'https://via.placeholder.com/150'} 
                                                                        alt="" 
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-800 group-hover:text-[#8cc63f] transition-colors">{item.participantId?.studentId?.name || item.participantId?.teamId?.name}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        {item.participantId?.teamId ? <FiUsers size={12} className="text-gray-400" /> : <FiUser size={12} className="text-gray-400" />}
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                                            {item.participantId?.participationType || 'Solo'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                                                                {item.participantId?.studentId?.domain || 'General'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-center">
                                                            <span className="text-xl font-black text-slate-800">{item.score || 0}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-8 py-20 text-center">
                                                        <div className="max-w-xs mx-auto">
                                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <FiAward className="text-slate-300" size={32} />
                                                            </div>
                                                            <p className="text-slate-900 font-black mb-1">No Results Yet</p>
                                                            <p className="text-gray-400 text-sm font-medium leading-relaxed">The leaderboard will be generated once the results are announced.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </PageTransition>

            <Footer />
        </div>
    );
};

export default Leaderboard;
