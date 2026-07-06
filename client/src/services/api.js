import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 20000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && localStorage.getItem('token')) {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    if (!location.pathname.includes('login')) location.assign('/login');
  }
  return Promise.reject(error);
});
export const errorMessage = (error) => error.response?.data?.message || error.message || 'Something went wrong';
export default api;
