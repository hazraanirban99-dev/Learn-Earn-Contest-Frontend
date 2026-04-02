import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mock login state - replace with actual logic (e.g., localStorage or API)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // =========================================================================
    // 🚀 BACKEND API INTEGRATION: VERIFY SESSION 
    // -------------------------------------------------------------------------
    // Endpoint: GET /api/v1/auth/me (or your route to check login status)
    // Here you should check if the user has a valid session/token with the backend
    // and update `setUser(data.user)` if successful.
    // =========================================================================

    // Check if user is logged in (mocking persistent session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    // =========================================================================
    // 🚀 BACKEND API INTEGRATION: LOGOUT 
    // -------------------------------------------------------------------------
    // Endpoint: POST /api/v1/auth/logout (Optional)
    // Perform any server-side invalidation if required, then clear cookies/storage.
    // =========================================================================

    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
