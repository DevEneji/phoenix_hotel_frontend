// src/pages/RoomDetailPage.tsx

import { Coffee } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { formatCurrency } from "../utils/format";

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(2);

  // Mock room data - replace with actual API call
  const room = {
    id: parseInt(id || '0'),
    name: 'Deluxe Ocean View Suite',
    type: 'Suite',
    price: 250,
    maxOccupancy: 4,
    description: 'Spacious suite with breathtaking ocean views and modern amenities.',
    amenities: ['King Bed', 'Ocean View', 'WiFi', 'Mini Bar', 'Safe', 'Balcony'],
    images: [],
  };

  const handleBooking = () => {
    navigate('/customer/bookings/create', {
      state: { room, checkIn: selectedDates.checkIn, checkOut: selectedDates.checkOut, guests },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="mb-6">
                <Badge variant="info" className="mb-2">
                  {room.type}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
                <p className="text-gray-600">{room.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Coffee className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-700 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-600 mb-2">
                  <strong>Max Occupancy:</strong> {room.maxOccupancy} guests
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  {formatCurrency(room.price)}
                  <span className="text-lg text-gray-500 font-normal"> / night</span>
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Room</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={selectedDates.checkIn}
                    onChange={(e) =>
                      setSelectedDates({ ...selectedDates, checkIn: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={selectedDates.checkOut}
                    onChange={(e) =>
                      setSelectedDates({ ...selectedDates, checkOut: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={room.maxOccupancy}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleBooking}
                  disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RoomDetailPage };

