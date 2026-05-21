import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { pricingApi, PriceCheckResult } from '../services/pricing';

interface PricingProps {
  onLogout: () => void;
}

interface PricingItem {
  id?: number;
  code: string;
  supplierId?: number;
  supplierName?: string;
  materialId?: number;
  materialName?: string;
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

interface Supplier {
  id: number;
  name: string;
}

interface Material {
  id: number;
  name: string;
}

export default function Pricing({ onLogout }: PricingProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') {
      setShowModal(true);
      setIsEditMode(false);
      setEditId(null);
      history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPricing, setCurrentPricing] = useState<PricingItem | null>(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pricingList, setPricingList] = useState<PricingItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [priceIncreaseInfo, setPriceIncreaseInfo] = useState<PriceCheckResult | null>(null);

  const [formData, setFormData] = useState<Partial<PricingItem>>({
    supplierId: undefined,
    materialId: undefined,
    price: 0,
    taxRate: 13,
    currency: 'CNY',
    unit: '件',
    effectiveDate: '',
    expiryDate: '',
    minOrderQty: 1,
    status: 'DRAFT',
  });

  useEffect(() => {
    loadPricingList();
    loadSelectOptions();
  }, [currentPage, keyword, statusFilter]);

  useEffect(() => {
    if (formData.supplierId && formData.materialId && formData.price && formData.price > 0) {
      checkPriceIncrease();
    }
  }, [formData.supplierId, formData.materialId, formData.price]);

  const loadSelectOptions = async () => {
    try {
      const [supplierRes, materialRes] = await Promise.all([
        pricingApi.getSuppliers(),
        pricingApi.getMaterials(),
      ]);
      if (supplierRes.success && supplierRes.data) {
        setSuppliers(supplierRes.data);
      }
      if (materialRes.success && materialRes.data) {
        setMaterials(materialRes.data);
      }
    } catch (error) {
      console.error('加载选项失败:', error);
    }
  };

  const loadPricingList = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (statusFilter) params.status = statusFilter;

      const response = await pricingApi.getList(params);
      if (response.success && response.data) {
        setPricingList(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载定价列表失败:', error);
      showNotification('加载定价列表失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPriceIncrease = async () => {
    if (!formData.supplierId || !formData.materialId || !formData.price) {
      return;
    }

    try {
      const response = await pricingApi.checkPriceIncrease({
        supplierId: formData.supplierId,
        materialId: formData.materialId,
        price: formData.price,
      });

      if (response.success && response.data) {
        setPriceIncreaseInfo(response.data);
        
        if (response.data.requiresReason) {
          setShowReasonInput(true);
        } else {
          setShowReasonInput(false);
        }
      }
    } catch (error) {
      console.error('检查涨价幅度失败:', error);
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: '草稿',
      PENDING: '待审批',
      FINANCE_PENDING: '待财务审核',
      DIRECTOR_PENDING: '待总监审批',
      ACTIVE: '已生效',
      EXPIRED: '已过期',
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      FINANCE_PENDING: 'bg-blue-100 text-blue-700',
      DIRECTOR_PENDING: 'bg-purple-100 text-purple-700',
      ACTIVE: 'bg-green-100 text-green-700',
      EXPIRED: 'bg-orange-100 text-orange-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'supplierId' || name === 'materialId') {
      setFormData(prev => ({ ...prev, [name]: Number(value) || undefined }));
    } else if (name === 'price' || name === 'taxRate' || name === 'minOrderQty' || name === 'deliveryCycle') {
      setFormData(prev => ({ ...prev, [name]: Number(value) || undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleView = (item: PricingItem) => {
    setCurrentPricing(item);
    setShowDetailModal(true);
  };

  const handleEdit = (item: PricingItem) => {
    setFormData({
      supplierId: item.supplierId,
      materialId: item.materialId,
      price: item.price,
      taxRate: item.taxRate || 13,
      currency: item.currency || 'CNY',
      unit: item.unit || '件',
      minOrderQty: item.minOrderQty || 1,
      effectiveDate: item.effectiveDate,
      expiryDate: item.expiryDate,
      priceTerms: item.priceTerms,
      paymentTerms: item.paymentTerms,
      deliveryCycle: item.deliveryCycle,
      remark: item.remark,
      status: item.status,
    });
    setIsEditMode(true);
    setEditId(item.id || null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.supplierId || !formData.materialId || !formData.price || !formData.effectiveDate) {
      showNotification('请填写必填字段（供应商、物料、价格、生效日期）', 'error');
      return;
    }

    if (priceIncreaseInfo?.requiresReason && !formData.priceChangeReason) {
      showNotification('涨价幅度超过5%，必须填写涨价原因', 'error');
      return;
    }

    if (formData.priceChangeReason === 'OTHER' && !formData.priceChangeDetail) {
      showNotification('选择"其他"原因时，必须填写原因详情', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (isEditMode && editId) {
        response = await pricingApi.update(editId, formData as any);
      } else {
        response = await pricingApi.create(formData as any);
      }

      if (response.success) {
        showNotification(isEditMode ? '定价更新成功' : '定价创建成功', 'success');
        setShowModal(false);
        resetForm();
        loadPricingList();
      } else {
        showNotification(response.message || (isEditMode ? '更新失败' : '创建失败'), 'error');
      }
    } catch (error) {
      console.error('保存定价失败:', error);
      showNotification('保存定价失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: undefined,
      materialId: undefined,
      price: 0,
      taxRate: 13,
      currency: 'CNY',
      unit: '件',
      effectiveDate: '',
      expiryDate: '',
      minOrderQty: 1,
      status: 'PENDING',
    });
    setIsEditMode(false);
    setEditId(null);
    setShowReasonInput(false);
    setPriceIncreaseInfo(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该定价记录吗？')) return;
    
    try {
      const response = await pricingApi.delete(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除定价失败:', error);
      showNotification('删除失败，请稍后重试', 'error');
    }
  };

  const handleSubmit = async (id: number) => {
    try {
      const response = await pricingApi.submit(id);
      if (response.success) {
        showNotification('已提交审批', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '提交失败', 'error');
      }
    } catch (error) {
      console.error('提交审批失败:', error);
      showNotification('提交失败，请稍后重试', 'error');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await pricingApi.approve(id);
      if (response.success) {
        showNotification(response.message || '审批通过', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '审批失败', 'error');
      }
    } catch (error) {
      console.error('审批失败:', error);
      showNotification('审批失败，请稍后重试', 'error');
    }
  };

  const handleFinanceApprove = async (id: number) => {
    try {
      const response = await pricingApi.financeApprove(id);
      if (response.success) {
        showNotification(response.message || '财务审核通过', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '审核失败', 'error');
      }
    } catch (error) {
      console.error('财务审核失败:', error);
      showNotification('审核失败，请稍后重试', 'error');
    }
  };

  const handleDirectorApprove = async (id: number) => {
    try {
      const response = await pricingApi.directorApprove(id);
      if (response.success) {
        showNotification(response.message || '审批通过', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '审批失败', 'error');
      }
    } catch (error) {
      console.error('总监审批失败:', error);
      showNotification('审批失败，请稍后重试', 'error');
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('请输入驳回原因：');
    if (reason === null) return;
    
    try {
      const response = await pricingApi.reject(id, { reason });
      if (response.success) {
        showNotification('已驳回，状态已改为草稿', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '驳回失败', 'error');
      }
    } catch (error) {
      console.error('驳回失败:', error);
      showNotification('驳回失败，请稍后重试', 'error');
    }
  };

  const handleTerminate = async (id: number) => {
    if (!confirm('确定要终止该定价吗？')) return;
    
    try {
      const response = await pricingApi.terminate(id);
      if (response.success) {
        showNotification('已终止定价', 'success');
        loadPricingList();
      } else {
        showNotification(response.message || '终止失败', 'error');
      }
    } catch (error) {
      console.error('终止定价失败:', error);
      showNotification('终止失败，请稍后重试', 'error');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">定价管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>业务管理</span>
              <span>/</span>
              <span>定价管理</span>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsEditMode(false);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fas fa-plus"></i>
            新增定价
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
                placeholder="搜索定价编号..."
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
              <option value="PENDING">待审批</option>
              <option value="FINANCE_PENDING">待财务审核</option>
              <option value="DIRECTOR_PENDING">待总监审批</option>
              <option value="ACTIVE">已生效</option>
              <option value="EXPIRED">已过期</option>
            </select>
            <button 
              onClick={loadPricingList}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
            >
              <i className="fas fa-filter"></i>
              筛选
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">定价编号</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">供应商</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">物料</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">价格</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">税率</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">生效日期</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">状态</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && pricingList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </td>
                  </tr>
                ) : pricingList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  pricingList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.code}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.supplierName || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.materialName || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        {item.currency || '¥'}{Number(item.price || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.taxRate || 13}%</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.effectiveDate || '-'}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button 
                            onClick={() => handleView(item)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            title="查看详情"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {(item.status === 'DRAFT' || item.status === 'PENDING') && (
                            <button 
                              onClick={() => handleEdit(item)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                              title="编辑"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {item.status === 'DRAFT' && (
                            <button 
                              onClick={() => item.id && handleSubmit(item.id)}
                              className="h-8 px-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg flex items-center gap-1"
                              title="提交审批"
                            >
                              <i className="fas fa-paper-plane"></i>
                              提交
                            </button>
                          )}
                          {item.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => item.id && handleApprove(item.id)}
                                className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg flex items-center gap-1"
                                title="审批通过"
                              >
                                <i className="fas fa-check"></i>
                                审批
                              </button>
                              <button 
                                onClick={() => item.id && handleReject(item.id)}
                                className="h-8 px-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg flex items-center gap-1"
                                title="驳回"
                              >
                                <i className="fas fa-times"></i>
                                驳回
                              </button>
                            </>
                          )}
                          {item.status === 'FINANCE_PENDING' && (
                            <>
                              <button 
                                onClick={() => item.id && handleFinanceApprove(item.id)}
                                className="h-8 px-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg flex items-center gap-1"
                                title="财务审核通过"
                              >
                                <i className="fas fa-check"></i>
                                财务审核
                              </button>
                              <button 
                                onClick={() => item.id && handleReject(item.id)}
                                className="h-8 px-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg flex items-center gap-1"
                                title="驳回"
                              >
                                <i className="fas fa-times"></i>
                                驳回
                              </button>
                            </>
                          )}
                          {item.status === 'DIRECTOR_PENDING' && (
                            <>
                              <button 
                                onClick={() => item.id && handleDirectorApprove(item.id)}
                                className="h-8 px-2 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg flex items-center gap-1"
                                title="总监审批通过"
                              >
                                <i className="fas fa-check"></i>
                                总监审批
                              </button>
                              <button 
                                onClick={() => item.id && handleReject(item.id)}
                                className="h-8 px-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg flex items-center gap-1"
                                title="驳回"
                              >
                                <i className="fas fa-times"></i>
                                驳回
                              </button>
                            </>
                          )}
                          {item.status === 'ACTIVE' && (
                            <button 
                              onClick={() => item.id && handleTerminate(item.id)}
                              className="h-8 px-2 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg flex items-center gap-1"
                              title="终止定价"
                            >
                              <i className="fas fa-stop-circle"></i>
                              终止
                            </button>
                          )}
                          {item.status === 'DRAFT' && (
                            <button 
                              onClick={() => item.id && handleDelete(item.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                              title="删除"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn overflow-y-auto py-8">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑定价' : '新增定价'}</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">供应商 *</label>
                    <select
                      name="supplierId"
                      value={formData.supplierId || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">请选择供应商</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">物料 *</label>
                    <select
                      name="materialId"
                      value={formData.materialId || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">请选择物料</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">价格 *</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="请输入价格"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">税率 (%)</label>
                    <select
                      name="taxRate"
                      value={formData.taxRate || 13}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value={0}>0%</option>
                      <option value={6}>6%</option>
                      <option value={13}>13%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">含税单价</label>
                    <input
                      type="text"
                      value={formData.price && formData.taxRate 
                        ? (formData.price * (1 + formData.taxRate / 100)).toFixed(2) 
                        : '-'}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">单位</label>
                    <input
                      type="text"
                      name="unit"
                      placeholder="如：件、套、桶"
                      value={formData.unit || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最小起订量</label>
                    <input
                      type="number"
                      name="minOrderQty"
                      value={formData.minOrderQty || 1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">交货周期（天）</label>
                    <input
                      type="number"
                      name="deliveryCycle"
                      placeholder="交货天数"
                      value={formData.deliveryCycle || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">生效日期 *</label>
                    <input
                      type="date"
                      name="effectiveDate"
                      value={formData.effectiveDate || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">到期日期</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">价格条款</label>
                    <input
                      type="text"
                      name="priceTerms"
                      placeholder="如：FOB、CIF"
                      value={formData.priceTerms || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">付款条款</label>
                    <input
                      type="text"
                      name="paymentTerms"
                      placeholder="如：30天账期"
                      value={formData.paymentTerms || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>

                  {priceIncreaseInfo && priceIncreaseInfo.hasCurrentPrice && (
                    <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <i className="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
                        <div className="flex-1">
                          <div className="font-medium text-yellow-800 mb-2">
                            涨价幅度预警
                          </div>
                          <div className="text-sm text-yellow-700 space-y-1">
                            <div>当前生效价格：¥{priceIncreaseInfo.originalPrice?.toLocaleString()}</div>
                            <div>新价格：¥{priceIncreaseInfo.newPrice?.toLocaleString()}</div>
                            <div className="font-bold">
                              涨价幅度：{priceIncreaseInfo.priceIncreaseRate?.toFixed(2)}%
                            </div>
                            {priceIncreaseInfo.requiresReason && (
                              <div className="text-red-600 font-medium mt-2">
                                ⚠️ 涨价幅度超过5%，必须填写涨价原因
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showReasonInput && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        涨价原因 * <span className="text-red-500">（涨价超过5%必填）</span>
                      </label>
                      <select
                        name="priceChangeReason"
                        value={formData.priceChangeReason || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                      >
                        <option value="">请选择涨价原因</option>
                        <option value="RAW_MATERIAL">原材料上涨</option>
                        <option value="LABOR_COST">人工成本上涨</option>
                        <option value="EXCHANGE_RATE">汇率调整</option>
                        <option value="SUPPLIER_ADJUST">供应商调整</option>
                        <option value="MARKET">市场行情</option>
                        <option value="OTHER">其他</option>
                      </select>
                    </div>
                  )}

                  {showReasonInput && formData.priceChangeReason === 'OTHER' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        原因详情 * <span className="text-red-500">（选择"其他"时必填）</span>
                      </label>
                      <textarea
                        name="priceChangeDetail"
                        placeholder="请详细说明涨价原因"
                        value={formData.priceChangeDetail || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                    <textarea
                      name="remark"
                      placeholder="请输入备注"
                      value={formData.remark || ''}
                      onChange={handleInputChange}
                      rows={3}
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

        {showDetailModal && currentPricing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">定价详情</h2>
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
                      <i className="fas fa-tag text-weyeah-blue"></i>
                      基本信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">定价编号</div>
                        <div className="font-medium text-gray-900">{currentPricing.code || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">供应商</div>
                        <div className="font-medium text-gray-900">{currentPricing.supplierName || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">物料</div>
                        <div className="font-medium text-gray-900">{currentPricing.materialName || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">状态</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(currentPricing.status)}`}>
                            {getStatusText(currentPricing.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-money-bill text-weyeah-blue"></i>
                      价格信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">价格（不含税）</div>
                        <div className="font-medium text-xl text-gray-900">
                          {currentPricing.currency || '¥'}{Number(currentPricing.price || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">税率</div>
                        <div className="font-medium text-gray-900">{currentPricing.taxRate || 13}%</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">含税单价</div>
                        <div className="font-medium text-xl text-gray-900">
                          {currentPricing.currency || '¥'}{Number(currentPricing.priceWithTax || (currentPricing.price || 0) * 1.13).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">单位</div>
                        <div className="font-medium text-gray-900">{currentPricing.unit || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">最小起订量</div>
                        <div className="font-medium text-gray-900">{currentPricing.minOrderQty || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">交货周期</div>
                        <div className="font-medium text-gray-900">{currentPricing.deliveryCycle ? `${currentPricing.deliveryCycle}天` : '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">生效日期</div>
                        <div className="font-medium text-gray-900">{currentPricing.effectiveDate || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">到期日期</div>
                        <div className="font-medium text-gray-900">{currentPricing.expiryDate || '长期有效'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">价格条款</div>
                        <div className="font-medium text-gray-900">{currentPricing.priceTerms || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">付款条款</div>
                        <div className="font-medium text-gray-900">{currentPricing.paymentTerms || '-'}</div>
                      </div>
                    </div>
                  </div>

                  {currentPricing.priceIncreaseRate && currentPricing.priceIncreaseRate > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-chart-line text-weyeah-blue"></i>
                        价格变更信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">原价</div>
                          <div className="font-medium text-gray-900">
                            ¥{Number(currentPricing.originalPrice || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">涨价幅度</div>
                          <div className="font-medium text-yellow-700">
                            +{currentPricing.priceIncreaseRate.toFixed(2)}%
                          </div>
                        </div>
                        {currentPricing.priceChangeReason && (
                          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">涨价原因</div>
                            <div className="font-medium text-gray-900">{currentPricing.priceChangeReason}</div>
                            {currentPricing.priceChangeDetail && (
                              <div className="mt-2 text-sm text-gray-600">{currentPricing.priceChangeDetail}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentPricing.remark && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-file-text text-weyeah-blue"></i>
                        备注
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium text-gray-900">{currentPricing.remark}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end flex-shrink-0">
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
