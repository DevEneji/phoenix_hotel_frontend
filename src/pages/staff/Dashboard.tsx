// src/pages/staff/Dashboard.tsx

import React, { useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllBookings } from '../../store/slices/bookingSlice';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/format';
import { getBookingStatusColor } from '../../utils/helpers';

const StaffDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.bookings);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllBookings({}));
  }, [dispatch]);

  const today = new Date().toISOString().split('T')[0];
  
  const todayCheckIns = bookings.filter(
    (b) => b.check_in_date === today && b.status === 'confirmed'
  );
  
  const todayCheckOuts = bookings.filter(
    (b) => b.check_out_date === today && b.status === 'checked_in'
  );
  
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const occupiedRooms = bookings.filter((b) => b.status === 'checked_in');

  const stats = [
    {
      label: "Today's Check-ins",
      value: todayCheckIns.length,
      icon: ArrowDownRight,
      color: 'bg-green-500',
      change: '+12%',
      trend: 'up',
    },
    {
      label: "Today's Check-outs",
      value: todayCheckOuts.length,
      icon: ArrowUpRight,
      color: 'bg-blue-500',
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'Pending Bookings',
      value: pendingBookings.length,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%',
      trend: 'down',
    },
    {
      label: 'Occupied Rooms',
      value: occupiedRooms.length,
      icon: Clock,
      color: 'bg-purple-500',
      change: '+5%',
      trend: 'up',
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Staff Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {user?.first_name}! Here's today's overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Check-ins */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Check-ins</h2>
          {todayCheckIns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No check-ins scheduled today</div>
          ) : (
            <div className="space-y-3">
              {todayCheckIns.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.user.first_name} {booking.user.last_name}
                    </p>
                    <p className="text-sm text-gray-600">Room {booking.room.room_number}</p>
                  </div>
                  <Badge variant={getBookingStatusColor(booking.status) as 'default' | 'success' | 'warning' | 'danger' | 'info'}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's Check-outs */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Check-outs</h2>
          {todayCheckOuts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No check-outs scheduled today</div>
          ) : (
            <div className="space-y-3">
              {todayCheckOuts.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.user.first_name} {booking.user.last_name}
                    </p>
                    <p className="text-sm text-gray-600">Room {booking.room.room_number}</p>
                  </div>
                  <Badge variant={getBookingStatusColor(booking.status) as 'default' | 'success' | 'warning' | 'danger' | 'info'}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Pending Bookings */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Confirmations</h2>
        {pendingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">All bookings are confirmed</div>
        ) : (
          <div className="space-y-3">
            {pendingBookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {booking.user.first_name} {booking.user.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                  </p>
                </div>
                <Badge variant="warning">PENDING</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StaffDashboard;