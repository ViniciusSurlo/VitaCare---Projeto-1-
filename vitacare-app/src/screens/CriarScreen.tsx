import React, { useState } from 'react'
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
} from 'react-native';

import { authService } from '../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CriarScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Criar'>
}

const CriarScreen = ({ navigation }: CriarScreenProps) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleCriar = async () => {
        
        if (!nome || !email || !senha) {
          Alert.alert('Preencha os dados!', 'Por favor, preencha o nome, email e a senha.');
          return;
        }

        const emailFormatado = email.trim().toLowerCase();

        if (!emailFormatado.endsWith("@gmail.com")) {
          Alert.alert("E-mail inválido!", "O e-mail deve terminar com '@gmail.com'.");
          return;
        }

        if (senha.length < 6) {
          Alert.alert('Senha muito curta!', 'A senha deve ter pelo menos 6 caracteres.');
          return;
        }
    
        setIsLoading(true);
        try {
          const response = await authService.registrar({nome, email, senha });
          console.log('Cadastro Response:', response);
          Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');

          // Criar bem-sucedido, navega para a tela Inicio
          navigation.replace('Inicio')
        } catch (error: any) {
          const errorMessage = error?.message || 'Ocorreu um erro desconhecido.';
          Alert.alert('Erro no Cadastro', errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
    
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.img}/>
      <Text style={styles.title}>VitaCare Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />

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
          <Button title="Criar" onPress={handleCriar} color="#2563eb" />
          <Button title="Voltar" onPress={() => navigation.replace('Inicio')} color="#2563eb" />
        </View>

      )}
    </View>
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
    width: 150,
    height: 150,
    marginBottom: 20,
  }
});

export default CriarScreen;
