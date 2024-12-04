import React, { useEffect, useState, useContext } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { UserContext } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';

const HistorialScreen = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [historialData, setHistorialData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistorial = async () => {
        try {
            const response = await fetch("http://192.168.1.109:50587/historial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rut: user?.rut,
                    tipoUsuario: user?.tipo_usuario,
                }),
            });

            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                // Manejar el caso específico de 404
                if (response.status === 404) {
                    setHistorialData([]); // No hay historial
                } else {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                setHistorialData(data.historial || []); // Asegurarse de que sea un array
            }
        } catch (error) {
            console.error("Error al cargar el historial:", error.message);
            setHistorialData([]); // Asegurarse de que no haya datos si hay un error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, []);

    return (
        <LinearGradient
            colors={['#edfbff', '#a9eaff']}
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
        marginTop: 30,
    },
    historialList: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    historialItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#AAC4FF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: "89%",
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
        backgroundColor: "#34c1ee",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 10,
        width: "40%",
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