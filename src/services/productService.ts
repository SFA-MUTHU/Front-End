import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface Product {
  id?: number;
  name: string;
  category_id: number;
  description: string;
  price: number;
  cost_price: number;
  discount: number;
  stock: number;
  status: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  sub_category?: string;
  supplier_id?: number;
  category?: {
    id: number;
    name: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ProductsListResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Get all products with pagination and filtering
export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  filter: {
    searchTerm?: string;
    categoryId?: number;
    status?: string;
    priceMin?: number;
    priceMax?: number;
  } = {}
): Promise<ProductsListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filter.searchTerm) {
      params.append('search', filter.searchTerm);
    }

    if (filter.categoryId) {
      params.append('categoryId', filter.categoryId.toString());
    }

    if (filter.status) {
      params.append('status', filter.status);
    }

    if (filter.priceMin) {
      params.append('priceMin', filter.priceMin.toString());
    }

    if (filter.priceMax) {
      params.append('priceMax', filter.priceMax.toString());
    }

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Create new product
export const createProductAPI = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (
  id: number,
  data: Partial<Product>
): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Upload product image
export const uploadProductImage = async (productId: number, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/products/${productId}/image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.image_url;
  } catch (error) {
    console.error(`Error uploading image for product ${productId}:`, error);
    throw error;
  }
};
