// src/utils/helpers.ts

import { BookingStatus, PaymentStatus, RoomStatus } from '../types';

export const getBookingStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.PENDING:
      return 'warning';
    case BookingStatus.CONFIRMED:
      return 'info';
    case BookingStatus.CHECKED_IN:
      return 'success';
    case BookingStatus.CHECKED_OUT:
      return 'default';
    case BookingStatus.CANCELLED:
      return 'danger';
    default:
      return 'default';
  }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'warning';
    case PaymentStatus.COMPLETED:
      return 'success';
    case PaymentStatus.FAILED:
      return 'danger';
    case PaymentStatus.REFUNDED:
      return 'info';
    default:
      return 'default';
  }
};

export const getRoomStatusColor = (status: RoomStatus): string => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return 'success';
    case RoomStatus.OCCUPIED:
      return 'danger';
    case RoomStatus.MAINTENANCE:
      return 'warning';
    case RoomStatus.CLEANING:
      return 'info';
    default:
      return 'default';
  }
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};