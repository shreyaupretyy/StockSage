import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaSpinner, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        setError('Failed to load profile data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setHasChanges(true);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/user/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Profile updated successfully');
      setUserData(response.data);
      setIsEditing(false);
      setHasChanges(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setFormData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-navy mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full bg-navy/5 mb-4">
            <FaUserCircle className="text-6xl text-navy" />
          </div>
          <h1 className="text-4xl font-extrabold text-navy mb-4 font-['Inter']">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="p-6 bg-navy text-white flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <FaUser className="text-2xl" />
              <div>
                <h2 className="text-xl font-semibold">{userData?.fullName}</h2>
                <p className="text-sm text-white/80">{userData?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-white text-navy rounded-lg hover:bg-teal/90 transition-colors"
            >
              {isEditing ? (
                <>
                  <FaTimes className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div className={`p-4 ${
              error ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'
            }`}>
              <p className={`text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
                {error || success}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <FaUser className="mr-2 text-navy" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing 
                      ? 'border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20' 
                      : 'border-gray-100 bg-gray-50'
                  } transition-colors`}
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <FaEnvelope className="mr-2 text-navy" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing 
                      ? 'border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20' 
                      : 'border-gray-100 bg-gray-50'
                  } transition-colors`}
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <FaPhone className="mr-2 text-navy" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing 
                      ? 'border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20' 
                      : 'border-gray-100 bg-gray-50'
                  } transition-colors`}
                />
              </div>
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-navy mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                      <FaLock className="mr-2 text-navy" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                      <FaLock className="mr-2 text-navy" />
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                      <FaLock className="mr-2 text-navy" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className={`px-6 py-2 bg-navy text-white rounded-lg transform transition-all duration-200
                            ${hasChanges ? 'hover:bg-navy/90 hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                            ${saving ? 'flex items-center' : ''}`}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="inline mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Profile;