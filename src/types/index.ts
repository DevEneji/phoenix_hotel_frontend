// src/types/index.ts

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning'
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  star_rating: number;
  image: string;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  id: number;
  name: string;
  description: string;
  max_occupancy: number;
  base_price: number;
  amenities: string[];
  image: string;
}

export interface Room {
  id: number;
  hotel: number;
  room_type: RoomType;
  room_number: string;
  floor: number;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityQuery {
  hotel_id?: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  room_type_id?: number;
}

export interface AvailableRoom {
  room_type: RoomType;
  available_rooms: Room[];
  total_price: number;
  nights: number;
}

export interface Booking {
  id: number;
  user: User;
  hotel: Hotel;
  room: Room;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  special_requests?: string;
}

export interface Payment {
  id: number;
  booking: number;
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id?: string;
  payment_date: string;
  created_at: string;
}

export interface CreatePaymentData {
  booking_id: number;
  amount: number;
  payment_method: string;
}

export interface Review {
  id: number;
  user: User;
  hotel: Hotel;
  booking: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  booking_id: number;
  hotel_id: number;
  rating: number;
  comment: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export interface DashboardStats {
  total_bookings: number;
  total_revenue: number;
  active_bookings: number;
  total_customers: number;
  occupancy_rate: number;
  today_checkins: number;
  today_checkouts: number;
}

export interface SearchFilters {
  hotel_id?: number;
  check_in_date?: string;
  check_out_date?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  room_type?: string;
  star_rating?: number;
}