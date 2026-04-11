// ============================================================
// RecentContestsTable.jsx — AdminDashboard er recent contests table widget
// AdminDashboardContext er contests[] theke data consume kora hoy.
// Max 3-5 ta contest dekhano hoy (Context e slice kora thake).
// Domain badge er color DOMAIN_STYLES lookup theke decide hoy.
// Status badge er color data theke directly ase (context e set kora hoy).
// Loading skeleton (animate-pulse) dekhano hoy data fetch hoar age.
// ============================================================

import React from 'react';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

const DOMAIN_STYLES = {
  'MERN':               'text-green-600 bg-green-50 border-green-100',
  'UI/UX':              'text-blue-600 bg-blue-50 border-blue-100',
  'DIGITAL MARKETING':  'text-amber-600 bg-amber-50 border-amber-100',
  'default':            'text-gray-500 bg-gray-50 border-gray-100',
};

const RecentContestsTable = () => {
  const { contests, loading } = useAdminDashboard();

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col gap-8 w-full group transition-all duration-300 hover:shadow-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-[18px] lg:text-[22px] font-black text-slate-800 tracking-tight uppercase leading-none">
            Recent Contest Details
          </h3>
          <p className="text-gray-400 text-xs lg:text-sm font-black opacity-80 uppercase tracking-tighter">
            Most recent active & upcoming contests
          </p>
        </div>
      </div>

      <div className="overflow-x-auto w-full scrollbar-hide">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b-2 border-gray-50 uppercase text-[10px] lg:text-[11px] font-black tracking-widest text-[#8cc63f]/60 h-10">
              <th className="pb-4 font-black">Contest Name</th>
              <th className="pb-4 font-black">Domain</th>
              <th className="pb-4 font-black text-center">Status</th>
              <th className="pb-4 font-black text-center">Participants</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-50/50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}>
                  <td colSpan={4} className="py-5">
                    <div className="h-4 bg-gray-100 rounded-full animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : contests.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                  No active or upcoming contests
                </td>
              </tr>
            ) : contests.map((contest, idx) => (
              <tr key={idx} className="group/row hover:bg-gray-50/70 transition-all duration-300 cursor-pointer">
                <td className="py-6 font-black text-[14px] lg:text-[15px] text-slate-900 tracking-tight capitalize group-hover/row:translate-x-1 transition-transform max-w-[200px] sm:max-w-none break-words">
                  {contest.name}
                </td>
                <td className="py-6">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest border uppercase inline-block ${DOMAIN_STYLES[contest.domain] || DOMAIN_STYLES.default}`}>
                    {contest.domain}
                  </span>
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

export default RecentContestsTable;
