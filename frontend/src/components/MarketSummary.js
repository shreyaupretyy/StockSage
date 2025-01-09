import React, { useState, useEffect } from 'react';

const MarketSummaryTable = () => {
  const [marketData, setMarketData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store error (if any)

  // Fetch market summary data when component mounts and every 30 seconds after
  useEffect(() => {
    const fetchMarketData = () => {
      fetch('http://localhost:5000/api/market-summary') // API URL from Flask server
        .then((response) => response.json())
        .then((data) => {
          setMarketData(data); // Store fetched data in state
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => {
          setError("Error fetching market summary data");
          setLoading(false);
        });
    };

    fetchMarketData(); // Fetch data initially

    const intervalId = setInterval(fetchMarketData, 30000); // Fetch data every 30 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run this once when component mounts

  // Render loading, error, or the table based on state
  if (loading) {
    return <p className="text-center text-lg text-gray-500">Loading market summary...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <table className="w-full table-auto border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th colSpan="2" className="px-6 py-3 text-left text-xl font-medium text-gray-700">
              {marketData?.heading}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(marketData?.summary || {})
            .reverse() // Reversing the entries
            .map(([key, value]) => (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{key}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketSummaryTable;
