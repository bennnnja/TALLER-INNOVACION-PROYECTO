import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, Animated,TouchableOpacity } from "react-native";
import { UserContext } from "../UserContext"; // Asegúrate de que UserContext esté definido
import axios from "axios";

export default function PayScreen({ navigation }) {
  const { user } = useContext(UserContext); // Obtén el usuario actual del contexto
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Valor inicial para la animación

  useEffect(() => {
    const fetchLastTransaction = async () => {
      try {
        const response = await axios.post("http://192.168.1.176:50587/historial", {
          rutPasajero: user?.rut,
        });
        if (response.data.historial.length > 0) {
          const lastTransaction = response.data.historial[0]; // Obtén la última transacción
          setTransactionDetails(lastTransaction);
        } else {
          setError("No hay transacciones disponibles.");
        }
      } catch (error) {
        console.error("Error al obtener la última transacción:", error.message);
        setError("No se pudo obtener la última transacción.");
      } finally {
        setLoading(false);
      }
    };
    fetchLastTransaction();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      // Iniciar animación de desvanecimiento
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/ticketVerde.gif')}
        style={styles.ticketImage}
      />
      <Animated.View style={{ ...styles.fadeContainer, opacity: fadeAnim }}>
        <View style={styles.header}>
          <Text style={styles.title}>Pago Aceptado</Text>
        </View>
        {transactionDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Fecha: {new Date(transactionDetails.fecha).toLocaleDateString()}</Text>
            <Text style={styles.detailText}>Hora: {transactionDetails.hora.split(".")[0]}</Text>
            <Text style={styles.detailText}>Monto: ${transactionDetails.monto}</Text>
            <Text style={styles.detailText}>RUT Chofer: {transactionDetails.rut_chofer}</Text>
            <Text style={styles.detailText}>RUT Pasajero: {user?.rut}</Text>
          </View>
        )}
      </Animated.View>
      <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32, // Aumentar tamaño del título
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Montserrat-Bold', // Asegúrate de que la fuente esté disponible
  },
  ticketImage: {
    width: 400,
    height: 400,
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
  detailText: {
    fontSize: 20, // Aumentar tamaño del texto de los detalles
    color: '#000',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  fadeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});