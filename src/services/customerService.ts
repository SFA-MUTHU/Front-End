import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  customer_group_id: number;
  payment_method: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  active?: boolean;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  customer_group?: {
    id: number;
    name: string;
  };
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

export interface CustomerSale {
  id: number;
  date: string;
  invoice_number: string;
  total_amount: number;
  payment_status: string;
  items_count: number;
}

// Get all customers with pagination and filtering
export const getCustomers = async (
  page: number = 1,
  limit: number = 10,
  filter: {
    searchTerm?: string;
    groupId?: number;
    active?: boolean;
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

    if (filter.active !== undefined) {
      params.append('active', filter.active.toString());
    }

    const response = await fetch(`${API_BASE_URL}/customers?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get customer by ID
export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
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

// Create new customer
export const createCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
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

// Update customer
export const updateCustomer = async (
  id: number,
  data: Partial<Customer>
): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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

// Get customer sales history
export const getCustomerSales = async (
  id: number,
  page: number = 1,
  limit: number = 10
): Promise<{ data: CustomerSale[]; pagination: { total: number; page: number; limit: number; pages: number } }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/customers/${id}/sales?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching sales for customer ${id}:`, error);
    throw error;
  }
};

// Get customer groups
export const getCustomerGroups = async (): Promise<{ id: number; name: string; discount_rate?: number }[]> => {
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

// Create customer group
export const createCustomerGroup = async (data: { 
  name: string; 
  discount_rate?: number;
  description?: string;
}): Promise<{ id: number; name: string; discount_rate?: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer-groups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating customer group:', error);
    throw error;
  }
};

// Update customer group
export const updateCustomerGroup = async (
  id: number,
  data: { name?: string; discount_rate?: number; description?: string }
): Promise<{ id: number; name: string; discount_rate?: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer-groups/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating customer group with id ${id}:`, error);
    throw error;
  }
};

// Delete customer group
export const deleteCustomerGroup = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customer-groups/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting customer group with id ${id}:`, error);
    throw error;
  }
};