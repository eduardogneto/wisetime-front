import axios from 'axios';

// Cria uma instância do axios com a baseURL do backend Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para validar o token no backend
const validateToken = async (token) => {
  try {
    const response = await axios.get('http://localhost:8080/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200; // Se a resposta for 200, o token é válido
  } catch (error) {
    return false; // Se houver erro, o token é inválido
  }
};

// Interceptador de requisição para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token'); // Pega o token do localStorage
    if (token) {
      const isValidToken = await validateToken(token); // Valida o token antes de cada requisição
      if (!isValidToken) {
        // Se o token for inválido, limpa o localStorage e redireciona para o login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Token inválido'));
      }
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpa o localStorage e redireciona para a página de login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
