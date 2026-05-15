import api from './api';
import type { ApiResponse } from '../types';

export interface ContactPerson {
  id: number;
  supplierId: number;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  department?: string;
  isPrimary?: boolean;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  delFlag: number;
}

export interface ContactPersonCreate {
  supplierId: number;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  department?: string;
  isPrimary?: boolean;
  remark?: string;
}

export const contactPersonApi = {
  getBySupplierId: (supplierId: number): Promise<ApiResponse<ContactPerson[]>> => {
    return api.get(`/api/contact-persons/supplier/${supplierId}`);
  },

  getById: (id: number): Promise<ApiResponse<ContactPerson>> => {
    return api.get(`/api/contact-persons/${id}`);
  },

  create: (data: ContactPersonCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/contact-persons', data);
  },

  update: (id: number, data: Partial<ContactPerson>): Promise<ApiResponse<void>> => {
    return api.put(`/api/contact-persons/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/contact-persons/${id}`);
  },
};
