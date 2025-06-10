import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen'; // Importa a nossa tela de login

export default function App() {
  return (
    <View style={styles.container}>
      {/* Renderiza a LoginScreen diretamente por enquanto */}
      <LoginScreen /> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removemos o backgroundColor, alignItems e justifyContent daqui
    // para que a tela LoginScreen controle seu próprio layout.
  },
});
