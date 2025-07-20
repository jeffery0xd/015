import React, { useState } from 'react';
import MetaHeader from './components/MetaHeader';
import MetaSidebar from './components/MetaSidebar';
import DataOverview from './components/DataOverview';
import DailyStats from './components/DailyStats';
import Leaderboard from './components/Leaderboard';
import DailySummary from './components/DailySummary';
import DataExport from './components/DataExport';
import DataInput from './components/DataInput';

function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return <DataInput />;
      case 'overview':
        return <DataOverview />;
      case 'daily':
        return <DailyStats />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'advertisers':
        return <DataOverview />; // 可以复用数据总览或创建专门的投放人员管理页面
      case 'accounts':
        return <DailyStats />; // 可以复用每日统计或创建专门的账户管理页面
      case 'summary':
        return <DailySummary />;
      case 'export':
        return <DataExport />;
      default:
        return <DataInput />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <MetaHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <MetaSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;