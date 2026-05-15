import api from './api';
import type { Contract, PageResult, PaginationParams, ApiResponse } from '../types';

export const contractApi = {
  getList: (params: PaginationParams = {}): Promise<ApiResponse<PageResult<Contract>>> => {
    return api.get('/api/contracts', { params });
  },

  getById: (id: number): Promise<ApiResponse<Contract>> => {
    return api.get(`/api/contracts/${id}`);
  },

  create: (data: Partial<Contract>): Promise<ApiResponse<number>> => {
    return api.post('/api/contracts', data);
  },

  update: (id: number, data: Partial<Contract>): Promise<ApiResponse<void>> => {
    return api.put(`/api/contracts/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contracts/${id}`);
  },
};
