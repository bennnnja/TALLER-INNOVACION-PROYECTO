import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function ScanScreen({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { rutPasajero, tipoUsuario } = route.params; // Datos del usuario logueado

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true);

      try {
        // Simula que el QR contiene el RUT del chofer
        const rutChofer = data;

        // Enviar datos al backend
        const response = await axios.post("http://192.168.1.109:50587/transaction", {
          rutPasajero,
          rutChofer,
          tipoUsuario,
        });

        Alert.alert("Éxito", `Pago realizado. Monto: $${response.data.tarifa}`);

        // Navegar a la pantalla de pago, pasando el RUT del pasajero, el RUT del chofer y el monto
        navigation.navigate("PayScreen", {
          choferRut: rutChofer,
          monto: response.data.tarifa,
          pasajeroRut: rutPasajero, // Pasamos el RUT del pasajero aquí
        });
      } catch (error) {
        console.error("Error en la transacción:", error);
        Alert.alert("Error", error.response?.data?.message || "Error al procesar la transacción");
      } finally {
        setScanned(false);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
