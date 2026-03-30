import React, { createContext, useContext, useState, useEffect } from 'react';
import { FiUsers, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

const AdminDashboardContext = createContext();

export const AdminDashboardProvider = ({ children }) => {
  // Mock data that mimics backend response - easy to replace with fetch() later
  const [stats, setStats] = useState([
    { title: 'Total Contests', value: '142', trend: '+12% VS LY', icon: FaTrophy, color: 'bg-green-50', accentColor: 'text-green-600' },
    { title: 'Total Participants', value: '12,890', trend: '+2.4K NEW', icon: FiUsers, color: 'bg-amber-50', accentColor: 'text-amber-500' },
    { title: 'Submission Overview', value: '85% Completion Rate', trend: 'TRENDING UP', icon: FiBarChart2, color: 'bg-purple-50', accentColor: 'text-purple-500' },
    { title: 'Pending Evaluation', value: '43', trend: 'URGENT', icon: FiCalendar, color: 'bg-red-50', accentColor: 'text-red-500' }
  ]);

  const [contests, setContests] = useState([
    { name: 'Visual Brand Identity 2024', category: 'Graphic Design', status: 'ACTIVE', participants: '1,204', growth: '+14.2%', color: 'text-green-600 bg-green-100/50' },
    { name: 'Fintech UI Redesign', category: 'UX/UI', status: 'REVIEWING', participants: '856', growth: '+8.1%', color: 'text-amber-600 bg-amber-100/50' },
    { name: 'Green Energy Sustainability', category: 'Strategy', status: 'DRAFT', participants: '--', growth: '--', color: 'text-gray-400 bg-gray-100/50' }
  ]);

  const [enrollmentData, setEnrollmentData] = useState([40, 60, 30, 95, 20, 50, 45, 35, 40, 55, 30, 60]);

  const [skills, setSkills] = useState([
    { label: 'CREATIVITY', value: 80, color: '#8cc63f' },
    { label: 'TECHNICAL', value: 65, color: '#fbc111' },
    { label: 'STRATEGY', value: 90, color: '#a35fbc' }
  ]);

  return (
    <AdminDashboardContext.Provider value={{ stats, contests, enrollmentData, skills }}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
};
