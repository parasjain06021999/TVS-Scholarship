// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  ENDPOINTS: {
    AUTH: '/auth',
    APPLICATIONS: '/applications',
    SCHOLARSHIPS: '/scholarships',
    DOCUMENTS: '/documents',
    PAYMENTS: '/payments',
    USERS: '/users',
    FEEDBACK: '/feedback',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
