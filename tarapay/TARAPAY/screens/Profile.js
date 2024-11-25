import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Profile = ({ navigation }) => {
    const user = {
        name: "Nicolás Oyanader Rojas",
        age: 24,
        type: "Estudiante",
        lastPayment: "HOY 14:35 hrs",
        lastBus: "Línea 9 Iquique",
        photo: require('../assets/icons/user.png'), // Ruta de la imagen
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        // Redirigir a la pantalla de inicio de sesión
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignUp' }], // Reemplaza el stack con SignUp
        });
    };

    return (
        <View style={styles.container}>
            {/* Fondo y avatar */}
            <View style={styles.profileHeader}>
                <Image source={user.photo} style={styles.photo} />
            </View>

            {/* Información del usuario */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Nombre: <Text style={styles.infoHighlight}>{user.name}</Text></Text>
                <Text style={styles.infoText}>Edad: <Text style={styles.infoHighlight}>{user.age} Años</Text></Text>
                <Text style={styles.infoText}>Tipo de usuario: <Text style={styles.infoHighlight}>{user.type}</Text></Text>
                <Text style={styles.infoText}>Último pago: <Text style={styles.infoHighlightRed}>{user.lastPayment}</Text></Text>
                <Text style={styles.infoText}>Último bus: <Text style={styles.infoHighlight}>{user.lastBus}</Text></Text>
            </View>

            {/* Botón de cerrar sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB', // Fondo azul
        alignItems: 'center',
        paddingVertical: 50, // Ajuste para mover hacia abajo
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF',
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '90%',
        padding: 20,
        alignItems: 'flex-start',
        marginTop: 20, // Espacio adicional debajo de la foto
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    infoHighlight: {
        fontWeight: 'bold',
        color: '#333',
    },
    infoHighlightRed: {
        fontWeight: 'bold',
        color: '#FF0000',
    },
    logoutButton: {
        backgroundColor: '#1E90FF',
        borderRadius: 5,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    logoutText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default Profile;
