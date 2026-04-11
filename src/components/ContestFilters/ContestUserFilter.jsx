// ============================================================
// ContestUserFilter.jsx — Admin dashboard e Year/Month/Contest filter component
// ReviewSubmissions, DeclareWinners, r ContestReports e use hoy eta.
// Step 1: Year + Month select korle oi samayer contests backend theke fetch hoy.
// Step 2: Contest select korle oi contest er sob submissions fetch hoy.
// Step 3: Participant select kora jay (showParticipant=true hole).
// onSelectionChange() diye parent component ke data pathano hoy.
// ============================================================

import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ContestUserFilter = ({ onSelectionChange, showParticipant = true }) => {
  const { user } = useAuth();
  const [years, setYears] = useState(['2024', '2025']); // Fallback defaults
  const [months, setMonths] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedContest, setSelectedContest] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState('');
  
  const [availableContests, setAvailableContests] = useState([]);
  const [availableSubmissions, setAvailableSubmissions] = useState([]);

  // 1. Initial Load: Fetch Years and Months that have contests
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await api.get('/contests/filters');
        if (data.success) {
          if (data.data.years.length > 0) {
            setYears(data.data.years);
            setSelectedYear(data.data.years[data.data.years.length - 1]); // Set latest year
          }
          if (data.data.months.length > 0) {
            setMonths(data.data.months);
            setSelectedMonth(data.data.months[data.data.months.length - 1]); // Set latest month
          }
        }
      } catch (error) {
        console.error("Filter fetch error:", error);
      }
    };
    fetchFilters();
  }, []);

  // 2. Year/Month change hole Contests load kora hoche
  useEffect(() => {
    const fetchContests = async () => {
      if (!selectedYear || !selectedMonth) return;
      try {
        const { data } = await api.get(`/contests?year=${selectedYear}&month=${selectedMonth}`);
        if (data.success) {
          setAvailableContests(data.data);
          if (data.data.length > 0) {
            setSelectedContest(data.data[0].title);
          } else {
            setSelectedContest('');
            setAvailableSubmissions([]);
          }
        }
      } catch (error) {
        console.error("Contest fetch error:", error);
      }
    };
    fetchContests();
  }, [selectedYear, selectedMonth]);

  // 3. Contest change hole Submissions/Participants load kora hoche (if Admin needs it)
  useEffect(() => {
    const fetchSubmissions = async () => {
      const contest = availableContests.find(c => c.title === selectedContest);
      if (!contest) return;
      // Non-admin users eke use korbe na
      if (!user || user.role !== 'admin') return;

      try {
        const { data } = await api.get(`/admin/submissions/contest/${contest._id}`);
        if (data.success) {
          setAvailableSubmissions(data.data);
          if (data.data.length > 0) {
            setSelectedParticipant(data.data[0].studentId.name);
          } else {
            setSelectedParticipant('');
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Submission fetch error:", error);
        }
      }
    };
    
    if (selectedContest && selectedContest !== 'No contests found') {
        fetchSubmissions();
    }
  }, [selectedContest, availableContests, user]);

  // Notify parent on any selection change
  useEffect(() => {
    const selectedContestObj = availableContests.find(c => c.title === selectedContest);
    const selectedSubObj = availableSubmissions.find(s => s.studentId?.name === selectedParticipant);

    if (onSelectionChange) {
      onSelectionChange({
        year: selectedYear,
        month: selectedMonth,
        contest: selectedContest,
        participant: selectedParticipant,
        contestId: selectedContestObj?._id,
        contestData: { 
            ...selectedContestObj,
            participants: availableSubmissions.map(s => ({
                id: s._id,
                studentId: s.studentId, // Pass full object if we need more context down the line
                name: s.studentId?.name,
                email: s.studentId?.email, // Exposed email
                avatar: s.studentId?.avatar || 'https://i.pravatar.cc/150',
                score: s.score,
                status: s.status,
                projectUrl: s.projectUrl,
                projectThumbnail: s.projectThumbnail?.url,
                projectPdf: s.projectPdf?.url
            }))
        }
      });
    }
  }, [selectedYear, selectedMonth, selectedContest, selectedParticipant, availableSubmissions, availableContests, onSelectionChange]);

  return (
    <div className="w-full lg:w-auto flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="space-y-2 flex-1 sm:w-48">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8cc63f]">Select Year</label>
          <div className="relative group">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#f1f8e8] border-2 border-transparent hover:border-[#8cc63f]/20 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all hover:bg-white hover:shadow-sm"
            >
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-[#8cc63f] transition-colors" />
          </div>
        </div>
        <div className="space-y-2 flex-1 sm:w-48">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8cc63f]">Select Month</label>
          <div className="relative group">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#f1f8e8] border-2 border-transparent hover:border-[#8cc63f]/20 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all hover:bg-white hover:shadow-sm"
            >
              {months.map(m => <option key={m}>{m}</option>)}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-[#8cc63f] transition-colors" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="space-y-2 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#fbc111]">Select Project Contest</label>
          <div className="relative group">
            <select 
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
              className="w-full bg-white border-2 border-gray-100 hover:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all shadow-sm focus:border-[#8cc63f]/40"
            >
              <option value="" disabled>
                {availableContests.length === 0 ? 'No contests found in this period' : 'Select a contest'}
              </option>
              {availableContests.map(c => (
                <option key={c._id} value={c.title}>{c.title}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#8cc63f] transition-colors" />
          </div>
        </div>
        
        {showParticipant && (
          <div className="space-y-2 w-full">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#fbc111]">Select Candidate / Team</label>
            <div className="relative group">
              <select 
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 hover:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all shadow-sm focus:border-[#8cc63f]/40"
              >
                <option value="" disabled>
                  {availableSubmissions.length === 0 ? 'No participants available' : 'Select a candidate'}
                </option>
                {availableSubmissions.map(s => (
                  <option key={s._id} value={s.studentId?.name}>{s.studentId?.name}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#8cc63f] transition-colors" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestUserFilter;
