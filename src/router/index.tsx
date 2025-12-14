// src/router/index.tsx

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { UserRole } from '../types';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import HotelListPage from '../pages/HotelListPage';
import { HotelDetailPage } from '../pages/HotelDetailPage';
import { RoomDetailPage } from '../pages/RoomDetailPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// Customer Dashboard
import CustomerDashboard from '../pages/customer/Dashboard';
import MyBookings from '../pages/customer/MyBookings';
import BookingDetail from '../pages/customer/BookingDetail';
import ProfilePage from '../pages/customer/ProfilePage';
import CreateReviewPage from '../pages/customer/CreateReviewPage';

// Staff Dashboard
import StaffDashboard from '../pages/staff/Dashboard';
import StaffBookingManagement from '../pages/staff/BookingManagement';
import StaffRoomManagement from '../pages/staff/RoomManagement';
import StaffUserManagement from '../pages/staff/UserManagement';

// Admin Dashboard
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUserManagement from '../pages/admin/UserManagement';
import { AdminHotelManagement } from '../pages/admin/HotelManagement';
import { AdminPaymentManagement } from '../pages/admin/PaymentManagement';
import AdminReviewModeration from '../pages/admin/ReviewModeration';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userStr) {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'hotels', element: <HotelListPage /> },
      { path: 'hotels/:id', element: <HotelDetailPage /> },
      { path: 'rooms/:id', element: <RoomDetailPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
    ],
  },
  {
    path: '/customer',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CustomerDashboard /> },
      { path: 'bookings', element: <MyBookings /> },
      { path: 'bookings/:id', element: <BookingDetail /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'reviews/create', element: <CreateReviewPage /> },
    ],
  },
  {
    path: '/staff',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.STAFF]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StaffDashboard /> },
      { path: 'bookings', element: <StaffBookingManagement /> },
      { path: 'rooms', element: <StaffRoomManagement /> },
      { path: 'users', element: <StaffUserManagement /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUserManagement /> },
      { path: 'hotels', element: <AdminHotelManagement /> },
      { path: 'payments', element: <AdminPaymentManagement /> },
      { path: 'reviews', element: <AdminReviewModeration /> },
    ],
  },
]);