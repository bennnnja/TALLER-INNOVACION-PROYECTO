import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    Alert,
} from 'react-native';

const Register = ({ navigation }) => {
    const [rut, setRut] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('Estudiante');
    const [modalVisible, setModalVisible] = useState(false);

    const tiposUsuario = ['Estudiante', 'Adulto', 'Adulto Mayor', 'Chofer'];

    const handleRegister = async () => {
        // Determinar estado según el tipo de usuario
        const estado = tipoUsuario === 'Adulto' ? 'Aceptado' : 'Pendiente';

        try {
            const response = await fetch('http://192.168.1.88:50587/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rut,
                    correo,
                    contrasena,
                    nombre,
                    apellido,
                    telefono,
                    tipo_usuario: tipoUsuario,
                    estado,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                Alert.alert('Éxito', data.message);
                navigation.navigate('SignUp'); // Redirigir a la pantalla de inicio de sesión
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <TextInput
                style={styles.input}
                placeholder="RUT"
                value={rut}
                onChangeText={setRut}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
            />
            <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Tipo de Usuario:</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownText}>{tipoUsuario}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={tiposUsuario}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setTipoUsuario(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.backButtonText}>Volver a Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
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
    label: {
        fontSize: 16,
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    dropdown: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 18,
        color: '#333',
    },
});

export default Register;