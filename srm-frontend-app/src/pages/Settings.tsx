import { useState } from 'react';
import Layout from '../components/Layout';

interface SettingsProps {
  onLogout: () => void;
}

export default function Settings({ onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const tabs = [
    { id: 'general', name: '基本设置', icon: 'fa-cog' },
    { id: 'system', name: '系统配置', icon: 'fa-sliders-h' },
    { id: 'security', name: '安全设置', icon: 'fa-shield-alt' },
    { id: 'notification', name: '通知设置', icon: 'fa-bell' },
    { id: 'logs', name: '操作日志', icon: 'fa-history' },
  ];

  return (
    <Layout onLogout={onLogout}>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">系统设置</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <i className="fas fa-home"></i>
            <span>系统管理</span>
            <span>/</span>
            <span>系统设置</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
                <nav className="space-y-1">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-weyeah-blue text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <i className={`fas ${item.icon}`}></i>
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">基本设置</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">系统名称</label>
                        <input
                          type="text"
                          defaultValue="SRM采购管理系统"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                        <input
                          type="text"
                          defaultValue="Weyeah Corporation"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">系统描述</label>
                        <textarea
                          rows={4}
                          defaultValue="企业级供应商关系管理平台"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue"
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                          重置
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                        >
                          保存设置
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'system' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">系统配置</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">语言设置</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue">
                          <option>简体中文</option>
                          <option>English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">时区设置</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue">
                          <option>Asia/Shanghai (UTC+8)</option>
                          <option>UTC</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                          重置
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                        >
                          保存设置
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">安全设置</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">两步验证</p>
                          <p className="text-sm text-gray-500">增加账户安全性</p>
                        </div>
                        <button className="px-4 py-2 bg-weyeah-blue text-white rounded-lg text-sm">
                          启用
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">密码过期</p>
                          <p className="text-sm text-gray-500">强制定期修改密码</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-200 rounded-lg">
                          <option>启用</option>
                          <option>禁用</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                          重置
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                        >
                          保存设置
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notification' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">通知设置</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">供应商通知</p>
                          <p className="text-sm text-gray-500">供应商状态变更通知</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-200 rounded-lg">
                          <option>启用</option>
                          <option>禁用</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">审批通知</p>
                          <p className="text-sm text-gray-500">待审批事项提醒</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-200 rounded-lg">
                          <option>启用</option>
                          <option>禁用</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">合同到期提醒</p>
                          <p className="text-sm text-gray-500">合同到期前提醒</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-200 rounded-lg">
                          <option>启用</option>
                          <option>禁用</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">价格变更通知</p>
                          <p className="text-sm text-gray-500">物料价格变更通知</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-200 rounded-lg">
                          <option>启用</option>
                          <option>禁用</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                          重置
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue"
                        >
                          保存设置
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">操作日志</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">时间</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作人</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作类型</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">详情</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">2026-05-14 09:30</td>
                            <td className="px-4 py-3 text-sm text-gray-900">admin</td>
                            <td className="px-4 py-3 text-sm text-gray-900">登录</td>
                            <td className="px-4 py-3 text-sm text-gray-900">用户登录系统</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">2026-05-14 09:15</td>
                            <td className="px-4 py-3 text-sm text-gray-900">admin</td>
                            <td className="px-4 py-3 text-sm text-gray-900">修改</td>
                            <td className="px-4 py-3 text-sm text-gray-900">修改系统设置</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showNotification && (
          <div className="fixed top-20 right-6 z-50 px-6 py-4 rounded-lg text-white shadow-lg bg-green-500">
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle"></i>
              <span>设置保存成功</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
