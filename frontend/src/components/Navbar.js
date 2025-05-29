import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/stocksage_logo.png';
import axios from 'axios';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Stock symbols and companies for search
  const stocksData = [
    { symbol: 'SCB', name: 'Standard Chartered Bank Nepal' },
    { symbol: 'NABIL', name: 'Nabil Bank Limited' },
    { symbol: 'JBBL', name: 'Jyoti Bikas Bank Limited' },
    { symbol: 'API', name: 'API Power Company Limited' },
    { symbol: 'NTC', name: 'Nepal Telecom' }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowResults(false);
      return;
    }

    // Filter stocks based on search query
    const filteredResults = stocksData.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredResults);
    setShowResults(true);
  };

  // Handle clicking on a search result
  const handleResultClick = () => {
    navigate(`/prediction/`);
    setSearchQuery('');
    setShowResults(false);
  };

  // Handle clicking outside of search results to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      // If we have an exact match, navigate to that stock
      const exactMatch = stocksData.find(stock => 
        stock.symbol.toLowerCase() === searchQuery.toLowerCase() || 
        stock.name.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (exactMatch) {
        navigate(`/prediction/`);
      } else if (searchResults.length > 0) {
        // Navigate to the first result if no exact match
        navigate(`/prediction/`);
      } else {
        // Navigate to stocks page with query parameter if no results
        navigate(`/stocks?search=${encodeURIComponent(searchQuery)}`);
      }
      
      setSearchQuery('');
      setShowResults(false);
    }
  };

  return (
    <nav className="bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="StockSage" className="w-10 h-10 rounded-full" />
              <div className="text-white text-xl font-semibold">StockSage</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              About
            </Link>
            <Link to="/news" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              News
            </Link>
            <Link to="/stocks" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Stocks
            </Link>
            <Link to="/prediction" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Prediction
            </Link>
          </div>

          {/* Search and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    className="bg-navy-light placeholder-gray-400 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal w-64"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => handleResultClick(result.symbol)}
                    >
                      <div>
                        <div className="font-medium text-navy">{result.symbol}</div>
                        <div className="text-xs text-gray-500">{result.name}</div>
                      </div>
                      <div className="text-teal text-sm">View</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/login" className="text-beige hover:text-teal px-4 py-2 text-sm font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-beige text-navy hover:bg-teal/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-teal"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy">
          {/* Mobile Search Bar */}
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="bg-navy-light placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
            
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="mt-1 bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.symbol}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleResultClick(result.symbol);
                      setIsOpen(false);
                    }}
                  >
                    <div className="font-medium text-navy">{result.symbol}</div>
                    <div className="text-xs text-gray-500">{result.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/news"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <Link
              to="/stocks"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Stocks
            </Link>
            <Link
              to="/prediction"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Prediction
            </Link>
          </div>
          <div className="px-2 pt-2 pb-3 border-t border-gray-700">
            <Link
              to="/login"
              className="text-beige hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-teal text-navy hover:bg-teal/90 block px-3 py-2 text-base font-medium text-center rounded-md mt-2"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const PrivateNavbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Tracks mobile menu visibility
  const [searchQuery, setSearchQuery] = useState(''); // Tracks the search input
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Tracks profile dropdown visibility
  const [username, setUsername] = useState('User'); // Stores the username
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Stock symbols and companies for search
  const stocksData = [
    { symbol: 'SCB', name: 'Standard Chartered Bank Nepal' },
    { symbol: 'NABIL', name: 'Nabil Bank Limited' },
    { symbol: 'JBBL', name: 'Jyoti Bikas Bank Limited' },
    { symbol: 'API', name: 'API Power Company Limited' },
    { symbol: 'NTC', name: 'Nepal Telecom' }
  ];

  // Fetch user data when the component mounts or when authentication status changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make an API call to fetch the user's profile
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Update the username state with the fetched data
        setUsername(response.data.fullName || 'User');
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally, handle errors (e.g., redirect to login if unauthorized)
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowResults(false);
      return;
    }

    // Filter stocks based on search query
    const filteredResults = stocksData.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredResults);
    setShowResults(true);
  };

  // Handle clicking on a search result
  const handleResultClick = () => {
    navigate(`/prediction/`);
    setSearchQuery('');
    setShowResults(false);
  };

  // Handle clicking outside of search results and profile menu to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      // If we have an exact match, navigate to that stock
      const exactMatch = stocksData.find(stock => 
        stock.symbol.toLowerCase() === searchQuery.toLowerCase() || 
        stock.name.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (exactMatch) {
        navigate(`/prediction/`);
      } else if (searchResults.length > 0) {
        // Navigate to the first result if no exact match
        navigate(`/prediction/`);
      } else {
        // Navigate to stocks page with query parameter if no results
        navigate(`/stocks?search=${encodeURIComponent(searchQuery)}`);
      }
      
      setSearchQuery('');
      setShowResults(false);
    }
  };

  // Handles user logout
  const handleLogout = async () => {
    try {
      // Make an API call to perform logout
      const response = await axios.post(
        'http://localhost:5000/api/logout',
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 200) {
        onLogout(); // Update authentication status in parent component
        navigate('/login'); // Redirect to login page
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally, display an error message to the user
      
      // Even if the API call fails, we should still log out the user locally
      onLogout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="StockSage" className="w-10 h-10 rounded-full" />
              <span className="text-white text-xl font-semibold">StockSage</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              About
            </Link>
            <Link to="/news" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              News
            </Link>
            
            <Link to="/stocks" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Stocks
            </Link>
            <Link to="/prediction" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Prediction
            </Link>
            <Link to="/dashboard" className="text-white hover:text-teal px-3 py-2 text-sm font-medium">
              Dashboard
            </Link>
          </div>

          {/* Search and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    className="bg-navy-light placeholder-gray-400 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal w-64"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => handleResultClick(result.symbol)}
                    >
                      <div>
                        <div className="font-medium text-navy">{result.symbol}</div>
                        <div className="text-xs text-gray-500">{result.name}</div>
                      </div>
                      <div className="text-teal text-sm">View</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Username Display and Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center text-white hover:text-teal"
              >
                <FaUser className="mr-2" />
                <span className="text-sm font-medium">{username}</span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 navbar-dropdown z-10">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      {username}'s Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      to="/FAQ"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/privacy"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/terms"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Terms of Service
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-teal"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy">
          {/* Mobile Search Bar */}
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="bg-navy-light placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
            
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="mt-1 bg-white rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.symbol}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleResultClick(result.symbol);
                      setIsOpen(false);
                    }}
                  >
                    <div className="font-medium text-navy">{result.symbol}</div>
                    <div className="text-xs text-gray-500">{result.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/news"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            
            <Link
              to="/stocks"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Stocks
            </Link>
            <Link
              to="/prediction"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Prediction
            </Link>
            <Link
              to="/dashboard"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </div>

          <div className="px-2 pt-2 pb-3 border-t border-gray-700">
            {/* Username Display in Mobile Menu */}
            <div className="px-3 py-2">
              <span className="text-white font-medium">{username}</span>
            </div>
            <Link
              to="/profile"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {username}'s Profile
            </Link>
            <Link
              to="/settings"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <Link
              to="/FAQ"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/privacy"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Terms of Service
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-white hover:text-teal block w-full text-left px-3 py-2 text-base font-medium"
            >
              <FaSignOutAlt className="inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};