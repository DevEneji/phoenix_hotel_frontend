// src/pages/customer/CreateReviewPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const CreateReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  const hotelId = searchParams.get('hotel');
  
  const [hoveredRating, setHoveredRating] = useState(0);
  const { bookings } = useAppSelector((state) => state.bookings);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const rating = watch('rating');

  // Find the booking details
  const booking = bookings.find((b) => b.id === parseInt(bookingId || '0'));

  useEffect(() => {
    if (!bookingId || !hotelId) {
      toast.error('Invalid review request');
      navigate('/customer/bookings');
    }
  }, [bookingId, hotelId, navigate]);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      // await reviewService.createReview({
      //   booking_id: parseInt(bookingId || '0'),
      //   hotel_id: parseInt(hotelId || '0'),
      //   rating: data.rating,
      //   comment: data.comment,
      // });
      toast.success('Review submitted successfully!');
      navigate('/customer/bookings');
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/customer/bookings')} className="mb-4">
          ← Back to Bookings
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
        <p className="text-gray-600">Share your experience with other travelers</p>
      </div>

      {booking && (
        <Card className="p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.hotel.name}</h3>
          <p className="text-gray-600">
            Your stay: {new Date(booking.check_in_date).toLocaleDateString()} -{' '}
            {new Date(booking.check_out_date).toLocaleDateString()}
          </p>
        </Card>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              How was your stay?
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-12 w-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-2xl font-bold text-gray-900">
                {rating > 0 ? `${rating}.0` : '0.0'}
              </span>
            </div>
            {errors.rating && (
              <p className="mt-2 text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Tell us about your experience
            </label>
            <textarea
              {...register('comment')}
              rows={6}
              placeholder="Share details about your stay, room quality, service, amenities, location, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.comment && (
              <p className="mt-2 text-sm text-red-600">{errors.comment.message}</p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Tips for writing a great review:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about what you liked or didn't like</li>
              <li>• Mention the cleanliness, comfort, and amenities</li>
              <li>• Describe the staff's service and hospitality</li>
              <li>• Share tips about the location and nearby attractions</li>
              <li>• Be honest and constructive</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/customer/bookings')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Submit Review
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateReviewPage;