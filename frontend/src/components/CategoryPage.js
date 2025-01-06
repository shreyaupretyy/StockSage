import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { category } = useParams();  // Get category from URL params
  const selectedCategory = category || 'all';  // Default to 'all' if no category is selected
  const [news, setNews] = useState([]);  // State to hold the news items
  const [error, setError] = useState(null);  // State to hold any error message

  useEffect(() => {
    console.log('Fetching news for category:', selectedCategory);  // Debugging log

    axios
      .get(`http://localhost:5000/api/news?category=${selectedCategory}`)
      .then((response) => {
        console.log('API Response:', response.data);  // Debug log to check the response

        // Simply set the news to the response data (we don't need to reference category directly)
        setNews(response.data || []);  // If no data, set as empty array
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setError(error.message);  // Log the error if the API call fails
      });
  }, [selectedCategory]);  // Run effect when selectedCategory changes

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
      {news.length > 0 && (
        <ul className="space-y-4">
          {news.map((item, index) => (
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
      )}
    </div>
  );
};

export default CategoryPage;
