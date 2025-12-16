// src/router/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // If no specific roles are required, just check authentication
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has the required role
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      
      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user's actual role
        switch (user.role) {
          case UserRole.ADMIN:
            return <Navigate to="/admin" replace />;
          case UserRole.STAFF:
            return <Navigate to="/staff" replace />;
          case UserRole.CUSTOMER:
            return <Navigate to="/customer" replace />;
          default:
            return <Navigate to="/" replace />;
        }
      }

      return <>{children}</>;
    } catch (error) {
      // If user data is corrupted, clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/auth/login" replace />;
    }
  }

  // If no user data but has token, redirect to login to refresh
  return <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;