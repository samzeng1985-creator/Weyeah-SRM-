export interface Supplier {
  id?: number;
  code: string;
  name: string;
  englishName?: string;
  shortName?: string;
  type: string;
  enterpriseNature?: string;
  status: string;
  securityLocked?: number;
  country: string;
  city?: string;
  address?: string;
  officeAddress?: string;
  contactPerson?: string;
  contactPosition?: string;
  contactPhone?: string;
  contactEmail?: string;
  faxNumber?: string;
  taxNumber?: string;
  registrationNumber?: string;
  registeredCapital?: number;
  registeredCapitalCurrency?: string;
  companySize?: string;
  website?: string;
  businessLicense?: string;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  annualCapacity?: number;
  mainProducts?: string;
  industryCategory?: string;
  qualityCertification?: string;
  isoCertificate?: string;
  registeredDate?: string;
  foundingDate?: string;
  annualReviewDate?: string;
  annualReviewStatus?: string;
  evaluationLevel?: string;
  cooperationLevel?: string;
  categoryClassification?: string;
  deliveryScore?: number;
  qualityScore?: number;
  priceScore?: number;
  serviceScore?: number;
  comprehensiveScore?: number;
  lastEvaluationDate?: string;
  evaluationCycle?: string;
  tags?: SupplierTag[];
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierCreate {
  code: string;
  name: string;
  englishName?: string;
  shortName?: string;
  type: string;
  enterpriseNature?: string;
  securityLocked?: number;
  country?: string;
  city?: string;
  address?: string;
  officeAddress?: string;
  contactPerson?: string;
  contactPosition?: string;
  contactPhone?: string;
  contactEmail?: string;
  faxNumber?: string;
  taxNumber?: string;
  registrationNumber?: string;
  registeredCapital?: number;
  registeredCapitalCurrency?: string;
  companySize?: string;
  website?: string;
  businessLicense?: string;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  annualCapacity?: number;
  mainProducts?: string;
  industryCategory?: string;
  qualityCertification?: string;
  isoCertificate?: string;
  registeredDate?: string;
  foundingDate?: string;
  annualReviewDate?: string;
  annualReviewStatus?: string;
  cooperationLevel?: string;
  categoryClassification?: string;
  remark?: string;
  tags?: string[];
}

export interface SupplierEvaluation {
  id?: number;
  supplierId: number;
  evaluationDate: string;
  qualityScore: number;
  deliveryScore: number;
  priceScore: number;
  serviceScore: number;
  comprehensiveScore: number;
  evaluationLevel: string;
  evaluator?: string;
  evaluationPeriod?: string;
  remark?: string;
  createdAt?: string;
}

export interface SupplierQualification {
  id?: number;
  supplierId: number;
  qualificationType: string;
  qualificationName: string;
  fileUrl?: string;
  fileName?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: string;
  remark?: string;
  createdAt?: string;
}

export interface QualificationAlert {
  id?: number;
  supplierId: number;
  supplierName?: string;
  qualificationType: string;
  qualificationName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  alertLevel: string;
  isRead?: number;
  isProcessed?: number;
  createdAt?: string;
}

export interface SupplierTag {
  id?: number;
  supplierId: number;
  tagName: string;
  tagColor?: string;
  createdAt?: string;
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
  
  // 替代件专用字段
  ownBrand?: string;
  drawingNo?: string;
  drawingVersion?: string;
  
  // 分类扩展属性 - 发动机部件类
  powerRange?: string;
  material?: string;
  dimension?: string;
  
  // 分类扩展属性 - 电气系统类
  voltageLevel?: string;
  currentCapacity?: string;
  protectionLevel?: string;
  certification?: string;
  
  // 分类扩展属性 - 冷却系统类
  coolingMethod?: string;
  heatDissipationArea?: string;
  flowParameters?: string;
  
  // 分类扩展属性 - 进排气系统类
  pressureLevel?: string;
  flowRange?: string;
  materialRequirements?: string;
  
  // 分类扩展属性 - 通用耗材类
  specModel?: string;
  applicationRange?: string;
  brandRequirements?: string;
  
  // ERP同步相关
  erpSyncStatus?: string;
  lastSyncTime?: string;
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

export interface MaterialDrawing {
  id?: number;
  materialId: number;
  drawingNo: string;
  drawingName?: string;
  version?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  status?: string;
  downloadCount?: number;
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
  currency?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  content?: string;
  paymentTerms?: string;
  attachmentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: ContractItem[];
  confidentialityScope?: string;
  confidentialityPeriod?: number;
  confidentialityObligations?: string;
  liabilityForBreach?: string;
  disputeResolution?: string;
  governingLaw?: string;
  purchaseOrderNo?: string;
  warehouse?: string;
  deliveryAddress?: string;
  deliveryMethod?: string;
  qualityRequirements?: string;
  acceptanceCriterium?: string;
  warrantyPeriod?: number;
  penaltyRate?: number;
  drawingNo?: string;
  drawingVersion?: string;
  processingRequirements?: string;
  materialRequirements?: string;
  qualityMonitoring?: string;
  intellectualProperty?: string;
}

export interface ContractItem {
  id?: number;
  contractId?: number;
  materialId?: number;
  materialCode?: string;
  materialName?: string;
  materialSpec?: string;
  materialModel?: string;
  snapshotData?: string;
  snapshotName?: string;
  snapshotModel?: string;
  snapshotDrawingVersion?: string;
  snapshotTime?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  taxRate?: number;
  priceWithTax?: number;
  totalPrice?: number;
  totalPriceWithTax?: number;
  deliveryDate?: string;
  sortOrder?: number;
  remark?: string;
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
