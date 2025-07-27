import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Unauthorized() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso no autorizado</Text>
      <Text style={styles.message}>
        No tienes permiso para acceder a esta sección. 
        Por favor, contacta al administrador del sistema.
      </Text>
      
      <Link href="/" asChild>
        <Button title="Volver al inicio" color="#0066cc" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#e74c3c',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#7f8c8d',
    lineHeight: 24,
  },
});