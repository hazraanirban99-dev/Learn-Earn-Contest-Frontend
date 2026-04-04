import React from 'react';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

const RecentContestsTable = () => {
  const { contests } = useAdminDashboard();

  return (
    <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col gap-8 w-full group transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-[18px] lg:text-[22px] font-black text-slate-800 tracking-tight uppercase leading-none"> 
            Recent Contest Details 
          </h3>
          <p className="text-gray-400 text-xs lg:text-sm font-black opacity-80 uppercase tracking-tighter"> 
            Overview of latest administrative entries 
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-8 lg:-mx-10 px-8 lg:px-10 scrollbar-hide">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-gray-50 uppercase text-[10px] lg:text-[11px] font-black tracking-widest text-[#8cc63f]/60 h-10">
              <th className="pb-4 font-black">Contest Name</th>
              <th className="pb-4 font-black">Category</th>
              <th className="pb-4 font-black text-center">Status</th>
              <th className="pb-4 font-black">Participants</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-50/50">
            {contests.map((contest, idx) => (
              <tr key={idx} className="group/row hover:bg-gray-50/70 transition-all duration-300 cursor-pointer">
                <td className="py-6 font-black text-[14px] lg:text-[16px] text-slate-900 tracking-tight capitalize group-hover/row:translate-x-1 transition-transform">
                  {contest.name}
                </td>
                <td className="py-6 text-[12px] lg:text-[14px] text-gray-500 font-bold uppercase opacity-80">
                  {contest.category}
                </td>
                <td className="py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest border shadow-sm ${contest.color} uppercase inline-block`}>
                    {contest.status}
                  </span>
                </td>
                <td className="py-6 font-black text-slate-900 text-[14px] lg:text-[16px] text-center">
                  {contest.participants}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Internal Import helper
import { FiArrowUpRight } from 'react-icons/fi';

export default RecentContestsTable;
