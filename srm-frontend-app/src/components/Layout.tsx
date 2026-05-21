import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

interface Notification {
  id: number;
  type: 'approval' | 'system' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'approval',
      title: '合同审批待处理',
      description: '采购合同 HT2024001 需要您审批',
      time: '5分钟前',
      read: false,
      link: '/contracts'
    },
    {
      id: 2,
      type: 'approval',
      title: '定价审批待处理',
      description: '供应商报价调整需要您审批',
      time: '15分钟前',
      read: false,
      link: '/pricing'
    },
    {
      id: 3,
      type: 'system',
      title: '系统更新通知',
      description: '系统将于今晚22:00进行维护升级',
      time: '1小时前',
      read: true
    },
    {
      id: 4,
      type: 'alert',
      title: '资质到期预警',
      description: '供应商 上海机电科技有限公司 营业执照即将到期',
      time: '2小时前',
      read: false,
      link: '/suppliers'
    },
    {
      id: 5,
      type: 'approval',
      title: '供应商审核待处理',
      description: '新供应商申请需要您审核',
      time: '3小时前',
      read: true,
      link: '/suppliers'
    }
  ]);

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: '仪表盘' },
    { path: '/suppliers', icon: 'fas fa-building', label: '供应商管理' },
    { path: '/materials', icon: 'fas fa-boxes', label: '物料管理' },
    { path: '/categories', icon: 'fas fa-sitemap', label: '品类管理' },
    { path: '/contracts', icon: 'fas fa-file-contract', label: '合同管理' },
    { path: '/contract-templates', icon: 'fas fa-file-alt', label: '合同模板' },
    { path: '/logistics', icon: 'fas fa-truck', label: '物流管理' },
    { path: '/pricing', icon: 'fas fa-tag', label: '定价管理' },
    { path: '/organization', icon: 'fas fa-users', label: '组织架构' },
    { path: '/settings', icon: 'fas fa-cog', label: '系统设置' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval': return 'fa-file-signature';
      case 'system': return 'fa-bell';
      case 'alert': return 'fa-exclamation-circle';
      default: return 'fa-info-circle';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'approval': return 'text-blue-600 bg-blue-50';
      case 'system': return 'text-gray-600 bg-gray-50';
      case 'alert': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 h-16 flex items-center justify-between px-6 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg text-white mr-2"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
            >
              <i className="fas fa-bell text-lg"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">消息通知</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-weyeah-blue hover:text-weyeah-blue-700"
                  >
                    全部已读
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <i className="fas fa-bell text-4xl mb-2"></i>
                      <p>暂无通知</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={notification.link || '#'}
                        onClick={() => markAsRead(notification.id)}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-weyeah-blue rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">{notification.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    查看全部通知
                  </button>
                </div>
              </div>
            )}
          </div>
          
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
        <aside className={`bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <nav className="py-6">
            {isSidebarOpen && (
              <>
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
              </>
            )}
            {!isSidebarOpen && (
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center px-3 py-3 transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-weyeah-blue/10 to-transparent text-weyeah-blue'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-weyeah-blue'
                    }`}
                    title={item.label}
                  >
                    <i className={item.icon}></i>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>

      {/* 点击外部关闭通知 */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </div>
  );
}
