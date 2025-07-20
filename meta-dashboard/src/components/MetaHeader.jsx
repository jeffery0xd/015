import React from 'react';

const MetaHeader = ({ onMenuToggle }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-lg">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 移动端菜单按钮 */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-2xl font-bold text-white">广告投放数据统计系统</h1>
              <p className="text-blue-100 text-xs sm:text-sm hidden md:block">Meta Advertisement Analytics Dashboard</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-white">广告统计</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right text-white hidden sm:block">
              <div className="text-xs sm:text-sm opacity-90">实时汇率</div>
              <div className="text-sm sm:text-lg font-semibold">1 MX$ = 0.055 US$</div>
            </div>
            <div className="text-right text-white sm:hidden">
              <div className="text-xs font-semibold">0.055</div>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MetaHeader;