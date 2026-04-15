import React from 'react';
import { FiX, FiCalendar, FiArrowRight, FiUsers, FiAward, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { Loader } from '../index';

const ContestListModal = ({ isOpen, onClose, title, contests, loading }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/ dark:bg-gray-800/">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-[#8cc63f] rounded-full" />
              {title}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">
              Contest Inventory Report
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white dark:bg-gray-800 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-gray-700 active:scale-90"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-white dark:bg-gray-800">
          {loading ? (
            <Loader text="Fetching detailed records..." />
          ) : contests.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full">
                    <FiCalendar className="text-4xl text-gray-300" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-tight text-xl">No Contests Found</p>
                <p className="text-gray-400 text-sm max-w-xs">There are no records in this category at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-4">
              {contests.map((contest) => (
                <div 
                  key={contest._id}
                  onClick={() => {
                    onClose();
                    navigate(`/student/contests/${contest._id}`);
                  }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-[#8cc63f]/30 hover:shadow-xl hover:shadow-[#8cc63f]/5 transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        contest.status === 'ONGOING' ? 'bg-green-50 text-green-600 border-green-100' :
                        contest.status === 'UPCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'
                      }`}>
                        {contest.status}
                      </span>
                      <FiArrowRight className="text-gray-200 text-xl group-hover:text-[#8cc63f] group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div className="space-y-2">
                        <h4 className="text-slate-800 dark:text-gray-100 font-black text-lg uppercase leading-tight tracking-tight group-hover:text-[#8cc63f] transition-colors">
                            {contest.title}
                        </h4>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            {contest.domain}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 opacity-50">
                                <FiCalendar className="text-gray-400 text-[10px]" />
                                <span className="text-gray-400 font-bold text-[8px] uppercase tracking-tighter">Start Date</span>
                            </div>
                            <span className="text-slate-700 font-black text-[10px] sm:text-[11px]">{formatDateDDMMYYYY(contest.startDate)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 opacity-50">
                                <FiClock className="text-gray-400 text-[10px]" />
                                <span className="text-gray-400 font-bold text-[8px] uppercase tracking-tighter">Deadline</span>
                            </div>
                            <span className="text-slate-700 font-black text-[10px] sm:text-[11px]">{formatDateDDMMYYYY(contest.endDate)}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                        <FiUsers className="text-[#8cc63f] text-xs" />
                        <span className="text-slate-700 font-black text-[11px]">{contest.participantsCount || 0}</span>
                        <span className="text-gray-400 font-bold text-[9px] uppercase tracking-tighter">Active Participants</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#8cc63f] transition-all shadow-lg active:scale-95"
            >
                Close Report
            </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default ContestListModal;
