import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../UserContext'; // Asegúrate de que la ruta sea correcta

const Profile = ({ navigation }) => {
    const { user } = useContext(UserContext);

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignUp' }],
        });
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Cargando datos del usuario...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Fondo y avatar */}
            <View style={styles.profileHeader}>
                <Image source={require('../assets/icons/user.png')} style={styles.photo} />
            </View>

            {/* Información del usuario */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Nombre: <Text style={styles.infoHighlight}>{user.nombre || 'No disponible'}</Text></Text>
                <Text style={styles.infoText}>Apellido: <Text style={styles.infoHighlight}>{user.apellido || 'No disponible'}</Text></Text>
                <Text style={styles.infoText}>Correo: <Text style={styles.infoHighlight}>{user.correo || 'No disponible'}</Text></Text>
                <Text style={styles.infoText}>Teléfono: <Text style={styles.infoHighlight}>{user.telefono || 'No disponible'}</Text></Text>
                <Text style={styles.infoText}>Estado: <Text style={styles.infoHighlight}>{user.estado || 'No disponible'}</Text></Text>
                <Text style={styles.infoText}>Tipo de usuario: <Text style={styles.infoHighlight}>{user.tipo_usuario || 'No disponible'}</Text></Text>
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
        backgroundColor: '#87CEEB',
        alignItems: 'center',
        paddingVertical: 50,
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
        marginTop: 20,
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