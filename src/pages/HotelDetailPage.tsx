// src/pages/HotelDetailPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Wifi, Coffee, Dumbbell, Loader2 } from 'lucide-react';
import { fetchHotelById } from '../store/slices/hotelSlice';
import { useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentHotel: hotel, loading } = useAppSelector((state) => state.hotels);

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hotel Not Found</h2>
          <Button onClick={() => navigate('/hotels')}>Back to Hotels</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hotel Images */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
          <div className="h-96 bg-gradient-to-r from-indigo-500 to-purple-500">
            {hotel.image ? (
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-white text-4xl font-bold">{hotel.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Info */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {hotel.address}, {hotel.city}, {hotel.country}
                  </p>
                </div>
                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-gray-900 mr-1">
                    {hotel.star_rating}
                  </span>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">About This Hotel</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{hotel.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{hotel.email}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Wifi className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Stay</h3>
              <Button
                variant="primary"
                className="w-full mb-4"
                onClick={() => navigate(`/hotels/${hotel.id}/rooms`)}
              >
                View Available Rooms
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/hotels')}>
                Back to Hotels
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HotelDetailPage };