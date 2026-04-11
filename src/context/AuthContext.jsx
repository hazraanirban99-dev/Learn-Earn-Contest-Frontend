// ============================================================
// AuthContext.jsx — Authentication er global state manager
// Ei file ta pure porer jonno: kono user ki logged in ache?
// Login, logout, ar session check — sob ekhane manage kora hoy.
// useAuth() hook diye jebhaba component chalao, sei user info peye jabe.
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

// React Context toiri — ekhane user ar loading state thakbe
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Current logged-in user er data
  const [loading, setLoading] = useState(true); // Session check complete howar age loading true thakbe

  // App prothom open hole check kora hoy user ar cookie/session ache kina
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // /users/me endpoint theke current user fetch kora hocche
        const { data } = await api.get('/users/me');
        // Jodi session valid thake, user data set koro
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        // Jodi session na thake (401), tai user null e thakbe — quiet fail
        console.log("No active session found");
      } finally {
        // Check shesh, loading off koro
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login successful hole Login page theke ei function call hobe, user set hobe
  const login = (userData) => {
    setUser(userData);
  };

  // Logout — backend e API call kore session destroy koro, tahole cookie o invalid hoye jabe
  const logout = async () => {
    try {
      await api.post('/users/logout');
      
      // Role dekhe different toast message dekhano hocche
      if (user?.role === 'admin') {
        toast.success('Admin securely logged out. Session ended.');
      } else {
        toast.success('Logged out successfully! See you soon.');
      }

      // User state clear koro
      setUser(null);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    // user, loading, login, logout, updateUser — ei sab values pura app e available thakbe
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — jebhaba component auth context use korbe, useAuth() call korbe
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // AuthProvider er baire use korle error throw korbe
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

