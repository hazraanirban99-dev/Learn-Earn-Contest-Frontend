// ============================================================
// AdminDashboardContext.jsx — Admin Dashboard er sob data ekhane manage hoy
// Stats (total users, total contests etc), recent contests, skills distribution,
// recent activities, ar active contest data — sob ekhane fetch kora hoy.
// useAdminDashboard() hook diye jebhaba component ei data nebe.
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiZap } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const AdminDashboardContext = createContext();

// Backend theke icon er naam string ase, ekhane seta actual React icon component e convert kora hocche
const ICON_MAP = {
  FaTrophy,
  FiUsers,
  FiCalendar,
  FiZap,
};

export const AdminDashboardProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState([]);          // Dashboard er top stat cards (total users, contests etc)
  const [contests, setContests] = useState([]);    // Recent contest list
  const [skills, setSkills] = useState([]);        // Skills/domain distribution (bar chart data)
  const [activities, setActivities] = useState([]); // Recent activity feed
  const [activeContest, setActiveContest] = useState(null); // Ekhon chaloch contest (ONGOING)
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    // Auth check na hole wait koro
    if (authLoading) return;
    
    // Admin na hole sob data clear kore return koro
    if (!user || user.role !== 'admin') {
      setStats([]); setContests([]); setActivities([]); setActiveContest(null);
      return;
    }

    setLoading(true);
    try {
      // 1. Stats, recent contests, ar skills distribution — ekta API call e sab ase
      const { data: statsRes } = await api.get('/admin/stats');
      if (statsRes.success) {
        // Backend e icon string patha dekhay, ekhane actual React component e map kora hocche
        const mappedStats = statsRes.data.stats.map(s => {
          let link = null;
          if (s.title === 'Total Contests') link = '/admin/reports';
          if (s.title === 'Total Participants') link = '/admin/participants';
          
          return {
            ...s,
            icon: ICON_MAP[s.icon] || FaTrophy,
            link
          };
        });
        setStats(mappedStats);
        
        // Recent contests ke frontend er expected format e map kora hocche
        setContests(statsRes.data.recentContests.map(c => ({
          _id: c._id,
          name: c.title,
          domain: c.domain,
          status: c.status,
          participants: Math.max(0, c.participantsCount || 0).toString(),
          // Status dekhe color decide kora hocche
          color: c.status === 'ONGOING'
            ? 'text-green-600 bg-green-100/50'
            : 'text-amber-600 bg-amber-100/50',
        })));
        setSkills(statsRes.data.skillsDistribution);
      }

      // 2. Recent activities fetch kora hocche (jemon: "Rahul submitted a project")
      const { data: actRes } = await api.get('/admin/activities');
      if (actRes.success) setActivities(actRes.data);

      // 3. Ekhon active (ONGOING) contest fetch kora hocche dashboard card er jonno
      const { data: contestRes } = await api.get('/admin/active-contest');
      if (contestRes.success) setActiveContest(contestRes.data);

    } catch (error) {
      // 401 hole quietly fail koro (session expired)
      if (error.response?.status !== 401) {
        console.error('Dashboard fetch error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // User login/logout ba auth change hole data refetch korbe
  useEffect(() => {
    fetchDashboardData();
  }, [user?.role, user?._id, authLoading]);

  return (
    // sob state ar refetch function provider diye pura admin section e available korchi
    <AdminDashboardContext.Provider value={{
      stats, contests, skills, activities, activeContest, loading, refetch: fetchDashboardData
    }}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

// Custom hook — component e useAdminDashboard() call korle dashboard data peye jabe
export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) throw new Error('useAdminDashboard must be used within AdminDashboardProvider');
  return context;
};

