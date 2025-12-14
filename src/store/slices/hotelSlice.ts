// src/store/slices/hotelSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { hotelService } from '../../services/hotelService';
import { Hotel, Room, RoomType, AvailableRoom, AvailabilityQuery } from '../../types';

interface HotelState {
  hotels: Hotel[];
  currentHotel: Hotel | null;
  roomTypes: RoomType[];
  rooms: Room[];
  availableRooms: AvailableRoom[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: HotelState = {
  hotels: [],
  currentHotel: null,
  roomTypes: [],
  rooms: [],
  availableRooms: [],
  loading: false,
  error: null,
  totalCount: 0,
};

// Async thunks
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await hotelService.getHotels(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to fetch hotels');
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const hotel = await hotelService.getHotelById(id);
      return hotel;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to fetch hotel');
    }
  }
);

export const fetchRoomTypes = createAsyncThunk(
  'hotels/fetchRoomTypes',
  async (_, { rejectWithValue }) => {
    try {
      const roomTypes = await hotelService.getRoomTypes();
      return roomTypes;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to fetch room types');
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'hotels/checkAvailability',
  async (query: AvailabilityQuery, { rejectWithValue }) => {
    try {
      const available = await hotelService.checkAvailability(query);
      return available;
    } catch (error: any) {
      return rejectWithValue(error.detail || 'Failed to check availability');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
    clearAvailableRooms: (state) => {
      state.availableRooms = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Hotel by ID
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Room Types
      .addCase(fetchRoomTypes.fulfilled, (state, action) => {
        state.roomTypes = action.payload;
      })
      // Check Availability
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRooms = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentHotel, clearAvailableRooms, clearError } = hotelSlice.actions;
export default hotelSlice.reducer;

