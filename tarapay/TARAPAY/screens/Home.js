import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { UserContext } from "../UserContext";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native"; // Para actualizar al volver

const Home = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [ultimasTransacciones, setUltimasTransacciones] = useState([]);

    // Función para obtener las transacciones
    const fetchTransacciones = async () => {
        if (user?.rut) {
            try {
                const response = await axios.post("http://192.168.1.91:50587/historial", {
                    rut: user.rut,
                    tipoUsuario: user.tipo_usuario,
                });

                if (response.status === 200 && response.data.historial) {
                    setUltimasTransacciones(response.data.historial.slice(0, 6));
                } else {
                    setUltimasTransacciones([]);
                }
            } catch (error) {
                console.error("Error al cargar las transacciones:", error.message);
            }
        }
    };

    // Actualizar historial al regresar a Home
    useFocusEffect(
        useCallback(() => {
            fetchTransacciones();
        }, [user?.rut])
    );

    // Renderizar el perfil del usuario
    function renderUserProfile() {
        return (
            <View style={styles.userProfileContainer}>
                <Image source={require("../assets/icons/user.png")} style={styles.profileImage} />
                <Text style={styles.userName}>
                    {user?.nombre || "Usuario"} {user?.apellido || ""}
                </Text>
            </View>
        );
    }

    // Renderizar saldo con el botón de billetera
    function renderSaldo() {
        return (
            <View style={styles.saldoContainer}>
                <Text style={styles.saldoText}>SALDO</Text>
                <View style={styles.saldoRow}>
                    <Text style={styles.saldoAmount}>${user?.saldo ?? 0}</Text>
                    <TouchableOpacity
                        style={styles.walletButton}
                        onPress={() => navigation.navigate("AgregarSaldo")}
                    >
                        <Image source={icons.wallet} style={styles.walletIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Renderizar el recuadro de estado del usuario
    function renderEstadoUsuario() {
        const tarifa = {
            Estudiante: 220,
            Adulto: 600,
            Adulto_mayor: 350,
            Chofer: 600,
        };

        return (
            <View style={styles.estadoUsuarioContainer}>
                {user?.estado === "Pendiente" ? (
                    <Text style={styles.estadoUsuarioText}>
                        Actualmente tu tarifa es $600. Recuerda que debes enviar tus documentos al correo 
                        ejemplo@gmail.com para que tu tarifa sea la de {user?.tipo_usuario || "N/A"}.
                    </Text>
                ) : user?.estado === "Aceptado" ? (
                    <Text style={styles.estadoUsuarioText}>
                        Tu tipo de usuario es {user?.tipo_usuario || "Desconocido"} y tu tarifa es 
                        ${tarifa[user?.tipo_usuario] || 0}.
                    </Text>
                ) : (
                    <Text style={styles.estadoUsuarioText}>Sin información del estado.</Text>
                )}
            </View>
        );
    }

    // Renderizar historial
    function renderHistorialPublicidad() {
        return (
            <View style={styles.historialPublicidadContainer}>
                <View style={styles.historialContainer}>
                    <Text style={styles.historialText}>Últimas Transacciones</Text>
                    <ScrollView style={styles.historialList}>
                        {ultimasTransacciones.length > 0 ? (
                            ultimasTransacciones.map((item) => (
                                <View key={item.id} style={styles.historialItem}>
                                    <Text style={styles.historialItemText}>
                                        <Text style={styles.boldText}>Fecha: </Text>
                                        {item.fecha ? new Date(item.fecha).toLocaleDateString() : "N/A"} -{" "}
                                        <Text style={styles.boldText}>Hora: </Text>
                                        {item.hora ? item.hora.split(".")[0] : "N/A"}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.historialItemText,
                                            { color: item.monto > 0 ? "green" : "red" },
                                        ]}
                                    >
                                        <Text style={styles.boldText}>Monto: </Text>
                                        {item.monto != null ? `${item.monto}` : "N/A"}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noTransactionsText}>No tienes transacciones.</Text>
                        )}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.verHistorialButton}
                        onPress={() => navigation.navigate("HistorialScreen")}
                    >
                        <Text style={styles.verHistorialText}>Ver Historial Completo</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.publicidadContainer}>
                    <Image
                        source={require("../assets/bannerHamb.gif")}
                        style={styles.publicidadImage}
                        contentFit="cover"
                    />
                </View>
            </View>
        );
    }
    function renderUserProfile() {
        return (
            <View style={styles.userProfileContainer}>
                <Image source={require('../assets/icons/user.png')} style={styles.profileImage} />
                <Text style={styles.userName}>{user?.nombre} {user?.apellido}</Text>
    
                {/* Agregar el logo en la parte superior derecha */}
                <Image source={require('../assets/logoTarapay.png')} style={styles.logo} />
            </View>
        );
    }
    

    // Renderizar el menú inferior
    function renderMenu() {
        return (
            <View style={styles.menuContainer}>
                <TouchableOpacity>
                    <Image source={icons.home} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={icons.wallet} style={styles.menuIcon} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#34c1ee', '#ffffff']} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.contentContainer}>
                    {renderUserProfile()}
                    {renderSaldo()}
                    {renderEstadoUsuario()}
                    {renderHistorialPublicidad()}
                </View>
                {renderMenu()}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    iconHeader: {
        width: 40,
        height: 40,
        tintColor: "#000",
        
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: "flex-start", // Cambiado a alineación a la izquierda
    },
    userProfileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginLeft: 7,
        marginRight: 7, // Espacio entre la imagen y el nombre
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    saldoContainer: {
        width: "100%",
        backgroundColor: "#d1f3ff",
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    saldoText: {
        fontSize: 22,
        color: "#000",
        textAlign: "center",
        fontWeight: "bold"
    },
    saldoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    saldoAmount: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#000",
    },
    walletButton: {
        width: 40,
        height: 40,
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    walletIcon: {
        width: 25,
        height: 25,
        tintColor: "#000",
    },
    estadoUsuarioContainer: {
        width: "100%",
        backgroundColor: "#f0f8ff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    estadoUsuarioText: {
        fontSize: 16,
        color: "#000",
        textAlign: "center",
    },
    historialPublicidadContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
        shadowColor: "#000", // Sombra para darle un efecto de profundidad
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Sombra en Android
    },
    historialContainer: {
        width: "50%",
        backgroundColor: "#d1f3ff",
        borderRadius: 10,
        padding: 10,
        height: 350,
        marginRight: 10,
    },
    historialText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    historialList: {
        flex: 1,
    },
    historialItem: {
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    historialItemText: {
        fontSize: 16,
        color: "#000",
    },
    boldText: {
        fontWeight: "bold",
    },
    verHistorialButton: {
        backgroundColor: "#34c1ee",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    verHistorialText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    publicidadContainer: {
        width: "50%",
        height: 400, // Define una altura para que el GIF no se expanda demasiado
        justifyContent: "center", // Centra el GIF verticalmente
        alignItems: "center", // Centra el GIF horizontalmente
        borderRadius: 10, // Bordes redondeados para el contenedor
        overflow: 'hidden', // Asegura que el contenido no sobresalga
    },
    
    publicidadImage: {
        width: "100%",
        height: 380,
        borderRadius: 10,
        marginBottom: 120,
    },
    menuContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#80B4F7",
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    menuIcon: {
        width: 25,
        height: 25,
        tintColor: "#FFFFFF",
    },
    
    userProfileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        position: 'relative', // Permite posicionar el logo
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginLeft: 7,
        marginRight: 7, // Espacio entre la imagen y el nombre
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    logo: {
        position: 'absolute', // Permite posicionar el logo
        top: -15, // Lo coloca en la parte superior
        right: -190, // Lo coloca al extremo derecho
        width: 50, // Ajusta el tamaño del logo
        height: 50,
        borderRadius: 25, // Redondea el logo si es necesario
    },
});

export default Home;