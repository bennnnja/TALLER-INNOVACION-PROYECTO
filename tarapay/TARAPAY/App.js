import 'react-native-gesture-handler';
import React from 'react';

import Register from './screens/Register';
import { SignUp } from "./screens";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Tabs from "./navigation/tabs";
import { UserProvider } from './UserContext'; // Ruta corregida

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
    });
    
    if(!loaded){
        return null;
    }

    return (
        <UserProvider>
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                    initialRouteName="SignUp"
                >
                    <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="HomeTabs" component={Tabs} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
};

export default App;
