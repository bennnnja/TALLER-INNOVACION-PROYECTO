import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { UserContext } from '../UserContext'; // Ruta corregida

const SignUp = ({ navigation }) => {
    const [correo, setEmail] = useState('');
    const [contrasena, setPassword] = useState('');
    const { setUser } = useContext(UserContext);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.89:50587/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, contrasena }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }
    
            const data = await response.json();

            console.log('Respuesta JSON desde el servidor:', data);

    
            if (!data.user) {
                throw new Error('Datos del usuario no encontrados');
            }
    
            // Actualiza el contexto del usuario con los datos relevantes
            setUser({
                rut: data.user.rut || '',
                nombre: data.user.nombre || '',
                apellido: data.user.apellido || '',
                correo: data.user.correo || '',
                telefono: data.user.telefono || '',
                tipo_usuario: data.user.tipo_usuario || '',
                estado: data.user.estado || '',
                saldo: data.user.saldo || 0,
            });
            
    
            Alert.alert('Éxito', data.message);
            navigation.navigate('HomeTabs');
        } catch (error) {
            Alert.alert('Error', error.message || 'No se pudo conectar con el servidor');
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={correo}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={contrasena}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.registerButtonText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        marginTop: 10,
    },
    registerButtonText: {
        color: '#007BFF',
        fontSize: 16,
    },
});

export default SignUp;
