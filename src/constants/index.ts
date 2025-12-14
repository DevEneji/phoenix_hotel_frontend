// src/constants/index.ts

export const APP_NAME = 'Phoenix Hotels';
export const API_TIMEOUT = 30000;
export const ITEMS_PER_PAGE = 10;
export const MAX_GUESTS = 10;
export const MIN_BOOKING_DAYS = 1;
export const MAX_BOOKING_DAYS = 30;

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

export const STAR_RATINGS = [
  { value: 1, label: '1 Star' },
  { value: 2, label: '2 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 5, label: '5 Stars' },
];

export const ROOM_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'TV',
  'Mini Bar',
  'Safe',
  'Hair Dryer',
  'Coffee Maker',
  'Iron',
  'Balcony',
  'Ocean View',
];

export const HOTEL_AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Room Service',
  'Parking',
  'Laundry',
  'Business Center',
  'Conference Rooms',
];