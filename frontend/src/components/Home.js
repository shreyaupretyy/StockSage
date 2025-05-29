import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  FaClock,
  FaUser,
  FaChartLine,
  FaExchangeAlt,
  FaCoins,
  FaFileAlt,
  FaChartBar,
  FaDollarSign,
  FaLightbulb
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      <p className="mt-4 text-navy font-medium">Loading market data...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-1">{message}</p>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [marketData, setMarketData] = useState({
    heading: '',
    summary: {
      'Total Turnover': '0',
      'Total Transactions': '0',
      'Total Traded Shares': '0',
      'Total Scrips Traded': '0',
      'Total Market Capitalization': '0',
      'Floated Market Capitalization': '0'
    }
  });

  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
    dates: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/market-summary');
        const data = await response.json();
        setMarketData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market summary:', error);
        setError('Failed to load market data');
        setLoading(false);
      }
    };

    fetchMarketSummary();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/NEPSE.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filteredData = results.data
              .filter((row) => row.Date && row.Close)
              .filter((row) => {
                const date = new Date(row.Date);
                return date.getFullYear() >= 2024;
              })
              .sort((a, b) => new Date(a.Date) - new Date(b.Date));

            const monthFirstAppearance = {};
            const labels = [];
            const dates = [];
            const values = [];

            filteredData.forEach((row) => {
              const date = new Date(row.Date);
              const monthKey = date.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              });

              if (!monthFirstAppearance[monthKey]) {
                monthFirstAppearance[monthKey] = true;
                labels.push(
                  date.toLocaleDateString('en-US', { month: 'short' })
                );
              } else {
                labels.push('');
              }

              dates.push(row.Date);
              values.push(parseFloat(row.Close));
            });

            setChartData({ labels, values, dates });
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError('Error loading chart data');
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setError('Error loading chart data');
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'NEPSE Index',
        data: chartData.values,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 1.5,
        pointBackgroundColor: '#6366f1',
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'NEPSE Index (2024)',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: '500'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 13
        },
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex;
            const rawDate = chartData.dates[index];
            return new Date(rawDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
          },
          label: function (context) {
            return `NEPSE: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        border: {
          dash: [4, 4]
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          color: '#6B7280',
          padding: 8
        }
      }
    }
  };

  // Market summary card component
  const MarketCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-start">
        <div className="p-3 bg-gradient-to-br from-navy/10 to-teal/10 rounded-lg">
          <Icon className="text-2xl text-navy" />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold text-navy mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  // Static tips section
  const investmentTips = [
    {
      title: 'Understand Your Risk',
      icon: FaLightbulb,
      content:
        'Different stocks carry different levels of volatility. Make sure you know your comfort zone before investing.'
    },
    {
      title: 'Diversify',
      icon: FaLightbulb,
      content:
        'Spread your investments across various sectors to mitigate the impact of a market fluctuation in a single sector.'
    },
    {
      title: 'Stay Informed',
      icon: FaLightbulb,
      content:
        'Monitor global trends, fiscal policies, and economic indicators to make more educated decisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Welcome to StockSage
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent companion for navigating the Nepali stock market.
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="h-[500px]">
            <Line data={data} options={options} />
          </div>
        </div>

        {/* Market Summary Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-navy">Market Summary</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-navy to-teal rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MarketCard
              icon={FaChartLine}
              title="Total Turnover"
              value={`Rs. ${marketData.summary['Total Turnover']}`}
            />
            <MarketCard
              icon={FaExchangeAlt}
              title="Total Transactions"
              value={marketData.summary['Total Transactions']}
            />
            <MarketCard
              icon={FaCoins}
              title="Total Traded Shares"
              value={marketData.summary['Total Traded Shares']}
            />
            <MarketCard
              icon={FaFileAlt}
              title="Total Scrips Traded"
              value={marketData.summary['Total Scrips Traded']}
            />
            <MarketCard
              icon={FaChartBar}
              title="Total Market Cap"
              value={`Rs. ${marketData.summary['Total Market Capitalization']}`}
            />
            <MarketCard
              icon={FaDollarSign}
              title="Floated Market Cap"
              value={`Rs. ${marketData.summary['Floated Market Capitalization']}`}
            />
          </div>
        </div>

        {/* Investment Tips Section */}
        <div className="mt-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-navy">Investment Tips</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-navy to-teal rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-navy/10 to-teal/10 rounded-lg">
                    <tip.icon className="text-2xl text-navy" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-navy">
                    {tip.title}
                  </h3>
                </div>
                <p className="text-gray-600">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;