// src/pages/customer/MyBookings.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDate, formatCurrency } from '../../utils/format';
import { getBookingStatusColor } from '../../utils/helpers';

const MyBookings: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useAppSelector((state) => state.bookings);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your hotel reservations</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/hotels')}>
          Book New Hotel
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { value: 'all', label: 'All Bookings' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'checked_in', label: 'Checked In' },
          { value: 'checked_out', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              filter === tab.value
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No bookings found</p>
          <Button variant="primary" onClick={() => navigate('/hotels')}>
            Make a Booking
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/customer/bookings/${booking.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{booking.hotel.name}</h3>
                    <Badge variant={getBookingStatusColor(booking.status) as 'default' | 'danger' | 'success' | 'warning' | 'info'}>
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700">Check-in</p>
                      <p>{formatDate(booking.check_in_date, 'EEE, MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Check-out</p>
                      <p>{formatDate(booking.check_out_date, 'EEE, MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Guests</p>
                      <p>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <p className="mt-3 text-sm text-gray-600">
                      <strong>Special Requests:</strong> {booking.special_requests}
                    </p>
                  )}
                </div>

                <div className="text-right ml-6">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(booking.total_price)}
                  </p>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
