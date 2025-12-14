// src/store/slices/bookingSlice.ts

import { Booking, CreateBookingData } from '../../types';
import { bookingService } from '../../services/bookingService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialBookingState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const bookings = await bookingService.getMyBookings();
      return bookings;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to fetch bookings');
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (params?: any, { rejectWithValue }: { rejectWithValue?: any } = {}) => {
    try {
      const response = await bookingService.getBookings(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to fetch bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (data: CreateBookingData, { rejectWithValue }) => {
    try {
      const booking = await bookingService.createBooking(data);
      return booking;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const confirmBooking = createAsyncThunk(
  'bookings/confirm',
  async (id: number, { rejectWithValue }) => {
    try {
      const booking = await bookingService.confirmBooking(id);
      return booking;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to confirm booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: initialBookingState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All Bookings
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.results;
        state.totalCount = action.payload.count;
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Confirm Booking
      .addCase(confirmBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentBooking, setCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;