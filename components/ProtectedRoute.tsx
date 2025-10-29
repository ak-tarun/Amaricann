
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // User authenticated but role not allowed, redirect to a common dashboard or 403 page
    // For simplicity, redirect to home. In a real app, a dedicated 403 page might be better.
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has an allowed role, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
