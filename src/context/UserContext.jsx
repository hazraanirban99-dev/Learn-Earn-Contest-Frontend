// ============================================================
// UserContext.jsx — Admin er jonno sob user/student data manage kora hoy ekhane
// Admin dashboard load hole backend theke sob student fetch hoy.
// Manage Users page ei context er users[] array consume kore.
// updateUser() ar deleteUser() diye admin actions kora hoy.
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // AuthContext theke current logged-in user ar loading state newa hocche
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);    // Backend theke asha sob student er list
  const [loading, setLoading] = useState(false);

  // Admin login korle backend theke sob student fetch kora hocche
  useEffect(() => {
    const fetchUsers = async () => {
      // Auth check shesh na hole wait koro — nahole premature request jabe
      if (authLoading) return;
      
      // Jodi admin na hoy, users array khali thakbe
      if (!user || user.role !== 'admin') {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        // Sudhu student role er users fetch korchi — admin filter out hobe backend e
        const { data } = await api.get('/admin/users?role=student');
        if (data.success) {
          // Backend er raw data ke frontend er expected format e map kora hocche
          const mappedUsers = data.data.map(u => ({
            id: u._id,
            name: u.name,
            regId: `LNE-${u._id.substring(0, 4).toUpperCase()}`, // Dummy registration ID
            email: u.email,
            phone: u.contactNumber || 'N/A',
            domain: u.domain || 'Not Assigned',
            gender: u.gender || 'Not Specified',
            address: u.address || 'No Address Provided',
            registrationDate: formatDateDDMMYYYY(u.registrationDate), // DD/MM/YYYY format e
            avatar: u.avatar?.url || `https://ui-avatars.com/api/?name=${u.name}&background=random` // Avatar na thakle UI Avatar use hobe
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        // 401 Unauthorized hole quietly fail koro (user just logged out hoyeche)
        if (error.response?.status !== 401) {
          console.error("Fetch users error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.role, user?._id, authLoading]); // user change hole refetch korbe

  // Admin jodi kono user er info edit kore
  const updateUser = async (id, updatedData) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}`, updatedData);
      if (data.success) {
        // Shudhu oi user ta update kora hobe, baki gulo same thakbe
        setUsers(users.map(user => user.id === id ? { ...user, ...updatedData } : user));
        toast.success("User updated successfully");
      }
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  // Admin jodi kono user delete kore
  const deleteUser = async (id) => {
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      if (data.success) {
        // Deleted user ta filter kore list theke baad kora hocche
        setUsers(users.filter(user => user.id !== id));
        toast.success("User deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    // users, loading, updateUser, deleteUser — ei values pura admin section use korbe
    <UserContext.Provider value={{ users, loading, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook — jebhaba component user list lagbe, useUsers() call korbe
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

