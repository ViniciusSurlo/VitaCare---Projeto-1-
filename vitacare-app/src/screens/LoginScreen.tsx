import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { authService } from '../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Definição do tipo para as props de navegação
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
} 


const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Preencha os dados!', 'Por favor, preencha o email e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, senha });
      console.log('Login Response:', response);
      Alert.alert('Sucesso!', 'Login realizado com sucesso!');

      try {
        // tentar buscar os dados do usuário
        await authService.fetchUsuarioAtual()
      } catch (erroUsuario) {
        console.warn('Aviso: Não foi possível buscar os dados do usuário atual', erroUsuario);
        // Continua mesmo assim (sem os dados do usuário)
      }
      // Login bem-sucedido, navega para a tela Home
      navigation.replace('Home')
    } catch (error: any) {
      const errorMessage = error?.message || 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container2} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', minHeight: 950 }}
    keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.img} />
      <Text style={styles.title}>VitaCare Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Entrar" onPress={handleLogin} color="#2563eb" />
          <Button title="Voltar" onPress={() => navigation.replace('Inicio')} color="#2563eb" />
        </View>

      )}
    </View>
   </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  container2: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  title: {
    fontSize: 28, // text-3xl
    fontWeight: 'bold',
    marginBottom: 32, // mb-8
    color: '#2563eb', // text-blue-600
  },
  input: {
    width: '100%',
    height: 48, // h-12
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 8,
    paddingHorizontal: 16, // px-4
    marginBottom: 16, // mb-4 / mb-6
    backgroundColor: '#ffffff', // bg-white
    fontSize: 16, // text-base
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'visible', // rounded-lg
    gap: 10, // space-y-2
  },
  img: {
    width: 200,
    height: 200,
    marginBottom: 20,
  }
});

export default LoginScreen;
