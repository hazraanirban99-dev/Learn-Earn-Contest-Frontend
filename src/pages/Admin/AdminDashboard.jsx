// ============================================================
// AdminDashboard.jsx — Admin er main overview page
// Ekhane StatCards, EnrollmentChart (bar chart), RecentContests table,
// RecentActivity feed, UpcomingContest card, r SkillTrajectory widget ache.
// Sob data AdminDashboardContext theke ase — directly API call hoy na ekhane.
// Monthly/Weekly toggle ache chart er view change korar jonno.
// ============================================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/Admin/StatCard';
import EnrollmentChart from '../../components/Admin/EnrollmentChart';
import RecentContestsTable from '../../components/Admin/RecentContestsTable';
import ContestListModal from '../../components/Admin/ContestListModal';
import {
  LaunchCard,
  RecentActivityCard,
  SkillTrajectory,
  UpcomingContestCard
} from '../../components/Admin/SidebarContainers';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { stats, fetchAllContests } = useAdminDashboard();
  const [activeToggle, setActiveToggle] = useState('Monthly');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContests, setModalContests] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const handleCardClick = async (type) => {
    // Only handle contest related stats
    if (!type.includes('Contest')) return;

    setModalTitle(type);
    setIsModalOpen(true);
    setModalLoading(true);

    const all = await fetchAllContests();
    let filtered = [];

    if (type.includes('Upcoming')) {
      filtered = all.filter(c => c.status === 'UPCOMING');
    } else if (type.includes('Active')) {
      filtered = all.filter(c => c.status === 'ONGOING');
    } else if (type.includes('Completed')) {
      filtered = all.filter(c => c.status === 'COMPLETED');
    }

    setModalContests(filtered);
    setModalLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-none uppercase">
              Executive Overview
            </h1>
            <p className="text-gray-400 font-bold text-sm lg:text-base opacity-80 uppercase tracking-tighter">
              Academic performance and operational metrics.....
            </p>
          </div>
          <div className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl flex gap-1 shadow-inner self-stretch sm:self-auto">
            {['Monthly', 'Yearly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveToggle(mode)}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${activeToggle === mode
                  ? 'bg-white dark:bg-gray-800 text-[#8cc63f] shadow-md transform scale-105'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid — 4 cards in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              {...stat}
              showTrend={false}
              onClick={['Active Contests', 'Upcoming Contests', 'Completed Contests'].includes(stat.title) 
                ? () => handleCardClick(stat.title) 
                : undefined}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Top Region: Chart & Launch */}
          <div className="col-span-12 xl:col-span-8">
            <EnrollmentChart view={activeToggle} />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <LaunchCard />
          </div>

          {/* Middle Region: Table & Assistance */}
          <div className="col-span-12 xl:col-span-8">
            <RecentContestsTable />
          </div>
          <div className="col-span-12 xl:col-span-4 h-full">
            <RecentActivityCard />
          </div>

          {/* New Bottom Region: Upcoming Contest & Skill Trajectory (Equal width) */}
          <div className="col-span-12 xl:col-span-6">
            <UpcomingContestCard onViewAll={() => handleCardClick('Upcoming Contests')} />
          </div>
          <div className="col-span-12 xl:col-span-6 h-full">
            <SkillTrajectory />
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ContestListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        contests={modalContests}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
