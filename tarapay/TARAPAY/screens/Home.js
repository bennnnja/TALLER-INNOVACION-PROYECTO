import React, { useContext, useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { UserContext } from "../UserContext"; // Importar el contexto
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de instalar expo-linear-gradient

const Home = ({ navigation }) => {
    const { user } = useContext(UserContext); // Obtener datos del usuario desde el contexto
    const [ultimasTransacciones, setUltimasTransacciones] = useState([]); // Estado para las transacciones

    // Obtener las últimas transacciones
    useEffect(() => {
        const fetchTransacciones = async () => {
            if (user?.rut) {
                try {
                    const response = await axios.post("http://192.168.1.88:50587/historial", {
                        rut: user.rut,
                        tipoUsuario: user.tipo_usuario, // Considerar el tipo de usuario
                    });
        
                    setUltimasTransacciones(response.data.historial.slice(0, 6)); // Obtener las últimas 6 transacciones
                } catch (error) {
                    console.error("Error al cargar las transacciones:", error);
                }
            }
        };
        fetchTransacciones();
    }, [user?.rut]);

    // Renderizar el encabezado
    function renderHeader() {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity>
                    <Image source={icons.logout} style={styles.iconHeader} />
                </TouchableOpacity>
            </View>
        );
    }

    // Renderizar el perfil del usuario
    function renderUserProfile() {
        return (
            <View style={styles.userProfileContainer}>
                <Image source={require('../assets/icons/user.png')} style={styles.profileImage} />
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
        let mensaje = "Sin información del estado.";
        let tarifa = 0;
    
        if (user?.estado === "Pendiente") {
            mensaje = `Actualmente tu tarifa es $600. Recuerda que debes enviar tus documentos al correo ejemplo@gmail.com para que tu tarifa sea la de ${user?.tipo_usuario || "N/A"}`;
        } else if (user?.estado === "Aceptado") {
            tarifa = {
                Estudiante: 220,
                Adulto: 600,
                Adulto_mayor: 350,
            }[user?.tipo_usuario] || 0;
    
            mensaje = `Tu tipo de usuario es ${user?.tipo_usuario || "Desconocido"} y tu tarifa es $${tarifa}`;
        }
    
        return (
            <View style={styles.estadoUsuarioContainer}>
                <Text style={styles.estadoUsuarioText}>{mensaje}</Text>
            </View>
        );
    }
    

    // Renderizar historial con estilo mejorado
    function renderHistorialPublicidad() {
        return (
            <View style={styles.historialPublicidadContainer}>
                <View style={styles.historialContainer}>
                    <Text style={styles.historialText}>Últimas Transacciones</Text>
                    <ScrollView style={styles.historialList}>
                        {ultimasTransacciones.map((item) => (
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
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.verHistorialButton}
                        onPress={() => navigation.navigate("HistorialScreen")}
                    >
                        <Text style={styles.verHistorialText}>
                            Ver Historial Completo
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.publicidadContainer}>
                    <Image
                        source={images.promoBanner}
                        style={styles.publicidadImage}
                        resizeMode="cover"
                    />
                </View>
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
                    {renderEstadoUsuario()} {/* Aquí se renderiza el recuadro de estado */}
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
        paddingTop: 20,
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
    },
    historialContainer: {
        width: "50%",
        backgroundColor: "#d1f3ff",
        borderRadius: 10,
        padding: 10,
        height: 350,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
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
        backgroundColor: "#1E90FF",
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
        width: "45%",
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    publicidadImage: {
        width: "100%",
        height: 500,
        borderRadius: 10,
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
});

export default Home;