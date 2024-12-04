import React, { useEffect, useState, useContext } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { UserContext } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de instalar expo-linear-gradient

const HistorialScreen = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [historialData, setHistorialData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistorial = async () => {
        try {
            const response = await fetch("http://192.168.0.2:50587/historial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rut: user?.rut,
                    tipoUsuario: user?.tipo_usuario,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setHistorialData(data.historial);
        } catch (error) {
            console.error("Error al cargar el historial:", error.message);
            Alert.alert("Error", "No se pudo cargar el historial");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, []);

    return (
        <LinearGradient
            colors={['#D0E8FF', '#A0C8FF']} // Definir los colores del degradado
            style={styles.container}
        >
            <Text style={styles.title}>Historial de Transacciones</Text>
            {loading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : historialData.length === 0 ? (
                <Text style={styles.noDataText}>No hay transacciones disponibles</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.historialList}>
                    {historialData.map((item) => (
                        <View key={item.id} style={styles.historialItem}>
                            <Text style={styles.itemText}>
                                <Text style={styles.boldText}>ID Pago: </Text>
                                {item.id}
                            </Text>
                            <Text style={styles.itemText}>
                                <Text style={styles.boldText}>Fecha: </Text>
                                {new Date(item.fecha).toLocaleDateString()}
                            </Text>
                            <Text style={styles.itemText}>
                                <Text style={styles.boldText}>Hora: </Text>
                                {item.hora.split(".")[0]}
                            </Text>
                            <Text style={[styles.itemText, { color: item.color }]}>
                                <Text style={styles.boldText}>Monto: </Text>
                                {item.monto}
                            </Text>
                            <Text style={styles.itemText}>
                                <Text style={styles.boldText}>RUT Chofer: </Text>
                                {item.rut_chofer || item.rut_pasajero}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
        marginTop: 30, // Espacio adicional en la parte superior
    },
    historialList: {
        flexGrow: 1, // Asegura que el contenido del ScrollView ocupe todo el espacio disponible
        justifyContent: "flex-start", // Alinea los elementos al principio del ScrollView
        alignItems: "center", // Centra los elementos horizontalmente
    },
    historialItem: {
        backgroundColor: "#FFFFFF", // Fondo blanco
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#AAC4FF", // Borde azul claro
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Sombra en Android
        width: "89%", // Reduce el ancho del cuadro
    },
    itemText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
    },
    boldText: {
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#34c1ee", // Color del botón especificado
        padding: 10, // Reduce el tamaño del botón
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center", // Centra el botón horizontalmente
        marginTop: 10,
        width: "40%", // Tamaño ajustado del botón
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    loadingText: {
        textAlign: "center",
        fontSize: 18,
        color: "#555",
    },
    noDataText: {
        textAlign: "center",
        fontSize: 18,
        color: "#999",
    },
});

export default HistorialScreen;