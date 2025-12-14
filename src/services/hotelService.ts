// src/services/hotelService.ts

import { api } from './api';
import { Hotel, Room, RoomType, AvailabilityQuery, AvailableRoom, PaginatedResponse } from '../types';

export const hotelService = {
  // Get all hotels
  getHotels: async (params?: any): Promise<PaginatedResponse<Hotel>> => {
    return api.get<PaginatedResponse<Hotel>>('/hotels/', { params });
  },

  // Get hotel by ID
  getHotelById: async (id: number): Promise<Hotel> => {
    return api.get<Hotel>(`/hotels/${id}/`);
  },

  // Create hotel (Admin only)
  createHotel: async (data: Partial<Hotel>): Promise<Hotel> => {
    return api.post<Hotel>('/hotels/', data);
  },

  // Update hotel (Admin only)
  updateHotel: async (id: number, data: Partial<Hotel>): Promise<Hotel> => {
    return api.patch<Hotel>(`/hotels/${id}/`, data);
  },

  // Delete hotel (Admin only)
  deleteHotel: async (id: number): Promise<void> => {
    return api.delete<void>(`/hotels/${id}/`);
  },

  // Get room types
  getRoomTypes: async (): Promise<RoomType[]> => {
    return api.get<RoomType[]>('/room-types/');
  },

  // Get rooms
  getRooms: async (params?: any): Promise<PaginatedResponse<Room>> => {
    return api.get<PaginatedResponse<Room>>('/rooms/', { params });
  },

  // Check availability
  checkAvailability: async (query: AvailabilityQuery): Promise<AvailableRoom[]> => {
    return api.post<AvailableRoom[]>('/availability/', query);
  },
};

