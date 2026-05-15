import api from './api';
import type { Material, PageResult, PaginationParams, ApiResponse } from '../types';

export const materialApi = {
  getList: (params: PaginationParams = {}): Promise<ApiResponse<PageResult<Material>>> => {
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

  getActive: (): Promise<ApiResponse<Material[]>> => {
    return api.get('/api/materials/active');
  },
};
