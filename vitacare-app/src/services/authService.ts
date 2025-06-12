import apiClient from './api'; // Importa nossa instância configurada do Axios
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  access_token?: string;
  accessToken?: string
  user?: {
    id: number
    nome: string
    email: string
  }
  // Inclua outras propriedades que sua API retorna no login/registro, se houver
  // Ex: usuario: { id: number; nome: string; email: string; }
}

// --- Funções do Serviço ---

/**
 * Envia as credenciais de login para a API.
 * Em caso de sucesso, armazena o token JWT e retorna os dados da resposta.
 * Em caso de erro, lança o erro para ser tratado na tela.
 */
// const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
//   try {
//     // Faz a requisição POST para o endpoint /auth/login
//     const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

//     // Verifica se a resposta contém o token
//     if (response.data && response.data.access_token) {
//       const token = response.data.access_token;
//       // Armazena o token no AsyncStorage
//       await AsyncStorage.setItem('userToken', token);
      
//       // Configura o Axios para usar o token em requisições futuras (opcional aqui, melhor no interceptor)
//       // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       console.log('Login bem-sucedido, token armazenado.');
//       return response.data; // Retorna os dados da resposta (incluindo o token)
//     } else {
//       // Caso inesperado: resposta sem token
//       throw new Error('Resposta da API inválida após login.');
//     }
//   } catch (error: any) {
//     console.error('Erro no login:', error.response?.data || error.message);
//     // Relança o erro para que a tela possa exibir uma mensagem ao usuário
//     throw error.response?.data || new Error('Erro ao tentar fazer login.');
//   }
// };
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Faz a requisição POST para o endpoint /auth/Login
      const response = await apiClient.post<AuthResponse>('/auth/Login', credentials)
      // Verificar se a resposta contém dados
      if(response.data){
        // Verifica se há token na resposta (em diferentes formatos)
        const token = response.data.access_token || response.data.accessToken
  
        if (token) {
          // Armazena o token no AsyncStorage
          await AsyncStorage.setItem('userToken', token)

          // Armazena os dados de usuário
          if (response.data.user){
            await AsyncStorage.setItem('dadosUsuario', JSON.stringify(response.data.user))
          }
          console.log('Login bem-sucedido, token armazenado.', token.substring(0, 20) + '...');

          // Configura a Axios para usar o token em requisições futuras (futuro)
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Retorna os dados da resposta
          return response.data 
        } else {
          console.error('Resposta não contém token válido:', response.data);
          throw new Error('Resposta da API não contém token de acesso')
          
        } 
      } else {
        // Caso inesperado: resposta sem dados
        throw new Error('Resposta da API vazia após login')
      }
    } catch (error: any){
      console.error('Erro no Login', error.response?.data || error.message);
      // Joga o erro para ser exibido na tela
      throw error.response?.data || new Error('Erro ao tentar fazer Login')
      
    }
  }

  const getDadosUsuario = async () => {
    try {
      const dadosUsuarioString = await AsyncStorage.getItem('dadosUsuario')
      if (dadosUsuarioString) {
        return JSON.parse(dadosUsuarioString)
      }
      return null
    } catch (error){
      console.error('Erro ao obter dados do usuário:', error);
      return null
      
    }
  }
/**
 * Envia os dados de registro para a API.
 */
const registrar = async (data: RegisterData): Promise<any> => { // Ajuste o tipo de retorno conforme sua API
  try {
    // Faz a requisição POST para o endpoint /auth/register
    // Assumindo que seu backend retorna os dados do usuário criado ou uma mensagem de sucesso
    const response = await apiClient.post('/auth/registrar', data);
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
    await AsyncStorage.removeItem('dadosUsuario');
    // Remove o cabeçalho de autorização padrão do Axios (se configurado)
    // delete apiClient.defaults.headers.common['Authorization'];
    console.log('Logout realizado, token e dados do usuário removidos.');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Erro ao tentar fazer logout.');
  }
};

 const fetchUsuarioAtual = async (): Promise<any> => {
    try {
      const response = await apiClient.get('/usuarios/perfil')

      if (response.data) {
        // Armazena os dados do usuário 
        await AsyncStorage.setItem('dadosUsuario', JSON.stringify(response.data))
        return response.data
      }
      return null
    } catch (error : any) {
      console.error('Erro ao buscar dados do usuário atual:', error.response?.data || error.message);
      throw error.response?.data || new Error('Erro ao buscar dados do usuário atual.');
      
    }
  }

// Exporta as funções para serem usadas em outros lugares do app
export const authService = {
  login,
  registrar,
  logout,
  getDadosUsuario,
  fetchUsuarioAtual
};
