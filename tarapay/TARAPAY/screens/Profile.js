import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { UserContext } from '../UserContext';
import { Defs, RadialGradient, Stop } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';  // Importa LinearGradient

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
        <LinearGradient colors={['#34c1ee', '#ffffff']} style={styles.container}> {/* Fondo degradado */}
            <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 100 }]}>
                {/* Cabecera de perfil con imagen y fondo */}
                <View style={styles.profileHeader}>
                    <View style={styles.profileBackground}></View>
                    <Image source={require('../assets/icons/user.png')} style={styles.photo} />
                </View>

                {/* Información del usuario */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nombre:</Text>
                        <Text style={styles.infoValue}>{user.nombre || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Apellido:</Text>
                        <Text style={styles.infoValue}>{user.apellido || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Correo:</Text>
                        <Text style={styles.infoValue}>{user.correo || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>{user.telefono || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Estado:</Text>
                        <Text style={styles.infoValue}>{user.estado || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tipo de usuario:</Text>
                        <Text style={styles.infoValue}>{user.tipo_usuario || 'No disponible'}</Text>
                    </View>
                </View>

                {/* Botones: Generar QR y Cerrar sesión */}
                {user.tipo_usuario === "Chofer" && (
                    <TouchableOpacity style={styles.button} onPress={handleGenerateQRCode}>
                        <Text style={styles.buttonText}>Generar Código QR</Text>
                    </TouchableOpacity>
                )}
                {qrCodeVisible && user.rut && (
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={user.rut}
                            size={200}
                            getRef={qrSvgRef}
                            color="url(#grad)" // Referencia al gradiente que definiremos
                        >
                            <Defs>
                                <RadialGradient id="radialGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <Stop offset="0%" stopColor="#7de7da" stopOpacity="1" />
                                    <Stop offset="100%" stopColor="#4b8ae1" stopOpacity="1" />
                                </RadialGradient>
                            </Defs>
                        </QRCode>
                        <Text style={styles.qrText}>RUT del QR: {user.rut}</Text>
                        <TouchableOpacity style={styles.button} onPress={handleShareQRCode}>
                            <Text style={styles.buttonText}>Guardar y Compartir QR</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
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
    },
    profileHeader: {
        width: '100%',
        height: 250,
        position: 'relative',
        top: -20,
    },
    profileBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 80,
        backgroundColor: '#FFF',
        borderWidth: 0,
        borderColor: '#FFF',
        position: 'absolute',
        top: 70,
        left: '47%',
        transform: [{ translateX: -60 }],
    },
    infoContainer: {
        width: '90%',
        padding: 20,
        marginTop: 40,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',  // Alinea los elementos verticalmente
        justifyContent: 'space-between',
        marginBottom: 10,  // Espacio entre filas
        borderWidth: 1,  // Borde del cuadro
        borderColor: '#ccc',  // Color del borde
        borderRadius: 5,  // Esquinas redondeadas
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff', // Fondo blanco para cada cuadro
    },
    infoLabel: {
        fontSize: 16,
        color: '#333',
        flex: 1,  // La etiqueta ocupa el 50% del espacio
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,  // El valor ocupa el otro 50%
        textAlign: 'right',  // Alineamos el valor a la derecha
    },
    button: {
        backgroundColor: '#34c1ee',
        borderRadius: 5,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    qrText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
    },
});

export default Profile;
