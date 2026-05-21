import api from './api';
import type { Supplier, SupplierCreate, SupplierTag, PageResult, PaginationParams, ApiResponse } from '../types';

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

  importData: (formData: FormData): Promise<ApiResponse<number>> => {
    return api.post('/api/suppliers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const supplierTagApi = {
  getBySupplierId: (supplierId: number): Promise<ApiResponse<SupplierTag[]>> => {
    return api.get(`/api/supplier-tags/supplier/${supplierId}`);
  },

  create: (data: SupplierTag): Promise<ApiResponse<number>> => {
    return api.post('/api/supplier-tags', data);
  },

  batchCreate: (data: SupplierTag[]): Promise<ApiResponse<void>> => {
    return api.post('/api/supplier-tags/batch', data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/supplier-tags/${id}`);
  },

  deleteBySupplierId: (supplierId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/supplier-tags/supplier/${supplierId}`);
  },
};
