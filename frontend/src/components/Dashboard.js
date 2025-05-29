import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList
} from 'recharts';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaGlobe, FaChevronRight, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      <p className="mt-4 text-navy font-medium">Loading dashboard...</p>
    </div>
  </div>
);

const API_URL = 'http://127.0.0.1:5000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [topStocks, setTopStocks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockReturns, setStockReturns] = useState([]);
  const [currentDate] = useState(new Date("2025-04-17"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stock returns data from API
        const stockReturnsResponse = await axios.get(`${API_URL}/api/stock-returns`);
        
        if (stockReturnsResponse.data && stockReturnsResponse.data.length > 0) {
          setStockReturns(stockReturnsResponse.data);
          
          // Use the top stocks for the topStocks section
          setTopStocks(stockReturnsResponse.data.slice(0, 5).map(stock => ({
            symbol: stock.symbol,
            company: getCompanyName(stock.symbol),
            price: stock.current_price,
            change: stock.expected_return
          })));
        } else {
          // Fallback to mock data if API returns no data
          setStockReturns([
            { symbol: 'NABIL', expected_return: 7.8, current_price: 1200, predicted_price: 1293.6, is_mock: true },
            { symbol: 'SCB', expected_return: 5.2, current_price: 500, predicted_price: 526.0, is_mock: true },
            { symbol: 'API', expected_return: 6.3, current_price: 300, predicted_price: 318.9, is_mock: true },
            { symbol: 'JBBL', expected_return: 4.5, current_price: 400, predicted_price: 418.0, is_mock: true },
            { symbol: 'NTC', expected_return: 3.9, current_price: 900, predicted_price: 935.1, is_mock: true }
          ]);
          
          // Fallback top stocks
          setTopStocks([
            { symbol: 'NABIL', company: 'Nabil Bank Limited', price: 1200, change: 7.8 },
            { symbol: 'API', company: 'API Power Company Limited', price: 300, change: 6.3 },
            { symbol: 'SCB', company: 'Standard Chartered Bank Nepal', price: 500, change: 5.2 },
            { symbol: 'JBBL', company: 'Jyoti Bikas Bank Limited', price: 400, change: 4.5 },
            { symbol: 'NTC', company: 'Nepal Telecom', price: 900, change: 3.9 }
          ]);
        }
        
        // Fetch market summary data
        try {
          const marketResponse = await axios.get(`${API_URL}/api/market-summary`);
          if (marketResponse.data) {
            setMarketData({
              niftyChange: marketResponse.data.change || 0.5,
              volume: marketResponse.data.volume || '2.5M',
              status: marketResponse.data.status || 'Open'
            });
          }
        } catch (error) {
          console.error('Error fetching market data:', error);
          // Fallback market data
          setMarketData({
            niftyChange: 0.5,
            volume: '2.5M',
            status: 'Open'
          });
        }

        // Portfolio data simulation (would come from backend in real app)
        setPortfolioData({
          totalValue: 500000,
          dailyChange: 2.5,
          totalProfitLoss: 25000,
          profitLossPercentage: 5.0
        });

        // Chart data simulation (would come from backend in real app)
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
        // Set fallback data
        fallbackData();
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const fallbackData = () => {
    // Portfolio data simulation
    setPortfolioData({
      totalValue: 500000,
      dailyChange: 2.5,
      totalProfitLoss: 25000,
      profitLossPercentage: 5.0
    });

    // Market data simulation
    setMarketData({
      niftyChange: 0.5,
      volume: '2.5M',
      status: 'Open'
    });

    // Top stocks simulation
    setTopStocks([
      { symbol: 'NABIL', company: 'Nabil Bank Limited', price: 1200, change: 7.8 },
      { symbol: 'API', company: 'API Power Company Limited', price: 300, change: 6.3 },
      { symbol: 'SCB', company: 'Standard Chartered Bank Nepal', price: 500, change: 5.2 },
      { symbol: 'JBBL', company: 'Jyoti Bikas Bank Limited', price: 400, change: 4.5 },
      { symbol: 'NTC', company: 'Nepal Telecom', price: 900, change: 3.9 }
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
    
    // Stock returns simulation
    setStockReturns([
      { symbol: 'NABIL', expected_return: 7.8, current_price: 1200, predicted_price: 1293.6, is_mock: true },
      { symbol: 'API', expected_return: 6.3, current_price: 300, predicted_price: 318.9, is_mock: true },
      { symbol: 'SCB', expected_return: 5.2, current_price: 500, predicted_price: 526.0, is_mock: true },
      { symbol: 'JBBL', expected_return: 4.5, current_price: 400, predicted_price: 418.0, is_mock: true },
      { symbol: 'NTC', expected_return: 3.9, current_price: 900, predicted_price: 935.1, is_mock: true }
    ]);
  };

  const getCompanyName = (symbol) => {
    const companyNames = {
      'SCB': 'Standard Chartered Bank Nepal',
      'NABIL': 'Nabil Bank Limited',
      'JBBL': 'Jyoti Bikas Bank Limited',
      'API': 'API Power Company Limited',
      'NTC': 'Nepal Telecom'
    };
    return companyNames[symbol] || symbol;
  };

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

  // Handle stock click to redirect to prediction page
  const handleStockClick = () => {
    navigate(`/prediction/`);  // Updated to match your existing prediction.js route
  };

  // Format current date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  if (loading) return <LoadingSpinner />;

  // Custom colors for the bar chart (blue to purple gradient)
  const getBarColor = (value) => {
    if (value >= 7) return '#4338CA'; // Indigo-700
    if (value >= 5) return '#6366F1'; // Indigo-500
    if (value >= 3) return '#818CF8'; // Indigo-400
    if (value >= 0) return '#A5B4FC'; // Indigo-300
    return '#F87171'; // Red-400 for negative returns
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-navy mb-4 font-['Inter']">
            Your Portfolio Overview
          </h1>
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <FaCalendarAlt className="mr-2" />
            <span>{formatDate(currentDate)}</span>
          </div>
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
                <span className="text-navy font-medium">{marketData?.volume || '2.5M'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Status</span>
                <span className="text-teal font-medium">{marketData?.status || 'Open'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Returns Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-navy">30-Day Expected Stock Returns</h3>
              <p className="text-sm text-gray-500 mt-1">
                Predicted performance from December 10, 2024 to January 9, 2025
              </p>
            </div>
            <div className="p-2 bg-navy/5 rounded-lg">
              <FaTrophy className="text-indigo-600 text-xl" />
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockReturns}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="symbol" 
                  stroke="#64748B"
                  tick={{ fill: '#0F172A', fontSize: 14 }}
                />
                <YAxis 
                  stroke="#64748B"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value, name) => [`${value.toFixed(2)}%`, 'Expected Return']}
                  labelFormatter={(label) => `Stock: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                />
                <Bar dataKey="expected_return" name="Expected Return">
                  {stockReturns.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.expected_return)} 
                      cursor="pointer"
                      onClick={() => handleStockClick(entry.symbol)}
                    />
                  ))}
                  <LabelList dataKey="expected_return" position="top" formatter={(value) => `${value.toFixed(1)}%`} fill="#374151" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
            <FaChevronRight className="mr-1 text-indigo-500" /> 
            <span>Click on any bar to view detailed prediction and analysis for that stock</span>
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
              <FaChartLine className="text-indigo-500 text-xl" />
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
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider">
                    30-Day Return
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topStocks.map((stock) => (
                  <tr 
                    key={stock.symbol}
                    className="hover:bg-indigo-50 transition-colors cursor-pointer group"
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-navy">{stock.symbol}</span>
                        <FaChevronRight className="ml-2 text-indigo-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stock.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                      {formatCurrency(stock.price)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      stock.change >= 0 ? 'text-indigo-600' : 'text-red-500'
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