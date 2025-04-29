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
  email?: string;
  address?: string;
  payment_method?: string;
  active?: boolean;
  logo?: string;
  bank_account_details?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierProduct {
  id: number;
  name: string;
  supplierPrice: number;
  supplierQuantity: number;
  categories?: {
    id: number;
    name: string;
  };
  product_variants?: any[];
}

export interface SupplierDetails {
  id: number;
  name: string;
  contact_person: string;
  phone_number: string;
  email: string;
  address: string;
  payment_method: string;
  active: boolean;
  logo?: string;
  bank_account_details?: string;
  metrics: {
    totalProducts: number;
    totalValue: number;
    categoriesByProduct: Array<{
      id: number;
      name: string;
      count: number;
      value: number;
    }>;
  };
  supplier_product: Array<any>;
}

export interface SupplierListResponse {
  data: Supplier[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Get all suppliers with pagination and filtering
export const getSuppliers = async (
  page: number = 1,
  limit: number = 10,
  filter: { name?: string; active?: boolean } = {}
): Promise<SupplierListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filter.name) {
      params.append('name', filter.name);
    }
    
    if (filter.active !== undefined) {
      params.append('active', filter.active.toString());
    }

    const response = await fetch(`${API_BASE_URL}/suppliers?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders()
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

// Get supplier by ID
export const getSupplierById = async (id: number): Promise<Supplier> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching supplier with ID ${id}:`, error);
    throw error;
  }
};

// Get supplier details
export const getSupplierDetails = async (id: number): Promise<SupplierDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}/details`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for supplier ${id}:`, error);
    throw error;
  }
};

// Get supplier products
export const getSupplierProducts = async (id: number): Promise<SupplierProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}/products`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for supplier ${id}:`, error);
    throw error;
  }
};

// Create a new supplier
export const createSupplier = async (
  supplierData: {
    name: string;
    contact_person?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    payment_method?: string;
    active?: boolean;
    logo?: string;
    bankAccount?: {
      accountNumber: string;
      bankName: string;
      branch: string;
      accountType: string;
    };
  }
): Promise<Supplier> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(supplierData)
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

// Update a supplier
export const updateSupplier = async (
  id: number,
  supplierData: Partial<Supplier>
): Promise<Supplier> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(supplierData)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating supplier ${id}:`, error);
    throw error;
  }
};

// Delete a supplier
export const deleteSupplier = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting supplier ${id}:`, error);
    throw error;
  }
};