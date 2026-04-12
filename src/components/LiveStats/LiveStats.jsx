import React, { useEffect, useRef, useState } from 'react';
import { FiUsers, FiZap, FiAward, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

const useCountUp = (target, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start || target === 0) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic logic: joto target er kache jabe toto slow hobe
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
};

const formatNum = (n, suffix = '') => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K${suffix}`;
    return `${n}${suffix}`;
};

const StatCard = ({ icon: Icon, label, value, suffix = '', color, bgColor, delay, shouldAnimate }) => {
    const count = useCountUp(value, 2000 + delay, shouldAnimate);

    return (
        <div
            className={`relative flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-[28px] border border-white/60 shadow-lg backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            style={{ backgroundColor: bgColor, animationDelay: `${delay}ms` }}
        >
            {/* Background glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px]"
                style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }}
            />

            {/* Icon */}
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon size={22} style={{ color }} />
            </div>

            {/* Number */}
            <p className="text-3xl sm:text-4xl font-black text-slate-900 leading-none mb-1 tabular-nums">
                {shouldAnimate ? formatNum(count, suffix) : formatNum(value, suffix)}
            </p>

            {/* Label */}
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight mt-1">
                {label}
            </p>

            {/* Live dot for active stats */}
            <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full animate-ping opacity-60"
                style={{ backgroundColor: color }}
            />
            <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};

const TickerItem = ({ icon, text, color }) => (
    <div className="inline-flex items-center gap-2 mx-8 flex-shrink-0">
        <span style={{ color }} className="text-sm">{icon}</span>
        <span className="text-[12px] font-bold text-slate-600 whitespace-nowrap">{text}</span>
        <span className="w-1 h-1 rounded-full bg-slate-300 ml-6" />
    </div>
);

const LiveStats = ({ stats }) => {
    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    // Default placeholder stats — replace with API data via cronjob
    const defaultStats = {
        totalStudents: 840,
        activeContests: 3,
        contestsCompleted: 12,
        totalPrize: 48000,
        reviewedSubmissions: 267,
    };

    const data = stats || defaultStats;

    // IntersectionObserver — jokhon user scroll kore section-e asbe tokhon animation shuru hobe
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.2 } // 20% visible holei animation start hobe
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const statCards = [
        {
            icon: FiUsers,
            label: 'Students Enrolled',
            value: data.totalStudents,
            suffix: '+',
            color: '#8cc63f',
            bgColor: '#f6fbee',
            delay: 0
        },
        {
            icon: FiZap,
            label: 'Active Contests',
            value: data.activeContests,
            suffix: '',
            color: '#fbc111',
            bgColor: '#fffdf0',
            delay: 100
        },
        {
            icon: FaTrophy,
            label: 'Contests Completed',
            value: data.contestsCompleted,
            suffix: '',
            color: '#8b5cf6',
            bgColor: '#f5f3ff',
            delay: 200
        },
        {
            icon: FiAward,
            label: 'Prize Distributed',
            value: data.totalPrize,
            suffix: '+',
            color: '#f97316',
            bgColor: '#fff7ed',
            delay: 300
        },
    ];

    const tickerItems = [
        { icon: '🏆', text: 'MERN Stack Challenge — Winners Announced!', color: '#8cc63f' },
        { icon: '⚡', text: 'UI/UX Design Contest — Now Live', color: '#fbc111' },
        { icon: '🚀', text: 'New contest launching soon — Digital Marketing Sprint', color: '#8cc63f' },
        { icon: '🎯', text: '50+ students submitted in the last 24 hours', color: '#f97316' },
        { icon: '✅', text: 'Review complete — Leaderboard updated', color: '#0ea5e9' },
        { icon: '💰', text: '₹48,000+ in prizes distributed to date', color: '#8b5cf6' },
        { icon: '🏆', text: 'MERN Stack Challenge — Winners Announced!', color: '#8cc63f' },
        { icon: '⚡', text: 'UI/UX Design Contest — Now Live', color: '#fbc111' },
    ];

    return (
        <section ref={sectionRef} className="w-full bg-white py-16 sm:py-20 overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-20">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#8cc63f]/10 border border-[#8cc63f]/20 rounded-full px-4 py-2 mb-5">
                        <span className="w-2 h-2 rounded-full bg-[#8cc63f] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5c8a14]">Live Platform Stats</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                        Numbers That <span className="text-[#8cc63f]">Speak</span> for{' '}
                        <span className="text-[#fbc111]">Themselves</span>
                    </h2>
                    <p className="text-gray-400 font-semibold text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
                        Real-time insights into our growing competitive learning ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statCards.map((card, i) => (
                        <StatCard key={i} {...card} shouldAnimate={inView} />
                    ))}
                </div>

                <div className="relative rounded-[20px] border border-[#8cc63f]/20 bg-[#f6fbee]/50 overflow-hidden">
                    {/* Left fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#f6fbee] to-transparent pointer-events-none" />
                    {/* Right fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#f6fbee] to-transparent pointer-events-none" />

                    {/* LIVE badge */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 bg-[#8cc63f] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                        <FiActivity size={9} className="animate-pulse" />
                        LIVE
                    </div>

                    {/* Ticker content */}
                    <div className="pl-20 py-4 flex">
                        <div
                            className="flex"
                            style={{
                                animation: 'ticker-scroll 30s linear infinite',
                                willChange: 'transform',
                            }}
                        >
                            {[...tickerItems, ...tickerItems].map((item, i) => (
                                <TickerItem key={i} {...item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticker animation */}
            <style>{`
                @keyframes ticker-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
};

export default LiveStats;
