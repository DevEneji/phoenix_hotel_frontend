// src/pages/HomePage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Search, MapPin, Calendar, Users, Star, CheckCircle } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { checkAvailability } from '../store/slices/hotelSlice';
import toast from 'react-hot-toast';

const searchSchema = z.object({
  check_in_date: z.string().min(1, 'Check-in date is required'),
  check_out_date: z.string().min(1, 'Check-out date is required'),
  guests: z.number().min(1, 'At least 1 guest is required').max(10),
});

type SearchFormData = z.infer<typeof searchSchema>;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      guests: 2,
    },
  });

  const onSearch = async (data: SearchFormData) => {
    setSearching(true);
    try {
      await dispatch(checkAvailability(data)).unwrap();
      // Navigate to hotels page with search params
      const params = new URLSearchParams({
        check_in: data.check_in_date,
        check_out: data.check_out_date,
        guests: data.guests.toString(),
      });
      navigate(`/hotels?${params.toString()}`);
    } catch (err: any) {
      toast.error(err || 'Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100">
              Discover luxury hotels and unforgettable experiences
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Check-in
                  </label>
                  <input
                    {...register('check_in_date')}
                    type="date"
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.check_in_date && (
                    <p className="mt-1 text-xs text-red-600">{errors.check_in_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Check-out
                  </label>
                  <input
                    {...register('check_out_date')}
                    type="date"
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.check_out_date && (
                    <p className="mt-1 text-xs text-red-600">{errors.check_out_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Guests
                  </label>
                  <input
                    {...register('guests', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.guests && (
                    <p className="mt-1 text-xs text-red-600">{errors.guests.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>{searching ? 'Searching...' : 'Search Hotels'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Phoenix Hotels?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prime Locations</h3>
              <p className="text-gray-600">
                Hotels in the heart of major cities and tourist destinations worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Luxury Experience</h3>
              <p className="text-gray-600">
                Premium amenities and world-class service for an unforgettable stay.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple, secure booking process with instant confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of satisfied guests who trust Phoenix Hotels for their travels.
          </p>
          <button
            onClick={() => navigate('/auth/register')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 inline-flex items-center space-x-2"
          >
            <span>Sign Up Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;