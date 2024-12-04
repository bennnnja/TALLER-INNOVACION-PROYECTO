import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { UserContext } from '../UserContext'; // Importa el contexto del usuario

const AgregarSaldo = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const { user, setUser } = useContext(UserContext); // Obtén el usuario actual del contexto

  const handleWebpay = async () => {
    if (!selectedAmount) {
      Alert.alert('Error', 'Por favor, selecciona un monto antes de continuar.');
      return;
    }

    try {
      console.log(`Monto seleccionado: ${selectedAmount}`);

      // Llamada al backend para actualizar el saldo y registrar la transacción
      const response = await axios.post('http://192.168.0.2:50587/add-saldo', {
        rutUsuario: user.rut,
        monto: selectedAmount,
      });

      // Actualizar el saldo en el contexto del usuario
      setUser((prevUser) => ({
        ...prevUser,
        saldo: prevUser.saldo + selectedAmount,
      }));

      Alert.alert('Éxito', `Saldo agregado exitosamente. Nuevo saldo: $${response.data.nuevoSaldo}`);
    } catch (error) {
      console.error('Error al agregar saldo:', error);
      Alert.alert('Error', 'No se pudo agregar el saldo. Intenta de nuevo más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AGREGAR SALDO</Text>

      <View style={styles.buttonContainer}>
        {[1000, 3000, 5000, 10000].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.amountButton, selectedAmount === amount && styles.selectedButton]}
            onPress={() => setSelectedAmount(amount)}
          >
            <Text style={styles.amountText}>${amount.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.webpayButton} onPress={handleWebpay}>
        <Image
          source={require('../assets/webpay.png')}
          style={styles.webpayImage}
        />
      </TouchableOpacity>

      
      <View style={styles.publicidadContainer}>
        <Image
          source={require('../assets/saledescuento.gif')} // Ruta al archivo GIF
          style={styles.publicidadImage}
          contentFit="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34c1ee',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
  amountButton: {
    backgroundColor: '#d1d1d1',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#34c1ee',
  },
  amountText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  webpayButton: {
    marginTop: 30,
  },
  webpayImage: {
    width: 250,
    height: 70,
    resizeMode: 'contain',
  },

  // Estilos del banner de publicidad
  publicidadContainer: {
    marginTop: 30,
    width: '100%',  // Ajustamos el tamaño del banner para hacerlo más pequeño
    alignItems: 'center',
    marginBottom: 15,  // Separación con el contenido de abajo
    borderRadius: 15, // Bordes redondeados para el contenedor
    overflow: 'hidden', // Asegura que el contenido no sobresalga
  },
  publicidadImage: {
    width: '100%',  // Ancho completo del contenedor, pero en proporción 4:3
    height: 'auto',  // Altura automática para mantener la proporción
    aspectRatio: 3 / 1,  
    resizeMode: 'contain',  // Mantiene la proporción de la imagen
  },
});

export default AgregarSaldo;
