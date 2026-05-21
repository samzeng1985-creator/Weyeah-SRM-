import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { ContractItem } from '../types';
import { contractApi } from '../services/contract';

interface ContractsPageProps {
  onLogout: () => void;
}

export default function ContractsPage({ onLogout }: ContractsPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [currentContract, setCurrentContract] = useState<any>(null);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);
  const [itemForm, setItemForm] = useState<any>({
    materialId: undefined,
    quantity: undefined,
    unit: '',
    unitPrice: undefined,
    taxRate: 13,
    deliveryDate: '',
    remark: '',
  });

  const [formData, setFormData] = useState<any>({
    name: '',
    type: '采购合同',
    supplierId: undefined,
    startDate: '',
    endDate: '',
    currency: 'CNY',
    paymentTerms: '',
    confidentialityScope: '',
    confidentialityPeriod: undefined,
    confidentialityObligations: '',
    liabilityForBreach: '',
    disputeResolution: '',
    governingLaw: '中国',
    purchaseOrderNo: '',
    warehouse: '',
    deliveryAddress: '',
    deliveryMethod: '',
    qualityRequirements: '',
    acceptanceCriteria: '',
    warrantyPeriod: undefined,
    penaltyRate: undefined,
    drawingNo: '',
    drawingVersion: '',
    processingRequirements: '',
    materialRequirements: '',
    qualityMonitoring: '',
    intellectualProperty: '',
  });

  useEffect(() => {
    loadContracts();
    loadSuppliers();
    loadMaterials();
  }, [currentPage, keyword, typeFilter, statusFilter]);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const params: any = { page: currentPage, pageSize };
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

  const loadSuppliers = async () => {
    try {
      const response = await contractApi.getActiveSuppliers();
      if (response.success) {
        setSuppliers(response.data || []);
      }
    } catch (error) {
      console.error('加载供应商失败:', error);
    }
  };

  const loadMaterials = async () => {
    try {
      const response = await contractApi.getActiveMaterials();
      if (response.success) {
        setMaterials(response.data || []);
      }
    } catch (error) {
      console.error('加载物料失败:', error);
    }
  };

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      'NDA': 'NDA保密协议',
      'NDA保密协议': 'NDA保密协议',
      '采购合同': '采购合同',
      '委托加工': '委托加工',
    };
    return map[type] || type || '未知';
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: '草稿',
      PENDING: '审批中',
      APPROVED: '已批准',
      REJECTED: '已拒绝',
      SIGNED: '已签署',
      ACTIVE: '已生效',
      EXECUTING: '执行中',
      COMPLETED: '已完成',
      EXPIRED: '已过期',
      TERMINATED: '已终止',
    };
    return map[status] || status || '未知';
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-blue-100 text-blue-700',
      REJECTED: 'bg-red-100 text-red-700',
      SIGNED: 'bg-purple-100 text-purple-700',
      ACTIVE: 'bg-green-100 text-green-700',
      EXECUTING: 'bg-indigo-100 text-indigo-700',
      COMPLETED: 'bg-teal-100 text-teal-700',
      EXPIRED: 'bg-orange-100 text-orange-700',
      TERMINATED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
    if (!formData.name || !formData.supplierId || !formData.startDate) {
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
    } catch (error: any) {
      console.error('操作失败:', error);
      showNotification(error.response?.data?.message || '操作失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '采购合同',
      supplierId: undefined,
      startDate: '',
      endDate: '',
      currency: 'CNY',
      paymentTerms: '',
      confidentialityScope: '',
      confidentialityPeriod: undefined,
      confidentialityObligations: '',
      liabilityForBreach: '',
      disputeResolution: '',
      governingLaw: '中国',
      purchaseOrderNo: '',
      warehouse: '',
      deliveryAddress: '',
      deliveryMethod: '',
      qualityRequirements: '',
      acceptanceCriteria: '',
      warrantyPeriod: undefined,
      penaltyRate: undefined,
      drawingNo: '',
      drawingVersion: '',
      processingRequirements: '',
      materialRequirements: '',
      qualityMonitoring: '',
      intellectualProperty: '',
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleView = async (contract: any) => {
    try {
      const response = await contractApi.getById(contract.id);
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

  const handleEdit = async (contract: any) => {
    try {
      const response = await contractApi.getById(contract.id);
      if (response.success && response.data) {
        setFormData(response.data);
        setIsEditMode(true);
        setEditId(contract.id);
        setShowModal(true);
      }
    } catch (error) {
      showNotification('获取合同信息失败', 'error');
    }
  };

  const handleStatusChange = async (id: number, action: string) => {
    setIsLoading(true);
    try {
      let response;
      switch (action) {
        case 'submit':
          response = await contractApi.submit(id);
          break;
        case 'approve':
          response = await contractApi.approve(id);
          break;
        case 'reject':
          response = await contractApi.reject(id);
          break;
        case 'sign':
          response = await contractApi.sign(id);
          break;
        case 'activate':
          response = await contractApi.activate(id);
          break;
        case 'startExecute':
          response = await contractApi.startExecute(id);
          break;
        case 'complete':
          response = await contractApi.complete(id);
          break;
        case 'terminate':
          response = await contractApi.terminate(id);
          break;
      }
      
      if (response?.success) {
        showNotification('操作成功', 'success');
        loadContracts();
        if (showDetailModal && currentContract) {
          const detailRes = await contractApi.getById(currentContract.id);
          if (detailRes.success) {
            setCurrentContract(detailRes.data);
          }
        }
      } else {
        showNotification(response?.message || '操作失败', 'error');
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || '操作失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageItems = async (contract: any) => {
    try {
      const response = await contractApi.getById(contract.id);
      if (response.success && response.data) {
        setCurrentContract(response.data);
        setContractItems(response.data.items || []);
        setShowItemsModal(true);
      }
    } catch (error) {
      showNotification('获取合同明细失败', 'error');
    }
  };

  const handleAddItem = async () => {
    if (!itemForm.materialId || !itemForm.quantity || !itemForm.unitPrice) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    try {
      const response = await contractApi.addItem(currentContract.id, itemForm);
      if (response.success) {
        showNotification('添加成功', 'success');
        const detailRes = await contractApi.getById(currentContract.id);
        if (detailRes.success) {
          setContractItems(detailRes.data.items || []);
        }
        setItemForm({
          materialId: undefined,
          quantity: undefined,
          unit: '',
          unitPrice: undefined,
          taxRate: 13,
          deliveryDate: '',
          remark: '',
        });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || '添加失败', 'error');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('确定要删除该明细吗？')) return;
    
    try {
      const response = await contractApi.deleteItem(currentContract.id, itemId);
      if (response.success) {
        showNotification('删除成功', 'success');
        const detailRes = await contractApi.getById(currentContract.id);
        if (detailRes.success) {
          setContractItems(detailRes.data.items || []);
        }
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || '删除失败', 'error');
    }
  };

  const handleMaterialSelect = (materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setItemForm(prev => ({
        ...prev,
        materialId,
        unit: material.unit || '',
      }));
    }
  };

  const calculateItemTotal = (item: any) => {
    const qty = item.quantity || 0;
    const price = item.unitPrice || 0;
    return qty * price;
  };

  const handleExportPDF = async (contract: any) => {
    try {
      const response = await contractApi.getById(contract.id);
      if (response.success && response.data) {
        const c = response.data;
        
        let specificFields = '';
        if (c.type === 'NDA保密协议') {
          specificFields = `
            <h3 style="margin-top: 16px;">保密条款</h3>
            <p><strong>保密范围：</strong>${c.confidentialityScope || '-'}</p>
            <p><strong>保密期限：</strong>${c.confidentialityPeriod || '-'} 年</p>
            <p><strong>保密义务：</strong>${c.confidentialityObligations || '-'}</p>
            <p><strong>违约责任：</strong>${c.liabilityForBreach || '-'}</p>
            <p><strong>争议解决：</strong>${c.disputeResolution || '-'}</p>
            <p><strong>适用法律：</strong>${c.governingLaw || '-'}</p>
          `;
        } else if (c.type === '采购合同') {
          specificFields = `
            <h3 style="margin-top: 16px;">采购条款</h3>
            <p><strong>采购订单号：</strong>${c.purchaseOrderNo || '-'}</p>
            <p><strong>交货地址：</strong>${c.deliveryAddress || '-'}</p>
            <p><strong>交货方式：</strong>${c.deliveryMethod || '-'}</p>
            <p><strong>质量要求：</strong>${c.qualityRequirements || '-'}</p>
            <p><strong>验收标准：</strong>${c.acceptanceCriteria || '-'}</p>
            <p><strong>质保期：</strong>${c.warrantyPeriod || '-'} 个月</p>
            <p><strong>违约金比例：</strong>${c.penaltyRate || '-'}%</p>
          `;
        } else if (c.type === '委托加工') {
          specificFields = `
            <h3 style="margin-top: 16px;">委托加工条款</h3>
            <p><strong>图纸编号：</strong>${c.drawingNo || '-'}</p>
            <p><strong>图纸版本：</strong>${c.drawingVersion || '-'}</p>
            <p><strong>加工要求：</strong>${c.processingRequirements || '-'}</p>
            <p><strong>来料要求：</strong>${c.materialRequirements || '-'}</p>
            <p><strong>质量监控：</strong>${c.qualityMonitoring || '-'}</p>
            <p><strong>知识产权：</strong>${c.intellectualProperty || '-'}</p>
          `;
        }

        let itemsHtml = '';
        if (c.items && c.items.length > 0) {
          itemsHtml = `
            <h3 style="margin-top: 16px;">合同明细</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">序号</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">物料编码</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">物料名称</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">数量</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">单价</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">合计</th>
                </tr>
              </thead>
              <tbody>
                ${c.items.map((item: any, index: number) => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${index + 1}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.materialCode || '-'}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.materialName || '-'}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.quantity || 0} ${item.unit || ''}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">¥${Number(item.unitPrice || 0).toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">¥${Number(calculateItemTotal(item)).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }

        const pdfContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${c.code} - ${c.name}</title>
  <style>
    body { font-family: 'SimHei', 'Microsoft YaHei', sans-serif; margin: 40px; font-size: 14px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 24px; }
    h2 { font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
    .info-row { display: flex; margin-bottom: 8px; }
    .info-label { width: 100px; font-weight: 600; }
    .info-value { flex: 1; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { padding: 8px; border: 1px solid #e5e7eb; }
    th { background-color: #f3f4f6; }
    .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${getTypeText(c.type)}</h1>
  
  <h2>基本信息</h2>
  <div class="info-row"><span class="info-label">合同编号：</span><span class="info-value">${c.code || '-'}</span></div>
  <div class="info-row"><span class="info-label">合同名称：</span><span class="info-value">${c.name || '-'}</span></div>
  <div class="info-row"><span class="info-label">供应商：</span><span class="info-value">${c.supplierName || '-'}</span></div>
  <div class="info-row"><span class="info-label">合同金额：</span><span class="info-value">¥${Number(c.amount || 0).toLocaleString()}</span></div>
  <div class="info-row"><span class="info-label">开始日期：</span><span class="info-value">${c.startDate || '-'}</span></div>
  <div class="info-row"><span class="info-label">结束日期：</span><span class="info-value">${c.endDate || '-'}</span></div>
  <div class="info-row"><span class="info-label">付款条款：</span><span class="info-value">${c.paymentTerms || '-'}</span></div>
  <div class="info-row"><span class="info-label">状态：</span><span class="info-value">${getStatusText(c.status)}</span></div>
  
  ${specificFields}
  ${itemsHtml}
  
  <div class="footer">
    <p>供应商关系管理系统 (SRM)</p>
    <p>生成时间：${new Date().toLocaleString('zh-CN')}</p>
  </div>
</body>
</html>`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(pdfContent);
          printWindow.document.close();
          printWindow.print();
        }
        
        showNotification('PDF导出成功', 'success');
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
    } catch (error: any) {
      showNotification(error.response?.data?.message || '删除失败', 'error');
    }
  };

  const getNextActions = (status: string) => {
    const actions: Record<string, { label: string; action: string; class: string }[]> = {
      DRAFT: [{ label: '提交审批', action: 'submit', class: 'bg-blue-500 hover:bg-blue-600' }],
      PENDING: [
        { label: '审批通过', action: 'approve', class: 'bg-green-500 hover:bg-green-600' },
        { label: '审批拒绝', action: 'reject', class: 'bg-red-500 hover:bg-red-600' },
      ],
      APPROVED: [{ label: '签署完成', action: 'sign', class: 'bg-purple-500 hover:bg-purple-600' }],
      SIGNED: [{ label: '合同生效', action: 'activate', class: 'bg-teal-500 hover:bg-teal-600' }],
      ACTIVE: [{ label: '开始执行', action: 'startExecute', class: 'bg-indigo-500 hover:bg-indigo-600' }],
      EXECUTING: [{ label: '完成合同', action: 'complete', class: 'bg-cyan-500 hover:bg-cyan-600' }],
    };
    return actions[status] || [];
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const contractTypeOptions = [
    { value: '采购合同', label: '采购合同' },
    { value: 'NDA保密协议', label: 'NDA保密协议' },
    { value: '委托加工', label: '委托加工' },
  ];

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
            onClick={() => { resetForm(); setShowModal(true); }}
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
                placeholder="搜索合同编号、名称..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue transition-all"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
            >
              <option value="">全部类型</option>
              <option value="采购合同">采购合同</option>
              <option value="NDA保密协议">NDA保密协议</option>
              <option value="委托加工">委托加工</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
            >
              <option value="">全部状态</option>
              <option value="DRAFT">草稿</option>
              <option value="PENDING">审批中</option>
              <option value="APPROVED">已批准</option>
              <option value="ACTIVE">已生效</option>
              <option value="EXECUTING">执行中</option>
              <option value="COMPLETED">已完成</option>
              <option value="TERMINATED">已终止</option>
            </select>
            <button onClick={loadContracts} className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2">
              <i className="fas fa-sync"></i>
              刷新
            </button>
          </div>
        </div>

        {isLoading && contracts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <i className="fas fa-file-contract text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 mb-4">暂无合同数据</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2 mx-auto"
            >
              <i className="fas fa-plus"></i>
              新增合同
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{contract.code}</div>
                    <div className="font-semibold text-gray-900 text-lg">{contract.name}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-building text-gray-400 w-5 mt-0.5"></i>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-500">供应商：</span>
                      <span className="text-gray-900">{contract.supplierName || '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-tag text-gray-400 w-5"></i>
                    <span className="text-gray-500">类型：</span>
                    <span className="text-gray-900">{getTypeText(contract.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-yen-sign text-gray-400 w-5"></i>
                    <span className="text-gray-500">金额：</span>
                    <span className="text-gray-900 font-semibold">{contract.amount ? `¥${Number(contract.amount).toLocaleString()}` : '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fas fa-calendar text-gray-400 w-5 mt-0.5"></i>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-500">有效期：</span>
                      <span className="text-gray-900">
                        {contract.startDate?.slice(0, 10)} ~ {contract.endDate?.slice(0, 10) || '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleView(contract)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-eye"></i>
                    查看
                  </button>
                  {contract.status === 'DRAFT' && (
                    <button
                      onClick={() => handleEdit(contract)}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-edit"></i>
                      编辑
                    </button>
                  )}
                  {(contract.status === 'DRAFT' || contract.status === 'REJECTED') && (
                    <button
                      onClick={() => handleManageItems(contract)}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-list"></i>
                      明细
                    </button>
                  )}
                  <button
                    onClick={() => handleExportPDF(contract)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-file-pdf"></i>
                    PDF
                  </button>
                  {contract.status === 'DRAFT' && (
                    <button
                      onClick={() => handleDelete(contract.id)}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-trash"></i>
                      删除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {contracts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between">
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
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑合同' : '新增合同'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">合同名称 *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="请输入合同名称"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">合同类型 *</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      >
                        {contractTypeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">供应商 *</label>
                      <select
                        name="supplierId"
                        value={formData.supplierId || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, supplierId: Number(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      >
                        <option value="">请选择供应商</option>
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">开始日期 *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">付款条款</label>
                      <input
                        type="text"
                        name="paymentTerms"
                        value={formData.paymentTerms || ''}
                        onChange={handleInputChange}
                        placeholder="如：货到付款、30%预付款+70%到货款等"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      />
                    </div>
                  </div>
                </div>

                {formData.type === 'NDA保密协议' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-lock text-weyeah-blue"></i>
                      保密条款
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">保密范围</label>
                        <textarea
                          name="confidentialityScope"
                          value={formData.confidentialityScope || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述保密信息的范围"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">保密期限（年）</label>
                        <input
                          type="number"
                          name="confidentialityPeriod"
                          value={formData.confidentialityPeriod || ''}
                          onChange={handleInputChange}
                          placeholder="如：3"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">保密义务</label>
                        <textarea
                          name="confidentialityObligations"
                          value={formData.confidentialityObligations || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述双方的保密义务"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">违约责任</label>
                        <textarea
                          name="liabilityForBreach"
                          value={formData.liabilityForBreach || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述违约责任条款"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">争议解决</label>
                        <input
                          type="text"
                          name="disputeResolution"
                          value={formData.disputeResolution || ''}
                          onChange={handleInputChange}
                          placeholder="如：提交甲方所在地人民法院管辖"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">适用法律</label>
                        <input
                          type="text"
                          name="governingLaw"
                          value={formData.governingLaw || '中国'}
                          onChange={handleInputChange}
                          placeholder="如：中国法律"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(formData.type === '采购合同' || formData.type === '委托加工') && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-shopping-cart text-weyeah-blue"></i>
                      采购/交付条款
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.type === '采购合同' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">采购订单号</label>
                            <input
                              type="text"
                              name="purchaseOrderNo"
                              value={formData.purchaseOrderNo || ''}
                              onChange={handleInputChange}
                              placeholder="请输入采购订单号"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">仓库</label>
                            <input
                              type="text"
                              name="warehouse"
                              value={formData.warehouse || ''}
                              onChange={handleInputChange}
                              placeholder="请输入仓库名称"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                            />
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">交货地址</label>
                        <input
                          type="text"
                          name="deliveryAddress"
                          value={formData.deliveryAddress || ''}
                          onChange={handleInputChange}
                          placeholder="请输入交货地址"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">交货方式</label>
                        <input
                          type="text"
                          name="deliveryMethod"
                          value={formData.deliveryMethod || ''}
                          onChange={handleInputChange}
                          placeholder="如：送货上门、快递、自提"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">质量要求</label>
                        <textarea
                          name="qualityRequirements"
                          value={formData.qualityRequirements || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述质量要求"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">验收标准</label>
                        <textarea
                          name="acceptanceCriteria"
                          value={formData.acceptanceCriteria || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述验收标准"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">质保期（月）</label>
                        <input
                          type="number"
                          name="warrantyPeriod"
                          value={formData.warrantyPeriod || ''}
                          onChange={handleInputChange}
                          placeholder="如：12"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">违约金比例（%）</label>
                        <input
                          type="number"
                          name="penaltyRate"
                          value={formData.penaltyRate || ''}
                          onChange={handleInputChange}
                          placeholder="如：5"
                          step="0.1"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.type === '委托加工' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-drafting-compass text-weyeah-blue"></i>
                      委托加工条款
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">图纸编号</label>
                        <input
                          type="text"
                          name="drawingNo"
                          value={formData.drawingNo || ''}
                          onChange={handleInputChange}
                          placeholder="请输入图纸编号"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">图纸版本</label>
                        <input
                          type="text"
                          name="drawingVersion"
                          value={formData.drawingVersion || ''}
                          onChange={handleInputChange}
                          placeholder="如：V1.0"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">加工要求</label>
                        <textarea
                          name="processingRequirements"
                          value={formData.processingRequirements || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述加工要求"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">来料要求</label>
                        <textarea
                          name="materialRequirements"
                          value={formData.materialRequirements || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述来料要求"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">质量监控</label>
                        <textarea
                          name="qualityMonitoring"
                          value={formData.qualityMonitoring || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述质量监控要求"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">知识产权</label>
                        <textarea
                          name="intellectualProperty"
                          value={formData.intellectualProperty || ''}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="请描述知识产权归属条款"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">合同详情</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{currentContract.code}</div>
                      <div className="text-2xl font-bold text-gray-900">{currentContract.name}</div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(currentContract.status)}`}>
                      {getStatusText(currentContract.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">供应商</div>
                      <div className="font-medium text-gray-900">{currentContract.supplierName || '-'}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">类型</div>
                      <div className="font-medium text-gray-900">{getTypeText(currentContract.type)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">合同金额</div>
                      <div className="font-bold text-xl text-green-600">¥{Number(currentContract.amount || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">有效期</div>
                      <div className="font-medium text-gray-900">
                        {currentContract.startDate?.slice(0, 10)} ~ {currentContract.endDate?.slice(0, 10) || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {getNextActions(currentContract.status).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {getNextActions(currentContract.status).map(action => (
                      <button
                        key={action.action}
                        onClick={() => handleStatusChange(currentContract.id, action.action)}
                        className={`px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center gap-2 ${action.class}`}
                      >
                        <i className="fas fa-check"></i>
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentContract.items && currentContract.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-list text-weyeah-blue"></i>
                      合同明细 ({currentContract.items.length} 项)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">物料编码</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">物料名称</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">数量</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">单价</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">合计</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentContract.items.map((item: any, idx: number) => (
                            <tr key={item.id || idx}>
                              <td className="px-4 py-3 text-gray-900">{item.materialCode || '-'}</td>
                              <td className="px-4 py-3 text-gray-900">{item.materialName || '-'}</td>
                              <td className="px-4 py-3 text-gray-900 text-right">{item.quantity} {item.unit}</td>
                              <td className="px-4 py-3 text-gray-900 text-right">¥{Number(item.unitPrice || 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-gray-900 text-right font-medium">¥{Number(calculateItemTotal(item)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => { setShowDetailModal(false); handleExportPDF(currentContract); }}
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

      {showItemsModal && currentContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                合同明细 - {currentContract.code}
              </h2>
              <button onClick={() => setShowItemsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-3">
                  <i className="fas fa-info-circle"></i>
                  <span className="font-medium">添加物料明细</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">物料 *</label>
                    <select
                      value={itemForm.materialId || ''}
                      onChange={(e) => handleMaterialSelect(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">选择物料</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">数量 *</label>
                    <input
                      type="number"
                      value={itemForm.quantity || ''}
                      onChange={(e) => setItemForm((prev: any) => ({ ...prev, quantity: Number(e.target.value) }))}
                      placeholder="数量"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">单位</label>
                    <input
                      type="text"
                      value={itemForm.unit || ''}
                      onChange={(e) => setItemForm(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="件/个/箱"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">单价 *</label>
                    <input
                      type="number"
                      value={itemForm.unitPrice || ''}
                      onChange={(e) => setItemForm(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                      placeholder="单价"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">税率(%)</label>
                    <input
                      type="number"
                      value={itemForm.taxRate || 13}
                      onChange={(e) => setItemForm(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                      placeholder="13"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">交货日期</label>
                    <input
                      type="date"
                      value={itemForm.deliveryDate || ''}
                      onChange={(e) => setItemForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    添加明细
                  </button>
                </div>
              </div>

              {contractItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-box text-4xl mb-4"></i>
                  <p>暂无明细，请添加物料</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">序号</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">物料编码</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">物料名称</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">数量</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">单价</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">税率</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">合计</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contractItems.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="px-4 py-3 text-gray-900">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-900">{item.materialCode || '-'}</td>
                          <td className="px-4 py-3 text-gray-900">{item.materialName || '-'}</td>
                          <td className="px-4 py-3 text-gray-900 text-right">{item.quantity} {item.unit}</td>
                          <td className="px-4 py-3 text-gray-900 text-right">¥{Number(item.unitPrice || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-900 text-right">{item.taxRate || 0}%</td>
                          <td className="px-4 py-3 text-gray-900 text-right font-medium">¥{Number(calculateItemTotal(item)).toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteItem(item.id!)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowItemsModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
