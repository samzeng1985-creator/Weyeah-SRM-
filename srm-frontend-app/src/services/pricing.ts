import api from './api';
import type { ApiResponse } from '../types';

export interface PricingRecord {
  id?: number;
  materialId: number;
  materialName?: string;
  supplierId: number;
  supplierName?: string;
  price: number;
  taxRate?: number;
  priceWithTax?: number;
  currency?: string;
  unit?: string;
  minOrderQty?: number;
  effectiveDate?: string;
  expiryDate?: string;
  priceTerms?: string;
  paymentTerms?: string;
  deliveryCycle?: number;
  status: string;
  remark?: string;
  priceChangeReason?: string;
  priceChangeDetail?: string;
  priceIncreaseRate?: number;
  originalPrice?: number;
}

export interface PriceCheckResult {
  hasCurrentPrice: boolean;
  requiresReason: boolean;
  originalPrice?: number;
  newPrice?: number;
  priceIncreaseRate?: number;
  message?: string;
}

export interface OverlapCheckResult {
  hasOverlap: boolean;
  message?: string;
}

export const pricingApi = {
  getList: (params: any = {}): Promise<ApiResponse<any>> => {
    return api.get('/api/pricing', { params });
  },

  getById: (id: number): Promise<ApiResponse<PricingRecord>> => {
    return api.get(`/api/pricing/${id}`);
  },

  create: (data: Partial<PricingRecord>): Promise<ApiResponse<any>> => {
    return api.post('/api/pricing', data);
  },

  update: (id: number, data: Partial<PricingRecord>): Promise<ApiResponse<any>> => {
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

  getCurrentPrice: (supplierId: number, materialId: number): Promise<ApiResponse<any>> => {
    return api.get('/api/pricing/current-price', { params: { supplierId, materialId } });
  },

  checkOverlap: (data: Partial<PricingRecord>): Promise<ApiResponse<OverlapCheckResult>> => {
    return api.post('/api/pricing/check-overlap', data);
  },

  checkPriceIncrease: (data: Partial<PricingRecord>): Promise<ApiResponse<PriceCheckResult>> => {
    return api.post('/api/pricing/check-price-increase', data);
  },
};
