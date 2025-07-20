import React from 'react';
import { useTheme } from './ThemeProvider';

const EnhancedHeader = ({ onMenuToggle, onLogout, isAuthenticated }) => {
  const { isDark, toggleTheme, beijingTime, mexicoTime } = useTheme();

  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    if (!date) return '--/--/--';
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <>
      {/* 光效背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl transition-all duration-1000 ${
          isDark ? 'bg-purple-500' : 'bg-blue-400'
        }`} style={{
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl transition-all duration-1000 ${
          isDark ? 'bg-indigo-500' : 'bg-cyan-400'
        }`} style={{
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
      </div>

      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* 左侧：菜单和Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className={`relative p-2 rounded-xl ${
                isDark ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                <div className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg">
                  ⚡
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Analytics Pro
                </h1>
                <p className="text-sm text-gray-600">
                  数据分析平台
                </p>
              </div>
            </div>
          </div>

          {/* 中间：时间显示 */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* 北京时间 */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/90 border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-700">🇨🇳 北京</div>
                <div className="text-sm font-mono font-bold text-gray-900">
                  {beijingTime ? formatTime(beijingTime) : '--:--:--'}
                </div>
                <div className="text-xs text-gray-600">
                  {beijingTime ? formatDate(beijingTime) : '--/--/--'}
                </div>
              </div>
            </div>

            {/* 墨西哥时间 */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/90 border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-700">🇲🇽 墨西哥</div>
                <div className="text-sm font-mono font-bold text-gray-900">
                  {mexicoTime ? formatTime(mexicoTime) : '--:--:--'}
                </div>
                <div className="text-xs text-gray-600">
                  {mexicoTime ? formatDate(mexicoTime) : '--/--/--'}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：控制按钮 */}
          <div className="flex items-center space-x-3">
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
              title="切换主题"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* 状态指示器 */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl glass-effect">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-800">
                在线
              </span>
            </div>

            {/* 登出按钮 */}
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'text-red-400 hover:text-red-300 hover:bg-gray-800' 
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
                title="退出登录"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
};

export default EnhancedHeader;