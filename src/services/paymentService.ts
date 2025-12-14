// src/services/paymentService.ts

import { Payment, CreatePaymentData, PaginatedResponse } from '../types';
import api from './api';

export const paymentService = {
  // Get all payments
  getPayments: async (params?: any): Promise<PaginatedResponse<Payment>> => {
    const res = await api.get<PaginatedResponse<Payment>>('/payments/', { params });
    return res.data;
  },

  // Get payment by ID
  getPaymentById: async (id: number): Promise<Payment> => {
    const res = await api.get<Payment>(`/payments/${id}/`);
    return res.data;
  },

  // Create payment
  createPayment: async (data: CreatePaymentData): Promise<Payment> => {
    const res = await api.post<Payment>('/payments/', data);
    return res.data;
  },

  // Process M-Pesa payment
  processMpesaPayment: async (data: any): Promise<any> => {
    const res = await api.post<any>('/payments/mpesa/', data);
    return res.data;
  },
};