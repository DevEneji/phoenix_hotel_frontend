// src/services/reviewService.ts

import { Review, CreateReviewData, PaginatedResponse } from '../types';
import api from './api';

export const reviewService = {
  // Get all reviews
  getReviews: async (params?: any): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>('/reviews/', { params });
    return response.data;
  },

  // Get hotel reviews
  getHotelReviews: async (hotelId: number): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/', { params: { hotel: hotelId } });
    return response.data;
  },

  // Create review
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await api.post<Review>('/reviews/', data);
    return response.data;
  },

  // Update review
  updateReview: async (id: number, data: Partial<Review>): Promise<Review> => {
    const response = await api.patch<Review>(`/reviews/${id}/`, data);
    return response.data;
  },

  // Delete review (Admin only)
  deleteReview: async (id: number): Promise<void> => {
    await api.delete<void>(`/reviews/${id}/`);
  },

  // Approve review (Admin only)
  approveReview: async (id: number): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/${id}/approve/`);
    return response.data;
  },
};