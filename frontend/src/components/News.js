import React, { useState, useEffect } from 'react';
import { FaClock, FaUser, FaNewspaper, FaCalendarAlt, FaBuilding, FaChartLine, FaGlobe } from 'react-icons/fa';


const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      <p className="mt-4 text-navy font-medium">Curating financial insights...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg max-w-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <FaNewspaper className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-red-800 font-medium">News Loading Error</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
);

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const newsPerPage = 9;

  const categories = [
    { id: 'all', label: 'All News', icon: FaGlobe },
    { id: 'market', label: 'Market News', icon: FaChartLine },
    { id: 'corporate', label: 'Corporate News', icon: FaBuilding },
    { id: 'company', label: 'Company News', icon: FaNewspaper },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news?category=${selectedCategory}`);
        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(news.length / newsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-navy mb-6 font-['Inter']">
            Financial Pulse
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with real-time market updates and corporate insights
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedCategory(id);
                setCurrentPage(1);
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold 
                         transition-all duration-200 ${
                selectedCategory === id
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy hover:bg-navy/5'
              } border border-gray-200`}
            >
              <Icon className={selectedCategory === id ? 'text-teal' : 'text-navy'} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentNews.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                         border border-gray-100 overflow-hidden transform hover:scale-[1.02]"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full p-6 hover:no-underline"
              >
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-navy mb-4 leading-snug 
                               hover:text-teal transition-colors line-clamp-3">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-base mb-6 flex-grow line-clamp-4 
                               leading-relaxed">
                    {item.content}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FaCalendarAlt className="text-teal" />
                        <span>{item.date}</span>
                      </div>
                      <span className="bg-navy/5 text-navy px-3 py-1 rounded-full text-xs font-medium">
                        {item.source}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-white text-navy rounded-lg shadow-md
                       hover:bg-navy/5 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 border border-gray-200"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center
                            transition-all duration-200 ${
                    currentPage === i + 1
                      ? 'bg-navy text-white shadow-lg'
                      : 'bg-white text-navy hover:bg-navy/5'
                    } border border-gray-200`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-white text-navy rounded-lg shadow-md
                       hover:bg-navy/5 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 border border-gray-200"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;