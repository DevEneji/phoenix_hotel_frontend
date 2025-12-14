// src/pages/staff/BookingManagement.tsx

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllBookings, confirmBooking } from '../../store/slices/bookingSlice';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useModal } from '../../hooks/useModal';
import { formatDate } from '../../utils/format';
import { getBookingStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BookingManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.bookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    dispatch(fetchAllBookings(undefined));
  }, [dispatch]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.room_number.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirm = async (bookingId: number) => {
    try {
      await dispatch(confirmBooking(bookingId)).unwrap();
      toast.success('Booking confirmed successfully');
    } catch (err) {
      toast.error('Failed to confirm booking');
    }
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    open();
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600">View and manage all hotel bookings</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.user.first_name} {booking.user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.room.room_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(booking.check_in_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(booking.check_out_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getBookingStatusColor(booking.status) as 'default' | 'success' | 'warning' | 'danger' | 'info'}>
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        View
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleConfirm(booking.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Booking Detail Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Booking Details" size="lg">
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Guest Name</p>
                <p className="font-medium text-gray-900">
                  {selectedBooking.user.first_name} {selectedBooking.user.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">{selectedBooking.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-900">{selectedBooking.user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Room Number</p>
                <p className="font-medium text-gray-900">{selectedBooking.room.room_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-in Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedBooking.check_in_date, 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-out Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedBooking.check_out_date, 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            {selectedBooking.special_requests && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                <p className="font-medium text-gray-900">{selectedBooking.special_requests}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
