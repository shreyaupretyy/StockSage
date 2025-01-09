import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            About Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 font-medium italic">
            "Empowering investors with intelligent insights"
          </p>
        </div>
        
        {/* Introduction Section */}
        <div className="space-y-8 mb-16">
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            Welcome to <span className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors">StockSage</span> 
            – where cutting-edge technology meets financial expertise. Our platform represents the future of intelligent investment decision-making.
          </p>
          
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            Founded by a dynamic team of students from Pulchowk Campus, 
            <span className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors"> StockSage </span> 
            emerged from our passion for combining advanced technology with financial markets. Our diverse team brings together expertise in machine learning, 
            financial analysis, and software engineering to create a comprehensive investment platform.
          </p>
          
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            We understand that navigating the stock market can be challenging. That's why we've developed 
            <span className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors"> StockSage </span> 
            to be your intelligent companion, providing data-driven insights and powerful analysis tools to help you make informed decisions with confidence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              Our mission is to democratize access to sophisticated investment tools and insights. We believe that every investor, 
              regardless of their experience level, should have access to professional-grade analysis tools and predictive technologies. 
              Through our platform, we aim to bridge the gap between complex market data and actionable investment decisions.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <h2 className="text-4xl font-bold text-gray-900">Our Features</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500/50 group-hover:scale-105 transition-transform">
                Advanced Stock Prediction
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Our sophisticated machine learning algorithms analyze vast amounts of market data, technical indicators, and historical patterns 
                to generate accurate predictions. We employ ensemble learning techniques and continuous model optimization to ensure reliable forecasting.
              </p>
            </div>

            <div className="group bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500/50 group-hover:scale-105 transition-transform">
                Intelligent Portfolio Management
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Take control of your investments with our comprehensive portfolio management system. Track performance, analyze risk metrics, 
                and receive personalized recommendations for portfolio optimization based on your investment goals and risk tolerance.
              </p>
            </div>

            <div className="group bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500/50 group-hover:scale-105 transition-transform">
                Real-time Sentiment Analysis
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Stay ahead of market trends with our advanced sentiment analysis engine. We process thousands of financial news articles, 
                social media posts, and market reports in real-time to provide you with valuable insights into market sentiment and emerging trends.
              </p>
            </div>

            <div className="group bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500/50 group-hover:scale-105 transition-transform">
                Intuitive User Experience
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Experience the perfect blend of power and simplicity with our thoughtfully designed interface. Access complex financial data 
                and analysis tools through an intuitive dashboard that makes navigation and decision-making effortless.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Us</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
              <h5 className="text-xl font-bold text-gray-900 mb-3">Innovation First</h5>
              <p className="text-gray-600">Constantly evolving our technology to provide cutting-edge solutions</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
              <h5 className="text-xl font-bold text-gray-900 mb-3">Data-Driven</h5>
              <p className="text-gray-600">Making decisions backed by comprehensive market analysis</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
              <h5 className="text-xl font-bold text-gray-900 mb-3">User-Focused</h5>
              <p className="text-gray-600">Designed with your success in mind</p>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center">
          <p className="text-xl text-gray-600 leading-relaxed">
            Let <span className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors">StockSage</span> be 
            your trusted partner in navigating the complex world of investments. Together, we'll transform your financial aspirations into reality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;