import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About StockSage</h3>
            <p className="text-gray-400">
              StockSage is your ultimate companion for stock market insights, predictions, and portfolio management. Stay ahead with our intelligent analysis and tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-teal transition duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-teal transition duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-gray-400 hover:text-teal transition duration-200"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/prediction"
                  className="text-gray-400 hover:text-teal transition duration-200"
                >
                  Prediction
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <p className="text-gray-400">
              Pulchowk Engineering Campus<br />
              Lalitpur, Nepal
            </p>
            <p className="text-gray-400 mt-2">
              Email:{" "}
              <a
                href="mailto:info@stocksage.com"
                className="text-teal hover:text-teal/80"
              >
                info@stocksage.com
              </a>
            </p>
            <p className="text-gray-400 mt-1">Phone: +977-123-456789</p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 pt-4 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} StockSage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;