import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/stocksage_logo.png';
import axios from 'axios';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="bg-navy-light text-white pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Tracks profile dropdown visibility
  const [username, setUsername] = useState('User'); // Stores the username

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
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="bg-navy-light text-white pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Username Display and Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center text-white hover:text-teal"
              >
                <FaUser className="mr-2" />
                <span className="text-sm font-medium">{username}</span> {/* Display username */}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 navbar-dropdown">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      {username}'s Profile {/* Dynamically display username */}
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
              <span className="text-white font-medium">{username}</span> {/* Display username */}
            </div>
            <Link
              to="/profile"
              className="text-white hover:text-teal block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {username}'s Profile {/* Dynamically display username */}
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
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowProfileMenu(false)}
            >
              Terms of Service
            </Link>
            <button
              onClick={handleLogout}
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

