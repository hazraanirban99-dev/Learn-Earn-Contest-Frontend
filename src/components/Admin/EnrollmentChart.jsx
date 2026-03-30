import React from 'react';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

const EnrollmentChart = () => {
  const { enrollmentData } = useAdminDashboard();
  const labels = ['WEEK 01', 'WEEK 04', 'WEEK 08', 'WEEK 12'];

  return (
    <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col gap-8 relative overflow-hidden h-full group transition-all duration-500 hover:shadow-xl hover:border-[#8cc63f]/20">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-[18px] lg:text-[22px] font-black text-slate-800 tracking-tight uppercase leading-none"> 
            Enrollment Dynamics 
          </h3>
          <p className="text-gray-400 text-xs lg:text-sm font-black opacity-80 uppercase tracking-tighter"> 
            Student registration flow over the last 12 weeks 
          </p>
        </div>
        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#8cc63f] hover:bg-[#8cc63f]/10 transition-all border border-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h.01M12 12h.01M19 12h.01" />
          </svg>
        </button>
      </div>

      {/* SVG Chart Section */}
      <div className="flex-1 mt-6 relative h-[220px] flex items-end justify-between px-2 gap-3 lg:gap-4">
        {enrollmentData.map((height, index) => (
          <div key={index} className="relative flex-1 group min-w-[12px] h-full flex items-end">
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none scale-90 group-hover:scale-100 ${index === 3 ? 'opacity-100 scale-100' : ''}`}>
               <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap border border-white/10 uppercase tracking-widest">
                  {800 + height * 2}
                  <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10" />
                </div>
            </div>
            
            <div 
              className={`w-full rounded-t-xl transition-all duration-1000 group-hover:opacity-90 ease-out cursor-pointer shadow-sm ${
                index === 3 ? 'bg-gradient-to-t from-[#8cc63f] to-[#a6d843] shadow-[0_15px_35px_-5px_rgba(140,198,63,0.5)] scale-110' : 'bg-[#e9f2db]/80 hover:bg-[#8cc63f]/30'
              }`}
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>

      {/* Grid Labels Section */}
      <div className="flex justify-between px-2">
        {labels.map((label, idx) => (
          <span key={idx} className={`text-[10px] lg:text-[11px] font-black tracking-widest uppercase transition-colors ${idx === 1 ? 'text-[#8cc63f]' : 'text-gray-300'}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentChart;
