// src/pages/admin/HotelManagement.tsx

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, MapPin, Star } from 'lucide-react';
import { Button, Card, Badge, Modal, LoadingSpinner } from '../../components';
import { useModal } from '../../hooks/useModal';
import { formatDate } from '../../utils/format';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const hotelSchema = z.object({
  name: z.string().min(3, 'Hotel name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  star_rating: z.number().min(1).max(5),
});

type HotelFormData = z.infer<typeof hotelSchema>;

const AdminHotelManagement: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const { isOpen, open, close } = useModal();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      star_rating: 3,
    },
  });

  // Mock data - replace with API call
  useEffect(() => {
    setHotels([
      {
        id: 1,
        name: 'Grand Plaza Hotel',
        description: 'Luxury hotel in the heart of the city',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        phone: '+1234567890',
        email: 'contact@grandplaza.com',
        star_rating: 5,
        created_at: '2024-01-15',
      },
      {
        id: 2,
        name: 'Oceanview Resort',
        description: 'Beautiful beachfront resort',
        address: '456 Beach Rd',
        city: 'Miami',
        country: 'USA',
        phone: '+1234567891',
        email: 'info@oceanview.com',
        star_rating: 4,
        created_at: '2024-02-20',
      },
    ]);
  }, []);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedHotel(null);
    reset();
    open();
  };

  const handleOpenEditModal = (hotel: any) => {
    setIsEditMode(true);
    setSelectedHotel(hotel);
    Object.keys(hotel).forEach((key) => {
      setValue(key as any, hotel[key]);
    });
    open();
  };

  const onSubmit = async (data: HotelFormData) => {
    try {
      if (isEditMode && selectedHotel) {
        // Update hotel
        setHotels(hotels.map((h) => (h.id === selectedHotel.id ? { ...h, ...data } : h)));
        toast.success('Hotel updated successfully');
      } else {
        // Add new hotel
        const newHotel = { ...data, id: hotels.length + 1, created_at: new Date().toISOString() };
        setHotels([...hotels, newHotel]);
        toast.success('Hotel added successfully');
      }
      close();
      reset();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        setHotels(hotels.filter((h) => h.id !== hotelId));
        toast.success('Hotel deleted successfully');
      } catch (err) {
        toast.error('Failed to delete hotel');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Management</h1>
          <p className="text-gray-600">Manage all hotels in the system</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          <Plus className="h-5 w-5 mr-2" />
          Add Hotel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Hotels</p>
          <p className="text-3xl font-bold text-gray-900">{hotels.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">5-Star Hotels</p>
          <p className="text-3xl font-bold text-gray-900">
            {hotels.filter((h) => h.star_rating === 5).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">4-Star Hotels</p>
          <p className="text-3xl font-bold text-gray-900">
            {hotels.filter((h) => h.star_rating === 4).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Cities Covered</p>
          <p className="text-3xl font-bold text-gray-900">
            {new Set(hotels.map((h) => h.city)).size}
          </p>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search hotels by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{hotel.name}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 mr-1">{hotel.star_rating}</span>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {hotel.city}, {hotel.country}
                </p>
                <p className="text-sm text-gray-600">{hotel.phone}</p>
                <p className="text-sm text-gray-600">{hotel.email}</p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleOpenEditModal(hotel)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => handleDeleteHotel(hotel.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Hotel Modal */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title={isEditMode ? 'Edit Hotel' : 'Add New Hotel'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Grand Plaza Hotel"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the hotel..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                {...register('city')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="New York"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                {...register('country')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="USA"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              {...register('address')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="123 Main Street"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="+1234567890"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="hotel@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
            <select
              {...register('star_rating', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
            {errors.star_rating && (
              <p className="mt-1 text-sm text-red-600">{errors.star_rating.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={close} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {isEditMode ? 'Update Hotel' : 'Create Hotel'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export { AdminHotelManagement };