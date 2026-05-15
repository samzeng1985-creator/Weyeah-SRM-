import api from './api';
import type { ApiResponse } from '../types';

export interface SupplierEvaluation {
  id: number;
  supplierId: number;
  evaluationDate: string;
  periodType?: string;
  qualityScore?: number;
  deliveryScore?: number;
  priceScore?: number;
  serviceScore?: number;
  comprehensiveScore?: number;
  rating?: string;
  evaluator?: string;
  evaluationOpinion?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  delFlag: number;
}

export interface SupplierEvaluationCreate {
  supplierId: number;
  evaluationDate: string;
  periodType?: string;
  qualityScore?: number;
  deliveryScore?: number;
  priceScore?: number;
  serviceScore?: number;
  evaluator?: string;
  evaluationOpinion?: string;
  remark?: string;
}

export const supplierEvaluationApi = {
  getBySupplierId: (supplierId: number): Promise<ApiResponse<SupplierEvaluation[]>> => {
    return api.get(`/api/supplier-evaluations/supplier/${supplierId}`);
  },

  getLatestBySupplierId: (supplierId: number): Promise<ApiResponse<SupplierEvaluation>> => {
    return api.get(`/api/supplier-evaluations/supplier/${supplierId}/latest`);
  },

  getById: (id: number): Promise<ApiResponse<SupplierEvaluation>> => {
    return api.get(`/api/supplier-evaluations/${id}`);
  },

  create: (data: SupplierEvaluationCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/supplier-evaluations', data);
  },

  update: (id: number, data: Partial<SupplierEvaluation>): Promise<ApiResponse<void>> => {
    return api.put(`/api/supplier-evaluations/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/supplier-evaluations/${id}`);
  },

  calculateRating: (score: number): Promise<ApiResponse<string>> => {
    return api.get(`/api/supplier-evaluations/calculate-rating/${score}`);
  },
};
