import { API_BASE_URL, getAuthHeaders } from './apiConfig';

// Product interface EXACTLY matching Prisma schema - nothing extra
export interface Product {
  // Base fields from Prisma schema
  id?: number;
  name: string;
  description: string;
  price: number;
  barcode: string;
  created_at?: string; // Optional as it's auto-generated
  category_id: number;
  
  // Relations - these might be included in responses
  categories?: {
    id: number;
    name: string;
    description?: string;
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

// Create new product - Ensuring we only send fields that match the schema
export const createProductAPI = async (productData: Partial<Product>): Promise<Product> => {
  try {
    // Ensure API URL is correct
    const apiUrl = `${API_BASE_URL}/products`;
    console.log('Sending product creation request to:', apiUrl);
    
    // Filter out any fields that aren't in the Prisma schema
    const validFields = ['name', 'description', 'price', 'barcode', 'category_id'];
    const filteredPayload = Object.fromEntries(
      Object.entries(productData).filter(([key]) => validFields.includes(key))
    );
    
    console.log('Filtered payload (only valid fields):', filteredPayload);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredPayload),
    });

    console.log('Response status:', response.status);
    
    // Get response text before checking if response is ok
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    if (!response.ok) {
      let errorMessage = 'Unknown error occurred';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing response JSON:', e);
      throw new Error('Invalid response format from server');
    }

    return responseData;
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

// Updated ProductVariant interface to match backend schema
export interface ProductVariant {
  id?: number;
  product_id: number;
  size: string;
  color: string;
  stock: number;
  created_at?: string;
}

// Create a new product variant - updated to match backend expectations
export const createProductVariant = async (variantData: Partial<ProductVariant>): Promise<ProductVariant> => {
  try {
    const apiUrl = `${API_BASE_URL}/product-variants`;
    console.log('Creating product variant:', variantData);
    
    // Transform field names to match backend expectations
    const payload = {
      productId: variantData.product_id, // Backend controller expects productId
      size: variantData.size,
      color: variantData.color,
      stockQuantity: variantData.stock // Backend controller expects stockQuantity
    };
    
    console.log('Transformed payload for backend:', payload);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the response back to our interface format if needed
    return {
      id: data.id,
      product_id: data.productId || data.product_id,
      size: data.size,
      color: data.color,
      stock: data.stockQuantity || data.stock,
      created_at: data.created_at || data.createdAt
    };
  } catch (error) {
    console.error('Error creating product variant:', error);
    throw error;
  }
};

// Get all variants for a product - fixed to work with backend
export const getProductVariants = async (productId: number): Promise<ProductVariant[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/variants`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform backend response to match our interface
    return Array.isArray(data) ? data.map(item => ({
      id: item.id,
      product_id: item.productId || item.product_id,
      size: item.size,
      color: item.color,
      stock: item.stockQuantity || item.stock,
      created_at: item.created_at || item.createdAt
    })) : [];
  } catch (error) {
    console.error(`Error fetching variants for product ${productId}:`, error);
    throw error;
  }
};