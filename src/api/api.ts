import axios, { AxiosInstance } from 'axios';

// Configure Axios API instance with the backend base URL
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string, // Make sure to set this in your .env file
});

// Add token if available for API requests
api.interceptors.request.use((config) => {
  const locationId = localStorage.getItem('ghl_location_id');
  if (locationId) {
    config.headers['X-Location-Id'] = locationId;
  }
  return config;
});

export default api;
