import api from './api';
import type { ApiResponse } from '../types';

export interface PricingRecord {
  id?: number;
  materialId: number;
  materialName?: string;
  supplierId: number;
  supplierName?: string;
  price: number;
  currency?: string;
  unit?: string;
  effectiveDate?: string;
  expiryDate?: string;
  status: string;
  remark?: string;
}

export const pricingApi = {
  getList: (params: any = {}): Promise<ApiResponse<any>> => {
    return api.get('/api/pricing', { params });
  },

  getById: (id: number): Promise<ApiResponse<PricingRecord>> => {
    return api.get(`/api/pricing/${id}`);
  },

  create: (data: Partial<PricingRecord>): Promise<ApiResponse<number>> => {
    return api.post('/api/pricing', data);
  },

  update: (id: number, data: Partial<PricingRecord>): Promise<ApiResponse<void>> => {
    return api.put(`/api/pricing/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/pricing/${id}`);
  },

  getSuppliers: (): Promise<ApiResponse<any[]>> => {
    return api.get('/api/pricing/suppliers');
  },

  getMaterials: (): Promise<ApiResponse<any[]>> => {
    return api.get('/api/pricing/materials');
  },
};
