import React from "react";
import { View, Text, StyleSheet, Button, Image, ImageBackground, TouchableOpacity, Touchable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { MaterialIcons } from '@expo/vector-icons';
type InicioProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Inicio'>
}


const InicioScreen = ({ navigation }: InicioProps) => {

  const navegarParaLogin = () => {
    navigation.replace('Login')
  }
  const navegarParaCriar = () => {
    navigation.replace('Criar')
  }
  return (
    <ImageBackground
      source={require('../assets/inicio3.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
        <TouchableOpacity style={styles.voltar} onPress={() => navigation.replace('Principal')}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" style={{ marginRight: 4 }} />
          <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>Voltar</Text>
        </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Seja bem-vindo ao VitaCare</Text>
        {/* <Text style={styles.subtitle}>Sua vida saudável está chegando!</Text> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={navegarParaLogin} style={styles.botaoLogin}>
            <Text style={styles.botaoLoginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navegarParaCriar} style={styles.botaoCadastrar}>
            <Text style={styles.botaoCadastrarText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoInicio}>
          <Image source={require('../assets/logo2.png')} style={styles.logoInicio} />
        </View>
        {/* <View style={styles.logoInicio}>
              <Image source={require('../assets/logo2.png')} />
            </View> */}
      </View>

    </ImageBackground>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 420,
    // backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 15
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '300',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'visible',
    // justifyContent: 'center',
    gap: 10,
  },
  botaoLogin: {
    backgroundColor: '#bed0ff',
    borderRadius: 17,
    height: 46,
    width: 242,
  },
  botaoLoginText: {
    fontSize: 20,
    color: '#001e5f',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '300',
    marginTop: 10
  },
  botaoCadastrar: {
    backgroundColor: '#001e5f',
    textAlign: 'center',
    borderRadius: 17,
    height: 46,
    width: 242,
  },
  botaoCadastrarText: {
    color: '#fff',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '300',
    marginTop: 10,
    fontSize: 20,
  },
  logoInicio: {
    height: 60,
    width: 110,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  img: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  voltar: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    flexDirection: 'row',
  }
});

export default InicioScreen;