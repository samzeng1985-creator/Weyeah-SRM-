import api from './api';
import type { Contract, PageResult, PaginationParams, ApiResponse, ContractItem } from '../types';

export const contractApi = {
  getList: (params: any = {}): Promise<ApiResponse<PageResult<Contract>>> => {
    return api.get('/api/contracts', { params });
  },

  getById: (id: number): Promise<ApiResponse<Contract>> => {
    return api.get(`/api/contracts/${id}`);
  },

  create: (data: any): Promise<ApiResponse<number>> => {
    return api.post('/api/contracts', data);
  },

  update: (id: number, data: any): Promise<ApiResponse<void>> => {
    return api.put(`/api/contracts/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contracts/${id}`);
  },

  submit: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/submit`);
  },

  approve: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/approve`);
  },

  reject: (id: number, reason?: string): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/reject`, { reason });
  },

  sign: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/sign`);
  },

  activate: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/activate`);
  },

  startExecute: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/start-execute`);
  },

  complete: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/complete`);
  },

  terminate: (id: number, reason?: string): Promise<ApiResponse<void>> => {
    return api.post(`/api/contracts/${id}/terminate`, { reason });
  },

  getActiveSuppliers: (): Promise<ApiResponse<any[]>> => {
    return api.get('/api/contracts/suppliers');
  },

  getActiveMaterials: (): Promise<ApiResponse<any[]>> => {
    return api.get('/api/contracts/materials');
  },

  getItems: (contractId: number): Promise<ApiResponse<ContractItem[]>> => {
    return api.get(`/api/contracts/${contractId}/items`);
  },

  addItem: (contractId: number, item: any): Promise<ApiResponse<number>> => {
    return api.post(`/api/contracts/${contractId}/items`, item);
  },

  updateItem: (contractId: number, itemId: number, item: any): Promise<ApiResponse<void>> => {
    return api.put(`/api/contracts/${contractId}/items/${itemId}`, item);
  },

  deleteItem: (contractId: number, itemId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contracts/${contractId}/items/${itemId}`);
  },
};
