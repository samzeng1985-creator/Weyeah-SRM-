import api from './api';
import type { ApiResponse } from '../types';

export interface ContractTemplate {
  id: number;
  name: string;
  type: string;
  code: string;
  language: string;
  content?: string;
  description?: string;
  status: string;
  version?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  delFlag: number;
}

export interface ContractTemplateCreate {
  name: string;
  type: string;
  code: string;
  language?: string;
  content?: string;
  description?: string;
  status?: string;
  version?: string;
  sortOrder?: number;
}

export const contractTemplateApi = {
  getList: (params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    type?: string;
    status?: string;
  } = {}): Promise<ApiResponse<{ list: ContractTemplate[]; total: number }>> => {
    return api.get('/api/contract-templates', params);
  },

  getById: (id: number): Promise<ApiResponse<ContractTemplate>> => {
    return api.get(`/api/contract-templates/${id}`);
  },

  getByType: (type: string): Promise<ApiResponse<ContractTemplate[]>> => {
    return api.get(`/api/contract-templates/type/${type}`);
  },

  create: (data: ContractTemplateCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/contract-templates', data);
  },

  update: (id: number, data: Partial<ContractTemplate>): Promise<ApiResponse<void>> => {
    return api.put(`/api/contract-templates/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contract-templates/${id}`);
  },

  updateStatus: (id: number, status: string): Promise<ApiResponse<void>> => {
    return api.post(`/api/contract-templates/${id}/status`, { status });
  },
};
