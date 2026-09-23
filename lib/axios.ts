import axios from 'axios';
import { getToken, removeToken } from './auth';

// Single Axios instance used everywhere in the app.
// Interceptors handle token injection and global error normalisation.
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT from localStorage before every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central response error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 means the token is gone or expired — log the user out.
    // BUT skip the redirect for the login endpoint itself so LoginForm
    // can catch and display the "invalid credentials" error.
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    // Re-throw so callers can still handle specific cases (e.g. 404)
    return Promise.reject(error);
  }
);

export default apiClient;
