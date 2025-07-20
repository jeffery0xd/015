import React from 'react';
import { useTheme } from './ThemeProvider';

const EnhancedSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { isDark } = useTheme();
  
  const menuItems = [
    { id: 'overview', name: '数据概览', icon: '📊', desc: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'ad-data', name: '广告数据录入', icon: '📈', desc: 'Ad Data Entry', gradient: 'from-blue-500 to-indigo-600' },
    { id: 'daily', name: '每日统计', icon: '📅', desc: 'Daily Stats', gradient: 'from-purple-500 to-pink-500' },
    { id: 'roi-ranking', name: '龙虎榜', icon: '🏆', desc: 'ROI Ranking', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'export', name: '数据导出', icon: '📤', desc: 'Export', gradient: 'from-indigo-500 to-purple-500' },

    { id: 'recharge', name: '充值管理', icon: '💰', desc: 'Recharge', gradient: 'from-green-500 to-teal-500' },
    { id: 'daily-orders', name: '上单金额', icon: '💵', desc: 'Orders', gradient: 'from-red-500 to-pink-500' },

    { id: 'product-downloader', name: '产品图片下载', icon: '📦', desc: 'Product Images', gradient: 'from-violet-500 to-purple-500' },
    { id: 'account-requests', name: '账户申请', icon: '🔐', desc: 'Account Requests', gradient: 'from-slate-500 to-gray-500' },
    { id: 'website-checker', name: '网站检测', icon: '🔍', desc: 'Website Checker', gradient: 'from-rose-500 to-pink-500' }
  ];

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        glass-effect border-r border-white/20 dark:border-gray-700/30 shadow-2xl
      `}>
        {/* 光效装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-10 blur-2xl ${
            isDark ? 'bg-purple-500' : 'bg-blue-400'
          }`} style={{
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
          <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-2xl ${
            isDark ? 'bg-indigo-500' : 'bg-cyan-400'
          }`} style={{
            animation: 'pulse 6s ease-in-out infinite reverse'
          }}></div>
        </div>

        <div className="relative flex flex-col h-full">
          {/* 侧边栏顶部 */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`relative p-3 rounded-2xl bg-gradient-to-br ${
                  isDark ? 'from-purple-600 to-indigo-600' : 'from-blue-500 to-cyan-500'
                } shadow-lg`}>
                  <div className="w-6 h-6 flex items-center justify-center text-white font-bold">
                    ⚡
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    导航菜单
                  </h2>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Navigation
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`lg:hidden p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 菜单项 */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={`
                  group relative w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left 
                  transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                  ${activeTab === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]`
                    : isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                  }
                `}
              >
                {/* 活跃状态的光效 */}
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
                )}
                
                <div className={`
                  relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 
                  ${activeTab === item.id 
                    ? 'bg-white/20 backdrop-blur-sm shadow-inner' 
                    : isDark 
                      ? 'bg-gray-800 group-hover:bg-gray-700' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <span className="text-xl filter drop-shadow-sm">{item.icon}</span>
                  {activeTab === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">{item.name}</div>
                  <div className={`text-sm opacity-75 truncate ${
                    activeTab === item.id ? 'text-white/80' : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {item.desc}
                  </div>
                </div>
                
                {activeTab === item.id && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* 底部信息 */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className={`relative p-4 rounded-2xl overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
            }`}>
              {/* 装饰性光效 */}
              <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-5 blur-xl ${
                isDark ? 'bg-purple-500' : 'bg-blue-500'
              }`}></div>
              
              <div className="relative text-center">
                <div className={`text-sm font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Analytics Pro
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Version 3.0.0
                </div>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    系统正常运行
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EnhancedSidebar;