// src/services/bookingService.ts

import { Booking, CreateBookingData, PaginatedResponse } from '../types';
import api from './api';

export const bookingService = {
  // Get all bookings
  getBookings: async (params?: any): Promise<PaginatedResponse<Booking>> => {
    const response = await api.get<PaginatedResponse<Booking>>('/bookings/', { params });
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/my/');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}/`);
    return response.data;
  },

  // Create booking
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings/', data);
    return response.data;
  },

  // Update booking
  updateBooking: async (id: number, data: Partial<Booking>): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/`, data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: number): Promise<Booking> => {
    const response = await api.delete<Booking>(`/bookings/${id}/`);
    return response.data;
  },

  // Confirm booking (Staff only)
  confirmBooking: async (id: number): Promise<Booking> => {
    const response = await api.post<Booking>(`/bookings/${id}/confirm/`);
    return response.data;
  },
};