import api from './api';
import type { Supplier, SupplierCreate, PageResult, PaginationParams, ApiResponse } from '../types';

export const supplierApi = {
  getList: (params: PaginationParams = {}): Promise<ApiResponse<PageResult<Supplier>>> => {
    return api.get('/api/suppliers', { params });
  },

  getById: (id: number): Promise<ApiResponse<Supplier>> => {
    return api.get(`/api/suppliers/${id}`);
  },

  create: (data: SupplierCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/suppliers', data);
  },

  update: (id: number, data: Partial<Supplier>): Promise<ApiResponse<void>> => {
    return api.put(`/api/suppliers/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/suppliers/${id}`);
  },

  getActive: (): Promise<ApiResponse<Supplier[]>> => {
    return api.get('/api/suppliers/active');
  },
};
