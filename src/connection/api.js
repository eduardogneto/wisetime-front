import axios from 'axios';

const baseURL = "https://wisetime.site/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const validateToken = async (token) => {
  try {
    const response = await axios.get(baseURL + '/auth/validate-token', {
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
