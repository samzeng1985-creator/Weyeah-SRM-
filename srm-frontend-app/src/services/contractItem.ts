import api from './api';
import type { ApiResponse } from '../types';

export interface ContractItem {
  id: number;
  contractId: number;
  materialId?: number;
  materialCode?: string;
  materialName: string;
  materialSpec?: string;
  materialModel?: string;
  snapshotData?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  totalPrice: number;
  sortOrder: number;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  delFlag: number;
}

export interface ContractItemCreate {
  contractId: number;
  materialId?: number;
  materialCode?: string;
  materialName: string;
  materialSpec?: string;
  materialModel?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  totalPrice?: number;
  sortOrder?: number;
  remark?: string;
}

export const contractItemApi = {
  getByContractId: (contractId: number): Promise<ApiResponse<ContractItem[]>> => {
    return api.get(`/api/contract-items/contract/${contractId}`);
  },

  getById: (id: number): Promise<ApiResponse<ContractItem>> => {
    return api.get(`/api/contract-items/${id}`);
  },

  create: (data: ContractItemCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/contract-items', data);
  },

  createBatch: (data: ContractItemCreate[]): Promise<ApiResponse<number[]>> => {
    return api.post('/api/contract-items/batch', data);
  },

  update: (id: number, data: Partial<ContractItem>): Promise<ApiResponse<void>> => {
    return api.put(`/api/contract-items/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contract-items/${id}`);
  },

  deleteByContractId: (contractId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contract-items/contract/${contractId}`);
  },
};
