import axios from 'axios';

// Cria uma instância do axios com a baseURL do backend Spring Boot
const api = axios.create({
    baseURL: 'http://localhost:8080', // Certifique-se de que o backend está rodando nesta URL
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token'); // Pega o token do localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api;
