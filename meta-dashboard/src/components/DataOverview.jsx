import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { mockAdvertisingData, getDailySummary, exchangeRate } from '../data/advertisingData';

const DataOverview = () => {
  const todaySummary = getDailySummary('2025-01-14');
  const yesterdaySummary = getDailySummary('2025-01-13');

  // 按投放人员统计数据
  const advertiserStats = mockAdvertisingData
    .filter(item => item.date === '2025-01-14')
    .map(item => ({
      name: item.advertiser,
      creditCard: item.creditCardAmount,
      adSpend: item.adSpend,
      orders: item.orderCount,
      recharge: item.rechargeAmount
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatMXN = (value) => `MX$${value.toLocaleString()}`;
  const formatUSD = (value) => `$${value.toLocaleString()}`;

  const statsCards = [
    {
      title: '总信用卡金额',
      value: formatMXN(todaySummary.totalCreditCardAmount),
      usdValue: formatUSD((todaySummary.totalCreditCardAmount * exchangeRate.mxnToUsd).toFixed(2)),
      change: ((todaySummary.totalCreditCardAmount - yesterdaySummary.totalCreditCardAmount) / yesterdaySummary.totalCreditCardAmount * 100).toFixed(1),
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      title: '总广告花费',
      value: formatUSD(todaySummary.totalAdSpend),
      change: ((todaySummary.totalAdSpend - yesterdaySummary.totalAdSpend) / yesterdaySummary.totalAdSpend * 100).toFixed(1),
      bgGradient: 'from-purple-500 to-purple-600'
    },
    {
      title: '总订单数量',
      value: todaySummary.totalOrders.toString(),
      change: ((todaySummary.totalOrders - yesterdaySummary.totalOrders) / yesterdaySummary.totalOrders * 100).toFixed(1),
      bgGradient: 'from-green-500 to-green-600'
    },
    {
      title: '总充值金额',
      value: formatUSD(todaySummary.totalRecharge),
      change: ((todaySummary.totalRecharge - yesterdaySummary.totalRecharge) / yesterdaySummary.totalRecharge * 100).toFixed(1),
      bgGradient: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">数据总览</h2>
        <div className="text-xs sm:text-sm text-gray-600">
          汇率更新时间: {exchangeRate.lastUpdated}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>
            <h3 className="text-sm font-medium opacity-90">{card.title}</h3>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
              {card.usdValue && (
                <div className="text-xs sm:text-sm opacity-80">≈ {card.usdValue}</div>
              )}
            </div>
            <div className="mt-3 flex items-center">
              <span className={`text-sm ${parseFloat(card.change) >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {parseFloat(card.change) >= 0 ? '↗' : '↘'} {Math.abs(card.change)}%
              </span>
              <span className="text-xs opacity-70 ml-2">vs 昨日</span>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 投放人员信用卡金额对比 */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">投放人员信用卡金额对比</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={advertiserStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatMXN(value)} />
              <Legend />
              <Bar dataKey="creditCard" fill="#3B82F6" name="信用卡金额(MX$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 广告花费分布 */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">广告花费分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={advertiserStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="adSpend"
              >
                {advertiserStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatUSD(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 订单与充值对比 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">订单数量与充值金额对比</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={advertiserStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#10B981" name="订单数量" />
            <Bar yAxisId="right" dataKey="recharge" fill="#F59E0B" name="充值金额($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataOverview;