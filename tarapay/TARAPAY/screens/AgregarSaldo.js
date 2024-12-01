import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const AgregarSaldo = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleWebpay = () => {
    if (selectedAmount) {
      console.log(`Monto seleccionado: ${selectedAmount}`);
      // Aquí puedes implementar la lógica para enviar el monto seleccionado a Webpay
    } else {
      console.log('Por favor, selecciona un monto antes de continuar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AGREGAR SALDO</Text>
      <View style={styles.buttonContainer}>
        {[1000, 3000, 5000, 10000].map(amount => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.amountButton,
              selectedAmount === amount && styles.selectedButton
            ]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0055AA',
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
    backgroundColor: '#0055AA',
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
    width: 250, // Tamaño ajustado de la imagen
    height: 70, // Altura ajustada de la imagen
    resizeMode: 'contain', // Escala proporcional a la imagen
  },
});

export default AgregarSaldo;
