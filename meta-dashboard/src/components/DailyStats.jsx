import React, { useState } from 'react';
import { mockAdvertisingData, calculatePaymentCost, calculateOrderCost, exchangeRate } from '../data/advertisingData';

const DailyStats = () => {
  const [selectedDate, setSelectedDate] = useState('2025-01-14');

  // 获取选定日期的数据
  const dayData = mockAdvertisingData.filter(item => item.date === selectedDate);

  const formatMXN = (value) => `MX$${value.toLocaleString()}`;
  const formatUSD = (value) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">每日统计</h2>
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

      {dayData.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="text-gray-500 text-lg">选定日期无数据</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">
              {selectedDate} 数据统计 ({dayData.length} 条记录)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投放人员</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账户ID</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告花费</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">信用卡金额</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">支付信息</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">支付成本</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单数</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">订单成本</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">充值金额</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dayData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                          {item.advertiser}
                        </div>
                        <div className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">{item.advertiser}</div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-mono">{item.adAccountId.replace('FB_', '')}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-semibold">{formatUSD(item.adSpend)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-semibold text-blue-600">{formatMXN(item.creditCardAmount)}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">≈ {formatUSD((item.creditCardAmount * exchangeRate.mxnToUsd).toFixed(2))}</div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center hidden sm:table-cell">{item.paymentInfoCount}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-green-600 hidden lg:table-cell">
                      {formatMXN(calculatePaymentCost(item.creditCardAmount, item.paymentInfoCount))}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center font-medium">{item.orderCount}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-purple-600 hidden lg:table-cell">
                      {formatMXN(calculateOrderCost(item.creditCardAmount, item.orderCount))}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-semibold hidden sm:table-cell">{formatUSD(item.rechargeAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 汇总信息 */}
          <div className="bg-gray-50 px-3 sm:px-6 py-4 border-t">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">总广告花费</div>
                <div className="text-lg font-semibold text-purple-600">
                  {formatUSD(dayData.reduce((sum, item) => sum + item.adSpend, 0))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">总信用卡金额</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatMXN(dayData.reduce((sum, item) => sum + item.creditCardAmount, 0))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">总订单数</div>
                <div className="text-lg font-semibold text-green-600">
                  {dayData.reduce((sum, item) => sum + item.orderCount, 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">总充值金额</div>
                <div className="text-lg font-semibold text-yellow-600">
                  {formatUSD(dayData.reduce((sum, item) => sum + item.rechargeAmount, 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyStats;