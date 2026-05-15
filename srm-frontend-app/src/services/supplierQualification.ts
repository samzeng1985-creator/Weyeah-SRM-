import api from './api';
import type { ApiResponse } from '../types';

export interface SupplierQualification {
  id: number;
  supplierId: number;
  type: string;
  name: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  issueDate?: string;
  expiryDate?: string;
  hasExpiry: boolean;
  status: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  delFlag: number;
}

export interface QualificationCreate {
  supplierId: number;
  type: string;
  name: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  issueDate?: string;
  expiryDate?: string;
  hasExpiry: boolean;
  remark?: string;
}

export const qualificationApi = {
  getList: (): Promise<ApiResponse<SupplierQualification[]>> => {
    return api.get('/api/supplier-qualifications');
  },

  getBySupplierId: (supplierId: number): Promise<ApiResponse<SupplierQualification[]>> => {
    return api.get(`/api/supplier-qualifications/supplier/${supplierId}`);
  },

  getById: (id: number): Promise<ApiResponse<SupplierQualification>> => {
    return api.get(`/api/supplier-qualifications/${id}`);
  },

  create: (data: QualificationCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/supplier-qualifications', data);
  },

  update: (id: number, data: Partial<SupplierQualification>): Promise<ApiResponse<void>> => {
    return api.put(`/api/supplier-qualifications/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/supplier-qualifications/${id}`);
  },

  getExpiringSoon: (): Promise<ApiResponse<SupplierQualification[]>> => {
    return api.get('/api/supplier-qualifications/expiring-soon');
  },

  getExpired: (): Promise<ApiResponse<SupplierQualification[]>> => {
    return api.get('/api/supplier-qualifications/expired');
  },
};
