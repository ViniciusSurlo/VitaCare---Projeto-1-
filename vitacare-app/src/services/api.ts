import axios from 'axios';

// Define a URL base da sua API backend
const API_BASE_URL = 'http://192.168.200.100:3000';

// Cria uma instância do Axios com a URL base configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
} );

// // --- Interceptor (Adicionaremos depois) ---
// // Aqui poderemos adicionar um interceptor para incluir o token JWT
// // automaticamente em todas as requisições após o login.
// apiClient.interceptors.request.use(async (config) => {
//   // const token = await AsyncStorage.getItem('userToken'); // Exemplo
//   // if (token) {
//   //   config.headers.Authorization = `Bearer ${token}`;
//   // }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export default apiClient;
