import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Keyboard,
  Animated,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/lib/context/auth-context';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({
    Username: '',
    Password: ''
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (evt) => {
      const keyboardHeight = evt.endCoordinates.height;
      const toValue = -(keyboardHeight - 300);
      Animated.timing(shift, {
        toValue,
        duration: 300,
        useNativeDriver: true
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [shift]);

  const handleLogin = async () => {
    if (!credentials.Username || !credentials.Password) {
      Alert.alert('Error', 'Por favor ingrese usuario y contraseña');
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.innerContainer, { transform: [{ translateY: shift }] }]}>
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
              placeholderTextColor="#888"
              value={credentials.Username}
              onChangeText={(text) => setCredentials({ ...credentials, Username: text })}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              value={credentials.Password}
              onChangeText={(text) => setCredentials({ ...credentials, Password: text })}
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={handleLogin}
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
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start'
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    textAlign: 'center'
  },
  formContainer: {
    width: '100%',
    paddingBottom: 40
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#000',
    fontSize: 16
  },
  button: {
    backgroundColor: '#0066cc',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
