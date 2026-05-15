import api from './api';
import type { Logistics, PageResult, PaginationParams, ApiResponse } from '../types';

export const logisticsApi = {
  getList: (params: PaginationParams & { status?: string; contractId?: number } = {}): Promise<ApiResponse<PageResult<Logistics>>> => {
    return api.get('/api/logistics', { params });
  },

  getById: (id: number): Promise<ApiResponse<Logistics>> => {
    return api.get(`/api/logistics/${id}`);
  },

  getByContractId: (contractId: number): Promise<ApiResponse<Logistics[]>> => {
    return api.get(`/api/logistics/contract/${contractId}`);
  },

  create: (data: Partial<Logistics>): Promise<ApiResponse<number>> => {
    return api.post('/api/logistics', data);
  },

  update: (id: number, data: Partial<Logistics>): Promise<ApiResponse<void>> => {
    return api.put(`/api/logistics/${id}`, data);
  },

  ship: (id: number, data: { logisticsNo?: string; logisticsCompany?: string; currentLocation?: string }): Promise<ApiResponse<void>> => {
    return api.post(`/api/logistics/${id}/ship`, data);
  },

  arrive: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/logistics/${id}/arrive`);
  },

  updateStatus: (id: number, data: { status: string; currentLocation?: string; trackingInfo?: string }): Promise<ApiResponse<void>> => {
    return api.post(`/api/logistics/${id}/status`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/logistics/${id}`);
  },
};
