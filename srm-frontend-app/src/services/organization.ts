import api from './api';
import type { ApiResponse } from '../types';

export interface OrgUser {
  id?: number;
  username: string;
  realName?: string;
  email?: string;
  phone?: string;
  departmentId?: number;
  status: string;
  avatar?: string;
  remark?: string;
}

export interface Department {
  id?: number;
  code: string;
  name: string;
  parentId?: number;
  level?: number;
  leaderId?: number;
  leaderName?: string;
  description?: string;
  status?: string;
  sortOrder?: number;
  children?: Department[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id?: number;
  employeeNo: string;
  name: string;
  gender?: string;
  phone?: string;
  email?: string;
  departmentId?: number;
  departmentName?: string;
  position?: string;
  positionLevel?: string;
  hireDate?: string;
  leaveDate?: string;
  status?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id?: number;
  code: string;
  name: string;
  description?: string;
  status?: string;
  isSystem?: number;
  sortOrder?: number;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id?: number;
  code: string;
  name: string;
  module?: string;
  type?: string;
  parentId?: number;
  path?: string;
  icon?: string;
  sortOrder?: number;
  status?: string;
  children?: Permission[];
  checked?: boolean;
}

export const organizationApi = {
  getUsers: (params: any = {}): Promise<ApiResponse<any>> => {
    return api.get('/api/users', { params });
  },

  getUserById: (id: number): Promise<ApiResponse<OrgUser>> => {
    return api.get(`/api/users/${id}`);
  },

  createUser: (data: Partial<OrgUser>): Promise<ApiResponse<number>> => {
    return api.post('/api/users', data);
  },

  updateUser: (id: number, data: Partial<OrgUser>): Promise<ApiResponse<void>> => {
    return api.put(`/api/users/${id}`, data);
  },

  deleteUser: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/users/${id}`);
  },

  getCurrentUser: (): Promise<ApiResponse<OrgUser>> => {
    return api.get('/api/users/current');
  },

  getDepartments: (params: any = {}): Promise<ApiResponse<any>> => {
    return api.get('/api/departments', { params });
  },

  getDepartmentTree: (): Promise<ApiResponse<Department[]>> => {
    return api.get('/api/departments/tree');
  },

  getDepartmentById: (id: number): Promise<ApiResponse<Department>> => {
    return api.get(`/api/departments/${id}`);
  },

  createDepartment: (data: Partial<Department>): Promise<ApiResponse<Department>> => {
    return api.post('/api/departments', data);
  },

  updateDepartment: (id: number, data: Partial<Department>): Promise<ApiResponse<Department>> => {
    return api.put(`/api/departments/${id}`, data);
  },

  deleteDepartment: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/departments/${id}`);
  },

  getEmployees: (params: any = {}): Promise<ApiResponse<any>> => {
    return api.get('/api/employees', { params });
  },

  getEmployeeById: (id: number): Promise<ApiResponse<Employee>> => {
    return api.get(`/api/employees/${id}`);
  },

  getEmployeesByDepartment: (departmentId: number, params?: any): Promise<ApiResponse<any>> => {
    return api.get(`/api/employees/department/${departmentId}`, { params });
  },

  createEmployee: (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    return api.post('/api/employees', data);
  },

  updateEmployee: (id: number, data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    return api.put(`/api/employees/${id}`, data);
  },

  deleteEmployee: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/employees/${id}`);
  },

  leaveEmployee: (id: number): Promise<ApiResponse<void>> => {
    return api.put(`/api/employees/${id}/leave`);
  },

  getRoles: (): Promise<ApiResponse<Role[]>> => {
    return api.get('/api/roles');
  },

  getRoleById: (id: number): Promise<ApiResponse<Role>> => {
    return api.get(`/api/roles/${id}`);
  },

  createRole: (data: Partial<Role>): Promise<ApiResponse<Role>> => {
    return api.post('/api/roles', data);
  },

  updateRole: (id: number, data: Partial<Role>): Promise<ApiResponse<Role>> => {
    return api.put(`/api/roles/${id}`, data);
  },

  deleteRole: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/roles/${id}`);
  },

  getPermissionTree: (): Promise<ApiResponse<Permission[]>> => {
    return api.get('/api/roles/permissions/tree');
  },
};
