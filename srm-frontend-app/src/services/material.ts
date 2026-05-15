import api from './api';
import type { Material, MaterialSupplier, PageResult, PaginationParams, ApiResponse } from '../types';

export const materialApi = {
  getList: (params: PaginationParams & { status?: string } = {}): Promise<ApiResponse<PageResult<Material>>> => {
    return api.get('/api/materials', { params });
  },

  getById: (id: number): Promise<ApiResponse<Material>> => {
    return api.get(`/api/materials/${id}`);
  },

  create: (data: Partial<Material>): Promise<ApiResponse<number>> => {
    return api.post('/api/materials', data);
  },

  update: (id: number, data: Partial<Material>): Promise<ApiResponse<void>> => {
    return api.put(`/api/materials/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/materials/${id}`);
  },

  updateStatus: (id: number, status: string): Promise<ApiResponse<void>> => {
    return api.post(`/api/materials/${id}/status`, { status });
  },

  getActive: (): Promise<ApiResponse<Material[]>> => {
    return api.get('/api/materials/active');
  },

  getMaterialSuppliers: (id: number): Promise<ApiResponse<MaterialSupplier[]>> => {
    return api.get(`/api/materials/${id}/suppliers`);
  },

  addSupplier: (materialId: number, data: { supplierId: number; isPrimary?: boolean; leadTime?: number; moq?: number; remark?: string }): Promise<ApiResponse<number>> => {
    return api.post(`/api/materials/${materialId}/suppliers`, data);
  },

  updateSupplier: (materialId: number, supplierId: number, data: Partial<MaterialSupplier>): Promise<ApiResponse<void>> => {
    return api.put(`/api/materials/${materialId}/suppliers/${supplierId}`, data);
  },

  deleteSupplier: (materialId: number, supplierId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/materials/${materialId}/suppliers/${supplierId}`);
  },

  setPrimarySupplier: (materialId: number, supplierId: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/materials/${materialId}/suppliers/${supplierId}/primary`);
  },
};
