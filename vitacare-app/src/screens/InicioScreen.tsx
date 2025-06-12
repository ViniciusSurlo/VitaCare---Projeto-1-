import React from "react";
import {  View, Text, StyleSheet, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type InicioProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Inicio'>
}


const InicioScreen = ({ navigation }: InicioProps) => {

    const navegarParaLogin = () => {
        navigation.replace('Login')
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>VitaCare</Text>
            <Text style={styles.title}>Bem vindo ao VitaCare!</Text>
            <Text style={styles.subtitle}>O jeito Inteligente de cuidar de Você!</Text>
            <View style={styles.buttonContainer}>
                <Button 
                title="Entrar"
                color="#2563eb"
                onPress={navegarParaLogin}
                />
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

export default InicioScreen;