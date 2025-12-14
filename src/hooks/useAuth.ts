// src/hooks/useAuth.ts

import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const hasRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isCustomer = hasRole([UserRole.CUSTOMER]);
  const isStaff = hasRole([UserRole.STAFF]);
  const isAdmin = hasRole([UserRole.ADMIN]);

  return {
    user,
    isAuthenticated,
    loading,
    hasRole,
    isCustomer,
    isStaff,
    isAdmin,
  };
};