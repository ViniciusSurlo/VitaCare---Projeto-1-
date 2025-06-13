import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Video, ResizeMode } from "expo-av";

type PrincipalProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Principal'>
}

const PrincipalScreen = ({ navigation }: PrincipalProps) => {
  return (
    <View style={styles.container}>
      {/* VÍDEO COMO FUNDO */}
      <Video
        source={require('../assets/principal.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />

      {/* CONTEÚDO POR CIMA DO VÍDEO */}
      <View style={styles.overlay}>
        <Text style={styles.title}>O jeito inteligente de cuidar de Você!</Text>
        <Text style={styles.subtitle}>Sua vida saudável está chegando...</Text>
        <TouchableOpacity onPress={() => navigation.replace('Inicio')} style={styles.botao}>
          <Text style={styles.textButton}>Vamos lá!</Text>
        </TouchableOpacity>
        <Image style={styles.image} source={require('../assets/logo2.png')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center', //tem dois justifycontent, eu comentei um ae
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // opcional: leve sobreposição
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
    
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  image: {
    width: 100,
    height: 60,
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  botao: {
    backgroundColor: '#001e5f',
    borderRadius: 17,
    height: 46,
    width: 242,
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PrincipalScreen;
