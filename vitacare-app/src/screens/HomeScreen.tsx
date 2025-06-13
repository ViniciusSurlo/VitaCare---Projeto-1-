import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  Modal,
  ScrollView
} from "react-native";
import { authService } from "../services/authService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { armazenarDataAtual, obterDataAtual } from "../utils/dataUtils";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import {
  SafeAreaView,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { Calendar } from 'react-native-calendars';


type HomeProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen = ({ navigation }: HomeProps) => {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataAtual, setDataAtual] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect para data
  useEffect(() => {
    const atualizarData = async () => {
      await armazenarDataAtual();
      const data = await obterDataAtual();
      setDataAtual(data);
    };
    atualizarData();
  }, []);

  // useEffect para nome do usuário
  useEffect(() => {
    const fetchNomeUsuario = async () => {
      try {
        const dadosUsuario = await authService.getDadosUsuario();
        if (dadosUsuario && dadosUsuario.nome) {
          setNomeUsuario(dadosUsuario.nome);
        } else {
          setNomeUsuario("Usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setNomeUsuario("Usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchNomeUsuario();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigation.replace("Login");
  };

  return (
    <ScrollView> 
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerDashboard}>
        <Image source={require("../assets/logo.png")} style={styles.img} />
        <View style={{ width: 200, marginTop: 20 }}>
          <Text style={styles.title}>Olá, {nomeUsuario}</Text>
          <Text style={styles.subtitle}>
            {dataAtual
              ? new Date(dataAtual).toLocaleString("pt-BR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })
              : ""}
          </Text>
        </View>
        <View style={styles.sininho}>
          <Entypo name="bell" size={24} color="black" />
        </View>
      </View>

      {/* Card principal */}
      <View>
        <Image
          source={require("../assets/card-dashboard.png")}
          style={styles.cardDashboard}
        />
      </View>

      {/* Calendário */}
      <View style={styles.container}>
      <Calendar
        onDayPress={day => {
          console.log('Dia selecionado:', day);
        }}
        theme={
          {
          selectedDayBackgroundColor: '#000',
          monthTextColor: '#0049ab',
          textMonthFontWeight: 'bold',
          textMonthFontSize: 18,
          arrowColor: '#ffff',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System'
          }
        }
        markedDates={{
          '2025-06-13': { selected: true, marked: true, selectedColor: '#0049ab' },
        }}
      />
    </View>

      {/* Lista de Remédios */}
      <View style={{ width: 340 }}>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 20 }}>
            Remédios de Hoje
          </Text>
          <Text style={styles.verMais}>Ver mais...</Text>
        </View>

        <View style={styles.boxBranco}>
          <Text style={{ fontWeight: "bold" }}>Aspirina</Text>
          <Text style={{ color: "#c9c9c9" }}>Dosagem: 30.8ml</Text>
        </View>
        <View style={styles.boxBranco}>
          <Text style={{ fontWeight: "bold" }}>Ibuprofeno</Text>
          <Text style={{ color: "#c9c9c9" }}>Dosagem: 15.0 - 30 ml</Text>
        </View>
      </View>

      {/* Menu Azul Inferior com Modal */}
      <View style={styles.menuAzul}>
        
        <SafeAreaProvider>
          <SafeAreaView style={styles.centeredView}>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <FontAwesome6 name="bars" size={30} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
          
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    O que vamos fazer hoje?
                  </Text>
                  <View style={styles.cardRecurso}>

                  </View> 
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Voltar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            </SafeAreaProvider>

            
        

        <View style={styles.bolinha}>
          <Feather name="home" size={30} color="#0049ab" />
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Entypo name="log-out" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: "#4b5563",
    textAlign: "center",
  },
  img: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  headerDashboard: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 20,
  },
  cardDashboard: {
    width: 350,
    height: 200,
    borderRadius: 15,
    marginVertical: 20,
    gap: 1,
    alignItems: "center",
    textAlign: "center",
  },
  boxBranco: {
    backgroundColor: "#fff",
    width: 340,
    height: 60,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  verMais: {
    fontWeight: "300",
    fontStyle: "italic",
    color: "#0049ab",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  menuAzul: {
    width: 340,
    height: 90,
    borderRadius: 40,
    backgroundColor: "#0049ab",
    margin: 20,
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
    paddingHorizontal: 55,
  },
  bolinha: {
    backgroundColor: "#bed0ff",
    height: 70,
    width: 70,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sininho: {
    backgroundColor: "#bed0ff",
    height: 35,
    width: 40,
    borderRadius: 13,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#0049AB",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 20
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)', // escurece o fundo
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRecurso: {
    backgroundColor: '#001E5F',
    width: 271,
    height: 246,
    borderRadius: 51
  }
});

export default HomeScreen;
