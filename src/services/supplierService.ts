import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface Supplier {
  id?: number;
  name: string;
  contact_person?: string;
  email: string;
  phone_number: string;
  address: string;
  payment_method: string;
  active? : number;
  logo?: string;
  bank_account_details?: string;
}


export const getSuppliers = async (): Promise<Supplier[]> => {
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
}


export const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<Supplier> => {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierData)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding supplier:', error);
        throw error;
    }
}