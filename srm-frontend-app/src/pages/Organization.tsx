import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { organizationApi, Department, Employee, Role } from '../services/organization';

interface OrganizationProps {
  onLogout: () => void;
}

export default function Organization({ onLogout }: OrganizationProps) {
  const [activeTab, setActiveTab] = useState<'departments' | 'employees' | 'roles'>('departments');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [deptForm, setDeptForm] = useState<Partial<Department>>({
    code: '',
    name: '',
    parentId: 0,
    level: 1,
    leaderId: undefined,
    leaderName: '',
    description: '',
    status: 'ACTIVE',
    sortOrder: 0,
  });

  const [empForm, setEmpForm] = useState<Partial<Employee>>({
    employeeNo: '',
    name: '',
    gender: 'MALE',
    phone: '',
    email: '',
    departmentId: undefined,
    departmentName: '',
    position: '',
    positionLevel: 'STAFF',
    hireDate: '',
    status: 'ACTIVE',
  });

  const [roleForm, setRoleForm] = useState<Partial<Role>>({
    code: '',
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadDepartments();
    loadEmployees();
    loadRoles();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await organizationApi.getDepartmentTree();
      console.log('部门API响应:', response);
      if (response.success && response.data) {
        setDepartments(response.data);
        console.log('设置的部门数据:', response.data);
      } else {
        console.error('获取部门失败:', response.message);
      }
    } catch (error) {
      console.error('加载部门失败:', error);
    }
  };

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const params: any = { page: currentPage, pageSize, keyword, status: statusFilter };
      const response = await organizationApi.getEmployees(params);
      if (response.success && response.data) {
        setEmployees(response.data.list || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载员工失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await organizationApi.getRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error('加载角色失败:', error);
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

  const handleDeptClick = (dept: Department) => {
    setSelectedDepartment(dept);
  };

  const handleAddDepartment = (parentId: number = 0, level: number = 1) => {
    setIsEditMode(false);
    setDeptForm({
      code: '',
      name: '',
      parentId,
      level: parentId === 0 ? 1 : level + 1,
      leaderId: undefined,
      leaderName: '',
      description: '',
      status: 'ACTIVE',
      sortOrder: 0,
    });
    setShowDeptModal(true);
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment) return;
    setIsEditMode(true);
    setDeptForm({ ...selectedDepartment });
    setShowDeptModal(true);
  };

  const handleSaveDepartment = async () => {
    if (!deptForm.code || !deptForm.name) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    console.log('开始保存部门:', deptForm);
    try {
      if (isEditMode && deptForm.id) {
        const response = await organizationApi.updateDepartment(deptForm.id, deptForm);
        console.log('更新部门响应:', response);
        if (response.success) {
          showNotification('部门更新成功', 'success');
          setShowDeptModal(false);
          loadDepartments();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        const response = await organizationApi.createDepartment(deptForm);
        console.log('创建部门响应:', response);
        if (response.success) {
          showNotification('部门创建成功', 'success');
          setShowDeptModal(false);
          loadDepartments();
        } else {
          showNotification(response.message || '创建失败', 'error');
        }
      }
    } catch (error) {
      console.error('保存部门失败:', error);
      showNotification('操作失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (!confirm('确定要删除该部门吗？')) return;
    
    try {
      const response = await organizationApi.deleteDepartment(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        setSelectedDepartment(null);
        loadDepartments();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      showNotification('删除失败', 'error');
    }
  };

  const handleAddEmployee = () => {
    setIsEditMode(false);
    setEmpForm({
      employeeNo: '',
      name: '',
      gender: 'MALE',
      phone: '',
      email: '',
      departmentId: undefined,
      departmentName: '',
      position: '',
      positionLevel: 'STAFF',
      hireDate: '',
      status: 'ACTIVE',
    });
    setShowEmpModal(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setIsEditMode(true);
    setEmpForm({ ...emp });
    setShowEmpModal(true);
  };

  const handleSaveEmployee = async () => {
    if (!empForm.employeeNo || !empForm.name || !empForm.departmentId) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && empForm.id) {
        const response = await organizationApi.updateEmployee(empForm.id, empForm);
        if (response.success) {
          showNotification('员工更新成功', 'success');
          setShowEmpModal(false);
          loadEmployees();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        const response = await organizationApi.createEmployee(empForm);
        if (response.success) {
          showNotification('员工创建成功', 'success');
          setShowEmpModal(false);
          loadEmployees();
        } else {
          showNotification(response.message || '创建失败', 'error');
        }
      }
    } catch (error) {
      showNotification('操作失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('确定要删除该员工吗？')) return;
    
    try {
      const response = await organizationApi.deleteEmployee(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadEmployees();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      showNotification('删除失败', 'error');
    }
  };

  const handleAddRole = () => {
    setIsEditMode(false);
    setRoleForm({
      code: '',
      name: '',
      description: '',
      status: 'ACTIVE',
    });
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setIsEditMode(true);
    setRoleForm({ ...role });
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!roleForm.code || !roleForm.name) {
      showNotification('请填写必填字段', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && roleForm.id) {
        const response = await organizationApi.updateRole(roleForm.id, roleForm);
        if (response.success) {
          showNotification('角色更新成功', 'success');
          setShowRoleModal(false);
          loadRoles();
        } else {
          showNotification(response.message || '更新失败', 'error');
        }
      } else {
        const response = await organizationApi.createRole(roleForm);
        if (response.success) {
          showNotification('角色创建成功', 'success');
          setShowRoleModal(false);
          loadRoles();
        } else {
          showNotification(response.message || '创建失败', 'error');
        }
      }
    } catch (error) {
      showNotification('操作失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm('确定要删除该角色吗？')) return;
    
    try {
      const response = await organizationApi.deleteRole(id);
      if (response.success) {
        showNotification('删除成功', 'success');
        loadRoles();
      } else {
        showNotification(response.message || '删除失败', 'error');
      }
    } catch (error) {
      showNotification('删除失败', 'error');
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: '启用',
      INACTIVE: '禁用',
      DELETED: '已删除',
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-700',
      DELETED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const getGenderText = (gender: string) => {
    return gender === 'MALE' ? '男' : '女';
  };

  const getPositionLevelText = (level: string) => {
    const map: Record<string, string> = {
      STAFF: '员工',
      LEADER: '主管',
      MANAGER: '经理',
      DIRECTOR: '总监',
      EXECUTIVE: '高管',
    };
    return map[level] || level;
  };

  const renderDeptTree = (items: Department[], level: number = 0) => {
    return items.map((dept) => (
      <div key={dept.id}>
        <div
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedDepartment?.id === dept.id ? 'bg-blue-50 border border-blue-200' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => handleDeptClick(dept)}
        >
          {dept.children && dept.children.length > 0 ? (
            <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
          ) : (
            <span className="w-4"></span>
          )}
          <i className="fas fa-building text-weyeah-blue"></i>
          <span className="font-medium text-gray-900">{dept.name}</span>
          <span className="text-xs text-gray-400">({dept.code})</span>
        </div>
        {dept.children && dept.children.length > 0 && (
          <div className="border-l border-gray-200 ml-6">
            {renderDeptTree(dept.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">组织架构管理</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-home"></i>
              <span>系统管理</span>
              <span>/</span>
              <span>组织架构</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-100">
            <div className="flex gap-1 px-4">
              <button
                onClick={() => setActiveTab('departments')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'departments'
                    ? 'text-weyeah-blue border-b-2 border-weyeah-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-sitemap mr-2"></i>
                部门管理
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'employees'
                    ? 'text-weyeah-blue border-b-2 border-weyeah-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-users mr-2"></i>
                人员管理
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'roles'
                    ? 'text-weyeah-blue border-b-2 border-weyeah-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-user-shield mr-2"></i>
                角色权限
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'departments' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">部门列表</h3>
                    <button
                      onClick={() => handleAddDepartment()}
                      className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-2"
                    >
                      <i className="fas fa-plus"></i>
                      新增部门
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
                    {departments.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <i className="fas fa-building text-4xl mb-3"></i>
                        <p>暂无部门数据</p>
                      </div>
                    ) : (
                      renderDeptTree(departments)
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">部门详情</h3>
                  {selectedDepartment ? (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">部门编码</div>
                            <div className="font-medium">{selectedDepartment.code}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">部门名称</div>
                            <div className="font-medium">{selectedDepartment.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">部门层级</div>
                            <div className="font-medium">第{selectedDepartment.level}级</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">状态</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedDepartment.status || 'ACTIVE')}`}>
                              {getStatusText(selectedDepartment.status || 'ACTIVE')}
                            </span>
                          </div>
                        </div>
                        {selectedDepartment.leaderName && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">部门负责人</div>
                            <div className="font-medium">{selectedDepartment.leaderName}</div>
                          </div>
                        )}
                        {selectedDepartment.description && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">职能描述</div>
                            <div className="text-gray-700">{selectedDepartment.description}</div>
                          </div>
                        )}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <button
                            onClick={handleEditDepartment}
                            className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700"
                          >
                            <i className="fas fa-edit mr-2"></i>
                            编辑
                          </button>
                          <button
                            onClick={() => handleAddDepartment(selectedDepartment.id!, selectedDepartment.level!)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            添加子部门
                          </button>
                          <button
                            onClick={() => selectedDepartment.id && handleDeleteDepartment(selectedDepartment.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <i className="fas fa-trash mr-2"></i>
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-400">
                      <i className="fas fa-mouse-pointer text-4xl mb-3"></i>
                      <p>请从左侧选择部门查看详情</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <button
                    onClick={handleAddEmployee}
                    className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    新增人员
                  </button>
                  <div className="flex-1 min-w-[300px] relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="搜索员工编号、姓名..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                  >
                    <option value="">全部状态</option>
                    <option value="ACTIVE">在职</option>
                    <option value="INACTIVE">离职</option>
                    <option value="LEAVE">休假</option>
                  </select>
                  <button 
                    onClick={loadEmployees}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                  >
                    <i className="fas fa-filter"></i>
                    筛选
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">员工编号</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">姓名</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">部门</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">职位</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">手机</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {isLoading && employees.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            加载中...
                          </td>
                        </tr>
                      ) : employees.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            暂无数据
                          </td>
                        </tr>
                      ) : (
                        employees.map((emp) => (
                          <tr key={emp.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{emp.employeeNo}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-weyeah-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {emp.name?.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{emp.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{emp.departmentName || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{emp.position || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{emp.phone || '-'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClass(emp.status || 'ACTIVE')}`}>
                                {getStatusText(emp.status || 'ACTIVE')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEditEmployee(emp)}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                                  title="编辑"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  onClick={() => emp.id && handleDeleteEmployee(emp.id)}
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

                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">共 {totalCount} 条记录</div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-500 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="px-3 py-2">第 {currentPage} / {totalPages || 1} 页</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:border-weyeah-blue disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">角色列表</h3>
                  <button
                    onClick={handleAddRole}
                    className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-medium rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    新增角色
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-400">
                      <i className="fas fa-user-shield text-4xl mb-3"></i>
                      <p>暂无角色数据</p>
                    </div>
                  ) : (
                    roles.map((role) => (
                      <div key={role.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-weyeah-blue rounded-lg flex items-center justify-center">
                              <i className="fas fa-user-shield text-white"></i>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{role.name}</div>
                              <div className="text-xs text-gray-400">{role.code}</div>
                            </div>
                          </div>
                          {role.isSystem === 1 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">系统</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{role.description || '暂无描述'}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(role.status || 'ACTIVE')}`}>
                            {getStatusText(role.status || 'ACTIVE')}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditRole(role)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-weyeah-blue"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {role.isSystem !== 1 && (
                              <button 
                                onClick={() => role.id && handleDeleteRole(role.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showDeptModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑部门' : '新增部门'}</h2>
                <button onClick={() => setShowDeptModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">部门编码 *</label>
                    <input
                      type="text"
                      value={deptForm.code}
                      onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="如：DEPT0001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">部门名称 *</label>
                    <input
                      type="text"
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入部门名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">部门负责人</label>
                    <input
                      type="text"
                      value={deptForm.leaderName}
                      onChange={(e) => setDeptForm({ ...deptForm, leaderName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入负责人姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">职能描述</label>
                    <textarea
                      value={deptForm.description}
                      onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入部门职能描述"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeptModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveDepartment}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 disabled:opacity-50"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin mr-2"></i>}
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {showEmpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑员工' : '新增员工'}</h2>
                <button onClick={() => setShowEmpModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">员工编号 *</label>
                    <input
                      type="text"
                      value={empForm.employeeNo}
                      onChange={(e) => setEmpForm({ ...empForm, employeeNo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="如：EMP000001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                    <input
                      type="text"
                      value={empForm.name}
                      onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                    <select
                      value={empForm.gender}
                      onChange={(e) => setEmpForm({ ...empForm, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="MALE">男</option>
                      <option value="FEMALE">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">手机号码</label>
                    <input
                      type="text"
                      value={empForm.phone}
                      onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入手机号码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
                    <input
                      type="email"
                      value={empForm.email}
                      onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入邮箱"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">所属部门 *</label>
                    <select
                      value={empForm.departmentId || ''}
                      onChange={(e) => setEmpForm({ ...empForm, departmentId: Number(e.target.value) || undefined })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="">请选择部门</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
                    <input
                      type="text"
                      value={empForm.position}
                      onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入职位"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">职级</label>
                    <select
                      value={empForm.positionLevel}
                      onChange={(e) => setEmpForm({ ...empForm, positionLevel: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="STAFF">员工</option>
                      <option value="LEADER">主管</option>
                      <option value="MANAGER">经理</option>
                      <option value="DIRECTOR">总监</option>
                      <option value="EXECUTIVE">高管</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">入职日期</label>
                    <input
                      type="date"
                      value={empForm.hireDate}
                      onChange={(e) => setEmpForm({ ...empForm, hireDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                    <select
                      value={empForm.status}
                      onChange={(e) => setEmpForm({ ...empForm, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                    >
                      <option value="ACTIVE">在职</option>
                      <option value="INACTIVE">离职</option>
                      <option value="LEAVE">休假</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowEmpModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEmployee}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 disabled:opacity-50"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin mr-2"></i>}
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {showRoleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '编辑角色' : '新增角色'}</h2>
                <button onClick={() => setShowRoleModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">角色编码 *</label>
                    <input
                      type="text"
                      value={roleForm.code}
                      onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="如：ROLE_ADMIN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">角色名称 *</label>
                    <input
                      type="text"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入角色名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">角色描述</label>
                    <textarea
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
                      placeholder="请输入角色描述"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveRole}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 disabled:opacity-50"
                >
                  {isLoading && <i className="fas fa-spinner fa-spin mr-2"></i>}
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
