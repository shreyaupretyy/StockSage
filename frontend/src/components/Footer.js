import React from "react";

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
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
                  <a
                    href="/"
                    className="text-gray-400 hover:text-blue-400 transition duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-blue-400 transition duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/news"
                    className="text-gray-400 hover:text-blue-400 transition duration-200"
                  >
                    News
                  </a>
                </li>
                <li>
                  <a
                    href="/prediction"
                    className="text-gray-400 hover:text-blue-400 transition duration-200"
                  >
                    Prediction
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Contact Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
              <p className="text-gray-400">
                Pulchowk Campus, Kathmandu <br />
                Nepal
              </p>
              <p className="text-gray-400 mt-2">
                Email:{" "}
                <a
                  href="mailto:info@stocksage.com"
                  className="text-blue-400 hover:text-blue-500"
                >
                  info@stocksage.com
                </a>
              </p>
              <p className="text-gray-400 mt-1">Phone: +977-123-456789</p>
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
  