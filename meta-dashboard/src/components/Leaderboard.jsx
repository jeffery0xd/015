import React, { useState } from 'react';
import { getDailyLeaderboard, exchangeRate } from '../data/advertisingData';

const Leaderboard = () => {
  const [selectedDate, setSelectedDate] = useState('2025-01-14');
  const leaderboardData = getDailyLeaderboard(selectedDate);

  const formatMXN = (value) => `MX$${value.toLocaleString()}`;
  const formatUSD = (value) => `$${value.toLocaleString()}`;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">每日龙虎榜</h2>
          <span className="text-xl sm:text-2xl">🏆</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <label className="text-sm font-medium text-gray-700">选择日期:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="text-gray-500 text-lg">选定日期无数据</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 前三名特殊展示 */}
          {leaderboardData.slice(0, 3).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {leaderboardData.slice(0, 3).map((item) => (
                <div key={item.id} className={`bg-gradient-to-br ${getRankColor(item.rank)} rounded-xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{getRankIcon(item.rank)}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">#{item.rank}</div>
                      <div className="text-sm opacity-90">排名</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">{item.advertiser}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.advertiser}</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-2xl font-bold">{formatMXN(item.creditCardAmount)}</div>
                        <div className="text-sm opacity-80">≈ {formatUSD((item.creditCardAmount * exchangeRate.mxnToUsd).toFixed(2))}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="font-semibold">{item.orderCount}</div>
                          <div className="opacity-80">订单数</div>
                        </div>
                        <div>
                          <div className="font-semibold">{formatMXN(item.orderCost)}</div>
                          <div className="opacity-80">单次订单成本</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 完整排行榜 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                {selectedDate} 销售排行榜 (按信用卡金额排序)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投放人员</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">信用卡金额</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告花费</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单数量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">单次订单成本</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">单次支付成本</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.map((item, index) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getRankIcon(item.rank)}</span>
                          <span className="text-lg font-bold text-gray-900">#{item.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(item.rank)} rounded-full flex items-center justify-center text-white font-bold`}>
                            {item.advertiser}
                          </div>
                          <div className="ml-3 text-lg font-medium text-gray-900">{item.advertiser}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-blue-600">{formatMXN(item.creditCardAmount)}</div>
                        <div className="text-sm text-gray-500">≈ {formatUSD((item.creditCardAmount * exchangeRate.mxnToUsd).toFixed(2))}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-purple-600">{formatUSD(item.adSpend)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-medium text-gray-900">{item.orderCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-green-600">{formatMXN(item.orderCost)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-medium text-gray-900">{item.paymentInfoCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-orange-600">{formatMXN(item.paymentCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;