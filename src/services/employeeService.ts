import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface MonthlySale {
  itemName: string;
  quantity: number;
  TotalAmount: number;
  image: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  // Additional fields that may not come directly from API but are used in the UI
  phone?: string;
  birthday?: string;
  address?: string;
  location?: string;
  totalSales?: number;
  monthlySales?: MonthlySale[];
  taskCompletions?: number[];
}

export interface Attendance {
  id: number;
  staff_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  work_hours: string | null;
  status: string;
  created_at: string;
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

// New attendance-related functions
export const fetchAllAttendances = async (): Promise<{ data: Attendance[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Wrap the response in a data property to match expected shape
    return { data: await response.json() };
  } catch (error) {
    console.error('Error fetching attendances:', error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};