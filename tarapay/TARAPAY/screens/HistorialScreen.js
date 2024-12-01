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

const HistorialScreen = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [historialData, setHistorialData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistorial = async () => {
        console.log("Iniciando fetchHistorial...");
        try {
            const response = await fetch("http://192.168.1.176:50587/historial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rut: user?.rut,
                    tipoUsuario: user?.tipo_usuario, // Enviar también el tipo de usuario
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
            setLoading(false); // Detiene el indicador de carga
        }
    };
    
    
    useEffect(() => {
        fetchHistorial();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Historial de Transacciones</Text>
            {loading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : historialData.length === 0 ? (
                <Text style={styles.noDataText}>No hay transacciones disponibles</Text>
            ) : (
                <ScrollView style={styles.historialList}>
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
                            <Text
                                style={[
                                    styles.itemText,
                                    { color: item.color }, // Color asignado desde el servidor
                                ]}
                            >
                                <Text style={styles.boldText}>Monto: </Text>
                                {item.monto} {/* Monto con signo "+" o "-" */}
                            </Text>
                            <Text style={styles.itemText}>
                                <Text style={styles.boldText}>RUT Chofer: </Text>
                                {item.rut_chofer || item.rut_pasajero} {/* Mostrar el rut relevante */}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#93C9FD",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
    },
    loadingText: {
        fontSize: 18,
        color: "#000",
        textAlign: "center",
    },
    noDataText: {
        textAlign: "center",
        fontSize: 18,
        color: "#000",
    },
    historialList: {
        flex: 1,
    },
    historialItem: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    itemText: {
        fontSize: 16,
        color: "#000",
        marginBottom: 5,
    },
    boldText: {
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#80B4F7",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default HistorialScreen;
