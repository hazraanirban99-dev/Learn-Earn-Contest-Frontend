// ============================================================
// SidebarContainers.jsx — AdminDashboard er right sidebar widget components
// Ekhane 4 ta alag alag widget export kora hoyeche:
//   1. LaunchCard — "Create New Contest" button card (green gradient)
//   2. RecentActivityCard — Last 4 ta activity timeline diye dekhano hoy
//   3. SkillTrajectory — Domain wise student % gauge chart (SVG based)
//   4. UpcomingContestCard — Active/upcoming contest card with "Begin Review" button
// Sob component AdminDashboardContext theke data consume kore.
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../context/AdminDashboardContext';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';

// ─── Launch Card ──────────────────────────────────────────────────────────────
export const LaunchCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-[#8cc63f] to-[#a6d843] rounded-[32px] p-8 text-white shadow-2xl shadow-[#8cc63f]/30 flex flex-col items-center text-center gap-6 relative overflow-hidden group h-full">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/ dark:bg-gray-800/ rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
      <div className="w-16 h-16 rounded-2xl bg-white/ dark:bg-gray-800/ flex items-center justify-center border-2 border-white/30 backdrop-blur-md transition-all duration-500 shadow-xl">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-black uppercase tracking-tight leading-none">Launch Contest</h3>
        <p className="text-white/90 text-sm font-semibold leading-relaxed px-2">
          Create a new academic challenge and engage with thousands of students.
        </p>
      </div>
      <button
        onClick={() => navigate('/admin/contests/create')}
        className="w-full bg-[#fbc111] text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-white dark:bg-gray-800 hover:text-[#8cc63f] transition-all shadow-xl active:scale-95 border-b-4 border-yellow-600/30"
      >
        Create New Contest
      </button>
    </div>
  );
};

// ─── Recent Activity Card ─────────────────────────────────────────────────────
export const RecentActivityCard = () => {
  const { activities, loading } = useAdminDashboard();

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    const date = formatDateDDMMYYYY(d);
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date, time };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 sm:p-8 flex flex-col gap-8 h-full border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-1">
        <h4 className="font-black text-slate-800 dark:text-gray-100 text-xl tracking-tight uppercase leading-none">Recent Activity</h4>
      </div>

      <div className="relative flex-1 pl-8">
        {/* Vertical timeline line — More visible now */}
        <div className="absolute left-[11px] top-1 bottom-1 w-[2px] bg-slate-200 rounded-full" />

        <div className="space-y-8 relative">
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-4 h-4 rounded-full bg-gray-100 shrink-0 animate-pulse ml-[-26px]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
                  <div className="h-2 bg-gray-50 dark:bg-gray-800 rounded-full animate-pulse w-1/2" />
                </div>
              </div>
            ))
          ) : activities.slice(0, 4).map((item, idx) => {
            const isContest = item.type === 'CONTEST';
            const dot = isContest ? '#8cc63f' : '#fbc111';
            const { date, time } = formatDateTime(item.date);
            
            // Layout text pattern: New [Type] [Name] [Action]
            const typeLabel = isContest ? 'contest' : 'participant';
            const actionLabel = isContest ? 'created' : 'registered';

            return (
              <div key={item.id || idx} className="flex gap-5 items-start group/item">
                {/* Dot — Perfectly centered on the line */}
                <div
                  className="w-4 h-4 rounded-full border-[3px] border-white shadow-md shrink-0 mt-1.5 z-10 transition-transform group-hover/item:scale-125"
                  style={{ backgroundColor: dot, marginLeft: '-27px' }}
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-[12px] sm:text-[13px] leading-tight font-bold text-slate-800 dark:text-gray-100 uppercase tracking-tight">
                    <span className="opacity-50 font-black">New {typeLabel}</span>{' '}
                    <span className="font-black">{item.name}</span>{' '}
                    <span className="opacity-50 font-black">{actionLabel}</span>
                  </p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    {date} <span className="mx-0.5">•</span> {time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Skill Trajectory ─────────────────────────────────────────────────────────
export const SkillTrajectory = () => {
  const { skills } = useAdminDashboard();
  return (
    <div className="bg-[#e9f2db]/40 rounded-[32px] p-6 sm:p-8 flex flex-col gap-8 h-full border-b-4 border-[#8cc63f]/10 group">
      <h4 className="font-black text-slate-800 dark:text-gray-100 text-xl tracking-tight uppercase leading-none px-1">Skill Trajectory</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-8 sm:gap-4 flex-1">
        {skills.map((skill, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 sm:w-20 sm:h-20 xl:w-24 xl:h-24 group/gauge">
              <svg className="w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="white" strokeWidth="8" fill="transparent" className="opacity-20" />
                <circle cx="50%" cy="50%" r="42%" stroke={skill.color} strokeWidth="8" fill="transparent"
                  strokeDasharray={250} strokeDashoffset={250 - (250 * skill.value) / 100}
                  strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-md" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[14px] sm:text-[12px] xl:text-[14px] font-black text-slate-900 dark:text-gray-100 group-hover/gauge:scale-125 transition-transform">
                  {skill.value}%
                </span>
              </div>
            </div>
            <span className="text-[11px] sm:text-[10px] font-black tracking-widest text-[#8cc63f] uppercase text-center">{skill.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Upcoming Contest Card ────────────────────────────────────────────────────
export const UpcomingContestCard = ({ onViewAll }) => {
  const navigate = useNavigate();
  const { activeContest, loading } = useAdminDashboard();

  const domainColor = {
    'MERN': '#8cc63f',
    'UI/UX': '#6366f1',
    'DIGITAL MARKETING': '#f59e0b',
  };

  const bgColor = activeContest ? (domainColor[activeContest.domain] || '#8cc63f') : '#8cc63f';

  return (
    <div
      className="rounded-[32px] p-6 sm:p-8 text-white flex flex-col gap-6 relative overflow-hidden group h-full shadow-2xl transition-all duration-300 hover:scale-[1.01]"
      style={{ backgroundColor: bgColor, boxShadow: `0 20px 60px ${bgColor}40` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/ dark:bg-gray-800/ rounded-full -translate-y-12 translate-x-12 blur-xl transition-all group-hover:scale-150 duration-700" />
      <div className="flex justify-between items-start z-10">
        <span className="bg-white/ dark:bg-gray-800/ text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit shadow-sm border border-white/20">
          {activeContest?.status === 'ONGOING' ? 'Active Contest' : 'Upcoming Contest'}
        </span>
        {onViewAll && (
          <button 
            onClick={(e) => { e.stopPropagation(); onViewAll(); }}
            className="text-[10px] font-black uppercase tracking-widest hover:underline opacity-80 hover:opacity-100 transition-all"
          >
            View Report
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-6 bg-white/ dark:bg-gray-800/ rounded-xl w-3/4" />
          <div className="h-4 bg-white/ dark:bg-gray-800/ rounded-xl w-full" />
          <div className="h-4 bg-white/ dark:bg-gray-800/ rounded-xl w-2/3" />
        </div>
      ) : (
        <div 
          className="min-h-0 flex-1 cursor-pointer"
          onClick={() => onViewAll?.()}
        >
          <h3 className="text-[20px] sm:text-[22px] xl:text-[26px] font-black leading-[1.1] tracking-tight uppercase">
            {activeContest?.title || 'No Active Contest'}
          </h3>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mt-4 font-bold">
            {activeContest?.description?.substring(0, 90) + '...' || 'No upcoming contests at this time.'}
          </p>
          {activeContest?.endDate && (
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-3">
              Ends: {formatDateDDMMYYYY(activeContest.endDate)}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => navigate('/admin/submissions')}
          className="bg-white dark:bg-gray-800 px-4 py-3.5 rounded-xl font-black text-[11px] flex items-center justify-center hover:bg-[#fbc111] hover:!text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest"
          style={{ color: bgColor }}
        >
          Begin Review
        </button>
        <button
          onClick={() => onViewAll?.()}
          className="bg-black/20 border border-white/20 backdrop-blur-md px-4 py-3.5 rounded-xl font-black text-[11px] flex items-center justify-center hover:bg-white/ dark:bg-gray-800/ transition-all shadow-xl active:scale-95 uppercase tracking-widest text-white"
        >
          All Contests
        </button>
      </div>
    </div>
  );
};
