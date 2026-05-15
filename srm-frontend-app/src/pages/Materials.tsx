import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Material } from '../types';
import { materialApi } from '../services/material';

interface MaterialsProps {
  onLogout: () => void;
}

export default function Materials({ onLogout }: MaterialsProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') {
      setShowModal(true);
      history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState<Partial<Material>>({
    code: '',
    name: '',
    specification: '',
    category: '',
    unit: '件',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadMaterials();
  }, [currentPage, keyword, categoryFilter]);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (categoryFilter) params.category = categoryFilter;

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

  const handleView = async (material: Material) => {
    try {
      const response = await materialApi.getById(material.id!);
      if (response.success && response.data) {
        setCurrentMaterial(response.data);
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
      const response = await materialApi.create(formData);
      if (response.success) {
        showNotification('物料创建成功', 'success');
        setShowModal(false);
        resetForm();
        loadMaterials();
      } else {
        showNotification(response.message || '创建失败', 'error');
      }
    } catch (error) {
      console.error('创建物料失败:', error);
      showNotification('创建物料失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      specification: '',
      category: '',
      unit: '件',
      status: 'ACTIVE',
    });
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

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="搜索物料编码、名称..."
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">物料编码</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">物料名称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">规格型号</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">分类</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">单位</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && materials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  materials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{material.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-weyeah-blue rounded-lg flex items-center justify-center text-white font-medium">
                            {material.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm text-gray-900 font-medium">{material.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{material.specification || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{material.category || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{material.unit || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(material.status)}`}>
                          {getStatusText(material.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(material)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            title="查看详情"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => material.id && handleDelete(material.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
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
                <h2 className="text-xl font-semibold text-gray-900">新增物料</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">物料编码 *</label>
                    <input
                      type="text"
                      name="code"
                      placeholder="请输入物料编码"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">物料名称 *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="请输入物料名称"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">规格型号</label>
                    <input
                      type="text"
                      name="specification"
                      placeholder="请输入规格型号"
                      value={formData.specification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">请选择分类</option>
                      <option value="核心零部件">核心零部件</option>
                      <option value="标准件">标准件</option>
                      <option value="电气元件">电气元件</option>
                      <option value="耗材">耗材</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">单位</label>
                    <input
                      type="text"
                      name="unit"
                      placeholder="请输入单位"
                      value={formData.unit}
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
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailModal && currentMaterial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">物料详情</h2>
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
                      <i className="fas fa-box text-weyeah-blue"></i>
                      基本信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">物料编码</div>
                        <div className="font-medium text-gray-900">{currentMaterial.code || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">物料名称</div>
                        <div className="font-medium text-gray-900">{currentMaterial.name || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">规格型号</div>
                        <div className="font-medium text-gray-900">{currentMaterial.specification || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">分类</div>
                        <div className="font-medium text-gray-900">{currentMaterial.category || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">单位</div>
                        <div className="font-medium text-gray-900">{currentMaterial.unit || '-'}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">状态</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(currentMaterial.status)}`}>
                            {getStatusText(currentMaterial.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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