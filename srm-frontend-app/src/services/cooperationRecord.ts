import api from './api';
import type { ApiResponse } from '../types';

export interface CooperationRecord {
  id: number;
  supplierId: number;
  startDate?: string;
  endDate?: string;
  cooperationType?: string;
  contractNo?: string;
  amount?: number;
  currency?: string;
  status?: string;
  description?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  delFlag: number;
}

export interface CooperationRecordCreate {
  supplierId: number;
  startDate?: string;
  endDate?: string;
  cooperationType?: string;
  contractNo?: string;
  amount?: number;
  currency?: string;
  status?: string;
  description?: string;
  remark?: string;
}

export const cooperationRecordApi = {
  getBySupplierId: (supplierId: number): Promise<ApiResponse<CooperationRecord[]>> => {
    return api.get(`/api/cooperation-records/supplier/${supplierId}`);
  },

  getById: (id: number): Promise<ApiResponse<CooperationRecord>> => {
    return api.get(`/api/cooperation-records/${id}`);
  },

  create: (data: CooperationRecordCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/cooperation-records', data);
  },

  update: (id: number, data: Partial<CooperationRecord>): Promise<ApiResponse<void>> => {
    return api.put(`/api/cooperation-records/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/cooperation-records/${id}`);
  },
};
