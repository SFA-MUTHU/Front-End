import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  customer_group_id: number;
  payment_method: string;
  created_at?: string;
  updated_at?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
  status?: string;
}

export interface CustomerGroup {
  id: number;
  name: string;
  discount_percentage?: number;
  description?: string;
}

export interface CustomerListResponse {
  data: Customer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Create customer
export const createCustomer = async (customerData: Customer): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Get all customers with pagination
export const getCustomers = async (
  page: number = 1,
  limit: number = 10, 
  filter: { 
    searchTerm?: string; 
    groupId?: number; 
    status?: string 
  } = {}
): Promise<CustomerListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filter.searchTerm) {
      params.append('search', filter.searchTerm);
    }
    
    if (filter.groupId) {
      params.append('groupId', filter.groupId.toString());
    }
    
    if (filter.status) {
      params.append('status', filter.status);
    }
    
    const response = await fetch(`${API_BASE_URL}/customers?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

// Get customer by ID
export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
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
    console.error(`Error updating customer with id ${id}:`, error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    throw error;
  }
};

// Get all customer groups
export const getCustomerGroups = async (): Promise<CustomerGroup[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer-groups`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customer groups:', error);
    throw error;
  }
};