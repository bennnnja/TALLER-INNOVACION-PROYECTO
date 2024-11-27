import 'react-native-gesture-handler';
import React from 'react';
import Register from './screens/Register';
import { SignUp } from "./screens";
import Home from './screens/Home'; // Asegúrate de que la ruta de Home sea correcta
import AgregarSaldo from './screens/AgregarSaldo'; // Asegúrate de que la ruta de AgregarSaldo sea correcta
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Tabs from "./navigation/tabs";
import HistorialScreen from "./screens/HistorialScreen"; // Importar la pantalla del historial
import { UserProvider } from './UserContext'; // Ruta corregida
import Scan from './screens/Scan'; // Asegúrate de que la ruta sea correcta
import Pay from './screens/Pay'; // Asegúrate de que la ruta sea correcta

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const Stack = createStackNavigator();

const App = () => {
    const [loaded] = useFonts({
        "Roboto-Black" : require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold" : require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular" : require('./assets/fonts/Roboto-Regular.ttf'),
    });;
    
    
    if(!loaded){
        return null;
    }

    return (
        <UserProvider>
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false, // Ocultar encabezados por defecto
                }}
                initialRouteName="SignUp" // Pantalla inicial
            >
                {/* Pantallas ya existentes */}
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="HomeTabs" component={Tabs} />
                <Stack.Screen name="Scan" component={Scan} />
                <Stack.Screen name="Pay" component={Pay} />
                
                {/* Nueva pantalla del historial */}
                <Stack.Screen 
                    name="HistorialScreen" 
                    component={HistorialScreen} 
                    options={{
                        headerShown: true, // Mostrar encabezado para esta pantalla
                        title: "Historial",
                        headerStyle: { backgroundColor: "#80B4F7" },
                        headerTintColor: "#FFFFFF",
                        headerTitleStyle: { fontWeight: "bold" },
                    }} 
                />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen 
                    name="AgregarSaldo" 
                    component={AgregarSaldo} 
                    options={{
                        headerShown: true, // Muestra el encabezado solo para esta pantalla
                        title: "Agregar Saldo", // Título del encabezado
                    }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
        </UserProvider>
    );
};


export default App;
