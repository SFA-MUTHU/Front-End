import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface Supplier {
  id?: number;
  name: string;
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