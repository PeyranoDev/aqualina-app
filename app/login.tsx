import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { authService, LoginCredentials } from '../lib/services/auth-service';
import { useAuth } from '@/lib/context/auth-context';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    Username: '',
    Password: '',
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    if (!credentials.Username || !credentials.Password) {
      Alert.alert('Error', 'Por favor ingrese email y contraseña');
      return;
    }

    setLoading(true);
    try {
      const success = await login(credentials);

      if (success) {
        router.replace('/');
      } else {
        Alert.alert('Error de inicio de sesión', 'Credenciales inválidas');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error de inicio de sesión', error.message);
      } else {
        Alert.alert('Error de inicio de sesión', 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://i.imgur.com/He6OT86.png' }} 
          style={styles.logo} 
        />
        <Text style={styles.title}>Torre Aqualina</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de Usuario"
          value={credentials.Username}
          onChangeText={(text) => setCredentials({ ...credentials, Username: text })}
          autoCapitalize="none"
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={credentials.Password}
          onChangeText={(text) => setCredentials({ ...credentials, Password: text })}
          secureTextEntry
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
