import { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });

      if (response.data.code === 200) {
        const token = response.data.data.token;
        if (rememberMe) {
          localStorage.setItem('token', token);
        }
        onLogin(token);
      } else {
        setError(response.data.message || '登录失败');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('登录失败，请检查网络连接或服务器状态');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-weyeah-blue via-weyeah-blue-700 to-weyeah-blue-500 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-weyeah-blue to-weyeah-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-industry text-white text-2xl"></i>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 bg-clip-text text-transparent">
                Weyeah
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SRM采购管理系统</h1>
            <p className="text-gray-500">企业级供应商关系管理平台</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue transition-all"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-weyeah-blue focus:border-weyeah-blue transition-all"
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-weyeah-blue border-gray-300 rounded focus:ring-weyeah-blue"
                />
                <span className="ml-2 text-sm text-gray-600">记住登录</span>
              </label>
              <a href="#" className="text-sm text-weyeah-blue hover:text-weyeah-blue-700 hover:underline">
                忘记密码？
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white font-semibold rounded-xl hover:from-weyeah-blue-700 hover:to-weyeah-blue transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  登录中...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  登录系统
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>测试账号：</strong>admin / admin123
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-10 py-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">© 2026 Weyeah 版权所有</p>
        </div>
      </div>
    </div>
  );
}
