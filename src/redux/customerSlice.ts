import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCustomer, Customer, getCustomers, CustomerListResponse } from '../services/customerService';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  }
};

export interface CustomerFilterParams {
  page: number;
  limit: number;
  filter?: {
    searchTerm?: string;
    groupId?: number;
    active?: boolean;
  };
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: CustomerFilterParams, { rejectWithValue }) => {
    try {
      const response = await getCustomers(
        params.page, 
        params.limit,
        params.filter
      );
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customers');
    }
  }
);

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData: Customer, { rejectWithValue }) => {
    try {
      return await createCustomer(customerData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create customer');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Customer reducers
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Customers reducers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;