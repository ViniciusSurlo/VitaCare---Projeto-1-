import apiClient from './api'; // Importa nossa instância configurada do Axios
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Tipos (Idealmente viriam de um arquivo compartilhado ou src/types) ---
// Vamos definir tipos básicos aqui por enquanto
interface LoginCredentials {
  email: string;
  senha: string; // Nome do campo conforme esperado pelo seu backend DTO
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  // Adicione outros campos do seu CriarUsuarioDto se necessário
}

interface AuthResponse {
  access_token: string;
  // Inclua outras propriedades que sua API retorna no login/registro, se houver
  // Ex: usuario: { id: number; nome: string; email: string; }
}

// --- Funções do Serviço ---

/**
 * Envia as credenciais de login para a API.
 * Em caso de sucesso, armazena o token JWT e retorna os dados da resposta.
 * Em caso de erro, lança o erro para ser tratado na tela.
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Faz a requisição POST para o endpoint /auth/login
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    // Verifica se a resposta contém o token
    if (response.data && response.data.access_token) {
      const token = response.data.access_token;
      // Armazena o token no AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      
      // Configura o Axios para usar o token em requisições futuras (opcional aqui, melhor no interceptor)
      // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Login bem-sucedido, token armazenado.');
      return response.data; // Retorna os dados da resposta (incluindo o token)
    } else {
      // Caso inesperado: resposta sem token
      throw new Error('Resposta da API inválida após login.');
    }
  } catch (error: any) {
    console.error('Erro no login:', error.response?.data || error.message);
    // Relança o erro para que a tela possa exibir uma mensagem ao usuário
    throw error.response?.data || new Error('Erro ao tentar fazer login.');
  }
};

/**
 * Envia os dados de registro para a API.
 */
const register = async (data: RegisterData): Promise<any> => { // Ajuste o tipo de retorno conforme sua API
  try {
    // Faz a requisição POST para o endpoint /auth/register
    // Assumindo que seu backend retorna os dados do usuário criado ou uma mensagem de sucesso
    const response = await apiClient.post('/auth/register', data);
    console.log('Registro bem-sucedido:', response.data);
    // Você pode querer fazer login automaticamente após o registro
    // ou apenas retornar os dados/mensagem para a tela.
    return response.data;
  } catch (error: any) {
    console.error('Erro no registro:', error.response?.data || error.message);
    // Relança o erro para tratamento na tela
    throw error.response?.data || new Error('Erro ao tentar registrar.');
  }
};

/**
 * Remove o token do AsyncStorage (Logout).
 */
const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userToken');
    // Remove o cabeçalho de autorização padrão do Axios (se configurado)
    // delete apiClient.defaults.headers.common['Authorization'];
    console.log('Logout realizado, token removido.');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Erro ao tentar fazer logout.');
  }
};

// Exporta as funções para serem usadas em outros lugares do app
export const authService = {
  login,
  register,
  logout,
};
