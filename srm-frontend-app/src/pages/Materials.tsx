import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Material, MaterialSupplier, Supplier, MaterialDrawing } from '../types';
import { materialApi } from '../services/material';
import { supplierApi } from '../services/supplier';

interface MaterialsProps {
  onLogout: () => void;
}

export default function Materials({ onLogout }: MaterialsProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'suppliers' | 'drawings'>('info');
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materialSuppliers, setMaterialSuppliers] = useState<MaterialSupplier[]>([]);
  const [materialDrawings, setMaterialDrawings] = useState<MaterialDrawing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [supplierFormData, setSupplierFormData] = useState({ supplierId: 0, isPrimary: false, leadTime: 0, moq: 0, remark: '' });
  const [drawingFormData, setDrawingFormData] = useState({ drawingNo: '', version: 'V1.0', description: '' });
  const [categoryAttributes, setCategoryAttributes] = useState<Record<string, any>>({});

  // 不同品类的属性定义
  const getCategoryAttributeFields = (category: string) => {
    switch(category) {
      case '核心零部件':
        return [
          { name: 'powerRange', label: '功率范围', type: 'text' },
          { name: 'material', label: '材质', type: 'text' },
          { name: 'dimension', label: '尺寸规格', type: 'text' },
        ];
      case '电气元件':
        return [
          { name: 'voltageLevel', label: '电压等级', type: 'text' },
          { name: 'currentCapacity', label: '电流容量', type: 'text' },
          { name: 'protectionLevel', label: '防护等级', type: 'text' },
          { name: 'certification', label: '认证标准', type: 'text' },
        ];
      default:
        return [];
    }
  }

  const [formData, setFormData] = useState<Partial<Material>>({
    code: '',
    name: '',
    model: '',
    specification: '',
    category: '',
    materialType: '',
    applicableModels: '',
    brand: '',
    manufacturer: '',
    originCountry: '',
    unit: '件',
    auxiliaryUnit: '',
    conversionRatio: 1,
    minOrderQuantity: 0,
    safetyStock: 0,
    warrantyPeriod: 0,
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadMaterials();
    loadSuppliers();
  }, [currentPage, keyword, categoryFilter, statusFilter]);

  const loadSuppliers = async () => {
    try {
      const response = await supplierApi.getList({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        setSuppliers(response.data.list || []);
      }
    } catch (error) {
      console.error('加载供应商列表失败:', error);
    }
  };

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await materialApi.getList(params);
      if (response.success && response.data) {
        setMaterials(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载物料列表失败:', error);
      showNotification('加载物料列表失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMaterialSuppliers = async (materialId: number) => {
    try {
      const response = await materialApi.getMaterialSuppliers(materialId);
      if (response.success && response.data) {
        setMaterialSuppliers(response.data || []);
      }
    } catch (error) {
      console.error('加载物料供应商失败:', error);
    }
  };

  const loadMaterialDrawings = async (materialId: number) => {
    try {
      setMaterialDrawings([
        { id: 1, materialId, drawingNo: 'DRW-2024-001', drawingName: '发动机缸体装配图.pdf', fileUrl: '#', version: 'V1.0', fileSize: 2048000, remark: '发动机缸体详细装配图纸', createdAt: '2024-06-01', status: 'ACTIVE' },
        { id: 2, materialId, drawingNo: 'DRW-2024-002', drawingName: '发动机缸体零件图.pdf', fileUrl: '#', version: 'V2.1', fileSize: 1536000, remark: '缸体零件详细尺寸图', createdAt: '2024-06-15', status: 'ACTIVE' },
      ]);
    } catch (error) {
      console.error('加载物料图纸失败:', error);
    }
  };

  const handleSaveDrawing = async () => {
    if (!drawingFormData.drawingNo) {
      showNotification('请填写图纸编号', 'error');
      return;
    }

    const newDrawing: MaterialDrawing = {
      ...drawingFormData,
      id: Date.now(),
      materialId: currentMaterial?.id || 0,
      drawingName: `${drawingFormData.drawingNo}.pdf`,
      fileUrl: '#',
      fileSize: 1024000,
      remark: drawingFormData.description,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMaterialDrawings(prev => [...prev, newDrawing]);
    setShowDrawingModal(false);
    setDrawingFormData({ drawingNo: '', version: 'V1.0', description: '' });
    showNotification('图纸上传成功', 'success');
  };

  const handleDeleteDrawing = async (drawingId: number) => {
    if (!confirm('确定要删除该图纸吗？')) return;
    
    setMaterialDrawings(prev => prev.filter(d => d.id !== drawingId));
    showNotification('图纸删除成功', 'success');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: '草稿',
      PENDING: '待审批',
      ACTIVE: '启用',
      INACTIVE: '停用',
      OBSOLETE: '淘汰',
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-orange-100 text-orange-700',
      OBSOLETE: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // 如果是分类变化，清空之前的分类属性
      if (name === 'category') {
        setCategoryAttributes({});
      }
    }
  };

  const handleCategoryAttributeChange = (name: string, value: string) => {
    setCategoryAttributes(prev => ({ ...prev, [name]: value }));
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

  const handleView = async (material: Material) => {
    try {
      const response = await materialApi.getById(material.id!);
      if (response.success && response.data) {
        setCurrentMaterial(response.data);
        await loadMaterialSuppliers(material.id!);
        await loadMaterialDrawings(material.id!);
        setDetailTab('info');
        setShowDetailModal(true);
      } else {
        showNotification(response.message || '获取详情失败', 'error');
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      showNotification('获取详情失败，请稍后重试', 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (isEditMode && editId) {
        response = await materialApi.update(editId, formData);
        if (response.success) {
          showNotification('物料更新成功', 'success');
        }
      } else {
        response = await materialApi.create(formData);
        if (response.success) {
          showNotification('物料创建成功', 'success');
        }
      }
      
      if (response.success) {
        setShowModal(false);
        resetForm();
        loadMaterials();
      } else {
        showNotification(response.message || '操作失败', 'error');
      }
    } catch (error) {
      console.error('保存物料失败:', error);
      showNotification('保存物料失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (material: Material) => {
    setFormData(material);
    setIsEditMode(true);
    setEditId(material.id || null);
    setShowModal(true);
  };

  const handleStatusChange = async (material: Material, newStatus: string) => {
    try {
      const response = await materialApi.updateStatus(material.id!, newStatus);
      if (response.success) {
        showNotification('状态更新成功', 'success');
        loadMaterials();
      } else {
        showNotification(response.message || '状态更新失败', 'error');
      }
    } catch (error) {
      console.error('状态更新失败:', error);
      showNotification('状态更新失败', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      model: '',
      specification: '',
      category: '',
      materialType: '',
      applicableModels: '',
      brand: '',
      manufacturer: '',
      originCountry: '',
      unit: '件',
      auxiliaryUnit: '',
      conversionRatio: 1,
      minOrderQuantity: 0,
      safetyStock: 0,
      warrantyPeriod: 0,
      description: '',
      status: 'ACTIVE',
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该物料吗？')) return;
    
    try {
      const response = await materialApi.delete(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadMaterials();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除物料失败:', error);
      showNotification('删除失败，请稍后重试', 'error');
    }
  };

  const handleAddSupplier = async () => {
    if (!currentMaterial || supplierFormData.supplierId === 0) {
      showNotification('请选择供应商', 'error');
      return;
    }

    try {
      const response = await materialApi.addSupplier(currentMaterial.id!, supplierFormData);
      if (response.success) {
        showNotification('供应商关联成功', 'success');
        setShowSupplierModal(false);
        setSupplierFormData({ supplierId: 0, isPrimary: false, leadTime: 0, moq: 0, remark: '' });
        await loadMaterialSuppliers(currentMaterial.id!);
      } else {
        showNotification(response.message || '添加失败', 'error');
      }
    } catch (error) {
      console.error('添加供应商失败:', error);
      showNotification('添加失败，请稍后重试', 'error');
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!currentMaterial || !confirm('确定要删除该供应商关联吗？')) return;

    try {
      const response = await materialApi.deleteSupplier(currentMaterial.id!, supplierId);
      if (response.success) {
        showNotification('删除成功', 'success');
        await loadMaterialSuppliers(currentMaterial.id!);
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除供应商失败:', error);
      showNotification('删除失败', 'error');
    }
  };

  const handleSetPrimary = async (supplierId: number) => {
    if (!currentMaterial) return;

    try {
      const response = await materialApi.setPrimarySupplier(currentMaterial.id!, supplierId);
      if (response.success) {
        showNotification('设置成功', 'success');
        await loadMaterialSuppliers(currentMaterial.id!);
      } else {
        showNotification(response.message || '设置失败', 'error');
      }
    } catch (error) {
      console.error('设置失败:', error);
      showNotification('设置失败', 'error');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">物料管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>业务管理</span>
              <span>/</span>
              <span>物料管理</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
              <i className="fas fa-sync"></i>
              <span>ERP同步中...</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">每日00:00</span>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-plus"></i>
              新增物料
            </button>
          </div>
        </div>
        
        {/* ERP同步提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 mb-1">ERP系统集成</h4>
              <p className="text-sm text-blue-700">
                物料编码、品类编码优先从ERP系统同步。如需新增物料请联系ERP管理员。
                每日00:00自动同步主数据。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="搜索物料编码、名称、型号..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
            >
              <option value="">全部分类</option>
              <option value="核心零部件">核心零部件</option>
              <option value="标准件">标准件</option>
              <option value="电气元件">电气元件</option>
              <option value="耗材">耗材</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
            >
              <option value="">全部状态</option>
              <option value="ACTIVE">启用</option>
              <option value="INACTIVE">停用</option>
              <option value="OBSOLETE">淘汰</option>
            </select>
            <button 
              onClick={loadMaterials}
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">物料编码</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">物料名称</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">型号</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">规格</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">品牌</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && materials.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  materials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{material.code}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-weyeah-blue rounded flex items-center justify-center text-white text-xs font-medium">
                            {material.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm text-gray-900">{material.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{material.model || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate">{material.specification || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{material.brand || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{material.category || '-'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={material.status || 'ACTIVE'}
                          onChange={(e) => handleStatusChange(material, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusClass(material.status)}`}
                        >
                          <option value="DRAFT">草稿</option>
                          <option value="PENDING">待审批</option>
                          <option value="ACTIVE">启用</option>
                          <option value="INACTIVE">停用</option>
                          <option value="OBSOLETE">淘汰</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleView(material)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-weyeah-blue"
                            title="查看详情"
                          >
                            <i className="fas fa-eye text-sm"></i>
                          </button>
                          <button 
                            onClick={() => handleEdit(material)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-weyeah-blue"
                            title="编辑"
                          >
                            <i className="fas fa-edit text-sm"></i>
                          </button>
                          <button 
                            onClick={() => material.id && handleDelete(material.id)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
                            title="删除"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">共 {totalCount} 条记录</div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-50 text-sm"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 border rounded ${currentPage === page ? 'bg-weyeah-blue border-weyeah-blue text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-weyeah-blue hover:text-weyeah-blue'}`}
                  >
                    {page}
                  </button>
                );
              })}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-600 hover:border-weyeah-blue hover:text-weyeah-blue disabled:opacity-50 text-sm"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑物料' : '新增物料'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">物料编码 *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">物料名称 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">型号</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">规格说明</label>
                    <input
                      type="text"
                      name="specification"
                      value={formData.specification || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="">请选择</option>
                      <option value="核心零部件">核心零部件</option>
                      <option value="标准件">标准件</option>
                      <option value="电气元件">电气元件</option>
                      <option value="耗材">耗材</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">物料类型</label>
                    <select
                      name="materialType"
                      value={formData.materialType || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="">请选择</option>
                      <option value="原装件">原装件</option>
                      <option value="OEM件">OEM件</option>
                      <option value="替代件">替代件</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">适用机型</label>
                    <select
                      name="applicableModels"
                      value={formData.applicableModels || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="">请选择</option>
                      <option value="Jenbacher">Jenbacher</option>
                      <option value="MWM">MWM</option>
                      <option value="Caterpillar">Caterpillar</option>
                      <option value="MTU">MTU</option>
                      <option value="Deutz">Deutz</option>
                      <option value="通用">通用</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">制造商</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">原产国</label>
                    <input
                      type="text"
                      name="originCountry"
                      value={formData.originCountry || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit || '件'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">辅助单位</label>
                    <input
                      type="text"
                      name="auxiliaryUnit"
                      value={formData.auxiliaryUnit || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最小订购量</label>
                    <input
                      type="number"
                      name="minOrderQuantity"
                      value={formData.minOrderQuantity || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">安全库存</label>
                    <input
                      type="number"
                      name="safetyStock"
                      value={formData.safetyStock || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">质保期(月)</label>
                    <input
                      type="number"
                      name="warrantyPeriod"
                      value={formData.warrantyPeriod || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select
                      name="status"
                      value={formData.status || 'ACTIVE'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="ACTIVE">启用</option>
                      <option value="INACTIVE">停用</option>
                      <option value="OBSOLETE">淘汰</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  
                  {/* 分类属性区域 */}
                  {getCategoryAttributeFields(formData.category || '').length > 0 && (
                    <div className="md:col-span-3 mt-4 border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="fas fa-sliders text-weyeah-blue"></i>
                        {formData.category}分类属性
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCategoryAttributeFields(formData.category || '').map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <input
                              type="text"
                              value={categoryAttributes[field.name] || ''}
                              onChange={(e) => handleCategoryAttributeChange(field.name, e.target.value)}
                              placeholder={`请输入${field.label}`}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                  {isEditMode ? '更新' : '保存'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailModal && currentMaterial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">物料详情</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="flex border-b border-gray-100 flex-shrink-0">
                <button
                  onClick={() => setDetailTab('info')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    detailTab === 'info' ? 'text-weyeah-blue border-b-2 border-weyeah-blue bg-blue-50' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  基本信息
                </button>
                <button
                  onClick={() => setDetailTab('suppliers')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    detailTab === 'suppliers' ? 'text-weyeah-blue border-b-2 border-weyeah-blue bg-blue-50' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-building mr-2"></i>
                  关联供应商
                </button>
                <button
                  onClick={() => setDetailTab('drawings')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${
                    detailTab === 'drawings' ? 'text-weyeah-blue border-b-2 border-weyeah-blue bg-blue-50' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-file-image mr-2"></i>
                  图纸管理
                  {currentMaterial.materialType === '替代件' && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">必填</span>
                  )}
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {detailTab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <i className="fas fa-box text-weyeah-blue"></i>
                        基本信息
                      </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">物料编码</div>
                        <div className="text-sm font-medium">{currentMaterial.code || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">状态</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(currentMaterial.status)}`}>
                          {getStatusText(currentMaterial.status)}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">物料名称</div>
                        <div className="text-sm font-medium">{currentMaterial.name || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">型号</div>
                        <div className="text-sm">{currentMaterial.model || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <div className="text-xs text-gray-500 mb-1">规格说明</div>
                        <div className="text-sm">{currentMaterial.specification || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">品牌</div>
                        <div className="text-sm">{currentMaterial.brand || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">制造商</div>
                        <div className="text-sm">{currentMaterial.manufacturer || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">分类</div>
                        <div className="text-sm">{currentMaterial.category || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">物料类型</div>
                        <div className="text-sm">{currentMaterial.materialType || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">适用机型</div>
                        <div className="text-sm">{currentMaterial.applicableModels || '-'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 分类属性显示 */}
                  {getCategoryAttributeFields(currentMaterial.category || '').length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <i className="fas fa-sliders text-weyeah-blue"></i>
                        {currentMaterial.category}分类属性
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {getCategoryAttributeFields(currentMaterial.category || '').map((field) => (
                          <div key={field.name} className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">{field.label}</div>
                            <div className="text-sm">-</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <i className="fas fa-cogs text-weyeah-blue"></i>
                      库存信息
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">单位</div>
                        <div className="text-sm">{currentMaterial.unit || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">最小订购量</div>
                        <div className="text-sm">{currentMaterial.minOrderQuantity || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">安全库存</div>
                        <div className="text-sm">{currentMaterial.safetyStock || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">质保期</div>
                        <div className="text-sm">{currentMaterial.warrantyPeriod || 0} 个月</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">原产国</div>
                        <div className="text-sm">{currentMaterial.originCountry || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">辅助单位</div>
                        <div className="text-sm">{currentMaterial.auxiliaryUnit || '-'}</div>
                      </div>
                    </div>
                    
                    {currentMaterial.description && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">描述</div>
                        <div className="text-sm">{currentMaterial.description}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailTab === 'suppliers' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <i className="fas fa-building text-weyeah-blue"></i>
                      关联供应商
                    </h3>
                    <button
                      onClick={() => {
                        setSupplierFormData({ supplierId: 0, isPrimary: false, leadTime: 0, moq: 0, remark: '' });
                        setShowSupplierModal(true);
                      }}
                      className="px-3 py-1.5 bg-weyeah-blue text-white text-sm rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-1"
                    >
                      <i className="fas fa-plus"></i>
                      添加供应商
                    </button>
                  </div>
                  
                  {materialSuppliers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <i className="fas fa-building text-2xl mb-2"></i>
                      <p>暂无关联供应商</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">主要</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">供应商编码</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">供应商名称</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">类型</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">交期(天)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">MOQ</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {materialSuppliers.map((ms) => (
                            <tr key={ms.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2">
                                {ms.isPrimary && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">主</span>}
                              </td>
                              <td className="px-3 py-2 text-sm">{ms.supplierCode || '-'}</td>
                              <td className="px-3 py-2 text-sm font-medium">{ms.supplierName || '-'}</td>
                              <td className="px-3 py-2 text-sm">{ms.supplierType || '-'}</td>
                              <td className="px-3 py-2 text-sm">{ms.leadTime || 0}</td>
                              <td className="px-3 py-2 text-sm">{ms.moq || 0}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1">
                                  {!ms.isPrimary && (
                                    <button
                                      onClick={() => ms.supplierId && handleSetPrimary(ms.supplierId)}
                                      className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-green-600 text-xs"
                                      title="设为主要"
                                    >
                                      <i className="fas fa-star"></i>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => ms.supplierId && handleDeleteSupplier(ms.supplierId)}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 text-xs"
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
                  )}
                </div>
              )}

              {detailTab === 'drawings' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <i className="fas fa-file-image text-weyeah-blue"></i>
                      图纸管理
                      {currentMaterial.materialType === '替代件' && (
                        <span className="text-sm text-red-500">（替代件必须上传图纸）</span>
                      )}
                    </h3>
                    <button
                      onClick={() => setShowDrawingModal(true)}
                      className="px-3 py-1.5 bg-weyeah-blue text-white text-sm rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-1"
                    >
                      <i className="fas fa-plus"></i>
                      上传图纸
                    </button>
                  </div>
                  
                  {currentMaterial.materialType === '替代件' && materialDrawings.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>该物料为替代件，建议上传相关图纸文件</span>
                      </div>
                    </div>
                  )}
                  
                  {materialDrawings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <i className="fas fa-file-image text-4xl mb-4"></i>
                      <p>暂无图纸文件</p>
                      <p className="text-sm mt-2">点击上方按钮上传图纸</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {materialDrawings.map((drawing) => (
                        <div key={drawing.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                                <div>
                                  <div className="font-medium">{drawing.drawingName}</div>
                                  <div className="text-xs text-gray-500">
                                    图纸编号: {drawing.drawingNo} | 版本: {drawing.version}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>上传时间: {drawing.createdAt}</span>
                                <span>文件大小: {formatFileSize(drawing.fileSize || 0)}</span>
                              </div>
                              {drawing.remark && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <span className="text-gray-500">说明: </span>{drawing.remark}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-blue-600" title="下载">
                                <i className="fas fa-download"></i>
                              </button>
                              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-red-600" title="删除" onClick={() => drawing.id && handleDeleteDrawing(drawing.id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

        {showSupplierModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fadeIn p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">添加供应商</h2>
                <button
                  onClick={() => setShowSupplierModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">供应商 *</label>
                  <select
                    value={supplierFormData.supplierId}
                    onChange={(e) => setSupplierFormData(prev => ({ ...prev, supplierId: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  >
                    <option value={0}>请选择供应商</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supplierFormData.isPrimary}
                      onChange={(e) => setSupplierFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                      className="w-4 h-4 text-weyeah-blue rounded"
                    />
                    <span className="text-sm text-gray-700">设为主要供应商</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">交期(天)</label>
                  <input
                    type="number"
                    value={supplierFormData.leadTime}
                    onChange={(e) => setSupplierFormData(prev => ({ ...prev, leadTime: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最小订购量</label>
                  <input
                    type="number"
                    value={supplierFormData.moq}
                    onChange={(e) => setSupplierFormData(prev => ({ ...prev, moq: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={supplierFormData.remark}
                    onChange={(e) => setSupplierFormData(prev => ({ ...prev, remark: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddSupplier}
                  className="px-4 py-2 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}

        {showDrawingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fadeIn p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">上传图纸</h2>
                <button
                  onClick={() => setShowDrawingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图纸编号 *</label>
                  <input
                    type="text"
                    value={drawingFormData.drawingNo}
                    onChange={(e) => setDrawingFormData(prev => ({ ...prev, drawingNo: e.target.value }))}
                    placeholder="如: DRW-2024-001"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">版本</label>
                  <input
                    type="text"
                    value={drawingFormData.version}
                    onChange={(e) => setDrawingFormData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="如: V1.0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">文件上传</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-weyeah-blue transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.dwg,.dxf"
                      className="hidden"
                      id="drawing-file"
                    />
                    <label htmlFor="drawing-file" className="cursor-pointer">
                      <i className="fas fa-upload text-gray-400 text-3xl mb-2"></i>
                      <p className="text-sm text-gray-600">点击或拖拽文件到此处上传</p>
                      <p className="text-xs text-gray-400 mt-1">支持 PDF, DWG, DXF 格式</p>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">说明</label>
                  <textarea
                    value={drawingFormData.description}
                    onChange={(e) => setDrawingFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="请输入图纸说明..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDrawingModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveDrawing}
                  className="px-4 py-2 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                >
                  上传
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
