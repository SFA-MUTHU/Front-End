import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProducts,
  getCategories,
  createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
  getProductById,
  Product,
  Category,
  ProductsListResponse
} from '../services/productService';

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
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

const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
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

// Fetch all products with pagination and filtering
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({
    page = 1,
    limit = 10,
    filter = {}
  }: {
    page?: number;
    limit?: number;
    filter?: {
      searchTerm?: string;
      categoryId?: number;
      status?: string;
      priceMin?: number;
      priceMax?: number;
    };
  }) => {
    const response: ProductsListResponse = await getProducts(page, limit, filter);
    return response;
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    const product = await getProductById(id);
    return product;
  }
);

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const categories = await getCategories();
    return categories;
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Partial<Product>) => {
    const product = await createProductAPI(productData);
    return product;
  }
);

// Update an existing product
export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: number; data: Partial<Product> }) => {
    const product = await updateProductAPI(id, data);
    return product;
  }
);

// Delete a product
export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    await deleteProductAPI(id);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    resetCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })

    // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })

    // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })

    // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, action.payload];
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
        state.success = false;
      })

    // Update Product
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        );
        state.success = true;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
        state.success = false;
      })

    // Delete Product
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { clearProductErrors, resetCurrentProduct } = productSlice.actions;
export default productSlice.reducer;