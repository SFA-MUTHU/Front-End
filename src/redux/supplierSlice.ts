import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierService from '../services/supplierService';

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (params: { page?: number; limit?: number; filter?: any } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, filter = {} } = params;
      return await supplierService.getSuppliers(page, limit, filter);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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

export const fetchSupplierDetails = createAsyncThunk(
  'suppliers/fetchDetails',
  async (id: number, { rejectWithValue }) => {
    try {
      return await supplierService.getSupplierDetails(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (supplierData: any, { rejectWithValue }) => {
    try {
      return await supplierService.createSupplier(supplierData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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

export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      return await supplierService.deleteSupplier(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface SupplierState {
  suppliers: supplierService.Supplier[];
  currentSupplier: supplierService.Supplier | null;
  supplierDetails: supplierService.SupplierDetails | null;
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
  supplierDetails: null,
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
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
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
      // Fetch supplier details
      .addCase(fetchSupplierDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierDetails = action.payload;
      })
      .addCase(fetchSupplierDetails.rejected, (state, action) => {
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
        // Remove the deleted supplier from the list
        state.suppliers = state.suppliers.filter(supplier => supplier.id !== action.meta.arg);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentSupplier, clearError } = supplierSlice.actions;

export default supplierSlice.reducer;
