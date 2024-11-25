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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [passengerType, setPassengerType] = useState('Estudiante');
    const [modalVisible, setModalVisible] = useState(false);

    const passengerTypes = ['Estudiante', 'Adulto', 'Adulto Mayor'];

    const handleRegister = async () => {
        try {
            const response = await fetch('http://192.168.1.102:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rut,
                    email,
                    password,
                    name,
                    lastName,
                    phoneNumber,
                    passengerType,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                Alert.alert('Éxito', data.message);
                navigation.navigate('SignUp'); // Redirige a la pantalla de inicio de sesión
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Tipo de Pasajero:</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownText}>{passengerType}</Text>
            </TouchableOpacity>

            {/* Modal para la selección */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={passengerTypes}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setPassengerType(item);
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
