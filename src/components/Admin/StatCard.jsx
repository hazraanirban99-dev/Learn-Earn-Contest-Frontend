// ============================================================
// StatCard.jsx — Admin dashboard er stat card component
// AdminDashboard page e 4 ta StatCard show hoy:
// Total Users, Total Contests, Active Contests, Total Submissions
// AdminDashboardContext theke data ase — ekhane shudhu display logic.
// Hover e scale up animation ache (hover:shadow-xl, scale-105).
// Bottom accent bar animated — hover e full width hoy.
// showTrend prop false hole trend badge lukano hoy (dashboard view e use).
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, accentColor, trend, showTrend = true, link, onClick }) => {
  const navigate = useNavigate();

  const accentBgMap = {
    'text-green-600': 'bg-green-600',
    'text-amber-500': 'bg-amber-500',
    'text-purple-500': 'bg-purple-500',
    'text-blue-500': 'bg-blue-500',
    'text-red-500': 'bg-red-500'
  };

  const getTrendColor = (t) => {
    if (t.includes('+') || t.includes('UP') || t === 'LIVE') return 'text-green-600 bg-green-50';
    if (t === 'URGENT') return 'text-red-600 bg-red-50';
    if (t === 'SCHEDULED') return 'text-blue-600 bg-blue-50';
    return 'text-amber-600 bg-amber-50';
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (link) {
      navigate(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-[#8cc63f]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[160px] sm:h-[180px] group active:scale-95 active:shadow-inner touch-manipulation ${(link || onClick) ? 'cursor-pointer' : ''}`}
    >
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-2">
        <div className={`p-3 rounded-xl ${color} shadow-sm border border-white/50 group-hover:scale-110 transition-transform`}>
          <Icon className={`text-xl ${accentColor}`} />
        </div>
        {trend && showTrend && (
          <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-full ${getTrendColor(trend)} border border-white shadow-sm flex items-center gap-1`}>
            {trend}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-auto space-y-1">
        <h3 className="text-gray-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
          {title}
        </h3>
        <p className="text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] font-black text-slate-900 dark:text-gray-100 leading-[1.1] tracking-tight truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
          {value}
        </p>
      </div>

      {/* Animated Accent Bar */}
      <div className={`absolute bottom-0 left-0 h-[6px] w-full ${accentBgMap[accentColor]} opacity-70 rounded-full scale-x-[0.9] group-hover:scale-x-100 transition-transform origin-left`} />
    </div>
  );
};

export default StatCard;
