import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

// Mock Data Centralized
const mockData = {
  '2024': {
    'October': [
      { 
        id: 'c1', 
        title: 'Eco-Urban Design 2024',
        participants: [
          { id: 'p1', name: 'Marcus Aurelius (Selected)', score: 29.5, school: 'Royal Academy', avatar: 'https://i.pravatar.cc/150?img=11' },
          { id: 'p2', name: 'Jane Doe (Pending)', score: 29.5, school: 'Design Institute', avatar: 'https://i.pravatar.cc/150?img=47' },
          { id: 'p3', name: 'Alex Rivera', score: 28.2, school: 'Architecture School', avatar: 'https://i.pravatar.cc/150?img=12' }
        ]
      },
      { 
        id: 'c2', 
        title: 'Future Mobility Concept',
        participants: [
          { id: 'p4', name: 'Sarah Smith', score: 27.5, school: 'Art University', avatar: 'https://i.pravatar.cc/150?img=33' }
        ]
      }
    ],
    'September': [
      { 
        id: 'c3', 
        title: 'Sustainable Energy Hackathon',
        participants: [
          { id: 'p5', name: 'Tom Hardy', score: 26.0, school: 'Tech College', avatar: 'https://i.pravatar.cc/150?img=60' }
        ]
      }
    ]
  },
  '2025': {
    'January': [
      { 
        id: 'c4', 
        title: 'AI in Architecture 2025',
        participants: [
          { id: 'p6', name: 'Elon Musk', score: 30.0, school: 'Space Tech', avatar: 'https://i.pravatar.cc/150?img=15' }
        ]
      }
    ]
  }
};

const ContestUserFilter = ({ onSelectionChange, showParticipant = true }) => {

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedContest, setSelectedContest] = useState('Eco-Urban Design 2024');
  const [selectedParticipant, setSelectedParticipant] = useState('Marcus Aurelius (Selected)');

  // Derived Lists
  const availableContests = mockData[selectedYear]?.[selectedMonth] || [];
  const selectedContestObj = availableContests.find(c => c.title === selectedContest);
  const availableParticipants = selectedContestObj?.participants || [];

  // Cascading Resets
  useEffect(() => {
    const firstContest = availableContests[0]?.title || 'No contests found';
    setSelectedContest(firstContest);
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const firstParticipant = availableParticipants[0]?.name || 'No participants found';
    setSelectedParticipant(firstParticipant);
  }, [selectedContest, availableContests]);

  // Notify parent on any selection change
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        year: selectedYear,
        month: selectedMonth,
        contest: selectedContest,
        participant: selectedParticipant,
        contestData: selectedContestObj // Pass the full contest data including participants for DeclareWinners
      });
    }
  }, [selectedYear, selectedMonth, selectedContest, selectedParticipant, onSelectionChange]);

  return (
    <div className="w-full lg:w-auto flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Top Row: Year and Month */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="space-y-2 flex-1 sm:w-48">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8cc63f]">Select Year</label>
          <div className="relative group">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#f1f8e8] border-2 border-transparent hover:border-[#8cc63f]/20 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all hover:bg-white hover:shadow-sm"
            >
              <option>2024</option>
              <option>2025</option>
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
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-[#8cc63f] transition-colors" />
          </div>
        </div>
      </div>

      {/* Bottom Row: Contest and Optionally Participant */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className={`space-y-2 flex-1 ${showParticipant ? 'sm:w-64' : 'w-full'}`}>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/60">Select Project Contest</label>
          <div className="relative group">
            <select 
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
              className="w-full bg-white border-2 border-gray-100 hover:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all shadow-sm focus:border-[#8cc63f]/40"
            >
              <option disabled={availableContests.length === 0}>
                {availableContests.length === 0 ? 'No contests found in this period' : 'Select a contest'}
              </option>
              {availableContests.map(c => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#8cc63f] transition-colors" />
          </div>
        </div>
        
        {showParticipant && (
          <div className="space-y-2 flex-1 sm:w-64">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/60">Select Candidate</label>
            <div className="relative group">
              <select 
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 hover:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all shadow-sm focus:border-[#8cc63f]/40"
              >
                <option disabled={availableParticipants.length === 0}>
                  {availableParticipants.length === 0 ? 'No participants available' : 'Select a candidate'}
                </option>
                {availableParticipants.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
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
