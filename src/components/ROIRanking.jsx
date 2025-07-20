import React, { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseService';
import Fireworks from './Fireworks';

const ROIRanking = () => {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    loadROIRankings();
  }, [selectedDate]);

  const loadROIRankings = async () => {
    try {
      setLoading(true);
      const { data: adData, error } = await supabase
        .from('app_e87b41cfe355428b8146f8bae8184e10_ad_data_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('获取数据错误:', error);
        throw error;
      }
      
      // 筛选指定日期的数据
      const filteredData = adData.filter(item => item.date === selectedDate);
      
      // 按投放人员分组计算ROI
      const advertiserROI = {};
      const advertisers = ['青', '乔', '白', '丁', '妹'];
      
      advertisers.forEach(advertiser => {
        const advertiserData = filteredData.filter(item => item.staff === advertiser);
        
        if (advertiserData.length > 0) {
          const totalCreditCard = advertiserData.reduce((sum, item) => sum + parseFloat(item.credit_card_amount || 0), 0);
          const totalAdSpend = advertiserData.reduce((sum, item) => sum + parseFloat(item.ad_spend || 0), 0);
          const totalOrders = advertiserData.reduce((sum, item) => sum + parseInt(item.credit_card_orders || 0), 0);
          const totalPaymentInfo = advertiserData.reduce((sum, item) => sum + parseInt(item.payment_info_count || 0), 0);
          
          // 将信用卡收款从MX$转换为USD（假设汇率为20.0）
          const exchangeRate = 20.0;
          const totalCreditCardUSD = totalCreditCard / exchangeRate;
          
          // 计算ROI = 信用卡收款USD / 广告花费USD
          const roi = totalAdSpend > 0 ? (totalCreditCardUSD / totalAdSpend) : 0;
          
          advertiserROI[advertiser] = {
            advertiser,
            creditCardAmount: totalCreditCard, // MX$原值
            creditCardAmountUSD: totalCreditCardUSD, // USD换算值
            adSpend: totalAdSpend,
            roi: roi,
            roiPercentage: roi * 100,
            orders: totalOrders,
            paymentInfo: totalPaymentInfo,
            recordCount: advertiserData.length
          };
        }
      });
      
      // 转换为数组并按ROI排序
      const sortedRankings = Object.values(advertiserROI)
        .filter(item => item.adSpend > 0) // 只显示有广告花费的
        .sort((a, b) => b.roi - a.roi);
      
      setRankings(sortedRankings);
    } catch (error) {
      console.error('Error loading ROI rankings:', error);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'MX$') {
      return `MX$${(amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '👑';
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getRankTitle = (index, totalCount) => {
    if (index === 0) return '👑 扎克';
    if (index === 1) return '🥇 伯格';
    if (index === 2) return '🥈 卧龙';
    if (index === 3) return '🥉 凤雏';
    if (index === totalCount - 1 && totalCount > 4) return '🍉 瓜皮';
    return '参与者';
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'from-yellow-400 to-yellow-600 text-white';
      case 1: return 'from-gray-400 to-gray-600 text-white';
      case 2: return 'from-orange-400 to-orange-600 text-white';
      default: return 'from-blue-50 to-blue-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Fireworks 
        isVisible={showFireworks} 
        onComplete={() => setShowFireworks(false)} 
      />
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">每日龙虎榜</h2>
          <p className="text-gray-600">ROI排行榜（信用卡收款/广告花费）</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={loadROIRankings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新排行
          </button>
        </div>
      </div>

      {rankings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无排行数据</h3>
          <p className="text-gray-500">请先在"广告数据录入"中添加 {selectedDate} 的数据</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((ranking, index) => (
            <div
              key={ranking.advertiser}
              className={`bg-gradient-to-r ${getRankColor(index)} rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {ranking.advertiser} 
                      <span className="ml-3 px-3 py-1 bg-white bg-opacity-40 text-sm font-bold rounded-full border border-white border-opacity-50">
                        {getRankTitle(index, rankings.length)}
                      </span>
                    </h3>
                    <p className="text-sm opacity-80">{ranking.recordCount} 条记录</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {ranking.roi.toFixed(2)}
                  </div>
                  <p className="text-sm opacity-80">ROI</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {formatCurrency(ranking.creditCardAmount, 'MX$')}
                  </div>
                  <div className="text-xs opacity-80">
                    ({formatCurrency(ranking.creditCardAmountUSD)} USD)
                  </div>
                  <p className="text-xs opacity-80">信用卡收款</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {formatCurrency(ranking.adSpend)}
                  </div>
                  <p className="text-xs opacity-80">广告花费</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {formatNumber(ranking.orders)}
                  </div>
                  <p className="text-xs opacity-80">订单数量</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {formatNumber(ranking.paymentInfo)}
                  </div>
                  <p className="text-xs opacity-80">支付信息</p>
                </div>
              </div>

              {/* ROI 进度条 */}
              <div className="mt-4">
                <div className="flex justify-between text-xs opacity-80 mb-1">
                  <span>ROI表现</span>
                  <span>{ranking.roi.toFixed(2)}</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${Math.min(ranking.roi * 50, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 统计摘要 */}
      {rankings.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 当日统计摘要</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(rankings.reduce((sum, r) => sum + r.creditCardAmount, 0), 'MX$')}
              </div>
              <div className="text-xs text-gray-500">
                ({formatCurrency(rankings.reduce((sum, r) => sum + r.creditCardAmountUSD, 0))} USD)
              </div>
              <div className="text-sm text-gray-600">总收款</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(rankings.reduce((sum, r) => sum + r.adSpend, 0))}
              </div>
              <div className="text-sm text-gray-600">总花费</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(rankings.reduce((sum, r) => sum + r.creditCardAmountUSD, 0) / rankings.reduce((sum, r) => sum + r.adSpend, 0)).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">平均ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {rankings.length}
              </div>
              <div className="text-sm text-gray-600">参与人数</div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ROIRanking;