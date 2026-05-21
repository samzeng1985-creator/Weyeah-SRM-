import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { contractTemplateApi, ContractTemplate, ContractTemplateCreate } from '../services/contractTemplate';

interface ContractTemplatesProps {
  onLogout: () => void;
}

export default function ContractTemplates({ onLogout }: ContractTemplatesProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState<Partial<ContractTemplateCreate>>({
    name: '',
    type: '采购合同',
    code: '',
    language: 'zh-CN',
    content: '',
    description: '',
    status: 'INACTIVE',
    version: '1.0',
    sortOrder: 0,
  });

  useEffect(() => {
    loadTemplates();
  }, [currentPage, keyword, typeFilter, statusFilter]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await contractTemplateApi.getList(params);
      if (response.success && response.data) {
        setTemplates(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载模板列表失败:', error);
      showNotification('加载模板列表失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      'NDA': 'NDA保密协议',
      '采购合同': '采购合同',
      '委托加工': '委托加工',
    };
    return map[type] || type || '未知';
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: '启用',
      INACTIVE: '停用',
    };
    return map[status] || status || '未知';
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg text-white shadow-lg ${colors[type]}`;
    notification.innerHTML = `<div class="flex items-center gap-3"><i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i><span>${message}</span></div>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleView = async (template: ContractTemplate) => {
    try {
      const response = await contractTemplateApi.getById(template.id!);
      if (response.success && response.data) {
        setFormData(response.data);
        setIsEditMode(true);
        setEditId(template.id!);
        setShowModal(true);
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      showNotification('获取详情失败', 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.type) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (isEditMode && editId) {
        response = await contractTemplateApi.update(editId, formData);
        if (response.success) {
          showNotification('模板更新成功', 'success');
        }
      } else {
        response = await contractTemplateApi.create(formData as ContractTemplateCreate);
        if (response.success) {
          showNotification('模板创建成功', 'success');
        }
      }
      
      if (response?.success) {
        setShowModal(false);
        resetForm();
        loadTemplates();
      } else {
        showNotification(response?.message || '操作失败', 'error');
      }
    } catch (error) {
      console.error('保存模板失败:', error);
      showNotification('保存模板失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (template: ContractTemplate) => {
    setFormData(template);
    setIsEditMode(true);
    setEditId(template.id!);
    setShowModal(true);
  };

  const handleStatusChange = async (template: ContractTemplate, newStatus: string) => {
    try {
      const response = await contractTemplateApi.updateStatus(template.id!, newStatus);
      if (response.success) {
        showNotification('状态更新成功', 'success');
        loadTemplates();
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
      name: '',
      type: '采购合同',
      code: '',
      language: 'zh-CN',
      content: '',
      description: '',
      status: 'INACTIVE',
      version: '1.0',
      sortOrder: 0,
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此模板吗？')) return;
    
    try {
      const response = await contractTemplateApi.delete(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadTemplates();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除模板失败:', error);
      showNotification('删除失败，请稍后重试', 'error');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">合同模板管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-file-alt"></i>
              <span>业务管理</span>
              <span>/</span>
              <span>合同模板</span>
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
            新增模板
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
                placeholder="搜索模板名称、编码..."
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
              <option value="NDA">NDA保密协议</option>
              <option value="采购合同">采购合同</option>
              <option value="委托加工">委托加工</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
            >
              <option value="">全部状态</option>
              <option value="ACTIVE">启用</option>
              <option value="INACTIVE">停用</option>
            </select>
            <button 
              onClick={loadTemplates}
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">编码</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">模板名称</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">语言</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">版本</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && templates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      加载中...
                    </td>
                  </tr>
                ) : templates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      暂无模板
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{template.code}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded flex items-center justify-center">
                            <i className="fas fa-file-alt text-xs"></i>
                          </div>
                          <span className="text-sm text-gray-900">{template.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{getTypeText(template.type)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{template.language}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{template.version || '-'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={template.status}
                          onChange={(e) => handleStatusChange(template, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusClass(template.status)}`}
                        >
                          <option value="ACTIVE">启用</option>
                          <option value="INACTIVE">停用</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{template.createdAt ? new Date(template.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleView(template)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-weyeah-blue"
                            title="查看"
                          >
                            <i className="fas fa-eye text-sm"></i>
                          </button>
                          <button 
                            onClick={() => handleEdit(template)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-weyeah-blue"
                            title="编辑"
                          >
                            <i className="fas fa-edit text-sm"></i>
                          </button>
                          <button 
                            onClick={() => template.id && handleDelete(template.id)}
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
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? '编辑模板' : '新增模板'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">模板名称 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">模板编码 *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">类型 *</label>
                    <select
                      name="type"
                      value={formData.type || '采购合同'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="NDA">NDA保密协议</option>
                      <option value="采购合同">采购合同</option>
                      <option value="委托加工">委托加工</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
                    <select
                      name="language"
                      value={formData.language || 'zh-CN'}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="zh-CN">中文简体</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">版本</label>
                    <input
                      type="text"
                      name="version"
                      value={formData.version || '1.0'}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={formData.sortOrder || 0}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select
                      name="status"
                      value={formData.status || 'INACTIVE'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="INACTIVE">停用</option>
                      <option value="ACTIVE">启用</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">模板内容（HTML）</label>
                    <textarea
                      name="content"
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue font-mono text-sm"
                    />
                  </div>
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
      </div>
    </Layout>
  );
}
