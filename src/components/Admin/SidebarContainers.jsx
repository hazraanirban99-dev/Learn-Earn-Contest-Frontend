import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

export const LaunchCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-[#8cc63f] to-[#a6d843] rounded-[32px] p-8 text-white shadow-2xl shadow-[#8cc63f]/30 flex flex-col items-center text-center gap-6 relative overflow-hidden group h-full">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
      
      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30 backdrop-blur-md transition-all duration-500 shadow-xl">
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
        className="w-full bg-[#fbc111] text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-white hover:text-[#8cc63f] transition-all shadow-xl active:scale-95 border-b-4 border-yellow-600/30"
      >
        Create New Contest
      </button>
    </div>
  );
};

export const RecentActivityCard = () => {
  const activities = [
    { id: 1, type: 'contest', name: 'Sustainable Green Energy Challenge', status: 'Created', date: 'Oct 24, 2024', color: '#8cc63f' },
    { id: 2, type: 'student', name: 'Maya Thompson', status: 'Registered', date: 'Oct 24, 2024', time: '09:42 AM', color: '#fbc111' },
    { id: 3, type: 'contest', name: 'MERN Stack Masters', status: 'Created', date: 'Oct 23, 2024', color: '#8cc63f' },
    { id: 4, type: 'student', name: 'Liam Carter', status: 'Registered', date: 'Oct 23, 2024', time: '08:15 AM', color: '#fbc111' },
    { id: 5, type: 'student', name: 'Sarah Jenks', status: 'Registered', date: 'Oct 22, 2024', time: '11:20 AM', color: '#fbc111' },
    { id: 6, type: 'contest', name: 'Bauhaus UI Revival', status: 'Created', date: 'Oct 21, 2024', color: '#8cc63f' },
  ];

  return (
    <div className="bg-white rounded-[32px] p-8 flex flex-col gap-8 h-full border border-gray-100 shadow-sm group">
      <div className="flex items-center justify-between px-1">
        <h4 className="font-black text-slate-800 text-xl tracking-tight uppercase leading-none">Recent Activity</h4>
      </div>

      <div className="relative flex-1 px-1">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-50" />

        <div className="space-y-8 relative">
          {activities.slice(0, 4).map((item, idx) => (
            <div key={item.id} className="flex gap-6 items-start group/item">
              {/* Timeline Dot */}
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm shrink-0 mt-1.5 z-10 transition-transform group-hover/item:scale-125`} style={{ backgroundColor: item.color }} />
              
              <div className="flex flex-col gap-1">
                <p className="text-[14px] leading-tight font-bold text-slate-800 uppercase tracking-tight">
                  <span className="font-black">{item.name}</span> <span className="opacity-60">{item.status}</span>
                </p>
                <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                  {item.date} {item.time && <span className="mx-1">•</span>} {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export const SkillTrajectory = () => {
  const { skills } = useAdminDashboard();

  return (
    <div className="bg-[#e9f2db]/40 rounded-[32px] p-6 sm:p-8 flex flex-col gap-8 h-full border-b-4 border-[#8cc63f]/10 group">
      <h4 className="font-black text-slate-800 text-xl tracking-tight uppercase leading-none px-1">Skill Trajectory</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-8 sm:gap-4 flex-1">
        {skills.map((skill, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 sm:w-20 sm:h-20 xl:w-24 xl:h-24 group/gauge">
              {/* SVG Circle Gauge - Double Ring Effect */}
              <svg className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="50%" cy="50%" r="42%" stroke="white" strokeWidth="8" fill="transparent" className="opacity-20" />
                {/* Progress Ring */}
                <circle cx="50%" cy="50%" r="42%" stroke={skill.color} strokeWidth="8" fill="transparent" 
                        strokeDasharray={250} strokeDashoffset={250 - (250 * skill.value) / 100}
                        strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-md" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[14px] sm:text-[12px] xl:text-[14px] font-black text-slate-900 group-hover/gauge:scale-125 transition-transform">
                  {skill.value}%
                </span>
              </div>
            </div>
            <span className="text-[11px] sm:text-[10px] font-black tracking-widest text-[#8cc63f] uppercase whitespace-nowrap">{skill.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UpcomingContestCard = () => {
  const navigate = useNavigate();
  return (
  <div className="bg-[#8cc63f] rounded-[32px] p-8 text-white flex flex-col gap-6 relative overflow-hidden group h-full shadow-2xl shadow-[#8cc63f]/30">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-xl transition-all group-hover:scale-150 duration-700" />
    <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit shadow-sm border border-white/20">
      Upcoming Contest
    </span>
    
    <div>
      <h3 className="text-[22px] xl:text-[26px] font-black leading-[1.1] tracking-tight uppercase">
        Design Portfolio Contest: Final Call
      </h3>
      <p className="text-white/90 text-sm leading-relaxed mt-4 font-bold opacity-80">
        128 new submissions require grading to meet the Friday deadline.
      </p>
    </div>

    <button 
      onClick={() => navigate('/admin/submissions')}
      className="bg-white text-[#8cc63f] px-6 py-4.5 rounded-xl font-black text-sm flex items-center justify-between group-hover:bg-[#fbc111] group-hover:text-black transition-all shadow-xl active:scale-95 uppercase tracking-widest"
    >
      Begin Review 
      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  </div>
  );
};
