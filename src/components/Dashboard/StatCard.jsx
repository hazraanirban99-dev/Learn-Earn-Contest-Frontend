import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, accentColor, trend, showTrend = true }) => {
  const accentBgMap = {
    'text-green-600': 'bg-green-600',
    'text-amber-500': 'bg-amber-500',
    'text-purple-500': 'bg-purple-500',
    'text-red-500': 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-[#8cc63f]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[180px] group">
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-2">
        <div className={`p-3 rounded-xl ${color} shadow-sm border border-white/50 group-hover:scale-110 transition-transform`}>
          <Icon className={`text-xl ${accentColor}`} />
        </div>
        {trend && showTrend && (
          <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-full ${trend.includes('+') || trend.includes('UP') ? 'text-green-600 bg-green-50' : trend === 'URGENT' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'} border border-white shadow-sm flex items-center gap-1`}>
            {trend}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-auto space-y-1">
        <h3 className="text-gray-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
          {title}
        </h3>
        <p className="text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] font-black text-slate-900 leading-[1.1] tracking-tight truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
          {value}
        </p>
      </div>

      {/* Animated Accent Bar */}
      <div className={`absolute bottom-0 left-0 h-[6px] w-full ${accentBgMap[accentColor]} opacity-70 rounded-full scale-x-[0.9] group-hover:scale-x-100 transition-transform origin-left`} />
    </div>
  );
};

export default StatCard;
