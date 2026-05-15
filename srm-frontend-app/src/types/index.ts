export interface Supplier {
  id?: number;
  code: string;
  name: string;
  shortName?: string;
  type: string;
  status: string;
  country: string;
  city?: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  taxNumber?: string;
  businessLicense?: string;
  bankName?: string;
  bankAccount?: string;
  annualCapacity?: number;
  mainProducts?: string;
  qualityCertification?: string;
  isoCertificate?: string;
  registeredDate?: string;
  annualReviewDate?: string;
  evaluationLevel?: string;
  deliveryScore?: number;
  qualityScore?: number;
  serviceScore?: number;
  comprehensiveScore?: number;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierCreate {
  code: string;
  name: string;
  shortName?: string;
  type: string;
  country?: string;
  city?: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  taxNumber?: string;
  businessLicense?: string;
  bankName?: string;
  bankAccount?: string;
  annualCapacity?: number;
  mainProducts?: string;
  qualityCertification?: string;
  isoCertificate?: string;
  registeredDate?: string;
  remark?: string;
}

export interface Material {
  id?: number;
  code: string;
  name: string;
  model?: string;
  specification?: string;
  categoryId?: number;
  category?: string;
  materialType?: string;
  applicableModels?: string;
  brand?: string;
  manufacturer?: string;
  originCountry?: string;
  unit?: string;
  auxiliaryUnit?: string;
  conversionRatio?: number;
  minOrderQuantity?: number;
  safetyStock?: number;
  warrantyPeriod?: number;
  description?: string;
  status: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialSupplier {
  id?: number;
  materialId: number;
  materialCode?: string;
  supplierId: number;
  supplierCode?: string;
  supplierName?: string;
  supplierType?: string;
  supplierStatus?: string;
  isPrimary?: boolean;
  leadTime?: number;
  moq?: number;
  status?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contract {
  id?: number;
  code: string;
  name: string;
  supplierId?: number;
  supplierName?: string;
  type?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  status: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Logistics {
  id?: number;
  code?: string;
  contractId: number;
  contractCode?: string;
  logisticsNo?: string;
  logisticsCompany?: string;
  senderName?: string;
  senderContact?: string;
  senderPhone?: string;
  senderAddress?: string;
  receiverName?: string;
  receiverContact?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  warehouse?: string;
  deliveryAddress?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  actualArrivalDate?: string;
  status?: string;
  currentLocation?: string;
  trackingInfo?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: number;
  username: string;
  name?: string;
  realName?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  token?: string;
}

export interface DashboardStats {
  totalSuppliers: number;
  qualifiedSuppliers: number;
  pendingSuppliers: number;
  totalMaterials: number;
  activeContracts: number;
  draftContracts: number;
  totalContractAmount: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  category?: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
