import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

const HistorialScreen = ({ navigation }) => {
    // Datos estáticos para probar (esto será reemplazado con datos de la base de datos)
    const historialData = [
        { id: "001", fecha: "25-11-24", hora: "15:53", monto: -220, rut: "12.345.678-9" },
        
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}></Text>
            <ScrollView style={styles.historialList}>
                {historialData.map((item, index) => (
                    <View key={index} style={styles.historialItem}>
                        <Text style={styles.itemText}>
                            <Text style={styles.boldText}>ID Pago: </Text>
                            {item.id}
                        </Text>
                        <Text style={styles.itemText}>
                            <Text style={styles.boldText}>Fecha: </Text>
                            {item.fecha}
                        </Text>
                        <Text style={styles.itemText}>
                            <Text style={styles.boldText}>Hora: </Text>
                            {item.hora}
                        </Text>
                        <Text
                            style={[
                                styles.itemText,
                                { color: item.monto > 0 ? "green" : "red" },
                            ]}
                        >
                            <Text style={styles.boldText}>Monto: </Text>
                            {item.monto > 0 ? `+${item.monto}` : item.monto}
                        </Text>
                        <Text style={styles.itemText}>
                            <Text style={styles.boldText}>RUT Chofer: </Text>
                            {item.rut}
                        </Text>
                    </View>
                ))}
            </ScrollView>
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
        backgroundColor: "#93C9FD", // Fondo azul claro
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
    },
    historialList: {
        flex: 1,
    },
    historialItem: {
        backgroundColor: "#FFFFFF", // Fondo blanco para cada registro
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
        backgroundColor: "#80B4F7", // Botón azul claro
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
