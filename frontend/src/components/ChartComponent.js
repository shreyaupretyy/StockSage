import React, { useEffect, useState } from 'react';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
    dates: [], // Keep all raw dates here for tooltips
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/NEPSE.csv');
      const csvData = await response.text();

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const filteredData = result.data
            .filter(row => {
              // Parse date safely and filter by year >= 2024
              const date = new Date(row.Date);
              return date.getFullYear() >= 2024;
            })
            .sort((a, b) => new Date(a.Date) - new Date(b.Date)); // Sort by date ascending

          const monthFirstAppearance = {};
          const labels = [];
          const dates = [];
          const values = [];

          filteredData.forEach(row => {
            const date = new Date(row.Date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            if (!monthFirstAppearance[monthKey]) {
              monthFirstAppearance[monthKey] = true;
              labels.push(date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase());
            } else {
              labels.push(''); // Empty string for non-displayed labels
            }

            dates.push(row.Date); // Store raw date for tooltips
            values.push(Number(row.Close)); // Parse the 'Close' value as a number
          });

          setChartData({ labels, values, dates });
        },
      });
    };

    fetchData();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [{
      label: 'Daily Close Prices',
      data: chartData.values,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 1.5,
      pointBackgroundColor: '#6366f1',
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
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
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex;
            const rawDate = chartData.dates[index];
            const date = new Date(rawDate); // Parse raw date
            return date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
          },
          label: function(context) {
            return `${context.raw.toLocaleString()}`;
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
          }
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
          callback: value => `${value.toLocaleString()}`,
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          padding: 8
        }
      }
    }
  };

  return (
    <div className="w-full md:w-3/4 mx-auto my-8 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="h-[400px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
