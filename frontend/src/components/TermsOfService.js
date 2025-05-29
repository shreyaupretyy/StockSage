import React from 'react';
import { FaGavel, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FaGavel className="text-6xl text-navy opacity-80" />
          </div>
          <h1 className="text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using StockSage's services.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="space-y-8 text-gray-600">
            {/* Acceptance of Terms */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                1. Acceptance of Terms
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <p className="leading-relaxed">
                  By accessing and using StockSage, you accept and agree to be bound by the terms
                  and provision of this agreement.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                2. Description of Service
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <p className="leading-relaxed">
                  StockSage provides AI-powered stock analysis and prediction services. We do not
                  guarantee the accuracy of predictions and are not responsible for any financial
                  losses.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                3. User Responsibilities
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <ul className="space-y-3">
                  {[
                    'Maintain the confidentiality of your account',
                    'Provide accurate and updated information',
                    'Use the service for lawful purposes only',
                    'Not attempt to manipulate or abuse the service'
                  ].map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="text-teal mt-1 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                4. Intellectual Property
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <p className="leading-relaxed">
                  All content, features, and functionality are owned by StockSage and are protected
                  by international copyright, trademark, and other intellectual property laws.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                5. Limitation of Liability
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <p className="leading-relaxed">
                  StockSage shall not be liable for any indirect, incidental, special, consequential,
                  or punitive damages resulting from your use or inability to use the service.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                6. Modifications
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <p className="leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of the
                  service after such modifications constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                7. Termination
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <p className="leading-relaxed">
                  We reserve the right to terminate or suspend your account and access to the
                  service at our sole discretion, without notice, for conduct that we believe
                  violates these terms or is harmful to other users, us, or third parties.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-navy/10 to-teal/10 rounded-xl border border-navy/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">Need Legal Assistance?</h3>
                  <p className="text-gray-600">
                    Contact our legal team at{' '}
                    <a 
                      href="mailto:legal@stocksage.com" 
                      className="text-teal hover:text-navy transition-colors duration-200"
                    >
                      legal@stocksage.com
                    </a>
                  </p>
                </div>
                <FaEnvelope className="text-3xl text-navy opacity-50" />
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: January 30, 2025
              </p>
              <p className="text-sm text-gray-500 mt-2">
                By using StockSage, you agree to these terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;