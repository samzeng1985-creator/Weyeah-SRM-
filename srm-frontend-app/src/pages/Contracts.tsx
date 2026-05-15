import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Contract } from '../types';
import { contractApi } from '../services/contract';

interface ContractsProps {
  onLogout: () => void;
}

export default function Contracts({ onLogout }: ContractsProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') {
      setShowModal(true);
      history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState<Partial<Contract>>({
    code: '',
    name: '',
    type: '采购合同',
    supplierId: 0,
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    amount: 0,
  });

  useEffect(() => {
    loadContracts();
  }, [currentPage, keyword, typeFilter, statusFilter]);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await contractApi.getList(params);
      if (response.success && response.data) {
        setContracts(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载合同列表失败:', error);
      showNotification('加载合同列表失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      'NDA保密协议': 'NDA保密协议',
      '采购合同': '采购合同',
      '供应协议': '供应协议',
      '服务合同': '服务合同',
      '委托加工': '委托加工',
    };
    return map[type] || type;
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: '草稿',
      PENDING: '审批中',
      EXECUTING: '执行中',
      ACTIVE: '已生效',
      EXPIRED: '已过期',
      TERMINATED: '已终止',
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      EXECUTING: 'bg-blue-100 text-blue-700',
      ACTIVE: 'bg-green-100 text-green-700',
      EXPIRED: 'bg-orange-100 text-orange-700',
      TERMINATED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.code || !formData.name || !formData.startDate) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && editId) {
        const response = await contractApi.update(editId, formData);
        if (response.success) {
          showNotification('合同更新成功', 'success');
          setShowModal(false);
          resetForm();
          loadContracts();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        const response = await contractApi.create(formData);
        if (response.success) {
          showNotification('合同创建成功', 'success');
          setShowModal(false);
          resetForm();
          loadContracts();
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

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: '采购合同',
      supplierId: 0,
      status: 'DRAFT',
      startDate: '',
      endDate: '',
      amount: 0,
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleView = async (contract: Contract) => {
    try {
      const response = await contractApi.getById(contract.id!);
      if (response.success && response.data) {
        setCurrentContract(response.data);
        setShowDetailModal(true);
      } else {
        showNotification(response.message || '获取详情失败', 'error');
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      showNotification('获取详情失败，请稍后重试', 'error');
    }
  };

  const handleExportPDF = async (contract: Contract) => {
    try {
      const response = await contractApi.getById(contract.id!);
      if (response.success && response.data) {
        const contractData = response.data;
        const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${contractData.code} - ${contractData.name}</title>
  <style>
    body { font-family: 'SimHei', 'Microsoft YaHei', sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px; border: 1px solid #ddd; }
    .info-table th { padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">合同详情</div>
    <div>Contract Details</div>
  </div>
  
  <table class="info-table">
    <tr><th>合同编号</th><td>${contractData.code}</td></tr>
    <tr><th>合同名称</th><td>${contractData.name}</td></tr>
    <tr><th>合同类型</th><td>${getTypeText(contractData.type || '')}</td></tr>
    <tr><th>合同状态</th><td>${getStatusText(contractData.status || '')}</td></tr>
    <tr><th>开始日期</th><td>${contractData.startDate}</td></tr>
    <tr><th>结束日期</th><td>${contractData.endDate || '-'}</td></tr>
    <tr><th>合同金额</th><td>¥${Number(contractData.amount || 0).toLocaleString()}</td></tr>
  </table>
  
  <div class="footer">
    <p>Generated by SRM System</p>
    <p>${new Date().toLocaleString('zh-CN')}</p>
  </div>
</body>
</html>
        `;
        
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contractData.code}_contract.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('PDF导出成功', 'success');
      } else {
        showNotification('获取合同信息失败', 'error');
      }
    } catch (error) {
      console.error('导出PDF失败:', error);
      showNotification('导出PDF失败，请稍后重试', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该合同吗？')) return;
    
    try {
      const response = await contractApi.delete(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadContracts();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除合同失败:', error);
      showNotification('删除失败，请稍后重试', 'error');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">合同管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>业务管理</span>
              <span>/</span>
              <span>合同管理</span>
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
            新增合同
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="搜索合同编号、标题..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
            >
              <option value="">全部状态</option>
              <option value="DRAFT">草稿</option>
              <option value="PENDING">审批中</option>
              <option value="EXECUTING">执行中</option>
              <option value="EXPIRED">已过期</option>
            </select>
            <button 
              onClick={loadContracts}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
            >
              <i className="fas fa-filter"></i>
              筛选
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">合同编号</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">合同名称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">开始日期</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">金额</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && contracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </td>
                  </tr>
                ) : contracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{contract.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contract.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-blue-100 text-blue-700">
                          {getTypeText(contract.type || '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contract.startDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contract.amount ? `¥${Number(contract.amount).toLocaleString()}` : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(contract.status)}`}>
                          {getStatusText(contract.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(contract)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            title="查看详情"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            onClick={() => {
                              setFormData(contract);
                              setIsEditMode(true);
                              setEditId(contract.id || null);
                              setShowModal(true);
                            }}
                            title="编辑"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleExportPDF(contract)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-green-600"
                            title="导出PDF"
                          >
                            <i className="fas fa-file-pdf"></i>
                          </button>
                          <button 
                            onClick={() => contract.id && handleDelete(contract.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                            title="删除"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">共 {totalCount} 条记录</div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-500 disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg ${currentPage === page ? 'bg-weyeah-blue border-weyeah-blue text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-weyeah-blue hover:text-weyeah-blue'}`}
                  >
                    {page}
                  </button>
                );
              })}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:border-weyeah-blue hover:text-weyeah-blue disabled:opacity-50"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑合同' : '新增合同'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">合同编号 *</label>
                    <input
                      type="text"
                      name="code"
                      placeholder="请输入合同编号"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">合同名称 *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="请输入合同名称"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">合同类型</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="采购合同">采购合同</option>
                      <option value="供应协议">供应协议</option>
                      <option value="服务合同">服务合同</option>
                      <option value="NDA保密协议">NDA保密协议</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">开始日期 *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">合同金额</label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="请输入合同金额"
                      value={formData.amount || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                  {isEditMode ? '更新' : '保存'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailModal && currentContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">合同详情</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-file-contract text-weyeah-blue"></i>
                      基本信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">合同编号</div>
                        <div className="font-medium text-gray-900">{currentContract.code || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">合同名称</div>
                        <div className="font-medium text-gray-900">{currentContract.name || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">合同类型</div>
                        <div className="font-medium text-gray-900">{getTypeText(currentContract.type || '')}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">状态</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(currentContract.status)}`}>
                            {getStatusText(currentContract.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-calendar text-weyeah-blue"></i>
                      时间信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">开始日期</div>
                        <div className="font-medium text-gray-900">{currentContract.startDate || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">结束日期</div>
                        <div className="font-medium text-gray-900">{currentContract.endDate || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-money-bill text-weyeah-blue"></i>
                      金额信息
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">合同金额</div>
                      <div className="font-medium text-xl text-gray-900">¥{Number(currentContract.amount || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  onClick={() => window.location.href = `/logistics?contractId=${currentContract.id}`}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <i className="fas fa-truck"></i>
                  查看物流
                </button>
                <button
                  onClick={() => handleExportPDF(currentContract)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <i className="fas fa-file-pdf"></i>
                  导出PDF
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}