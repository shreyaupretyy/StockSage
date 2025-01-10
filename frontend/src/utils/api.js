const API_BASE_URL = 'http://localhost:5000';

// Add token to request headers
const getHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

export const fetchNews = async (category = 'all') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/news?category=${category}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch news');
  }
};

export const fetchMarketSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/market-summary`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch market summary');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch market summary');
  }
};