import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import { ThemeProvider } from './components/ThemeProvider';
import EnhancedHeader from './components/EnhancedHeader';
import EnhancedSidebar from './components/EnhancedSidebar';
import DataOverview from './components/DataOverview';
import ModernDataOverview from './components/ModernDataOverview';
import DailyStats from './components/DailyStats';
import ROIRanking from './components/ROIRanking';
import Leaderboard from './components/Leaderboard';
import DailySummary from './components/DailySummary';
import DataExport from './components/DataExport';
import AdvertisingDataInput from './components/AdvertisingDataInput';
import RechargeInput from './components/RechargeInput';
import RechargeManager from './components/RechargeManager';
import DailyOrders from './components/DailyOrders';
import DailyContest from './components/DailyContest';
import AnonymousChat from './components/AnonymousChat';
import ProductImageDownloader from './components/ProductImageDownloader';
import AccountRequests from './components/AccountRequests';

import ModernDashboard from './components/ModernDashboard';

import AdDataEntry from './components/AdDataEntry';
import Dashboard from './components/Dashboard';
import UnifiedDashboard from './components/UnifiedDashboard';
import RewrittenDashboard from './components/RewrittenDashboard';
import TestData from './components/TestData';
// import ModernAccountRequests from './components/ModernAccountRequests';
import NotificationBanner from './components/NotificationBanner';
import WebsiteChecker from './components/WebsiteChecker';


function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for navigation events from dashboard and other components
  useEffect(() => {
    const handleNavigation = (event) => {
      setActiveTab('account-requests');
    };

    const handleModuleNavigation = (event) => {
      const targetModule = event.detail;
      if (targetModule) {
        setActiveTab(targetModule);
      }
    };

    window.addEventListener('navigateToAccountRequests', handleNavigation);
    window.addEventListener('navigateToModule', handleModuleNavigation);
    return () => {
      window.removeEventListener('navigateToAccountRequests', handleNavigation);
      window.removeEventListener('navigateToModule', handleModuleNavigation);
    };
  }, []);

  // 检查登录状态
  useEffect(() => {
    const authStatus = localStorage.getItem('websiteAuth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('websiteAuth');
    setIsAuthenticated(false);
    setActiveTab('overview');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <RewrittenDashboard />;
      case 'input':
        return <ModernDashboard />;
      case 'recharge-input':
        return <RechargeInput />;
      case 'daily':
        return <DailyStats />;
      case 'roi-ranking':
        return <ROIRanking />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'export':
        return <DataExport />;
      case 'recharge':
        return <RechargeManager />;
      case 'daily-orders':
        return <DailyOrders />;

      case 'product-downloader':
        return <ProductImageDownloader />;
      case 'product-image':
        return <ProductImageDownloader />;
      case 'account-requests':
        return <AccountRequests />;
      case 'account-request':
        return <AccountRequests />;

      case 'ad-data':
        return <AdDataEntry />;
      case 'test-data':
        return <TestData />;  // 临时测试页面
      case 'website-checker':
        return <WebsiteChecker />;
      default:
        return <RewrittenDashboard />;
    }
  };

  // 如果未登录，显示登录页面
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen relative overflow-hidden transition-colors duration-300 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
        {/* 全局光效背景 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        </div>

        <NotificationBanner />
        <EnhancedHeader 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />
        <div className="flex relative z-10">
          <EnhancedSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:ml-72 xl:ml-80 min-h-screen transition-all duration-300">
            <div className="max-w-7xl mx-auto relative">
              <div className="backdrop-blur-sm bg-white/80 rounded-3xl border border-gray-200/50 p-6 shadow-2xl">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>

        <style jsx global>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(-5px) rotate(240deg); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
            50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3); }
          }
          
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
          
          .glass-effect {
            backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default App;