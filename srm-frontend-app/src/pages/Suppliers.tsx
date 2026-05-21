import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Supplier, SupplierCreate } from '../types';
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
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState<Partial<SupplierCreate>>({
    code: '',
    name: '',
    shortName: '',
    type: 'MANUFACTURER',
    country: '中国',
    city: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    taxNumber: '',
    businessLicense: '',
    bankName: '',
    bankAccount: '',
    mainProducts: '',
    qualityCertification: '',
    isoCertificate: '',
    remark: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    qualityCertification?: File;
    isoCertificate?: File;
    businessLicense?: File;
  }>({});

  useEffect(() => {
    loadSuppliers();
  }, [currentPage, keyword, statusFilter]);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (statusFilter) params.status = statusFilter;

      const response = await supplierApi.getList(params);
      if (response.success && response.data) {
        setSuppliers(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载供应商列表失败:', error);
      showNotification('加载供应商列表失败', 'error');
    } finally {
      setIsLoading(false);
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
      BLACKLIST: 'bg-gray-500 text-white',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData(prev => ({ ...prev, [name]: value, code: generateCode(value) }));
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
        // 编辑模式：更新供应商并重新设为待审核状态
        const updateData = {
          ...formData,
          status: 'PENDING', // 编辑后重新设为待审核状态
        };
        const response = await supplierApi.update(currentSupplier.id, updateData);
        if (response.success) {
          showNotification('供应商更新成功，已重新提交审核', 'success');
          setShowModal(false);
          resetForm();
          loadSuppliers();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        // 创建模式
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

  const handleEdit = async (supplier: Supplier) => {
    setIsEditMode(true);
    setCurrentSupplier(supplier);
    setFormData({
      code: supplier.code,
      name: supplier.name,
      shortName: supplier.shortName,
      type: supplier.type,
      country: supplier.country,
      city: supplier.city,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      contactPhone: supplier.contactPhone,
      contactEmail: supplier.contactEmail,
      taxNumber: supplier.taxNumber,
      businessLicense: supplier.businessLicense,
      bankName: supplier.bankName,
      bankAccount: supplier.bankAccount,
      mainProducts: supplier.mainProducts,
      qualityCertification: supplier.qualityCertification,
      isoCertificate: supplier.isoCertificate,
      remark: supplier.remark,
    });
    setShowModal(true);
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
      shortName: '',
      type: 'MANUFACTURER',
      country: '中国',
      city: '',
      address: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      taxNumber: '',
      businessLicense: '',
      bankName: '',
      bankAccount: '',
      mainProducts: '',
      qualityCertification: '',
      isoCertificate: '',
      remark: '',
    });
    setUploadedFiles({});
    setIsEditMode(false);
    setCurrentSupplier(null);
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
    const headers = ['供应商编码', '供应商名称', '简称', '类型', '联系人', '联系电话', '状态', '创建时间'];
    const rows = suppliers.map(supplier => [
      supplier.code,
      supplier.name,
      supplier.shortName || '',
      supplier.type === 'MANUFACTURER' ? '制造商' : supplier.type === 'TRADER' ? '贸易商' : supplier.type === 'AGENT' ? '代理商' : supplier.type,
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
            <div className="w-full md:w-48">
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
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[120px]">供应商编码</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[200px]">供应商名称</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[100px]">类型</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[140px]">联系人</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[80px]">状态</th>
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
                        <td className="px-6 py-4 min-w-[100px]">
                          <span className="text-gray-700">
                            {supplier.type === 'MANUFACTURER' ? '制造商' : 
                             supplier.type === 'TRADER' ? '贸易商' : 
                             supplier.type === 'AGENT' ? '代理商' : supplier.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[140px]">
                          <div>
                            <div className="text-gray-900">{supplier.contactPerson}</div>
                            <div className="text-sm text-gray-500">{supplier.contactPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 min-w-[80px]">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(supplier.status)}`}>
                            {getStatusText(supplier.status)}
                          </span>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
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
              <div className="p-6 overflow-y-auto flex-1">
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
                    </div>
                  </div>

                  {/* 财务信息 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-calculator text-weyeah-blue"></i>
                      财务信息
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

                  {/* 业务信息 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-box text-weyeah-blue"></i>
                      业务信息
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
                </div>
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
