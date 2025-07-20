import React from 'react';

const MetaSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'input', name: '数据录入', icon: '✏️' },
    { id: 'overview', name: '数据总览', icon: '📊' },
    { id: 'daily', name: '每日统计', icon: '📅' },
    { id: 'leaderboard', name: '龙虎榜', icon: '🏆' },
    { id: 'advertisers', name: '投放人员', icon: '👥' },
    { id: 'accounts', name: '广告账户', icon: '💳' },
    { id: 'summary', name: '每日总结', icon: '📝' },
    { id: 'export', name: '数据导出', icon: '📤' }
  ];

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-4 sm:p-6">
        {/* 移动端关闭按钮 */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-lg font-semibold text-blue-300">功能菜单</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-lg font-semibold mb-6 text-blue-300 hidden lg:block">功能菜单</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose(); // 移动端点击后关闭侧边栏
              }}
              className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 bg-opacity-80 shadow-lg transform scale-105'
                  : 'hover:bg-gray-700 hover:bg-opacity-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 hidden lg:block">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
          <h3 className="font-semibold mb-2">投放人员</h3>
          <div className="flex flex-wrap gap-2">
            {['青', '乔', '白', '丁', '妹'].map((name) => (
              <span key={name} className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default MetaSidebar;