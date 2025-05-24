import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createCustomer, 
  getCustomers, 
  getCustomerById, 
  updateCustomer as updateCustomerAPI, 
  deleteCustomer as deleteCustomerAPI, 
  getCustomerGroups,
  Customer, 
  CustomerGroup, 
} from '../services/customerService';

interface CustomerState {
  customers: Customer[];
  customerGroups: CustomerGroup[];
  currentCustomer: Customer | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CustomerState = {
  customers: [],
  customerGroups: [],
  currentCustomer: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  loading: false,
  error: null,
  success: false
};

// Create a customer
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

// Fetch customers with pagination and filters
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async ({ 
    page = 1, 
    limit = 10, 
    filter = {} 
  }: {
    page?: number;
    limit?: number;
    filter?: {
      searchTerm?: string;
      groupId?: number;
      status?: string;
    };
  }, { rejectWithValue }) => {
    try {
      return await getCustomers(page, limit, filter);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customers');
    }
  }
);

// Fetch a customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await getCustomerById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customer');
    }
  }
);

// Update a customer
export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: number; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      return await updateCustomerAPI(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update customer');
    }
  }
);

// Delete a customer
export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCustomerAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete customer');
    }
  }
);

// Fetch customer groups
export const fetchCustomerGroups = createAsyncThunk(
  'customers/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      return await getCustomerGroups();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customer groups');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    resetCurrentCustomer: (state) => {
      state.currentCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Customer
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
        state.success = true;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Fetch Customers
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
      })
      
      // Fetch Customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.map(customer => 
          customer.id === action.payload.id ? action.payload : customer
        );
        state.currentCustomer = action.payload;
        state.success = true;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Fetch Customer Groups
      .addCase(fetchCustomerGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.customerGroups = action.payload;
      })
      .addCase(fetchCustomerGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomerErrors, resetCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;