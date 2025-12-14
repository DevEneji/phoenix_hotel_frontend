// src/pages/customer/Dashboard.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDate, formatCurrency } from '../../utils/format';
import { getBookingStatusColor } from '../../utils/helpers';

const CustomerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { bookings, loading } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const completedBookings = bookings.filter((b) => b.status === 'checked_out');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const stats = [
    {
      label: 'Upcoming Stays',
      value: upcomingBookings.length,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      label: 'Completed Stays',
      value: completedBookings.length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Cancelled',
      value: cancelledBookings.length,
      icon: XCircle,
      color: 'bg-red-500',
    },
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: TrendingUp,
      color: 'bg-indigo-500',
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
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600">Here's an overview of your bookings and account activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Bookings */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upcoming Stays</h2>
          <Button variant="ghost" onClick={() => navigate('/customer/bookings')}>
            View All
          </Button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No upcoming bookings</p>
            <Button variant="primary" onClick={() => navigate('/hotels')}>
              Book a Hotel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/customer/bookings/${booking.id}`)}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{booking.hotel.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={getBookingStatusColor(booking.status) as 'default' | 'danger' | 'success' | 'warning' | 'info'}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/hotels')}
        >
          <Calendar className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Book a Hotel</h3>
          <p className="text-gray-600 text-sm">Find and book your next stay</p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/customer/bookings')}
        >
          <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
          <p className="text-gray-600 text-sm">View all your reservations</p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/customer/profile')}
        >
          <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Profile</h3>
          <p className="text-gray-600 text-sm">Update your information</p>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;