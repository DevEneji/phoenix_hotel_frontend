// src/layouts/DashboardLayout.tsx

import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Hotel,
  LayoutDashboard,
  Calendar,
  Users,
  DoorOpen,
  CreditCard,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { UserRole } from '../types';

const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case UserRole.CUSTOMER:
        return [
          { to: '/customer', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
          { to: '/customer/profile', icon: Users, label: 'Profile' },
          { to: '/customer/reviews/create', icon: Star, label: 'Write Review' },
        ];
      case UserRole.STAFF:
        return [
          { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/staff/bookings', icon: Calendar, label: 'Bookings' },
          { to: '/staff/rooms', icon: DoorOpen, label: 'Rooms' },
          { to: '/staff/users', icon: Users, label: 'Users' },
        ];
      case UserRole.ADMIN:
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/users', icon: Users, label: 'Users' },
          { to: '/admin/hotels', icon: Hotel, label: 'Hotels' },
          { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
          { to: '/admin/reviews', icon: Star, label: 'Reviews' },
          { to: '/admin/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-700 hover:text-indigo-600 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Hotel className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">Phoenix Hotels</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="h-full overflow-y-auto py-6 px-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'ml-64' : 'ml-0'}
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;