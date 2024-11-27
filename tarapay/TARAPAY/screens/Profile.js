import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { UserContext } from '../UserContext';
import { Defs, LinearGradient,RadialGradient, Stop } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Profile = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [qrCodeVisible, setQrCodeVisible] = useState(false);
    const qrSvgRef = React.useRef();

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignUp' }],
        });
    };

    const handleGenerateQRCode = async () => {
        if (user.tipo_usuario === "Chofer") {
            setQrCodeVisible(true);
        } else {
            Alert.alert('Error', 'No se pudo generar el código QR. RUT del chofer no disponible.');
        }
    };

    const handleShareQRCode = async () => {
        if (qrSvgRef.current) {
            qrSvgRef.current.toDataURL(async (data) => {
                try {
                    const fileUri = FileSystem.documentDirectory + 'qr_code.png';
                    await FileSystem.writeAsStringAsync(fileUri, data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(fileUri);
                        Alert.alert('Éxito', 'Código QR compartido exitosamente.');
                    } else {
                        Alert.alert('Error', 'El uso compartido no está disponible en este dispositivo.');
                    }
                } catch (error) {
                    console.error('Error compartiendo QR:', error);
                    Alert.alert('Error', 'No se pudo guardar el código QR: ' + error.message);
                }
            });
        } else {
            Alert.alert('Error', 'Referencia al QR no encontrada.');
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Cargando datos del usuario...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 100 }]}>
                <View style={styles.profileHeader}>
                    <Image source={require('../assets/icons/user.png')} style={styles.photo} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Nombre: <Text style={styles.infoHighlight}>{user.nombre || 'No disponible'}</Text></Text>
                    <Text style={styles.infoText}>Apellido: <Text style={styles.infoHighlight}>{user.apellido || 'No disponible'}</Text></Text>
                    <Text style={styles.infoText}>Correo: <Text style={styles.infoHighlight}>{user.correo || 'No disponible'}</Text></Text>
                    <Text style={styles.infoText}>Teléfono: <Text style={styles.infoHighlight}>{user.telefono || 'No disponible'}</Text></Text>
                    <Text style={styles.infoText}>Estado: <Text style={styles.infoHighlight}>{user.estado || 'No disponible'}</Text></Text>
                    <Text style={styles.infoText}>Tipo de usuario: <Text style={styles.infoHighlight}>{user.tipo_usuario || 'No disponible'}</Text></Text>
                </View>
                {user.tipo_usuario === "Chofer" && (
                    <TouchableOpacity style={styles.logoutButton} onPress={handleGenerateQRCode}>
                        <Text style={styles.logoutText}>Generar Código QR</Text>
                    </TouchableOpacity>
                )}
                {qrCodeVisible && user.rut && (
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={user.rut}
                            size={200}
                            getRef={qrSvgRef}
                            color="url(#grad)" // Aquí referenciamos el degradado que definiremos
                        >
                            <Defs>
                            <RadialGradient id="radialGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <Stop offset="0%" stopColor="#7de7da" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#4b8ae1" stopOpacity="1" />
                            </RadialGradient>
                            </Defs>
                        </QRCode>
                        <Text style={styles.qrText}>RUT del QR: {user.rut}</Text>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleShareQRCode}>
                            <Text style={styles.logoutText}>Guardar y Compartir QR</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
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
        marginBottom: 20,
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
    qrContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    qrText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
    },
});

export default Profile;