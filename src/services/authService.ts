// src/services/authService.ts

import { api } from './api';
import {
  User,
  LoginCredentials,
  RegisterData,
  VerifyEmailData,
} from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

interface VerifyResponse {
  message: string;
  user: User;
}

interface MessageResponse {
  message: string;
}

export const authService = {
  // User Registration
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register/', data);
  },

  // User Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);
    
    // Store token and user in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verify Email with OTP
  verifyEmail: async (data: VerifyEmailData): Promise<VerifyResponse> => {
    return api.post<VerifyResponse>('/auth/verify-email/', data);
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<MessageResponse> => {
    return api.post<MessageResponse>('/auth/resend-otp/', { email });
  },

  // Get Current User Profile
  getProfile: async (): Promise<User> => {
    return api.get<User>('/profile/');
  },

  // Update User Profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.patch<User>('/profile/', data);
  },

  // Staff Registration (Admin only)
  registerStaff: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register/staff/', data);
  },

  // Admin Registration (Admin only)
  registerAdmin: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register/admin/', data);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};