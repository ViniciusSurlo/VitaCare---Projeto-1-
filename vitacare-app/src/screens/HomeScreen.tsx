import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { authService } from "../services/authService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>
}

// const HomeScreen = ({ navigation }: Props) => {
const HomeScreen = ({ navigation }: HomeProps) => {
    const [nomeUsuario, setNomeUsuario] = useState('')
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchNomeUsuario = async () => {
            try {
              const dadosUsuario = await authService.getDadosUsuario()
              if (dadosUsuario && dadosUsuario.nome){
                setNomeUsuario(dadosUsuario.nome)
              } else {
                setNomeUsuario('Usuário')
              }
            } catch (error){
              console.error('Erro ao buscar dados do usuário:', error);
              setNomeUsuario('Usuário')
            } finally {
              setLoading(false)
            }
        }

        fetchNomeUsuario()
    }, [])


    const handleLogout = async () => {
        await authService.logout();
        // NavigationActivation.replace('login')
        navigation.replace('Login')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>VitaCare</Text>
            <Text style={styles.title}>Bem-vindo(a){nomeUsuario}!</Text>
            <Text style={styles.subtitle}>Você está logado!</Text>

            <View style={styles.buttonContainer}>
                <Button 
                title="Sair"
                color="ef4444"
                onPress={handleLogout} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#4b5563',
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default HomeScreen