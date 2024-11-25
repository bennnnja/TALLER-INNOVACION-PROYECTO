import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as Linking from 'expo-linking';  // Importa Linking

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned) {  // Verifica que solo se procese si no ha sido escaneado
      setScanned(true);
      console.log(`Scanned URL: ${data}`);  // Muestra el URL en la consola
      alert(`Scanned URL: ${data}`);  // Muestra el URL en una alerta
      Linking.openURL(data).catch(err => console.error("Failed to open URL:", err));  // Redirige al URL escaneado
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
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
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