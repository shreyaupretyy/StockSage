import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaGlobe, FaShieldAlt, FaToggleOn, FaToggleOff, FaSpinner, FaMoon, FaSun } from 'react-icons/fa';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      priceAlerts: true,
      newsAlerts: false,
      predictionsAlerts: true
    },
    preferences: {
      language: 'en',
      currency: 'USD',
      theme: 'light',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    privacy: {
      shareData: false,
      publicProfile: false,
      activityTracking: true
    }
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch initial settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again.');
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  // Handle theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.preferences.theme === 'dark');
  }, [settings.preferences.theme]);

  // Toggle settings
  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    setHasChanges(true);
  };

  // Handle select changes
  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setHasChanges(true);
  };

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(
        'http://localhost:5000/api/user/settings',
        settings,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Settings saved successfully');
      setHasChanges(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving settings. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Confirmation before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-navy mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-navy mb-4 font-['Inter']">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        {/* Alerts */}
        {(success || error) && (
          <div className={`mb-6 p-4 rounded-lg ${
            success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>
              {success || error}
            </p>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 bg-navy text-white">
              <div className="flex items-center">
                <FaBell className="mr-3" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <span className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleToggle('notifications', key)}
                    className="transition-colors duration-200"
                  >
                    {value ? (
                      <FaToggleOn className="text-3xl text-teal" />
                    ) : (
                      <FaToggleOff className="text-3xl text-gray-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 bg-navy text-white">
              <div className="flex items-center">
                <FaGlobe className="mr-3" />
                <h2 className="text-xl font-semibold">Display Preferences</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Language */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Language</span>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleSelectChange('preferences', 'language', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Currency */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Currency</span>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => handleSelectChange('preferences', 'currency', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Theme</span>
                <button
                  onClick={() => handleSelectChange('preferences', 'theme', 
                    settings.preferences.theme === 'light' ? 'dark' : 'light')}
                  className="flex items-center px-4 py-2 bg-navy/5 rounded-lg hover:bg-navy/10 transition-colors"
                >
                  {settings.preferences.theme === 'light' ? (
                    <>
                      <FaSun className="mr-2 text-yellow-500" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <FaMoon className="mr-2 text-navy" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 bg-navy text-white">
              <div className="flex items-center">
                <FaShieldAlt className="mr-3" />
                <h2 className="text-xl font-semibold">Privacy Settings</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <span className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleToggle('privacy', key)}
                    className="transition-colors duration-200"
                  >
                    {value ? (
                      <FaToggleOn className="text-3xl text-teal" />
                    ) : (
                      <FaToggleOff className="text-3xl text-gray-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
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
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;