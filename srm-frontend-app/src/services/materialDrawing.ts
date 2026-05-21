import api from './api';
import type { MaterialDrawing, ApiResponse } from '../types';

export interface MaterialDrawingCreate {
  materialId: number;
  drawingNo: string;
  drawingName?: string;
  version?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  remark?: string;
}

export const materialDrawingApi = {
  getByMaterialId: (materialId: number): Promise<ApiResponse<MaterialDrawing[]>> => {
    return api.get(`/api/material-drawings/material/${materialId}`);
  },

  getById: (id: number): Promise<ApiResponse<MaterialDrawing>> => {
    return api.get(`/api/material-drawings/${id}`);
  },

  create: (data: MaterialDrawingCreate): Promise<ApiResponse<number>> => {
    return api.post('/api/material-drawings', data);
  },

  update: (id: number, data: Partial<MaterialDrawing>): Promise<ApiResponse<void>> => {
    return api.put(`/api/material-drawings/${id}`, data);
  },

  delete: (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/material-drawings/${id}`);
  },

  recordDownload: (id: number): Promise<ApiResponse<void>> => {
    return api.post(`/api/material-drawings/${id}/download`);
  },
};
