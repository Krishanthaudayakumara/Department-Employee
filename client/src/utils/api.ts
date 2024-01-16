import axios from 'axios';
import { Department, Employee, EmployeeFormData } from './types';

const API_BASE_URL = 'http://localhost:5107';

export const fetchEmployeeDetails = async () => {
  try {
    const response = await axios.get<Employee[]>(`${API_BASE_URL}/api/employees/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee details:', error);
    throw error; 
  }
};

export const createEmployee = async (employeeData: EmployeeFormData) => {
  try {
    const response = await axios.post<Employee>(`${API_BASE_URL}/api/employees`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const updateEmployee = async (employeeID: number, employeeData: EmployeeFormData) => {
  try {
    const response = await axios.put<Employee>(`${API_BASE_URL}/api/employees/${employeeID}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (employeeID: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/employees/${employeeID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};


// Departments API Functions

export const fetchDepartmentDetails = async () => {
  try {
    const response = await axios.get<Department[]>(`${API_BASE_URL}/api/departments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department details:', error);
    throw error;
  }
};

export const createDepartment = async (departmentData: Department) => {
  try {
    const response = await axios.post<Department>(`${API_BASE_URL}/api/departments`, departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (departmentID: number, departmentData: Department) => {
  try {
    const response = await axios.put<Department>(`${API_BASE_URL}/api/departments/${departmentID}`, departmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (departmentID: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/departments/${departmentID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};