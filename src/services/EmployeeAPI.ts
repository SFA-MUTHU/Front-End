import axiosInstance from "./axiosInstance.ts";

const getEmployees = () => axiosInstance.get('/employees');
const getEmployeeById = (id: string | number) => axiosInstance.get(`/employees/${id}`);
const getSalesByEmployeeId = (id: string | number) => axiosInstance.get(`/employees/${id}/sales`);
const getInventoryLogByEmployeeId = (id: string | number) => axiosInstance.get(`/employees/${id}/inventory-logs`);
const getExpensesByEmployeeId = (id: string | number) => axiosInstance.get(`/employees/${id}/expenses`);


const createEmployee = (employeeData: any) => axiosInstance.post('/employees', employeeData);


const updateEmployee = (id: string | number, updatedData: any) =>
  axiosInstance.put(`/employees/${id}`, updatedData);

const deleteEmployee = (id: string | number) => axiosInstance.delete(`/employees/${id}`);

export default {
  getEmployees,
  getEmployeeById,
  getSalesByEmployeeId,
  getInventoryLogByEmployeeId,
  getExpensesByEmployeeId,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
