import api from './api';
import type { ApiResponse } from '../types';

export interface Category {
  id: number;
  code: string;
  name: string;
  parentId: number;
  level: number;
  description?: string;
  isLeaf: boolean;
  status: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  delFlag: number;
}

export interface CategoryTreeNode {
  id: number;
  code: string;
  name: string;
  level: number;
  isLeaf: boolean;
  children: CategoryTreeNode[];
}

export interface CategoryCreate {
  code: string;
  name: string;
  parentId?: number;
  description?: string;
  sortOrder?: number;
}

export const categoryApi = {
  getList: (): Promise<ApiResponse<Category[]>> => {
    return api.get('/api/categories');
  },

  getTree: (): Promise<ApiResponse<CategoryTreeNode[]>> => {
    return api.get('/api/categories/tree');
  },

  getById: (id: number): Promise<ApiResponse<Category>> => {
    return api.get(`/api/categories/${id}`);
  },

  getChildren: (parentId: number): Promise<ApiResponse<Category[]>> => {
    return api.get(`/api/categories/children/${parentId}`);
  },

  getLeaf: (): Promise<ApiResponse<Category[]>> => {
    return api.get('/api/categories/leaf');
  },

  create: (data: CategoryCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/categories', data);
  },

  update: (id: number, data: Partial<Category>): Promise<ApiResponse<void>> => {
    return api.put(`/api/categories/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/categories/${id}`);
  },
};
