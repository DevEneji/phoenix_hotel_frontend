// src/pages/staff/RoomManagement.tsx

import React, { useState, useEffect } from 'react';
import { DoorOpen, Wrench, Sparkles } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { getRoomStatusColor } from '../../utils/helpers';
import { RoomStatus } from '../../types';
import toast from 'react-hot-toast';

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('all');

  // Mock data - replace with API call
  useEffect(() => {
    // Fetch rooms from API
    setRooms([
      { id: 1, room_number: '101', floor: 1, status: 'available', type: 'Deluxe' },
      { id: 2, room_number: '102', floor: 1, status: 'occupied', type: 'Suite' },
      { id: 3, room_number: '103', floor: 1, status: 'cleaning', type: 'Standard' },
      { id: 4, room_number: '201', floor: 2, status: 'maintenance', type: 'Deluxe' },
      { id: 5, room_number: '202', floor: 2, status: 'available', type: 'Suite' },
      { id: 6, room_number: '203', floor: 2, status: 'available', type: 'Standard' },
      { id: 7, room_number: '301', floor: 3, status: 'occupied', type: 'Deluxe' },
      { id: 8, room_number: '302', floor: 3, status: 'available', type: 'Suite' },
    ]);
  }, []);

  const filteredRooms = rooms.filter(
    (room) => selectedStatus === 'all' || room.status === selectedStatus
  );

  const statusCounts = {
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    cleaning: rooms.filter((r) => r.status === 'cleaning').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
  };

  const handleStatusChange = (roomId: number, newStatus: RoomStatus) => {
    setRooms(rooms.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
    toast.success('Room status updated successfully');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
        <p className="text-gray-600">Monitor and update room status</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-3xl font-bold text-green-600">{statusCounts.available}</p>
            </div>
            <DoorOpen className="h-10 w-10 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Occupied</p>
              <p className="text-3xl font-bold text-red-600">{statusCounts.occupied}</p>
            </div>
            <DoorOpen className="h-10 w-10 text-red-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cleaning</p>
              <p className="text-3xl font-bold text-blue-600">{statusCounts.cleaning}</p>
            </div>
            <Sparkles className="h-10 w-10 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Maintenance</p>
              <p className="text-3xl font-bold text-yellow-600">{statusCounts.maintenance}</p>
            </div>
            <Wrench className="h-10 w-10 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <option value="all">All Rooms ({rooms.length})</option>
          <option value="available">Available ({statusCounts.available})</option>
          <option value="occupied">Occupied ({statusCounts.occupied})</option>
          <option value="cleaning">Cleaning ({statusCounts.cleaning})</option>
          <option value="maintenance">Maintenance ({statusCounts.maintenance})</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Room {room.room_number}</h3>
              <p className="text-sm text-gray-600">Floor {room.floor} • {room.type}</p>
            </div>

            <Badge
              variant={getRoomStatusColor(room.status) as 'default' | 'success' | 'warning' | 'danger' | 'info'}
              className="w-full justify-center mb-4 text-sm py-2"
            >
              {room.status.toUpperCase()}
            </Badge>

            <select
              value={room.status}
              onChange={(e) => handleStatusChange(room.id, e.target.value as RoomStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="p-12 text-center">
          <DoorOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No rooms found with the selected status</p>
        </Card>
      )}
    </div>
  );
};

export default RoomManagement;

