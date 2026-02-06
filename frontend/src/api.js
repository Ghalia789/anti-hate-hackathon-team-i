/**
 * API Service - GDPR Compliant
 * No localStorage, no cookies, stateless communication
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance without any persistence
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // GDPR: No credentials, no cookies
  withCredentials: false,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server');
    } else {
      // Something else happened
      throw new Error('Request failed');
    }
  }
);

const api = {
  /**
   * Health check endpoint
   */
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  /**
   * Analyze single text for hate speech
   * @param {string} text - Text to analyze
   */
  analyzeText: async (text) => {
    const response = await apiClient.post('/analyze', { text });
    return response.data;
  },

  /**
   * Batch analyze multiple texts
   * @param {string[]} texts - Array of texts to analyze
   */
  batchAnalyze: async (texts) => {
    const response = await apiClient.post('/batch-analyze', { texts });
    return response.data;
  },
};

export default api;
