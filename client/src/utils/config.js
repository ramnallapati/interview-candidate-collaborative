// Environment configuration
const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  
  // Development vs Production
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('Environment Configuration:', {
    API_URL: config.API_URL,
    SOCKET_URL: config.SOCKET_URL,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
  });
}

export default config;
