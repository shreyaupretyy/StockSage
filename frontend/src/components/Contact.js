import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaComments } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <FaComments className="text-6xl text-navy opacity-80" />
          </div>
          <h1 className="text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about StockSage? We're here to help you with any inquiries or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-navy mb-8">
              Contact Information
            </h2>
            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="bg-navy/5 p-3 rounded-lg group-hover:bg-navy/10 transition-colors">
                  <FaEnvelope className="text-navy" size={24} />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-navy">Email</h3>
                  <p className="text-gray-600 hover:text-teal transition-colors">
                    <a href="mailto:support@stocksage.com">info@stocksage.com</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="bg-navy/5 p-3 rounded-lg group-hover:bg-navy/10 transition-colors">
                  <FaPhone className="text-navy" size={24} />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-navy">Phone</h3>
                  <p className="text-gray-600">+977-123-456789</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-navy/5 p-3 rounded-lg group-hover:bg-navy/10 transition-colors">
                  <FaMapMarkerAlt className="text-navy" size={24} />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-navy">Address</h3>
                  <p className="text-gray-600">
                    Pulchowk Engineering Campus<br />
                    Lalitpur, Nepal<br />
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-12 p-6 bg-navy/5 rounded-lg">
              <h3 className="text-lg font-medium text-navy mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                <p>Friday: 10:00 AM - 4:00 PM</p>
                <p>Saturday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-navy mb-8">
              Send us a Message
            </h2>
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-white bg-navy hover:bg-navy/90
                         transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50
                         disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;