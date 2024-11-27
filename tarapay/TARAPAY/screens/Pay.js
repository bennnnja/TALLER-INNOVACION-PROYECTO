import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, Image, StyleSheet } from "react-native";
import axios from "axios";

export default function PayScreen({ route, navigation }) {
  const { choferRut, monto, pasajeroRut } = route.params; // Datos pasados desde Scan.js
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos la obtención de detalles de la transacción
    const fetchTransactionDetails = async () => {
      try {
        // Aquí puedes hacer una llamada al backend para obtener la información de la transacción
        const response = await axios.get(`http://192.168.1.109:50587/transaction/details?rutPasajero=${pasajeroRut}&rutChofer=${choferRut}`);
        setTransactionDetails(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la transacción:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [choferRut, pasajeroRut]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pago Aceptado</Text>
      </View>
      <Image
        source={require('../assets/ticketVerde.gif')} // Asegúrate de que la ruta de la imagen sea correcta
        style={styles.ticketImage}
      />
      {transactionDetails && (
        <View style={styles.detailsContainer}>
          <Text>Fecha: {transactionDetails.fecha}</Text>
          <Text>Hora: {transactionDetails.hora}</Text>
          <Text>Monto: ${monto}</Text>
          <Text>RUT Chofer: {choferRut}</Text>
          <Text>RUT Pasajero: {pasajeroRut}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo celeste
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Color del texto
  },
  ticketImage: {
    width: 200, // Ajusta el tamaño según lo necesites
    height: 200,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});