import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Logistics, Contract } from '../types';
import { logisticsApi } from '../services/logistics';
import { contractApi } from '../services/contract';

interface LogisticsPageProps {
  onLogout: () => void;
}

export default function LogisticsPage({ onLogout }: LogisticsPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentLogistics, setCurrentLogistics] = useState<Logistics | null>(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logisticsList, setLogisticsList] = useState<Logistics[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [shipModalVisible, setShipModalVisible] = useState(false);
  const [shipData, setShipData] = useState({ logisticsNo: '', logisticsCompany: '', currentLocation: '' });
  const [filterContractId, setFilterContractId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Logistics>>({
    contractId: 0,
    warehouse: '',
    deliveryAddress: '',
    receiverName: '',
    receiverContact: '',
    receiverPhone: '',
    receiverAddress: '',
    estimatedDeliveryDate: '',
    remark: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contractId = params.get('contractId');
    if (contractId) {
      setFilterContractId(parseInt(contractId));
    }
  }, []);

  useEffect(() => {
    loadLogistics();
    loadContracts();
  }, [currentPage, keyword, statusFilter, filterContractId]);

  const loadContracts = async () => {
    try {
      const response = await contractApi.getList({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        setContracts(response.data.list || []);
      }
    } catch (error) {
      console.error('加载合同列表失败:', error);
    }
  };

  const loadLogistics = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (statusFilter) params.status = statusFilter;
      if (filterContractId) params.contractId = filterContractId;

      const response = await logisticsApi.getList(params);
      if (response.success && response.data) {
        setLogisticsList(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载物流列表失败:', error);
      showNotification('加载物流列表失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'PENDING': '待发货',
      'SHIPPED': '已发货',
      'IN_TRANSIT': '运输中',
      'ARRIVED': '已到货',
      'DELIVERED': '已签收',
      'EXCEPTION': '异常',
    };
    return map[status || ''] || status || '-';
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'SHIPPED': 'bg-blue-100 text-blue-700',
      'IN_TRANSIT': 'bg-purple-100 text-purple-700',
      'ARRIVED': 'bg-green-100 text-green-700',
      'DELIVERED': 'bg-teal-100 text-teal-700',
      'EXCEPTION': 'bg-red-100 text-red-700',
    };
    return map[status || ''] || 'bg-gray-100 text-gray-700';
  };

  const getContractName = (contractId: number) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.code : `合同#${contractId}`;
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
    if (!formData.contractId || formData.contractId === 0) {
      showNotification('请选择关联合同', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && editId) {
        const response = await logisticsApi.update(editId, formData);
        if (response.success) {
          showNotification('物流记录更新成功', 'success');
          setShowModal(false);
          resetForm();
          loadLogistics();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        const contract = contracts.find(c => c.id === formData.contractId);
        const dataToSave = {
          ...formData,
          contractCode: contract?.code,
        };
        const response = await logisticsApi.create(dataToSave as Logistics);
        if (response.success) {
          showNotification('物流记录创建成功', 'success');
          setShowModal(false);
          resetForm();
          loadLogistics();
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
      contractId: 0,
      warehouse: '',
      deliveryAddress: '',
      receiverName: '',
      receiverContact: '',
      receiverPhone: '',
      receiverAddress: '',
      estimatedDeliveryDate: '',
      remark: '',
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleView = async (logistics: Logistics) => {
    try {
      const response = await logisticsApi.getById(logistics.id!);
      if (response.success && response.data) {
        setCurrentLogistics(response.data);
        setShowDetailModal(true);
      } else {
        showNotification(response.message || '获取详情失败', 'error');
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      showNotification('获取详情失败，请稍后重试', 'error');
    }
  };

  const handleShip = async () => {
    if (!currentLogistics) return;
    
    setIsLoading(true);
    try {
      const response = await logisticsApi.ship(currentLogistics.id!, shipData);
      if (response.success) {
        showNotification('发货确认成功', 'success');
        setShipModalVisible(false);
        setCurrentLogistics(null);
        setShowDetailModal(false);
        loadLogistics();
      } else {
        showNotification(response.message || '发货确认失败', 'error');
      }
    } catch (error) {
      console.error('发货确认失败:', error);
      showNotification('发货确认失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrive = async (logistics: Logistics) => {
    if (!confirm('确认该物流已到货？')) return;
    
    setIsLoading(true);
    try {
      const response = await logisticsApi.arrive(logistics.id!);
      if (response.success) {
        showNotification('到货确认成功', 'success');
        loadLogistics();
      } else {
        showNotification(response.message || '到货确认失败', 'error');
      }
    } catch (error) {
      console.error('到货确认失败:', error);
      showNotification('到货确认失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该物流记录吗？')) return;
    
    try {
      const response = await logisticsApi.delete(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadLogistics();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除物流记录失败:', error);
      showNotification('删除失败，请稍后重试', 'error');
    }
  };

  const openShipModal = (logistics: Logistics) => {
    setCurrentLogistics(logistics);
    setShipData({
      logisticsNo: '',
      logisticsCompany: '',
      currentLocation: '',
    });
    setShipModalVisible(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">物流管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>业务管理</span>
              <span>/</span>
              <span>物流管理</span>
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
            新增物流
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
                placeholder="搜索物流编号、合同编号..."
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
              <option value="PENDING">待发货</option>
              <option value="SHIPPED">已发货</option>
              <option value="IN_TRANSIT">运输中</option>
              <option value="ARRIVED">已到货</option>
              <option value="DELIVERED">已签收</option>
            </select>
            <button 
              onClick={loadLogistics}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">物流编号</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">关联合同</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">物流单号</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">物流公司</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">目的地仓库</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">预计到货</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && logisticsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </td>
                  </tr>
                ) : logisticsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  logisticsList.map((logistics) => (
                    <tr key={logistics.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{logistics.code || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getContractName(logistics.contractId || 0)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{logistics.logisticsNo || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{logistics.logisticsCompany || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{logistics.warehouse || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{logistics.estimatedDeliveryDate || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(logistics.status || '')}`}>
                          {getStatusText(logistics.status || '')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(logistics)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            title="查看详情"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {logistics.status === 'PENDING' && (
                            <button 
                              onClick={() => openShipModal(logistics)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-green-600"
                              title="发货确认"
                            >
                              <i className="fas fa-truck"></i>
                            </button>
                          )}
                          {logistics.status === 'SHIPPED' && (
                            <button 
                              onClick={() => handleArrive(logistics)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-green-600"
                              title="到货确认"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setFormData(logistics);
                              setIsEditMode(true);
                              setEditId(logistics.id || null);
                              setShowModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            title="编辑"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => logistics.id && handleDelete(logistics.id)}
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
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑物流' : '新增物流'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">关联合同 *</label>
                    <select
                      name="contractId"
                      value={formData.contractId || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">请选择合同</option>
                      {contracts.map(contract => (
                        <option key={contract.id} value={contract.id}>
                          {contract.code} - {contract.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目的地仓库</label>
                    <select
                      name="warehouse"
                      value={formData.warehouse || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">请选择仓库</option>
                      <option value="香港仓库">香港仓库</option>
                      <option value="中国仓库">中国仓库</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">预计到货日期</label>
                    <input
                      type="date"
                      name="estimatedDeliveryDate"
                      value={formData.estimatedDeliveryDate || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">交货地址</label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress || ''}
                      onChange={handleInputChange}
                      placeholder="请输入详细交货地址"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">收货人</label>
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName || ''}
                      onChange={handleInputChange}
                      placeholder="请输入收货人姓名"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                    <input
                      type="text"
                      name="receiverPhone"
                      value={formData.receiverPhone || ''}
                      onChange={handleInputChange}
                      placeholder="请输入联系电话"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">收货地址</label>
                    <input
                      type="text"
                      name="receiverAddress"
                      value={formData.receiverAddress || ''}
                      onChange={handleInputChange}
                      placeholder="请输入详细收货地址"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                    <textarea
                      name="remark"
                      value={formData.remark || ''}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="请输入备注信息"
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

        {shipModalVisible && currentLogistics && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">发货确认</h2>
                <button
                  onClick={() => setShipModalVisible(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">物流单号 *</label>
                    <input
                      type="text"
                      value={shipData.logisticsNo}
                      onChange={(e) => setShipData(prev => ({ ...prev, logisticsNo: e.target.value }))}
                      placeholder="请输入物流单号"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">物流公司 *</label>
                    <select
                      value={shipData.logisticsCompany}
                      onChange={(e) => setShipData(prev => ({ ...prev, logisticsCompany: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">请选择物流公司</option>
                      <option value="顺丰速运">顺丰速运</option>
                      <option value="中通快递">中通快递</option>
                      <option value="圆通速递">圆通速递</option>
                      <option value="韵达快递">韵达快递</option>
                      <option value="申通快递">申通快递</option>
                      <option value="德邦物流">德邦物流</option>
                      <option value="安能物流">安能物流</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">当前地点</label>
                    <input
                      type="text"
                      value={shipData.currentLocation}
                      onChange={(e) => setShipData(prev => ({ ...prev, currentLocation: e.target.value }))}
                      placeholder="请输入当前位置"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShipModalVisible(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleShip}
                  disabled={isLoading || !shipData.logisticsNo || !shipData.logisticsCompany}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                  确认发货
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailModal && currentLogistics && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">物流详情</h2>
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
                      <i className="fas fa-truck text-weyeah-blue"></i>
                      基本信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">物流编号</div>
                        <div className="font-medium text-gray-900">{currentLogistics.code || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">状态</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(currentLogistics.status || '')}`}>
                            {getStatusText(currentLogistics.status || '')}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">关联合同</div>
                        <div className="font-medium text-gray-900">{currentLogistics.contractCode || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">目的地仓库</div>
                        <div className="font-medium text-gray-900">{currentLogistics.warehouse || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-shipping-fast text-weyeah-blue"></i>
                      物流信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">物流单号</div>
                        <div className="font-medium text-gray-900">{currentLogistics.logisticsNo || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">物流公司</div>
                        <div className="font-medium text-gray-900">{currentLogistics.logisticsCompany || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">当前地点</div>
                        <div className="font-medium text-gray-900">{currentLogistics.currentLocation || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">交货地址</div>
                        <div className="font-medium text-gray-900">{currentLogistics.deliveryAddress || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-calendar-alt text-weyeah-blue"></i>
                      时间信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">预计到货</div>
                        <div className="font-medium text-gray-900">{currentLogistics.estimatedDeliveryDate || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">实际发货</div>
                        <div className="font-medium text-gray-900">{currentLogistics.actualDeliveryDate || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">实际到货</div>
                        <div className="font-medium text-gray-900">{currentLogistics.actualArrivalDate || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-user text-weyeah-blue"></i>
                      收货人信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">收货人</div>
                        <div className="font-medium text-gray-900">{currentLogistics.receiverName || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">联系电话</div>
                        <div className="font-medium text-gray-900">{currentLogistics.receiverPhone || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                        <div className="text-sm text-gray-500 mb-1">收货地址</div>
                        <div className="font-medium text-gray-900">{currentLogistics.receiverAddress || '-'}</div>
                      </div>
                    </div>
                  </div>

                  {currentLogistics.trackingInfo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-history text-weyeah-blue"></i>
                        物流轨迹
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">{currentLogistics.trackingInfo}</pre>
                      </div>
                    </div>
                  )}

                  {currentLogistics.remark && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-sticky-note text-weyeah-blue"></i>
                        备注
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-700">{currentLogistics.remark}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
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
