import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: '仪表盘' },
    { path: '/suppliers', icon: 'fas fa-building', label: '供应商管理' },
    { path: '/materials', icon: 'fas fa-boxes', label: '物料管理' },
    { path: '/categories', icon: 'fas fa-sitemap', label: '品类管理' },
    { path: '/contracts', icon: 'fas fa-file-contract', label: '合同管理' },
    { path: '/logistics', icon: 'fas fa-truck', label: '物流管理' },
    { path: '/pricing', icon: 'fas fa-tag', label: '定价管理' },
    { path: '/organization', icon: 'fas fa-users', label: '组织架构' },
    { path: '/settings', icon: 'fas fa-cog', label: '系统设置' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 h-16 flex items-center justify-between px-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-industry text-white text-xl"></i>
            </div>
            <span className="text-white font-bold text-xl">Weyeah</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <h1 className="text-white font-semibold text-lg">SRM采购管理系统</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-user"></i>
            </div>
            <span className="font-medium">管理员</span>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            退出
          </button>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className={`bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
          <nav className="py-6">
            <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              业务管理
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-weyeah-blue/10 to-transparent text-weyeah-blue font-medium border-l-3 border-weyeah-blue'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-weyeah-blue border-l-3 border-transparent'
                  }`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
