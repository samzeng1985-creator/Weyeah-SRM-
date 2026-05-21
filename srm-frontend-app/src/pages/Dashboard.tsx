import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { supplierApi } from '../services/supplier';
import { materialApi } from '../services/material';
import { contractApi } from '../services/contract';
import { pricingApi } from '../services/pricing';

interface DashboardProps {
  onLogout: () => void;
}

interface Stats {
  supplierTotal: number;
  supplierPending: number;
  supplierQualified: number;
  materialTotal: number;
  materialActive: number;
  contractTotal: number;
  contractActive: number;
  contractDraft: number;
  pricingTotal: number;
  pricingActive: number;
}

interface PendingItem {
  id: number;
  type: string;
  name: string;
  status: string;
  createdAt: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    supplierTotal: 0,
    supplierPending: 0,
    supplierQualified: 0,
    materialTotal: 0,
    materialActive: 0,
    contractTotal: 0,
    contractActive: 0,
    contractDraft: 0,
    pricingTotal: 0,
    pricingActive: 0,
  });
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [suppliersRes, materialsRes, contractsRes, pricingRes] = await Promise.all([
        supplierApi.getList({ page: 1, pageSize: 1000 }),
        materialApi.getList({ page: 1, pageSize: 1000 }),
        contractApi.getList({ page: 1, pageSize: 1000 }),
        pricingApi.getList({ page: 1, pageSize: 1000 }),
      ]);

      const suppliers = suppliersRes.data?.list || [];
      const materials = materialsRes.data?.list || [];
      const contracts = contractsRes.data?.list || [];
      const pricings = pricingRes.data?.list || [];

      setStats({
        supplierTotal: suppliers.length,
        supplierPending: suppliers.filter((s: any) => s.status === 'PENDING').length,
        supplierQualified: suppliers.filter((s: any) => s.status === 'QUALIFIED').length,
        materialTotal: materials.length,
        materialActive: materials.filter((m: any) => m.status === 'ACTIVE').length,
        contractTotal: contracts.length,
        contractActive: contracts.filter((c: any) => c.status === 'ACTIVE' || c.status === 'EXECUTING').length,
        contractDraft: contracts.filter((c: any) => c.status === 'DRAFT').length,
        pricingTotal: pricings.length,
        pricingActive: pricings.filter((p: any) => p.status === 'ACTIVE').length,
      });

      const pending: PendingItem[] = [];
      
      suppliers
        .filter((s: any) => s.status === 'PENDING')
        .slice(0, 3)
        .forEach((s: any) => {
          pending.push({
            id: s.id,
            type: '供应商审核',
            name: s.name,
            status: '待审核',
            createdAt: s.createdAt || new Date().toISOString(),
          });
        });

      contracts
        .filter((c: any) => c.status === 'DRAFT')
        .slice(0, 3)
        .forEach((c: any) => {
          pending.push({
            id: c.id,
            type: '合同审批',
            name: c.name,
            status: '草稿',
            createdAt: c.createdAt || new Date().toISOString(),
          });
        });

      pricings
        .filter((p: any) => p.status === 'PENDING')
        .slice(0, 2)
        .forEach((p: any) => {
          pending.push({
            id: p.id,
            type: '定价审批',
            name: `供应商${p.supplierId} - 物料${p.materialId}`,
            status: '待审批',
            createdAt: p.createdAt || new Date().toISOString(),
          });
        });

      setPendingItems(pending);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case '供应商审核':
        return { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' };
      case '合同审批':
        return { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' };
      case '定价审批':
        return { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'bg-gray-100' };
    }
  };

  const PieChart = ({ data, title }: { data: ChartData[], title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    const segments = data.map((item, index) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      if (percentage === 100) {
        return <circle key={index} cx="50" cy="50" r="40" fill={item.color} />;
      }
      
      return (
        <path
          key={index}
          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
          fill={item.color}
        />
      );
    });

    return (
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          {segments}
        </svg>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-600">{item.name}</span>
              <span className="text-xs font-medium text-gray-900">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BarChart = ({ data, title, yLabel }: { data: ChartData[], title: string, yLabel: string }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    return (
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <div className="flex items-end justify-around h-40 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex justify-center items-end h-32">
                <div
                  className="w-10 rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                    minHeight: '4px',
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.name}</span>
              <span className="text-xs font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const mockMonthlyData: ChartData[] = [
    { name: '1月', value: 12, color: '#3B82F6' },
    { name: '2月', value: 19, color: '#3B82F6' },
    { name: '3月', value: 15, color: '#3B82F6' },
    { name: '4月', value: 25, color: '#3B82F6' },
    { name: '5月', value: 22, color: '#3B82F6' },
    { name: '6月', value: 30, color: '#3B82F6' },
  ];

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-gray-500 mt-1">欢迎回来，今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <i className="fas fa-spinner fa-spin text-3xl text-weyeah-blue"></i>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">供应商总数</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.supplierTotal}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-green-600">合格 {stats.supplierQualified}</span>
                      <span className="text-orange-600">待审 {stats.supplierPending}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <i className="fas fa-building text-xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">物料总数</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.materialTotal}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-green-600">启用 {stats.materialActive}</span>
                      <span className="text-gray-400">停用 {stats.materialTotal - stats.materialActive}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <i className="fas fa-boxes text-xl text-green-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">合同总数</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.contractTotal}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-green-600">执行中 {stats.contractActive}</span>
                      <span className="text-gray-400">草稿 {stats.contractDraft}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                    <i className="fas fa-file-contract text-xl text-orange-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">定价记录</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pricingTotal}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-green-600">生效 {stats.pricingActive}</span>
                      <span className="text-gray-400">待审 {stats.pricingTotal - stats.pricingActive}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <i className="fas fa-tags text-xl text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-chart-line text-blue-500 mr-2"></i>
                    月度合同趋势
                  </h2>
                </div>
                <BarChart data={mockMonthlyData} title="" yLabel="合同数" />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <PieChart
                  title="供应商状态分布"
                  data={[
                    { name: '合格', value: stats.supplierQualified, color: '#10B981' },
                    { name: '待审', value: stats.supplierPending, color: '#F59E0B' },
                    { name: '其他', value: stats.supplierTotal - stats.supplierQualified - stats.supplierPending, color: '#9CA3AF' },
                  ].filter(d => d.value > 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-bell text-orange-500 mr-2"></i>
                    待处理事项
                  </h2>
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                    {pendingItems.length} 项
                  </span>
                </div>
                <div className="p-5">
                  {pendingItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <i className="fas fa-check-circle text-4xl mb-3 text-green-300"></i>
                      <p>暂无待处理事项</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingItems.map((item, index) => {
                        const colors = getStatusColor(item.type);
                        return (
                          <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${colors.bg} hover:shadow-sm transition-shadow`}>
                            <div className={`w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                              <i className={`fas ${item.type === '供应商审核' ? 'fa-user-check' : item.type === '合同审批' ? 'fa-file-signature' : 'fa-tag'} ${colors.text}`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.type}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${colors.bg} ${colors.text}`}>
                                {item.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-chart-pie text-blue-500 mr-2"></i>
                    快捷操作
                  </h2>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/suppliers?action=create" className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                      <i className="fas fa-plus-circle text-2xl text-blue-600 mb-2"></i>
                      <span className="text-sm font-medium text-gray-700">新增供应商</span>
                    </Link>
                    <Link to="/materials?action=create" className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                      <i className="fas fa-cube text-2xl text-green-600 mb-2"></i>
                      <span className="text-sm font-medium text-gray-700">新增物料</span>
                    </Link>
                    <Link to="/contracts?action=create" className="flex flex-col items-center justify-center p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                      <i className="fas fa-file-alt text-2xl text-orange-600 mb-2"></i>
                      <span className="text-sm font-medium text-gray-700">创建合同</span>
                    </Link>
                    <Link to="/pricing?action=create" className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                      <i className="fas fa-dollar-sign text-2xl text-purple-600 mb-2"></i>
                      <span className="text-sm font-medium text-gray-700">新增定价</span>
                    </Link>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">数据概览</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">供应商合格率</span>
                        <span className="font-medium text-gray-900">
                          {stats.supplierTotal > 0 ? Math.round((stats.supplierQualified / stats.supplierTotal) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all" 
                          style={{ width: `${stats.supplierTotal > 0 ? (stats.supplierQualified / stats.supplierTotal) * 100 : 0}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-gray-500">物料启用率</span>
                        <span className="font-medium text-gray-900">
                          {stats.materialTotal > 0 ? Math.round((stats.materialActive / stats.materialTotal) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all" 
                          style={{ width: `${stats.materialTotal > 0 ? (stats.materialActive / stats.materialTotal) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
