import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface BankAccountDetails {
  accountNumber: string;
  bankName: string;
  branch: string;
  accountType: string;
}

export interface Supplier {
  id?: number;
  name: string;
  contact_person?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  bank_account_details?: BankAccountDetails;  // Match the API field name
}

export interface SupplierProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  description?: string;
  supplier_id: number;
  [key: string]: unknown;
}

export interface SupplierResponse {
  data: Supplier[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const getSuppliers = async (): Promise<SupplierResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

// Fetch a single supplier by ID
export const getSupplierById = async (id: number): Promise<Supplier> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
};

// Fetch products for a supplier
export const getSupplierProducts = async (id: number): Promise<SupplierProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}/products`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    throw error;
  }
};

// Create a new supplier
export const createSupplier = async (supplierData: Supplier): Promise<Supplier> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(supplierData),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

// Update an existing supplier
export const updateSupplier = async (id: number, data: Partial<Supplier>): Promise<Supplier> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

// Delete a supplier
export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};