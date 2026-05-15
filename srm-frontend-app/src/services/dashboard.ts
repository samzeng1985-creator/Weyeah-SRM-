import api from './api';
import type { ApiResponse, DashboardStats } from '../types';

export const dashboardApi = {
  getStats: (): Promise<ApiResponse<DashboardStats>> => {
    return api.get('/api/dashboard/stats');
  },

  getSupplierStats: (): Promise<ApiResponse<any>> => {
    return api.get('/api/dashboard/supplier-stats');
  },

  getContractStats: (): Promise<ApiResponse<any>> => {
    return api.get('/api/dashboard/contract-stats');
  },

  getRecentActivities: (): Promise<ApiResponse<any>> => {
    return api.get('/api/dashboard/recent-activities');
  },
};
