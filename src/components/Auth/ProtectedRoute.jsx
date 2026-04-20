// ============================================================
// ProtectedRoute.jsx — Route protection component
// AuthContext theke user login state r role check kore.
// User authenticated na hole login page e redirect kore.
// Role-based protection ache (e.g., student admin page access korte parbe na).
// Loading state e spinning logo dekhano hoy.
// ============================================================

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../index';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullPage={true} text="" />;
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Bounce unauthorized users back to their appropriate dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
