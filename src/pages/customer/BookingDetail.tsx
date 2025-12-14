// src/pages/customer/BookingDetail.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, MessageSquare, CreditCard } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useModal } from '../../hooks/useModal';
import { formatDate, formatCurrency } from '../../utils/format';
import { getBookingStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isOpen, open, close } = useModal();
  const { bookings, loading } = useAppSelector((state) => state.bookings);

  const booking = bookings.find((b) => b.id === parseInt(id || '0'));

  const handleCancelBooking = async () => {
    if (!booking) return;
    try {
      // await dispatch(cancelBooking(booking.id)).unwrap();
      toast.success('Booking cancelled successfully');
      close();
      navigate('/customer/bookings');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/customer/bookings')}>Back to Bookings</Button>
        </Card>
      </div>
    );
  }

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div>
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/customer/bookings')} className="mb-4">
          ← Back to Bookings
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
            <p className="text-gray-600">Booking ID: #{booking.id}</p>
          </div>
          <Badge variant={getBookingStatusColor(booking.status) as 'default' | 'danger' | 'info' | 'success' | 'warning'} className="text-lg px-4 py-2">
            {booking.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Hotel Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Information</h2>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">{booking.hotel.name}</h3>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                {booking.hotel.address}, {booking.hotel.city}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-600">({booking.hotel.star_rating} Star Hotel)</span>
              </div>
            </div>
          </Card>

          {/* Booking Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-in Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(booking.check_in_date, 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-out Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(booking.check_out_date, 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Number of Guests</p>
                <p className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Room Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room.room_number}
                </p>
              </div>
            </div>

            {booking.special_requests && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Special Requests
                </p>
                <p className="text-gray-700">{booking.special_requests}</p>
              </div>
            )}
          </Card>

          {/* Payment Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              Payment Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Total Amount</span>
                <span className="font-semibold">{formatCurrency(booking.total_price)}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-3 border-t">
                <span>Payment Status</span>
                <Badge variant="success">Paid</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                View Receipt
              </Button>
              <Button variant="secondary" className="w-full">
                Contact Hotel
              </Button>
              {canCancel && (
                <Button variant="danger" className="w-full" onClick={open}>
                  Cancel Booking
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                Need help? Contact our support team 24/7 at support@phoenixhotels.com
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Cancel Booking">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={close} className="flex-1">
              Keep Booking
            </Button>
            <Button variant="danger" onClick={handleCancelBooking} className="flex-1">
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetail;
