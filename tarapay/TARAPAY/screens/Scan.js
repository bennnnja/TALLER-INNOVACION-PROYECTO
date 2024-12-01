import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";  // Usamos CameraView para la versión que estás utilizando
import { UserContext } from "../UserContext"; // Importa el contexto
import axios from "axios";

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { user } = useContext(UserContext); // Obtenemos los datos del usuario desde el contexto

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Estado del permiso de la cámara:", status);  // Verifica el estado del permiso
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    console.log("QR Escaneado:", data); // Verifica si el QR se escanea correctamente

    if (!scanned) {
      setScanned(true);

      try {
        const rutChofer = data; // El código QR contiene el RUT del chofer
        console.log("RUT del chofer escaneado: ", rutChofer);
        
        // Validar que el usuario logueado tiene un RUT
        if (!user || !user.rut) {
            Alert.alert("Error", "El usuario no tiene un RUT válido.");
            setScanned(false);
            return; // Salir si el usuario no tiene un RUT
        }

       /* console.log("Datos enviados al backend:", {
          rutPasajero: user.rut,
          rutChofer,
          tipoUsuario: user.tipo_usuario,
      }); */
        // Enviar datos al backend
        
        const response = await axios.post("http://192.168.1.176:50587/transaction", {
            rutPasajero: user.rut, // Usamos el RUT del pasajero desde el contexto
            rutChofer,
            tipoUsuario: user.tipo_usuario, // También obtenemos el tipo de usuario desde el contexto
        });
        console.log("Respuesta del backend: ", response.data); // Verifica la respuesta del backend
        Alert.alert("Éxito", `Pago realizado. Monto: $${response.data.tarifa}`);
       
        // Navegar a la pantalla de pago, pasando los datos relevantes
        navigation.navigate("Pay", {
            choferRut: rutChofer,
            monto: response.data.tarifa,
            pasajeroRut: user.rut,
        });
    } catch (error) {
        console.error("Error en la transacción:", error);
        Alert.alert("Pago Rechazado", error.response?.data?.message || "Error al procesar la transacción");
    } finally {
        setScanned(false);
    }
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para usar la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No tienes acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeScannerSettings={{
          barCodeTypes: ["qr", "pdf417"], // Asegúrate de que el tipo de código esté configurado correctamente
        }}
      />
      {scanned && <Button title={"Presiona para escanear de nuevo"} onPress={() => setScanned(false)} />}
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