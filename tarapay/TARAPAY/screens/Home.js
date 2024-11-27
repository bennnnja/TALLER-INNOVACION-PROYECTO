import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";

const Home = ( {navigation}) => {
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

    // Renderizar saldo con el botón de billetera
    function renderSaldo() {
        return (
            <View style={styles.saldoContainer}>
                <Text style={styles.saldoText}>SALDO</Text>
                <View style={styles.saldoRow}>
                    <Text style={styles.saldoAmount}>$$$$$</Text>
                    <TouchableOpacity
                        style={styles.walletButton}
                        onPress={() => navigation.navigate("AgregarSaldo")} // Redirección a AgregarSaldo
                    >
                        <Image
                            source={icons.wallet}
                            style={styles.walletIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    

    // Renderizar historial y publicidad
    function renderHistorialPublicidad() {
        return (
            <View style={styles.historialPublicidadContainer}>
                {/* Historial */}
                <TouchableOpacity
                    style={styles.historialContainer}
                    onPress={() => navigation.navigate("HistorialScreen")}
                >
                    <Text style={styles.historialText}>Ultimos Viajes</Text>
                    <ScrollView style={styles.historialList}>
                        {[...Array(6)].map((_, index) => (
                            <View key={index} style={styles.historialItem}>
                                <Text style={styles.historialItemText}>
                                    Item {index + 1}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </TouchableOpacity>
                {/* Publicidad */}
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
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={styles.contentContainer}>
                {renderSaldo()}
                {renderHistorialPublicidad()}
            </View>
            {renderMenu()}
        </SafeAreaView>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#93C9FD", // Color de fondo
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
        tintColor: "#000", // Color de los iconos
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: "center",
    },
    saldoContainer: {
        width: "100%",
        backgroundColor: "#D6EFFF", // Color del fondo de saldo
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,
    },
    saldoText: {
        fontSize: 22,
        color: "#000", // Color del texto
        textAlign: "center",
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
        color: "#000", // Color del monto
    },
    walletButton: {
        width: 50,
        height: 50,
        backgroundColor: "#FFFFFF", // Fondo blanco para el botón
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20, // Separación del monto
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    walletIcon: {
        width: 30,
        height: 30,
        tintColor: "#000", // Color del icono de billetera
    },
    historialPublicidadContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
    },
    historialContainer: {
        width: "50%", // Mismo tamaño horizontal que la publicidad
        backgroundColor: "#C8E3FF", // Fondo del historial
        borderRadius: 10,
        padding: 10,
        height: 350, // Altura extendida del historial
        marginRight: 10, // Espacio entre historial y publicidad
    },
    historialText: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    historialList: {
        flex: 1,
    },
    historialItem: {
        backgroundColor: "#FFFFFF", // Fondo de los elementos del historial
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    historialItemText: {
        fontSize: 16,
        color: "#000", // Color del texto
    },
    publicidadContainer: {
        width: "45%", // Mismo tamaño horizontal que el historial
        marginLeft: 10, // Espaciado adicional para mantener separación
    },
    publicidadImage: {
        width: "100%",
        height: 500, // Altura extendida de la publicidad
        borderRadius: 10,
    },
    menuContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#80B4F7", // Fondo del menú
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    menuIcon: {
        width: 25,
        height: 25,
        tintColor: "#FFFFFF", // Color de los iconos del menú
    },
});

export default Home;