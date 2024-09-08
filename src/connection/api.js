import axios from 'axios';

// Cria uma instância do axios com a baseURL do backend Spring Boot
const api = axios.create({
    baseURL: 'http://localhost:8080', // Certifique-se de que o backend está rodando nesta URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
