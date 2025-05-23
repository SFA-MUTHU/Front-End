import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierService from '../services/supplierService';

// Fetch all suppliers
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await supplierService.getSuppliers();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch supplier by ID
export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await supplierService.getSupplierById(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Fetch supplier products
export const fetchSupplierProducts = createAsyncThunk(
  'suppliers/fetchProducts',
  async (id: number, { rejectWithValue }) => {
    try {
      return await supplierService.getSupplierProducts(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create a new supplier
export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (supplierData: supplierService.Supplier, { rejectWithValue }) => {
    try {
      return await supplierService.createSupplier(supplierData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Update an existing supplier
export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, data }: { id: number; data: Partial<supplierService.Supplier> }, { rejectWithValue }) => {
    try {
      return await supplierService.updateSupplier(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete a supplier
export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await supplierService.deleteSupplier(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface SupplierState {
  suppliers: supplierService.Supplier[];
  currentSupplier: supplierService.Supplier | null;
  supplierProducts: Record<number, supplierService.SupplierProduct[]>;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: SupplierState = {
  suppliers: [],
  currentSupplier: null,
  supplierProducts: {},
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  }
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearCurrentSupplier(state) {
      state.currentSupplier = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch supplier by ID
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch supplier products
      .addCase(fetchSupplierProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierProducts = {
          ...state.supplierProducts,
          [action.meta.arg]: action.payload
        };
      })
      .addCase(fetchSupplierProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create supplier
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = [...state.suppliers, action.payload];
        state.pagination = {
          ...state.pagination,
          total: state.pagination.total + 1,
          pages: Math.ceil((state.pagination.total + 1) / state.pagination.limit)
        };
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update supplier
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.map(supplier =>
          supplier.id === action.payload.id ? action.payload : supplier
        );
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter(supplier => supplier.id !== action.payload);
        state.pagination = {
          ...state.pagination,
          total: state.pagination.total - 1,
          pages: Math.ceil((state.pagination.total - 1) / state.pagination.limit)
        };
        if (state.currentSupplier?.id === action.payload) {
          state.currentSupplier = null;
        }
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentSupplier, clearError } = supplierSlice.actions;

export default supplierSlice.reducer;