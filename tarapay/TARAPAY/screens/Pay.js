import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";

export default function PayScreen({ route, navigation }) {
  const { choferRut, monto, pasajeroRut } = route.params; // Datos pasados desde Scan.js o cualquier pantalla anterior
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Utilizamos el RUT del pasajero que viene desde los parámetros
      const response = await axios.post("http://192.168.1.109:50587/transaction", {
        choferRut,
        pasajeroRut, // Aquí usamos el RUT del pasajero real
      });

      const { message, transaccion } = response.data;
      Alert.alert("Pago", message);
      console.log("Detalles de la transacción:", transaccion);

      // Opcional: Regresar a la pantalla principal
      navigation.navigate("HomeTabs");
    } catch (error) {
      Alert.alert("Error", "No se pudo realizar el pago.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>RUT del Chofer: {choferRut}</Text>
      <Text>Monto a Pagar: {monto}</Text>
      <Button
        title={loading ? "Procesando..." : "Pagar"}
        onPress={handlePayment}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});