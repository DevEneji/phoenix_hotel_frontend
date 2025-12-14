// src/pages/admin/Dashboard.tsx

import React, { useState } from 'react';
import {
  Users,
  Hotel,
  DollarSign,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { formatCurrency } from '../../utils/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats] = useState({
    totalUsers: 1247,
    totalHotels: 45,
    monthlyRevenue: 245780,
    activeBookings: 189,
    growthRate: 12.5,
  });

  // Mock revenue data
  const revenueData = [
    { month: 'Jan', revenue: 180000 },
    { month: 'Feb', revenue: 195000 },
    { month: 'Mar', revenue: 210000 },
    { month: 'Apr', revenue: 225000 },
    { month: 'May', revenue: 235000 },
    { month: 'Jun', revenue: 245780 },
  ];

  // Mock bookings data
  const bookingsData = [
    { month: 'Jan', bookings: 145 },
    { month: 'Feb', bookings: 156 },
    { month: 'Mar', bookings: 168 },
    { month: 'Apr', bookings: 172 },
    { month: 'May', bookings: 180 },
    { month: 'Jun', bookings: 189 },
  ];

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+8.2%',
      trend: 'up',
    },
    {
      label: 'Total Hotels',
      value: stats.totalHotels,
      icon: Hotel,
      color: 'bg-purple-500',
      change: '+3.1%',
      trend: 'up',
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
      trend: 'up',
    },
    {
      label: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'bg-indigo-500',
      change: '+5.7%',
      trend: 'up',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Complete overview of system performance and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <TrendIcon className="h-4 w-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bookings Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Hotels</h2>
          <div className="space-y-4">
            {[
              { name: 'Grand Plaza Hotel', bookings: 89, revenue: 45890 },
              { name: 'Oceanview Resort', bookings: 76, revenue: 38900 },
              { name: 'Mountain Lodge', bookings: 68, revenue: 34200 },
              { name: 'City Center Inn', bookings: 54, revenue: 27600 },
            ].map((hotel, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{hotel.name}</p>
                    <p className="text-sm text-gray-600">{hotel.bookings} bookings</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(hotel.revenue)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {[
              {
                user: 'John Doe',
                hotel: 'Grand Plaza Hotel',
                rating: 5,
                comment: 'Excellent service and comfortable rooms!',
              },
              {
                user: 'Jane Smith',
                hotel: 'Oceanview Resort',
                rating: 4,
                comment: 'Beautiful location with great amenities.',
              },
              {
                user: 'Mike Johnson',
                hotel: 'Mountain Lodge',
                rating: 5,
                comment: 'Perfect getaway destination!',
              },
            ].map((review, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{review.user}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{review.hotel}</p>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;