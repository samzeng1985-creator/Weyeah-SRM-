import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { categoryApi, Category, CategoryTreeNode, CategoryCreate } from '../services/category';

interface CategoriesProps {
  onLogout: () => void;
}

export default function Categories({ onLogout }: CategoriesProps) {
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parentOptions, setParentOptions] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<CategoryCreate>>({
    name: '',
    parentId: undefined,
    description: '',
    sortOrder: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategoryTree();
    loadAllCategories();
  }, []);

  const loadCategoryTree = async () => {
    try {
      const response = await categoryApi.getTree();
      if (response.success && response.data) {
        setCategoryTree(response.data);
        if (response.data.length > 0 && response.data[0].children.length > 0) {
          setExpandedNodes(new Set([response.data[0].id]));
        }
      }
    } catch (error) {
      console.error('加载品类树失败:', error);
      showNotification('加载品类树失败', 'error');
    }
  };

  const loadAllCategories = async () => {
    try {
      const response = await categoryApi.getList();
      if (response.success && response.data) {
        setParentOptions(response.data);
      }
    } catch (error) {
      console.error('加载品类列表失败:', error);
    }
  };

  const loadCategoryDetail = async (id: number) => {
    try {
      const response = await categoryApi.getById(id);
      if (response.success && response.data) {
        setSelectedCategory(response.data);
      }
    } catch (error) {
      console.error('加载品类详情失败:', error);
    }
  };

  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleSelectCategory = (node: CategoryTreeNode) => {
    loadCategoryDetail(node.id);
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

  const handleOpenAdd = (parentId?: number) => {
    setIsEditMode(false);
    setFormData({
      name: '',
      parentId: parentId,
      description: '',
      sortOrder: 0,
    });
    setShowModal(true);
  };

  const handleOpenEdit = () => {
    if (!selectedCategory) return;
    setIsEditMode(true);
    setFormData({
      name: selectedCategory.name,
      parentId: selectedCategory.parentId > 0 ? selectedCategory.parentId : undefined,
      description: selectedCategory.description,
      sortOrder: selectedCategory.sortOrder,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      showNotification('请填写品类名称', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && selectedCategory) {
        await categoryApi.update(selectedCategory.id, formData);
        showNotification('品类更新成功', 'success');
        setShowModal(false);
        loadCategoryTree();
        loadCategoryDetail(selectedCategory.id);
      } else {
        await categoryApi.create(formData as CategoryCreate);
        showNotification('品类创建成功', 'success');
        setShowModal(false);
        loadCategoryTree();
      }
    } catch (error) {
      console.error('操作失败:', error);
      showNotification((error as Error).message || '操作失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    if (!confirm('确定要删除该品类吗？')) return;

    try {
      await categoryApi.delete(selectedCategory.id);
      showNotification('删除成功', 'success');
      setSelectedCategory(null);
      loadCategoryTree();
    } catch (error) {
      console.error('删除失败:', error);
      showNotification((error as Error).message || '删除失败，请稍后重试', 'error');
    }
  };

  const getLevelName = (level: number) => {
    return ['一级', '二级', '三级'][level - 1] || `${level}级`;
  };

  const renderTreeNode = (node: CategoryTreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedCategory?.id === node.id;

    return (
      <div key={node.id}>
        <div
          onClick={() => handleSelectCategory(node)}
          className={`flex items-center gap-2 py-2 px-3 cursor-pointer rounded-lg transition-colors ${
            isSelected ? 'bg-weyeah-blue text-white' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="w-5 h-5 flex items-center justify-center text-xs"
            >
              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
            </button>
          ) : (
            <span className="w-5 h-5"></span>
          )}
          <span className={`font-medium ${node.isLeaf ? '' : 'text-gray-700'}`}>
            {node.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
          }`}>
            {getLevelName(node.level)}
          </span>
          {node.isLeaf && (
            <span className={`text-xs px-2 py-0.5 rounded ${
              isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
            }`}>
              末级
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">物料品类管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>系统管理</span>
              <span>/</span>
              <span>物料品类管理</span>
            </div>
          </div>
          <button
            onClick={() => handleOpenAdd()}
            className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fas fa-plus"></i>
            新增品类
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-sitemap text-weyeah-blue"></i>
                品类结构
              </h3>
              <div className="space-y-1">
                {categoryTree.map((node) => renderTreeNode(node))}
              </div>
              {categoryTree.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-sitemap text-4xl mb-2 opacity-50"></i>
                  <p>暂无品类数据</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-info-circle text-weyeah-blue"></i>
                  品类详情
                </h3>
                {selectedCategory && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAdd(selectedCategory.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <i className="fas fa-plus"></i>
                      添加子品类
                    </button>
                    <button
                      onClick={handleOpenEdit}
                      className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-2"
                    >
                      <i className="fas fa-edit"></i>
                      编辑
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <i className="fas fa-trash"></i>
                      删除
                    </button>
                  </div>
                )}
              </div>

              {selectedCategory ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">品类编码</div>
                      <div className="font-medium text-gray-900">{selectedCategory.code}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">品类名称</div>
                      <div className="font-medium text-gray-900">{selectedCategory.name}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">品类层级</div>
                      <div className="font-medium text-gray-900">{getLevelName(selectedCategory.level)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">是否末级</div>
                      <div className="font-medium">
                        {selectedCategory.isLeaf ? (
                          <span className="text-green-600">是</span>
                        ) : (
                          <span className="text-gray-600">否</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">状态</div>
                      <div className="font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedCategory.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedCategory.status === 'ACTIVE' ? '启用' : '禁用'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">排序</div>
                      <div className="font-medium text-gray-900">{selectedCategory.sortOrder}</div>
                    </div>
                    {selectedCategory.parentId > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                        <div className="text-sm text-gray-500 mb-1">上级品类</div>
                        <div className="font-medium text-gray-900">
                          {parentOptions.find(p => p.id === selectedCategory.parentId)?.name || '-'}
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">描述</div>
                      <div className="font-medium text-gray-900">{selectedCategory.description || '-'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <i className="fas fa-mouse-pointer text-4xl mb-4 opacity-50"></i>
                  <p>请从左侧选择品类查看详情</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? '编辑品类' : '新增品类'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      上级品类
                    </label>
                    <select
                      value={formData.parentId || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        parentId: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    >
                      <option value="">无（作为一级品类）</option>
                      {parentOptions.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.code} - {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      选择上级品类将创建子品类，最多支持三级
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      品类名称 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入品类名称"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      排序
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      placeholder="请输入品类描述"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
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
      </div>
    </Layout>
  );
}
