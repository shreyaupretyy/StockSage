import React from 'react';
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FaShieldAlt className="text-6xl text-navy opacity-80" />
          </div>
          <h1 className="text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and manage your data.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="space-y-8 text-gray-600">
            {/* Information We Collect */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                1. Information We Collect
              </h2>
              <div className="space-y-4 ml-5">
                <div className="bg-navy/5 p-6 rounded-lg">
                  <h3 className="font-medium text-navy mb-3">Personal Information:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Name and email address</li>
                    <li>Contact information</li>
                    <li>Account credentials</li>
                    <li>Financial information for portfolio management</li>
                  </ul>
                </div>

                <div className="bg-navy/5 p-6 rounded-lg">
                  <h3 className="font-medium text-navy mb-3">Usage Data:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Browser type and version</li>
                    <li>Time spent on pages</li>
                    <li>Access times and dates</li>
                    <li>Platform interaction patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                2. How We Use Your Information
              </h2>
              <div className="bg-navy/5 p-6 rounded-lg ml-5">
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="transform transition-all duration-300 hover:translate-x-1">
              <h2 className="flex items-center text-2xl font-semibold text-navy mb-4">
                <span className="w-2 h-2 bg-teal rounded-full mr-3"></span>
                3. Data Security
              </h2>
              <div className="ml-5 space-y-4">
                <p>
                  We implement appropriate security measures to protect against unauthorized access,
                  alteration, disclosure, or destruction of your personal information.
                </p>
                <div className="bg-navy/5 p-6 rounded-lg">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Secure data storage practices</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Continue similar styling for other sections... */}

            {/* Contact Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-navy/10 to-teal/10 rounded-xl border border-navy/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">Have questions?</h3>
                  <p className="text-gray-600">
                    Contact our privacy team at{' '}
                    <a 
                      href="mailto:privacy@stocksage.com" 
                      className="text-teal hover:text-navy transition-colors duration-200"
                    >
                      privacy@stocksage.com
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
                StockSage is committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;