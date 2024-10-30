import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const validateToken = async (token) => {
  try {
    const response = await api.get('/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200; 
  } catch (error) {
    return false; 
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      const isValidToken = await validateToken(token); 
      if (!isValidToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Token inválido'));
      }
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
