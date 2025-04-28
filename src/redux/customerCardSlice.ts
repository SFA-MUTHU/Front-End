// src/redux/customerCardSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomerStats, CustomerCardStats } from '../services/customerCardService';

interface CustomerCardState {
  stats: CustomerCardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerCardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchCustomerStats = createAsyncThunk(
  'customerCard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await getCustomerStats();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customer statistics');
    }
  }
);

const customerCardSlice = createSlice({
  name: 'customerCard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerCardSlice.reducer;