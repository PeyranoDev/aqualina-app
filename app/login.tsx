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
  TouchableWithoutFeedback,
  BackHandler 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router'; // 1. Importamos el hook para recibir parámetros
import { useAuth } from '@/lib/context/auth-context';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({
    Username: '',
    Password: '',
  });
  
  // 2. Obtenemos los parámetros de la torre desde la navegación
  const { towerName, towerId } = useLocalSearchParams<{ towerName: string, towerId: string }>();
  
  const { signIn, clearSelectedTower } = useAuth();
  const [loading, setLoading] = useState(false);
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backAction = () => {
      clearSelectedTower();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

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
    if (!towerId) { // Verificamos el towerId que viene por parámetro
      Alert.alert('Error', 'No se ha seleccionado ninguna torre. Vuelva atrás para seleccionar una.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ 
        ...credentials, 
        SelectedTowerId: parseInt(towerId, 10)
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error de inicio de sesión', error.message);
      } else {
        Alert.alert('Error de inicio de sesión', 'Ocurrió un error desconocido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.innerContainer, { transform: [{ translateY: shift }] }]}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://i.imgur.com/He6OT86.png' }}
              style={styles.logo}
            />
            {/* 3. Usamos el towerName del parámetro para evitar el parpadeo */}
            <Text style={styles.title}>{towerName || 'Aqualina'}</Text>
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
            <Text style={styles.swipeInfo}>Usa el gesto de "atrás" para cambiar de torre</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
      </View>
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
  },
  swipeInfo: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 14,
  }
});
