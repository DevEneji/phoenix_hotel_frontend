// src/pages/HotelListPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, MapPin, Filter, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchHotels } from '../store/slices/hotelSlice';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { SkeletonCard } from '../components/SkeletonCard';
import { formatCurrency } from '../utils/format';

const HotelListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { hotels, loading } = useAppSelector((state) => state.hotels);

  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    starRating: '',
  });

  useEffect(() => {
    const params = {
      check_in: searchParams.get('check_in'),
      check_out: searchParams.get('check_out'),
      guests: searchParams.get('guests'),
    };
    dispatch(fetchHotels(params));
  }, [dispatch, searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (filters.city && !hotel.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.starRating && hotel.star_rating < parseInt(filters.starRating)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Hotels</h1>
          <p className="text-gray-600">
            {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Star Rating
                  </label>
                  <select
                    value={filters.starRating}
                    onChange={(e) => handleFilterChange('starRating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Ratings</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    setFilters({ city: '', minPrice: '', maxPrice: '', starRating: '' })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </aside>

          {/* Hotel List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">No hotels found matching your criteria.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <Card
                    key={hotel.id}
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                    className="cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative overflow-hidden">
                      {hotel.image ? (
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-white text-2xl font-bold">{hotel.name}</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="success" className="bg-white text-gray-900">
                          {hotel.star_rating} <Star className="inline h-3 w-3 fill-yellow-400" />
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                      <p className="text-gray-600 flex items-center mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.city}, {hotel.country}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {hotel.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge key={idx} variant="info">
                            {amenity}
                          </Badge>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <Badge variant="default">+{hotel.amenities.length - 3} more</Badge>
                        )}
                      </div>

                      <Button variant="primary" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListPage;