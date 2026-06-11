import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Supplier, SupplierCreate, SupplierTag, SupplierEvaluation, SupplierQualification, QualificationAlert } from '../types';
import { supplierApi } from '../services/supplier';
import SupplierDetailModal from '../components/SupplierDetailModal';

interface SuppliersProps {
  onLogout: () => void;
}

export default function Suppliers({ onLogout }: SuppliersProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') {
      setShowModal(true);
      history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cooperationLevelFilter, setCooperationLevelFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState<Partial<SupplierCreate>>({
    code: '',
    name: '',
    englishName: '',
    shortName: '',
    type: 'MANUFACTURER',
    country: '中国',
    city: '',
    address: '',
    officeAddress: '',
    contactPerson: '',
    contactPosition: '',
    contactPhone: '',
    contactEmail: '',
    faxNumber: '',
    taxNumber: '',
    registrationNumber: '',
    registeredCapital: 0,
    registeredCapitalCurrency: 'CNY',
    companySize: '',
    website: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
    mainProducts: '',
    industryCategory: '',
    qualityCertification: '',
    isoCertificate: '',
    categoryClassification: '',
    cooperationLevel: '',
    remark: '',
    tags: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    qualityCertification?: File;
    isoCertificate?: File;
    businessLicense?: File;
  }>({});

  const [activeTab, setActiveTab] = useState<'form' | 'evaluation' | 'qualification'>('form');
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState<SupplierEvaluation[]>([]);
  const [qualifications, setQualifications] = useState<SupplierQualification[]>([]);
  const [qualificationAlerts, setQualificationAlerts] = useState<QualificationAlert[]>([]);
  const [availableTags, setAvailableTags] = useState<SupplierTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');

  const [evaluationForm, setEvaluationForm] = useState({
    qualityScore: 80,
    deliveryScore: 80,
    priceScore: 80,
    serviceScore: 80,
    remark: '',
    evaluationDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadSuppliers();
    loadAvailableTags();
  }, [currentPage, keyword, statusFilter, categoryFilter, cooperationLevelFilter, tagFilter]);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.categoryClassification = categoryFilter;
      if (cooperationLevelFilter) params.cooperationLevel = cooperationLevelFilter;

      const response = await supplierApi.getList(params);
      if (response.success && response.data) {
        let list = response.data.list || [];
        if (tagFilter) {
          list = list.filter((s: Supplier) => 
            s.tags?.some(t => t.tagName === tagFilter)
          );
        }
        setSuppliers(list);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载供应商列表失败:', error);
      showNotification('加载供应商列表失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableTags = async () => {
    try {
      const response = await supplierApi.getTags();
      if (response.success && response.data) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const loadEvaluationHistory = async (supplierId: number) => {
    try {
      const response = await supplierApi.getEvaluationHistory(supplierId);
      if (response.success && response.data) {
        setEvaluationHistory(response.data);
      }
    } catch (error) {
      console.error('加载评估历史失败:', error);
    }
  };

  const loadQualifications = async (supplierId: number) => {
    try {
      const response = await supplierApi.getQualifications(supplierId);
      if (response.success && response.data) {
        setQualifications(response.data);
        const alerts = response.data.filter((q: SupplierQualification) => {
          if (!q.expiryDate) return false;
          const daysUntilExpiry = Math.ceil((new Date(q.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30;
        }).map((q: SupplierQualification) => ({
          supplierId: q.supplierId,
          qualificationType: q.qualificationType,
          qualificationName: q.qualificationName,
          expiryDate: q.expiryDate,
          daysUntilExpiry: Math.ceil((new Date(q.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
          alertLevel: Math.ceil((new Date(q.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7 ? 'urgent' : 'warning',
        }));
        setQualificationAlerts(alerts);
      }
    } catch (error) {
      console.error('加载资质列表失败:', error);
    }
  };

  const generateCode = (type: string) => {
    const prefix = type === 'MANUFACTURER' ? 'Z' : type === 'TRADER' ? 'M' : 'D';
    const num = Math.floor(Math.random() * 9999) + 1;
    return `${prefix}${String(num).padStart(4, '0')}`;
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: '草稿',
      PENDING: '待审核',
      QUALIFIED: '合格',
      SUSPENDED: '暂停',
      BLACKLIST: '黑名单',
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      QUALIFIED: 'bg-green-100 text-green-700',
      SUSPENDED: 'bg-red-100 text-red-700',
      BLACKLIST: 'bg-red-600 text-white',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const getEvaluationLevel = (score: number) => {
    if (score >= 90) return { level: 'A级', class: 'bg-green-100 text-green-700 border-green-200' };
    if (score >= 80) return { level: 'B级', class: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (score >= 70) return { level: 'C级', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    if (score >= 60) return { level: 'D级', class: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { level: 'E级', class: 'bg-red-100 text-red-700 border-red-200' };
  };

  const calculateComprehensiveScore = (quality: number, delivery: number, price: number, service: number) => {
    return Math.round(quality * 0.3 + delivery * 0.25 + price * 0.2 + service * 0.15 + (quality * 0.3 + delivery * 0.25 + price * 0.2 + service * 0.15) * 0.1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData(prev => ({ ...prev, [name]: value, code: generateCode(value) }));
    } else if (name === 'registeredCapital') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (field: 'qualityCertification' | 'isoCertificate' | 'businessLicense', file: File | null) => {
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg text-white shadow-lg ${colors[type]}`;
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && currentSupplier?.id) {
        const updateData = { ...formData };
        const response = await supplierApi.update(currentSupplier.id, updateData);
        if (response.success) {
          showNotification('供应商更新成功', 'success');
          setShowModal(false);
          resetForm();
          loadSuppliers();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        const response = await supplierApi.create(formData as SupplierCreate);
        if (response.success) {
          showNotification('供应商创建成功', 'success');
          setShowModal(false);
          resetForm();
          loadSuppliers();
        } else {
          showNotification(response.message || '创建失败', 'error');
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
      showNotification('操作失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEvaluation = async () => {
    if (!currentSupplier?.id) return;

    setIsLoading(true);
    try {
      const comprehensiveScore = calculateComprehensiveScore(
        evaluationForm.qualityScore,
        evaluationForm.deliveryScore,
        evaluationForm.priceScore,
        evaluationForm.serviceScore
      );
      const evaluationLevel = getEvaluationLevel(comprehensiveScore).level;

      const response = await supplierApi.saveEvaluation(currentSupplier.id, {
        qualityScore: evaluationForm.qualityScore,
        deliveryScore: evaluationForm.deliveryScore,
        priceScore: evaluationForm.priceScore,
        serviceScore: evaluationForm.serviceScore,
        comprehensiveScore,
        evaluationLevel,
        evaluationDate: evaluationForm.evaluationDate,
        remark: evaluationForm.remark,
      });

      if (response.success) {
        showNotification('评估保存成功', 'success');
        loadEvaluationHistory(currentSupplier.id);
        loadSuppliers();
        setShowEvaluationForm(false);
        setEvaluationForm({
          qualityScore: 80,
          deliveryScore: 80,
          priceScore: 80,
          serviceScore: 80,
          remark: '',
          evaluationDate: new Date().toISOString().split('T')[0],
        });
      } else {
        showNotification(response.message || '保存失败', 'error');
      }
    } catch (error) {
      console.error('保存评估失败:', error);
      showNotification('保存评估失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!currentSupplier?.id || !newTagName.trim()) return;

    setIsLoading(true);
    try {
      const response = await supplierApi.addTag(currentSupplier.id, {
        tagName: newTagName.trim(),
        tagColor: newTagColor,
      });

      if (response.success) {
        showNotification('标签添加成功', 'success');
        setNewTagName('');
        const supplierRes = await supplierApi.getById(currentSupplier.id);
        if (supplierRes.success && supplierRes.data) {
          setCurrentSupplier(supplierRes.data);
        }
        loadAvailableTags();
        loadSuppliers();
      } else {
        showNotification(response.message || '添加失败', 'error');
      }
    } catch (error) {
      console.error('添加标签失败:', error);
      showNotification('添加标签失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    if (!currentSupplier?.id) return;

    setIsLoading(true);
    try {
      const response = await supplierApi.removeTag(currentSupplier.id, tagId);
      if (response.success) {
        showNotification('标签移除成功', 'success');
        const supplierRes = await supplierApi.getById(currentSupplier.id);
        if (supplierRes.success && supplierRes.data) {
          setCurrentSupplier(supplierRes.data);
        }
        loadSuppliers();
      } else {
        showNotification(response.message || '移除失败', 'error');
      }
    } catch (error) {
      console.error('移除标签失败:', error);
      showNotification('移除标签失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (supplier: Supplier) => {
    setIsEditMode(true);
    setCurrentSupplier(supplier);
    setFormData({
      code: supplier.code,
      name: supplier.name,
      englishName: supplier.englishName || '',
      shortName: supplier.shortName || '',
      type: supplier.type,
      country: supplier.country,
      city: supplier.city || '',
      address: supplier.address || '',
      officeAddress: supplier.officeAddress || '',
      contactPerson: supplier.contactPerson || '',
      contactPosition: supplier.contactPosition || '',
      contactPhone: supplier.contactPhone || '',
      contactEmail: supplier.contactEmail || '',
      faxNumber: supplier.faxNumber || '',
      taxNumber: supplier.taxNumber || '',
      registrationNumber: supplier.registrationNumber || '',
      registeredCapital: supplier.registeredCapital || 0,
      registeredCapitalCurrency: supplier.registeredCapitalCurrency || 'CNY',
      companySize: supplier.companySize || '',
      website: supplier.website || '',
      bankName: supplier.bankName || '',
      bankAccount: supplier.bankAccount || '',
      bankAccountName: supplier.bankAccountName || '',
      mainProducts: supplier.mainProducts || '',
      industryCategory: supplier.industryCategory || '',
      qualityCertification: supplier.qualityCertification || '',
      isoCertificate: supplier.isoCertificate || '',
      categoryClassification: supplier.categoryClassification || '',
      cooperationLevel: supplier.cooperationLevel || '',
      remark: supplier.remark || '',
      tags: supplier.tags?.map(t => t.tagName) || [],
    });
    setShowModal(true);
    setActiveTab('form');
  };

  const handleView = async (supplier: Supplier) => {
    try {
      const response = await supplierApi.getById(supplier.id!);
      if (response.success && response.data) {
        setCurrentSupplier(response.data);
        setShowDetailModal(true);
      } else {
        showNotification(response.message || '获取详情失败', 'error');
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      showNotification('获取详情失败，请稍后重试', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      englishName: '',
      shortName: '',
      type: 'MANUFACTURER',
      country: '中国',
      city: '',
      address: '',
      officeAddress: '',
      contactPerson: '',
      contactPosition: '',
      contactPhone: '',
      contactEmail: '',
      faxNumber: '',
      taxNumber: '',
      registrationNumber: '',
      registeredCapital: 0,
      registeredCapitalCurrency: 'CNY',
      companySize: '',
      website: '',
      bankName: '',
      bankAccount: '',
      bankAccountName: '',
      mainProducts: '',
      industryCategory: '',
      qualityCertification: '',
      isoCertificate: '',
      categoryClassification: '',
      cooperationLevel: '',
      remark: '',
      tags: [],
    });
    setUploadedFiles({});
    setIsEditMode(false);
    setCurrentSupplier(null);
    setActiveTab('form');
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!confirm(`确定要删除供应商 ${supplier.name} 吗？`)) return;
    
    try {
      const response = await supplierApi.delete(supplier.id!);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadSuppliers();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除失败:', error);
      showNotification('删除失败，请稍后重试', 'error');
    }
  };

  const handleUpdateStatus = async (supplier: Supplier, newStatus: string) => {
    if (!confirm(`确定要将 ${supplier.name} 状态更新为 ${getStatusText(newStatus)} 吗？`)) return;
    
    try {
      const response = await supplierApi.update(supplier.id!, { status: newStatus });
      if (response.success) {
        showNotification('状态更新成功', 'success');
        loadSuppliers();
      } else {
        showNotification(response.message || '更新失败', 'error');
      }
    } catch (error) {
      console.error('更新失败:', error);
      showNotification('更新失败，请稍后重试', 'error');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await supplierApi.importData(formData);
      if (response.success) {
        showNotification(`成功导入 ${response.data} 条供应商数据`, 'success');
        loadSuppliers();
      } else {
        showNotification(response.message || '导入失败', 'error');
      }
    } catch (error) {
      console.error('导入失败:', error);
      showNotification('导入失败，请确保文件格式正确', 'error');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleExport = () => {
    const headers = ['供应商编码', '供应商名称', '英文名', '简称', '类型', '行业分类', '合作等级', '评级', '联系人', '联系电话', '状态', '创建时间'];
    const rows = suppliers.map(supplier => [
      supplier.code,
      supplier.name,
      supplier.englishName || '',
      supplier.shortName || '',
      supplier.type === 'MANUFACTURER' ? '制造商' : supplier.type === 'TRADER' ? '贸易商' : supplier.type === 'AGENT' ? '代理商' : supplier.type,
      supplier.categoryClassification || '',
      supplier.cooperationLevel || '',
      supplier.evaluationLevel || '',
      supplier.contactPerson || '',
      supplier.contactPhone || '',
      getStatusText(supplier.status),
      supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `供应商数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">供应商管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>业务管理</span>
              <span>/</span>
              <span>供应商管理</span>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fas fa-plus"></i>
            新增供应商
          </button>
        </div>

        {/* 搜索筛选区 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="搜索供应商名称、编码、联系人..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
              >
                <option value="">全部状态</option>
                <option value="DRAFT">草稿</option>
                <option value="PENDING">待审核</option>
                <option value="QUALIFIED">合格</option>
                <option value="SUSPENDED">暂停</option>
                <option value="BLACKLIST">黑名单</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
              >
                <option value="">全部分类</option>
                <option value="原材料">原材料</option>
                <option value="半成品">半成品</option>
                <option value="成品">成品</option>
                <option value="辅料">辅料</option>
                <option value="设备">设备</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <select
                value={cooperationLevelFilter}
                onChange={(e) => setCooperationLevelFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
              >
                <option value="">全部等级</option>
                <option value="战略供应商">战略供应商</option>
                <option value="核心供应商">核心供应商</option>
                <option value="优选供应商">优选供应商</option>
                <option value="合格供应商">合格供应商</option>
                <option value="待评估供应商">待评估供应商</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
              >
                <option value="">全部标签</option>
                {availableTags.map(tag => (
                  <option key={tag.id} value={tag.tagName}>{tag.tagName}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => document.getElementById('import-file')?.click()}
                className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
              >
                <i className="fas fa-upload"></i>
                导入
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2"
              >
                <i className="fas fa-download"></i>
                导出
              </button>
              <input
                id="import-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* 供应商列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading && !suppliers.length ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-gray-500">
                <i className="fas fa-spinner fa-spin text-2xl"></i>
                <span className="text-lg">加载中...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[120px]">供应商编码</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[200px]">供应商名称</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[80px]">类型</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[100px]">分类</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[80px]">合作等级</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[80px]">评级</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[140px]">联系人</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[80px]">状态</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[150px]">标签</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[100px]">创建时间</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 min-w-[200px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {suppliers.map((supplier) => (
                      <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 min-w-[120px]">
                          <span className="font-medium text-gray-900">{supplier.code}</span>
                        </td>
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="whitespace-nowrap overflow-hidden text-ellipsis" title={supplier.name}>
                            <div className="font-medium text-gray-900 truncate">{supplier.name}</div>
                            <div className="text-sm text-gray-500 truncate">{supplier.shortName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 min-w-[80px]">
                          <span className="text-gray-700">
                            {supplier.type === 'MANUFACTURER' ? '制造商' : 
                             supplier.type === 'TRADER' ? '贸易商' : 
                             supplier.type === 'AGENT' ? '代理商' : supplier.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[100px]">
                          <span className="text-gray-700">{supplier.categoryClassification || '-'}</span>
                        </td>
                        <td className="px-6 py-4 min-w-[80px]">
                          <span className="text-gray-700">{supplier.cooperationLevel || '-'}</span>
                        </td>
                        <td className="px-6 py-4 min-w-[80px]">
                          {supplier.evaluationLevel ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${getEvaluationLevel(supplier.comprehensiveScore || 0).class}`}>
                              {supplier.evaluationLevel}
                            </span>
                          ) : (
                            <span className="text-gray-400">未评级</span>
                          )}
                        </td>
                        <td className="px-6 py-4 min-w-[140px]">
                          <div>
                            <div className="text-gray-900">{supplier.contactPerson || '-'}</div>
                            <div className="text-sm text-gray-500">{supplier.contactPhone || ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 min-w-[80px]">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(supplier.status)}`}>
                            {getStatusText(supplier.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[150px]">
                          <div className="flex flex-wrap gap-1">
                            {supplier.tags?.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded text-xs text-white"
                                style={{ backgroundColor: tag.tagColor || '#3B82F6' }}
                              >
                                {tag.tagName}
                              </span>
                            ))}
                            {supplier.tags && supplier.tags.length > 3 && (
                              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                +{supplier.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 min-w-[100px]">
                          {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(supplier)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                              title="查看详情"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(supplier)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                              title="编辑"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {supplier.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(supplier, 'QUALIFIED')}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-green-600"
                                  title="通过审核"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(supplier, 'SUSPENDED')}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-orange-600"
                                  title="暂停"
                                >
                                  <i className="fas fa-pause"></i>
                                </button>
                              </>
                            )}
                            {supplier.status === 'QUALIFIED' && (
                              <button
                                onClick={() => handleUpdateStatus(supplier, 'BLACKLIST')}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                                title="加入黑名单"
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            )}
                            {supplier.status === 'BLACKLIST' && (
                              <button
                                onClick={() => handleUpdateStatus(supplier, 'QUALIFIED')}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-green-600"
                                title="移出黑名单"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(supplier)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                              title="删除"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!suppliers.length && (
                <div className="text-center py-16 text-gray-500">
                  <i className="fas fa-building text-5xl opacity-30 mb-4"></i>
                  <p className="text-lg">暂无供应商数据</p>
                </div>
              )}

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    共 {totalCount} 条记录，第 {currentPage} / {totalPages} 页
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <i className="fas fa-chevron-left"></i>
                      上一页
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-weyeah-blue text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      下一页
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 新增/编辑模态框 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col my-8 mx-4">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? '编辑供应商' : '新增供应商'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {isEditMode && (
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('form')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'form'
                          ? 'bg-weyeah-blue text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-building mr-2"></i>
                      基本信息
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('evaluation');
                        if (currentSupplier?.id) {
                          loadEvaluationHistory(currentSupplier.id);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'evaluation'
                          ? 'bg-weyeah-blue text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-chart-line mr-2"></i>
                      评估评级
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('qualification');
                        if (currentSupplier?.id) {
                          loadQualifications(currentSupplier.id);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'qualification'
                          ? 'bg-weyeah-blue text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-certificate mr-2"></i>
                      资质管理
                      {qualificationAlerts.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {qualificationAlerts.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6 overflow-y-auto flex-1">
                {activeTab === 'form' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 基本信息 */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-building text-weyeah-blue"></i>
                        基本信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            供应商类型 <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          >
                            <option value="MANUFACTURER">制造商</option>
                            <option value="TRADER">贸易商</option>
                            <option value="AGENT">代理商</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            供应商编码
                          </label>
                          <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="系统自动生成"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue bg-gray-50"
                            readOnly
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            供应商名称 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="请输入供应商完整名称"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            英文名称
                          </label>
                          <input
                            type="text"
                            name="englishName"
                            value={formData.englishName}
                            onChange={handleInputChange}
                            placeholder="请输入英文名称"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            供应商简称
                          </label>
                          <input
                            type="text"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleInputChange}
                            placeholder="请输入供应商简称"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            所属行业
                          </label>
                          <select
                            name="industryCategory"
                            value={formData.industryCategory}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          >
                            <option value="">请选择</option>
                            <option value="制造业">制造业</option>
                            <option value="批发业">批发业</option>
                            <option value="零售业">零售业</option>
                            <option value="信息传输">信息传输</option>
                            <option value="软件和信息技术">软件和信息技术</option>
                            <option value="其他">其他</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            公司规模
                          </label>
                          <select
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          >
                            <option value="">请选择</option>
                            <option value="微型">微型（50人以下）</option>
                            <option value="小型">小型（50-200人）</option>
                            <option value="中型">中型（200-500人）</option>
                            <option value="大型">大型（500人以上）</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            注册资本
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              name="registeredCapital"
                              value={formData.registeredCapital}
                              onChange={handleInputChange}
                              placeholder="0"
                              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                            />
                            <select
                              name="registeredCapitalCurrency"
                              value={formData.registeredCapitalCurrency}
                              onChange={handleInputChange}
                              className="w-28 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                            >
                              <option value="CNY">CNY</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="JPY">JPY</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            官网地址
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            公司注册编号
                          </label>
                          <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            placeholder="请输入统一社会信用代码"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            物料分类
                          </label>
                          <select
                            name="categoryClassification"
                            value={formData.categoryClassification}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          >
                            <option value="">请选择</option>
                            <option value="原材料">原材料</option>
                            <option value="半成品">半成品</option>
                            <option value="成品">成品</option>
                            <option value="辅料">辅料</option>
                            <option value="设备">设备</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            合作等级
                          </label>
                          <select
                            name="cooperationLevel"
                            value={formData.cooperationLevel}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          >
                            <option value="">请选择</option>
                            <option value="战略供应商">战略供应商</option>
                            <option value="核心供应商">核心供应商</option>
                            <option value="优选供应商">优选供应商</option>
                            <option value="合格供应商">合格供应商</option>
                            <option value="待评估供应商">待评估供应商</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 联系信息 */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-address-card text-weyeah-blue"></i>
                        联系信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            联系人
                          </label>
                          <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            placeholder="请输入联系人姓名"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            联系人职位
                          </label>
                          <input
                            type="text"
                            name="contactPosition"
                            value={formData.contactPosition}
                            onChange={handleInputChange}
                            placeholder="请输入联系人职位"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            联系电话
                          </label>
                          <input
                            type="text"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            placeholder="请输入联系电话"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            电子邮箱
                          </label>
                          <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            placeholder="请输入电子邮箱"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            传真号码
                          </label>
                          <input
                            type="text"
                            name="faxNumber"
                            value={formData.faxNumber}
                            onChange={handleInputChange}
                            placeholder="请输入传真号码"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            国家/地区
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="请输入国家/地区"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            城市
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="请输入城市"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            详细地址
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="请输入详细地址"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            办公地址
                          </label>
                          <input
                            type="text"
                            name="officeAddress"
                            value={formData.officeAddress}
                            onChange={handleInputChange}
                            placeholder="请输入办公地址"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 银行信息 */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-calculator text-weyeah-blue"></i>
                        银行信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            税号
                          </label>
                          <input
                            type="text"
                            name="taxNumber"
                            value={formData.taxNumber}
                            onChange={handleInputChange}
                            placeholder="请输入税号"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            营业执照号
                          </label>
                          <input
                            type="text"
                            name="businessLicense"
                            value={formData.businessLicense}
                            onChange={handleInputChange}
                            placeholder="请输入营业执照号"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            开户银行
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            placeholder="请输入开户银行"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            银行账号
                          </label>
                          <input
                            type="text"
                            name="bankAccount"
                            value={formData.bankAccount}
                            onChange={handleInputChange}
                            placeholder="请输入银行账号"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            银行户名
                          </label>
                          <input
                            type="text"
                            name="bankAccountName"
                            value={formData.bankAccountName}
                            onChange={handleInputChange}
                            placeholder="请输入银行户名"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 资质文件 */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-file-alt text-weyeah-blue"></i>
                        资质文件
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            营业执照
                          </label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 cursor-pointer transition-colors">
                            <input
                              type="file"
                              className="hidden"
                              id="businessLicense"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                            />
                            <label htmlFor="businessLicense" className="cursor-pointer">
                              {formData.businessLicense ? (
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                  <i className="fas fa-check-circle"></i>
                                  <span>已上传</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <i className="fas fa-cloud-upload-alt text-2xl"></i>
                                  <span>点击上传</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            质量认证
                          </label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 cursor-pointer transition-colors">
                            <input
                              type="file"
                              className="hidden"
                              id="qualityCertification"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange('qualityCertification', e.target.files?.[0] || null)}
                            />
                            <label htmlFor="qualityCertification" className="cursor-pointer">
                              {formData.qualityCertification ? (
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                  <i className="fas fa-check-circle"></i>
                                  <span>已上传</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <i className="fas fa-cloud-upload-alt text-2xl"></i>
                                  <span>点击上传</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ISO认证
                          </label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 cursor-pointer transition-colors">
                            <input
                              type="file"
                              className="hidden"
                              id="isoCertificate"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange('isoCertificate', e.target.files?.[0] || null)}
                            />
                            <label htmlFor="isoCertificate" className="cursor-pointer">
                              {formData.isoCertificate ? (
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                  <i className="fas fa-check-circle"></i>
                                  <span>已上传</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <i className="fas fa-cloud-upload-alt text-2xl"></i>
                                  <span>点击上传</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 其他信息 */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-box text-weyeah-blue"></i>
                        其他信息
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            主要产品
                          </label>
                          <input
                            type="text"
                            name="mainProducts"
                            value={formData.mainProducts}
                            onChange={handleInputChange}
                            placeholder="请输入主要产品"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            备注
                          </label>
                          <textarea
                            name="remark"
                            value={formData.remark}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="请输入备注信息"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 标签管理 */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-tags text-weyeah-blue"></i>
                        标签管理
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            已有标签
                          </label>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {currentSupplier?.tags?.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-sm text-white flex items-center gap-2"
                                style={{ backgroundColor: tag.tagColor || '#3B82F6' }}
                              >
                                {tag.tagName}
                                <button
                                  onClick={() => handleRemoveTag(tag.id!)}
                                  className="hover:opacity-75"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={newTagName}
                              onChange={(e) => setNewTagName(e.target.value)}
                              placeholder="输入新标签名称"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                            />
                          </div>
                          <div className="w-32">
                            <input
                              type="color"
                              value={newTagColor}
                              onChange={(e) => setNewTagColor(e.target.value)}
                              className="w-full h-full border border-gray-200 rounded-lg cursor-pointer"
                            />
                          </div>
                          <button
                            onClick={handleAddTag}
                            disabled={!newTagName.trim()}
                            className="px-6 py-3 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            添加标签
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'evaluation' && (
                  <div className="space-y-6">
                    {/* 当前评级 */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">当前评级信息</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">综合评分</div>
                          <div className="text-3xl font-bold text-weyeah-blue">
                            {currentSupplier?.comprehensiveScore || 0}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">评级</div>
                          <div className="text-3xl font-bold">
                            {currentSupplier?.evaluationLevel ? (
                              <span className={`px-4 py-2 rounded-full ${getEvaluationLevel(currentSupplier.comprehensiveScore || 0).class}`}>
                                {currentSupplier.evaluationLevel}
                              </span>
                            ) : (
                              <span className="text-gray-400">未评级</span>
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">最近评估日期</div>
                          <div className="text-lg font-medium text-gray-900">
                            {currentSupplier?.lastEvaluationDate 
                              ? new Date(currentSupplier.lastEvaluationDate).toLocaleDateString()
                              : '-'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">评估周期</div>
                          <div className="text-lg font-medium text-gray-900">
                            {currentSupplier?.evaluationCycle || '年度评估'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 评分详情 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">评分权重说明</h3>
                        <button
                          onClick={() => setShowEvaluationForm(true)}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2"
                        >
                          <i className="fas fa-plus"></i>
                          新增评估
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-2">质量评分</div>
                          <div className="text-2xl font-bold text-blue-600">{currentSupplier?.qualityScore || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">权重: 30%</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-2">交付评分</div>
                          <div className="text-2xl font-bold text-green-600">{currentSupplier?.deliveryScore || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">权重: 25%</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-2">价格评分</div>
                          <div className="text-2xl font-bold text-purple-600">{currentSupplier?.priceScore || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">权重: 20%</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-2">服务评分</div>
                          <div className="text-2xl font-bold text-orange-600">{currentSupplier?.serviceScore || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">权重: 15%</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                          <div className="text-sm text-gray-600 mb-2">综合评分</div>
                          <div className="text-2xl font-bold text-weyeah-blue">{currentSupplier?.comprehensiveScore || 0}</div>
                          <div className="text-xs text-gray-500 mt-1">权重: 10%</div>
                        </div>
                      </div>
                    </div>

                    {/* 评估历史 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">评估历史记录</h3>
                      {evaluationHistory.length > 0 ? (
                        <div className="space-y-4">
                          {evaluationHistory.map((evaluation, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-4">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEvaluationLevel(evaluation.comprehensiveScore).class}`}>
                                    {evaluation.evaluationLevel}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(evaluation.evaluationDate).toLocaleDateString()}
                                  </span>
                                  {evaluation.evaluator && (
                                    <span className="text-sm text-gray-600">
                                      评估人: {evaluation.evaluator}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">质量:</span>
                                  <span className="font-medium ml-1">{evaluation.qualityScore}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">交付:</span>
                                  <span className="font-medium ml-1">{evaluation.deliveryScore}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">价格:</span>
                                  <span className="font-medium ml-1">{evaluation.priceScore}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">服务:</span>
                                  <span className="font-medium ml-1">{evaluation.serviceScore}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">综合:</span>
                                  <span className="font-medium ml-1">{evaluation.comprehensiveScore}</span>
                                </div>
                              </div>
                              {evaluation.remark && (
                                <div className="mt-2 text-sm text-gray-600">
                                  备注: {evaluation.remark}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <i className="fas fa-chart-line text-4xl opacity-30 mb-3"></i>
                          <p>暂无评估历史记录</p>
                        </div>
                      )}
                    </div>

                    {/* 评级说明 */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">评级标准说明</h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">A级</span>
                          <span className="text-sm text-gray-600">90-100分</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">B级</span>
                          <span className="text-sm text-gray-600">80-89分</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">C级</span>
                          <span className="text-sm text-gray-600">70-79分</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">D级</span>
                          <span className="text-sm text-gray-600">60-69分</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200">E级</span>
                          <span className="text-sm text-gray-600">60分以下</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'qualification' && (
                  <div className="space-y-6">
                    {/* 资质预警 */}
                    {qualificationAlerts.length > 0 && (
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                          <i className="fas fa-exclamation-triangle"></i>
                          资质到期预警 ({qualificationAlerts.length})
                        </h3>
                        <div className="space-y-3">
                          {qualificationAlerts.map((alert, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg border ${
                                alert.alertLevel === 'urgent'
                                  ? 'bg-red-100 border-red-300'
                                  : 'bg-orange-100 border-orange-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">{alert.qualificationName}</div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    到期日期: {new Date(alert.expiryDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${
                                    alert.alertLevel === 'urgent' ? 'text-red-600' : 'text-orange-600'
                                  }`}>
                                    {alert.daysUntilExpiry}
                                  </div>
                                  <div className="text-sm text-gray-600">天后到期</div>
                                </div>
                              </div>
                              {alert.alertLevel === 'urgent' && (
                                <div className="mt-2 px-3 py-1 bg-red-200 text-red-800 rounded text-sm inline-block">
                                  紧急：建议立即处理
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 资质列表 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">资质证书列表</h3>
                        <button
                          onClick={() => showNotification('资质管理功能开发中', 'info')}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2"
                        >
                          <i className="fas fa-plus"></i>
                          添加资质
                        </button>
                      </div>
                      {qualifications.length > 0 ? (
                        <div className="space-y-4">
                          {qualifications.map((qualification, idx) => {
                            const daysUntilExpiry = qualification.expiryDate
                              ? Math.ceil((new Date(qualification.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                              : null;
                            const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
                            const isUrgent = daysUntilExpiry !== null && daysUntilExpiry <= 7;
                            const isWarning = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 7;

                            return (
                              <div
                                key={idx}
                                className={`border rounded-lg p-4 transition-colors ${
                                  isExpired
                                    ? 'border-red-300 bg-red-50'
                                    : isUrgent
                                    ? 'border-red-200 bg-red-50'
                                    : isWarning
                                    ? 'border-orange-200 bg-orange-50'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="font-medium text-gray-900">{qualification.qualificationName}</h4>
                                      {isExpired && (
                                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                                          已过期
                                        </span>
                                      )}
                                      {isUrgent && !isExpired && (
                                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                                          紧急
                                        </span>
                                      )}
                                      {isWarning && !isExpired && !isUrgent && (
                                        <span className="px-2 py-1 bg-orange-500 text-white rounded text-xs">
                                          警告
                                        </span>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                      <div>
                                        <span className="font-medium">类型:</span> {qualification.qualificationType}
                                      </div>
                                      {qualification.issueDate && (
                                        <div>
                                          <span className="font-medium">发证日期:</span> {new Date(qualification.issueDate).toLocaleDateString()}
                                        </div>
                                      )}
                                      {qualification.expiryDate && (
                                        <div>
                                          <span className="font-medium">到期日期:</span> {new Date(qualification.expiryDate).toLocaleDateString()}
                                        </div>
                                      )}
                                      <div>
                                        <span className="font-medium">状态:</span>
                                        <span className={`ml-1 ${
                                          isExpired ? 'text-red-600' : isUrgent ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                          {isExpired ? '已过期' : isUrgent ? '即将到期' : isWarning ? '即将到期' : '有效'}
                                        </span>
                                      </div>
                                    </div>
                                    {qualification.remark && (
                                      <div className="mt-2 text-sm text-gray-600">
                                        {qualification.remark}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue">
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600">
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <i className="fas fa-certificate text-4xl opacity-30 mb-3"></i>
                          <p>暂无资质证书</p>
                        </div>
                      )}
                    </div>

                    {/* 自动暂停提示 */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-info-circle"></i>
                        自动暂停说明
                      </h3>
                      <p className="text-sm text-yellow-800">
                        当供应商的重要资质证书（如营业执照、质量认证等）过期时，系统将自动将其状态暂停，并发送通知提醒相关人员更新资质证书。
                        请确保及时更新即将到期的资质证书，以避免影响正常的业务往来。
                      </p>
                    </div>
                  </div>
                )}

                {/* 评估表单弹窗 */}
                {showEvaluationForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl mx-4">
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">新增评估</h2>
                        <button
                          onClick={() => setShowEvaluationForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            评估日期
                          </label>
                          <input
                            type="date"
                            value={evaluationForm.evaluationDate}
                            onChange={(e) => setEvaluationForm(prev => ({ ...prev, evaluationDate: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              质量评分 (30%) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={evaluationForm.qualityScore}
                                onChange={(e) => setEvaluationForm(prev => ({ ...prev, qualityScore: parseInt(e.target.value) }))}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium text-blue-600">{evaluationForm.qualityScore}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              交付评分 (25%) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={evaluationForm.deliveryScore}
                                onChange={(e) => setEvaluationForm(prev => ({ ...prev, deliveryScore: parseInt(e.target.value) }))}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium text-green-600">{evaluationForm.deliveryScore}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              价格评分 (20%) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={evaluationForm.priceScore}
                                onChange={(e) => setEvaluationForm(prev => ({ ...prev, priceScore: parseInt(e.target.value) }))}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium text-purple-600">{evaluationForm.priceScore}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              服务评分 (15%) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={evaluationForm.serviceScore}
                                onChange={(e) => setEvaluationForm(prev => ({ ...prev, serviceScore: parseInt(e.target.value) }))}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium text-orange-600">{evaluationForm.serviceScore}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">综合评分:</span>
                            <span className="text-2xl font-bold text-weyeah-blue">
                              {calculateComprehensiveScore(
                                evaluationForm.qualityScore,
                                evaluationForm.deliveryScore,
                                evaluationForm.priceScore,
                                evaluationForm.serviceScore
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium text-gray-700">评级:</span>
                            <span className={`px-4 py-1 rounded-full text-sm font-medium ${getEvaluationLevel(calculateComprehensiveScore(
                              evaluationForm.qualityScore,
                              evaluationForm.deliveryScore,
                              evaluationForm.priceScore,
                              evaluationForm.serviceScore
                            )).class}`}>
                              {getEvaluationLevel(calculateComprehensiveScore(
                                evaluationForm.qualityScore,
                                evaluationForm.deliveryScore,
                                evaluationForm.priceScore,
                                evaluationForm.serviceScore
                              )).level}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            备注
                          </label>
                          <textarea
                            value={evaluationForm.remark}
                            onChange={(e) => setEvaluationForm(prev => ({ ...prev, remark: e.target.value }))}
                            rows={3}
                            placeholder="请输入评估备注"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                          />
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setShowEvaluationForm(false)}
                          className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleSaveEvaluation}
                          disabled={isLoading}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                          保存评估
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !formData.name}
                  className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 供应商详情模态框 - 新组件 */}
        {showDetailModal && currentSupplier && (
          <SupplierDetailModal
            supplier={currentSupplier}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </Layout>
  );
}
