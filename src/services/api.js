import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/salud/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('token_expiry');
  if (token && expiry) {
    if (Date.now() > Number(expiry)) {
      // Token expirado: eliminarlo
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiry');
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
