// ============================================================
// EnrollmentChart.jsx — Admin dashboard er enrollment bar chart
// Monthly/Weekly toggle dekhe /admin/enrollment?view=Monthly API call hoy.
// Bar gulo percentage height e render hoy — maxVal theke normalize kora hoy.
// Hover korle oi bar er student count tooltip ei dekhano hoy.
// Hover e bar color yellow (fbc111) hoy — baki gulo purple thake.
// Custom scrollbar ache horizontal overflow er jonno (mobile friendly).
// ============================================================

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EnrollmentChart = ({ view = 'Monthly' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/enrollment?view=${view}`);
        if (data.success) setChartData(data.data || []);
      } catch (e) {
        if (e.response?.status !== 401) console.error('Enrollment fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view, user]);

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.value), 1) : 1;

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col gap-8 relative h-full transition-all duration-500 hover:shadow-xl hover:border-[#8cc63f]/20">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-[18px] lg:text-[22px] font-black text-slate-800 tracking-tight uppercase leading-none">
            Enrollment Dynamics
          </h3>
          <p className="text-gray-400 text-xs lg:text-sm font-black opacity-80 uppercase tracking-tighter">
            Student registration flow ({view})
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/users')}
          className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#8cc63f] hover:bg-[#8cc63f]/10 transition-all border border-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h.01M12 12h.01M19 12h.01" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="h-[240px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-transparent border-t-[#8cc63f] border-b-[#fbc111]" />
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col min-h-0 overflow-x-auto pb-6 custom-scrollbar">
            <div className="min-w-[580px] flex-1 flex flex-col gap-8">
              <div className="relative h-[240px] w-full flex items-end justify-between px-2 gap-2 sm:gap-3 lg:gap-4 border-b border-gray-100/50 pt-10">
                {chartData.map((item, index) => {
                  const heightPct = maxVal > 0 ? Math.max((item.value / maxVal) * 100, item.value > 0 ? 5 : 2.5) : 2.5;
                  return (
                    <div 
                      key={index} 
                      className="flex-1 h-full relative flex flex-col justify-end group cursor-pointer touch-manipulation z-10"
                    >
                      {/* Tooltip/Number - Now in the MIDDLE of the bar hit area */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none scale-75 group-hover:scale-110">
                        <div className="bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap border border-white/20 flex flex-col items-center leading-none">
                          <span className="text-[#fbc111] text-lg">{item.value}</span>
                          <span className="uppercase tracking-[0.2em] text-[7px] mt-1">Students</span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div
                        className="relative w-full rounded-t-xl transition-all duration-300 ease-out origin-bottom shadow-sm group-hover:scale-y-110 group-hover:!bg-[#fbc111] group-hover:!bg-none group-hover:shadow-[0_15px_35px_rgba(251,193,17,0.45)]"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: '#a855f7',
                          backgroundImage: 'linear-gradient(to top, #a855f7, #c084fc)'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between px-2">
                {chartData.map((item, idx) => (
                  <span key={idx} className="text-[9px] lg:text-[10px] font-black tracking-widest uppercase flex-1 text-center text-[#a855f7] opacity-80">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .custom-scrollbar::-webkit-scrollbar { height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #8cc63f40; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8cc63f; }
          `}} />
        </>
      )}
    </div>
  );
};

export default EnrollmentChart;
