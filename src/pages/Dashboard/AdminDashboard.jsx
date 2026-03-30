import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/Admin/StatCard';
import EnrollmentChart from '../../components/Admin/EnrollmentChart';
import RecentContestsTable from '../../components/Admin/RecentContestsTable';
import { 
  LaunchCard, 
  AssistanceCard, 
  SkillTrajectory, 
  UpcomingContestCard 
} from '../../components/Admin/SidebarContainers';
import { useAdminDashboard } from '../../context/AdminDashboardContext';

const AdminDashboard = () => {
  const { stats } = useAdminDashboard();
  const [activeToggle, setActiveToggle] = React.useState('Monthly');

  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
              Executive Overview
            </h1>
            <p className="text-gray-400 font-bold text-sm lg:text-base opacity-80 uppercase tracking-tighter">
              Academic performance and operational metrics for Q3.
            </p>
          </div>
          <div className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl flex gap-1 shadow-inner self-stretch sm:self-auto">
            {['Monthly', 'Weekly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveToggle(mode)}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${
                  activeToggle === mode 
                    ? 'bg-white text-[#8cc63f] shadow-md transform scale-105' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <StatCard 
              key={idx} 
              {...stat} 
              showTrend={idx > 1} // Hide trends for Total Contests and Total Participants
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Top Region: Chart & Launch */}
          <div className="col-span-12 xl:col-span-8">
            <EnrollmentChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <LaunchCard />
          </div>

          {/* Middle Region: Table & Assistance */}
          <div className="col-span-12 xl:col-span-8">
            <RecentContestsTable />
          </div>
          <div className="col-span-12 xl:col-span-4 h-full">
            <AssistanceCard />
          </div>

          {/* New Bottom Region: Upcoming Contest & Skill Trajectory (Equal width) */}
          <div className="col-span-12 xl:col-span-6">
            <UpcomingContestCard />
          </div>
          <div className="col-span-12 xl:col-span-6 h-full">
            <SkillTrajectory />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
