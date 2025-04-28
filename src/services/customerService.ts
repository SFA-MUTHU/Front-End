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
}

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



export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
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