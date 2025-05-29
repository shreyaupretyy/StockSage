import React from 'react';
import { FaChartLine, FaUsers, FaClock, FaBullseye, FaChartBar, FaClipboardCheck, FaRocket, 
         FaLinkedin, FaGithub } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-navy to-navy/90 text-white py-24 relative overflow-hidden">
        {/* CSS-based pattern background */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 font-['Inter'] tracking-tight">
              About StockSage
            </h1>
            <p className="text-2xl max-w-3xl mx-auto leading-relaxed">
              Your intelligent companion for navigating the Nepali stock market with confidence and precision.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <h2 className="text-5xl font-bold text-navy mb-4">Our Mission</h2>
              <div className="h-2 w-20 bg-gradient-to-r from-teal to-navy rounded-full" />
            </div>
            <div className="space-y-6">
              <p className="text-xl text-gray-600 leading-relaxed">
                At StockSage, we're committed to democratizing stock market information and making it accessible to everyone. Our platform combines cutting-edge technology with comprehensive market data to provide you with the insights you need.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                We believe that informed investors make better decisions, and we're here to provide you with the tools and knowledge you need to succeed in the Nepali stock market.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                               rounded-xl flex items-center justify-center">
                  <FaUsers className="text-3xl text-teal" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-navy mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                               rounded-xl flex items-center justify-center">
                  <FaChartBar className="text-3xl text-teal" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-navy mb-2">100+</div>
                <div className="text-gray-600 font-medium">Listed Companies</div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                               rounded-xl flex items-center justify-center">
                  <FaClock className="text-3xl text-teal" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-navy mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Market Updates</div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                               rounded-xl flex items-center justify-center">
                  <FaBullseye className="text-3xl text-teal" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-navy mb-2">99%</div>
                <div className="text-gray-600 font-medium">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-navy mb-6">Why Choose StockSage?</h2>
            <div className="h-2 w-20 bg-gradient-to-r from-teal to-navy rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                             rounded-xl flex items-center justify-center mb-6">
                <FaChartLine className="text-3xl text-teal" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Real-Time Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant access to live market data, stock prices, and trading volumes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                             rounded-xl flex items-center justify-center mb-6">
                <FaClipboardCheck className="text-3xl text-teal" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Portfolio Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Track and manage your investments with our advanced portfolio tools.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-navy/10 to-teal/10 
                             rounded-xl flex items-center justify-center mb-6">
                <FaRocket className="text-3xl text-teal" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Market Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced charts and technical indicators for informed decision-making.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-navy mb-6">Our Team</h2>
          <div className="h-2 w-20 bg-gradient-to-r from-teal to-navy rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            'Sandesh Kuikel',
            'Shreya Uprety',
            'Subash Kandel'
          ].map((name) => (
            <div key={name} 
                 className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-navy to-teal rounded-full 
                             mb-8 shadow-xl p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <FaUsers className="text-6xl text-navy/20" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">{name}</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-navy hover:text-teal transition-colors">
                  <FaLinkedin className="text-xl" />
                </a>
                <a href="#" className="text-navy hover:text-teal transition-colors">
                  <FaGithub className="text-xl" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;