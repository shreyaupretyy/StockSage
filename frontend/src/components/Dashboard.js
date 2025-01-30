import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaGlobe, FaChevronRight } from 'react-icons/fa';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      <p className="mt-4 text-navy font-medium">Loading dashboard...</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [topStocks, setTopStocks] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulated API responses since backend isn't ready
        // Replace these with actual API calls when backend is ready
        
        // Portfolio data simulation
        setPortfolioData({
          totalValue: 500000,
          dailyChange: 2.5,
          totalProfitLoss: 25000,
          profitLossPercentage: 5.0
        });

        // Market data simulation
        setMarketData({
          sp500Change: 1.2,
          nasdaqChange: -0.8,
          niftyChange: 0.5
        });

        // Top stocks simulation
        setTopStocks([
          {
            symbol: 'NABIL',
            company: 'Nepal Bank Limited',
            price: 1200,
            change: 2.5
          },
          {
            symbol: 'UPPER',
            company: 'Upper Tamakoshi',
            price: 640,
            change: -1.2
          },
          {
            symbol: 'NLIC',
            company: 'Nepal Life Insurance',
            price: 1500,
            change: 3.7
          },
          {
            symbol: 'CHCL',
            company: 'Chilime Hydropower',
            price: 520,
            change: 1.8
          },
          {
            symbol: 'SBI',
            company: 'State Bank of India',
            price: 890,
            change: -0.5
          }
        ]);

        // Chart data simulation
        setChartData([
          { date: 'Jan', value: 400000 },
          { date: 'Feb', value: 420000 },
          { date: 'Mar', value: 450000 },
          { date: 'Apr', value: 445000 },
          { date: 'May', value: 480000 },
          { date: 'Jun', value: 500000 }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-navy mb-4 font-['Inter']">
            Your Portfolio Overview
          </h1>
          <p className="text-xl text-gray-600">
            Track your investments and market performance
          </p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Portfolio Value Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">Portfolio Value</h3>
              <div className="p-2 bg-navy/5 rounded-lg">
                <FaWallet className="text-teal text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-navy mb-2">
              {formatCurrency(portfolioData?.totalValue || 0)}
            </p>
            <div className={`flex items-center ${
              portfolioData?.dailyChange >= 0 ? 'text-teal' : 'text-red-500'
            }`}>
              {portfolioData?.dailyChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1 font-medium">
                {formatPercentage(portfolioData?.dailyChange || 0)} Today
              </span>
            </div>
          </div>

          {/* Profit/Loss Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">Total Profit/Loss</h3>
              <div className="p-2 bg-navy/5 rounded-lg">
                <FaChartLine className="text-teal text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-navy mb-2">
              {formatCurrency(portfolioData?.totalProfitLoss || 0)}
            </p>
            <div className={`flex items-center ${
              portfolioData?.profitLossPercentage >= 0 ? 'text-teal' : 'text-red-500'
            }`}>
              {portfolioData?.profitLossPercentage >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1 font-medium">
                {formatPercentage(portfolioData?.profitLossPercentage || 0)} Overall
              </span>
            </div>
          </div>

          {/* Market Overview Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">Market Overview</h3>
              <div className="p-2 bg-navy/5 rounded-lg">
                <FaGlobe className="text-teal text-xl" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">NEPSE</span>
                <span className={`flex items-center font-medium ${
                  marketData?.niftyChange >= 0 ? 'text-teal' : 'text-red-500'
                }`}>
                  {marketData?.niftyChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {formatPercentage(marketData?.niftyChange || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Volume</span>
                <span className="text-navy font-medium">2.5M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Status</span>
                <span className="text-teal font-medium">Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-navy">Portfolio Performance</h3>
            <div className="p-2 bg-navy/5 rounded-lg">
              <FaChartLine className="text-teal text-xl" />
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0F766E"
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Stocks */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-navy">Top Performing Stocks</h3>
            <div className="p-2 bg-navy/5 rounded-lg">
              <FaChartLine className="text-teal text-xl" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topStocks.map((stock) => (
                  <tr 
                    key={stock.symbol}
                    className="hover:bg-navy/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/stocks/${stock.symbol}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-navy">{stock.symbol}</span>
                        <FaChevronRight className="ml-2 text-teal text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stock.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                      {formatCurrency(stock.price)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      stock.change >= 0 ? 'text-teal' : 'text-red-500'
                    }`}>
                      <div className="flex items-center">
                        {stock.change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                        {formatPercentage(stock.change)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
