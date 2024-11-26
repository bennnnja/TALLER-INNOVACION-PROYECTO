import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const AgregarSaldo = () => {
  const handleWebpay = () => {
    // Aquí manejarás la integración con Webpay
    console.log('Botón Webpay presionado');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AGREGAR SALDO</Text>
      <TextInput 
        style={styles.input} 
        placeholder="$ INGRESE MONTO" 
        keyboardType="numeric" 
      />
      <TouchableOpacity style={styles.webpayButton} onPress={handleWebpay}>
        <Image 
      source={require('../assets/webpay.png')} // Ruta correcta desde la ubicación de AgregarSaldo.js
      style={styles.webpayImage} 
  />
      </TouchableOpacity>
      {/* Footer con navegación */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>💰</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    width: '80%',
    height: 50,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  webpayButton: {
    marginBottom: 30,
  },
  webpayImage: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
    position: 'absolute',
    bottom: 0,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
    color: '#0055AA',
  },
});

export default AgregarSaldo;
