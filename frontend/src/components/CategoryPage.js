import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { category } = useParams(); // Get category from URL params
  const selectedCategory = category || 'all'; // Default to 'all' if no category is selected
  const [news, setNews] = useState([]); // State to hold the news items
  const [error, setError] = useState(null); // State to hold any error message
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 10; // Number of news items per page

  useEffect(() => {
    console.log('Fetching news for category:', selectedCategory); // Debugging log

    axios
      .get(`http://localhost:5000/api/news?category=${selectedCategory}`)
      .then((response) => {
        console.log('API Response:', response.data); // Debug log to check the response
        setNews(response.data || []); // If no data, set as an empty array
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setError(error.message); // Log the error if the API call fails
      });
  }, [selectedCategory]); // Run effect when selectedCategory changes

  // Calculate news to display based on currentPage and itemsPerPage
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // If there's an error, display the error message
  if (error) {
    return <div className="p-6">Error loading news: {error}</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News
      </h1>

      {/* Display news items */}
      {currentNews.length > 0 ? (
        <ul className="space-y-4">
          {currentNews.map((item, index) => (
            <li key={index} className="hover:bg-gray-50 p-4 rounded-md">
              <a
                href={item.url} // Add full URL if needed
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 text-lg"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No news available for this category.</p>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                page === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
