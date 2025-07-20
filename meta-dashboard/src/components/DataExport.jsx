import React, { useState } from 'react';
import { mockAdvertisingData, getDailySummary, exchangeRate } from '../data/advertisingData';

const DataExport = () => {
  const [selectedDate, setSelectedDate] = useState('2025-01-14');
  const [exportFormat, setExportFormat] = useState('csv');

  const dayData = mockAdvertisingData.filter(item => item.date === selectedDate);
  const summaryData = getDailySummary(selectedDate);

  const exportToCSV = () => {
    const headers = [
      '日期', '投放人员', '广告账户ID', '广告花费(USD)', '信用卡金额(MXN)', 
      '信用卡金额(USD)', '支付信息数量', '单次支付成本(MXN)', '订单数量', 
      '单次订单成本(MXN)', '充值金额(USD)'
    ];

    const rows = dayData.map(item => [
      item.date,
      item.advertiser,
      item.adAccountId,
      item.adSpend.toFixed(2),
      item.creditCardAmount.toFixed(2),
      (item.creditCardAmount * exchangeRate.mxnToUsd).toFixed(2),
      item.paymentInfoCount,
      (item.creditCardAmount / item.paymentInfoCount).toFixed(2),
      item.orderCount,
      (item.creditCardAmount / item.orderCount).toFixed(2),
      item.rechargeAmount.toFixed(2)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    downloadFile(csvContent, `advertising_data_${selectedDate}.csv`, 'text/csv');
  };

  const exportToJSON = () => {
    const exportData = {
      date: selectedDate,
      summary: summaryData,
      details: dayData.map(item => ({
        ...item,
        creditCardAmountUSD: (item.creditCardAmount * exchangeRate.mxnToUsd).toFixed(2),
        paymentCost: (item.creditCardAmount / item.paymentInfoCount).toFixed(2),
        orderCost: (item.creditCardAmount / item.orderCount).toFixed(2)
      })),
      exchangeRate: exchangeRate
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, `advertising_data_${selectedDate}.json`, 'application/json');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">数据导出</h2>
        <p className="text-gray-600">导出广告投放数据进行进一步分析</p>
      </div>

      {/* 导出配置 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">导出设置</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择日期</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="csv">CSV 格式</option>
              <option value="json">JSON 格式</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              onClick={handleExport}
              disabled={dayData.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base"
            >
              📤 导出数据
            </button>
          </div>
        </div>
      </div>

      {/* 数据预览 */}
      {dayData.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">数据预览 - {selectedDate}</h3>
          </div>

          {/* 汇总信息 */}
          <div className="p-4 sm:p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  MX${summaryData.totalCreditCardAmount.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">总信用卡金额</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                  ${summaryData.totalAdSpend.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">总广告花费</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {summaryData.totalOrders}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">总订单数</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                  ${summaryData.totalRecharge.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">总充值金额</div>
              </div>
            </div>
          </div>

          {/* 详细数据表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">投放人员</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">广告账户</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">广告花费</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">信用卡金额</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">订单数</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">充值金额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dayData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                          {item.advertiser}
                        </div>
                        <span className="ml-2 font-medium text-xs sm:text-sm">{item.advertiser}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 font-mono text-xs sm:text-sm hidden sm:table-cell">{item.adAccountId}</td>
                    <td className="px-2 sm:px-4 py-3 font-semibold text-purple-600 text-xs sm:text-sm">${item.adSpend.toLocaleString()}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="font-semibold text-blue-600 text-xs sm:text-sm">MX${item.creditCardAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">≈ ${(item.creditCardAmount * exchangeRate.mxnToUsd).toFixed(2)}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center font-medium text-xs sm:text-sm hidden lg:table-cell">{item.orderCount}</td>
                    <td className="px-2 sm:px-4 py-3 font-semibold text-yellow-600 text-xs sm:text-sm hidden sm:table-cell">${item.rechargeAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="text-gray-500 text-lg">选定日期无数据</div>
          <div className="text-gray-400 text-sm mt-2">请选择有数据的日期进行导出</div>
        </div>
      )}

      {/* 导出说明 */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-3">📋 导出说明</h4>
        <div className="text-blue-700 space-y-2">
          <p>• <strong>CSV格式</strong>: 适合Excel等表格软件打开，包含所有字段的详细数据</p>
          <p>• <strong>JSON格式</strong>: 适合程序处理，包含汇总数据和详细记录</p>
          <p>• 信用卡金额使用 <strong>MX$</strong> 标识，广告花费和充值金额使用 <strong>$</strong> 标识</p>
          <p>• 自动包含实时汇率转换数据 (当前汇率: 1 MX$ = {exchangeRate.mxnToUsd} US$)</p>
        </div>
      </div>
    </div>
  );
};

export default DataExport;