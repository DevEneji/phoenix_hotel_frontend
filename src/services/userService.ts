// src/services/userService.ts

import { User, DashboardStats, PaginatedResponse } from '../types';
import api from './api';

export const userService = {
  // Get all users (Staff/Admin only)
  getUsers: async (params?: any): Promise<PaginatedResponse<User>> => {
    return api.get<PaginatedResponse<User>>('/admin/users/', { params }).then(res => res.data);
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    return api.get<User>(`/admin/users/${id}/`).then(res => res.data);
  },

  // Update user
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    return api.patch<User>(`/admin/users/${id}/`, data).then(res => res.data);
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    return api.delete<void>(`/admin/users/${id}/`).then(() => undefined);
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    return api.get<DashboardStats>('/dashboard/stats/').then(res => res.data);
  },
};