import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importando telas
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import InicioScreen from "../screens/InicioScreen";
import CriarScreen from "../screens/CriarScreen";

// Definindo o tipo de navegação
export type RootStackParamList = {
    Inicio: undefined;
    Login: undefined;
    Criar: undefined;
    Home: undefined;
};

// Criar a navegação de pilha 
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Inicio">
                <Stack.Screen 
                    name="Inicio"
                    component={InicioScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Criar"
                    component={CriarScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'VitaCare',
                        headerStyle: {
                            backgroundColor: '#2563eb',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },

                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator