import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openSection, setOpenSection] = useState(null);
  const faqData = {
    general: [
      {
        question: "What is StockSage?",
        answer: "StockSage is an AI-powered stock analysis and prediction platform that helps investors make informed decisions through advanced market analysis, real-time data, and machine learning predictions."
      },
      {
        question: "How accurate are the predictions?",
        answer: "While we use advanced AI algorithms and comprehensive data analysis, stock market predictions are inherently uncertain. Our predictions should be used as one of many tools in your investment decision-making process."
      },
      {
        question: "Is StockSage free to use?",
        answer: "We offer both free and premium plans. Basic features are available for free, while advanced analysis tools and real-time predictions require a premium subscription."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button, fill in your details, verify your email address, and you're ready to start using StockSage."
      },
      {
        question: "Can I change my account settings?",
        answer: "Yes, you can modify your account settings, including email preferences, notification settings, and password, through the Settings page in your dashboard."
      },
      {
        question: "How can I reset my password?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
      }
    ],
    features: [
      {
        question: "What analysis tools are available?",
        answer: "We offer technical analysis indicators, fundamental analysis data, AI-powered predictions, portfolio tracking, and real-time market news integration."
      },
      {
        question: "How often is the data updated?",
        answer: "Market data is updated in real-time during market hours. AI predictions are updated daily, and fundamental data is updated quarterly or as new information becomes available."
      },
      {
        question: "Can I track multiple portfolios?",
        answer: "Yes, premium users can create and track multiple portfolios with real-time updates and performance analytics."
      }
    ],
    technical: [
      {
        question: "What browsers are supported?",
        answer: "StockSage works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we use industry-standard encryption and security measures to protect your data. All communications are encrypted using SSL/TLS protocols."
      },
      {
        question: "Can I export my data?",
        answer: "Yes, premium users can export their portfolio data, analysis results, and historical predictions in various formats including CSV and PDF."
      }
    ]
  };

  // Your existing faqData object remains the same

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <FaQuestionCircle className="text-6xl text-navy opacity-80" />
          </div>
          <h1 className="text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about StockSage's features and services
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {Object.entries(faqData).map(([category, questions]) => (
            <div 
              key={category} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              <button
                className={`w-full px-8 py-5 flex justify-between items-center ${
                  openSection === category 
                    ? 'bg-navy text-white' 
                    : 'bg-white text-navy hover:bg-navy/5'
                } transition-all duration-300`}
                onClick={() => toggleSection(category)}
              >
                <span className="text-xl font-semibold capitalize tracking-wide">
                  {category}
                </span>
                <span className="text-lg transition-transform duration-300">
                  {openSection === category ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>

              {openSection === category && (
                <div className="divide-y divide-gray-100">
                  {questions.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-8 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-semibold text-navy mb-3 flex items-center">
                        <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                        {item.question}
                      </h3>
                      <p className="text-gray-600 ml-5 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-semibold text-navy mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions or concerns.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-navy hover:bg-navy/90 text-white font-medium px-8 py-3 rounded-lg
                      transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Contact Support
          </Link>
        </div>        
      </div>
    </div>
  );
};

export default FAQ;