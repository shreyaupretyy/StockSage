import React, { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';


const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      <p className="mt-4 text-navy font-medium">Loading stock data...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy/5 to-teal/5">
    <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg max-w-lg">
      <h2 className="text-red-800 font-medium text-lg mb-2">Error Loading Stocks</h2>
      <p className="text-red-600">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);
const Stocks = () => {
  const [sectors, setSectors] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [displayedCompanies, setDisplayedCompanies] = useState([]);
  const [selectedSector, setSelectedSector] = useState(''); // Initialize without 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedAsc, setSortedAsc] = useState(true); // State to manage sorting order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(30);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sectors and companies from APIs
        const sectorsRes = await fetch('http://localhost:5000/api/sectors');
        const companiesRes = await fetch('http://localhost:5000/api/companies');

        const sectorsData = await sectorsRes.json();
        const companiesData = await companiesRes.json();

        // Debug API responses
        console.log('API Response - Sectors:', sectorsData);
        console.log('API Response - Companies:', companiesData);

        // Extract unique sectors from companies data
        const uniqueSectors = [...new Set(companiesData.map(c => c.sector))];
        console.log('Unique sectors found:', uniqueSectors);

        // Filter out companies with invalid data
        const validCompanies = companiesData.filter(company => 
          company.sector && company.symbol && company.name
        );

        console.log('Valid companies count:', validCompanies.length);
        console.log('Sample company data:', validCompanies[0]);

        // Sort companies alphabetically by name initially
        const sortedCompanies = validCompanies.sort((a, b) => 
          a.name.localeCompare(b.name)
        );

        setSectors(uniqueSectors);
        setAllCompanies(sortedCompanies);
        setDisplayedCompanies(sortedCompanies);

        // Set the selected sector to the first sector in the list
        if (uniqueSectors.length > 0) {
          setSelectedSector(uniqueSectors[0]);
        }

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort companies whenever selectedSector, searchTerm, or sorting order changes
  useEffect(() => {
    const filterAndSortCompanies = () => {
      let results = [...allCompanies];

      // Filter by selected sector
      if (selectedSector) {
        results = results.filter(company => company.sector === selectedSector);
      }

      // Filter by search term (symbol or name)
      if (searchTerm.trim() !== '') {
        const lowerSearchTerm = searchTerm.toLowerCase();
        results = results.filter(company => 
          company.symbol.toLowerCase().includes(lowerSearchTerm) ||
          company.name.toLowerCase().includes(lowerSearchTerm)
        );
      }

      // Sort companies alphabetically by name
      results.sort((a, b) => {
        if (sortedAsc) {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });

      console.log(`Filtered ${results.length} companies for sector: ${selectedSector} and search term: "${searchTerm}"`);

      setDisplayedCompanies(results);
      setCurrentPage(1); // Reset to first page whenever filters change
    };

    filterAndSortCompanies();
  }, [selectedSector, searchTerm, sortedAsc, allCompanies]);

  // Calculate pagination indices
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = displayedCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );
  const totalPages = Math.ceil(displayedCompanies.length / companiesPerPage);

  // Handle sector selection change
  const handleSectorChange = (e) => {
    const newSector = e.target.value;
    console.log('Changing sector to:', newSector);
    setSelectedSector(newSector);
  };

  // Handle sorting toggle
  const handleSortToggle = () => {
    setSortedAsc(prev => !prev);
    console.log(`Sorting order changed to: ${!sortedAsc ? 'Ascending' : 'Descending'}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Stock Listings
          </h1>
          <p className="text-xl text-gray-600">
            Showing {displayedCompanies.length} companies in the{' '}
            <span className="font-medium text-navy">{selectedSector}</span> sector
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by symbol or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                           focus:ring-teal/20 focus:border-teal transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sector Dropdown */}
            <div className="relative w-full md:w-64">
              <select
                value={selectedSector}
                onChange={handleSectorChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg 
                        focus:ring-2 focus:ring-teal/20 focus:border-teal bg-white 
                        transition-all appearance-none pr-10"
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <FaChevronDown className="w-4 h-4 text-navy" />
              </div>
            </div>

            {/* Sort Button */}
            <button
              onClick={handleSortToggle}
              className="w-full md:w-auto px-6 py-3 bg-navy text-white rounded-lg 
                       hover:bg-navy/90 focus:outline-none transition-colors flex 
                       items-center justify-center space-x-2"
            >
              <FaSort className={`transform ${sortedAsc ? 'rotate-0' : 'rotate-180'} 
                                transition-transform`} />
              <span>Sort {sortedAsc ? 'Descending' : 'Ascending'}</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-navy/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy 
                               uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy 
                               uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy 
                               uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy 
                               uppercase tracking-wider">Listed Shares</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy 
                               uppercase tracking-wider">Paid Up</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy 
                               uppercase tracking-wider">Total Paid Up Capital</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy 
                               uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy 
                               uppercase tracking-wider">LTP</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy 
                               uppercase tracking-wider">As of Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCompanies.map((company, index) => (
                  <tr
                    key={company.id || index}
                    className="hover:bg-navy/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => window.open(company.url, '_blank', 'noopener,noreferrer')}
                        className="text-sm font-medium text-teal hover:text-teal/80 
                                 hover:underline focus:outline-none"
                      >
                        {company.symbol}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-sm rounded-full bg-navy/10 text-navy">
                        {company.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {company.listed_shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {company.paid_up}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {company.total_paid_up_capital}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {company.market_capitalization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-teal">
                      {company.market_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {company.as_of}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors
                       ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-navy hover:bg-navy/5 border-gray-200'}`}
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, totalPages)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                             ${currentPage === page
                              ? 'bg-navy text-white'
                              : 'bg-white text-navy hover:bg-navy/5 border border-gray-200'}`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors
                       ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-navy hover:bg-navy/5 border-gray-200'}`}
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Stocks;